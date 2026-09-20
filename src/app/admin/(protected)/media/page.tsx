import { createClient } from "@/lib/supabase/server";
import { MediaLibrary, type MediaItem } from "./MediaLibrary";

const BUCKET = "media";
const AREA = "cakes";

export default async function AdminMediaPage() {
  const supabase = await createClient();

  const { data: objects, error } = await supabase.storage.from(BUCKET).list(AREA, {
    limit: 500,
    sortBy: { column: "name", order: "asc" },
  });

  const items: MediaItem[] = (objects ?? [])
    .filter((object) => object.id !== null)
    .map((object) => {
      const path = `${AREA}/${object.name}`;
      const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
      return {
        name: object.name,
        path,
        publicUrl: publicUrlData.publicUrl,
        size: object.metadata?.size ?? null,
        mimetype: object.metadata?.mimetype ?? null,
        updatedAt: object.updated_at ?? null,
      };
    });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Medya Kütüphanesi</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Görseller yüklenemedi: {error.message}
        </div>
      )}

      <MediaLibrary items={items} />
    </div>
  );
}
