import Image from "next/image";
import { BRAND_LOGO_HEIGHT, BRAND_LOGO_SRC, BRAND_LOGO_WIDTH } from "@/lib/brand";

/**
 * Header shows the logo image when a logo asset is configured (it already
 * carries the brand name, baker name and tagline), otherwise the brand name
 * as text. The footer always stays text-only: it sits on a dark background
 * the logo's own light backdrop isn't designed for.
 */
export function BrandMark({
  name,
  variant,
  className = "",
}: {
  name: string;
  variant: "header" | "footer";
  className?: string;
}) {
  if (BRAND_LOGO_SRC && variant === "header") {
    return (
      <Image
        src={BRAND_LOGO_SRC}
        alt={name}
        width={BRAND_LOGO_WIDTH}
        height={BRAND_LOGO_HEIGHT}
        priority
        className={`w-40 sm:w-44 lg:w-52 h-auto object-contain ${className}`}
      />
    );
  }
  return (
    <span
      className={`font-serif font-bold tracking-tight leading-none ${
        variant === "header" ? "text-2xl sm:text-3xl text-chocolate" : "text-2xl text-white tracking-wide"
      } ${className}`}
    >
      {name}
    </span>
  );
}
