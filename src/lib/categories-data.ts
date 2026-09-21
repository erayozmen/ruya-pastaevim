/**
 * Presentation-only metadata for the home "Pasta Koleksiyonları" cards.
 *
 * Category content itself (name, description, image, emoji, order,
 * visibility) comes from the Supabase `categories` table. What lives here
 * is what the database does not model: the hover accent color, the short
 * hover caption from the original design, and which customizer theme the
 * "Bu Temayı Tasarla" link should preselect. Keyed by category `slug`; a
 * category the admin adds later without an entry here still renders with
 * the neutral defaults below and simply scrolls to the customizer.
 */
export interface CategoryCardStyle {
  /** Group-hover text color class for the title. */
  titleHoverClass: string;
  /** Short caption shown on image hover (only some cards have one). */
  hoverText?: string;
  /** Customizer theme `value` to preselect on "Bu Temayı Tasarla". */
  themeValue?: string;
}

const CATEGORY_CARD_STYLE: Record<string, CategoryCardStyle> = {
  "dogum-gunu-pastalari": {
    titleHoverClass: "group-hover:text-peach",
    hoverText: "Fotoğrafı incele & ilham al",
    themeValue: "🎂 Doğum Günü",
  },
  "cocuk-pastalari": {
    titleHoverClass: "group-hover:text-lavender",
    hoverText: "En tatlı çocuk temaları",
    themeValue: "🧸 Çocuk",
  },
  "nisan-soz-pastalari": {
    titleHoverClass: "group-hover:text-gold",
    hoverText: "Zarif ve romantik detaylar",
    themeValue: "💍 Nişan",
  },
  "baby-shower": {
    titleHoverClass: "group-hover:text-peach",
    themeValue: "🎀 Romantik",
  },
  "dugun-ozel-kutlama": {
    titleHoverClass: "group-hover:text-gold",
    themeValue: "🌸 Çiçekli",
  },
  "ozel-konsept-bento": {
    titleHoverClass: "group-hover:text-peach",
    themeValue: "✨ Minimal",
  },
};

const DEFAULT_CATEGORY_CARD_STYLE: CategoryCardStyle = {
  titleHoverClass: "group-hover:text-peach",
};

export function getCategoryCardStyle(slug: string): CategoryCardStyle {
  return CATEGORY_CARD_STYLE[slug] ?? DEFAULT_CATEGORY_CARD_STYLE;
}
