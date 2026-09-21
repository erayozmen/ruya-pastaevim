"use client";

import { useActionState, useState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";
import { MediaPicker } from "../media/MediaPicker";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function CakeForm({
  action,
  cake,
  categories,
  initialGalleryUrls = [],
}: {
  action: Action;
  cake?: Tables<"cakes">;
  categories: Pick<Tables<"categories">, "id" | "name" | "product_group">[];
  initialGalleryUrls?: string[];
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(cake?.main_image_url ?? null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>(initialGalleryUrls);

  const moveGalleryImage = (index: number, direction: -1 | 1) => {
    setGalleryUrls((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeGalleryImage = (url: string) => {
    setGalleryUrls((prev) => prev.filter((u) => u !== url));
  };

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Ürün Adı *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={cake?.name}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="category_id" className="text-sm font-medium text-neutral-700">
          Kategori *
        </label>
        <select
          id="category_id"
          name="category_id"
          required
          defaultValue={cake?.category_id ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        >
          <option value="" disabled>
            Kategori seçin
          </option>
          {(
            [
              ["cake", "Pastalar"],
              ["pastry", "Börek & Hamur İşleri"],
            ] as const
          ).map(([group, label]) => (
            <optgroup key={group} label={label}>
              {categories
                .filter((category) => category.product_group === group)
                .map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </optgroup>
          ))}
        </select>
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
          defaultValue={cake?.slug}
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
          defaultValue={cake?.description ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Ana Görsel</span>
        <input type="hidden" name="main_image_url" value={mainImageUrl ?? ""} />
        <div className="flex items-center gap-3">
          {mainImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={mainImageUrl}
              alt="Ana görsel"
              className="h-20 w-20 rounded-md border border-neutral-200 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400">
              Yok
            </div>
          )}
          <div className="flex flex-col gap-2">
            <MediaPicker
              multiple={false}
              selected={mainImageUrl ? [mainImageUrl] : []}
              onConfirm={(urls) => urls[0] && setMainImageUrl(urls[0])}
              triggerLabel={mainImageUrl ? "Değiştir" : "Ana Görsel Seç"}
            />
            {mainImageUrl && (
              <button
                type="button"
                onClick={() => setMainImageUrl(null)}
                className="text-left text-xs text-red-600 hover:underline"
              >
                Kaldır
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-neutral-700">Galeri Görselleri</span>
        <input type="hidden" name="gallery_image_urls" value={JSON.stringify(galleryUrls)} />

        {galleryUrls.length > 0 && (
          <div className="flex flex-col gap-2">
            {galleryUrls.map((url, index) => (
              <div
                key={url}
                className="flex items-center gap-3 rounded-md border border-neutral-200 p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-12 w-12 rounded object-cover" />
                <span className="flex-1 truncate text-xs text-neutral-500">{url}</span>
                <button
                  type="button"
                  onClick={() => moveGalleryImage(index, -1)}
                  disabled={index === 0}
                  className="text-xs text-neutral-500 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveGalleryImage(index, 1)}
                  disabled={index === galleryUrls.length - 1}
                  className="text-xs text-neutral-500 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(url)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            ))}
          </div>
        )}

        <div>
          <MediaPicker
            multiple={true}
            selected={galleryUrls}
            onConfirm={(urls) => setGalleryUrls((prev) => [...prev, ...urls])}
            triggerLabel="Görsel Ekle"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex flex-1 flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-neutral-700">
            Fiyat (TL)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min={0}
            step="0.01"
            defaultValue={cake?.price ?? ""}
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
            defaultValue={cake?.sort_order ?? 0}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={cake?.is_active ?? true}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Aktif
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={cake?.is_featured ?? false}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Öne çıkan
        </label>
        <label className="flex items-center gap-2 text-sm text-neutral-700">
          <input
            type="checkbox"
            name="show_price"
            defaultChecked={cake?.show_price ?? false}
            className="h-4 w-4 rounded border-neutral-300"
          />
          Fiyatı göster
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
