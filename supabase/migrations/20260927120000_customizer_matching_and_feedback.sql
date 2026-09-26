-- 1) Lets a cake opt into the "Pastanı Tasarla" live preview: an admin marks
-- which customizer theme/color values a cake's real photo visually matches,
-- and the preview picks the best-scoring real cake photo instead of a
-- generic stock image. Loose text[] tags (not FKs) — same pattern as
-- order_requests snapshotting *_label as free text — so admins can tag a
-- cake even if a customizer option is later renamed or deactivated.
alter table public.cakes
  add column customizer_theme_values text[] not null default '{}',
  add column customizer_color_values text[] not null default '{}';

create index cakes_customizer_theme_values_idx on public.cakes using gin (customizer_theme_values);
create index cakes_customizer_color_values_idx on public.cakes using gin (customizer_color_values);

-- 2) A dedicated, minimal gallery of real customer feedback screenshots
-- (Instagram/WhatsApp), shown as a visual grid on the homepage. Kept
-- separate from `reviews` (structured name/content/rating testimonials)
-- since these are just images with no text fields to fill — mixing the two
-- would force fake rating/content values onto rows that are purely visual.
create table public.customer_feedback_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customer_feedback_images_is_active_idx on public.customer_feedback_images (is_active);

create trigger set_customer_feedback_images_updated_at
  before update on public.customer_feedback_images
  for each row execute function public.set_updated_at();

alter table public.customer_feedback_images enable row level security;

create policy "customer_feedback_images_public_read_active"
  on public.customer_feedback_images
  for select
  to anon, authenticated
  using (is_active = true);

create policy "customer_feedback_images_admin_full_access"
  on public.customer_feedback_images
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
