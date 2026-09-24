"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { TablesInsert, TablesUpdate } from "@/lib/database/helpers";

export type FormState = { error?: string } | undefined;

function parseCakeForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const main_image_url = String(formData.get("main_image_url") ?? "").trim();
  const categoryId = String(formData.get("category_id") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "0").trim();
  const sortOrder = Number(sortOrderRaw);
  const price = priceRaw === "" ? null : Number(priceRaw);

  return {
    name,
    slug: slugify(slugInput || name),
    description: description || null,
    main_image_url: main_image_url || null,
    category_id: categoryId || null,
    price,
    priceRaw,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    show_price: formData.get("show_price") === "on",
    is_featured: formData.get("is_featured") === "on",
    is_active: formData.get("is_active") === "on",
  };
}

function validateCake(values: ReturnType<typeof parseCakeForm>): string | undefined {
  if (!values.name) return "Ürün adı zorunludur.";
  if (!values.slug) return "Geçerli bir slug oluşturulamadı.";
  if (!values.category_id) return "Kategori seçimi zorunludur.";
  if (values.priceRaw !== "" && (values.price === null || Number.isNaN(values.price))) {
    return "Fiyat geçerli bir sayı olmalıdır.";
  }
  if (values.price !== null && values.price < 0) {
    return "Fiyat negatif olamaz.";
  }
  return undefined;
}

function parseGalleryImageUrls(formData: FormData): string[] {
  const raw = String(formData.get("gallery_image_urls") ?? "[]");
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((url): url is string => typeof url === "string" && url.length > 0);
  } catch {
    return [];
  }
}

export async function createCake(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = parseCakeForm(formData);
  const validationError = validateCake(values);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const payload: TablesInsert<"cakes"> = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    main_image_url: values.main_image_url,
    category_id: values.category_id,
    price: values.price,
    sort_order: values.sort_order,
    show_price: values.show_price,
    is_featured: values.is_featured,
    is_active: values.is_active,
  };

  const galleryImageUrls = parseGalleryImageUrls(formData);

  const { data: inserted, error } = await supabase.from("cakes").insert(payload).select("id").single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Bu slug zaten kullanılıyor. Farklı bir slug deneyin." };
    }
    if (error.code === "23503") {
      return { error: "Seçilen kategori bulunamadı." };
    }
    if (error.code === "23514") {
      return { error: "Fiyat 0 veya daha büyük olmalıdır." };
    }
    return { error: `Pasta oluşturulamadı: ${error.message}` };
  }

  if (galleryImageUrls.length > 0) {
    const { error: imagesError } = await supabase.rpc("admin_replace_cake_images", {
      p_cake_id: inserted.id,
      p_image_urls: galleryImageUrls,
    });
    if (imagesError) {
      revalidatePath("/admin/cakes");
      redirect(
        `/admin/cakes/${inserted.id}/edit?error=${encodeURIComponent(
          `Pasta kaydedildi ama galeri görselleri kaydedilemedi: ${imagesError.message}. Buradan tekrar ekleyebilirsiniz.`,
        )}`,
      );
    }
  }

  revalidatePath("/admin/cakes");
  redirect("/admin/cakes");
}

export async function updateCake(id: string, _prevState: FormState, formData: FormData): Promise<FormState> {
  const values = parseCakeForm(formData);
  const validationError = validateCake(values);
  if (validationError) return { error: validationError };

  const supabase = await createClient();
  const payload: TablesUpdate<"cakes"> = {
    name: values.name,
    slug: values.slug,
    description: values.description,
    main_image_url: values.main_image_url,
    category_id: values.category_id,
    price: values.price,
    sort_order: values.sort_order,
    show_price: values.show_price,
    is_featured: values.is_featured,
    is_active: values.is_active,
  };

  const galleryImageUrls = parseGalleryImageUrls(formData);

  const { error } = await supabase.from("cakes").update(payload).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Bu slug zaten kullanılıyor. Farklı bir slug deneyin." };
    }
    if (error.code === "23503") {
      return { error: "Seçilen kategori bulunamadı." };
    }
    if (error.code === "23514") {
      return { error: "Fiyat 0 veya daha büyük olmalıdır." };
    }
    return { error: `Pasta güncellenemedi: ${error.message}` };
  }

  // Always replace, even with an empty array — otherwise removing every
  // gallery image down to zero on the form would have no effect.
  const { error: imagesError } = await supabase.rpc("admin_replace_cake_images", {
    p_cake_id: id,
    p_image_urls: galleryImageUrls,
  });
  if (imagesError) {
    return { error: `Pasta güncellendi ama galeri görselleri kaydedilemedi: ${imagesError.message}` };
  }

  revalidatePath("/admin/cakes");
  redirect("/admin/cakes");
}

export async function deleteCake(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("cakes").delete().eq("id", id);

  if (error) {
    redirect(`/admin/cakes?error=${encodeURIComponent(`Pasta silinemedi: ${error.message}`)}`);
  }

  revalidatePath("/admin/cakes");
  redirect("/admin/cakes?deleted=1");
}
