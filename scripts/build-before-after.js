/**
 * Build before/after image pairs for the comparison slider.
 * Sources: photorealistic messy (before) vs spotless (after) pairs.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "assets", "images", "before-after");
const srcDir = path.join(outDir, "_src");

fs.mkdirSync(outDir, { recursive: true });

const pairs = [
  {
    key: "kitchen",
    beforeSrc: path.join(srcDir, "ba-kitchen-before.png"),
    afterSrc: path.join(srcDir, "ba-kitchen-after.png")
  },
  {
    key: "bathroom",
    beforeSrc: path.join(srcDir, "ba-bathroom-before.png"),
    afterSrc: path.join(srcDir, "ba-bathroom-after.png")
  },
  {
    key: "living",
    beforeSrc: path.join(srcDir, "ba-living-before.png"),
    afterSrc: path.join(srcDir, "ba-living-after.png")
  }
];

async function processImage(src, destBase) {
  const width = 1400;
  const height = 900;

  const buf = await sharp(src)
    .resize(width, height, { fit: "cover", position: "centre" })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  await sharp(buf).toFile(`${destBase}.jpg`);
  await sharp(buf).webp({ quality: 80 }).toFile(`${destBase}.webp`);
  await sharp(buf)
    .resize(960, 617, { fit: "cover" })
    .webp({ quality: 78 })
    .toFile(`${destBase}-960.webp`);
  await sharp(buf)
    .resize(640, 411, { fit: "cover" })
    .webp({ quality: 76 })
    .toFile(`${destBase}-640.webp`);
}

(async () => {
  for (const pair of pairs) {
    if (!fs.existsSync(pair.beforeSrc) || !fs.existsSync(pair.afterSrc)) {
      console.error("Missing source for", pair.key, {
        before: fs.existsSync(pair.beforeSrc),
        after: fs.existsSync(pair.afterSrc)
      });
      continue;
    }
    await processImage(pair.beforeSrc, path.join(outDir, `${pair.key}-before`));
    await processImage(pair.afterSrc, path.join(outDir, `${pair.key}-after`));
    console.log("Updated", pair.key);
  }
  console.log("Before/after pairs ready.");
})();
