"use client";

import Image, { type ImageProps } from "next/image";

/**
 * Thin next/image wrapper: real images only. If a file fails to load, the
 * <Image> is hidden (visibility, not unmounted) so the layout space and
 * the parent's own background/gradient show through instead of a broken
 * image icon. Callers use next/image's own API — pass either `fill` (with
 * a `position: relative` parent) or `width`/`height`.
 */
export function ImageWithFallback({ alt, ...rest }: ImageProps) {
  return (
    <Image
      alt={alt}
      {...rest}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}
