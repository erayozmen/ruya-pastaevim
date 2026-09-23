"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MediaPicker } from "../media/MediaPicker";

export interface OptionRow {
  id: string;
  value: string;
  label: string;
  sort_order: number;
  is_active: boolean;
  emoji?: string | null;
  image_url?: string | null;
  swatch_hex?: string | null;
}

type FormState = { error?: string; success?: boolean } | undefined;
type FormAction = (state: FormState, formData: FormData) => Promise<FormState>;
type DeleteAction = (id: string) => Promise<{ error?: string }>;

const inputClass = "rounded-md border border-neutral-300 px-2.5 py-1.5 text-sm outline-none focus:border-neutral-500";

/**
 * One row's create/edit form for a customizer option table. Which extra
 * field is shown (emoji, theme image, color swatch) depends on `extra` —
 * the four customizer_* tables share value/label/sort_order/is_active but
 * differ in exactly one extra column each.
 */
export function OptionForm({
  row,
  extra,
  action,
  onDelete,
}: {
  row?: OptionRow;
  extra: "none" | "emoji" | "emoji-image" | "swatch";
  action: FormAction;
  onDelete?: DeleteAction;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(row?.image_url ?? null);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.refresh();
  }, [state, router]);

  const handleDelete = async () => {
    if (!onDelete || !row) return;
    if (!window.confirm(`"${row.label}" silinsin mi?`)) return;
    setDeleting(true);
    const result = await onDelete(row.id);
    setDeleting(false);
    if (result.error) {
      setDeleteError(result.error);
      return;
    }
    router.refresh();
  };

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded-md border border-neutral-200 p-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-600">Değer (value)</label>
        <input name="value" defaultValue={row?.value} required className={`${inputClass} w-40`} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-600">Etiket</label>
        <input name="label" defaultValue={row?.label} required className={`${inputClass} w-40`} />
      </div>

      {(extra === "emoji" || extra === "emoji-image") && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Emoji</label>
          <input name="emoji" defaultValue={row?.emoji ?? ""} maxLength={4} className={`${inputClass} w-16`} />
        </div>
      )}

      {extra === "swatch" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Renk (hex)</label>
          <input
            name="swatch_hex"
            defaultValue={row?.swatch_hex ?? ""}
            placeholder="#F6C7C9"
            className={`${inputClass} w-28`}
          />
        </div>
      )}

      {extra === "emoji-image" && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-neutral-600">Görsel</label>
          <input type="hidden" name="image_url" value={imageUrl ?? ""} />
          <div className="flex items-center gap-2">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="" className="h-9 w-9 rounded border border-neutral-200 object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-neutral-300 text-[10px] text-neutral-400">
                Yok
              </div>
            )}
            <MediaPicker
              multiple={false}
              selected={imageUrl ? [imageUrl] : []}
              onConfirm={(urls) => urls[0] && setImageUrl(urls[0])}
              triggerLabel={imageUrl ? "Değiştir" : "Seç"}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-neutral-600">Sıra</label>
        <input
          name="sort_order"
          type="number"
          defaultValue={row?.sort_order ?? 0}
          className={`${inputClass} w-16`}
        />
      </div>

      <label className="flex items-center gap-1.5 pb-1.5 text-xs font-medium text-neutral-700">
        <input type="checkbox" name="is_active" defaultChecked={row?.is_active ?? true} className="h-3.5 w-3.5" />
        Aktif
      </label>

      <div className="flex items-center gap-2 pb-0.5">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
        >
          {pending ? "Kaydediliyor..." : row ? "Kaydet" : "Ekle"}
        </button>
        {row && onDelete && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-md border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {deleting ? "Siliniyor..." : "Sil"}
          </button>
        )}
      </div>

      {state?.error && <p className="w-full text-xs text-red-600">{state.error}</p>}
      {deleteError && <p className="w-full text-xs text-red-600">{deleteError}</p>}
    </form>
  );
}
