import type { SiteSettings } from "@/lib/site-data";
import { buildWhatsappHref } from "@/lib/whatsapp";

export function FinalCTA({ site }: { site: SiteSettings }) {
  const whatsappHref = buildWhatsappHref(
    "Merhaba, özel günümüz için pasta tasarımı konuşmak istiyorum.",
    site.whatsappNumber,
  );

  return (
    <section
      id="iletisim"
      className="py-20 relative overflow-hidden bg-gradient-to-r from-powder-pink via-peach to-lavender"
    >
      {/* Background sparkles */}
      <div className="absolute -top-10 -left-10 text-white/30 text-8xl font-serif select-none pointer-events-none">
        ✨
      </div>
      <div className="absolute -bottom-10 -right-10 text-white/30 text-8xl font-serif select-none pointer-events-none">
        🧁
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm text-chocolate text-xs font-bold uppercase tracking-wider mb-4">
          Sipariş &amp; Bilgi
        </span>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-chocolate tracking-tight max-w-2xl mx-auto leading-tight">
          Özel gününüz için birlikte bir pasta tasarlayalım.
        </h2>

        <p className="text-chocolate/90 text-sm sm:text-base max-w-xl mx-auto mt-4 mb-8">
          Tarihinizi, aklınızdaki görseli veya sadece renkleri paylaşın. Sizin için en tatlı
          kutlamayı birlikte planlayalım.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-chocolate text-vanilla font-bold text-base shadow-xl hover:bg-chocolate/90 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <i className="fa-brands fa-whatsapp text-xl text-[#25D366]"></i>
            <span>WhatsApp&apos;tan Sipariş Ver</span>
          </a>

          <a
            href={site.phoneHref}
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/80 hover:bg-white text-chocolate font-semibold text-base shadow-md transition-all duration-300 flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-phone text-chocolate/80"></i>
            <span>{site.phoneDisplay}</span>
          </a>
        </div>

        {/* Quick Location / Info Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-chocolate/90">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-location-dot text-chocolate"></i>
            <span>{site.address ?? "Konum bilgisi yakında eklenecek"}</span>
          </div>
          <span className="hidden sm:inline text-chocolate/30">•</span>
          <div className="flex items-center gap-2">
            <i className="fa-brands fa-whatsapp text-chocolate"></i>
            <span>WhatsApp: {site.phoneDisplay}</span>
          </div>
          <span className="hidden sm:inline text-chocolate/30">•</span>
          <div className="flex items-center gap-2">
            <i className="fa-brands fa-instagram text-chocolate"></i>
            <span>Instagram: {site.instagramHandle}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
