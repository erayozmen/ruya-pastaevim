-- Singleton site settings row.
--
-- `id boolean primary key default true` with a `check (id)` is a standard
-- Postgres trick to guarantee at most one row can ever exist: the only
-- legal primary key value is `true`, so a second INSERT collides with the
-- existing row's primary key.
--
-- Verified real business fields (see project brief) get real defaults.
-- Unverified fields (address, working hours, etc.) default to NULL and
-- must not be filled with invented data — they stay empty until the
-- business confirms them via the admin panel (Sprint 5+).

create table public.site_settings (
  id boolean primary key default true,
  brand_name text not null default 'Rüyam Pasta Evim',
  baker_name text not null default 'Gülden Kantor',
  instagram_username text not null default '@ruyapastaevim',
  instagram_url text not null default 'https://www.instagram.com/ruyapastaevim/',
  whatsapp_number text not null default '905419090725',
  phone text not null default '0541 909 07 25',
  address text,
  service_area text,
  working_hours text,
  email text,
  delivery_info text,
  minimum_order_days integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint site_settings_singleton check (id)
);

create trigger set_site_settings_updated_at
  before update on public.site_settings
  for each row
  execute function public.set_updated_at();

alter table public.site_settings enable row level security;

-- The public site needs this to render brand name, WhatsApp number, etc.
-- None of these columns are secret, so anon + authenticated may read the
-- single row.
create policy "site_settings_public_read"
  on public.site_settings
  for select
  to anon, authenticated
  using (true);

create policy "site_settings_admin_write"
  on public.site_settings
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
