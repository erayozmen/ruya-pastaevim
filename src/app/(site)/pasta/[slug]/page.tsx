import type { Metadata } from "next";
import { ProductDetail } from "@/components/public/ProductDetail";
import { getPublicCakeBySlug } from "@/lib/public-queries";

export async function generateMetadata({ params }: PageProps<"/pasta/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cake = await getPublicCakeBySlug(slug);
  if (!cake || cake.group !== "cake") return { title: "Pasta bulunamadı" };
  return { title: cake.name, description: cake.description ?? undefined };
}

export default async function CakeDetailPage({ params }: PageProps<"/pasta/[slug]">) {
  const { slug } = await params;
  return <ProductDetail slug={slug} group="cake" />;
}
