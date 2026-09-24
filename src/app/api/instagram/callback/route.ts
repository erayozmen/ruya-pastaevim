import { NextResponse, type NextRequest } from "next/server";
import { isRequestFromAdmin } from "@/lib/admin-guard";
import { saveInstagramToken } from "@/lib/instagram-token-repo";
import { INSTAGRAM_STATE_COOKIE, getInstagramRedirectUri } from "@/lib/instagram-oauth";
import { SITE_URL } from "@/lib/site-url";

interface ShortLivedTokenResponse {
  access_token?: string;
  error_message?: string;
}

interface LongLivedTokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

function errorRedirect(reason: string) {
  console.error(`[instagram-oauth] callback failed: ${reason}`);
  return NextResponse.redirect(`${SITE_URL}/admin/settings?instagram=error`);
}

/**
 * Instagram Business Login callback. Exchanges the authorization code for a
 * short-lived token, then that for a 60-day long-lived one (Meta docs:
 * api.instagram.com/oauth/access_token, then graph.instagram.com/access_token
 * with grant_type=ig_exchange_token). The token itself is never returned to
 * the browser, never logged, and is persisted only via `instagram-token-repo.ts`,
 * which writes it through a service-role-only Supabase client (see there).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const metaError = searchParams.get("error");
  if (metaError) {
    return errorRedirect(`Meta returned error=${metaError}`);
  }

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const expectedState = request.cookies.get(INSTAGRAM_STATE_COOKIE)?.value;

  // Clear the one-time state cookie regardless of outcome.
  const clearStateCookie = (response: NextResponse) => {
    response.cookies.set(INSTAGRAM_STATE_COOKIE, "", { path: "/api/instagram", maxAge: 0 });
    return response;
  };

  if (!state || !expectedState || state !== expectedState) {
    return clearStateCookie(errorRedirect("state mismatch (possible CSRF)"));
  }
  if (!code) {
    return clearStateCookie(errorRedirect("missing code"));
  }
  if (!(await isRequestFromAdmin())) {
    return clearStateCookie(errorRedirect("caller is not an authenticated admin"));
  }

  const clientId = process.env.INSTAGRAM_APP_ID;
  const clientSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!clientId || !clientSecret) {
    return clearStateCookie(errorRedirect("INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET not configured"));
  }

  try {
    const exchangeBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "authorization_code",
      redirect_uri: getInstagramRedirectUri(),
      code,
    });

    const shortLivedResponse = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      body: exchangeBody,
    });
    const shortLived = (await shortLivedResponse.json()) as ShortLivedTokenResponse;

    if (!shortLivedResponse.ok || !shortLived.access_token) {
      return clearStateCookie(errorRedirect(`short-lived exchange failed (${shortLivedResponse.status})`));
    }

    const longLivedUrl = new URL("https://graph.instagram.com/access_token");
    longLivedUrl.searchParams.set("grant_type", "ig_exchange_token");
    longLivedUrl.searchParams.set("client_secret", clientSecret);
    longLivedUrl.searchParams.set("access_token", shortLived.access_token);

    const longLivedResponse = await fetch(longLivedUrl);
    const longLived = (await longLivedResponse.json()) as LongLivedTokenResponse;

    if (!longLivedResponse.ok || !longLived.access_token || !longLived.expires_in) {
      return clearStateCookie(errorRedirect(`long-lived exchange failed (${longLivedResponse.status})`));
    }

    const expiresAt = new Date(Date.now() + longLived.expires_in * 1000);
    await saveInstagramToken(longLived.access_token, expiresAt);
    console.log(`[instagram-oauth] connected successfully, expires ${expiresAt.toISOString()} (token not logged)`);

    return clearStateCookie(NextResponse.redirect(`${SITE_URL}/admin/settings?instagram=connected`));
  } catch (error) {
    return clearStateCookie(
      errorRedirect(`unexpected error: ${error instanceof Error ? error.message : "unknown"}`),
    );
  }
}
