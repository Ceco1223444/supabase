alter table public.reply_corrections
  add column embedding vector(1536);

create or replace function public.match_reply_corrections(
  query_embedding vector(1536),
  match_client_email text,
  match_count int default 15
)
returns table (
  id bigint,
  thread_id text,
  correction_note text,
  similarity double precision
)
language plpgsql
as $$
begin
  return query
  select
    reply_corrections.id,
    reply_corrections.thread_id,
    reply_corrections.correction_note,
    1 - (reply_corrections.embedding <=> query_embedding) as similarity
  from reply_corrections
  where reply_corrections.client_email = match_client_email
    and reply_corrections.embedding is not null
  order by reply_corrections.embedding <=> query_embedding
  limit match_count;
end;
$$;

grant execute on function public.match_reply_corrections(vector, text, int) to service_role;
