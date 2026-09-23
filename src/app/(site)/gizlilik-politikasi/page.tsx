import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/public/PageIntro";
import { buildOpenGraph } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/public-queries";
import { buildWhatsappHref } from "@/lib/whatsapp";

const description = "Rüya Pasta Evim web sitesinde hangi verilerin nasıl işlendiğini açıklayan gizlilik politikası.";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description,
  alternates: { canonical: "/gizlilik-politikasi" },
  openGraph: buildOpenGraph({ title: "Gizlilik Politikası", description, path: "/gizlilik-politikasi" }),
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-xl sm:text-2xl font-bold text-chocolate">{title}</h2>
      <div className="text-chocolate/80 text-sm sm:text-base leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default async function PrivacyPolicyPage() {
  const site = await getSiteSettings();
  const handle = site.instagramHandle.replace(/^@/, "");
  const deletionWhatsappHref = buildWhatsappHref(
    "Merhaba, sitenizde hakkımda tutulan verilerin silinmesini talep ediyorum.",
    site.whatsappNumber,
  );

  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageIntro
          script="Şeffaflık"
          title="Gizlilik Politikası"
          description={`${site.brandName} olarak bu web sitesinde hangi verilerin, hangi amaçla ve nasıl işlendiğini aşağıda açıklıyoruz.`}
        />

        <div className="mt-14 space-y-10">
          <Section title="1. Genel Bilgilendirme">
            <p>
              Bu gizlilik politikası, {site.brandName} ({site.bakerName}) tarafından işletilen bu web
              sitesi için geçerlidir. Site; pasta, börek ve hamur işi ürünlerimizi tanıtmak, ziyaretçilerin
              kendi pasta tasarımlarını oluşturmasına imkân vermek ve sipariş talebi almak amacıyla
              kullanılmaktadır. Sitede üyelik, hesap oluşturma veya online ödeme sistemi bulunmamaktadır.
            </p>
          </Section>

          <Section title="2. İşlenen / Toplanan Veriler">
            <p>Sitede kişisel veri, yalnızca aşağıdaki durumlarda ve şu kadarıyla işlenir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>&quot;Pastanı Tasarla&quot; formu:</strong> ad soyad, telefon numarası, seçtiğiniz
                porsiyon/tema/renk/lezzet ve isteğe bağlı olarak yazdığınız not.
              </li>
            </ul>
            <p>
              Bunların dışında sitede herhangi bir form, üyelik veya iletişim alanı üzerinden başka bir
              kişisel veri toplanmamaktadır. Sitede yayınlanan müşteri yorumları ziyaretçiler tarafından
              doğrudan bir form ile gönderilmez; işletmemiz tarafından manuel olarak eklenir.
            </p>
          </Section>

          <Section title="3. Verilerin Kullanım Amaçları">
            <p>
              Yukarıdaki veriler yalnızca sipariş talebinizi değerlendirmek ve seçimleriniz hakkında
              sizinle iletişime geçebilmek amacıyla kullanılır. Verileriniz pazarlama e-postası, SMS
              veya benzeri bir bildirim göndermek için kullanılmaz; sitede böyle bir sistem
              bulunmamaktadır.
            </p>
          </Section>

          <Section title="4. Sipariş ve İletişim Talepleri">
            <p>&quot;Pastanı Tasarla&quot; adımını tamamladığınızda iki şey gerçekleşir:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Seçimleriniz bir sipariş talebi olarak sistemimize kaydedilir ve yalnızca yetkili yöneticimiz tarafından görüntülenebilir.</li>
              <li>Kendi cihazınızda, seçimlerinizin özetiyle hazırlanmış bir WhatsApp mesajı açılır; bu mesajı göndermek isteyip istemediğinize siz karar verirsiniz.</li>
            </ul>
          </Section>

          <Section title="5. Instagram Verileri">
            <p>
              Sitenin Instagram bölümü, yalnızca kendi resmi hesabımızın (@{handle}) herkese açık
              paylaşımlarını göstermek için Meta&apos;nın resmi Instagram API&apos;siyle çalışacak şekilde
              hazırlanmıştır. Bu entegrasyon etkinleştirildiğinde yalnızca hesabımızın kendi medya
              içeriği, medya bağlantıları ve gönderi görselleri gibi herkese açık bilgiler kullanılır.
              Doğrudan mesajlar (DM), yorum yönetimi, istatistik (insights), alışveriş (shopping) gibi
              özellikler kullanılmamaktadır ve ziyaretçilere ait hiçbir kişisel Instagram verisi
              işlenmez. Entegrasyon aktif değilken bu bölümde yalnızca Instagram profilimize giden bir
              bağlantı gösterilir.
            </p>
          </Section>

          <Section title="6. Supabase ve Teknik Hizmetler">
            <p>
              Site; veritabanı, yönetici girişi ve ürün fotoğraflarının saklanması için Supabase adlı
              bulut altyapı sağlayıcısını kullanır. Yönetici girişi (Supabase Authentication) yalnızca
              işletme sahibinin siteyi yönetebilmesi içindir; ziyaretçiler için herhangi bir hesap
              oluşturulmaz veya istenmez.
            </p>
          </Section>

          <Section title="7. WhatsApp Üzerinden İletişim">
            <p>
              Sitedeki WhatsApp bağlantılarına tıkladığınızda, önceden doldurulmuş bir mesajla kendi
              WhatsApp uygulamanız veya WhatsApp Web açılır. Bu işlem tamamen kendi cihazınızda
              gerçekleşir; mesajı göndermediğiniz sürece tarafımıza otomatik olarak herhangi bir bilgi
              iletilmez. Mesajı gönderdiğinizde oluşan yazışma, WhatsApp&apos;ın kendi gizlilik
              politikası kapsamındadır.
            </p>
          </Section>

          <Section title="8. Çerezler ve Teknik Veriler">
            <p>
              Site şu anda ziyaretçi takibi için analitik veya reklam amaçlı çerez kullanmamaktadır.
              Teknik bir oturum çerezi yalnızca işletme yöneticisi admin paneline giriş yaptığında,
              oturumunu sürdürebilmesi için oluşturulur; bu, sıradan bir ziyaretçiyi etkilemez. Sayfa
              simgeleri için cdnjs (Cloudflare) üzerinden bir ikon yazı tipi dosyası yüklenir; bu,
              tarayıcınızın bu dosyayı almak için doğrudan ilgili sunucuya yaptığı standart bir istektir.
            </p>
          </Section>

          <Section title="9. Verilerin Saklanması">
            <p>
              Sipariş talebi verileriniz (ad, telefon, seçimler, not) Supabase altyapısındaki
              veritabanımızda saklanır. Şu an için otomatik bir saklama süresi/silme politikası
              tanımlanmamıştır; talebiniz üzerine verileriniz aşağıdaki 12. maddede açıklanan yöntemle
              silinebilir.
            </p>
          </Section>

          <Section title="10. Veri Güvenliği">
            <p>
              Site HTTPS üzerinden şifreli bağlantıyla sunulur. Veritabanı erişim kuralları, sipariş
              talebi verilerinin yalnızca kimliği doğrulanmış yönetici hesabı tarafından
              görüntülenebilmesine izin verecek şekilde yapılandırılmıştır; ziyaretçiler kendi
              gönderdikleri veriyi dahi geri okuyamaz.
            </p>
          </Section>

          <Section title="11. Verilerin Paylaşılması">
            <p>
              Verileriniz üçüncü taraflara satılmaz veya pazarlama amacıyla paylaşılmaz. Sitenin
              çalışması için kullandığımız altyapı sağlayıcıları (veritabanı ve barındırma için
              Supabase; yalnızca kendi Instagram içeriğimiz için Meta/Instagram API&apos;si; ikon yazı
              tipi için Cloudflare/cdnjs) veriyi yalnızca bu hizmetleri sağlamak için işler; başka
              hiçbir üçüncü tarafla veri paylaşılmaz.
            </p>
          </Section>

          <Section title="12. Kullanıcıların Veri Silme Talebi">
            <div className="rounded-3xl bg-vanilla/60 border border-powder-pink/40 p-6 space-y-3">
              <p>
                Hakkınızda tutulan verilerin (sipariş talebiniz) silinmesini istiyorsanız bize WhatsApp
                veya Instagram üzerinden ulaşabilirsiniz. Talebiniz tarafımızca değerlendirilip en kısa
                sürede uygulanır; silme işlemi otomatik değildir, talebinizin bize ulaşması ve
                işlenmesi gerekir.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
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
            </div>
          </Section>

          <Section title="13. Kullanıcı Hakları">
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; hakkınızda hangi verilerin
              işlendiğini öğrenme, yanlış veya eksikse düzeltilmesini isteme ve yukarıdaki yöntemle
              silinmesini talep etme hakkına sahipsiniz. Bu sayfa hukuki danışmanlık yerine geçmez;
              yalnızca sitenin gerçek işleyişini açıklar.
            </p>
          </Section>

          <Section title="14. Politika Güncellemeleri">
            <p>
              Site geliştikçe bu politika güncellenebilir. Güncel sürüm her zaman bu sayfada
              yayınlanır.
            </p>
          </Section>

          <Section title="15. İletişim">
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
            <p>
              Daha fazla iletişim bilgisi için{" "}
              <Link href="/iletisim" className="text-gold hover:text-chocolate">
                İletişim sayfamızı
              </Link>{" "}
              ziyaret edebilirsiniz.
            </p>
          </Section>
        </div>
      </div>
    </section>
  );
}
