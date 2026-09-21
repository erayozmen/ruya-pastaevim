import "server-only";

const API_VERSION = "v25.0";

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  alt: string;
}

interface GraphMedia {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
}

/**
 * Latest posts of the business account via the official Instagram API
 * (Instagram Login, `graph.instagram.com/v25.0/me/media`; needs the
 * instagram_business_basic permission on a professional account). Needs a long-lived
 * token (60-day validity, refreshable via /refresh_access_token after 24h)
 * in the server-only env var INSTAGRAM_ACCESS_TOKEN (never
 * NEXT_PUBLIC_, never committed). Without a token — or on any API error —
 * this returns [] and the section shows the profile link instead. Nothing
 * is ever fabricated.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const url = new URL(`https://graph.instagram.com/${API_VERSION}/me/media`);
    url.searchParams.set("fields", "id,caption,media_type,media_url,thumbnail_url,permalink");
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("access_token", token);

    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error(`[instagram] API responded ${response.status}`);
      return [];
    }
    const body = (await response.json()) as { data?: GraphMedia[] };

    return (body.data ?? []).flatMap((media) => {
      const imageUrl = media.media_type === "VIDEO" ? media.thumbnail_url : media.media_url;
      if (!imageUrl) return [];
      return [
        {
          id: media.id,
          imageUrl,
          permalink: media.permalink,
          alt: media.caption?.slice(0, 120) || "Instagram paylaşımı",
        },
      ];
    });
  } catch (error) {
    console.error("[instagram] fetch failed", error instanceof Error ? error.message : error);
    return [];
  }
}
