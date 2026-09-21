"use client";

import { useState, useTransition } from "react";
import { useCustomizer } from "@/context/customizer-context";
import type { CustomizerOptions } from "@/lib/customizer-queries";
import { buildCustomizerWhatsappUrl } from "@/lib/whatsapp";
import { createOrderRequest } from "@/lib/order-requests";
import type { SiteSettings } from "@/lib/site-data";

export function CakeCustomizer({
  options,
  error,
  site,
}: {
  options: CustomizerOptions;
  error: string | null;
  site: SiteSettings;
}) {
  const { state, setPortion, setTheme, setColor, setFlavor, setNote } = useCustomizer();
  const { portions, themes, colors, flavors } = options;

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [isPending, startTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  const activeTheme = themes.find((t) => t.value === state.theme) ?? themes[0];
  const previewTitle = activeTheme
    ? `${state.theme.replace(/^\S+\s/, "")} Butik Pasta (${state.color})`
    : "Butik Pasta";

  const canSubmit =
    portions.length > 0 && themes.length > 0 && colors.length > 0 && flavors.length > 0;

  const handleSubmit = () => {
    setSubmitError(null);
    setSuccessUrl(null);

    if (!customerName.trim()) {
      setSubmitError("Adınızı girin.");
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      setSubmitError("Geçerli bir telefon numarası girin.");
      return;
    }

    startTransition(async () => {
      const result = await createOrderRequest({
        customerName,
        phone,
        portion: state.portion,
        theme: state.theme,
        color: state.color,
        flavor: state.flavor,
        note: state.note,
      });

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      const whatsappUrl = buildCustomizerWhatsappUrl(state, site);
      setSuccessUrl(whatsappUrl);
      const opened = window.open(whatsappUrl, "_blank");
      if (!opened) {
        // Popup blocked — the success message below still shows the link.
      }
    });
  };

  return (
    <section id="tasarla" className="py-24 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 -left-20 w-96 h-96 bg-powder-pink/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-lavender/30 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-peach/20 text-chocolate text-xs font-bold uppercase tracking-wider mb-2">
            ✨ Sihirli Sipariş Adımı
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate">
            Pastanı Birlikte Tasarlayalım
          </h2>
          <p className="text-chocolate/70 text-sm sm:text-base mt-2">
            Seçimlerinizi yapın, canlı pasta kartınız oluşsun ve tek tıkla detayları hazır bir
            WhatsApp mesajı olarak bize ulaştırın!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-powder-pink/40 space-y-8">
            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Seçenekler yüklenirken bir sorun oluştu. Lütfen sayfayı yenileyin.
              </div>
            )}

            {/* Step 1: Kişi Sayısı */}
            <div>
              <label className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-3">
                1. Kişi Sayısı
              </label>
              {portions.length === 0 ? (
                <p className="text-sm text-chocolate/60">Porsiyon seçenekleri şu anda mevcut değil.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {portions.map((option) => {
                    const active = state.portion === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setPortion(option.value)}
                        className={`py-3 px-4 rounded-2xl border-2 font-semibold text-sm transition-all focus:outline-none ${
                          active
                            ? "border-powder-pink bg-powder-pink/20 text-chocolate"
                            : "border-chocolate/10 hover:border-powder-pink text-chocolate"
                        }`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 2: Tema Seçimi */}
            <div>
              <label className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-3">
                2. Kutlama Teması
              </label>
              {themes.length === 0 ? (
                <p className="text-sm text-chocolate/60">Tema seçenekleri şu anda mevcut değil.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {themes.map((option) => {
                    const active = state.theme === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setTheme(option.value)}
                        className={`py-3 px-3 rounded-2xl border-2 font-medium text-xs sm:text-sm text-left flex items-center gap-2 transition-all ${
                          active
                            ? "border-powder-pink bg-powder-pink/20 text-chocolate"
                            : "border-chocolate/10 hover:border-powder-pink text-chocolate"
                        }`}
                      >
                        <span>{option.emoji}</span> {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Renk Paleti */}
            <div>
              <label className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-3">
                3. Hakim Renk Tonu
              </label>
              {colors.length === 0 ? (
                <p className="text-sm text-chocolate/60">Renk seçenekleri şu anda mevcut değil.</p>
              ) : (
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {colors.map((option) => {
                    const active = state.color === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setColor(option.value)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-full border-2 text-xs font-semibold text-chocolate transition-all ${option.bgClass} ${
                          active ? "border-chocolate" : `border-transparent ${option.hoverBorderClass}`
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border ${option.swatchBorderClass}`}
                          style={{ backgroundColor: option.swatchColor }}
                        ></span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 4: Kek & Dolgu Tercihi */}
            <div>
              <label
                htmlFor="flavorSelect"
                className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-2"
              >
                4. Favori Lezzet / Dolgu
              </label>
              {flavors.length === 0 ? (
                <p className="text-sm text-chocolate/60">Lezzet seçenekleri şu anda mevcut değil.</p>
              ) : (
                <select
                  id="flavorSelect"
                  value={state.flavor}
                  onChange={(e) => setFlavor(e.target.value)}
                  className="w-full bg-vanilla border border-powder-pink/50 rounded-2xl py-3 px-4 text-chocolate font-medium text-sm focus:outline-none focus:ring-2 focus:ring-peach transition-all"
                >
                  {flavors.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Step 5: İsim veya Özel Not */}
            <div>
              <label
                htmlFor="customNoteInput"
                className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-2"
              >
                5. Pasta Üzeri Yazı veya Özel Not
              </label>
              <input
                id="customNoteInput"
                type="text"
                value={state.note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
                placeholder="Örn: 'İyi ki doğdun Ela! - 3 Yaş' veya tarih"
                className="w-full bg-vanilla border border-powder-pink/50 rounded-2xl py-3 px-4 text-chocolate placeholder-chocolate/40 text-sm focus:outline-none focus:ring-2 focus:ring-peach transition-all"
              />
            </div>

            {/* Step 6: İletişim Bilgileriniz */}
            <div>
              <label className="block text-sm font-bold text-chocolate uppercase tracking-wider mb-2">
                6. İletişim Bilgileriniz
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Adınız"
                  className="w-full bg-vanilla border border-powder-pink/50 rounded-2xl py-3 px-4 text-chocolate placeholder-chocolate/40 text-sm focus:outline-none focus:ring-2 focus:ring-peach transition-all"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Telefon Numaranız"
                  className="w-full bg-vanilla border border-powder-pink/50 rounded-2xl py-3 px-4 text-chocolate placeholder-chocolate/40 text-sm focus:outline-none focus:ring-2 focus:ring-peach transition-all"
                />
              </div>
            </div>
          </div>

          {/* Live Preview / WhatsApp CTA Column */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <div className="bg-gradient-to-br from-white via-vanilla to-powder-pink/20 rounded-3xl p-6 sm:p-7 shadow-lg border-2 border-powder-pink/50 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-powder-pink/30 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-peach animate-ping"></span>
                  <h3 className="font-serif text-xl font-bold text-chocolate">Tasarım Özeti</h3>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-powder-pink font-semibold text-chocolate">
                  Kişiye Özel
                </span>
              </div>

              {/* Cake visual sketch / preview frame */}
              <div
                className="w-full h-44 rounded-2xl mb-6 bg-cover bg-center transition-all duration-500 relative flex items-end p-4 border border-white/60 shadow-inner bg-powder-pink/10"
                style={activeTheme?.image ? { backgroundImage: `url('${activeTheme.image}')` } : undefined}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/70 via-transparent to-transparent rounded-2xl"></div>
                <div className="relative z-10 text-white">
                  <p className="font-serif text-lg font-bold">{previewTitle}</p>
                  <p className="text-xs text-powder-pink font-medium">{state.portion}</p>
                </div>
              </div>

              {/* Spec list */}
              <ul className="space-y-3 text-xs sm:text-sm text-chocolate/85 mb-6">
                <li className="flex items-center justify-between py-1 border-b border-chocolate/5">
                  <span className="text-chocolate/60">Kişi Sayısı:</span>
                  <span className="font-semibold text-chocolate">{state.portion || "—"}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-chocolate/5">
                  <span className="text-chocolate/60">Tema:</span>
                  <span className="font-semibold text-chocolate">{state.theme || "—"}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-chocolate/5">
                  <span className="text-chocolate/60">Renk Paleti:</span>
                  <span className="font-semibold text-chocolate">{state.color || "—"}</span>
                </li>
                <li className="flex items-center justify-between py-1 border-b border-chocolate/5">
                  <span className="text-chocolate/60">İç Dolgu:</span>
                  <span className="font-semibold text-chocolate truncate max-w-[200px] text-right">
                    {state.flavor || "—"}
                  </span>
                </li>
                <li className="flex items-start justify-between py-1">
                  <span className="text-chocolate/60">Özel Not:</span>
                  <span className="font-semibold text-chocolate italic text-right truncate max-w-[180px]">
                    {state.note.trim() ? state.note : "Belirtilmedi"}
                  </span>
                </li>
              </ul>

              {/* Dynamic WhatsApp Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending || !canSubmit}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <i className="fa-brands fa-whatsapp text-2xl"></i>
                <span>{isPending ? "Gönderiliyor..." : "Bu Pastayı WhatsApp'tan İste"}</span>
              </button>

              {submitError && (
                <p className="text-xs text-center text-red-600 mt-3 font-medium">{submitError}</p>
              )}

              {successUrl && !submitError && (
                <p className="text-xs text-center text-green-700 mt-3 font-medium">
                  Talebiniz alındı! WhatsApp açılmadıysa{" "}
                  <a href={successUrl} target="_blank" rel="noreferrer" className="underline">
                    buraya tıklayın
                  </a>
                  .
                </p>
              )}

              {!submitError && !successUrl && (
                <p className="text-[11px] text-center text-chocolate/60 mt-3">
                  Gönderdiğinizde talebiniz bize kaydedilir ve tasarım bilgileriniz hazır mesaj
                  olarak WhatsApp&apos;a aktarılır.
                </p>
              )}
            </div>

            {/* Quick Tip Card */}
            <div className="bg-powder-pink/20 rounded-2xl p-4 text-xs text-chocolate/75 border border-powder-pink/40 flex items-start gap-3">
              <span className="text-base text-gold">💡</span>
              <p>
                <strong>Önemli İpucu:</strong> Özel pasta siparişlerinizin ne kadar önceden
                bildirilmesi gerektiğini öğrenmek için bizimle iletişime geçin; el yapımı
                figürlerin hazırlanması zaman alabilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
