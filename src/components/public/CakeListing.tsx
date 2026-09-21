import Link from "next/link";
import type { PublicCake, PublicCategory } from "@/lib/public-queries";
import { CakeCard } from "./CakeCard";

/** Category pills + cake grid, shared by /pastalar and /pastalar/[category]. */
export function CakeListing({
  cakes,
  categories,
  activeSlug,
  emptyMessage,
}: {
  cakes: PublicCake[];
  categories: PublicCategory[];
  activeSlug: string | null;
  emptyMessage: string;
}) {
  const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

  const pillClass = (active: boolean) =>
    `px-4 py-2 rounded-full border-2 text-xs sm:text-sm font-semibold text-chocolate transition-all ${
      active
        ? "border-powder-pink bg-powder-pink/20"
        : "border-chocolate/10 hover:border-powder-pink"
    }`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {categories.length > 0 && (
        <nav aria-label="Kategoriler" className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link href="/pastalar" className={pillClass(activeSlug === null)}>
            Tümü
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/pastalar/${category.slug}`}
              className={pillClass(activeSlug === category.slug)}
            >
              {category.emoji ? `${category.emoji} ` : ""}
              {category.name}
            </Link>
          ))}
        </nav>
      )}

      {cakes.length === 0 ? (
        <p className="text-center text-sm text-chocolate/60">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cakes.map((cake) => (
            <CakeCard
              key={cake.id}
              cake={cake}
              categoryName={cake.categoryId ? (categoryNames.get(cake.categoryId) ?? null) : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
