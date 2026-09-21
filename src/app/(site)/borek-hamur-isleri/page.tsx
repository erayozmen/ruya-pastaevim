import type { Metadata } from "next";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";

export const metadata: Metadata = {
  title: "Börek & Hamur İşleri",
  description: "Börek ve hamur işleri.",
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
