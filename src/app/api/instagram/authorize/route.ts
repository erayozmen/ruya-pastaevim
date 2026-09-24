import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { isRequestFromAdmin } from "@/lib/admin-guard";
import {
  INSTAGRAM_OAUTH_SCOPE,
  INSTAGRAM_STATE_COOKIE,
  INSTAGRAM_STATE_COOKIE_MAX_AGE_SECONDS,
  getInstagramRedirectUri,
} from "@/lib/instagram-oauth";
import { SITE_URL } from "@/lib/site-url";

/**
 * Starts the Instagram Business Login flow. Only a signed-in admin may
 * trigger this — anonymous visitors are redirected to /admin/login instead
 * of silently kicking off an OAuth flow with our app's identity.
 */
export async function GET() {
  if (!(await isRequestFromAdmin())) {
    return NextResponse.redirect(`${SITE_URL}/admin/login`);
  }

  const clientId = process.env.INSTAGRAM_APP_ID;
  if (!clientId) {
    console.error("[instagram-oauth] INSTAGRAM_APP_ID is not configured");
    return NextResponse.redirect(`${SITE_URL}/admin/settings?instagram=error`);
  }

  const state = randomBytes(32).toString("hex");

  const authorizeUrl = new URL("https://www.instagram.com/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", getInstagramRedirectUri());
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", INSTAGRAM_OAUTH_SCOPE);
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  response.cookies.set(INSTAGRAM_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: INSTAGRAM_STATE_COOKIE_MAX_AGE_SECONDS,
    path: "/api/instagram",
  });
  return response;
}
