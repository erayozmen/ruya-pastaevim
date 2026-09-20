"use client";

import { useActionState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";

type Action = (state: FormState, formData: FormData) => Promise<FormState>;

export function CakeForm({
  action,
  cake,
  categories,
}: {
  action: Action;
  cake?: Tables<"cakes">;
  categories: Pick<Tables<"categories">, "id" | "name">[];
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-neutral-700">
          Pasta Adı *
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
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
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
        <label htmlFor="main_image_url" className="text-sm font-medium text-neutral-700">
          Görsel URL
        </label>
        <input
          id="main_image_url"
          name="main_image_url"
          type="url"
          defaultValue={cake?.main_image_url ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
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
