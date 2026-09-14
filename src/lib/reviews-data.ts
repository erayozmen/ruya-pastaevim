/**
 * "Kutlamalardan Yansıyan Mutluluk" müşteri yorumları.
 *
 * DEMO/placeholder içeriktir — gerçek müşteri yorumları henüz
 * sağlanmadı (bkz. Sprint 0 raporu §21). İleride Supabase `reviews`
 * tablosundan gelecek ve admin panelinden yönetilecek.
 */
export interface Review {
  name: string;
  meta: string;
  rating: number;
  quote: string;
  avatar: string;
  avatarBorderClass: string;
}

export const reviews: Review[] = [
  {
    name: "Merve Tanrıkulu",
    meta: "Doğum Günü Kutlaması",
    rating: 5,
    quote:
      "Kızımın 2. yaş doğum günü için teddy bear temalı bir pasta istemiştik. Gördüğümüzde gözlerimize inanamadık, fotoğraftakinden bile kat kat güzeldi! Misafirlerimiz kekinin tazeliğine hayran kaldı.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    avatarBorderClass: "border-powder-pink",
  },
  {
    name: "Burcu & Caner",
    meta: "Söz & Nişan Töreni",
    rating: 5,
    quote:
      "Söz masamız için hazırlanan 2 katlı çiçekli pasta tam hayalimdeki gibi sade ve çok zarifti. Ağır şeker hamurlu pastalar gibi değil; vanilya kreması ve çikolatası o kadar dengeliydi ki...",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    avatarBorderClass: "border-lavender",
  },
  {
    name: "Ayşe Demir",
    meta: "Yıl Dönümü Bento Pasta",
    rating: 5,
    quote:
      "Eşime sürpriz bento pasta sipariş ettim. WhatsApp üzerinden mesajlaşarak 1 saatte tasarımı netleştirdik. Zamanında, sıfır hasarla teslim edildi. Ablamızın samimiyeti ve ilgisi için ayrıca teşekkür ederim.",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    avatarBorderClass: "border-peach",
  },
];
