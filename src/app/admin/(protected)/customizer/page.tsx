import { createClient } from "@/lib/supabase/server";
import { CustomizerTabs } from "./CustomizerTabs";
import type { OptionRow } from "./OptionForm";

export default async function AdminCustomizerPage() {
  const supabase = await createClient();

  const [portionsRes, themesRes, colorsRes, flavorsRes] = await Promise.all([
    supabase.from("customizer_portions").select("*").order("sort_order", { ascending: true }),
    supabase.from("customizer_themes").select("*").order("sort_order", { ascending: true }),
    supabase.from("customizer_colors").select("*").order("sort_order", { ascending: true }),
    supabase.from("customizer_flavors").select("*").order("sort_order", { ascending: true }),
  ]);

  const error = portionsRes.error ?? themesRes.error ?? colorsRes.error ?? flavorsRes.error;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-neutral-900">Customizer Seçenekleri</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Ana sayfadaki &quot;Pastanı Tasarla&quot; adımlarında gösterilen porsiyon, tema, renk ve lezzet seçenekleri.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Seçenekler yüklenemedi: {error.message}
        </div>
      )}

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CustomizerTabs
          portions={(portionsRes.data ?? []) as OptionRow[]}
          themes={(themesRes.data ?? []) as OptionRow[]}
          colors={(colorsRes.data ?? []) as OptionRow[]}
          flavors={(flavorsRes.data ?? []) as OptionRow[]}
        />
      </div>
    </div>
  );
}
