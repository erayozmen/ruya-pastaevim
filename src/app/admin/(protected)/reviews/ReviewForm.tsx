"use client";

import { useActionState, useState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";
import { MediaPicker } from "../media/MediaPicker";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const inputClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500";

export function ReviewForm({
  action,
  review,
  categories,
  cakes,
}: {
  action: Action;
  review?: Tables<"reviews">;
  categories: Pick<Tables<"categories">, "id" | "name">[];
  cakes: Pick<Tables<"cakes">, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [photoUrl, setPhotoUrl] = useState<string | null>(review?.photo_url ?? null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customer_name" className="text-sm font-medium text-neutral-700">Müşteri Adı *</label>
        <input id="customer_name" name="customer_name" type="text" required defaultValue={review?.customer_name} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="content" className="text-sm font-medium text-neutral-700">Yorum *</label>
        <textarea id="content" name="content" rows={4} required defaultValue={review?.content} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="rating" className="text-sm font-medium text-neutral-700">Puan *</label>
        <select id="rating" name="rating" defaultValue={review?.rating ?? 5} className={inputClass}>
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Müşteri Fotoğrafı (isteğe bağlı)</span>
        <input type="hidden" name="photo_url" value={photoUrl ?? ""} />
        <div className="flex items-center gap-3">
          {photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoUrl} alt="Müşteri fotoğrafı" className="h-20 w-20 rounded-md border border-neutral-200 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400">
              Yok
            </div>
          )}
          <div className="flex flex-col gap-2">
            <MediaPicker
              multiple={false}
              selected={photoUrl ? [photoUrl] : []}
              onConfirm={(urls) => urls[0] && setPhotoUrl(urls[0])}
              triggerLabel={photoUrl ? "Değiştir" : "Fotoğraf Seç"}
            />
            {photoUrl && (
              <button type="button" onClick={() => setPhotoUrl(null)} className="text-left text-xs text-red-600 hover:underline">
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cake_id" className="text-sm font-medium text-neutral-700">İlgili Ürün</label>
        <select id="cake_id" name="cake_id" defaultValue={review?.cake_id ?? ""} className={inputClass}>
          <option value="">Seçilmedi</option>
          {cakes.map((cake) => (
            <option key={cake.id} value={cake.id}>{cake.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category_id" className="text-sm font-medium text-neutral-700">İlgili Kategori</label>
        <select id="category_id" name="category_id" defaultValue={review?.category_id ?? ""} className={inputClass}>
          <option value="">Seçilmedi</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sort_order" className="text-sm font-medium text-neutral-700">Sıra</label>
        <input id="sort_order" name="sort_order" type="number" defaultValue={review?.sort_order ?? 0} className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="is_active" defaultChecked={review?.is_active ?? true} className="h-4 w-4 rounded border-neutral-300" />
        Aktif (sitede yayınla)
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <div>
        <button type="submit" disabled={pending} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60">
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
