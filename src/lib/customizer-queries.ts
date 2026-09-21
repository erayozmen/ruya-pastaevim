import { createClient } from "@/lib/supabase/server";
import { isOwnMediaUrl } from "@/lib/site-data";
import { getColorStyle, type ColorOption, type FlavorOption, type PortionOption, type ThemeOption } from "@/lib/customizer-data";

export interface CustomizerOptions {
  portions: PortionOption[];
  themes: ThemeOption[];
  colors: ColorOption[];
  flavors: FlavorOption[];
}

export interface CustomizerOptionsResult {
  options: CustomizerOptions;
  /** Set only when a Supabase query itself failed (network/DB error), not for empty-but-successful results. */
  error: string | null;
}

export async function getCustomizerOptions(): Promise<CustomizerOptionsResult> {
  const supabase = await createClient();

  const [portionsRes, themesRes, colorsRes, flavorsRes] = await Promise.all([
    supabase
      .from("customizer_portions")
      .select("value, label, emoji")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("customizer_themes")
      .select("value, label, emoji, image_url")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("customizer_colors")
      .select("value, label, swatch_hex")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
    supabase
      .from("customizer_flavors")
      .select("value, label")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const firstError =
    portionsRes.error ?? themesRes.error ?? colorsRes.error ?? flavorsRes.error ?? null;

  const portions: PortionOption[] = (portionsRes.data ?? []).map((row) => ({
    value: row.value,
    label: row.emoji ? `${row.emoji} ${row.label}` : row.label,
  }));

  const themes: ThemeOption[] = (themesRes.data ?? []).map((row) => ({
    value: row.value,
    label: row.label,
    emoji: row.emoji ?? "",
    // Seed rows carry Unsplash stock URLs; only the project's own Storage images are shown.
    image: isOwnMediaUrl(row.image_url) ? row.image_url : "",
  }));

  const colors: ColorOption[] = (colorsRes.data ?? []).map((row) => {
    const style = getColorStyle(row.value);
    return {
      value: row.value,
      label: row.label,
      swatchColor: row.swatch_hex ?? "#e5e5e5",
      ...style,
    };
  });

  const flavors: FlavorOption[] = (flavorsRes.data ?? []).map((row) => ({
    value: row.value,
    label: row.label,
  }));

  return {
    options: { portions, themes, colors, flavors },
    error: firstError ? firstError.message : null,
  };
}
