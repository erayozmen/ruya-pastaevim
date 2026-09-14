-- `category_id` uses ON DELETE SET NULL: a gallery photo is still worth
-- showing even if its category tag is removed, so deleting a category
-- just clears the tag instead of deleting (or blocking deletion of) the
-- photo.

create table public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title text not null,
  description text,
  category_id uuid references public.categories (id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index gallery_items_category_id_idx on public.gallery_items (category_id);
create index gallery_items_is_active_idx on public.gallery_items (is_active);

create trigger set_gallery_items_updated_at
  before update on public.gallery_items
  for each row
  execute function public.set_updated_at();

alter table public.gallery_items enable row level security;

create policy "gallery_items_public_read_active"
  on public.gallery_items
  for select
  to anon, authenticated
  using (is_active = true);

create policy "gallery_items_admin_full_access"
  on public.gallery_items
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
