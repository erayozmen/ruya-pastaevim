import type { SiteSettings } from "@/lib/site-data";

export function StorySection({ site }: { site: SiteSettings }) {
  return (
    <section
      id="hikayemiz"
      className="py-20 bg-soft-cream relative overflow-hidden border-y border-powder-pink/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Chef / Atelier Photo */}
          <div className="lg:col-span-5 relative order-2 lg:order-1 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Organic frame outline */}
              <div className="absolute inset-0 bg-lavender/50 rounded-3xl rotate-3 transform transition-transform duration-300"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
                {/* No real atelier/baker photo exists yet, so the frame stays
                    neutral instead of showing a stock photo of a stranger. */}
                <div className="w-full h-96 sm:h-[440px] bg-gradient-to-br from-powder-pink/50 via-vanilla to-lavender/50 flex items-center justify-center text-8xl">
                  👩‍🍳
                </div>

                <div className="p-4 bg-vanilla text-center border-t border-powder-pink/20">
                  <h4 className="font-serif text-lg font-bold text-chocolate">
                    {site.bakerName}
                  </h4>
                  <p className="font-script text-gold text-lg -mt-1">Kurucu &amp; Pasta Tasarımcısı</p>
                </div>
              </div>

              {/* Hand-drawn style mini pin */}
              <div className="absolute -top-4 -left-4 bg-powder-pink text-chocolate font-serif italic text-xs py-1 px-3 rounded-md shadow-md -rotate-6 border border-white">
                Atölye Mutfağımız 🌸
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="inline-block">
              <span className="font-script text-2xl text-peach font-semibold block">
                Bizim Hikâyemiz
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate mt-1">
                &quot;Her Pasta, Unutulmaz Bir Hikâyedir.&quot;
              </h2>
            </div>

            <blockquote className="italic text-chocolate/80 text-lg border-l-4 border-gold pl-4 py-1 leading-relaxed">
              &ldquo;Biz pastaları yalnızca güzel görünmesi için değil, sevdiklerinizle
              kutladığınız o eşsiz güne tatlı bir hatıra bırakması için hazırlıyoruz.&rdquo;
            </blockquote>

            <div className="space-y-4 text-chocolate/75 text-sm sm:text-base leading-relaxed">
              <p>
                Endüstriyel fabrikasyon kalıplardan çok uzakta, kendi butik ev mutfağımızda her
                sabah taze vanilya kokusuyla uyanıyoruz. Bizim için bir pasta siparişi; sadece
                şeker ve undan ibaret değildir. Bebeğinizin ilk yaş heyecanı, &apos;evet&apos;
                dediğiniz o büyülü an ya da sevdiğinizin yüzündeki tebessümdür.
              </p>
              <p>
                Hazır pandispanya karışımları veya yapay lezzet vericiler kullanmıyoruz. Gerçek
                tereyağı, taze Belçika çikolatası ve mevsimin en güzel meyveleriyle, el emeğiyle
                yoğrulmuş gerçek lezzetleri sunuyoruz.
              </p>
            </div>

            {/* Brand Advantage Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-chocolate/10 text-center">
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <span className="text-2xl mb-1 block">👩‍🍳</span>
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">Fabrika Değil</h4>
                <p className="text-[11px] text-chocolate/60">Gerçek insan &amp; el emeği</p>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <span className="text-2xl mb-1 block">🍓</span>
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">
                  %100 Taze &amp; Katkısız
                </h4>
                <p className="text-[11px] text-chocolate/60">Doğal kaliteli içerik</p>
              </div>
              <div className="p-3 bg-white/70 rounded-2xl border border-powder-pink/30">
                <span className="text-2xl mb-1 block">🎨</span>
                <h4 className="font-bold text-xs sm:text-sm text-chocolate">Kişiye Özel</h4>
                <p className="text-[11px] text-chocolate/60">Sizin hayal ettiğiniz konsept</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
