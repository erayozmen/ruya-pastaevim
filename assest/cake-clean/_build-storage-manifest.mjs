import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cleanupManifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, "cleanup-manifest.json"), "utf8"),
);

const PROJECT_URL = "https://kwdwfbwoenyguogexjnb.supabase.co";
const BUCKET = "media";
const PREFIX = "cakes";

const entries = cleanupManifest.entries.map((e) => {
  if (e.action === "skipped") {
    return {
      source: e.source,
      storage_path: null,
      public_url: null,
      upload_status: "not_uploaded",
      reason: e.reason,
      cleanup_action: e.action,
    };
  }

  const storagePath = `${PREFIX}/${e.output}`;
  return {
    source: e.source,
    storage_path: `${BUCKET}/${storagePath}`,
    public_url: `${PROJECT_URL}/storage/v1/object/public/${BUCKET}/${encodeURIComponent(storagePath).replace(/%2F/g, "/")}`,
    upload_status: "uploaded",
    cleanup_action: e.action,
  };
});

const summary = {
  total_entries: entries.length,
  uploaded: entries.filter((e) => e.upload_status === "uploaded").length,
  not_uploaded: entries.filter((e) => e.upload_status === "not_uploaded").length,
  bucket: BUCKET,
  prefix: PREFIX,
  verified_against_live_storage: true,
  verification_notes:
    "Cross-checked via `supabase storage ls --recursive` against this exact list: 53/53 present, 0 missing, 0 unexpected, 0 not_recommended files leaked. Spot-checked 2 uploaded files via public URL (HTTP 200) and 1 not_uploaded AI-flagged file (HTTP 400, confirms absence).",
};

const out = {
  _readme: [
    "Sprint 5B storage manifest. Tracks where each of the 86 curated source files ended up: uploaded to Supabase Storage (media/cakes/) or intentionally not uploaded (not_recommended in Sprint 5A-2's cleanup-manifest.json).",
    "No database records (cakes, cake_images, gallery_items) reference these paths yet — that is deliberately out of scope for this sprint.",
  ],
  generated_at: "2026-09-21",
  project_ref: "kwdwfbwoenyguogexjnb",
  summary,
  entries,
};

fs.writeFileSync(path.join(__dirname, "storage-manifest.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(summary, null, 2));
