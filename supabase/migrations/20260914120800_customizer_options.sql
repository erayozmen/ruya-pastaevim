-- The four option lists behind the "Pastanı Tasarla" customizer.
-- `value` is the stable machine value (what the UI keeps in state and
-- what order_requests snapshots as *_label); `label` is the human-facing
-- button text. Both are unique per table so admins can't create two
-- options that would be indistinguishable to a customer or to an order.

create table public.customizer_portions (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null unique,
  emoji text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customizer_themes (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null unique,
  emoji text,
  -- Only themes drive the customizer's live preview image.
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customizer_colors (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null unique,
  swatch_hex text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customizer_flavors (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null unique,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customizer_portions_is_active_idx on public.customizer_portions (is_active);
create index customizer_themes_is_active_idx on public.customizer_themes (is_active);
create index customizer_colors_is_active_idx on public.customizer_colors (is_active);
create index customizer_flavors_is_active_idx on public.customizer_flavors (is_active);

create trigger set_customizer_portions_updated_at
  before update on public.customizer_portions
  for each row execute function public.set_updated_at();

create trigger set_customizer_themes_updated_at
  before update on public.customizer_themes
  for each row execute function public.set_updated_at();

create trigger set_customizer_colors_updated_at
  before update on public.customizer_colors
  for each row execute function public.set_updated_at();

create trigger set_customizer_flavors_updated_at
  before update on public.customizer_flavors
  for each row execute function public.set_updated_at();

alter table public.customizer_portions enable row level security;
alter table public.customizer_themes enable row level security;
alter table public.customizer_colors enable row level security;
alter table public.customizer_flavors enable row level security;

create policy "customizer_portions_public_read_active"
  on public.customizer_portions for select to anon, authenticated using (is_active = true);
create policy "customizer_portions_admin_full_access"
  on public.customizer_portions for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "customizer_themes_public_read_active"
  on public.customizer_themes for select to anon, authenticated using (is_active = true);
create policy "customizer_themes_admin_full_access"
  on public.customizer_themes for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "customizer_colors_public_read_active"
  on public.customizer_colors for select to anon, authenticated using (is_active = true);
create policy "customizer_colors_admin_full_access"
  on public.customizer_colors for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "customizer_flavors_public_read_active"
  on public.customizer_flavors for select to anon, authenticated using (is_active = true);
create policy "customizer_flavors_admin_full_access"
  on public.customizer_flavors for all to authenticated using (public.is_admin()) with check (public.is_admin());
