import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteGalleryItem } from "../../actions";

export default async function DeleteGalleryItemPage({ params }: PageProps<"/admin/gallery/[id]/delete">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: item } = await supabase.from("gallery_items").select("id, title").eq("id", id).single();
  if (!item) notFound();

  return (
    <div className="max-w-md rounded-lg border border-red-200 bg-white p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Galeri Görselini Sil</h1>
      <p className="mt-2 text-sm text-neutral-600">
        &ldquo;<strong>{item.title}</strong>&rdquo; galeriden kaldırılacak. Medya Kütüphanesi&apos;ndeki dosya silinmez.
      </p>
      <div className="mt-6 flex gap-3">
        <form action={deleteGalleryItem.bind(null, id)}>
          <button type="submit" className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Evet, sil
          </button>
        </form>
        <Link href="/admin/gallery" className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">
          Vazgeç
        </Link>
      </div>
    </div>
  );
}
