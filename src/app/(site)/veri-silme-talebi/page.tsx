import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { buildOpenGraph } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/public-queries";
import { buildWhatsappHref } from "@/lib/whatsapp";

const description = "Rüya Pasta Evim tarafından işlenen kişisel verilerinizin silinmesini nasıl talep edebileceğiniz.";

export const metadata: Metadata = {
  title: "Veri Silme Talebi",
  description,
  alternates: { canonical: "/veri-silme-talebi" },
  openGraph: buildOpenGraph({ title: "Veri Silme Talebi", description, path: "/veri-silme-talebi" }),
};

export default async function DataDeletionPage() {
  const site = await getSiteSettings();
  const handle = site.instagramHandle.replace(/^@/, "");
  const deletionWhatsappHref = buildWhatsappHref(
    "Merhaba, Rüya Pasta Evim tarafından hakkımda tutulan verilerin silinmesini talep ediyorum.",
    site.whatsappNumber,
  );

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          script="Verileriniz Sizin"
          title="Veri Silme Talebi"
          description={`${site.brandName} tarafından işlenen kişisel verilerinizin silinmesini talep etmek için bu sayfayı kullanabilirsiniz.`}
        />

        <div className="mt-14 space-y-10">
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">
              Hangi veriler için talepte bulunabilirim?
            </h2>
            <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed">
              &quot;Pastanı Tasarla&quot; formu üzerinden gönderdiğiniz sipariş talebinde yer alan ad
              soyad, telefon numarası, seçimleriniz ve notunuz gibi bilgilerin silinmesini talep
              edebilirsiniz. Detaylı bilgi için{" "}
              <Link href="/gizlilik-politikasi" className="text-gold hover:text-chocolate">
                Gizlilik Politikası
              </Link>{" "}
              sayfamızı inceleyebilirsiniz.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">
              Nasıl talep edebilirim?
            </h2>
            <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed">
              Rüya Pasta Evim tarafından işlenen kişisel verilerinizin silinmesini talep etmek için
              bize WhatsApp veya Instagram üzerinden ulaşabilirsiniz. Talebinizde adınızı ve
              (varsa) sipariş talebinde kullandığınız telefon numarasını belirtmeniz, kaydınızı
              bulmamıza yardımcı olur. Şifre, kimlik numarası, kart bilgisi gibi hassas herhangi
              bir bilgi göndermenize gerek yoktur.
            </p>

            <div className="rounded-3xl bg-vanilla/60 border border-powder-pink/40 p-6 flex flex-col sm:flex-row gap-3">
              <a
                href={deletionWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-sm shadow-sm transition-all"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>WhatsApp&apos;tan Silme Talebi Gönder</span>
              </a>
              <a
                href={site.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink transition-all"
              >
                <i className="fa-brands fa-instagram text-lg"></i>
                <span>Instagram&apos;dan Ulaşın</span>
              </a>
            </div>

            <p className="text-chocolate/70 text-xs sm:text-sm">
              WhatsApp: {site.phoneDisplay} (+90 541 909 07 25) · Instagram: @{handle}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">
              Talebiniz nasıl işlenir?
            </h2>
            <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed">
              Talebiniz tarafımıza ulaştıktan sonra değerlendirilir ve kaydınız varsa uygun şekilde
              silinir. Bu işlem otomatik veya anlık değildir; talebinizin bize ulaşması ve
              tarafımızca kontrol edilmesi gerekir. Meta veya Instagram üzerinden ayrı, otomatik
              çalışan bir veri silme sistemi bulunmamaktadır — tüm talepler yukarıdaki kanallar
              üzerinden manuel olarak değerlendirilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">Daha Fazla Bilgi</h2>
            <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed">
              Verilerinizin nasıl işlendiği hakkında daha fazla bilgi için{" "}
              <Link href="/gizlilik-politikasi" className="text-gold hover:text-chocolate">
                Gizlilik Politikası
              </Link>{" "}
              ve{" "}
              <Link href="/kullanim-sartlari" className="text-gold hover:text-chocolate">
                Kullanım Şartları
              </Link>{" "}
              sayfalarımızı inceleyebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
