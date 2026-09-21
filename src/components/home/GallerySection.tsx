import Link from "next/link";
import type { PublicGalleryItem } from "@/lib/public-queries";
import type { SiteSettings } from "@/lib/site-data";
import { GalleryGrid } from "./GalleryGrid";

export function GallerySection({
  items,
  site,
}: {
  items: PublicGalleryItem[];
  site: SiteSettings;
}) {
  return (
    <section id="galeri" className="py-20 bg-soft-cream border-y border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div>
            <span className="font-script text-2xl text-peach font-semibold">
              İlham Dolu Kareler
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate">
              En Sevilen Tasarımlarımız
            </h2>
            <p className="text-chocolate/70 text-sm mt-1">
              Beğendiğiniz pastanın görselini kaydedip WhatsApp&apos;tan doğrudan
              iletebilirsiniz.
            </p>
          </div>

          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-powder-pink/50 text-chocolate hover:text-peach hover:shadow-sm font-medium text-sm transition-all"
          >
            <i className="fa-brands fa-instagram text-lg text-peach"></i>
            <span>{site.instagramHandle}</span>
          </a>
        </div>

        <GalleryGrid items={items} site={site} />

        {items.length > 0 && (
          <div className="text-center mt-10">
            <Link
              href="/galeri"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-chocolate uppercase tracking-wider transition-colors"
            >
              <span>Galerinin Tamamını Gör</span>
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
