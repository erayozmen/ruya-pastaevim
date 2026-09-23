"use client";

import { useActionState, useState } from "react";
import type { Tables } from "@/lib/database/helpers";
import type { FormState } from "./actions";
import { MediaPicker } from "../media/MediaPicker";

const inputClass = "rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500";

function ImagePickerField({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <input type="hidden" name={name} value={value ?? ""} />
      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt={label} className="h-20 w-20 rounded-md border border-neutral-200 object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-md border border-dashed border-neutral-300 text-xs text-neutral-400">
            Yok
          </div>
        )}
        <div className="flex flex-col gap-2">
          <MediaPicker
            multiple={false}
            selected={value ? [value] : []}
            onConfirm={(urls) => urls[0] && onChange(urls[0])}
            triggerLabel={value ? "Değiştir" : "Görsel Seç"}
          />
          {value && (
            <button type="button" onClick={() => onChange(null)} className="text-left text-xs text-red-600 hover:underline">
              Kaldır
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function HomepageSettingsForm({
  action,
  settings,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  settings: Tables<"site_settings">;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(settings.hero_image_url);
  const [storyImageUrl, setStoryImageUrl] = useState<string | null>(settings.story_image_url);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-6">
      <ImagePickerField label="Hero Görseli" name="hero_image_url" value={heroImageUrl} onChange={setHeroImageUrl} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="story_title" className="text-sm font-medium text-neutral-700">Hikayemiz Başlığı *</label>
        <input id="story_title" name="story_title" type="text" required defaultValue={settings.story_title} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="story_text" className="text-sm font-medium text-neutral-700">Hikayemiz Metni *</label>
        <textarea id="story_text" name="story_text" rows={6} required defaultValue={settings.story_text} className={inputClass} />
      </div>

      <ImagePickerField label="Hikayemiz Görseli" name="story_image_url" value={storyImageUrl} onChange={setStoryImageUrl} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700">Kaydedildi.</p>}

      <div>
        <button type="submit" disabled={pending} className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60">
          {pending ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
