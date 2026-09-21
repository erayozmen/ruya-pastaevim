import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminGalleryPage({ searchParams }: PageProps<"/admin/gallery">) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: items, error: fetchError } = await supabase
    .from("gallery_items")
    .select("id, title, image_url, is_active, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Galeri</h1>
        <Link href="/admin/gallery/new" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Yeni Görsel
        </Link>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Galeri yüklenemedi: {fetchError.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Görsel</th>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {(items ?? []).map((item) => (
              <tr key={item.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{item.sort_order}</td>
                <td className="px-4 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image_url} alt="" loading="lazy" className="h-12 w-12 rounded object-cover" />
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">{item.title}</td>
                <td className="px-4 py-3 text-neutral-500">{item.is_active ? "Aktif" : "Pasif"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/gallery/${item.id}/edit`} className="text-neutral-700 hover:underline">Düzenle</Link>
                    <Link href={`/admin/gallery/${item.id}/delete`} className="text-red-600 hover:underline">Sil</Link>
                  </div>
                </td>
              </tr>
            ))}
            {(items ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-500">Henüz galeri görseli yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
