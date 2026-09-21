"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database/helpers";

export type FormState = { error?: string } | undefined;

function parseReviewForm(formData: FormData) {
  const rating = Number(String(formData.get("rating") ?? "5"));
  const sortOrder = Number(String(formData.get("sort_order") ?? "0").trim());

  const values: TablesInsert<"reviews"> = {
    customer_name: String(formData.get("customer_name") ?? "").trim(),
    content: String(formData.get("content") ?? "").trim(),
    rating,
    photo_url: String(formData.get("photo_url") ?? "").trim() || null,
    cake_id: String(formData.get("cake_id") ?? "").trim() || null,
    category_id: String(formData.get("category_id") ?? "").trim() || null,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: formData.get("is_active") === "on",
  };
  return values;
}

function validate(values: TablesInsert<"reviews">): string | undefined {
  if (!values.customer_name) return "Müşteri adı zorunludur.";
  if (!values.content) return "Yorum metni zorunludur.";
  if (!Number.isInteger(values.rating) || values.rating < 1 || values.rating > 5) {
    return "Puan 1 ile 5 arasında olmalıdır.";
  }
  return undefined;
}

export async function createReview(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = parseReviewForm(formData);
  const invalid = validate(values);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert(values);
  if (error) return { error: `Yorum oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function updateReview(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const values = parseReviewForm(formData);
  const invalid = validate(values);
  if (invalid) return { error: invalid };

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update(values).eq("id", id);
  if (error) return { error: `Yorum güncellenemedi: ${error.message}` };

  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}

export async function deleteReview(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) {
    redirect(`/admin/reviews?error=${encodeURIComponent(`Silinemedi: ${error.message}`)}`);
  }
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  redirect("/admin/reviews");
}
