export interface CustomizerPreviewCake {
  imageUrl: string;
  themeValues: string[];
  colorValues: string[];
}

/**
 * Picks which real cake photo best represents the customer's current
 * theme + color selection in the "Pastanı Tasarla" live preview.
 *
 * Scoring is deliberately simple and explainable: a cake tagged with the
 * selected theme scores 2, a cake tagged with the selected color scores 1,
 * both together score 3 (best match). The highest-scoring cake wins; ties
 * keep the first one encountered (the pool is ordered by `sort_order`, so
 * this is a stable, predictable choice — never random).
 *
 * If nothing scores above 0 (no cake tagged with either the theme or the
 * color), this falls back to the first cake in the pool rather than
 * showing a blank/broken preview — a photo that doesn't perfectly match
 * the selection is always better than no photo.
 */
export function pickCustomizerPreviewImage(
  pool: CustomizerPreviewCake[],
  selection: { theme: string; color: string },
): string | null {
  let best: CustomizerPreviewCake | null = null;
  let bestScore = 0;

  for (const cake of pool) {
    let score = 0;
    if (selection.theme && cake.themeValues.includes(selection.theme)) score += 2;
    if (selection.color && cake.colorValues.includes(selection.color)) score += 1;
    if (score > bestScore) {
      bestScore = score;
      best = cake;
    }
  }

  if (best) return best.imageUrl;
  return pool[0]?.imageUrl ?? null;
}
