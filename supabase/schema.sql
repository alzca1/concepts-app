-- concepts-app schema for Supabase (Postgres 15+).
-- Run once in Supabase Dashboard → SQL Editor → New query → Run.
--
-- Design notes:
-- * Each row belongs to exactly one user (auth.users.id).
-- * RLS is the only access path: every read and write is filtered by
--   auth.uid(), so no client code can see another user's cards even
--   if the JWT is forged.
-- * `tag` is a single text column (matches the existing data model).
--   If multi-tag support is added later, change to text[] and add a
--   GIN index — the RLS and triggers stay the same.
-- * pgcrypto gives us gen_random_uuid() without an external module.

create extension if not exists pgcrypto;

create table public.concepts (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        references auth.users(id) on delete cascade not null,
  front      text        not null,
  back       text        not null,
  tag        text        not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index concepts_user_id_idx on public.concepts (user_id);
create index concepts_tag_idx     on public.concepts (tag);

create or replace function public.concepts_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger concepts_set_updated_at
  before update on public.concepts
  for each row execute function public.concepts_set_updated_at();

alter table public.concepts enable row level security;

create policy "Users manage own concepts"
  on public.concepts
  for all
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auth: allow new sign-ups with email + password.
-- Supabase Auth is enabled by default; this block is here only as
-- documentation. Adjust in Dashboard → Authentication → Providers.
--   - Email provider: ON
--   - Confirm email: ON (recommended)
--   - Secure password: ON
