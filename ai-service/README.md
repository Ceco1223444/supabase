# Ansera AI Service

A small FastAPI service with one job: generate the customer-reply draft
with prompt caching turned on, and fail loudly instead of silently if the
call to Claude doesn't work. It replaces exactly one node in the live n8n
workflow (`AI Agent2`, in `n8n/Customer Support Agent v1 Supabase.json`) —
nothing else in the pipeline changes.

## What this does and doesn't do

**Does:** takes the customer's email + already-retrieved knowledge-base
text, calls Claude via OpenRouter with the persona instructions marked as
a cache breakpoint (so repeat calls within the cache window cost ~10% for
that block instead of full price), retries automatically on a transient
failure, and returns a clear error instead of nothing if it still fails
after retrying.

**Doesn't:** classify the email (n8n's `Basic LLM Chain1` already does this
cheaply and in parallel with generation — no reason to touch it), or run
the knowledge-base search itself (n8n's `Supabase Vector Store` node can
do this in plain "retrieve" mode and hand the results to this service —
see step 2 below. Keeping retrieval in n8n avoids this service needing its
own OpenAI embeddings key and having to guess which embedding model
matches what's already stored in `documents.embedding`).

Two small, deliberate changes from the original n8n node's prompt text —
called out here, not buried: dropped an instruction to always reply in
Bulgarian (looked like a copy-paste leftover — the product and its UI are
English), and dropped a mention of "the Pinecone vector store" (this
project uses Supabase, not Pinecone — that tool was never actually
connected). Full text is in `prompts.py`.

## Run it locally

```
cd ai-service
python -m venv .venv
.venv/Scripts/activate        # or source .venv/bin/activate on macOS/Linux
pip install -r requirements.txt
cp .env.example .env          # fill in OPENROUTER_API_KEY and AI_SERVICE_SECRET
uvicorn main:app --reload --env-file .env
```

Then:

```
curl http://localhost:8000/health
# {"ok":true}

curl -X POST http://localhost:8000/generate-reply \
  -H "Content-Type: application/json" \
  -H "X-Service-Secret: <same value as AI_SERVICE_SECRET>" \
  -d '{"client_email":"test@example.com","subject":"Where is my order?","incoming_message":"Hi, I ordered 5 days ago and still no tracking number. Order #4127."}'
```

The response includes `cache_read_tokens`/`cache_write_tokens`. First call
in a session: `cache_write_tokens` is non-zero, `cache_read_tokens` is
null/0. A second call within ~5 minutes: `cache_read_tokens` should be
non-zero — that's the actual proof caching is working, not just that the
code ran. **Confirm this with a real call before relying on it** — OpenRouter's
exact pass-through behavior for Anthropic cache fields wasn't verified from
here (no live call was made against your API key without asking first).

## What's left to do (can't be done from here)

**1. Deploy it somewhere.** Pick whichever is easiest for you — the
`Dockerfile` works with any of these:
- [Render](https://render.com) or [Railway](https://railway.app) — point
  it at this repo, set the root directory to `ai-service/`, add the two
  env vars from `.env.example` in their dashboard. Simplest option if
  you've never deployed a backend service before.
- Fly.io, or your own VPS with Docker — more control, more setup.

Whichever you pick, you'll end up with a public URL like
`https://your-service.onrender.com`.

**2. In n8n, add a step that fetches the client's whole knowledge base
before this call** — not a similarity search. This one's important to get
right: `knowledge_base_context` must be **identical on every call for the
same client**, or caching silently stops working (see the comment in
`claude_client.py` for the measured numbers — the persona text alone is
too short to be cacheable at all; combining it with the full KB is what
gets it over the size Anthropic requires before caching engages). At 16
documents / ~2,900 tokens for the current client this is genuinely simpler
than what `AI Agent2` does today, not just a workaround: a plain Supabase
node — `getAll` on `documents`, filtered by `client_email` — no vector
store, no embeddings, no `topK` guessing. Join the returned rows' `content`
into one text block; that becomes `knowledge_base_context` below. If a
client's knowledge base ever grows large enough that including all of it
stops being cheap, that's the point to bring back similarity search — as
its own separately-cached step, not blended into this one.

**3. Swap `AI Agent2` for an HTTP Request node.** Same position in the
workflow, same inputs available (`Gmail Trigger3`, `Edit Fields4`). Configure it:

- Method: `POST`
- URL: your deployed service's URL + `/generate-reply`
- Headers: `X-Service-Secret: <the AI_SERVICE_SECRET value>` — same
  shared-secret pattern already used by `Webhook Secret Check` for the
  `approve-reply` → n8n call, just in the other direction this time.
- Body (JSON):
  ```json
  {
    "client_email": "={{ $('Edit Fields4').item.json.to.text }}",
    "subject": "={{ $('Gmail Trigger3').item.json.subject }}",
    "incoming_message": "={{ $('Gmail Trigger3').item.json.text }}",
    "knowledge_base_context": "={{ /* the joined chunks from step 2 */ }}"
  }
  ```
- Downstream nodes (`Merge1`, `Create a row2`, etc.) read the reply from
  `{{ $json.reply }}` instead of `{{ $('AI Agent2').item.json.output }}` —
  update those two references.
- **On the 502 case:** add an error-output branch off this node (n8n
  supports this per-node) to a new `Create a row` call writing
  `status: 'generation_failed'` with the raw incoming message, so a failed
  generation leaves a visible row instead of the ticket vanishing. This is
  the fix for the "silent message loss" gap flagged in the audit doc —
  it doesn't happen automatically just by adding this service; the branch
  has to be wired in n8n too.

Test with one real email end-to-end before flipping this on for
everyone, the same way you'd test any change to a live workflow.
