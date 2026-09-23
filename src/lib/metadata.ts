import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

const DEFAULT_OG_IMAGE = { url: "/brand/og-image.png", width: 1200, height: 630, alt: siteConfig.brand.name };

/**
 * Next.js does not deep-merge `openGraph` across route segments: once a
 * page defines its own `openGraph`, it fully replaces the root layout's
 * (title/description aside), so every page must repeat the shared fields
 * (siteName/locale/type/images) itself. This keeps that in one place.
 */
export function buildOpenGraph({
  title,
  description,
  path,
  imageUrl,
}: {
  title: string;
  description?: string;
  path: string;
  /** Real content image (product/category); falls back to the brand OG image. */
  imageUrl?: string | null;
}): OpenGraph {
  return {
    title,
    description,
    url: path,
    siteName: siteConfig.brand.name,
    type: "website",
    locale: "tr_TR",
    images: imageUrl ? [{ url: imageUrl }] : [DEFAULT_OG_IMAGE],
  };
}
