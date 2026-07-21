# Ansera

Multi-tenant customer-support automation: Gmail in → AI-drafted reply out, with human review, thread memory, and self-improving correction learning. Orchestrated by n8n, backed by Supabase, viewed through a React dashboard.

**Stack:** React 19 + Vite + TypeScript + Tailwind (frontend) · Supabase (Postgres + pgvector, Auth, Edge Functions) · n8n (workflow orchestration) · Python/FastAPI (correction consolidation service) · Claude (via OpenRouter) for generation, OpenAI for embeddings.

## How the pieces fit together

1. **Gmail → n8n**: an n8n workflow polls the support inbox, identifies the tenant, pulls thread history + past corrections + learned patterns from Supabase, and drafts a reply with an LLM agent (with a knowledge-base search tool backed by Supabase pgvector).
2. **n8n → Supabase**: the draft is stored in `email_logs`. If the tenant's auto-send is on, it goes out immediately; otherwise it waits there for human review.
3. **Supabase → frontend**: the React dashboard (this repo's `src/`) reads `email_logs` (RLS-scoped per tenant) so a human can review, edit, or refine the draft before sending.
4. **frontend → n8n**: clicking send calls the `approve-reply` Edge Function, which verifies ownership, saves the final text, and calls back into the same n8n workflow (a webhook trigger) to actually send via Gmail.
5. **Learning loop**: edits that meaningfully change the draft get logged to `reply_corrections` (embedded, deduplicated against near-identical past corrections). A daily job consolidates each tenant's corrections into standing `learned_patterns`, which feed back into step 1.

## Structure

- `src/` — the React/Vite frontend (login, inbox, analytics, recommendations, knowledge base, settings)
- `supabase/` — CLI-linked Supabase project (`migrations/`, `functions/approve-reply/`, `functions/refine-reply/`). Linked to project `pmyadlizhyztvfvpdosf`.
- `ai-service/` — Python/FastAPI service that runs the daily correction-consolidation job. Runs as its own Docker container; see `ai-service/.env.example` for what it needs. No docker-compose ties it to the rest of the stack — it's started manually.
- `n8n/` — a point-in-time export of the live n8n workflow, kept here for reference/backup only. The n8n instance itself (`http://localhost:5678`, Docker container named `Ex`) is the actual source of truth — this file goes stale the moment the workflow is edited there and does not update itself. Refresh it after meaningful workflow changes:
  ```
  docker exec Ex n8n export:workflow --id <workflow-id> --pretty --output=-
  ```
  then commit the result over this file.
- `scripts/` — local Windows automation that keeps a Cloudflare quick-tunnel pointed at local n8n and syncs the URL into `.env` + Supabase secrets. Paths inside are hardcoded to this machine; `scripts/logs/` is gitignored runtime output, not meant to be committed.
- `.env` — server-side/CLI secrets (Supabase service role key, n8n API key/webhook secret). Gitignored. Never reference these with a `VITE_` prefix.
- `.env.local` — browser-safe frontend config (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Gitignored.

## What this repo can and can't reconstruct

This repo is the source of truth for **code and schema**. It is not, and can't be, a full backup of the running system:

- **Recoverable from this repo alone:** frontend, edge function code, ai-service code, full schema history (via migrations).
- **Requires the manual export step above:** the current n8n workflow graph (node wiring, prompts). Credentials wired into those nodes (Gmail OAuth, OpenRouter, n8n's own Supabase key) are stripped out by n8n on export by design and must be re-entered by hand regardless of how fresh the export is.
- **Never recoverable from git, by design:** anything in `.env` / `.env.local` / `ai-service/.env` (gitignored secrets), and all live data — `documents`, `reply_corrections`, `learned_patterns`, `email_logs`, `thread_messages`, etc. Migrations define table shape only, never contents.

## Running locally

```
npm install
npm run dev
```

Needs `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for the frontend to reach Supabase. The n8n/ai-service side of the stack (Gmail polling, draft generation, sending) runs independently in Docker and isn't required just to browse the dashboard against existing data.

## Supabase CLI

Run from this folder (it's the linked project root now):

```
npx supabase migration list
npx supabase db push
npx supabase functions deploy approve-reply
npx supabase functions deploy refine-reply
```

## ai-service

```
cd ai-service
docker build -t ansera-ai-service:local .
docker run -d --name ansera-ai-service --network ansera-net --restart unless-stopped -p 8123:8000 \
  -e OPENROUTER_API_KEY=... -e AI_SERVICE_SECRET=... -e SUPABASE_URL=... -e SUPABASE_SERVICE_ROLE_KEY=...
```

See `ai-service/.env.example` for what each variable is and where its value should come from (several are shared with the main project's `.env` — don't generate separate ones).
