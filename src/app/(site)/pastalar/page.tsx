import type { Metadata } from "next";
import { buildOpenGraph } from "@/lib/metadata";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";

const description = "Yayındaki pastalarımız.";

export const metadata: Metadata = {
  title: "Pastalar",
  description,
  alternates: { canonical: "/pastalar" },
  openGraph: buildOpenGraph({ title: "Pastalar", description, path: "/pastalar" }),
};

export default async function CakesPage() {
  const [cakes, categories] = await Promise.all([getPublicCakes({ group: "cake" }),
    getPublicCategories(undefined, "cake"),
  ]);

  return (
    <section className="py-20">
      <div className="mb-14 px-4">
        <PageIntro
          script="Özel Anlarınız İçin"
          title="Pasta Koleksiyonları"
          description="Beğendiğiniz tasarımı inceleyin, dilediğiniz renk ve lezzet seçenekleriyle kişiselleştirelim."
        />
      </div>
      <CakeListing
        cakes={cakes}
        categories={categories}
        activeSlug={null}
        emptyMessage="Henüz yayınlanmış pasta bulunmuyor."
      />
    </section>
  );
}
