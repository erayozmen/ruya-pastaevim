import "server-only";
import { createServiceClient } from "@/lib/supabase/service";

export interface InstagramTokenRecord {
  accessToken: string;
  expiresAt: Date;
}

/** Upserts the single connected account's token (see the singleton constraint in the migration). */
export async function saveInstagramToken(accessToken: string, expiresAt: Date): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("instagram_oauth_tokens")
    .upsert({ id: true, access_token: accessToken, expires_at: expiresAt.toISOString() });

  if (error) {
    // Never interpolate the token itself into a log or thrown message.
    throw new Error(`[instagram-token-repo] failed to save token: ${error.message}`);
  }
}

export async function getInstagramToken(): Promise<InstagramTokenRecord | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("instagram_oauth_tokens")
    .select("access_token, expires_at")
    .eq("id", true)
    .maybeSingle();

  if (error) {
    console.error("[instagram-token-repo] failed to read token:", error.message);
    return null;
  }
  if (!data) return null;

  return { accessToken: data.access_token, expiresAt: new Date(data.expires_at) };
}

export async function deleteInstagramToken(): Promise<void> {
  const supabase = createServiceClient();
  const { error } = await supabase.from("instagram_oauth_tokens").delete().eq("id", true);
  if (error) {
    console.error("[instagram-token-repo] failed to delete token:", error.message);
  }
}
