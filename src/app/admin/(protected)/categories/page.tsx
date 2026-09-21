import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage({
  searchParams,
}: PageProps<"/admin/categories">) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: categories, error: fetchError } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order, is_active, show_on_home, product_group")
    .order("sort_order", { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Kategoriler</h1>
        <Link
          href="/admin/categories/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Yeni Kategori
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Kategoriler yüklenemedi: {fetchError.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Grup</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Ana Sayfa</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category) => (
              <tr key={category.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{category.sort_order}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">{category.name}</td>
                <td className="px-4 py-3 text-neutral-500">{category.slug}</td>
                <td className="px-4 py-3 text-neutral-500">{category.product_group === "pastry" ? "Börek & Hamur İşleri" : "Pastalar"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      category.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {category.is_active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{category.show_on_home ? "Evet" : "Hayır"}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link
                      href={`/admin/categories/${category.id}/edit`}
                      className="text-sm text-neutral-700 hover:underline"
                    >
                      Düzenle
                    </Link>
                    <Link
                      href={`/admin/categories/${category.id}/delete`}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Sil
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {categories?.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-neutral-500">
                  Henüz kategori yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
