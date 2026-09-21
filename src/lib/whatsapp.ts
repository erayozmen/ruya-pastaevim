/**
 * Statik CTA linkleri için WhatsApp href üretir.
 *
 * Orijinal HTML'deki statik `<a href="https://wa.me/...">` linkleriyle
 * birebir aynı encode mantığını korur: sadece boşluklar `%20` ile
 * değiştirilir, Türkçe karakterler ve noktalama olduğu gibi bırakılır.
 * Numara artık `site_settings.whatsapp_number` üzerinden çağıran tarafından
 * verilir.
 */
export function buildWhatsappHref(message: string, whatsappNumber: string): string {
  return `https://wa.me/${whatsappNumber}?text=${message.replace(/ /g, "%20")}`;
}

/**
 * Pasta tasarım sihirbazının canlı state'inden WhatsApp mesajı üretir.
 *
 * Orijinal `sendWhatsappBtn` click handler'ındaki mesaj formatını ve
 * encode davranışını (boşluklar encode edilmez, satır sonları `%0A`)
 * birebir korur.
 */
export interface CustomizerWhatsappInput {
  portion: string;
  theme: string;
  color: string;
  flavor: string;
  note: string;
}

export function buildCustomizerWhatsappUrl(
  input: CustomizerWhatsappInput,
  site: { brandName: string; whatsappNumber: string },
): string {
  const message =
    `Merhaba ${site.brandName}! Siteniz üzerinden hayalimdeki pastayı tasarladım:%0A%0A` +
    `🎂 *Kişi Sayısı:* ${input.portion}%0A` +
    `🎀 *Tema:* ${input.theme}%0A` +
    `🎨 *Hakim Renk:* ${input.color}%0A` +
    `🍓 *İç Dolgu:* ${input.flavor}%0A` +
    `✍️ *Pasta Üzeri Not:* ${input.note.trim() ? input.note : "Belirtilmedi"}%0A%0A` +
    `Müsaitlik durumu ve fiyat teklifi alabilir miyim?`;

  return `https://wa.me/${site.whatsappNumber}?text=${message}`;
}
