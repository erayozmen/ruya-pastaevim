import type { Metadata } from "next";
import { buildOpenGraph } from "@/lib/metadata";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";

const description = "Özel günler için hamur işleri.";

export const metadata: Metadata = {
  title: "Özel Günler İçin Hamur İşleri",
  description,
  alternates: { canonical: "/borek-hamur-isleri" },
  openGraph: buildOpenGraph({
    title: "Özel Günler İçin Hamur İşleri",
    description,
    path: "/borek-hamur-isleri",
  }),
};

export default async function PastryPage() {
  const [products, categories] = await Promise.all([
    getPublicCakes({ group: "pastry" }),
    getPublicCategories(undefined, "pastry"),
  ]);

  return (
    <section className="py-20">
      <div className="mb-14 px-4">
        <PageIntro script="El Açması Lezzetler" title="Özel Günler İçin Hamur İşleri" />
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
