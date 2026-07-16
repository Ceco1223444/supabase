"""
Daily "dreaming" pass: rereads a client's ENTIRE `reply_corrections` history
from scratch and distills any habit that repeats across 3+ separate
corrections into a short standing-rules block, written as a new
`learned_patterns` row. Triggered once a day per client by a separate,
schedule-triggered n8n workflow - not on the per-message reply path, so it
has none of /generate-reply's persona-caching concerns. Reuses
claude_client's shared retry/call logic (`call_openrouter_chat`) but not its
persona-caching shape - this is a plain, one-off synchronous prompt.

ai-service otherwise has zero direct Supabase access (everything else flows
through n8n). This is the one place it talks to Supabase's REST API
directly, with the service-role key, via raw httpx - same lightweight,
no-SDK style already used throughout this service and the project's Edge
Functions (not the supabase-py package).
"""

import logging
import os
from dataclasses import dataclass

import httpx

from claude_client import call_openrouter_chat

logger = logging.getLogger("ai_service.consolidation")

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
REQUEST_TIMEOUT_SECONDS = 30.0

CONSOLIDATION_PROMPT_TEMPLATE = """You are reviewing every correction a human reviewer has made to AI-drafted
customer support replies for this support inbox, to find standing habits
worth remembering permanently.

Here are all logged corrections so far, each with how it originated
('human_edit' = the reviewer directly edited the text; 'ai_refine' = the
reviewer typed an instruction and the AI rewrote the draft):

{numbered_corrections}

Your job: identify patterns that repeat across MULTIPLE, DIFFERENT
corrections - not something that only happened once. A pattern must show
up in at least 3 separate corrections before you write it as a rule. If
nothing clears that bar yet, say so plainly and return no rules rather
than inventing one from a single occurrence.

For each pattern that does qualify, write ONE standing, general rule -
phrased as an instruction that should apply to every future reply
regardless of topic (e.g. "Use the customer's first name in the
greeting, never 'Dear Customer'"), not tied to any one specific ticket.
Immediately after the rule, add a short parenthetical noting (a) how many
of the corrections above support this specific pattern, and (b) the kind
of situation it tends to show up in - e.g. "(seen in 4 corrections,
mostly on shipping-delay replies)". The parenthetical must be grounded
only in the corrections actually listed above - never estimate or round
up a count.

Output only the qualifying rules as a plain bullet list (up to 10 rules -
if far more than 10 genuinely qualify, keep the 10 most frequently
repeated). Output nothing else - no headers, no explanation of what
didn't qualify. If nothing qualifies yet, output exactly:
NONE
and nothing else. Never combine the two: if at least one rule qualifies,
do not also mention "NONE" or describe patterns that didn't make the cut."""


@dataclass
class ConsolidationResult:
    rules: str | None
    source_count: int
    skipped: bool


def _supabase_headers() -> dict:
    return {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    }


async def _fetch_corrections(client_email: str) -> list[dict]:
    url = f"{SUPABASE_URL}/rest/v1/reply_corrections"
    params = {
        "client_email": f"eq.{client_email}",
        "select": "source,correction_note",
        "order": "created_at.asc",
    }
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        resp = await client.get(url, params=params, headers=_supabase_headers())
    resp.raise_for_status()
    return resp.json()


async def _insert_learned_pattern(client_email: str, rules: str, source_count: int) -> None:
    url = f"{SUPABASE_URL}/rest/v1/learned_patterns"
    headers = _supabase_headers()
    headers["Content-Type"] = "application/json"
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        resp = await client.post(
            url,
            headers=headers,
            json={"client_email": client_email, "rules": rules, "source_count": source_count},
        )
    resp.raise_for_status()


async def _prune_old_patterns(client_email: str, keep: int = 10) -> None:
    """Each daily run re-derives rules from scratch and always inserts a new
    row regardless of whether it matches what's already there - nothing
    else in the system ever reads anything but the newest row, so without
    this, the table grows by one row per client per day forever. Keep only
    the most recent `keep` rows per client as a rollback/audit buffer."""
    url = f"{SUPABASE_URL}/rest/v1/rpc/prune_learned_patterns"
    headers = _supabase_headers()
    headers["Content-Type"] = "application/json"
    async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT_SECONDS) as client:
        resp = await client.post(
            url,
            headers=headers,
            json={"p_client_email": client_email, "p_keep": keep},
        )
    resp.raise_for_status()


def _extract_rules(raw_response: str) -> str | None:
    """The model is instructed to output either exactly `NONE` or a plain
    bullet list, nothing else - but a real run showed it can still append
    stray commentary next to genuine bullets (e.g. a trailing "NONE (no
    other pattern qualifies)" aside alongside an actual rule). Don't trust
    the model to police its own format: keep only bullet lines, so any
    such commentary never ends up stored in `learned_patterns.rules` and
    injected into every live reply."""
    if raw_response.strip() == "NONE":
        return None
    bullet_lines = [line for line in raw_response.splitlines() if line.strip().startswith(("-", "*"))]
    return "\n".join(bullet_lines) if bullet_lines else None


async def consolidate_corrections(client_email: str) -> ConsolidationResult:
    corrections = await _fetch_corrections(client_email)
    if not corrections:
        logger.info("consolidation for client=%s: no corrections logged yet, skipping", client_email)
        return ConsolidationResult(rules=None, source_count=0, skipped=True)

    numbered_corrections = "\n".join(
        f"{i}. {row.get('source', 'human_edit')}: {row.get('correction_note') or '(no note recorded)'}"
        for i, row in enumerate(corrections, start=1)
    )
    prompt = CONSOLIDATION_PROMPT_TEMPLATE.format(numbered_corrections=numbered_corrections)

    result = await call_openrouter_chat([{"role": "user", "content": prompt}])
    rules_text = _extract_rules(result.reply_text)

    if rules_text is None:
        logger.info(
            "consolidation for client=%s: no pattern cleared the 3-occurrence bar (source_count=%s)",
            client_email,
            len(corrections),
        )
        return ConsolidationResult(rules=None, source_count=len(corrections), skipped=True)

    await _insert_learned_pattern(client_email, rules_text, len(corrections))
    await _prune_old_patterns(client_email)
    return ConsolidationResult(rules=rules_text, source_count=len(corrections), skipped=False)
