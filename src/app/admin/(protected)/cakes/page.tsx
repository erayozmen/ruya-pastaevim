import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const GROUP_TABS = [
  { value: undefined, label: "Tümü" },
  { value: "cake", label: "Pastalar" },
  { value: "pastry", label: "Börek & Hamur İşleri" },
] as const;

export default async function AdminCakesPage({ searchParams }: PageProps<"/admin/cakes">) {
  const { error, deleted, group } = await searchParams;
  const activeGroup = group === "cake" || group === "pastry" ? group : undefined;

  const supabase = await createClient();
  const [{ data: cakes, error: fetchError }, { data: categories }] = await Promise.all([
    supabase
      .from("cakes")
      .select("id, name, slug, price, is_active, is_featured, sort_order, category_id")
      .order("sort_order", { ascending: true }),
    supabase.from("categories").select("id, name, product_group"),
  ]);

  const categoryNameById = new Map((categories ?? []).map((category) => [category.id, category.name]));
  const categoryGroupById = new Map((categories ?? []).map((category) => [category.id, category.product_group]));
  const visibleCakes = (cakes ?? []).filter(
    (cake) => !activeGroup || (cake.category_id && categoryGroupById.get(cake.category_id) === activeGroup),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-neutral-900">Ürünler</h1>
        <Link href="/admin/cakes/new" className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white">
          Yeni Ürün
        </Link>
      </div>

      <div className="flex gap-2">
        {GROUP_TABS.map((tab) => {
          const isActive = activeGroup === tab.value;
          const href = tab.value ? `/admin/cakes?group=${tab.value}` : "/admin/cakes";
          return (
            <Link
              key={tab.label}
              href={href}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {deleted && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          Pasta silindi. Medya dosyaları Media Library&apos;de saklanmaya devam ediyor.
        </div>
      )}

      {fetchError && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Ürünler yüklenemedi: {fetchError.message}
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Sıra</th>
              <th className="px-4 py-3 font-medium">Ad</th>
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Fiyat</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {visibleCakes.map((cake) => (
              <tr key={cake.id} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 text-neutral-500">{cake.sort_order}</td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {cake.name}
                  {cake.is_featured && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Öne çıkan
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {(cake.category_id && categoryNameById.get(cake.category_id)) ?? "—"}
                </td>
                <td className="px-4 py-3 text-neutral-500">
                  {cake.price !== null ? `${cake.price} TL` : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      cake.is_active ? "bg-green-100 text-green-700" : "bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {cake.is_active ? "Aktif" : "Pasif"}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-3">
                    <Link href={`/admin/cakes/${cake.id}/edit`} className="text-sm text-neutral-700 hover:underline">
                      Düzenle
                    </Link>
                    <Link href={`/admin/cakes/${cake.id}/delete`} className="text-sm text-red-600 hover:underline">
                      Sil
                    </Link>
                  </div>
                </td>
              </tr>
            ))}

            {visibleCakes.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  {activeGroup ? "Bu grupta henüz ürün yok." : "Henüz ürün yok."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
