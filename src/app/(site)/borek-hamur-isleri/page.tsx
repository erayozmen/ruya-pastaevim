import type { Metadata } from "next";
import { buildOpenGraph } from "@/lib/metadata";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";

const description = "Börek ve hamur işleri.";

export const metadata: Metadata = {
  title: "Börek & Hamur İşleri",
  description,
  alternates: { canonical: "/borek-hamur-isleri" },
  openGraph: buildOpenGraph({ title: "Börek & Hamur İşleri", description, path: "/borek-hamur-isleri" }),
};

export default async function PastryPage() {
  const [products, categories] = await Promise.all([
    getPublicCakes({ group: "pastry" }),
    getPublicCategories(undefined, "pastry"),
  ]);

  return (
    <section className="py-20">
      <div className="mb-14 px-4">
        <PageIntro script="Özel Günler İçin" title="Börek & Hamur İşleri" />
      </div>
      <CakeListing
        cakes={products}
        categories={categories}
        activeSlug={null}
        emptyMessage="Henüz yayınlanmış ürün bulunmuyor."
        basePath="/borek-hamur-isleri"
        productPath="/urun"
      />
    </section>
  );
}
