import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CakeGallery } from "@/components/public/CakeGallery";
import { formatCakePrice } from "@/components/public/CakeCard";
import {
  getPublicCakeBySlug,
  getPublicCategories,
  getSiteSettings,
} from "@/lib/public-queries";
import { buildWhatsappHref } from "@/lib/whatsapp";

export async function generateMetadata({ params }: PageProps<"/pasta/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cake = await getPublicCakeBySlug(slug);
  if (!cake) return { title: "Pasta bulunamadı" };
  return { title: cake.name, description: cake.description ?? undefined };
}

export default async function CakeDetailPage({ params }: PageProps<"/pasta/[slug]">) {
  const { slug } = await params;
  const cake = await getPublicCakeBySlug(slug);
  if (!cake) notFound();

  const [categories, site] = await Promise.all([getPublicCategories(), getSiteSettings()]);
  const category = categories.find((item) => item.id === cake.categoryId) ?? null;
  const price = formatCakePrice(cake);

  // Main image first, then the extra gallery in cake_images.sort_order (no duplicates).
  const images = [cake.mainImageUrl, ...cake.images].filter(
    (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index,
  );

  const whatsappHref = buildWhatsappHref(
    `Merhaba, sitenizdeki '${cake.name}' hakkında bilgi almak istiyorum.`,
    site.whatsappNumber,
  );

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Konum" className="mb-8 text-xs sm:text-sm text-chocolate/60 flex flex-wrap gap-2">
          <Link href="/pastalar" className="hover:text-gold transition-colors">
            Pastalar
          </Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/pastalar/${category.slug}`} className="hover:text-gold transition-colors">
                {category.name}
              </Link>
            </>
          )}
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:mx-0">
            <CakeGallery images={images} name={cake.name} />
          </div>

          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {category && (
              <span className="font-script text-2xl text-gold font-semibold block">
                {category.name}
              </span>
            )}
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-chocolate tracking-tight leading-tight">
              {cake.name}
            </h1>

            {price && <p className="text-2xl font-semibold text-chocolate">{price}</p>}

            {cake.description && (
              <p className="text-chocolate/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {cake.description}
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
                <span>Bu Pastayı WhatsApp&apos;tan Sor</span>
              </a>
              <Link
                href="/#tasarla"
                className="w-full sm:w-auto text-center px-7 py-4 rounded-full bg-powder-pink/70 hover:bg-powder-pink text-chocolate font-semibold text-sm border border-powder-pink shadow-sm hover:shadow-md transition-all duration-300"
              >
                Pastanı Tasarla
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
