"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Tables } from "@/lib/database/helpers";
import { updateOrderRequest } from "../actions";

const STATUS_OPTIONS: { value: Tables<"order_requests">["status"]; label: string }[] = [
  { value: "NEW", label: "Yeni" },
  { value: "CONTACTED", label: "İletişime Geçildi" },
  { value: "QUOTED", label: "Teklif Verildi" },
  { value: "CONFIRMED", label: "Onaylandı" },
  { value: "COMPLETED", label: "Tamamlandı" },
  { value: "CANCELLED", label: "İptal Edildi" },
];

const inputClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500";

export function OrderStatusForm({ order }: { order: Tables<"order_requests"> }) {
  const action = updateOrderRequest.bind(null, order.id);
  const [state, formAction, pending] = useActionState(action, undefined);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm font-medium text-neutral-700">Durum</label>
        <select id="status" name="status" defaultValue={order.status} className={inputClass}>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="estimated_price" className="text-sm font-medium text-neutral-700">Tahmini Fiyat (TL)</label>
        <input
          id="estimated_price"
          name="estimated_price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={order.estimated_price ?? ""}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="quoted_price" className="text-sm font-medium text-neutral-700">Verilen Teklif (TL)</label>
        <input
          id="quoted_price"
          name="quoted_price"
          type="number"
          min={0}
          step="0.01"
          defaultValue={order.quoted_price ?? ""}
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Kaydedildi.</p>}

      <div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
