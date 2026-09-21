import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicCake, PublicReview } from "@/lib/public-queries";
import type { SiteSettings } from "@/lib/site-data";
import { buildWhatsappHref } from "@/lib/whatsapp";

export function Hero({
  site,
  heroCake,
  featuredReview,
}: {
  site: SiteSettings;
  /** First active featured cake with a main image, if the admin has published one. */
  heroCake: PublicCake | null;
  /** First active real review, if any — never a placeholder. */
  featuredReview: PublicReview | null;
}) {
  const primaryWhatsappHref = buildWhatsappHref(
    "Merhaba, özel günümüz için pasta siparişi vermek istiyorum.",
    site.whatsappNumber,
  );

  return (
    <section className="relative pt-8 pb-16 lg:pt-16 lg:pb-28 overflow-hidden">
      {/* Background Pastels Blobs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-powder-pink/25 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute -top-10 -right-20 w-96 h-96 bg-lavender/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-peach/25 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Text */}
          <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full sparkle-badge border border-powder-pink shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-chocolate flex items-center gap-1.5">
                <i className="fa-solid fa-wand-magic-sparkles text-gold"></i>
                Butik Cake Studio &amp; Atölye
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-peach"></span>
              <span className="text-xs text-chocolate/70 font-medium">{site.bakerName}</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-chocolate leading-[1.12]">
              Hayalindeki Pasta, <br className="hidden sm:inline" />
              <span className="relative whitespace-nowrap">
                <span className="relative z-10 text-chocolate italic font-serif">Senin İçin</span>
                <span className="absolute left-0 bottom-1 w-full h-3 bg-peach/40 -rotate-1 rounded-sm -z-0"></span>
              </span>{" "}
              Hazırlanır.
            </h1>

            <p className="text-base sm:text-lg text-chocolate/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Doğum günleri, söz &amp; nişan, baby shower ve en özel kutlamalarınız için tamamen
              el yapımı, katkısız ve size özel tasarlanan unutulmaz butik pastalar.
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#kategoriler"
                className="w-full sm:w-auto text-center px-8 py-4 rounded-full bg-chocolate text-vanilla font-semibold text-sm sm:text-base hover:bg-chocolate/90 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <span>Pastalarımı Keşfet</span>
                <i className="fa-solid fa-arrow-down-long group-hover:translate-y-1 transition-transform"></i>
              </a>

              <a
                href={primaryWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center px-7 py-4 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm sm:text-base border border-powder-pink shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2"
              >
                <i className="fa-brands fa-whatsapp text-lg text-[#25D366]"></i>
                <span>WhatsApp&apos;tan Sipariş Ver</span>
              </a>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm text-chocolate/80">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-peach/30 text-chocolate flex items-center justify-center text-xs">
                  <i className="fa-solid fa-heart text-peach"></i>
                </span>
                <span>%100 Gerçek Tereyağ &amp; Doğal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-lavender/50 text-chocolate flex items-center justify-center text-xs">
                  <i className="fa-solid fa-gem text-lavender"></i>
                </span>
                <span>Kişiye Özel Konsept</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Showcase */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            {/* Organic Decorative Pastel Backdrop */}
            <div className="absolute w-[330px] h-[330px] sm:w-[460px] sm:h-[460px] bg-gradient-to-tr from-powder-pink via-peach to-lavender opacity-60 floating-blob-1 -z-10 filter blur-[2px]"></div>

            {/* Secondary Blob behind */}
            <div className="absolute w-[290px] h-[290px] sm:w-[400px] sm:h-[400px] bg-gold-light/40 floating-blob-2 -z-10"></div>

            {/* Hero Cake Image */}
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 transition-transform duration-500 hover:scale-[1.01]">
              {heroCake?.mainImageUrl ? (
                <ImageWithFallback
                  src={heroCake.mainImageUrl}
                  alt={heroCake.name}
                  fallbackSrc="https://placehold.co/800x1000/F6C7C9/49352F?text=Butik+Pasta"
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-powder-pink/60 via-vanilla to-lavender/50 flex items-center justify-center text-7xl text-gold/70">
                  <i className="fa-solid fa-cake-candles"></i>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-chocolate/40 via-transparent to-transparent"></div>

              {/* Floating Mini Card 1: Review Snippet (only when a real review exists) */}
              {featuredReview && (
                <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/70 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-powder-pink/50 flex-shrink-0 flex items-center justify-center text-gold">
                    <i className="fa-solid fa-cake-candles text-lg"></i>
                  </div>
                  <div className="text-xs">
                    <p className="font-bold text-chocolate line-clamp-2">
                      &quot;{featuredReview.content}&quot;
                    </p>
                    <div className="flex text-gold text-[10px] my-0.5">
                      {Array.from({ length: featuredReview.rating }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <span className="text-chocolate/60">
                      {featuredReview.customerName}
                      {featuredReview.categoryName ? ` - ${featuredReview.categoryName}` : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Floating Mini Badge 2: Handcrafted with Love */}
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-powder-pink/40 flex items-center gap-1.5 text-xs font-semibold text-chocolate">
                <span className="text-peach animate-pulse">❤️</span> El Yapımı &amp; Taze
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
