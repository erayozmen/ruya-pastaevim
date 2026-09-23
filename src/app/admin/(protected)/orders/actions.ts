"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Enums, TablesUpdate } from "@/lib/database/helpers";

export type FormState = { error?: string; success?: boolean } | undefined;

const ORDER_STATUSES: Enums<"order_status">[] = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
];

function isOrderStatus(value: string): value is Enums<"order_status"> {
  return (ORDER_STATUSES as string[]).includes(value);
}

export async function updateOrderRequest(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const statusRaw = String(formData.get("status") ?? "");
  if (!isOrderStatus(statusRaw)) return { error: "Geçersiz durum." };

  const estimatedRaw = String(formData.get("estimated_price") ?? "").trim();
  const quotedRaw = String(formData.get("quoted_price") ?? "").trim();
  const estimatedPrice = estimatedRaw === "" ? null : Number(estimatedRaw);
  const quotedPrice = quotedRaw === "" ? null : Number(quotedRaw);

  if (estimatedRaw !== "" && (estimatedPrice === null || Number.isNaN(estimatedPrice))) {
    return { error: "Tahmini fiyat geçerli bir sayı olmalıdır." };
  }
  if (quotedRaw !== "" && (quotedPrice === null || Number.isNaN(quotedPrice))) {
    return { error: "Verilen teklif geçerli bir sayı olmalıdır." };
  }

  const values: TablesUpdate<"order_requests"> = {
    status: statusRaw,
    estimated_price: estimatedPrice,
    quoted_price: quotedPrice,
  };

  const supabase = await createClient();
  const { error } = await supabase.from("order_requests").update(values).eq("id", id);
  if (error) return { error: `Güncellenemedi: ${error.message}` };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
