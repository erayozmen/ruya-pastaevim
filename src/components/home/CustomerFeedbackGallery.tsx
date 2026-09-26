"use client";

import { useState } from "react";
import Image from "next/image";

const INITIAL_VISIBLE_COUNT = 10;

/**
 * Real Instagram/WhatsApp customer feedback screenshots, shown purely as a
 * visual grid — no name/text/rating, that's what the ReviewsSection above
 * already covers. Deliberately client-side "show more": all images are
 * already in the page's data, so expanding the grid is instant with no
 * page reload or extra network request.
 */
export function CustomerFeedbackGallery({ images }: { images: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (images.length === 0) return null;

  const visibleImages = expanded ? images : images.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = images.length > INITIAL_VISIBLE_COUNT;

  return (
    <div className="mt-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="font-script text-xl sm:text-2xl text-peach font-semibold">Gerçek Anlar</span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate tracking-tight mt-1">
          Müşteri Geri Bildirimleri
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {visibleImages.map((url, index) => (
          <div
            key={url}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-powder-pink/20 border border-powder-pink/40 shadow-sm"
          >
            <Image
              src={url}
              alt="Gerçek müşteri geri bildirimi"
              fill
              sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
              className="object-contain"
              loading={index < INITIAL_VISIBLE_COUNT ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-powder-pink/50 text-chocolate font-semibold text-sm hover:shadow-md hover:border-peach transition-all"
          >
            <span>{expanded ? "Daha Az Göster" : "Daha Fazla Göster"}</span>
            <i className={`fa-solid ${expanded ? "fa-chevron-up" : "fa-chevron-down"} text-xs`}></i>
          </button>
        </div>
      )}
    </div>
  );
}
