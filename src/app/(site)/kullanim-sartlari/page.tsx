import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { buildOpenGraph } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/public-queries";

const description = "Rüya Pasta Evim web sitesini kullanırken geçerli olan kullanım şartları.";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description,
  alternates: { canonical: "/kullanim-sartlari" },
  openGraph: buildOpenGraph({ title: "Kullanım Şartları", description, path: "/kullanim-sartlari" }),
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">{title}</h2>
      <div className="text-chocolate/80 text-sm sm:text-base leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default async function TermsOfServicePage() {
  const site = await getSiteSettings();
  const handle = site.instagramHandle.replace(/^@/, "");

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          script="Lütfen Okuyun"
          title="Kullanım Şartları"
          description={`Bu sayfa, ${site.brandName} web sitesini kullanırken geçerli olan genel şartları açıklar.`}
        />

        <div className="mt-14 space-y-10">
          <Section title="1. Genel Hükümler">
            <p>
              Bu web sitesi {site.brandName} ({site.bakerName}) tarafından işletilmektedir. Siteyi
              ziyaret ederek veya &quot;Pastanı Tasarla&quot; formunu kullanarak aşağıdaki şartları
              kabul etmiş sayılırsınız. Sitede üyelik, hesap oluşturma veya online ödeme sistemi
              bulunmamaktadır.
            </p>
          </Section>

          <Section title="2. Web Sitesinin Kullanım Amacı">
            <p>
              Site; pasta, börek ve hamur işi ürünlerimizi tanıtmak, ziyaretçilerin kendi pasta
              tasarımlarını oluşturmasına imkân vermek ve bu tasarımlar üzerinden sipariş talebi
              almak amacıyla sunulmaktadır.
            </p>
          </Section>

          <Section title="3. Ürün / Pasta Talep Süreci">
            <p>
              &quot;Pastanı Tasarla&quot; adımında yaptığınız seçimler (porsiyon, tema, renk, lezzet)
              ve isteğe bağlı notunuz, ad soyad ve telefon numaranızla birlikte bir{" "}
              <strong>sipariş talebi</strong> olarak kaydedilir. Bu bir sipariş onayı veya rezervasyon
              değildir; yalnızca talebinizin bize iletilmesidir.
            </p>
          </Section>

          <Section title="4. Sipariş Taleplerinin Değerlendirilmesi">
            <p>
              Gönderdiğiniz talep, ekibimiz tarafından incelenir ve WhatsApp üzerinden sizinle
              iletişime geçilerek müsaitlik, fiyat ve detaylar konuşulur. Bir sipariş, ancak bu
              görüşme sonucunda karşılıklı olarak netleştiğinde kesinleşir. Sitede otomatik onay,
              anında fiyatlandırma, ödeme alma veya teslimat garantisi veren bir sistem
              bulunmamaktadır.
            </p>
          </Section>

          <Section title="5. Gönderdiğiniz Bilgilerin Doğruluğu">
            <p>
              Sipariş talebi formunda verdiğiniz ad soyad ve telefon numarasının doğru ve size ait
              olması gerekir. Yanlış veya eksik bilgi, sizinle iletişime geçmemizi
              zorlaştırabilir.
            </p>
          </Section>

          <Section title="6. Site İçeriğinin Kullanımı">
            <p>
              Sitedeki metin, görsel ve tasarım öğeleri {site.brandName}&apos;e aittir. Bu içerikler,
              önceden izin alınmadan ticari amaçla kopyalanamaz veya başka bir yerde
              yayınlanamaz.
            </p>
          </Section>

          <Section title="7. Üçüncü Taraf Hizmetler">
            <p>
              Site; veritabanı ve fotoğraf depolama için Supabase, sayfa ikonları için cdnjs
              (Cloudflare) altyapısını kullanır. Bu hizmetlerin kendi kullanım şartları ve gizlilik
              politikaları geçerlidir.
            </p>
          </Section>

          <Section title="8. WhatsApp Üzerinden İletişim">
            <p>
              Sitedeki WhatsApp bağlantıları, önceden doldurulmuş bir mesajla kendi WhatsApp
              uygulamanızı veya WhatsApp Web&apos;i açar. Bu bağlantı üzerinden gönderdiğiniz mesajlar
              WhatsApp&apos;ın kendi hizmet şartlarına tabidir.
            </p>
          </Section>

          <Section title="9. Instagram İçeriğinin Gösterimi">
            <p>
              Site, etkinleştirildiğinde yalnızca kendi resmi Instagram hesabımızın (@{handle})
              herkese açık paylaşımlarını gösterebilir. Bu içerikler Instagram&apos;ın kendi hizmet
              şartlarına tabidir.
            </p>
          </Section>

          <Section title="10. Gizlilik Politikası">
            <p>
              Kişisel verilerinizin nasıl işlendiği hakkında ayrıntılı bilgi için{" "}
              <Link href="/gizlilik-politikasi" className="text-gold hover:text-chocolate">
                Gizlilik Politikası
              </Link>{" "}
              sayfamızı inceleyebilirsiniz. Verilerinizin silinmesini talep etmek için{" "}
              <Link href="/veri-silme-talebi" className="text-gold hover:text-chocolate">
                Veri Silme Talebi
              </Link>{" "}
              sayfamızdaki yönergeleri takip edebilirsiniz.
            </p>
          </Section>

          <Section title="11. Değişiklikler">
            <p>
              Bu kullanım şartları, site geliştikçe güncellenebilir. Güncel sürüm her zaman bu
              sayfada yayınlanır.
            </p>
          </Section>

          <Section title="12. İletişim">
            <p>Sorularınız için bize aşağıdaki kanallardan ulaşabilirsiniz:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>WhatsApp: {site.phoneDisplay} (+90 541 909 07 25)</li>
              <li>
                Instagram:{" "}
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-chocolate">
                  @{handle}
                </a>
              </li>
            </ul>
          </Section>
        </div>
      </div>
    </section>
  );
}
