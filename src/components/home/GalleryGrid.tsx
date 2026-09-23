import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicGalleryItem } from "@/lib/public-queries";
import { accentFor, type SiteSettings } from "@/lib/site-data";
import { buildWhatsappHref } from "@/lib/whatsapp";

/** Every 6 items, positions 0 and 3 span two rows — the original masonry rhythm. */
function isTall(index: number) {
  return index % 6 === 0 || index % 6 === 3;
}

/** Shared by the homepage gallery section and the /galeri page. */
export function GalleryGrid({ items, site }: { items: PublicGalleryItem[]; site: SiteSettings }) {
  if (items.length === 0) {
    return (
      <p className="text-center text-sm text-chocolate/60">
        Henüz yayınlanmış galeri görseli bulunmuyor.
      </p>
    );
  }

  return (
    /* Pinterest Style Masonry / Staggered Grid */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((item, index) => {
        const tall = isTall(index);
        const accent = accentFor(index);
        return (
          <div
            key={item.id}
            className={`relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
              tall ? "sm:row-span-2 h-full min-h-[360px]" : "h-72"
            }`}
          >
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.title || "Rüya Pasta Evim pasta çalışması"}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
              {item.categoryName && (
                <span className={`text-xs uppercase tracking-wider font-semibold ${accent.label}`}>
                  {item.categoryName}
                </span>
              )}
              {item.title && <h4 className="font-serif text-xl font-bold">{item.title}</h4>}
              <a
                href={buildWhatsappHref(
                  item.title
                    ? `Merhaba, sitenizdeki '${item.title}' hakkında bilgi alabilir miyim?`
                    : "Merhaba, sitenizdeki galeride gördüğüm bir pasta hakkında bilgi alabilir miyim?",
                  site.whatsappNumber,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-3 inline-flex items-center gap-2 text-xs bg-white text-chocolate px-3 py-1.5 rounded-full font-bold transition-colors w-fit ${accent.cta}`}
              >
                <i className="fa-brands fa-whatsapp text-green-600"></i> Bu Pastayı Sor
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
