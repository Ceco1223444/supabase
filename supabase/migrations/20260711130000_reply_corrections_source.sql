alter table public.reply_corrections
  add column source text not null default 'human_edit' check (source in ('human_edit', 'ai_refine'));
