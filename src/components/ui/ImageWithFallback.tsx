"use client";

import type { ImgHTMLAttributes } from "react";

interface ImageWithFallbackProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc: string;
}

/**
 * Orijinal HTML'deki `<img onerror="this.src='...'">` davranışının
 * React karşılığı. Demo Unsplash görseli yüklenemezse placehold.co
 * görseline düşer.
 */
export function ImageWithFallback({ src, alt, fallbackSrc, ...rest }: ImageWithFallbackProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = fallbackSrc;
      }}
      {...rest}
    />
  );
}
