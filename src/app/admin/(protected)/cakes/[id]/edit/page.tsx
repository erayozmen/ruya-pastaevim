import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CakeForm } from "../../CakeForm";
import { updateCake } from "../../actions";

export default async function EditCakePage({
  params,
  searchParams,
}: PageProps<"/admin/cakes/[id]/edit">) {
  const { id } = await params;
  const { error } = await searchParams;
  const supabase = await createClient();

  const [{ data: cake }, { data: categories }, { data: images }] = await Promise.all([
    supabase.from("cakes").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name, product_group").order("sort_order", { ascending: true }),
    supabase
      .from("cake_images")
      .select("image_url")
      .eq("cake_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (!cake) {
    notFound();
  }

  const boundUpdate = updateCake.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Pastayı Düzenle</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CakeForm
          action={boundUpdate}
          cake={cake}
          categories={categories ?? []}
          initialGalleryUrls={(images ?? []).map((image) => image.image_url)}
        />
      </div>
    </div>
  );
}
