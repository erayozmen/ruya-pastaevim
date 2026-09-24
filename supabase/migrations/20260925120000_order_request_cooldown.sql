-- Anti-spam cooldown check for the public "Pastanı Tasarla" order form.
--
-- The form has anon INSERT-only RLS on order_requests (no SELECT), which
-- is correct and stays that way. To let the server-action check "has this
-- phone number submitted very recently?" without granting anon any SELECT
-- access to the table, this is a SECURITY DEFINER function that returns
-- only a boolean — never any row content. `anon`/`authenticated` can only
-- ever learn "yes/no was there a recent request from this phone", nothing
-- about who else submitted, what they ordered, or how many rows exist.
create or replace function public.check_recent_order_request(
  p_phone_digits text,
  p_cooldown_seconds integer default 120
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.order_requests
    where regexp_replace(phone, '\D', '', 'g') = p_phone_digits
      and created_at > now() - (p_cooldown_seconds || ' seconds')::interval
  );
$$;

grant execute on function public.check_recent_order_request(text, integer) to anon, authenticated;
