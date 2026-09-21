"use client";

import { useActionState, useState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";
import { MediaPicker } from "../media/MediaPicker";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function CategoryForm({
  action,
  category,
}: {
  action: Action;
  category?: Tables<"categories">;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(category?.image_url ?? null);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Kategori Adı *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={category?.name}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="slug" className="text-sm font-medium text-neutral-700">
          Slug
        </label>
        <input
          id="slug"
          name="slug"
          type="text"
          placeholder="Boş bırakılırsa isimden otomatik oluşturulur"
          defaultValue={category?.slug}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-neutral-700">
          Açıklama
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={category?.description ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="product_group" className="text-sm font-medium text-neutral-700">
          Ürün Grubu *
        </label>
        <select
          id="product_group"
          name="product_group"
          defaultValue={category?.product_group ?? "cake"}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        >
          <option value="cake">Pastalar</option>
          <option value="pastry">Börek &amp; Hamur İşleri</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Kategori Görseli</span>
        <input type="hidden" name="image_url" value={imageUrl ?? ""} />
        <div className="flex items-center gap-3">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="Kategori görseli" className="h-20 w-20 rounded-md border border-neutral-200 object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400">
              Yok
            </div>
          )}
          <div className="flex flex-col gap-2">
            <MediaPicker
              multiple={false}
              selected={imageUrl ? [imageUrl] : []}
              onConfirm={(urls) => urls[0] && setImageUrl(urls[0])}
              triggerLabel={imageUrl ? "Değiştir" : "Görsel Seç"}
            />
            {imageUrl && (
              <button type="button" onClick={() => setImageUrl(null)} className="text-left text-xs text-red-600 hover:underline">
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="icon_emoji" className="text-sm font-medium text-neutral-700">
            İkon (emoji)
          </label>
          <input
            id="icon_emoji"
            name="icon_emoji"
            type="text"
            maxLength={4}
            defaultValue={category?.icon_emoji ?? ""}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="sort_order" className="text-sm font-medium text-neutral-700">
            Sıra
          </label>
          <input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={category?.sort_order ?? 0}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={category?.is_active ?? true}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Aktif
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="show_on_home"
            defaultChecked={category?.show_on_home ?? true}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Ana sayfada göster
        </label>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

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
