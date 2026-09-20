"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMedia, uploadMedia } from "./actions";

export type MediaItem = {
  name: string;
  path: string;
  publicUrl: string;
  size: number | null;
  mimetype: string | null;
  updatedAt: string | null;
};

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function UploadForm() {
  const [state, formAction, pending] = useActionState(uploadMedia, undefined);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state, router]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4"
    >
      <input type="hidden" name="area" value="cakes" />
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        required
        className="text-sm text-neutral-700 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? "Yükleniyor..." : "Yükle"}
      </button>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">{state.success}</p>}
    </form>
  );
}

function MediaCard({
  item,
  onPreview,
  onDeleted,
}: {
  item: MediaItem;
  onPreview: () => void;
  onDeleted: (path: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const router = useRouter();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setDeleteError("URL kopyalanamadı.");
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(undefined);
    const result = await deleteMedia(item.path);
    setDeleting(false);
    if (result.error) {
      setDeleteError(result.error);
      setConfirming(false);
      return;
    }
    onDeleted(item.path);
    router.refresh();
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <button type="button" onClick={onPreview} className="block aspect-square w-full overflow-hidden bg-neutral-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.publicUrl} alt={item.name} className="h-full w-full object-cover transition hover:scale-105" />
      </button>

      <div className="flex flex-1 flex-col gap-1 p-3 text-xs text-neutral-500">
        <p className="truncate font-medium text-neutral-900" title={item.name}>
          {item.name}
        </p>
        <p className="truncate" title={item.path}>
          {item.path}
        </p>
        <p>
          {item.mimetype ?? "—"} · {formatBytes(item.size)}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-100 p-2">
        <button
          type="button"
          onClick={handleCopy}
          className="flex-1 rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100"
        >
          {copied ? "Kopyalandı!" : "URL Kopyala"}
        </button>

        {confirming ? (
          <div className="flex flex-1 items-center gap-1">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {deleting ? "Siliniyor..." : "Emin misin?"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-md border border-neutral-300 px-2 py-1 text-xs text-neutral-700"
            >
              Vazgeç
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="flex-1 rounded-md border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
          >
            Sil
          </button>
        )}
      </div>

      {deleteError && <p className="px-3 pb-2 text-xs text-red-600">{deleteError}</p>}
    </div>
  );
}

export function MediaLibrary({ items }: { items: MediaItem[] }) {
  const [hiddenPaths, setHiddenPaths] = useState<Set<string>>(new Set());
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const visibleItems = items.filter((item) => !hiddenPaths.has(item.path));

  return (
    <div className="flex flex-col gap-6">
      <UploadForm />

      <p className="text-sm text-neutral-500">{visibleItems.length} görsel</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {visibleItems.map((item, index) => (
          <MediaCard
            key={item.path}
            item={item}
            onPreview={() => setPreviewIndex(index)}
            onDeleted={(path) => setHiddenPaths((prev) => new Set(prev).add(path))}
          />
        ))}

        {visibleItems.length === 0 && (
          <p className="col-span-full py-8 text-center text-sm text-neutral-500">Henüz görsel yok.</p>
        )}
      </div>

      {previewIndex !== null && visibleItems[previewIndex] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6"
          onClick={() => setPreviewIndex(null)}
        >
          <div className="flex max-h-full max-w-3xl flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={visibleItems[previewIndex].publicUrl}
              alt={visibleItems[previewIndex].name}
              className="max-h-[80vh] max-w-full rounded-lg object-contain"
            />
            <div className="flex items-center gap-3 text-sm text-white">
              <span>{visibleItems[previewIndex].name}</span>
              <button
                type="button"
                onClick={() => setPreviewIndex(null)}
                className="rounded-md border border-white/30 px-3 py-1 hover:bg-white/10"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
