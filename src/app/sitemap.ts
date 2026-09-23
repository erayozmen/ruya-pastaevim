import type { MetadataRoute } from "next";
import { getPublicCakes, getPublicCategories } from "@/lib/public-queries";
import { SITE_URL } from "@/lib/site-url";

const STATIC_PATHS = [
  "/",
  "/pastalar",
  "/galeri",
  "/hakkimizda",
  "/nasil-siparis-verilir",
  "/iletisim",
  "/borek-hamur-isleri",
  "/gizlilik-politikasi",
  "/kullanim-sartlari",
  "/veri-silme-talebi",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cakeCategories, pastryCategories, cakes, pastryProducts] = await Promise.all([
    getPublicCategories(undefined, "cake"),
    getPublicCategories(undefined, "pastry"),
    getPublicCakes({ group: "cake" }),
    getPublicCakes({ group: "pastry" }),
  ]);

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
  }));

  for (const category of cakeCategories) {
    entries.push({ url: `${SITE_URL}/pastalar/${category.slug}` });
  }
  for (const category of pastryCategories) {
    entries.push({ url: `${SITE_URL}/borek-hamur-isleri/${category.slug}` });
  }
  for (const cake of cakes) {
    entries.push({ url: `${SITE_URL}/pasta/${cake.slug}` });
  }
  for (const product of pastryProducts) {
    entries.push({ url: `${SITE_URL}/urun/${product.slug}` });
  }

  return entries;
}
