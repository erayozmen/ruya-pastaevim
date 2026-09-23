"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert, TablesUpdate } from "@/lib/database/helpers";

export type FormState = { error?: string; success?: boolean } | undefined;
export type DeleteResult = { error?: string };

function parseCommon(formData: FormData) {
  const value = String(formData.get("value") ?? "").trim();
  const label = String(formData.get("label") ?? "").trim();
  const sortOrderRaw = String(formData.get("sort_order") ?? "0").trim();
  const sortOrder = Number(sortOrderRaw);
  return {
    value,
    label,
    sort_order: Number.isFinite(sortOrder) ? sortOrder : 0,
    is_active: formData.get("is_active") === "on",
  };
}

function uniqueValueError(error: { code?: string; message: string }): string | undefined {
  if (error.code === "23505") return "Bu değer (value) zaten kullanılıyor. Farklı bir değer girin.";
  return undefined;
}

// ---------- Portions ----------

export async function createPortion(_prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesInsert<"customizer_portions"> = {
    ...common,
    emoji: String(formData.get("emoji") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_portions").insert(payload);
  if (error) return { error: uniqueValueError(error) ?? `Oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function updatePortion(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesUpdate<"customizer_portions"> = {
    ...common,
    emoji: String(formData.get("emoji") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_portions").update(payload).eq("id", id);
  if (error) return { error: uniqueValueError(error) ?? `Güncellenemedi: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function deletePortion(id: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("customizer_portions").delete().eq("id", id);
  if (error) return { error: `Silinemedi: ${error.message}` };
  revalidatePath("/admin/customizer");
  return {};
}

// ---------- Themes ----------

export async function createTheme(_prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesInsert<"customizer_themes"> = {
    ...common,
    emoji: String(formData.get("emoji") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_themes").insert(payload);
  if (error) return { error: uniqueValueError(error) ?? `Oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function updateTheme(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesUpdate<"customizer_themes"> = {
    ...common,
    emoji: String(formData.get("emoji") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_themes").update(payload).eq("id", id);
  if (error) return { error: uniqueValueError(error) ?? `Güncellenemedi: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function deleteTheme(id: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("customizer_themes").delete().eq("id", id);
  if (error) return { error: `Silinemedi: ${error.message}` };
  revalidatePath("/admin/customizer");
  return {};
}

// ---------- Colors ----------

export async function createColor(_prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesInsert<"customizer_colors"> = {
    ...common,
    swatch_hex: String(formData.get("swatch_hex") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_colors").insert(payload);
  if (error) return { error: uniqueValueError(error) ?? `Oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function updateColor(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesUpdate<"customizer_colors"> = {
    ...common,
    swatch_hex: String(formData.get("swatch_hex") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_colors").update(payload).eq("id", id);
  if (error) return { error: uniqueValueError(error) ?? `Güncellenemedi: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function deleteColor(id: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("customizer_colors").delete().eq("id", id);
  if (error) return { error: `Silinemedi: ${error.message}` };
  revalidatePath("/admin/customizer");
  return {};
}

// ---------- Flavors ----------

export async function createFlavor(_prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesInsert<"customizer_flavors"> = common;

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_flavors").insert(payload);
  if (error) return { error: uniqueValueError(error) ?? `Oluşturulamadı: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function updateFlavor(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const common = parseCommon(formData);
  if (!common.value || !common.label) return { error: "Değer ve etiket zorunludur." };

  const payload: TablesUpdate<"customizer_flavors"> = common;

  const supabase = await createClient();
  const { error } = await supabase.from("customizer_flavors").update(payload).eq("id", id);
  if (error) return { error: uniqueValueError(error) ?? `Güncellenemedi: ${error.message}` };

  revalidatePath("/admin/customizer");
  return { success: true };
}

export async function deleteFlavor(id: string): Promise<DeleteResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("customizer_flavors").delete().eq("id", id);
  if (error) return { error: `Silinemedi: ${error.message}` };
  revalidatePath("/admin/customizer");
  return {};
}
