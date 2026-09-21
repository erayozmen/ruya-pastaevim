/**
 * Merkezi site ayarları.
 *
 * Bu dosya ileride (Sprint 3+) Supabase `site_settings` tablosundan
 * gelecek veriler için geçici, statik bir kaynaktır. Component'ler
 * doğrudan bu objeye değil, bu objenin şeklini kullanan props/hook'lara
 * bağlı kalacak şekilde yazılmıştır; böylece bu dosya ileride bir
 * `getSiteSettings()` server fonksiyonuyla değiştirilebilir.
 *
 * NOT: `address`, `workingHours`, `deliveryInfo` ve `minOrderNotice`
 * alanları işletme tarafından henüz doğrulanmadığı için `null` bırakıldı.
 * Bu alanlar uydurulmamalı; ileride admin panelinden doldurulacak.
 */
export const siteConfig = {
  brand: {
    name: "Rüya Pasta Evim",
    tagline: "Kişiye Özel Butik Pastane",
    baker: "Gülden Kantor",
  },
  contact: {
    whatsappNumber: "905419090725",
    whatsappDisplay: "0541 909 07 25",
    phoneHref: "tel:+905419090725",
    instagramHandle: "@ruyapastaevim",
    instagramUrl: "https://www.instagram.com/ruyapastaevim/",
    address: null as string | null,
    workingHours: null as string | null,
    deliveryInfo: null as string | null,
    minOrderNotice: null as string | null,
  },
} as const;
