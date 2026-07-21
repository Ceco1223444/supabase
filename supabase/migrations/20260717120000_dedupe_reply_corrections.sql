-- Deduplicate near-identical reply_corrections per client.
--
-- Problem: reply_corrections grows one row per human edit forever. Over time a
-- client accumulates many corrections that teach the SAME lesson, worded slightly
-- differently. When Get Similar Corrections pulls the "15 closest", near-duplicates
-- crowd out genuinely distinct lessons, making the AI's memory less useful.
--
-- Strategy: whenever a new correction is inserted, delete OLDER rows for the same
-- client whose embedding is >= 95% cosine-similar to the new one. The newest row
-- always wins (consistent with "per-message correction wins on conflict"). This is
-- O(rows-for-that-client) per insert -- it never becomes an all-vs-all sweep, so the
-- table self-compresses as it grows instead of exploding.
--
-- Similarity metric is cosine (pgvector <=>), the same metric match_reply_corrections
-- already uses, so behaviour is consistent across the system.

-- ---------------------------------------------------------------------------
-- 1) Report helper (NON-destructive): preview what would be merged for a client.
--    Run this first on real data to sanity-check the 0.95 threshold before trusting
--    the auto-trigger:  select * from report_duplicate_corrections('client@x.com');
-- ---------------------------------------------------------------------------
create or replace function public.report_duplicate_corrections(
  target_client_email text,
  sim_threshold double precision default 0.95
)
returns table (
  older_id bigint,
  newer_id bigint,
  similarity double precision,
  older_note text,
  newer_note text
)
language sql
stable
as $$
  select
    a.id as older_id,
    b.id as newer_id,
    1 - (a.embedding <=> b.embedding) as similarity,
    a.correction_note as older_note,
    b.correction_note as newer_note
  from public.reply_corrections a
  join public.reply_corrections b
    on a.client_email = b.client_email
   and b.id > a.id                         -- b is the newer row of the pair
  where a.client_email = target_client_email
    and a.embedding is not null
    and b.embedding is not null
    and 1 - (a.embedding <=> b.embedding) >= sim_threshold
  order by a.id;
$$;

-- ---------------------------------------------------------------------------
-- 2) Bulk prune (DESTRUCTIVE): collapse existing near-duplicates for one client.
--    Deletes any row that has a NEWER near-duplicate (keeps the newest of each
--    cluster). Use once to clean up history already in the table. Returns count.
--    O(n^2) for that single client -- fine for occasional manual use.
-- ---------------------------------------------------------------------------
create or replace function public.prune_duplicate_corrections(
  target_client_email text,
  sim_threshold double precision default 0.95
)
returns integer
language plpgsql
as $$
declare
  deleted_count integer;
begin
  with doomed as (
    select distinct a.id
    from public.reply_corrections a
    join public.reply_corrections b
      on a.client_email = b.client_email
     and b.id > a.id
    where a.client_email = target_client_email
      and a.embedding is not null
      and b.embedding is not null
      and 1 - (a.embedding <=> b.embedding) >= sim_threshold
  )
  delete from public.reply_corrections r
  using doomed d
  where r.id = d.id;

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;

-- ---------------------------------------------------------------------------
-- 3) Per-insert trigger (DESTRUCTIVE, automatic): when a correction is inserted,
--    remove older near-duplicates of it for the same client. Compares only the
--    NEW row against existing rows -> O(n) per insert, never all-vs-all.
--    Fires regardless of WHICH node/workflow inserts, so both the manual and any
--    future insert path are covered without touching n8n.
-- ---------------------------------------------------------------------------
create or replace function public.trg_dedupe_reply_correction()
returns trigger
language plpgsql
as $$
begin
  if NEW.embedding is not null then
    delete from public.reply_corrections r
    where r.client_email = NEW.client_email
      and r.id < NEW.id                       -- only older rows; new one is kept
      and r.embedding is not null
      and 1 - (r.embedding <=> NEW.embedding) >= 0.95;
  end if;
  return NEW;
end;
$$;

drop trigger if exists dedupe_reply_correction on public.reply_corrections;
create trigger dedupe_reply_correction
  after insert on public.reply_corrections
  for each row
  execute function public.trg_dedupe_reply_correction();

grant execute on function public.report_duplicate_corrections(text, double precision) to service_role;
grant execute on function public.prune_duplicate_corrections(text, double precision)  to service_role;
