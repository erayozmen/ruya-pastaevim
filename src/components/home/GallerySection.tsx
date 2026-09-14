import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { siteConfig } from "@/lib/site-config";
import { buildWhatsappHref } from "@/lib/whatsapp";
import { galleryItems } from "@/lib/gallery-data";

export function GallerySection() {
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
            href={siteConfig.contact.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-powder-pink/50 text-chocolate hover:text-peach hover:shadow-sm font-medium text-sm transition-all"
          >
            <i className="fa-brands fa-instagram text-lg text-peach"></i>
            <span>{siteConfig.contact.instagramHandle}</span>
          </a>
        </div>

        {/* Pinterest Style Masonry / Staggered Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {galleryItems.map((item) => (
            <div
              key={item.title}
              className={`relative group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ${
                item.tall ? "sm:row-span-2" : ""
              }`}
            >
              <ImageWithFallback
                src={item.image}
                alt={item.alt}
                fallbackSrc={`https://placehold.co/600x${item.tall ? "900" : "500"}/F6C7C9/49352F?text=${encodeURIComponent(
                  item.title,
                )}`}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
                  item.tall ? "h-full min-h-[360px]" : "h-72"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/80 via-chocolate/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span
                  className={`text-xs uppercase tracking-wider font-semibold ${item.labelColorClass}`}
                >
                  {item.labelText}
                </span>
                <h4 className="font-serif text-xl font-bold">{item.title}</h4>
                <a
                  href={buildWhatsappHref(item.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-3 inline-flex items-center gap-2 text-xs bg-white text-chocolate px-3 py-1.5 rounded-full font-bold transition-colors w-fit ${item.ctaHoverBgClass}`}
                >
                  <i className="fa-brands fa-whatsapp text-green-600"></i> Bu Pastayı Sor
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
