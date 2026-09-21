import { siteConfig } from "@/lib/site-config";

/** Not stored in `site_settings`; brand tagline copy from the original design. */
export const BRAND_TAGLINE = "Kişiye Özel Butik Pastane";

export interface SiteSettings {
  brandName: string;
  bakerName: string;
  tagline: string;
  whatsappNumber: string;
  /** Human-readable phone, exactly as stored in `site_settings.phone`. */
  phoneDisplay: string;
  phoneHref: string;
  instagramHandle: string;
  instagramUrl: string;
  address: string | null;
  workingHours: string | null;
  deliveryInfo: string | null;
  minimumOrderDays: number | null;
}

interface SiteSettingsRow {
  brand_name: string;
  baker_name: string;
  instagram_username: string;
  instagram_url: string;
  whatsapp_number: string;
  phone: string;
  address: string | null;
  working_hours: string | null;
  delivery_info: string | null;
  minimum_order_days: number | null;
}

export function mapSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    brandName: row.brand_name,
    bakerName: row.baker_name,
    tagline: BRAND_TAGLINE,
    whatsappNumber: row.whatsapp_number,
    phoneDisplay: row.phone,
    phoneHref: `tel:+${row.whatsapp_number}`,
    instagramHandle: row.instagram_username,
    instagramUrl: row.instagram_url,
    address: row.address,
    workingHours: row.working_hours,
    deliveryInfo: row.delivery_info,
    minimumOrderDays: row.minimum_order_days,
  };
}

/**
 * Used only if the `site_settings` read fails. Same verified values the
 * database holds (never invented data), so the page still renders.
 */
export const FALLBACK_SITE_SETTINGS: SiteSettings = {
  brandName: siteConfig.brand.name,
  bakerName: siteConfig.brand.baker,
  tagline: BRAND_TAGLINE,
  whatsappNumber: siteConfig.contact.whatsappNumber,
  phoneDisplay: siteConfig.contact.whatsappDisplay,
  phoneHref: siteConfig.contact.phoneHref,
  instagramHandle: siteConfig.contact.instagramHandle,
  instagramUrl: siteConfig.contact.instagramUrl,
  address: null,
  workingHours: null,
  deliveryInfo: null,
  minimumOrderDays: null,
};

/**
 * True only for images served from this project's own Supabase Storage.
 * The seed data still carries Unsplash demo URLs in `categories.image_url`
 * and `customizer_themes.image_url`; those are stock photos and must not
 * be presented as Rüyam Pasta Evim's own work, so anything that is not a
 * Storage URL is treated as "no image".
 */
export function isOwnMediaUrl(url: string | null | undefined): url is string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url || !base) return false;
  return url.startsWith(`${base}/storage/v1/object/public/`);
}

/** Design-token accents cycled over dynamic cards (gallery/reviews). */
export const ACCENT_PALETTE = [
  { label: "text-powder-pink", cta: "hover:bg-peach", border: "border-powder-pink" },
  { label: "text-lavender", cta: "hover:bg-lavender", border: "border-lavender" },
  { label: "text-peach", cta: "hover:bg-peach", border: "border-peach" },
  { label: "text-gold", cta: "hover:bg-gold", border: "border-gold" },
] as const;

export function accentFor(index: number) {
  return ACCENT_PALETTE[index % ACCENT_PALETTE.length];
}
