"""
The one thing this service exists to do: call Claude with the persona
instructions marked as a cache breakpoint, and retry on transient failures
instead of letting a customer's email vanish silently.

Uses a raw httpx call to OpenRouter's chat-completions endpoint rather than
an SDK - same pattern already proven working in this codebase by
supabase/functions/refine-reply/index.ts. cache_control is an
Anthropic-specific field with no first-class support in generic
OpenAI-compatible SDKs, so a raw request body gives direct, visible control
over exactly what's being sent.
"""

import asyncio
import logging
import os
from dataclasses import dataclass

import httpx

logger = logging.getLogger("ai_service.claude_client")

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "anthropic/claude-sonnet-5"
MAX_ATTEMPTS = 3
RETRY_BACKOFF_SECONDS = 2
REQUEST_TIMEOUT_SECONDS = 30.0


class GenerationFailedError(Exception):
    """Raised when generation could not produce a reply after retries, or
    was rejected outright (bad request, auth, etc). Callers should surface
    this as a clear failure - never swallow it - so a failed generation is
    visible instead of the ticket just disappearing."""


@dataclass
class GenerationResult:
    reply_text: str
    cache_read_tokens: int | None
    cache_write_tokens: int | None
    raw_usage: dict


async def call_openrouter_chat(messages: list[dict]) -> GenerationResult:
    """Shared retry/error-handling core for calling OpenRouter's chat-completions
    endpoint. Callers build their own `messages` (with or without cache_control
    blocks) - this only owns the HTTP call, retry-on-transient-failure loop, and
    response parsing, so /generate-reply's persona-caching shape and the
    consolidation endpoint's plain one-off prompt can both use it without
    duplicating the retry logic."""
    api_key = os.environ["OPENROUTER_API_KEY"]
    body = {"model": MODEL, "messages": messages}
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    last_error: Exception | None = None
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        for attempt in range(1, MAX_ATTEMPTS + 1):
            try:
                resp = await client.post(OPENROUTER_URL, headers=headers, json=body)
            except httpx.TransportError as exc:
                last_error = exc
                logger.warning(
                    "generation attempt %s/%s: network error: %s", attempt, MAX_ATTEMPTS, exc
                )
                if attempt < MAX_ATTEMPTS:
                    await asyncio.sleep(RETRY_BACKOFF_SECONDS * attempt)
                continue

            if 500 <= resp.status_code < 600:
                last_error = RuntimeError(f"upstream {resp.status_code}: {resp.text[:300]}")
                logger.warning(
                    "generation attempt %s/%s: upstream %s, retrying",
                    attempt,
                    MAX_ATTEMPTS,
                    resp.status_code,
                )
                if attempt < MAX_ATTEMPTS:
                    await asyncio.sleep(RETRY_BACKOFF_SECONDS * attempt)
                continue

            if resp.status_code >= 400:
                # Client-side error (bad key, malformed request, etc) - won't
                # succeed on retry, fail immediately with the detail visible.
                raise GenerationFailedError(
                    f"OpenRouter rejected the request: {resp.status_code} {resp.text[:300]}"
                )

            data = resp.json()
            reply_text = (data.get("choices") or [{}])[0].get("message", {}).get("content", "").strip()
            if not reply_text:
                raise GenerationFailedError("model returned empty content")

            usage = data.get("usage", {})
            # OpenRouter nests cache stats OpenAI-style, not under Anthropic's
            # native flat field names (cache_read_input_tokens / etc) -
            # confirmed by inspecting a real response, not assumed.
            prompt_details = usage.get("prompt_tokens_details", {})
            return GenerationResult(
                reply_text=reply_text,
                cache_read_tokens=prompt_details.get("cached_tokens"),
                cache_write_tokens=prompt_details.get("cache_write_tokens"),
                raw_usage=usage,
            )

    logger.error("generation failed after %s attempts: %s", MAX_ATTEMPTS, last_error)
    raise GenerationFailedError(str(last_error))


async def generate_reply(
    system_prompt: str,
    knowledge_base_context: str | None,
    correction_patterns: str | None,
    learned_rules: str | None,
    thread_history: str | None,
    incoming_message: str,
) -> GenerationResult:
    """
    Five inputs, two different treatments - matching what's actually stable
    vs. actually per-call in the live n8n pipeline this replaces (confirmed
    by reading the live "AI Agent2" node and its upstream "Build Memory
    Context" node via the n8n API, not the repo's stale export):

    CACHED (one block, must be byte-identical across calls for the cache to
    hit - see prompts.py):
      - `system_prompt` - fixed persona text.
      - `knowledge_base_context` - must be the client's WHOLE, stable
        knowledge base (e.g. "get all documents where client_email = X"),
        NOT a per-query similarity-search result, which would change on
        every email and invalidate the cache every time. The persona text
        alone measured ~450 tokens - under Anthropic's ~1024-token minimum
        for caching to engage on Sonnet-class models at all (verified
        against a real API response). Merging in the full KB (~2900 tokens
        for this client's 16 documents) is what crosses that line.
      - `learned_rules` - the consolidated standing-rules text from the
        daily /consolidate-corrections pass. Updates at most once a day, so
        it belongs with the other stable, cacheable content rather than
        with the per-message `correction_patterns` block below.

    NOT CACHED (both genuinely vary call to call, so there's no cache win
    to be had here - this isn't a gap, it's just what these two actually are):
      - `correction_patterns` - the live prompt's "Learned Correction
        Patterns" section, populated by n8n's similarity search against
        past reply_corrections for whatever the current message resembles.
        Kept in the system role (matching where the live prompt puts it)
        but appended AFTER the cached block, which doesn't invalidate it.
      - `thread_history` - prior messages in this specific email thread.
        Goes in the user turn, matching the live prompt's structure.
    """
    logger.info(
        "prompt composition: knowledge_base=%s learned_rules=%s correction_patterns=%s thread_history=%s",
        bool(knowledge_base_context),
        bool(learned_rules),
        bool(correction_patterns),
        bool(thread_history),
    )

    cached_text = system_prompt
    if knowledge_base_context:
        cached_text += f"\n\n## Company FAQ / Policy Reference\n{knowledge_base_context}"
    if learned_rules:
        cached_text += (
            "\n\n## Standing Rules For This Support Inbox\n"
            "These apply to every reply, regardless of topic. If a rule below conflicts "
            "with something more specific to this particular message (e.g. from the "
            "correction-pattern or knowledge-base context), follow the more specific "
            "guidance instead - these are general defaults, not overrides.\n"
            f"{learned_rules}"
        )

    system_blocks = [
        {
            "type": "text",
            "text": cached_text,
            "cache_control": {"type": "ephemeral"},
        }
    ]
    if correction_patterns:
        system_blocks.append(
            {
                "type": "text",
                "text": (
                    "## Learned Correction Patterns For This Support Inbox\n"
                    "Human reviewers have corrected past AI drafts in the following ways. "
                    "Apply these preferences proactively in your reply, unless they conflict "
                    f"with factual accuracy:\n{correction_patterns}"
                ),
            }
        )

    user_text = "## Conversation History\n"
    user_text += thread_history or "(no prior messages in this thread)"
    user_text += f"\n\n## New Message From Customer\n{incoming_message}"

    return await call_openrouter_chat(
        [
            {"role": "system", "content": system_blocks},
            {"role": "user", "content": user_text},
        ]
    )
