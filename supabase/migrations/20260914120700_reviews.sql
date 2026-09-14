-- `cake_id` / `category_id` use ON DELETE SET NULL for the same reason as
-- gallery_items: a testimonial is still worth showing even if the exact
-- cake or category it referenced is later removed.

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  content text not null,
  rating smallint not null,
  photo_url text,
  cake_id uuid references public.cakes (id) on delete set null,
  category_id uuid references public.categories (id) on delete set null,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reviews_rating_range check (rating between 1 and 5)
);

create index reviews_is_active_idx on public.reviews (is_active);
create index reviews_cake_id_idx on public.reviews (cake_id);
create index reviews_category_id_idx on public.reviews (category_id);

create trigger set_reviews_updated_at
  before update on public.reviews
  for each row
  execute function public.set_updated_at();

alter table public.reviews enable row level security;

create policy "reviews_public_read_active"
  on public.reviews
  for select
  to anon, authenticated
  using (is_active = true);

create policy "reviews_admin_full_access"
  on public.reviews
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
