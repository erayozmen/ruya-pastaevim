import { getInstagramPosts } from "@/lib/instagram";

/**
 * The async leaf of the Instagram section, split out so it can sit behind a
 * <Suspense> boundary in InstagramSection without turning the whole section
 * (or the homepage) into a client component. Same fallback behavior as
 * before: no posts (no token, API failure/timeout) simply renders nothing,
 * leaving the profile link as the only Instagram content.
 */
export async function InstagramPosts({ limit }: { limit: number }) {
  const posts = await getInstagramPosts(limit);
  if (posts.length === 0) return null;

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-8">
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
  );
}
