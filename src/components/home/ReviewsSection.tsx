import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import type { PublicReview } from "@/lib/public-queries";
import { accentFor } from "@/lib/site-data";

export function ReviewsSection({ reviews }: { reviews: PublicReview[] }) {
  return (
    <section id="yorumlar" className="py-20 bg-soft-cream border-t border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-script text-2xl sm:text-3xl text-peach font-semibold">
            Gülümseten Hatıralar
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate tracking-tight mt-1">
            Müşterilerimizin Yorumları
          </h2>
          <p className="text-chocolate/70 text-sm sm:text-base mt-2">
            En güzel günlerinizin bir parçası olmak bizim için en büyük ödül.
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-center text-sm text-chocolate/60">
            Henüz yayınlanmış müşteri yorumu bulunmuyor.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => {
              const accent = accentFor(index);
              return (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl p-6 shadow-sm border border-powder-pink/40 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex text-gold text-sm mb-3">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <p className="text-chocolate/85 text-sm leading-relaxed italic mb-6">
                      &quot;{review.content}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-4 border-t border-chocolate/10">
                    {review.photoUrl ? (
                      <ImageWithFallback
                        src={review.photoUrl}
                        alt={`Müşteri ${review.customerName}`}
                        className={`w-11 h-11 rounded-full object-cover border-2 ${accent.border}`}
                      />
                    ) : (
                      <span
                        className={`w-11 h-11 rounded-full bg-powder-pink/40 text-chocolate font-bold flex items-center justify-center border-2 ${accent.border}`}
                      >
                        {review.customerName.trim().charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <h5 className="font-bold text-sm text-chocolate">{review.customerName}</h5>
                      {review.categoryName && (
                        <span className="text-xs text-chocolate/60">{review.categoryName}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
