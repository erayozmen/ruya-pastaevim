import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ReviewForm } from "../../ReviewForm";
import { updateReview } from "../../actions";

export default async function EditReviewPage({ params }: PageProps<"/admin/reviews/[id]/edit">) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: review }, { data: categories }, { data: cakes }] = await Promise.all([
    supabase.from("reviews").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("sort_order", { ascending: true }),
    supabase.from("cakes").select("id, name").order("name", { ascending: true }),
  ]);
  if (!review) notFound();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold text-neutral-900">Yorumu Düzenle</h1>
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <ReviewForm action={updateReview.bind(null, id)} review={review} categories={categories ?? []} cakes={cakes ?? []} />
      </div>
    </div>
  );
}
