-- Requests submitted from the "Pastanı Tasarla" customizer.
--
-- portion_label / theme_label / color_label / flavor_label are SNAPSHOTS
-- of the customizer_* option labels at the moment the request was sent —
-- deliberately plain text, not foreign keys. If an admin later renames
-- "Pudra Pembe" to "Soft Pudra" in customizer_colors, this historical
-- request must keep reading "Pudra Pembe". A foreign key would make the
-- old order's display change retroactively, which is wrong for a record
-- of what the customer actually asked for.

create type public.order_status as enum (
  'NEW',
  'CONTACTED',
  'QUOTED',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED'
);

create table public.order_requests (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  event_date date,
  portion_label text not null,
  theme_label text not null,
  color_label text not null,
  flavor_label text not null,
  note text,
  status public.order_status not null default 'NEW',
  estimated_price numeric(10, 2),
  quoted_price numeric(10, 2),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index order_requests_status_idx on public.order_requests (status);
create index order_requests_created_at_idx on public.order_requests (created_at);

create trigger set_order_requests_updated_at
  before update on public.order_requests
  for each row
  execute function public.set_updated_at();

alter table public.order_requests enable row level security;

-- Anyone (including anonymous site visitors) may submit a request...
create policy "order_requests_public_insert"
  on public.order_requests
  for insert
  to anon, authenticated
  with check (true);

-- ...but only an admin may read or update the resulting queue. There is
-- deliberately no public SELECT, UPDATE or DELETE policy, and no admin
-- DELETE policy either — the brief calls only for admin SELECT + UPDATE,
-- so cancelling a request is modeled as status = 'CANCELLED', not a row
-- deletion.
create policy "order_requests_admin_read"
  on public.order_requests
  for select
  to authenticated
  using (public.is_admin());

create policy "order_requests_admin_update"
  on public.order_requests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
