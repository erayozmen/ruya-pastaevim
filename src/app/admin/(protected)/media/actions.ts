"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "media";

// Only "cakes" is wired up today. Adding a new area later just means adding
// it here and to the folder select in the UI — no other code path changes.
const MEDIA_AREAS = ["cakes"] as const;
type MediaArea = (typeof MEDIA_AREAS)[number];

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function isMediaArea(value: string): value is MediaArea {
  return (MEDIA_AREAS as readonly string[]).includes(value);
}

function sanitizeFilename(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  const ext = dotIndex > 0 ? name.slice(dotIndex).toLowerCase().replace(/[^a-z0-9.]/g, "") : "";
  const base = dotIndex > 0 ? name.slice(0, dotIndex) : name;
  const safeBase =
    base
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "dosya";
  return safeBase + ext;
}

export type MediaItem = {
  name: string;
  path: string;
  publicUrl: string;
  size: number | null;
  mimetype: string | null;
  updatedAt: string | null;
};

export async function listMediaItems(area: string = "cakes"): Promise<MediaItem[]> {
  if (!isMediaArea(area)) return [];

  const supabase = await createClient();
  const { data: objects } = await supabase.storage.from(BUCKET).list(area, {
    limit: 500,
    sortBy: { column: "name", order: "asc" },
  });

  return (objects ?? [])
    .filter((object) => object.id !== null)
    .map((object) => {
      const path = `${area}/${object.name}`;
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
}

export type UploadState = { error?: string; success?: string } | undefined;

export async function uploadMedia(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  const areaRaw = String(formData.get("area") ?? "");
  const file = formData.get("file");

  if (!isMediaArea(areaRaw)) {
    return { error: "Geçersiz klasör." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Bir dosya seçin." };
  }
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return { error: "Yalnızca JPEG, PNG, WEBP veya GIF görselleri yüklenebilir." };
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    return { error: "Dosya boyutu 8MB sınırını aşıyor." };
  }

  const supabase = await createClient();
  const safeName = sanitizeFilename(file.name);

  const { data: existing } = await supabase.storage.from(BUCKET).list(areaRaw, { limit: 1000 });
  const existingNames = new Set((existing ?? []).map((o) => o.name));

  let finalName = safeName;
  if (existingNames.has(finalName)) {
    const dotIndex = safeName.lastIndexOf(".");
    const ext = dotIndex > 0 ? safeName.slice(dotIndex) : "";
    const base = dotIndex > 0 ? safeName.slice(0, dotIndex) : safeName;
    let n = 1;
    while (existingNames.has(`${base}-${n}${ext}`)) {
      n += 1;
    }
    finalName = `${base}-${n}${ext}`;
  }

  const path = `${areaRaw}/${finalName}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    return { error: `Yükleme başarısız: ${error.message}` };
  }

  revalidatePath("/admin/media");
  return { success: `"${finalName}" yüklendi.` };
}

export type DeleteResult = { error?: string; success?: boolean };

export async function deleteMedia(path: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const { data: publicUrlData } = supabase.storage.from(BUCKET).getPublicUrl(path);
  const publicUrl = publicUrlData.publicUrl;

  const [cakeRef, cakeImageRef, galleryRef, reviewRef] = await Promise.all([
    supabase.from("cakes").select("id", { count: "exact", head: true }).eq("main_image_url", publicUrl),
    supabase.from("cake_images").select("id", { count: "exact", head: true }).eq("image_url", publicUrl),
    supabase.from("gallery_items").select("id", { count: "exact", head: true }).eq("image_url", publicUrl),
    supabase.from("reviews").select("id", { count: "exact", head: true }).eq("photo_url", publicUrl),
  ]);

  const totalReferences =
    (cakeRef.count ?? 0) + (cakeImageRef.count ?? 0) + (galleryRef.count ?? 0) + (reviewRef.count ?? 0);

  if (totalReferences > 0) {
    return { error: "Bu görsel şu içeriklerde kullanılıyor, önce bağlantıyı kaldırın." };
  }

  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) {
    return { error: `Silinemedi: ${error.message}` };
  }

  revalidatePath("/admin/media");
  return { success: true };
}
