import { CategoryForm } from "../CategoryForm";
import { createCategory } from "../actions";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yeni Kategori</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <CategoryForm action={createCategory} />
      </div>
    </div>
  );
}
