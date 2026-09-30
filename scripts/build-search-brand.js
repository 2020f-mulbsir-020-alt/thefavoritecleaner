/**
 * Rebuild search-engine assets (favicon, apple-touch, OG image) from TFC Black PSD.
 * Uses white background so Google/browser tabs show the logo, not a solid navy box.
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
  canvas.getContext("2d").putImageData(psd.imageData, 0, 0);
  return canvas.toBuffer("image/png");
}

async function squareLogo(trimmed, size, file, pad = 0.14) {
  const inner = Math.round(size * (1 - pad * 2));
  const logo = await sharp(trimmed)
    .resize({ width: inner, height: inner, fit: "inside" })
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(path.join(outDir, file));
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  const raw = psdToPngBuffer(blackPath);
  const trimmed = await sharp(raw).trim({ threshold: 8 }).png().toBuffer();

  await sharp(trimmed)
    .resize({ width: 800, height: 320, fit: "inside" })
    .png()
    .toFile(path.join(outDir, "logo-dark.png"));

  await sharp(trimmed).png().toFile(path.join(outDir, "logo-dark-full.png"));

  await squareLogo(trimmed, 64, "favicon.png", 0.12);
  await squareLogo(trimmed, 180, "apple-touch-icon.png", 0.16);
  await squareLogo(trimmed, 512, "logo-mark.png", 0.16);

  const ogLogo = await sharp(trimmed)
    .resize({ width: 900, height: 280, fit: "inside" })
    .png()
    .toBuffer();

  const goldBar = Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="8"><rect width="1200" height="8" fill="#FFC50C"/></svg>'
  );

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 255, g: 255, b: 255 }
    }
  })
    .composite([
      { input: ogLogo, gravity: "centre" },
      { input: goldBar, top: 0, left: 0 },
      { input: goldBar, top: 622, left: 0 }
    ])
    .jpeg({ quality: 94, mozjpeg: true })
    .toFile(path.join(outDir, "social-preview.jpg"));

  for (const f of [
    "_black-trim-test.png",
    "_black-on-white.jpg"
  ]) {
    const p = path.join(outDir, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  for (const f of [
    "favicon.png",
    "apple-touch-icon.png",
    "logo-mark.png",
    "social-preview.jpg",
    "logo-dark.png"
  ]) {
    const m = await sharp(path.join(outDir, f)).metadata();
    console.log("OK", f, m.width + "x" + m.height);
  }

  console.log("Search-engine brand assets updated from TFC (Black).psd");
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
