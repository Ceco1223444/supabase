-- Keep documents.client_email and documents.metadata->>'client_email' in sync
create or replace function public.sync_documents_client_email()
returns trigger language plpgsql as $$
begin
  if new.client_email is null and new.metadata ? 'client_email' then
    new.client_email := new.metadata->>'client_email';
  end if;
  if new.client_email is not null then
    new.metadata := coalesce(new.metadata, '{}'::jsonb) || jsonb_build_object('client_email', new.client_email);
  end if;
  return new;
end;
$$;

drop trigger if exists documents_sync_client_email on public.documents;
create trigger documents_sync_client_email
  before insert or update on public.documents
  for each row execute function public.sync_documents_client_email();

-- Backfill existing rows
update public.documents
set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('client_email', client_email)
where client_email is not null;

-- One-time copy of the legacy bobgopnipop table's rows into the real multi-tenant table
insert into public.documents (id, content, metadata, embedding, client_email)
select id + 100000,
       content,
       coalesce(metadata, '{}'::jsonb) || jsonb_build_object('client_email', 'bobgopnipop@gmail.com'),
       embedding,
       'bobgopnipop@gmail.com'
from public.bobgopnipop
on conflict (id) do nothing;
