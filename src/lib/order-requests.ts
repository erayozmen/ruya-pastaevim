"use server";

import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/database/helpers";

export interface OrderRequestInput {
  customerName: string;
  phone: string;
  portion: string;
  theme: string;
  color: string;
  flavor: string;
  note: string;
}

export type OrderRequestResult = { success: true } | { success: false; error: string };

const MAX_NOTE_LENGTH = 500;

function validateInput(input: OrderRequestInput): string | null {
  if (!input.customerName.trim()) return "Adınızı girin.";
  if (input.customerName.trim().length > 120) return "Ad çok uzun.";

  const digits = input.phone.replace(/\D/g, "");
  if (digits.length < 10) return "Geçerli bir telefon numarası girin.";

  if (input.note.length > MAX_NOTE_LENGTH) return "Not en fazla 500 karakter olabilir.";

  if (!input.portion || !input.theme || !input.color || !input.flavor) {
    return "Lütfen tüm seçimleri tamamlayın.";
  }

  return null;
}

/**
 * Re-validates the client's selected option *values* against what is
 * actually active in the database right now. The customizer UI only ever
 * renders buttons for active options, but a client-submitted value should
 * never be trusted blindly — an admin may have deactivated an option
 * between page load and submit, or the value could be tampered with.
 */
async function verifyOptionsAreActive(
  supabase: Awaited<ReturnType<typeof createClient>>,
  input: OrderRequestInput,
): Promise<string | null> {
  const [portionRes, themeRes, colorRes, flavorRes] = await Promise.all([
    supabase
      .from("customizer_portions")
      .select("value")
      .eq("is_active", true)
      .eq("value", input.portion)
      .maybeSingle(),
    supabase
      .from("customizer_themes")
      .select("value")
      .eq("is_active", true)
      .eq("value", input.theme)
      .maybeSingle(),
    supabase
      .from("customizer_colors")
      .select("value")
      .eq("is_active", true)
      .eq("value", input.color)
      .maybeSingle(),
    supabase
      .from("customizer_flavors")
      .select("value")
      .eq("is_active", true)
      .eq("value", input.flavor)
      .maybeSingle(),
  ]);

  if (!portionRes.data) return "Seçilen kişi sayısı artık geçerli değil. Lütfen tekrar seçin.";
  if (!themeRes.data) return "Seçilen tema artık geçerli değil. Lütfen tekrar seçin.";
  if (!colorRes.data) return "Seçilen renk artık geçerli değil. Lütfen tekrar seçin.";
  if (!flavorRes.data) return "Seçilen lezzet artık geçerli değil. Lütfen tekrar seçin.";

  return null;
}

export async function createOrderRequest(input: OrderRequestInput): Promise<OrderRequestResult> {
  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();

  const optionsError = await verifyOptionsAreActive(supabase, input);
  if (optionsError) {
    return { success: false, error: optionsError };
  }

  const payload: TablesInsert<"order_requests"> = {
    customer_name: input.customerName.trim(),
    phone: input.phone.trim(),
    portion_label: input.portion,
    theme_label: input.theme,
    color_label: input.color,
    flavor_label: input.flavor,
    note: input.note.trim() || null,
  };

  // Anonymous visitors have INSERT-only RLS on order_requests — a plain
  // insert (no .select()) is required, since a follow-up SELECT of the
  // inserted row would be denied by RLS and fail the whole request.
  const { error } = await supabase.from("order_requests").insert(payload);

  if (error) {
    return { success: false, error: "Sipariş talebiniz kaydedilemedi. Lütfen tekrar deneyin." };
  }

  return { success: true };
}
