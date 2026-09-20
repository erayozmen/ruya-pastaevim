-- Public media bucket for site imagery (cake photos, gallery, reviews, about).
-- Public bucket: the public site displays these images directly by URL, same
-- trust level as the existing public-read tables (categories, cakes, etc).
-- Only admins may write; nobody may INSERT/UPDATE/DELETE without is_admin().

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "media_admin_insert"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_admin_update"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

create policy "media_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'media' and public.is_admin());
