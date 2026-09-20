import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteCategory } from "../../actions";

export default async function DeleteCategoryPage({ params }: PageProps<"/admin/categories/[id]/delete">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name")
    .eq("id", id)
    .single();

  if (!category) {
    notFound();
  }

  const { count: cakeCount } = await supabase
    .from("cakes")
    .select("id", { count: "exact", head: true })
    .eq("category_id", id);

  const boundDelete = deleteCategory.bind(null, id);
  const hasCakes = (cakeCount ?? 0) > 0;

  return (
    <div className="max-w-md rounded-lg border border-red-200 bg-white p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Kategoriyi Sil</h1>
      <p className="mt-2 text-sm text-neutral-600">
        &ldquo;<strong>{category.name}</strong>&rdquo; kategorisini silmek istediğinize emin misiniz? Bu
        işlem geri alınamaz.
      </p>

      {hasCakes && (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Bu kategoriye bağlı {cakeCount} pasta var. Silme işlemi veritabanı tarafından
          engellenecektir — önce bu pastaları başka bir kategoriye taşıyın veya silin.
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <form action={boundDelete}>
          <button
            type="submit"
            disabled={hasCakes}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Evet, sil
          </button>
        </form>
        <Link
          href="/admin/categories"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Vazgeç
        </Link>
      </div>
    </div>
  );
}
