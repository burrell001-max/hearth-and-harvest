// Guard for `npm run get-images`.
//
// The image-sync workflow runs on every push. fetch-images.js re-downloads source
// photographs and re-encodes assets/images/recipes, which would overwrite the
// hand-optimised files (1200x800 WebP, quality 78, under 180 KB) that the recipe
// and blog pages reference, and would also restore images that were deliberately
// removed.
//
// So the sync only runs when someone asks for it explicitly:
//
//     FORCE_IMAGE_SYNC=1 npm run get-images
//
// A push-triggered run does nothing and exits successfully.

const { spawnSync } = require("node:child_process");
const path = require("node:path");

if (process.env.FORCE_IMAGE_SYNC !== "1") {
  console.log("Image sync skipped.");
  console.log("assets/images/recipes holds hand-optimised WebP files (1200x800, q78, <180 KB).");
  console.log("Re-fetching would overwrite them. To force a re-fetch, run:");
  console.log("  FORCE_IMAGE_SYNC=1 npm run get-images");
  process.exit(0);
}

const script = path.join(__dirname, "fetch-images.js");
console.log("FORCE_IMAGE_SYNC=1 set - running", script);
const result = spawnSync(process.execPath, [script], { stdio: "inherit" });
process.exit(result.status === null ? 1 : result.status);
