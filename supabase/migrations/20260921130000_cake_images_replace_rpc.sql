-- Admin helper: replace a cake's gallery images in one atomic statement.
--
-- Called from the admin cake form on both create and edit — the form always
-- submits the full desired ordered list of image URLs, so "remove" and
-- "reorder" are just resubmitting a shorter/reordered array rather than
-- needing separate granular operations. security invoker (the default) means
-- this still runs as the calling user, so the existing
-- `cake_images_admin_full_access` RLS policy (requires is_admin()) gates it
-- exactly as it would a plain insert/delete.
create or replace function public.admin_replace_cake_images(p_cake_id uuid, p_image_urls text[])
returns void
language plpgsql
as $$
begin
  delete from public.cake_images where cake_id = p_cake_id;

  insert into public.cake_images (cake_id, image_url, sort_order)
  select p_cake_id, url, (ord - 1)::int
  from unnest(p_image_urls) with ordinality as t(url, ord);
end;
$$;
