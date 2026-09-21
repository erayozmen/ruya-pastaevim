import { getInstagramPosts } from "@/lib/instagram";
import type { SiteSettings } from "@/lib/site-data";

/**
 * Shows the account's real latest posts when the Instagram API token is
 * configured; otherwise only a link to the real profile. No stock images,
 * no invented posts, likes, dates or captions.
 */
export async function InstagramSection({ site }: { site: SiteSettings }) {
  const posts = await getInstagramPosts(6);

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

        {posts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {posts.map((post) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="group block aspect-square overflow-hidden rounded-2xl bg-powder-pink/20 border border-powder-pink/40"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.alt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </a>
            ))}
          </div>
        )}

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
