"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TablesUpdate } from "@/lib/database/helpers";

export type FormState = { error?: string; success?: boolean } | undefined;

export async function updateHomepageSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  const storyTitle = String(formData.get("story_title") ?? "").trim();
  const storyText = String(formData.get("story_text") ?? "").trim();

  if (!storyTitle) return { error: "Hikayemiz başlığı zorunludur." };
  if (!storyText) return { error: "Hikayemiz metni zorunludur." };

  const values: TablesUpdate<"site_settings"> = {
    hero_image_url: String(formData.get("hero_image_url") ?? "").trim() || null,
    story_title: storyTitle,
    story_text: storyText,
    story_image_url: String(formData.get("story_image_url") ?? "").trim() || null,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").update(values).eq("id", true);
  if (error) return { error: `Kaydedilemedi: ${error.message}` };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
