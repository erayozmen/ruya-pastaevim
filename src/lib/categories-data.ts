/**
 * Ana sayfadaki "Pasta Koleksiyonları" kartları.
 *
 * İleride Supabase `categories` tablosundan gelecek. Görseller Unsplash
 * demo görselleridir, gerçek işletme fotoğrafı değildir (bkz. Sprint 0
 * raporu §8/§21) — Supabase Storage entegrasyonunda değiştirilecek.
 */
export interface CategoryCard {
  slug: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
  /** Grup hover'ında başlığın alacağı Tailwind text rengi class'ı. */
  titleHoverClass: string;
  /** Görselin üstünde hover'da beliren kısa metin (bazı kartlarda yok). */
  hoverText?: string;
  /** "Bu Temayı Tasarla" tıklanınca customizer'da seçilecek tema değeri. */
  themeValue: string;
}

export const categoryCards: CategoryCard[] = [
  {
    slug: "dogum-gunu-pastalari",
    title: "Doğum Günü Pastaları",
    description:
      "Rakam pastalar, vintage bento konseptler ve unutulmaz kutlamalar için özel renk paletleri.",
    image:
      "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80",
    emoji: "🎂",
    titleHoverClass: "group-hover:text-peach",
    hoverText: "Fotoğrafı incele & ilham al",
    themeValue: "🎂 Doğum Günü",
  },
  {
    slug: "cocuk-pastalari",
    title: "Çocuk Pastaları",
    description:
      "Sevimli hayvan figürleri, masal kahramanları ve çocukların dünyasına uygun sağlıklı içerikler.",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
    emoji: "🧸",
    titleHoverClass: "group-hover:text-lavender",
    hoverText: "En tatlı çocuk temaları",
    themeValue: "🧸 Çocuk",
  },
  {
    slug: "nisan-soz-pastalari",
    title: "Nişan & Söz Pastaları",
    description:
      "Canlı çiçek dokunuşları, altın varaklar ve masanıza zarafet katacak romantik tasarımlar.",
    image:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80",
    emoji: "💍",
    titleHoverClass: "group-hover:text-gold",
    hoverText: "Zarif ve romantik detaylar",
    themeValue: "💍 Nişan",
  },
  {
    slug: "baby-shower",
    title: "Baby Shower & Cinsiyet",
    description:
      "Pudra pastel renkler, minik patikler, bulutlar ve heyecan dolu cinsiyet partisi sürprizleri.",
    image:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=800&q=80",
    emoji: "🍼",
    titleHoverClass: "group-hover:text-peach",
    themeValue: "🎀 Romantik",
  },
  {
    slug: "dugun-ozel-kutlama",
    title: "Düğün & Özel Kutlama",
    description:
      "Çok katlı gösterişli tasarımlar, yenilebilir çiçekler ve unutulmaz lezzet dengesi.",
    image:
      "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=800&q=80",
    emoji: "💐",
    titleHoverClass: "group-hover:text-gold",
    themeValue: "🌸 Çiçekli",
  },
  {
    slug: "ozel-konsept-bento",
    title: "Özel Konsept & Bento",
    description:
      "Kore bento tarzı esprili yazılar, sanatsal pasta tabloları ve sadece size özel fikirler.",
    image:
      "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&w=800&q=80",
    emoji: "✨",
    titleHoverClass: "group-hover:text-peach",
    themeValue: "✨ Minimal",
  },
];
