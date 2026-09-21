import Link from "next/link";
import { BrandMark } from "./BrandMark";
import type { SiteSettings } from "@/lib/site-data";

const exploreLinks = [
  { href: "/pastalar", label: "Pastalarımız" },
  { href: "/borek-hamur-isleri", label: "Börek & Hamur İşleri" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/galeri", label: "Fotoğraf Galerisi" },
  { href: "/#tasarla", label: "Pastanı Tasarla" },
  { href: "/nasil-siparis-verilir", label: "Nasıl Sipariş Verilir" },
  { href: "/iletisim", label: "İletişim" },
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
            <BrandMark name={site.brandName} variant="footer" />
            <p className="text-xs sm:text-sm text-vanilla/70 max-w-sm leading-relaxed">
              Kişiye özel butik pastalar, börek ve hamur işleri.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-white mb-3">Keşfet</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-powder-pink transition-colors">
                    {link.label}
                  </Link>
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
          <p>© 2026 {site.brandName} - Tüm Hakları Saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
