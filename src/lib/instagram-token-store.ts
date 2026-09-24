import "server-only";

/**
 * Process-local holder for a freshly OAuth'd Instagram long-lived token.
 *
 * This is NOT durable storage: it lives only in this server process's
 * memory, so it is lost on every redeploy, restart, or serverless cold
 * start, and is not shared across multiple running instances. It exists
 * only so a successful OAuth callback can make the token usable
 * immediately, without ever writing it to a log, a response body, or an
 * unencrypted database column.
 *
 * For real production durability, replace this with either:
 *   - the hosting platform's environment variable API (e.g. Vercel's
 *     REST API) called server-side to persist `INSTAGRAM_ACCESS_TOKEN`
 *     directly, or
 *   - a Supabase table restricted to the service role only (RLS denies
 *     both `anon` and `authenticated`) with the token encrypted at rest
 *     (e.g. via Supabase Vault / pgsodium), decrypted only inside a
 *     SECURITY DEFINER function the server calls with the service key.
 * Neither exists in this project yet, so this sprint deliberately does
 * not invent one — see the OAuth sprint report for the recommendation.
 */
let runtimeAccessToken: string | null = null;

export function setRuntimeInstagramToken(token: string): void {
  runtimeAccessToken = token;
}

export function getRuntimeInstagramToken(): string | null {
  return runtimeAccessToken;
}
