"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database/helpers";

export type FormState = { error?: string } | undefined;

function parseGalleryForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const imageUrl = String(formData.get("image_url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const sortOrder = Number(String(formData.get("sort_order") ?? "0").trim());

  const values: TablesInsert<"gallery_items"> = {
    title,
    description: description || null,
    image_url: imageUrl,
    category_id: categoryId || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: formData.get("is_active") === "on",
  };
  return values;
}

function validate(values: TablesInsert<"gallery_items">): string | undefined {
  if (!values.title) return "Başlık zorunludur.";
  if (!values.image_url) return "Medya Kütüphanesi'nden bir görsel seçin.";
  return undefined;
}

export async function createGalleryItem(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = parseGalleryForm(formData);
  const invalid = validate(values);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").insert(values);
  if (error) return { error: `Galeri görseli oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function updateGalleryItem(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const values = parseGalleryForm(formData);
  const invalid = validate(values);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").update(values).eq("id", id);
  if (error) return { error: `Galeri görseli güncellenemedi: ${error.message}` };

  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}

export async function deleteGalleryItem(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("gallery_items").delete().eq("id", id);
  if (error) {
    redirect(`/admin/gallery?error=${encodeURIComponent(`Silinemedi: ${error.message}`)}`);
  }
  revalidatePath("/admin/gallery");
  redirect("/admin/gallery");
}
