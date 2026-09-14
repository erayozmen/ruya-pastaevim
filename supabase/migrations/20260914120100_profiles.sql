-- Admin profiles, linked 1:1 to Supabase Auth users.
--
-- SECURITY NOTE: there is intentionally NO trigger that auto-creates a
-- profiles row when a new auth.users row appears. If there were, every
-- person who signs up would need a role, and defaulting that role to
-- ADMIN (the only role that exists today) would make self-signup grant
-- admin access. Until a non-admin role is introduced, profiles rows are
-- created manually (see supabase/README.md) for the specific person who
-- should have admin access.

create type public.app_role as enum ('ADMIN');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.app_role not null default 'ADMIN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Security-definer helper so every later RLS policy can ask "is the
-- current user an admin?" in one readable call, without each table's
-- policy needing to know how `profiles` is shaped. Runs as the function
-- owner, so it is not itself blocked by the RLS it evaluates.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'ADMIN'
  );
$$;

alter table public.profiles enable row level security;

create policy "profiles_select_self_or_admin"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_admin_manage"
  on public.profiles
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
