/**
 * Export exact brand logos from official PSD files to web-ready PNGs.
 */
const fs = require("fs");
const path = require("path");
const { readPsd, initializeCanvas } = require("ag-psd");
const { createCanvas, Image } = require("canvas");
const sharp = require("sharp");

initializeCanvas(createCanvas, Image);

const whitePath =
  "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (White).psd";
const blackPath =
  "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (Black).psd";
const outDir = path.join(__dirname, "..", "assets", "brand");

function canvasToPng(canvas) {
  return canvas.toBuffer("image/png");
}

async function exportPsd(psdPath, label) {
  const buffer = fs.readFileSync(psdPath);
  const psd = readPsd(buffer);
  console.log(label, "canvas", psd.width, "x", psd.height);
  if (!psd.canvas) throw new Error("No composite canvas for " + label);
  const png = canvasToPng(psd.canvas);
  const trimmed = await sharp(png)
    .trim({ threshold: 8 })
    .png()
    .toBuffer({ resolveWithObject: true });
  console.log(label, "trimmed", trimmed.info.width, "x", trimmed.info.height);
  return trimmed.data;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const whiteBuf = await exportPsd(whitePath, "white");
  const blackBuf = await exportPsd(blackPath, "black");

  // Official white logo for dark backgrounds
  await sharp(whiteBuf)
    .resize({ width: 800, height: 220, fit: "inside" })
    .png()
    .toFile(path.join(outDir, "logo-light.png"));

  // Official black logo for light backgrounds
  await sharp(blackBuf)
    .resize({ width: 800, height: 220, fit: "inside" })
    .png()
    .toFile(path.join(outDir, "logo-dark.png"));

  // Full-resolution masters
  await sharp(whiteBuf).png().toFile(path.join(outDir, "logo-light-full.png"));
  await sharp(blackBuf).png().toFile(path.join(outDir, "logo-dark-full.png"));

  // Mark + favicon from black logo (works on light and can sit in square)
  await sharp(blackBuf)
    .resize({ width: 256, height: 256, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "logo-mark.png"));

  await sharp(blackBuf)
    .resize({ width: 64, height: 64, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, "favicon.png"));

  // Social preview: navy field + exact white logo
  const logoOg = await sharp(whiteBuf)
    .resize({ width: 760, height: 220, fit: "inside" })
    .png()
    .toBuffer();

  const accent = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="630"><rect width="8" height="630" fill="#FFC50C"/></svg>'
  );

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 0, g: 24, b: 63 }
    }
  })
    .composite([
      { input: accent, left: 0, top: 0 },
      { input: logoOg, gravity: "centre" }
    ])
    .jpeg({ quality: 92 })
    .toFile(path.join(outDir, "social-preview.jpg"));

  // Keep PSD references in project brand folder
  fs.copyFileSync(whitePath, path.join(outDir, "TFC White.psd"));
  fs.copyFileSync(blackPath, path.join(outDir, "TFC Black.psd"));

  // Also copy FB profile for potential mark use
  const profile = "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/JPG Files/Profile For FB.jpg";
  if (fs.existsSync(profile)) {
    fs.copyFileSync(profile, path.join(outDir, "Profile For FB.jpg"));
  }

  for (const f of [
    "logo-light.png",
    "logo-dark.png",
    "logo-mark.png",
    "favicon.png",
    "social-preview.jpg"
  ]) {
    const m = await sharp(path.join(outDir, f)).metadata();
    console.log("OUT", f, m.width + "x" + m.height);
  }

  console.log("Exact logos exported.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
