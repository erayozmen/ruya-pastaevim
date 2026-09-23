import type { Metadata } from "next";
import { buildOpenGraph } from "@/lib/metadata";
import { GalleryGrid } from "@/components/home/GalleryGrid";
import { PageIntro } from "@/components/public/PageIntro";
import { getPublicGalleryItems, getSiteSettings } from "@/lib/public-queries";

const description = "Rüya Pasta Evim'den gerçek pasta fotoğrafları.";

export const metadata: Metadata = {
  title: "Galeri",
  description,
  alternates: { canonical: "/galeri" },
  openGraph: buildOpenGraph({ title: "Galeri", description, path: "/galeri" }),
};

export default async function GalleryPage() {
  const [items, site] = await Promise.all([getPublicGalleryItems(), getSiteSettings()]);

  return (
    <section className="py-20 bg-soft-cream border-b border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <PageIntro
            script="İlham Dolu Kareler"
            title="Galeri"
            description="Beğendiğiniz pastanın görselini WhatsApp'tan doğrudan iletebilirsiniz."
          />
        </div>
        <GalleryGrid items={items} site={site} />
      </div>
    </section>
  );
}
