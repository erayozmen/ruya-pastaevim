-- Extensions and shared helper functions used by every later migration.

create extension if not exists "pgcrypto";

-- Generic trigger function: keeps `updated_at` current on every UPDATE.
-- Reused by every table below that has an `updated_at` column.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
