import "server-only";
import { getInstagramToken, saveInstagramToken } from "@/lib/instagram-token-repo";

const API_BASE = "https://graph.instagram.com/v25.0";
const CACHE_SECONDS = 3600;
/** Meta's API has no SLA on response time; without this, a slow/hanging
 * response would block the whole homepage render for however long the
 * function is allowed to run. 5s is generous for a healthy API call but
 * still short enough that a real outage degrades to the "no token" fallback
 * (profile link only) instead of stalling the page. */
const GRAPH_API_TIMEOUT_MS = 5000;

/** Meta requires the token to be at least 24h old to refresh; ours will
 * always be older than that by the time it's within this margin of its
 * 60-day expiry, so no separate "issued at" tracking is needed. */
const REFRESH_MARGIN_MS = 7 * 24 * 60 * 60 * 1000;

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

  const response = await fetch(url, {
    next: { revalidate: CACHE_SECONDS },
    signal: AbortSignal.timeout(GRAPH_API_TIMEOUT_MS),
  });
  if (!response.ok) {
    console.error(`[instagram] ${path} responded ${response.status}`);
    return null;
  }
  return (await response.json()) as T;
}

/**
 * Refreshes a long-lived token that's close to expiring (Meta docs:
 * GET graph.instagram.com/refresh_access_token, grant_type=ig_refresh_token).
 * On success, persists the new token/expiry via the repo and returns it.
 * On any failure, returns the original token unchanged — the caller keeps
 * working with the still-valid (if aging) token instead of breaking.
 */
async function refreshIfNeeded(accessToken: string, expiresAt: Date): Promise<string> {
  if (expiresAt.getTime() - Date.now() > REFRESH_MARGIN_MS) return accessToken;

  try {
    const url = new URL("https://graph.instagram.com/refresh_access_token");
    url.searchParams.set("grant_type", "ig_refresh_token");
    url.searchParams.set("access_token", accessToken);

    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(GRAPH_API_TIMEOUT_MS) });
    const body = (await response.json()) as { access_token?: string; expires_in?: number };

    if (!response.ok || !body.access_token || !body.expires_in) {
      console.error(`[instagram] token refresh failed (${response.status})`);
      return accessToken;
    }

    const newExpiresAt = new Date(Date.now() + body.expires_in * 1000);
    await saveInstagramToken(body.access_token, newExpiresAt);
    return body.access_token;
  } catch (error) {
    console.error("[instagram] token refresh error", error instanceof Error ? error.message : error);
    return accessToken;
  }
}

/**
 * Latest posts of the business account via the official Instagram API with
 * Instagram Login (Meta docs: graph.instagram.com/v25.0). Flow per the docs:
 * GET /me?fields=user_id gives the professional account id, then
 * GET /{IG_ID}/media lists its media. Responses are cached for an hour.
 * Without a token, or on any API error, this returns [] and the section
 * shows the profile link instead. `media_url` is omitted by Meta for
 * copyrighted media and `thumbnail_url` only exists for videos; posts
 * without a usable image are skipped.
 *
 * Token source: the long-lived token saved by the OAuth connect flow
 * (`instagram-token-repo.ts`, service-role-only table), refreshed
 * automatically when it's within a week of its 60-day expiry. Falls back
 * to the manually configured `INSTAGRAM_ACCESS_TOKEN` env var if no
 * account has been connected via OAuth yet.
 */
export async function getInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const stored = await getInstagramToken();
  const token = stored ? await refreshIfNeeded(stored.accessToken, stored.expiresAt) : process.env.INSTAGRAM_ACCESS_TOKEN;
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
