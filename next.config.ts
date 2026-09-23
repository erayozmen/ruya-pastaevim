import type { NextConfig } from "next";

/**
 * Public product/gallery/review photos are served from this project's own
 * Supabase Storage bucket (`media`, public read-only). The hostname is
 * derived from NEXT_PUBLIC_SUPABASE_URL (already public, already used
 * everywhere else) instead of being hard-coded, so this doesn't drift if
 * the project URL ever changes. Narrowed to that one bucket's path —
 * no open wildcard host.
 */
function supabaseStorageRemotePattern() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  const { hostname, protocol } = new URL(supabaseUrl);
  return {
    protocol: protocol.replace(":", "") as "http" | "https",
    hostname,
    pathname: "/storage/v1/object/public/media/**",
  };
}

const supabaseStoragePattern = supabaseStorageRemotePattern();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: supabaseStoragePattern ? [supabaseStoragePattern] : [],
  },
};

export default nextConfig;
