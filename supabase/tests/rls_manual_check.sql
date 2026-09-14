-- Manual RLS verification script for local `supabase start`.
-- Run with: psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f supabase/tests/rls_manual_check.sql
-- Not a migration — kept out of supabase/migrations on purpose so it is
-- never applied to a real database.

\echo '--- 1. Tables exist ---'
select table_name
from information_schema.tables
where table_schema = 'public'
order by table_name;

\echo '--- 2. RLS enabled on every public table ---'
select relname, relrowsecurity
from pg_class
join pg_namespace on pg_namespace.oid = pg_class.relnamespace
where pg_namespace.nspname = 'public' and relkind = 'r'
order by relname;

\echo '--- 3. Foreign keys ---'
select
  tc.table_name, kcu.column_name, ccu.table_name as references_table,
  rc.delete_rule
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu on tc.constraint_name = kcu.constraint_name
join information_schema.constraint_column_usage ccu on tc.constraint_name = ccu.constraint_name
join information_schema.referential_constraints rc on tc.constraint_name = rc.constraint_name
where tc.constraint_type = 'FOREIGN KEY' and tc.table_schema = 'public'
order by tc.table_name;

\echo '--- 4. Check + unique constraints ---'
select conrelid::regclass as table_name, conname, contype, pg_get_constraintdef(oid)
from pg_constraint
where connamespace = 'public'::regnamespace and contype in ('c', 'u')
order by conrelid::regclass::text;

\echo '--- 5. Anonymous SELECT on categories only returns is_active = true ---'
set role anon;
select slug, is_active from public.categories order by sort_order;
reset role;

\echo '(inserting one inactive category as postgres to prove the filter works)'
insert into public.categories (name, slug, is_active) values ('Gizli Kategori', 'gizli-kategori', false);
set role anon;
select slug, is_active from public.categories order by sort_order;
\echo 'Expected: gizli-kategori must NOT appear above.'
reset role;
delete from public.categories where slug = 'gizli-kategori';

\echo '--- 6. Anonymous can INSERT an order_request ---'
-- NOTE: no RETURNING here on purpose. Postgres RLS checks a RETURNING
-- clause against the table's SELECT policies too, and anon has no SELECT
-- policy on order_requests (by design — see migration comments). A
-- client-side `.insert(...).select()` would fail the same way; the
-- Sprint 6 order form must do a plain insert (Supabase JS default
-- `return=minimal`) and not chain `.select()` on it.
set role anon;
insert into public.order_requests (customer_name, phone, portion_label, theme_label, color_label, flavor_label)
values ('Test Müşteri', '05551112233', '6-8 Kişilik', '🎀 Romantik', 'Pudra Pembe', 'Belçika Çikolatası & Taze Çilek');
reset role;

\echo '--- 7. Anonymous SELECT on order_requests must return ZERO rows ---'
set role anon;
select count(*) as anon_visible_orders from public.order_requests;
reset role;

\echo '--- 8. Anonymous UPDATE on order_requests must affect ZERO rows ---'
set role anon;
update public.order_requests set status = 'CANCELLED';
\echo 'Rows affected above must be 0 (RLS blocks it, not a real bypass).'
reset role;

\echo '--- 9. Rating check constraint rejects out-of-range values ---'
do $$
begin
  begin
    insert into public.reviews (customer_name, content, rating)
    values ('Test', 'test', 9);
    raise exception 'CHECK CONSTRAINT FAILED TO BLOCK rating = 9';
  exception when check_violation then
    raise notice 'OK: rating check constraint correctly rejected rating = 9';
  end;
end $$;

\echo '--- 10. site_settings stays a singleton ---'
do $$
begin
  begin
    insert into public.site_settings (id, brand_name, baker_name, instagram_username, instagram_url, whatsapp_number, phone)
    values (true, 'x', 'x', 'x', 'x', 'x', 'x');
    raise exception 'SINGLETON CONSTRAINT FAILED TO BLOCK second row';
  exception when unique_violation then
    raise notice 'OK: second site_settings row correctly rejected';
  end;
end $$;

\echo '--- 11. Setup: one fake auth.users row + ADMIN profile, one with no profile ---'
insert into auth.users (id, email, instance_id, aud, role)
values
  ('11111111-1111-1111-1111-111111111111', 'admin-test@example.com', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'no-role-test@example.com', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated');
insert into public.profiles (id, role) values ('11111111-1111-1111-1111-111111111111', 'ADMIN');
-- deliberately no profiles row for the second user

\echo '--- 12. Authenticated non-admin cannot read order_requests ---'
set role authenticated;
set request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
select count(*) as non_admin_visible_orders from public.order_requests;
reset role;
reset request.jwt.claims;

\echo '--- 13. Admin (authenticated + profiles.role = ADMIN) can read and update order_requests ---'
set role authenticated;
set request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
select count(*) as admin_visible_orders from public.order_requests;
update public.order_requests set status = 'CONTACTED' where status = 'NEW';
select status, count(*) from public.order_requests group by status;
reset role;
reset request.jwt.claims;

\echo '--- 14. Admin can write to categories/cakes/customizer tables; non-admin cannot ---'
set role authenticated;
set request.jwt.claims to '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';
insert into public.categories (name, slug) values ('Admin Test Kategori', 'admin-test-kategori');
\echo 'Expected: INSERT 0 1 above (admin insert succeeds).'
delete from public.categories where slug = 'admin-test-kategori';
reset role;
reset request.jwt.claims;

set role authenticated;
set request.jwt.claims to '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
do $$
begin
  begin
    insert into public.categories (name, slug) values ('Should Fail', 'should-fail');
    raise exception 'NON-ADMIN INSERT SHOULD HAVE BEEN BLOCKED';
  exception when insufficient_privilege or others then
    raise notice 'OK: non-admin insert into categories correctly blocked';
  end;
end $$;
reset role;
reset request.jwt.claims;

\echo '--- Cleanup: remove test rows created by this script ---'
delete from public.order_requests where customer_name = 'Test Müşteri';
delete from public.profiles where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');
delete from auth.users where id in ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222');

\echo '--- Done ---'
