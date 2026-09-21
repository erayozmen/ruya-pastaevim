import type { SupabaseClient } from "@supabase/supabase-js";

const REFERENCE_COLUMNS = [
  ["categories", "image_url"],
  ["cakes", "main_image_url"],
  ["cake_images", "image_url"],
  ["gallery_items", "image_url"],
  ["reviews", "photo_url"],
] as const;

/**
 * How many content rows point at this exact Storage public URL. A read
 * failure counts as "in use" so an unverifiable image is never deleted.
 */
export async function countMediaReferences(supabase: SupabaseClient, publicUrl: string): Promise<number> {
  const results = await Promise.all(
    REFERENCE_COLUMNS.map(([table, column]) =>
      supabase.from(table).select("id", { count: "exact", head: true }).eq(column, publicUrl),
    ),
  );
  return results.reduce((total, result) => total + (result.error ? 1 : (result.count ?? 0)), 0);
}

/** Removes a media object only when nothing references it. */
export async function deleteMediaIfUnreferenced(
  supabase: SupabaseClient,
  bucket: string,
  path: string,
): Promise<{ error?: string; success?: boolean }> {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  if ((await countMediaReferences(supabase, data.publicUrl)) > 0) {
    return { error: "Bu görsel şu içeriklerde kullanılıyor, önce bağlantıyı kaldırın." };
  }

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) return { error: `Silinemedi: ${error.message}` };
  return { success: true };
}
