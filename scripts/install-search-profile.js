/**
 * Install Profile For FB.jpg as search/social brand assets.
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const src = path.join(__dirname, "..", "assets", "brand", "Profile For FB.jpg");
const outDir = path.join(__dirname, "..", "assets", "brand");
const navy = { r: 0, g: 24, b: 63 };

(async () => {
  if (!fs.existsSync(src)) throw new Error("Missing source: " + src);

  await sharp(src)
    .jpeg({ quality: 95, mozjpeg: true })
    .toFile(path.join(outDir, "profile-search.jpg"));

  // Open Graph / Google share preview
  await sharp(src)
    .resize(1200, 630, { fit: "contain", background: navy, position: "centre" })
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(path.join(outDir, "social-preview.jpg"));

  // Square logo for schema / Google brand mark
  await sharp(src)
    .resize(512, 512, { fit: "cover", position: "centre" })
    .png()
    .toFile(path.join(outDir, "logo-mark.png"));

  await sharp(src)
    .resize(180, 180, { fit: "cover", position: "centre" })
    .png()
    .toFile(path.join(outDir, "apple-touch-icon.png"));

  await sharp(src)
    .resize(64, 64, { fit: "cover", position: "centre" })
    .png()
    .toFile(path.join(outDir, "favicon.png"));

  for (const f of [
    "social-preview.jpg",
    "logo-mark.png",
    "apple-touch-icon.png",
    "favicon.png",
    "profile-search.jpg"
  ]) {
    const m = await sharp(path.join(outDir, f)).metadata();
    console.log("OK", f, m.width + "x" + m.height);
  }
  console.log("Search engine profile updated from Profile For FB.jpg");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
