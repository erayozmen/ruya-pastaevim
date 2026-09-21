import { createClient } from "@/lib/supabase/server";
import { GalleryForm } from "../GalleryForm";
import { createGalleryItem } from "../actions";

export default async function NewGalleryItemPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("id, name").order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yeni Galeri Görseli</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <GalleryForm action={createGalleryItem} categories={categories ?? []} />
      </div>
    </div>
  );
}
