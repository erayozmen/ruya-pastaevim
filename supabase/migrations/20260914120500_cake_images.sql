-- Extra gallery images for a single cake (the cake's own `main_image_url`
-- covers the primary photo). ON DELETE CASCADE: these rows have no
-- meaning without their parent cake, so they are removed with it.

create table public.cake_images (
  id uuid primary key default gen_random_uuid(),
  cake_id uuid not null references public.cakes (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index cake_images_cake_id_idx on public.cake_images (cake_id);

alter table public.cake_images enable row level security;

-- Readable whenever the parent cake is readable (i.e. active).
create policy "cake_images_public_read_for_active_cake"
  on public.cake_images
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.cakes
      where cakes.id = cake_images.cake_id
        and cakes.is_active = true
    )
  );

create policy "cake_images_admin_full_access"
  on public.cake_images
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
