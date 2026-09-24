import "server-only";
import { SITE_URL } from "@/lib/site-url";

/**
 * Shared constants/helpers for the Instagram Business Login OAuth flow
 * (Meta docs: "Instagram API with Instagram Login" → Business Login).
 * Kept separate from the two route handlers so authorize/callback agree
 * on the exact same redirect_uri, scope, and CSRF cookie name.
 */

export const INSTAGRAM_OAUTH_SCOPE = "instagram_business_basic";

export const INSTAGRAM_STATE_COOKIE = "ig_oauth_state";
/** Short-lived: only needs to survive the redirect to Meta and back. */
export const INSTAGRAM_STATE_COOKIE_MAX_AGE_SECONDS = 10 * 60;

/** Derived from SITE_URL (never hard-coded) so it always matches the app's own domain. */
export function getInstagramRedirectUri(): string {
  return `${SITE_URL}/api/instagram/callback`;
}
