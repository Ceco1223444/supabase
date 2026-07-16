-- learned_patterns: consolidated standing rules distilled from repeated reply_corrections,
-- refreshed by the daily consolidation pass (ai-service /consolidate-corrections)
create table public.learned_patterns (
  id bigint generated always as identity primary key,
  client_email text not null references public.clients(email),
  rules text not null,          -- the distilled standing rules, plain text
  source_count int not null,    -- how many correction rows fed this pass
  created_at timestamptz not null default now()
);

create index learned_patterns_client_idx on public.learned_patterns (client_email, created_at desc);

alter table public.learned_patterns enable row level security;

create policy "learned_patterns_select_own" on public.learned_patterns
  for select to authenticated
  using (auth.email() = client_email);

revoke all on public.learned_patterns from anon;
