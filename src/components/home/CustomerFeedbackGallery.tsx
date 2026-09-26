"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const INITIAL_VISIBLE_COUNT = 10;

/**
 * Real Instagram/WhatsApp customer feedback screenshots, shown purely as a
 * visual grid — no name/text/rating. This is the homepage's sole social
 * proof section (the written testimonial cards were removed). Deliberately
 * client-side "show more": all images are already in the page's data, so
 * expanding the grid is instant with no page reload or extra network
 * request.
 *
 * Thumbnails open a lightweight, dependency-free lightbox on click (full
 * screenshot, object-contain so nothing is cropped) — independent of the
 * 10→19 "show more" state, so expanding the grid never affects the modal.
 */
export function CustomerFeedbackGallery({ images }: { images: string[] }) {
  const [expanded, setExpanded] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!activeUrl) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveUrl(null);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeUrl]);

  if (images.length === 0) return null;

  const visibleImages = expanded ? images : images.slice(0, INITIAL_VISIBLE_COUNT);
  const hasMore = images.length > INITIAL_VISIBLE_COUNT;

  return (
    <section id="yorumlar" className="py-20 bg-soft-cream border-t border-powder-pink/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-script text-xl sm:text-2xl text-peach font-semibold">Gerçek Anlar</span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-chocolate tracking-tight mt-1">
            Müşteri Geri Bildirimleri
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {visibleImages.map((url, index) => (
            <button
              key={url}
              type="button"
              onClick={() => setActiveUrl(url)}
              aria-label="Geri bildirimi büyüt"
              className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-powder-pink/20 border border-powder-pink/40 shadow-sm cursor-zoom-in transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-peach focus:ring-offset-2"
            >
              <Image
                src={url}
                alt="Gerçek müşteri geri bildirimi"
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain"
                loading={index < INITIAL_VISIBLE_COUNT ? "eager" : "lazy"}
              />
            </button>
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

      {activeUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-chocolate/90 backdrop-blur-sm p-4 sm:p-8"
          onClick={() => setActiveUrl(null)}
        >
          <button
            type="button"
            onClick={() => setActiveUrl(null)}
            aria-label="Kapat"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xl transition-colors z-10"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          <div className="relative w-full h-full max-w-3xl max-h-[85vh]" onClick={(event) => event.stopPropagation()}>
            <Image
              src={activeUrl}
              alt="Gerçek müşteri geri bildirimi - büyük görünüm"
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
