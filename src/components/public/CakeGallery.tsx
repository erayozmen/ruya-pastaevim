"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageWithFallback } from "@/components/ui/ImageWithFallback";

/**
 * Main image plus thumbnails. `images` is already ordered: the cake's
 * `main_image_url` first (when present), then `cake_images` in `sort_order`.
 */
export function CakeGallery({ images, name }: { images: string[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-vanilla">
        {active ? (
          <ImageWithFallback
            src={active}
            alt={name}
            fill
            priority
            sizes="(min-width: 640px) 512px, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-powder-pink/60 via-vanilla to-lavender/50 flex items-center justify-center text-7xl text-gold/70">
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
          {images.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`${name} görsel ${index + 1}`}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                index === activeIndex
                  ? "border-chocolate"
                  : "border-transparent hover:border-powder-pink"
              }`}
            >
              <Image src={url} alt="" fill sizes="(min-width: 640px) 100px, 20vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
