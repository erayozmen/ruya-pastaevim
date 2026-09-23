/**
 * Absolute production origin, used for `metadataBase`, canonical URLs,
 * robots.txt and sitemap.xml. No real domain has been assigned to this
 * project yet, so nothing is hard-coded or guessed: set
 * `NEXT_PUBLIC_SITE_URL` (no trailing slash) once a production domain
 * exists — every place that needs an absolute URL reads it from here.
 * Until then this falls back to localhost so `next build`/`next dev`
 * still work.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");
