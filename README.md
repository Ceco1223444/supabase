# Ansera

Multi-tenant dashboard for the StarTech customer-support automation (Gmail → AI agent → Supabase, orchestrated by n8n).

## Structure

- `src/` — the React/Vite frontend (login, inbox, analytics, recommendations, knowledge base, settings)
- `supabase/` — CLI-linked Supabase project (`migrations/`, `functions/approve-reply/`). Linked to project `pmyadlizhyztvfvpdosf`.
- `n8n/` — a point-in-time export of the live n8n workflow, kept here for reference/backup only. The n8n instance itself (`http://localhost:5678`, Docker container) is the actual source of truth — this file will go stale as the workflow is edited there.
- `.env` — server-side/CLI secrets (Supabase service role key, n8n API key/webhook secret). Gitignored. Never reference these with a `VITE_` prefix.
- `.env.local` — browser-safe frontend config (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Gitignored.

## Running locally

```
npm install
npm run dev
```

## Supabase CLI

Run from this folder (it's the linked project root now):

```
npx supabase migration list
npx supabase db push
npx supabase functions deploy approve-reply
```
