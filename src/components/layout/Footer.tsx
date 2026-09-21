import type { SiteSettings } from "@/lib/site-data";

const exploreLinks = [
  { href: "#kategoriler", label: "Pastalarımız" },
  { href: "#hikayemiz", label: "Hakkımızda" },
  { href: "#galeri", label: "Fotoğraf Galerisi" },
  { href: "#tasarla", label: "Pastanı Tasarla" },
];

export function Footer({ site }: { site: SiteSettings }) {
  const orderNotice =
    site.deliveryInfo ??
    (site.minimumOrderDays !== null
      ? `Siparişlerinizi en az ${site.minimumOrderDays} gün önceden iletmenizi rica ederiz.`
      : "Sipariş süreniz için lütfen bizimle iletişime geçin.");

  return (
    <footer className="bg-chocolate text-vanilla/80 py-12 border-t border-chocolate/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-cake-candles text-gold text-2xl"></i>
              <span className="font-serif text-2xl font-bold text-white tracking-wide">
                {site.brandName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-vanilla/70 max-w-sm leading-relaxed">
              Ev sıcaklığında, katkısız malzemeler ve sevgiyle hazırlanan kişiye özel butik
              tasarım pastalar.
            </p>
            <p className="text-xs text-gold/80 font-medium">
              ✨ Fabrika değil, el emeği &amp; gerçek lezzet.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-3">Keşfet</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-powder-pink transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-3">Çalışma &amp; Teslimat</h4>
            <p className="text-xs text-vanilla/70 leading-relaxed mb-2">
              {orderNotice}
            </p>
            <div className="text-xs text-vanilla/60 space-y-1">
              <p>📍 {site.address ?? "Konum bilgisi yakında eklenecek"}</p>
              <p>⏰ {site.workingHours ?? "Çalışma saatleri yakında eklenecek"}</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-vanilla/50 gap-4">
          <p>© 2026 {site.brandName} - Tüm Hakları Saklıdır. Butik Cake Studio.</p>
          <div className="flex items-center gap-4">
            <span>Sevgiyle el yapımı üretilmiştir 🧁</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
