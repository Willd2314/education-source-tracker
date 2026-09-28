-- Run once in the Supabase SQL Editor for a new project.
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 200),
  url text not null check (url ~ '^https?://'),
  kind text not null check (kind in ('Article','Dataset','Discussion')),
  status text not null default 'To review' check (status in ('To review','Reviewed')),
  publisher text not null default '' check (char_length(publisher) <= 200),
  notes text not null default '' check (char_length(notes) <= 5000),
  created_at timestamptz not null default now()
);
create index sources_user_id_idx on public.sources(user_id);
alter table public.sources enable row level security;
revoke all on public.sources from anon;
grant select, insert, update, delete on public.sources to authenticated;
create policy "Read own sources" on public.sources for select to authenticated using ((select auth.uid()) = user_id);
create policy "Create own sources" on public.sources for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Update own sources" on public.sources for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Delete own sources" on public.sources for delete to authenticated using ((select auth.uid()) = user_id);
