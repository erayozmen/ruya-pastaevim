import { createClient } from "@/lib/supabase/server";
import { CakeForm } from "../CakeForm";
import { createCake } from "../actions";

export default async function NewCakePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: themes }, { data: colors }] = await Promise.all([
    supabase.from("categories").select("id, name, product_group").order("sort_order", { ascending: true }),
    supabase.from("customizer_themes").select("value, label").eq("is_active", true).order("sort_order"),
    supabase.from("customizer_colors").select("value, label").eq("is_active", true).order("sort_order"),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yeni Pasta</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CakeForm
          action={createCake}
          categories={categories ?? []}
          customizerThemes={themes ?? []}
          customizerColors={colors ?? []}
        />
      </div>
    </div>
  );
}
