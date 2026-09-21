import type { Metadata } from "next";
import { PageIntro } from "@/components/public/PageIntro";
import { getSiteSettings } from "@/lib/public-queries";
import { buildWhatsappHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Rüyam Pasta Evim iletişim bilgileri.",
};

export default async function ContactPage() {
  const site = await getSiteSettings();
  const handle = site.instagramHandle.replace(/^@/, "");

  const cards: { icon: string; label: string; value: string; href?: string }[] = [
    {
      icon: "fa-brands fa-whatsapp",
      label: "WhatsApp",
      value: site.phoneDisplay,
      href: buildWhatsappHref(`Merhaba, ${site.brandName} hakkında bilgi almak istiyorum.`, site.whatsappNumber),
    },
  ];
  cards.push({
    icon: "fa-solid fa-phone",
    label: "Telefon",
    value: site.phoneDisplay,
    href: site.phoneHref,
  });
  if (site.instagramUrl) {
    cards.push({
      icon: "fa-brands fa-instagram",
      label: "Instagram",
      value: handle ? `@${handle}` : site.instagramUrl,
      href: site.instagramUrl,
    });
  }
  if (site.email) {
    cards.push({ icon: "fa-solid fa-envelope", label: "E-posta", value: site.email, href: `mailto:${site.email}` });
  }
  if (site.address) {
    cards.push({ icon: "fa-solid fa-location-dot", label: "Adres", value: site.address });
  }
  if (site.serviceArea) {
    cards.push({ icon: "fa-solid fa-map", label: "Hizmet Bölgesi", value: site.serviceArea });
  }
  if (site.workingHours) {
    cards.push({ icon: "fa-regular fa-clock", label: "Çalışma Saatleri", value: site.workingHours });
  }

  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro script="Bize Ulaşın" title="İletişim" description="Sorularınız ve sipariş talepleriniz için bize yazabilirsiniz." />

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {cards.map((card) => {
            const external = card.href?.startsWith("http");
            const body = (
              <>
                <div className="w-12 h-12 shrink-0 rounded-2xl bg-powder-pink/30 flex items-center justify-center text-gold text-lg">
                  <i className={card.icon}></i>
                </div>
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wider text-chocolate/50 font-semibold">{card.label}</p>
                  <p className="font-serif text-lg font-bold text-chocolate break-words">{card.value}</p>
                </div>
              </>
            );
            const cls =
              "flex items-center gap-4 bg-white rounded-3xl border border-powder-pink/40 shadow-sm p-6";
            return card.href ? (
              <a
                key={card.label}
                href={card.href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${cls} hover:shadow-card-hover transition-all`}
              >
                {body}
              </a>
            ) : (
              <div key={card.label} className={cls}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
