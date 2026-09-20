import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deleteCake } from "../../actions";

export default async function DeleteCakePage({ params }: PageProps<"/admin/cakes/[id]/delete">) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: cake } = await supabase.from("cakes").select("id, name").eq("id", id).single();

  if (!cake) {
    notFound();
  }

  const boundDelete = deleteCake.bind(null, id);

  return (
    <div className="max-w-md rounded-lg border border-red-200 bg-white p-6">
      <h1 className="text-lg font-semibold text-neutral-900">Pastayı Sil</h1>
      <p className="mt-2 text-sm text-neutral-600">
        &ldquo;<strong>{cake.name}</strong>&rdquo; pastasını silmek istediğinize emin misiniz? Bu işlem
        geri alınamaz. Bu pastaya ait görseller de birlikte silinir; bağlı yorumlar pastasız olarak
        kalır.
      </p>

      <div className="mt-6 flex gap-3">
        <form action={boundDelete}>
          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Evet, sil
          </button>
        </form>
        <Link
          href="/admin/cakes"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
        >
          Vazgeç
        </Link>
      </div>
    </div>
  );
}
