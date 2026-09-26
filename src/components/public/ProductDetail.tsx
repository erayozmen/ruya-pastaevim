import Link from "next/link";
import { notFound } from "next/navigation";
import { CakeGallery } from "@/components/public/CakeGallery";
import { formatCakePrice } from "@/components/public/CakeCard";
import {
  getPublicCakeBySlug,
  getPublicCategories,
  getSiteSettings,
  type ProductGroup,
} from "@/lib/public-queries";
import { buildWhatsappHref } from "@/lib/whatsapp";

const LISTING: Record<ProductGroup, { path: string; label: string }> = {
  cake: { path: "/pastalar", label: "Pastalar" },
  pastry: { path: "/borek-hamur-isleri", label: "Özel Günler İçin Hamur İşleri" },
};

export async function ProductDetail({ slug, group }: { slug: string; group: ProductGroup }) {
  const product = await getPublicCakeBySlug(slug);
  if (!product || product.group !== group) notFound();

  const listing = LISTING[group];
  const [categories, site] = await Promise.all([getPublicCategories(), getSiteSettings()]);
  const category = categories.find((item) => item.id === product.categoryId) ?? null;
  const price = formatCakePrice(product);

  // Main image first, then the extra gallery in cake_images.sort_order (no duplicates).
  const images = [product.mainImageUrl, ...product.images].filter(
    (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index,
  );

  const whatsappHref = buildWhatsappHref(
    `Merhaba, sitenizdeki '${product.name}' hakkında bilgi almak istiyorum.`,
    site.whatsappNumber,
  );

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Konum" className="mb-8 text-xs sm:text-sm text-chocolate/60 flex flex-wrap gap-2">
          <Link href={listing.path} className="hover:text-gold transition-colors">
            {listing.label}
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`${listing.path}/${category.slug}`} className="hover:text-gold transition-colors">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:mx-0">
            <CakeGallery images={images} name={product.name} />
          </div>

          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {category && (
              <span className="font-script text-2xl text-gold font-semibold block">{category.name}</span>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-chocolate tracking-tight leading-tight">
              {product.name}
            </h1>

            {price && <p className="text-2xl font-semibold text-chocolate">{price}</p>}

            {product.description && (
              <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i>
                <span>WhatsApp&apos;tan Sor</span>
              </a>
              {group === "cake" && (
                <Link
                  href="/#tasarla"
                  className="w-full sm:w-auto text-center px-7 py-4 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink shadow-sm hover:shadow-md transition-all duration-300"
                >
                  Pastanı Tasarla
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
