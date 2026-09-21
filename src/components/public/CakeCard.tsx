import Link from "next/link";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicCake } from "@/lib/public-queries";

const priceFormatter = new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" });

/** Price is public only when the admin ticked "show price" and entered one. */
export function formatCakePrice(cake: Pick<PublicCake, "price" | "showPrice">): string | null {
  return cake.showPrice && cake.price !== null ? priceFormatter.format(cake.price) : null;
}

/** Same card language as the homepage category cards. */
export function CakeCard({
  cake,
  categoryName,
  href,
}: {
  cake: PublicCake;
  categoryName: string | null;
  href: string;
}) {
  const price = formatCakePrice(cake);

  return (
    <Link
      href={href}
      className="group bg-white rounded-3xl overflow-hidden border border-powder-pink/40 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <div className="relative h-64 overflow-hidden bg-vanilla">
        {cake.mainImageUrl ? (
          <ImageWithFallback
            src={cake.mainImageUrl}
            alt={cake.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-powder-pink/40 via-vanilla to-lavender/40 flex items-center justify-center text-5xl text-gold/70">
          </div>
        )}
        {cake.isFeatured && (
          <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-chocolate text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            ✨ Öne Çıkan
          </span>
        )}
      </div>
      <div className="p-6 text-center flex-1 flex flex-col items-center">
        {categoryName && (
          <span className="text-[11px] uppercase tracking-wider font-semibold text-gold mb-1">
            {categoryName}
          </span>
        )}
        <h3 className="font-serif text-2xl font-bold text-chocolate group-hover:text-peach transition-colors">
          {cake.name}
        </h3>
        {cake.description && (
          <p className="text-chocolate/70 text-xs sm:text-sm mt-2 line-clamp-2">{cake.description}</p>
        )}
        {price && <p className="mt-3 font-semibold text-chocolate">{price}</p>}
      </div>
    </Link>
  );
}
