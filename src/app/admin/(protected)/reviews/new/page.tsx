import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "../ReviewForm";
import { createReview } from "../actions";

export default async function NewReviewPage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: cakes }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("cakes").select("id, name").order("name", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yeni Yorum</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ReviewForm action={createReview} categories={categories ?? []} cakes={cakes ?? []} />
      </div>
    </div>
  );
}
