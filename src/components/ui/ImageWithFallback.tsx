"use client";

import type { ImgHTMLAttributes } from "react";

/**
 * Real images only: if a file fails to load the <img> is hidden so the
 * card background shows, instead of swapping in a placeholder image.
 */
export function ImageWithFallback({ src, alt, ...rest }: ImgHTMLAttributes<HTMLImageElement> & { src: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={(e) => {
        e.currentTarget.onerror = null;
        e.currentTarget.style.visibility = "hidden";
      }}
      {...rest}
    />
  );
}
