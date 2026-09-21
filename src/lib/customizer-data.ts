/**
 * Types and presentation-only helpers for the "Pastanı Tasarla" customizer.
 *
 * The option lists themselves (portions, themes, colors, flavors) come from
 * the Supabase `customizer_*` tables (see `customizer-queries.ts`); the old
 * hardcoded demo arrays, including their Unsplash stock preview images,
 * were removed. `value` fields match the database `value` column exactly —
 * the WhatsApp message and order snapshots depend on them.
 */

export interface PortionOption {
  value: string;
  label: string;
}

export interface ThemeOption {
  value: string;
  emoji: string;
  label: string;
  /** Live-preview image; empty when no own (Storage) image is set. */
  image: string;
}

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

export interface FlavorOption {
  value: string;
  label: string;
}

/** Used only until/unless real options are available. */
export const defaultCustomizerState = {
  portion: "",
  theme: "",
  color: "",
  flavor: "",
  note: "",
};

/**
 * `customizer_colors` only stores a hex value (`swatch_hex`) — the button
 * background/hover/border Tailwind classes are a purely visual concern tied
 * to this site's brand palette (`powder-pink`, `lavender`, etc. from
 * `tailwind.config`), not business data, so they stay mapped here by the
 * option's `value` rather than coming from the database. Any color an admin
 * adds later that isn't in this map still renders correctly via the
 * generic fallback below — it just won't get a brand-matched tinted button.
 */
const COLOR_STYLE_BY_VALUE: Record<
  string,
  Pick<ColorOption, "bgClass" | "hoverBorderClass" | "swatchBorderClass">
> = {
  "Pudra Pembe": {
    bgClass: "bg-powder-pink/30",
    hoverBorderClass: "hover:border-powder-pink",
    swatchBorderClass: "border-chocolate/20",
  },
  "Lavanta & Lila": {
    bgClass: "bg-lavender/30",
    hoverBorderClass: "hover:border-lavender",
    swatchBorderClass: "border-chocolate/20",
  },
  "Sıcak Şeftali": {
    bgClass: "bg-peach/30",
    hoverBorderClass: "hover:border-peach",
    swatchBorderClass: "border-chocolate/20",
  },
  "Bebek Mavisi / Mint": {
    bgClass: "bg-blue-50",
    hoverBorderClass: "hover:border-blue-300",
    swatchBorderClass: "border-chocolate/20",
  },
  "Krem & Altın Dokunuş": {
    bgClass: "bg-amber-50",
    hoverBorderClass: "hover:border-gold",
    swatchBorderClass: "border-gold",
  },
};

const DEFAULT_COLOR_STYLE: Pick<ColorOption, "bgClass" | "hoverBorderClass" | "swatchBorderClass"> = {
  bgClass: "bg-neutral-100",
  hoverBorderClass: "hover:border-chocolate/40",
  swatchBorderClass: "border-chocolate/20",
};

export function getColorStyle(value: string) {
  return COLOR_STYLE_BY_VALUE[value] ?? DEFAULT_COLOR_STYLE;
}
