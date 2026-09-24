import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database/types";

/**
 * Service-role Supabase client. Bypasses RLS entirely — this is exactly
 * why it exists: `instagram_oauth_tokens` has RLS enabled with no policies
 * for `anon`/`authenticated` at all, so the only way to read or write it
 * is a key that skips RLS.
 *
 * DO NOT import this from anywhere except `instagram-token-repo.ts`.
 * DO NOT import this (or that repo) from a "use client" file — it would
 * pull `SUPABASE_SERVICE_ROLE_KEY` into the browser bundle. `server-only`
 * above makes any such accidental client import fail the build.
 * The key itself is never logged, never returned in any response, and is
 * read once here from a server-only env var.
 */
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("Supabase service client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  }

  return createSupabaseClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    // Token reads must always be current (expiry checks depend on it) —
    // never let Next.js's fetch Data Cache serve a stale row here.
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
