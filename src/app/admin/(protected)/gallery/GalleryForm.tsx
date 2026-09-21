"use client";

import { useActionState, useState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";
import { MediaPicker } from "../media/MediaPicker";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

const inputClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500";

export function GalleryForm({
  action,
  item,
  categories,
}: {
  action: Action;
  item?: Tables<"gallery_items">;
  categories: Pick<Tables<"categories">, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(item?.image_url ?? null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm font-medium text-neutral-700">Başlık (isteğe bağlı)</label>
        <input id="title" name="title" type="text" defaultValue={item?.title} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-neutral-700">Açıklama</label>
        <textarea id="description" name="description" rows={3} defaultValue={item?.description ?? ""} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Görsel *</span>
        <input type="hidden" name="image_url" value={imageUrl ?? ""} />
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Galeri görseli" className="h-20 w-20 rounded-md border border-neutral-200 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400">
              Yok
            </div>
          )}
          <MediaPicker
            multiple={false}
            selected={imageUrl ? [imageUrl] : []}
            onConfirm={(urls) => urls[0] && setImageUrl(urls[0])}
            triggerLabel={imageUrl ? "Değiştir" : "Görsel Seç"}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category_id" className="text-sm font-medium text-neutral-700">Kategori</label>
        <select id="category_id" name="category_id" defaultValue={item?.category_id ?? ""} className={inputClass}>
          <option value="">Kategorisiz</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="sort_order" className="text-sm font-medium text-neutral-700">Sıra</label>
        <input id="sort_order" name="sort_order" type="number" defaultValue={item?.sort_order ?? 0} className={inputClass} />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input type="checkbox" name="is_active" defaultChecked={item?.is_active ?? true} className="h-4 w-4 rounded border-neutral-300" />
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
