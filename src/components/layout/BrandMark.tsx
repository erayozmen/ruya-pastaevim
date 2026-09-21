import { BRAND_LOGO_SRC } from "@/lib/brand";

/** Logo image when a logo asset is configured, otherwise the brand name as text. */
export function BrandMark({
  name,
  variant,
  className = "",
}: {
  name: string;
  variant: "header" | "footer";
  className?: string;
}) {
  if (BRAND_LOGO_SRC) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={BRAND_LOGO_SRC}
        alt={name}
        className={`${variant === "header" ? "h-11 sm:h-12" : "h-10"} w-auto ${className}`}
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
