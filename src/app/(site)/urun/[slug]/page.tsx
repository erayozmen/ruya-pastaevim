import type { Metadata } from "next";
import { ProductDetail } from "@/components/public/ProductDetail";
import { buildOpenGraph } from "@/lib/metadata";
import { getPublicCakeBySlug } from "@/lib/public-queries";

export async function generateMetadata({ params }: PageProps<"/urun/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublicCakeBySlug(slug);
  if (!product || product.group !== "pastry") return { title: "Ürün bulunamadı" };

  return {
    title: product.name,
    description: product.description ?? undefined,
    alternates: { canonical: `/urun/${product.slug}` },
    openGraph: buildOpenGraph({
      title: product.name,
      description: product.description ?? undefined,
      path: `/urun/${product.slug}`,
      imageUrl: product.mainImageUrl,
    }),
  };
}

export default async function PastryDetailPage({ params }: PageProps<"/urun/[slug]">) {
  const { slug } = await params;
  return <ProductDetail slug={slug} group="pastry" />;
}
