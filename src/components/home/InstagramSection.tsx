import { Suspense } from "react";
import { InstagramPosts } from "./InstagramPosts";
import { InstagramSkeleton } from "./InstagramSkeleton";
import type { SiteSettings } from "@/lib/site-data";

/**
 * Shows the account's real latest posts when the Instagram API token is
 * configured; otherwise only a link to the real profile. No stock images,
 * no invented posts, likes, dates or captions.
 *
 * The actual Graph API fetch lives in InstagramPosts, behind a Suspense
 * boundary: this section itself no longer awaits anything, so a slow or
 * failing Instagram call can't hold up the rest of the homepage's HTML —
 * the skeleton streams in immediately and is swapped for the real grid (or
 * nothing, on failure) once it resolves.
 */
export function InstagramSection({ site }: { site: SiteSettings }) {
  return (
    <section className="py-16 bg-vanilla">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="font-script text-2xl sm:text-3xl text-gold font-semibold">Instagram</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-chocolate mb-2">
          Bizi Instagram&apos;da Takip Edin
        </h2>
        <p className="text-chocolate/70 text-sm mb-8">
          Güncel çalışmalarımızı Instagram sayfamızda paylaşıyoruz.
        </p>

        <Suspense fallback={<InstagramSkeleton />}>
          <InstagramPosts limit={12} />
        </Suspense>

        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-chocolate hover:text-gold font-semibold text-sm transition-colors"
        >
          <i className="fa-brands fa-instagram text-lg"></i>
          <span>{site.instagramHandle} - Instagram&apos;da Daha Fazlasını Gör</span>
          <i className="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </section>
  );
}
