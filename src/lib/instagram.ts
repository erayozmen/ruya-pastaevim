import "server-only";
import { getRuntimeInstagramToken } from "@/lib/instagram-token-store";

const API_BASE = "https://graph.instagram.com/v25.0";
const CACHE_SECONDS = 3600;

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  alt: string;
}

interface GraphMedia {
  id: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
}

async function graphGet<T>(path: string, params: Record<string, string>, token: string): Promise<T | null> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set("access_token", token);

  const response = await fetch(url, { next: { revalidate: CACHE_SECONDS } });
  if (!response.ok) {
    console.error(`[instagram] ${path} responded ${response.status}`);
    return null;
  }
  return (await response.json()) as T;
}

/**
 * Latest posts of the business account via the official Instagram API with
 * Instagram Login (Meta docs: graph.instagram.com/v25.0). Flow per the docs:
 * GET /me?fields=user_id gives the professional account id, then
 * GET /{IG_ID}/media lists its media. The token is a long-lived Instagram
 * User access token (60 days, refreshable after 24h via /refresh_access_token)
 * kept in the server-only env var INSTAGRAM_ACCESS_TOKEN — never NEXT_PUBLIC_,
 * never committed. Responses are cached for an hour. Without a token, or on
 * any API error, this returns [] and the section shows the profile link.
 * `media_url` is omitted by Meta for copyrighted media and `thumbnail_url`
 * only exists for videos; posts without a usable image are skipped.
 *
 * Token lookup order: a token obtained via the admin's OAuth connect flow
 * this session (see `instagram-token-store.ts` — process-local, not
 * durable) takes priority, falling back to the manually configured
 * `INSTAGRAM_ACCESS_TOKEN` environment variable.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const token = getRuntimeInstagramToken() ?? process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const me = await graphGet<{ user_id?: string; id?: string }>("/me", { fields: "user_id" }, token);
    const igId = me?.user_id ?? me?.id;
    if (!igId) return [];

    const body = await graphGet<{ data?: GraphMedia[] }>(
      `/${igId}/media`,
      { fields: "id,media_type,media_url,thumbnail_url,permalink", limit: String(limit * 2) },
      token,
    );

    return (body?.data ?? [])
      .flatMap((media) => {
        const imageUrl = media.media_type === "VIDEO" ? media.thumbnail_url : media.media_url;
        if (!imageUrl || !media.permalink) return [];
        return [
          {
            id: media.id,
            imageUrl,
            permalink: media.permalink,
            alt: "Rüya Pasta Evim Instagram paylaşımı",
          },
        ];
      })
      .slice(0, limit);
  } catch (error) {
    console.error("[instagram] fetch failed", error instanceof Error ? error.message : error);
    return [];
  }
}
