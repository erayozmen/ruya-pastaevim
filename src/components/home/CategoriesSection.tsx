"use client";

import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { useCustomizer } from "@/context/customizer-context";
import { categoryCards } from "@/lib/categories-data";

export function CategoriesSection() {
  const { setTheme } = useCustomizer();

  return (
    <section id="kategoriler" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">
            Özel Anlarınız İçin
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate tracking-tight mt-1">
            Pasta Koleksiyonları
          </h2>
          <p className="text-chocolate/70 text-sm sm:text-base mt-3">
            Sizin için sevgiyle tasarladığımız popüler kategoriler. Her bir pasta dilediğiniz
            renk ve lezzet seçenekleriyle kişiselleştirilebilir.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryCards.map((category) => (
            <div
              key={category.slug}
              className="group bg-white rounded-3xl overflow-hidden border border-powder-pink/40 shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-64 overflow-hidden bg-vanilla">
                <ImageWithFallback
                  src={category.image}
                  alt={category.title}
                  fallbackSrc={`https://placehold.co/600x600/F6C7C9/49352F?text=${encodeURIComponent(
                    category.title,
                  )}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-chocolate text-xl p-2 rounded-2xl shadow-sm">
                  {category.emoji}
                </span>
                {category.hoverText && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-white text-xs font-medium">{category.hoverText}</span>
                  </div>
                )}
              </div>
              <div className="p-6 text-center">
                <h3
                  className={`font-serif text-2xl font-bold text-chocolate transition-colors ${category.titleHoverClass}`}
                >
                  {category.title}
                </h3>
                <p className="text-chocolate/70 text-xs sm:text-sm mt-2 line-clamp-2">
                  {category.description}
                </p>
                <a
                  href="#tasarla"
                  onClick={() => setTheme(category.themeValue)}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-chocolate uppercase tracking-wider transition-colors"
                >
                  <span>Bu Temayı Tasarla</span>
                  <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
