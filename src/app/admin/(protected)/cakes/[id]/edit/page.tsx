import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CakeForm } from "../../CakeForm";
import { updateCake } from "../../actions";

export default async function EditCakePage({ params }: PageProps<"/admin/cakes/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: cake }, { data: categories }] = await Promise.all([
    supabase.from("cakes").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
  ]);

  if (!cake) {
    notFound();
  }

  const boundUpdate = updateCake.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Pastayı Düzenle</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CakeForm action={boundUpdate} cake={cake} categories={categories ?? []} />
      </div>
    </div>
  );
}
