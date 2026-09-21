"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import type { TablesInsert, TablesUpdate } from "@/lib/database/helpers";

export type FormState = { error?: string } | undefined;

function parseCategoryForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const image_url = String(formData.get("image_url") ?? "").trim();
  const icon_emoji = String(formData.get("icon_emoji") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "0").trim();
  const sortOrder = Number(sortOrderRaw);

  return {
    name,
    slug: slugify(slugInput || name),
    description: description || null,
    image_url: image_url || null,
    icon_emoji: icon_emoji || null,
    product_group: formData.get("product_group") === "pastry" ? "pastry" : "cake",

    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: formData.get("is_active") === "on",
    show_on_home: formData.get("show_on_home") === "on",
  };
}

export async function createCategory(_prevState: FormState, formData: FormData): Promise<FormState> {
  const values = parseCategoryForm(formData);

  if (!values.name) {
    return { error: "Kategori adı zorunludur." };
  }
  if (!values.slug) {
    return { error: "Geçerli bir slug oluşturulamadı." };
  }

  const supabase = await createClient();
  const payload: TablesInsert<"categories"> = values;
  const { error } = await supabase.from("categories").insert(payload);

  if (error) {
    if (error.code === "23505") {
      return { error: "Bu slug zaten kullanılıyor. Farklı bir slug deneyin." };
    }
    return { error: `Kategori oluşturulamadı: ${error.message}` };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const values = parseCategoryForm(formData);

  if (!values.name) {
    return { error: "Kategori adı zorunludur." };
  }
  if (!values.slug) {
    return { error: "Geçerli bir slug oluşturulamadı." };
  }

  const supabase = await createClient();
  const payload: TablesUpdate<"categories"> = values;
  const { error } = await supabase.from("categories").update(payload).eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Bu slug zaten kullanılıyor. Farklı bir slug deneyin." };
    }
    return { error: `Kategori güncellenemedi: ${error.message}` };
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error?.code === "23503") {
    redirect(
      `/admin/categories?error=${encodeURIComponent(
        "Bu kategoriye bağlı ürünler var. Önce onları başka bir kategoriye taşıyın veya silin.",
      )}`,
    );
  }
  if (error) {
    redirect(`/admin/categories?error=${encodeURIComponent(`Kategori silinemedi: ${error.message}`)}`);
  }

  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}
