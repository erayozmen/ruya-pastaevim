/**
 * "En Sevilen Tasarımlarımız" galeri bölümü (Pinterest/masonry).
 *
 * İleride Supabase `gallery_items` tablosundan gelecek. Görseller ve
 * pasta isimleri demo/placeholder içeriktir (bkz. Sprint 0 raporu),
 * gerçek ürün olarak sunulmamalıdır — admin panelinden değiştirilecek.
 */
export interface GalleryItem {
  image: string;
  alt: string;
  /** Grid'de dikey olarak iki satır kaplayan (sm:row-span-2) öğeler. */
  tall?: boolean;
  labelText: string;
  labelColorClass: string;
  title: string;
  whatsappMessage: string;
  ctaHoverBgClass: string;
}

export const galleryItems: GalleryItem[] = [
  {
    image:
      "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=800&q=80",
    alt: "Çilekli Kremalı Katlı Pasta",
    tall: true,
    labelText: "Taze Meyveli",
    labelColorClass: "text-powder-pink",
    title: "Çilek Rüyası Naked Cake",
    whatsappMessage:
      "Merhaba, sitenizdeki 'Çilek Rüyası Naked Cake' hakkında fiyat alabilir miyim?",
    ctaHoverBgClass: "hover:bg-peach",
  },
  {
    image:
      "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80",
    alt: "Lavanta Çiçekli Butik Pasta",
    labelText: "Zarif Detaylar",
    labelColorClass: "text-lavender",
    title: "Pastel Lavanta & Çiçek",
    whatsappMessage: "Merhaba, sitenizdeki 'Pastel Lavanta' tasarımı hakkında bilgi istiyorum.",
    ctaHoverBgClass: "hover:bg-lavender",
  },
  {
    image:
      "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=800&q=80",
    alt: "Bento Minimal Pasta",
    labelText: "Bento Stil",
    labelColorClass: "text-powder-pink",
    title: "Minimal Vintage Bento",
    whatsappMessage: "Merhaba, bento pasta tasarımı hakkında bilgi almak istiyorum.",
    ctaHoverBgClass: "hover:bg-powder-pink",
  },
  {
    image:
      "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=800&q=80",
    alt: "Altın Detaylı Nişan Pastası",
    tall: true,
    labelText: "Söz & Nişan",
    labelColorClass: "text-gold",
    title: "Gold Leaf & Rose",
    whatsappMessage: "Merhaba, 'Gold Leaf Rose' nişan pastası fiyatını öğrenebilir miyim?",
    ctaHoverBgClass: "hover:bg-gold",
  },
  {
    image:
      "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=800&q=80",
    alt: "Çikolatalı Özel Pasta",
    labelText: "Çikolata Severlere",
    labelColorClass: "text-peach",
    title: "Belçika Çikolatası & Karamelli",
    whatsappMessage: "Merhaba, Belçika çikolatalı pasta siparişi vermek istiyorum.",
    ctaHoverBgClass: "hover:bg-peach",
  },
  {
    image:
      "https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80",
    alt: "Çocuk Doğum Günü Pastası",
    labelText: "1. Yaş Kutlaması",
    labelColorClass: "text-powder-pink",
    title: "Teddy Bear & Balonlar",
    whatsappMessage: "Merhaba, Teddy Bear çocuk pastası hakkında detay alabilir miyim?",
    ctaHoverBgClass: "hover:bg-powder-pink",
  },
];
