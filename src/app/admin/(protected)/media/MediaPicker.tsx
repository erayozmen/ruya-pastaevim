"use client";

import { useEffect, useState } from "react";
import { listMediaItems, type MediaItem } from "./actions";

export function MediaPicker({
  multiple,
  selected,
  onConfirm,
  triggerLabel,
}: {
  multiple: boolean;
  /** Public URLs already chosen, so re-picking the same file is a no-op instead of a duplicate. */
  selected: string[];
  onConfirm: (urls: string[]) => void;
  triggerLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string[]>([]);

  useEffect(() => {
    if (!open || items !== null) return;
    listMediaItems("cakes").then(setItems);
  }, [open, items]);

  const filtered = (items ?? []).filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  const togglePick = (url: string) => {
    if (multiple) {
      setPicked((prev) => (prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]));
    } else {
      setPicked([url]);
    }
  };

  const handleConfirm = () => {
    const toAdd = multiple ? picked.filter((url) => !selected.includes(url)) : picked;
    onConfirm(toAdd);
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setPicked([]);
          setOpen(true);
        }}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100"
      >
        {triggerLabel}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-lg bg-white">
            <div className="flex items-center justify-between border-b border-neutral-200 p-4">
              <h2 className="text-sm font-semibold text-neutral-900">
                {multiple ? "Galeri görselleri seç" : "Ana görsel seç"}
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-sm text-neutral-500 hover:text-neutral-900"
              >
                Kapat
              </button>
            </div>

            <div className="border-b border-neutral-200 p-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Dosya adına göre ara..."
                className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
              />
            </div>

            <div className="grid flex-1 grid-cols-3 gap-3 overflow-y-auto p-4 sm:grid-cols-4">
              {items === null && <p className="col-span-full text-sm text-neutral-500">Yükleniyor...</p>}

              {items !== null && filtered.length === 0 && (
                <p className="col-span-full text-sm text-neutral-500">Görsel bulunamadı.</p>
              )}

              {filtered.map((item) => {
                const isPicked = picked.includes(item.publicUrl);
                const alreadyAdded = selected.includes(item.publicUrl) && !isPicked;
                return (
                  <button
                    type="button"
                    key={item.path}
                    onClick={() => togglePick(item.publicUrl)}
                    className={`relative aspect-square overflow-hidden rounded-md border-2 ${
                      isPicked
                        ? "border-neutral-900"
                        : alreadyAdded
                          ? "border-green-400"
                          : "border-transparent"
                    }`}
                    title={item.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.publicUrl} alt={item.name} className="h-full w-full object-cover" />
                    {isPicked && (
                      <span className="absolute right-1 top-1 rounded-full bg-neutral-900 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Seçili
                      </span>
                    )}
                    {alreadyAdded && (
                      <span className="absolute right-1 top-1 rounded-full bg-green-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Eklendi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-neutral-200 p-4">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={picked.length === 0}
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {multiple ? `Ekle (${picked.length})` : "Seç"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
