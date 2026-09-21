import type { SiteSettings } from "@/lib/site-data";

export function StorySection({ site }: { site: SiteSettings }) {
  return (
    <section
      id="hikayemiz"
      className="py-20 bg-soft-cream relative overflow-hidden border-y border-powder-pink/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute inset-0 bg-lavender/50 rounded-3xl rotate-3 transform transition-transform duration-300"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                <div className="w-full h-72 sm:h-80 bg-gradient-to-br from-powder-pink/50 via-vanilla to-lavender/50 flex items-center justify-center">
                  <span className="font-script text-5xl text-gold/80">{site.brandName}</span>
                </div>
                <div className="p-4 bg-vanilla text-center border-t border-powder-pink/20">
                  <h4 className="font-serif text-lg font-bold text-chocolate">{site.bakerName}</h4>
                  <p className="font-script text-gold text-lg -mt-1">{site.brandName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-block">
              <span className="font-script text-2xl text-peach font-semibold block">Hikayemiz</span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate mt-1">
                {site.brandName}
              </h2>
            </div>

            <div className="space-y-4 text-chocolate/75 text-sm sm:text-base leading-relaxed">
              <p>
                Özel günleriniz için pasta, börek ve hamur işleri hazırlıyoruz. Siparişinizi
                sitedeki tasarım aracıyla oluşturabilir, detayları WhatsApp üzerinden bizimle
                netleştirebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-chocolate/10 text-center">
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">Pastalar</h4>
                <p className="text-[11px] text-chocolate/60">Kişiye özel tasarımlar</p>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">Börek &amp; Hamur İşleri</h4>
                <p className="text-[11px] text-chocolate/60">Özel günler için</p>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">WhatsApp ile Sipariş</h4>
                <p className="text-[11px] text-chocolate/60">Detaylar görüşmede netleşir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
