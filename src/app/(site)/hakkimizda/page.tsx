import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { getSiteSettings } from "@/lib/public-queries";

export const metadata: Metadata = {
  title: "Hikayemiz",
  description: "Rüya Pasta Evim hakkında.",
};

export default async function AboutPage() {
  const site = await getSiteSettings();
  const handle = site.instagramHandle.replace(/^@/, "");

  const pillars = [
    {
      icon: "fa-wand-magic-sparkles",
      title: "Kendi Pastanı Tasarla",
      text: "Sitedeki tasarım aracıyla renk, lezzet ve detay seçimlerini kendin yapabilirsin.",
    },
    {
      icon: "fa-brands fa-whatsapp",
      title: "WhatsApp ile Sipariş",
      text: "Seçimlerini sipariş talebi olarak iletir, görüşmeyi WhatsApp üzerinden sürdürürsün.",
    },
    {
      icon: "fa-brands fa-instagram",
      title: "Instagram'da Bizi Takip Et",
      text: handle
        ? `Yeni çalışmalarımız için @${handle} hesabımızı takip edebilirsin.`
        : "Yeni çalışmalarımız için Instagram hesabımızı takip edebilirsin.",
    },
  ];

  return (
    <>
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageIntro
            script="Hikayemiz"
            title={site.brandName}
            description="Özel günlerinize tatlı bir dokunuş katmak için pasta tasarımı yapıyoruz."
          />

          <div className="mt-14 rounded-3xl bg-gradient-to-br from-powder-pink/40 via-vanilla to-lavender/40 border border-powder-pink/40 shadow-sm p-10 text-center">
            {site.bakerName && (
              <p className="font-serif text-2xl font-bold text-chocolate">{site.bakerName}</p>
            )}
            <p className="text-sm text-chocolate/70 mt-1">{site.brandName}</p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="bg-white rounded-3xl border border-powder-pink/40 shadow-sm p-8 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-powder-pink/30 flex items-center justify-center text-gold text-xl mb-4">
                <i className={pillar.icon.includes("brands") ? pillar.icon : `fa-solid ${pillar.icon}`}></i>
              </div>
              <h3 className="font-serif text-xl font-bold text-chocolate">{pillar.title}</h3>
              <p className="text-chocolate/70 text-sm mt-2 leading-relaxed">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/iletisim"
            className="inline-block px-8 py-4 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink shadow-sm transition-all"
          >
            Bize Ulaşın
          </Link>
        </div>
      </section>
    </>
  );
}
