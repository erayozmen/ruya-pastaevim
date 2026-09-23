import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { buildOpenGraph } from "@/lib/metadata";
import {
  getPublicCakes,
  getPublicCategories,
  getPublicCategoryBySlug,
} from "@/lib/public-queries";

export async function generateMetadata({
  params,
}: PageProps<"/pastalar/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category || category.group !== "cake") return { title: "Kategori bulunamadı" };

  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: `/pastalar/${category.slug}` },
    openGraph: buildOpenGraph({
      title: category.name,
      description: category.description ?? undefined,
      path: `/pastalar/${category.slug}`,
      imageUrl: category.imageUrl,
    }),
  };
}

export default async function CategoryCakesPage({ params }: PageProps<"/pastalar/[category]">) {
  const { category: slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category || category.group !== "cake") notFound();

  const [cakes, categories] = await Promise.all([
    getPublicCakes({ categoryId: category.id }),
    getPublicCategories(undefined, "cake"),
  ]);

  return (
    <section className="py-20">
      <div className="mb-14 px-4">
        <PageIntro
          script={category.emoji ? `${category.emoji} Kategori` : "Kategori"}
          title={category.name}
          description={category.description ?? undefined}
        />
      </div>
      <CakeListing
        cakes={cakes}
        categories={categories}
        activeSlug={category.slug}
        emptyMessage="Bu kategoride henüz yayınlanmış pasta bulunmuyor."
      />
    </section>
  );
}
