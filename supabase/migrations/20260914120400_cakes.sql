-- `category_id` uses ON DELETE RESTRICT: a category with cakes attached
-- cannot be deleted outright, so a cake can never become orphaned by a
-- category deletion. The admin must first move or delete its cakes.

create table public.cakes (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories (id) on delete restrict,
  name text not null,
  slug text not null unique,
  description text,
  main_image_url text,
  price numeric(10, 2),
  show_price boolean not null default false,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint cakes_price_nonnegative check (price is null or price >= 0)
);

create index cakes_category_id_idx on public.cakes (category_id);
create index cakes_is_active_idx on public.cakes (is_active);
create index cakes_sort_order_idx on public.cakes (sort_order);

create trigger set_cakes_updated_at
  before update on public.cakes
  for each row
  execute function public.set_updated_at();

alter table public.cakes enable row level security;

create policy "cakes_public_read_active"
  on public.cakes
  for select
  to anon, authenticated
  using (is_active = true);

create policy "cakes_admin_full_access"
  on public.cakes
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
