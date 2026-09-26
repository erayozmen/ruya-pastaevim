import Link from "next/link";
import { CakeCard } from "@/components/public/CakeCard";
import type { PublicCake, PublicCategory } from "@/lib/public-queries";

export function PastrySection({
  products,
  categories,
}: {
  products: PublicCake[];
  categories: PublicCategory[];
}) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  return (
    <section id="borek-hamur-isleri" className="py-24 bg-soft-cream border-y border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">
            El Açması Lezzetler
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate tracking-tight mt-1">
            Özel Günler İçin Hamur İşleri
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-sm text-chocolate/60">Henüz yayınlanmış ürün bulunmuyor.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <CakeCard
                  key={product.id}
                  cake={product}
                  href={`/urun/${product.slug}`}
                  categoryName={product.categoryId ? (categoryNames.get(product.categoryId) ?? null) : null}
                />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/borek-hamur-isleri"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-chocolate uppercase tracking-wider transition-colors"
              >
                <span>Tümünü Gör</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
