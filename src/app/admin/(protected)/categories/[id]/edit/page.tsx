import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CategoryForm } from "../../CategoryForm";
import { updateCategory } from "../../actions";

export default async function EditCategoryPage({ params }: PageProps<"/admin/categories/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase.from("categories").select("*").eq("id", id).single();

  if (!category) {
    notFound();
  }

  const boundUpdate = updateCategory.bind(null, id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Kategoriyi Düzenle</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CategoryForm action={boundUpdate} category={category} />
      </div>
    </div>
  );
}
