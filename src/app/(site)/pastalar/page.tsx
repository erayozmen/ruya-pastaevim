import type { Metadata } from "next";
import { CakeListing } from "@/components/public/CakeListing";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";

export const metadata: Metadata = {
  title: "Pastalar",
  description: "Yayındaki pastalarımız.",
};

export default async function CakesPage() {
  const [cakes, categories] = await Promise.all([getPublicCakes(), getPublicCategories()]);

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
