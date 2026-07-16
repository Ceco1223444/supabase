-- Keeps at most the N most recent learned_patterns rows per client (default 10).
-- Called by ai-service right after every successful insert, since the daily
-- consolidation pass re-derives from scratch each day and has no way on its
-- own to know a row is redundant with what's already there.
create or replace function public.prune_learned_patterns(
  p_client_email text,
  p_keep int default 10
)
returns void
language plpgsql
as $$
begin
  delete from public.learned_patterns
  where client_email = p_client_email
    and id not in (
      select id from public.learned_patterns
      where client_email = p_client_email
      order by created_at desc
      limit p_keep
    );
end;
$$;

grant execute on function public.prune_learned_patterns(text, int) to service_role;
