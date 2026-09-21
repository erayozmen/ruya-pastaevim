import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "../../GalleryForm";
import { updateGalleryItem } from "../../actions";

export default async function EditGalleryItemPage({ params }: PageProps<"/admin/gallery/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: item }, { data: categories }] = await Promise.all([
    supabase.from("gallery_items").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
  ]);
  if (!item) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Galeri Görselini Düzenle</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <GalleryForm action={updateGalleryItem.bind(null, id)} item={item} categories={categories ?? []} />
      </div>
    </div>
  );
}
