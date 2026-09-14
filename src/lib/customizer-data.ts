/**
 * Pasta tasarım sihirbazının statik seçenek verisi.
 *
 * İleride Supabase `customizer_portions` / `customizer_themes` /
 * `customizer_colors` / `customizer_flavors` tablolarından gelecek.
 * Değerler (value alanları) orijinal HTML'deki `data-val` değerleriyle
 * birebir aynıdır — WhatsApp mesaj metni ve kategori→tema yönlendirmesi
 * bu değerlere bağlıdır, değiştirilmemelidir.
 */

export interface PortionOption {
  value: string;
  label: string;
}

export const portionOptions: PortionOption[] = [
  { value: "6-8 Kişilik", label: "🎂 6 - 8" },
  { value: "10-12 Kişilik", label: "🎂 10 - 12" },
  { value: "15-20 Kişilik", label: "🎂 15 - 20" },
  { value: "25+ Kişilik (Katlı)", label: "🎂 25+ (Katlı)" },
];

export interface ThemeOption {
  value: string;
  emoji: string;
  label: string;
  /** Canlı önizleme kutusunda kullanılan görsel (demo/placeholder). */
  image: string;
}

export const themeOptions: ThemeOption[] = [
  {
    value: "🎀 Romantik",
    emoji: "🎀",
    label: "Romantik",
    image:
      "https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "🌸 Çiçekli",
    emoji: "🌸",
    label: "Çiçekli & Doğal",
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "🧸 Çocuk",
    emoji: "🧸",
    label: "Çocuk / Bebek",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "🎂 Doğum Günü",
    emoji: "🎂",
    label: "Doğum Günü",
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "💍 Nişan",
    emoji: "💍",
    label: "Nişan / Söz",
    image:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=700&q=80",
  },
  {
    value: "✨ Minimal",
    emoji: "✨",
    label: "Minimal & Bento",
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=700&q=80",
  },
];

export interface ColorOption {
  value: string;
  label: string;
  /** Buton arka planı (aktif olmayan durumda da görünen zemin rengi). */
  bgClass: string;
  /** Aktif değilken hover'da beliren border rengi. */
  hoverBorderClass: string;
  /** Küçük renk noktası arka planı. */
  swatchColor: string;
  /** Küçük renk noktasının border class'ı (çoğu chocolate/20, Krem&Altın'da gold). */
  swatchBorderClass: string;
}

export const colorOptions: ColorOption[] = [
  {
    value: "Pudra Pembe",
    label: "Pudra Pembe",
    bgClass: "bg-powder-pink/30",
    hoverBorderClass: "hover:border-powder-pink",
    swatchColor: "#F6C7C9",
    swatchBorderClass: "border-chocolate/20",
  },
  {
    value: "Lavanta & Lila",
    label: "Lavanta",
    bgClass: "bg-lavender/30",
    hoverBorderClass: "hover:border-lavender",
    swatchColor: "#DCC9E8",
    swatchBorderClass: "border-chocolate/20",
  },
  {
    value: "Sıcak Şeftali",
    label: "Şeftali",
    bgClass: "bg-peach/30",
    hoverBorderClass: "hover:border-peach",
    swatchColor: "#F4B49D",
    swatchBorderClass: "border-chocolate/20",
  },
  {
    value: "Bebek Mavisi / Mint",
    label: "Pastel Mavi",
    bgClass: "bg-blue-50",
    hoverBorderClass: "hover:border-blue-300",
    swatchColor: "#BEE3F8",
    swatchBorderClass: "border-chocolate/20",
  },
  {
    value: "Krem & Altın Dokunuş",
    label: "Krem & Altın",
    bgClass: "bg-amber-50",
    hoverBorderClass: "hover:border-gold",
    swatchColor: "#FFF8F0",
    swatchBorderClass: "border-gold",
  },
];

export interface FlavorOption {
  value: string;
  label: string;
}

export const flavorOptions: FlavorOption[] = [
  {
    value: "Belçika Çikolatası & Taze Çilek",
    label: "🍓 Belçika Çikolatası & Taze Çilek (En Çok Tercih Edilen)",
  },
  {
    value: "Vanilyalı Beyaz Krema & Orman Meyveleri",
    label: "🫐 Vanilyalı Beyaz Krema & Orman Meyveleri",
  },
  {
    value: "Fıstık Krokan & Karamel",
    label: "🥜 Fıstık Krokan & Tuzlu Karamel",
  },
  {
    value: "Limon Curd & Beyaz Çikolata",
    label: "🍋 Ferah Limon Curd & Beyaz Çikolata Ganaj",
  },
];

export const defaultCustomizerState = {
  portion: portionOptions[0].value,
  theme: themeOptions[0].value,
  color: colorOptions[0].value,
  flavor: flavorOptions[0].value,
  note: "",
};
