/**
 * Suspense fallback for InstagramPosts. Mirrors the real grid's layout
 * exactly (same columns, same aspect-square cells, same gap/margin) so the
 * section doesn't shift height once the real posts stream in.
 */
export function InstagramSkeleton() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className="aspect-square rounded-2xl bg-powder-pink/20 border border-powder-pink/40 animate-pulse"
        />
      ))}
    </div>
  );
}
