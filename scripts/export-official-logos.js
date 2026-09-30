/**
 * Export exact logos from official TFC White/Black PSD files.
 */
const fs = require("fs");
const path = require("path");
const { readPsd, initializeCanvas } = require("ag-psd");
const { createCanvas, ImageData } = require("canvas");
const sharp = require("sharp");

initializeCanvas(
  (w, h) => createCanvas(w, h),
  (w, h) => {
    try {
      return new ImageData(w, h);
    } catch (e) {
      return createCanvas(w, h).getContext("2d").createImageData(w, h);
    }
  }
);

const whitePath =
  "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (White).psd";
const blackPath =
  "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/PNG Files/TFC (Black).psd";
const outDir = path.join(__dirname, "..", "assets", "brand");

function psdToPngBuffer(psdPath) {
  const buf = fs.readFileSync(psdPath);
  const psd = readPsd(buf, {
    skipLayerImageData: true,
    skipCompositeImageData: false,
    useImageData: true
  });
  if (!psd.imageData) throw new Error("No image data in " + psdPath);
  const canvas = createCanvas(psd.width, psd.height);
  const ctx = canvas.getContext("2d");
  ctx.putImageData(psd.imageData, 0, 0);
  return canvas.toBuffer("image/png");
}

async function processLogo(pngBuffer, outName, maxWidth) {
  const trimmed = await sharp(pngBuffer)
    .trim({ threshold: 10 })
    .png()
    .toBuffer({ resolveWithObject: true });

  console.log(outName, "trimmed", trimmed.info.width + "x" + trimmed.info.height);

  await sharp(trimmed.data)
    .png()
    .toFile(path.join(outDir, outName.replace(".png", "-full.png")));

  await sharp(trimmed.data)
    .resize({
      width: maxWidth,
      height: Math.round(maxWidth * 0.4),
      fit: "inside",
      withoutEnlargement: false
    })
    .png()
    .toFile(path.join(outDir, outName));

  return trimmed.data;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  console.log("Reading white PSD…");
  const whitePng = psdToPngBuffer(whitePath);
  console.log("Reading black PSD…");
  const blackPng = psdToPngBuffer(blackPath);

  const whiteTrimmed = await processLogo(whitePng, "logo-light.png", 800);
  const blackTrimmed = await processLogo(blackPng, "logo-dark.png", 800);

  // Square mark from black logo for favicon / apple touch
  await sharp(blackTrimmed)
    .resize({
      width: 256,
      height: 256,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(outDir, "logo-mark.png"));

  await sharp(blackTrimmed)
    .resize({
      width: 64,
      height: 64,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toFile(path.join(outDir, "favicon.png"));

  // Social preview with exact white logo
  const logoOg = await sharp(whiteTrimmed)
    .resize({ width: 780, height: 260, fit: "inside" })
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

  // Archive source PSDs in project
  fs.copyFileSync(whitePath, path.join(outDir, "TFC White.psd"));
  fs.copyFileSync(blackPath, path.join(outDir, "TFC Black.psd"));

  const profile =
    "C:/Users/HomePC/OneDrive/Personal Data/The Favorite Cleaner/JPG Files/Profile For FB.jpg";
  if (fs.existsSync(profile)) {
    fs.copyFileSync(profile, path.join(outDir, "Profile For FB.jpg"));
  }

  // Remove temporary generated SVG wordmarks if present
  for (const stale of ["logo-dark.svg", "logo-light.svg", "logo-mark.svg", "_test-white.png"]) {
    const p = path.join(outDir, stale);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  for (const f of [
    "logo-light.png",
    "logo-dark.png",
    "logo-light-full.png",
    "logo-dark-full.png",
    "logo-mark.png",
    "favicon.png",
    "social-preview.jpg"
  ]) {
    const m = await sharp(path.join(outDir, f)).metadata();
    console.log("OUT", f, m.width + "x" + m.height);
  }

  console.log("Exact official logos installed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
