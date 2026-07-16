-- waitlist_signups: public waitlist for the Ansera suite landing page (Sites/Scout/Studio early access)
create table public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  module_interest text not null check (module_interest in ('sites', 'scout', 'studio', 'all')),
  current_products text,
  created_at timestamptz not null default now()
);

alter table public.waitlist_signups enable row level security;

-- Anonymous landing-page visitors may join the waitlist; there is no select
-- policy, so the list can never be read back through the public API.
create policy "waitlist_signups_insert_public" on public.waitlist_signups
  for insert to anon, authenticated
  with check (true);

revoke all on public.waitlist_signups from anon, authenticated;
grant insert on public.waitlist_signups to anon, authenticated;
