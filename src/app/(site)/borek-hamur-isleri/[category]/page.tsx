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
}: PageProps<"/borek-hamur-isleri/[category]">): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category || category.group !== "pastry") return { title: "Kategori bulunamadı" };

  return {
    title: category.name,
    description: category.description ?? undefined,
    alternates: { canonical: `/borek-hamur-isleri/${category.slug}` },
    openGraph: buildOpenGraph({
      title: category.name,
      description: category.description ?? undefined,
      path: `/borek-hamur-isleri/${category.slug}`,
      imageUrl: category.imageUrl,
    }),
  };
}

export default async function PastryCategoryPage({
  params,
}: PageProps<"/borek-hamur-isleri/[category]">) {
  const { category: slug } = await params;
  const category = await getPublicCategoryBySlug(slug);
  if (!category || category.group !== "pastry") notFound();

  const [products, categories] = await Promise.all([
    getPublicCakes({ categoryId: category.id }),
    getPublicCategories(undefined, "pastry"),
  ]);

  return (
    <section className="py-20">
      <div className="mb-14 px-4">
        <PageIntro
          script="Börek & Hamur İşleri"
          title={category.name}
          description={category.description ?? undefined}
        />
      </div>
      <CakeListing
        cakes={products}
        categories={categories}
        activeSlug={category.slug}
        emptyMessage="Bu kategoride henüz yayınlanmış ürün bulunmuyor."
        basePath="/borek-hamur-isleri"
        productPath="/urun"
      />
    </section>
  );
}
