-- Server-only storage for the Instagram Business Login long-lived access
-- token. A single Instagram account is connected, so this is a singleton
-- row (same pattern as `site_settings`): `id` is fixed to `true`, and a
-- check constraint prevents a second row from ever being inserted.
--
-- RLS is enabled but deliberately has NO policies for `anon` or
-- `authenticated` — by default that means those roles can select, insert,
-- update or delete precisely nothing here. Only the Postgres `service_role`
-- (which bypasses RLS entirely) can touch this table, and only
-- `src/lib/supabase/service.ts` (server-only) is allowed to use that key.
create table public.instagram_oauth_tokens (
  id boolean primary key default true,
  access_token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint instagram_oauth_tokens_singleton check (id)
);

create trigger set_instagram_oauth_tokens_updated_at
  before update on public.instagram_oauth_tokens
  for each row
  execute function public.set_updated_at();

alter table public.instagram_oauth_tokens enable row level security;
-- No policies for anon/authenticated: RLS default-denies everything to
-- them. Only service_role (bypasses RLS) can read or write this table.
