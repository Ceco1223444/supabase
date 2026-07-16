"""
Ansera AI Service - replaces n8n's "AI Agent2" node for the final
draft-generation call only. Classification and knowledge-base retrieval stay
in n8n (they already work; see ai-service/README.md for why this service
doesn't try to take those over too).
"""

import logging
import os

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel

from claude_client import GenerationFailedError, generate_reply
from consolidation import consolidate_corrections
from prompts import SUPPORT_REPLY_SYSTEM_PROMPT

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_service")

app = FastAPI(title="Ansera AI Service")

SERVICE_SECRET = os.environ["AI_SERVICE_SECRET"]


class GenerateReplyRequest(BaseModel):
    client_email: str
    subject: str
    incoming_message: str
    knowledge_base_context: str | None = None
    correction_patterns: str | None = None
    learned_rules: str | None = None
    thread_history: str | None = None


class GenerateReplyResponse(BaseModel):
    reply: str
    cache_read_tokens: int | None
    cache_write_tokens: int | None


class ConsolidateCorrectionsRequest(BaseModel):
    client_email: str


class ConsolidateCorrectionsResponse(BaseModel):
    rules: str | None
    source_count: int
    skipped: bool


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/generate-reply", response_model=GenerateReplyResponse)
async def create_reply(
    body: GenerateReplyRequest,
    x_service_secret: str = Header(default=""),
):
    if x_service_secret != SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")

    logger.info("generating reply for client=%s subject=%r", body.client_email, body.subject)

    try:
        result = await generate_reply(
            system_prompt=SUPPORT_REPLY_SYSTEM_PROMPT,
            knowledge_base_context=body.knowledge_base_context,
            correction_patterns=body.correction_patterns,
            learned_rules=body.learned_rules,
            thread_history=body.thread_history,
            incoming_message=f"Subject: {body.subject}\n\n{body.incoming_message}",
        )
    except GenerationFailedError as exc:
        # A clear 502 instead of the request silently vanishing - n8n can
        # branch on this to write a fallback email_logs row so the ticket
        # stays visible instead of disappearing. See README.md step 3.
        logger.error("generation failed for client=%s: %s", body.client_email, exc)
        raise HTTPException(status_code=502, detail=f"generation failed: {exc}") from exc

    logger.info(
        "generated reply for client=%s (cache_read_tokens=%s cache_write_tokens=%s)",
        body.client_email,
        result.cache_read_tokens,
        result.cache_write_tokens,
    )
    return GenerateReplyResponse(
        reply=result.reply_text,
        cache_read_tokens=result.cache_read_tokens,
        cache_write_tokens=result.cache_write_tokens,
    )


@app.post("/consolidate-corrections", response_model=ConsolidateCorrectionsResponse)
async def consolidate_corrections_route(
    body: ConsolidateCorrectionsRequest,
    x_service_secret: str = Header(default=""),
):
    if x_service_secret != SERVICE_SECRET:
        raise HTTPException(status_code=401, detail="unauthorized")

    logger.info("consolidating corrections for client=%s", body.client_email)

    try:
        result = await consolidate_corrections(body.client_email)
    except GenerationFailedError as exc:
        logger.error("consolidation failed for client=%s: %s", body.client_email, exc)
        raise HTTPException(status_code=502, detail=f"consolidation failed: {exc}") from exc

    logger.info(
        "consolidation done for client=%s (skipped=%s source_count=%s)",
        body.client_email,
        result.skipped,
        result.source_count,
    )
    return ConsolidateCorrectionsResponse(
        rules=result.rules,
        source_count=result.source_count,
        skipped=result.skipped,
    )
