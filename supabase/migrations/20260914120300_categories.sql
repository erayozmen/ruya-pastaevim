create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  icon_emoji text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  show_on_home boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_is_active_idx on public.categories (is_active);
create index categories_sort_order_idx on public.categories (sort_order);

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.set_updated_at();

alter table public.categories enable row level security;

create policy "categories_public_read_active"
  on public.categories
  for select
  to anon, authenticated
  using (is_active = true);

create policy "categories_admin_full_access"
  on public.categories
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
