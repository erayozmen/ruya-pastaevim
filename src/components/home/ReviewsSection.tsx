import { ImageWithFallback } from "@/components/ui/ImageWithFallback";
import { reviews } from "@/lib/reviews-data";

export function ReviewsSection() {
  return (
    <section id="yorumlar" className="py-20 bg-soft-cream border-t border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-script text-2xl sm:text-3xl text-peach font-semibold">
            Gülümseten Hatıralar
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-chocolate tracking-tight mt-1">
            Kutlamalardan Yansıyan Mutluluk
          </h2>
          <p className="text-chocolate/70 text-sm sm:text-base mt-2">
            En güzel günlerinizin bir parçası olmak bizim için en büyük ödül.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-white rounded-3xl p-6 shadow-sm border border-powder-pink/40 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex text-gold text-sm mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <i key={i} className="fa-solid fa-star"></i>
                  ))}
                </div>
                <p className="text-chocolate/85 text-sm leading-relaxed italic mb-6">
                  &quot;{review.quote}&quot;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-chocolate/10">
                <ImageWithFallback
                  src={review.avatar}
                  alt={`Müşteri ${review.name}`}
                  fallbackSrc="https://placehold.co/100x100/F6C7C9/49352F?text=%3A%29"
                  className={`w-11 h-11 rounded-full object-cover border-2 ${review.avatarBorderClass}`}
                />
                <div>
                  <h5 className="font-bold text-sm text-chocolate">{review.name}</h5>
                  <span className="text-xs text-chocolate/60">{review.meta}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
