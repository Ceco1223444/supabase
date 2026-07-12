-- thread_messages: full per-thread conversation log, used to give the drafting agent prior context
create table public.thread_messages (
  id bigint generated always as identity primary key,
  client_email text not null references public.clients(email),
  thread_id text not null,
  message_id text,
  sender_email text,
  direction text not null check (direction in ('inbound','outbound')),
  body text not null,
  created_at timestamptz not null default now()
);

create index thread_messages_thread_idx on public.thread_messages (client_email, thread_id, created_at);

alter table public.thread_messages enable row level security;

create policy "thread_messages_select_own" on public.thread_messages
  for select to authenticated
  using (auth.email() = client_email);

revoke all on public.thread_messages from anon;

-- reply_corrections: captures human edits to AI drafts, to learn a tenant's house style over time
create table public.reply_corrections (
  id bigint generated always as identity primary key,
  client_email text not null references public.clients(email),
  thread_id text,
  email_log_id bigint references public.email_logs(id),
  ai_draft text not null,
  final_sent text not null,
  correction_note text,
  created_at timestamptz not null default now()
);

create index reply_corrections_client_idx on public.reply_corrections (client_email, created_at desc);

alter table public.reply_corrections enable row level security;

create policy "reply_corrections_select_own" on public.reply_corrections
  for select to authenticated
  using (auth.email() = client_email);

revoke all on public.reply_corrections from anon;
