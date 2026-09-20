import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inboxDir = __dirname;
const cleanDir = path.join(__dirname, "..", "cake-clean");
fs.mkdirSync(cleanDir, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(path.join(inboxDir, "photo-manifest.json"), "utf8"));

// Crop templates determined by visual test-and-verify against the actual screenshots
// (see Sprint 5A-2 report for the verification process). left is always 0 (full width).
const CROP_TEMPLATES = {
  G03: { top: 400, height: 730 },
  G05: { top: 300, height: 730 },
  G06: { top: 400, height: 730 },
  G14: { top: 300, height: 730 },
  G17: { top: 300, height: 730 },
  G18: { top: 445, height: 700 },
  G19: { top: 300, height: 730 },
  G22: { top: 300, height: 730 },
  G24: { top: 300, height: 730 },
  G25: { top: 300, height: 730 },
  G26: { top: 300, height: 730 },
  G34: { top: 300, height: 730 },
};

// A couple of groups mix two distinct screenshot layouts (light-mode vs dark-mode
// Instagram theme) that need different offsets per file, determined individually.
const PER_FILE_CROP_OVERRIDE = {
  "WhatsApp Image 2026-09-20 at 21.39.14 (1).jpeg": { top: 300, height: 730 }, // G27 light mode
  "WhatsApp Image 2026-09-20 at 21.39.19 (4).jpeg": { top: 320, height: 740 }, // G27 dark mode
  "WhatsApp Image 2026-09-20 at 21.39.19 (1).jpeg": { top: 300, height: 755 }, // G35 dark mode
};

const NOT_RECOMMENDED_USAGE = new Set(["not_recommended"]);

function classify(group) {
  if (!group.is_cake) return "not_recommended";
  if (group.ai_generated_flag) return "not_recommended";
  const onlyNotRec =
    group.recommended_usage.length === 1 && NOT_RECOMMENDED_USAGE.has(group.recommended_usage[0]);
  if (onlyNotRec) return "not_recommended";
  if (!group.is_screenshot) return "clean_original";
  return "crop_required";
}

const results = [];

for (const group of manifest.groups) {
  const decision = classify(group);

  for (const file of group.files) {
    const srcPath = path.join(inboxDir, file);

    if (decision === "not_recommended") {
      results.push({
        source: file,
        output: null,
        action: "skipped",
        decision: "not_recommended",
        group_id: group.group_id,
        reason: group.ai_generated_flag
          ? "ai_generated_flag"
          : !group.is_cake
            ? "not_a_cake"
            : "low_value_or_unusable_as_is",
        original_preserved: true,
        recommended_usage: group.recommended_usage,
      });
      continue;
    }

    if (decision === "clean_original") {
      const outPath = path.join(cleanDir, file);
      fs.copyFileSync(srcPath, outPath);
      results.push({
        source: file,
        output: file,
        action: "clean_original",
        decision: "clean_original",
        group_id: group.group_id,
        crop_reason: null,
        original_preserved: true,
        recommended_usage: group.recommended_usage,
      });
      continue;
    }

    // crop_required
    const override = PER_FILE_CROP_OVERRIDE[file];
    const template = override || CROP_TEMPLATES[group.group_id];

    if (!template) {
      results.push({
        source: file,
        output: null,
        action: "manual_review",
        decision: "crop_required",
        group_id: group.group_id,
        reason: "no_verified_crop_template",
        original_preserved: true,
        recommended_usage: group.recommended_usage,
      });
      continue;
    }

    results.push({
      source: file,
      output: file,
      action: "cropped",
      decision: "crop_required",
      group_id: group.group_id,
      crop_reason: "instagram_ui_removed",
      crop_box: { left: 0, top: template.top, height: template.height },
      original_preserved: true,
      recommended_usage: group.recommended_usage,
      status: "pending",
    });
  }
}

const toCrop = results.filter((r) => r.action === "cropped");

const run = async () => {
  for (const r of toCrop) {
    const srcPath = path.join(inboxDir, r.source);
    const outPath = path.join(cleanDir, r.output);
    try {
      const meta = await sharp(srcPath).metadata();
      const { top, height } = r.crop_box;
      if (top + height > meta.height) {
        r.status = "error";
        r.error = `crop box exceeds image height (${meta.height})`;
        continue;
      }
      await sharp(srcPath)
        .extract({ left: 0, top, width: meta.width, height })
        .jpeg({ quality: 92, mozjpeg: true })
        .toFile(outPath);
      r.status = "ok";
      r.output_dimensions = { width: meta.width, height };
    } catch (err) {
      r.status = "error";
      r.error = String(err.message || err);
    }
  }

  const summary = {
    total_source_files: manifest.summary.total_files_in_folder,
    total_manifest_entries_processed: results.length,
    cropped_ok: results.filter((r) => r.action === "cropped" && r.status === "ok").length,
    cropped_error: results.filter((r) => r.action === "cropped" && r.status === "error").length,
    clean_original: results.filter((r) => r.action === "clean_original").length,
    manual_review: results.filter((r) => r.action === "manual_review").length,
    skipped_not_recommended: results.filter((r) => r.action === "skipped").length,
    output_files_written: results.filter(
      (r) => r.action === "clean_original" || (r.action === "cropped" && r.status === "ok"),
    ).length,
  };

  const cleanupManifest = {
    _readme: [
      "Sprint 5A-2 cleanup manifest. Deterministic crop-only processing via sharp (Node/libvips) — no generative AI editing, no re-rendering, no content changes.",
      "Every 'cropped' entry removes only Instagram UI chrome (status bar, header, caption, engagement row, carousel dots) via a rectangular crop; the cake itself, its decorations, and any text on the cake were not touched, redrawn, or altered.",
      "'clean_original' entries are byte-identical copies of already-clean raw photos (no Instagram UI present) — copied, not re-encoded, so quality is unchanged.",
      "'skipped' entries (not_recommended in photo-manifest.json — AI-flagged, not-a-cake, or otherwise unusable) were left untouched and produced no output file, per instructions.",
      "Source files in cake-inbox/ were only ever opened for reading; none were modified, renamed, or deleted.",
    ],
    generated_at: "2026-09-21",
    source_manifest: "assest/cake-inbox/photo-manifest.json",
    output_folder: "assest/cake-clean",
    summary,
    entries: results,
  };

  fs.writeFileSync(
    path.join(cleanDir, "cleanup-manifest.json"),
    JSON.stringify(cleanupManifest, null, 2),
  );

  console.log(JSON.stringify(summary, null, 2));
};

run();
