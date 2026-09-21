import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminReviewsPage({ searchParams }: PageProps<"/admin/reviews">) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: reviews, error: fetchError } = await supabase
    .from("reviews")
    .select("id, customer_name, content, rating, is_active, sort_order")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Yorumlar</h1>
        <Link href="/admin/reviews/new" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Yeni Yorum
        </Link>
      </div>

      {error && <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Yorumlar yüklenemedi: {fetchError.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Müşteri</th>
              <th className="px-4 py-3 font-medium">Yorum</th>
              <th className="px-4 py-3 font-medium">Puan</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {(reviews ?? []).map((review) => (
              <tr key={review.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{review.sort_order}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{review.customer_name}</td>
                <td className="max-w-xs truncate px-4 py-3 text-neutral-500">{review.content}</td>
                <td className="px-4 py-3 text-neutral-500">{review.rating}</td>
                <td className="px-4 py-3 text-neutral-500">{review.is_active ? "Aktif" : "Pasif"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/reviews/${review.id}/edit`} className="text-neutral-700 hover:underline">Düzenle</Link>
                    <Link href={`/admin/reviews/${review.id}/delete`} className="text-red-600 hover:underline">Sil</Link>
                  </div>
                </td>
              </tr>
            ))}
            {(reviews ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">Henüz yorum yok.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
