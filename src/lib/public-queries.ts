import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  FALLBACK_SITE_SETTINGS,
  isOwnMediaUrl,
  mapSiteSettings,
  type SiteSettings,
} from "@/lib/site-data";

/**
 * Public read layer. Every query runs through the anon-capable server
 * client, so the existing RLS policies (active rows only) are what actually
 * gate visibility; the `is_active` filters below are a second, explicit
 * layer, not a substitute. A failed read is logged and degrades to an
 * empty list / fallback so the page still renders.
 */

export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  /** Own Storage image only — seed-time stock URLs are dropped. */
  imageUrl: string | null;
  emoji: string | null;
  showOnHome: boolean;
}

export interface PublicCake {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  mainImageUrl: string | null;
  price: number | null;
  showPrice: boolean;
  isFeatured: boolean;
  categoryId: string | null;
}

export interface PublicCakeDetail extends PublicCake {
  /** Extra gallery images, in `cake_images.sort_order`. */
  images: string[];
}

export interface PublicGalleryItem {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  categoryName: string | null;
}

export interface PublicReview {
  id: string;
  customerName: string;
  content: string;
  rating: number;
  photoUrl: string | null;
  categoryName: string | null;
}

export interface HomePageData {
  site: SiteSettings;
  categories: PublicCategory[];
  heroCake: PublicCake | null;
  galleryItems: PublicGalleryItem[];
  reviews: PublicReview[];
}

type Supabase = Awaited<ReturnType<typeof createClient>>;

function logError(scope: string, error: { message: string } | null) {
  if (error) console.error(`[public-queries] ${scope}: ${error.message}`);
}

export async function getSiteSettings(supabase?: Supabase): Promise<SiteSettings> {
  const client = supabase ?? (await createClient());
  const { data, error } = await client.from("site_settings").select("*").maybeSingle();
  logError("site_settings", error);
  return data ? mapSiteSettings(data) : FALLBACK_SITE_SETTINGS;
}

export async function getPublicCategories(supabase?: Supabase): Promise<PublicCategory[]> {
  const client = supabase ?? (await createClient());
  const { data, error } = await client
    .from("categories")
    .select("id, slug, name, description, image_url, icon_emoji, show_on_home")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logError("categories", error);

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    imageUrl: isOwnMediaUrl(row.image_url) ? row.image_url : null,
    emoji: row.icon_emoji,
    showOnHome: row.show_on_home,
  }));
}

const CAKE_COLUMNS =
  "id, slug, name, description, main_image_url, price, show_price, is_featured, category_id";

function mapCake(row: {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  main_image_url: string | null;
  price: number | null;
  show_price: boolean;
  is_featured: boolean;
  category_id: string | null;
}): PublicCake {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    mainImageUrl: row.main_image_url,
    price: row.price,
    showPrice: row.show_price,
    isFeatured: row.is_featured,
    categoryId: row.category_id,
  };
}

export async function getPublicCakes(options?: { categoryId?: string }): Promise<PublicCake[]> {
  const supabase = await createClient();
  let query = supabase
    .from("cakes")
    .select(CAKE_COLUMNS)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  const { data, error } = await query;
  logError("cakes", error);
  return (data ?? []).map(mapCake);
}

/** Active category by slug, or null (callers turn null into a 404). */
export const getPublicCategoryBySlug = cache(async (slug: string): Promise<PublicCategory | null> => {
  const categories = await getPublicCategories();
  return categories.find((category) => category.slug === slug) ?? null;
});

export const getPublicCakeBySlug = cache(async (slug: string): Promise<PublicCakeDetail | null> => {
  const supabase = await createClient();
  const { data: cake, error } = await supabase
    .from("cakes")
    .select(CAKE_COLUMNS)
    .eq("is_active", true)
    .eq("slug", slug)
    .maybeSingle();
  logError("cake by slug", error);
  if (!cake) return null;

  const { data: images, error: imagesError } = await supabase
    .from("cake_images")
    .select("image_url")
    .eq("cake_id", cake.id)
    .order("sort_order", { ascending: true });
  logError("cake_images", imagesError);

  return { ...mapCake(cake), images: (images ?? []).map((image) => image.image_url) };
});

/** First active, featured cake that has a main image — feeds the hero visual. */
async function getHeroCake(supabase: Supabase): Promise<PublicCake | null> {
  const { data, error } = await supabase
    .from("cakes")
    .select(CAKE_COLUMNS)
    .eq("is_active", true)
    .eq("is_featured", true)
    .not("main_image_url", "is", null)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  logError("hero cake", error);
  return data ? mapCake(data) : null;
}

async function getGalleryItems(
  supabase: Supabase,
  categoryNames: Map<string, string>,
): Promise<PublicGalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, title, description, image_url, category_id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logError("gallery_items", error);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    imageUrl: row.image_url,
    categoryName: row.category_id ? (categoryNames.get(row.category_id) ?? null) : null,
  }));
}

async function getReviews(
  supabase: Supabase,
  categoryNames: Map<string, string>,
): Promise<PublicReview[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, customer_name, content, rating, photo_url, category_id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  logError("reviews", error);

  return (data ?? []).map((row) => ({
    id: row.id,
    customerName: row.customer_name,
    content: row.content,
    rating: row.rating,
    photoUrl: isOwnMediaUrl(row.photo_url) ? row.photo_url : null,
    categoryName: row.category_id ? (categoryNames.get(row.category_id) ?? null) : null,
  }));
}

export async function getPublicGalleryItems(): Promise<PublicGalleryItem[]> {
  const supabase = await createClient();
  const categories = await getPublicCategories(supabase);
  return getGalleryItems(supabase, new Map(categories.map((category) => [category.id, category.name])));
}

export async function getHomePageData(): Promise<HomePageData> {
  const supabase = await createClient();

  const [site, allCategories, heroCake] = await Promise.all([
    getSiteSettings(supabase),
    getPublicCategories(supabase),
    getHeroCake(supabase),
  ]);

  const categoryNames = new Map(allCategories.map((category) => [category.id, category.name]));

  const [galleryItems, reviews] = await Promise.all([
    getGalleryItems(supabase, categoryNames),
    getReviews(supabase, categoryNames),
  ]);

  return {
    site,
    categories: allCategories.filter((category) => category.showOnHome),
    heroCake,
    galleryItems,
    reviews,
  };
}
