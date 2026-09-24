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
  /** Hidden form field real visitors never fill in; non-empty means a bot. */
  honeypot: string;
}

export type OrderRequestResult = { success: true } | { success: false; error: string };

const MAX_NOTE_LENGTH = 500;
/** Same phone number can't submit again within this window. Short on
 * purpose — a genuine customer retrying after a network hiccup shouldn't
 * be blocked, this only stops rapid repeated/automated submissions. */
const COOLDOWN_SECONDS = 120;

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

const GENERIC_FAILURE = "Sipariş talebiniz kaydedilemedi. Lütfen tekrar deneyin.";

export async function createOrderRequest(input: OrderRequestInput): Promise<OrderRequestResult> {
  // Bots that blindly fill every field trip the honeypot. Real visitors
  // never see or fill this field, so any value here means "not human" —
  // rejected with the same generic message a real failure would get, so
  // nothing reveals that bot detection specifically caused it.
  if (input.honeypot.trim() !== "") {
    console.error("[order-requests] honeypot field was filled — rejecting as spam");
    return { success: false, error: GENERIC_FAILURE };
  }

  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const supabase = await createClient();

  const phoneDigits = input.phone.replace(/\D/g, "");
  const { data: recentlySubmitted, error: cooldownError } = await supabase.rpc("check_recent_order_request", {
    p_phone_digits: phoneDigits,
    p_cooldown_seconds: COOLDOWN_SECONDS,
  });
  if (cooldownError) {
    console.error("[order-requests] cooldown check failed:", cooldownError.message);
  } else if (recentlySubmitted) {
    return {
      success: false,
      error: "Çok kısa sürede tekrar talep gönderildi. Lütfen birkaç dakika sonra tekrar deneyin.",
    };
  }

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
    return { success: false, error: GENERIC_FAILURE };
  }

  return { success: true };
}
