import type { Metadata } from "next";
import { buildOpenGraph } from "@/lib/metadata";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { getSiteSettings } from "@/lib/public-queries";

const description = "Sipariş talebi oluşturma adımları.";

export const metadata: Metadata = {
  title: "Nasıl Sipariş Verilir?",
  description,
  alternates: { canonical: "/nasil-siparis-verilir" },
  openGraph: buildOpenGraph({ title: "Nasıl Sipariş Verilir?", description, path: "/nasil-siparis-verilir" }),
};

const steps = [
  {
    title: "Pastanı Tasarla",
    text: "Ana sayfadaki tasarım aracında pasta türü, renk, lezzet ve detay seçimlerini yaparsın.",
  },
  {
    title: "İletişim Bilgilerini Gir",
    text: "Adını ve telefon numaranı yazarsın.",
  },
  {
    title: "Sipariş Talebini Gönder",
    text: "Seçimlerin sipariş talebi olarak kaydedilir.",
  },
  {
    title: "WhatsApp'ta Görüşelim",
    text: "Seçimlerin hazır bir mesajla WhatsApp'ta açılır; detayları orada birlikte konuşuruz.",
  },
];

export default async function HowToOrderPage() {
  const site = await getSiteSettings();
  const notes = [
    site.deliveryInfo,
    site.minimumOrderDays !== null && site.minimumOrderDays !== undefined
      ? `En az ${site.minimumOrderDays} gün önceden sipariş verilmesi rica olunur.`
      : null,
    site.workingHours ? `Çalışma saatleri: ${site.workingHours}` : null,
  ].filter(Boolean) as string[];

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          script="Kolay ve Hızlı"
          title="Nasıl Sipariş Verilir?"
          description="Sipariş talebi oluşturmak birkaç adımdan ibaret."
        />

        <ol className="mt-14 space-y-6">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-5 bg-white rounded-3xl border border-powder-pink/40 shadow-sm p-6"
            >
              <span className="shrink-0 w-11 h-11 rounded-full bg-powder-pink/40 text-chocolate font-serif font-bold text-lg flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <h3 className="font-serif text-xl font-bold text-chocolate">{step.title}</h3>
                <p className="text-chocolate/70 text-sm mt-1 leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl bg-vanilla/60 border border-powder-pink/40 p-6 text-sm text-chocolate/80 space-y-2">
          {notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
          <p>Detaylar sipariş görüşmesi sırasında netleştirilir.</p>
        </div>

        <div className="text-center mt-10">
          <Link
            href="/#tasarla"
            className="inline-block px-8 py-4 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink shadow-sm transition-all"
          >
            Pastanı Tasarla
          </Link>
        </div>
      </div>
    </section>
  );
}
