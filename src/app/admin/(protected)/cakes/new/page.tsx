import { createClient } from "@/lib/supabase/server";
import { CakeForm } from "../CakeForm";
import { createCake } from "../actions";

export default async function NewCakePage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yeni Pasta</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CakeForm action={createCake} categories={categories ?? []} />
      </div>
    </div>
  );
}
