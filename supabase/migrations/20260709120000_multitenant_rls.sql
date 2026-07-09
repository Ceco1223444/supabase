-- ============================================================
-- 1. Drop the loose/incorrect policies
-- ============================================================
drop policy if exists "Allow anon insert on ai_recommendations" on public.ai_recommendations;
drop policy if exists "Enable insert for all users" on public.email_logs;
drop policy if exists "Enable read access for all users" on public.email_logs;
drop policy if exists "Users can view own recommendations" on public.ai_recommendations;
drop policy if exists "anon can insert login_logs" on public.login_logs;
drop policy if exists "anon insert" on public.policy_requests;
drop policy if exists "anon read" on public.policy_requests;
drop policy if exists "anon update" on public.policy_requests;

-- ============================================================
-- 2. Enable RLS wherever missing (clients/email_logs/policy_requests already on)
-- ============================================================
alter table public.ai_recommendations enable row level security;
alter table public.documents           enable row level security;
alter table public.login_logs          enable row level security;
alter table public.bobgopnipop         enable row level security; -- legacy: lock to service_role only, no policies added

-- ============================================================
-- 3. clients — read your own row; update ONLY auto_send
-- ============================================================
create policy "clients_select_own" on public.clients
  for select to authenticated
  using (auth.email() = email);

create policy "clients_update_own" on public.clients
  for update to authenticated
  using (auth.email() = email)
  with check (auth.email() = email);

revoke update on public.clients from authenticated;
grant update (auto_send) on public.clients to authenticated;

-- ============================================================
-- 4. email_logs — read-only from the frontend; writes go through
--    the approve-reply Edge Function (service_role), not direct RLS grants
-- ============================================================
create policy "email_logs_select_own" on public.email_logs
  for select to authenticated
  using (auth.email() = client_email);

-- ============================================================
-- 5. documents — read-only per tenant (Knowledge Base viewer)
-- ============================================================
create policy "documents_select_own" on public.documents
  for select to authenticated
  using (auth.email() = client_email);

-- ============================================================
-- 6. ai_recommendations — read-only per tenant
-- ============================================================
create policy "ai_recommendations_select_own" on public.ai_recommendations
  for select to authenticated
  using (auth.email() = email);

-- ============================================================
-- 7. login_logs — each user logs/sees only their own login events
-- ============================================================
create policy "login_logs_select_own" on public.login_logs
  for select to authenticated
  using (auth.email() = email);

create policy "login_logs_insert_own" on public.login_logs
  for insert to authenticated
  with check (auth.email() = email);

create policy "login_logs_update_own" on public.login_logs
  for update to authenticated
  using (auth.email() = email)
  with check (auth.email() = email);

-- ============================================================
-- 8. policy_requests — each client sees/creates only their own requests
-- ============================================================
create policy "policy_requests_select_own" on public.policy_requests
  for select to authenticated
  using (auth.email() = user_email);

create policy "policy_requests_insert_own" on public.policy_requests
  for insert to authenticated
  with check (auth.email() = user_email);

create policy "policy_requests_update_own" on public.policy_requests
  for update to authenticated
  using (auth.email() = user_email)
  with check (auth.email() = user_email);

-- ============================================================
-- 9. Defense-in-depth: strip anon's blanket privileges now that
--    everything is behind Supabase Auth (a logged-out visitor gets nothing)
-- ============================================================
revoke all on public.clients            from anon;
revoke all on public.email_logs         from anon;
revoke all on public.documents          from anon;
revoke all on public.ai_recommendations from anon;
revoke all on public.login_logs         from anon;
revoke all on public.policy_requests    from anon;
revoke all on public.bobgopnipop        from anon;

-- ============================================================
-- 10. Auto-provision a clients row on signup
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.clients (email, auto_send)
  values (new.email, false)
  on conflict (email) do nothing;   -- preserves an existing manually-onboarded row's auto_send setting
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
