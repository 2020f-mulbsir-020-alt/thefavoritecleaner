/**
 * Downloads and optimizes royalty-free cleaning photography into assets/images.
 * Sources: Unsplash (license: Unsplash License - free for commercial use).
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const https = require("https");
const http = require("http");

const root = path.join(__dirname, "..", "assets", "images");

const images = [
  // Hero
  // Homepage hero is managed separately as branded UHD assets (hero-main-*.webp up to 3200w).
  { file: "hero/hero-poster.jpg", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80", w: 1920, h: 1080 },
  // Intro / about
  { file: "about/intro-interior.jpg", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80", w: 1600, h: 1200 },
  { file: "about/about-hero.jpg", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=80", w: 1800, h: 1200 },
  { file: "about/team-work.jpg", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80", w: 1600, h: 1067 },
  // Services
  { file: "services/residential.jpg", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 900 },
  { file: "services/commercial.jpg", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/deep-cleaning.jpg", url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/move-in-out.jpg", url: "https://images.unsplash.com/photo-1560448204-e02f11c3be0e?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/recurring.jpg", url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/customized.jpg", url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/kitchen.jpg", url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/bathroom.jpg", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "services/office.jpg", url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  // Gallery
  { file: "gallery/cleaner-work-1.jpg", url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/tools-1.jpg", url: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/kitchen-1.jpg", url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/bathroom-1.jpg", url: "https://images.unsplash.com/photo-1620621477192-1e22c0a6c5a8?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/office-1.jpg", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/living-1.jpg", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 900 },
  { file: "gallery/moveout-1.jpg", url: "https://images.unsplash.com/photo-1560448204-e02f11c3be0e?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/commercial-1.jpg", url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/cleaner-work-2.jpg", url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "gallery/living-2.jpg", url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  // Before/after placeholders (clearly labeled later in HTML)
  { file: "before-after/kitchen-before.jpg", url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "before-after/kitchen-after.jpg", url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "before-after/bathroom-before.jpg", url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "before-after/bathroom-after.jpg", url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "before-after/living-before.jpg", url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 800 },
  { file: "before-after/living-after.jpg", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80", w: 1200, h: 900 }
];

function download(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, { headers: { "User-Agent": "TheFavoriteCleanerSite/1.0" } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function processImage(item) {
  const outPath = path.join(root, item.file);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const webpPath = outPath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

  console.log("Downloading", item.file);
  const buf = await download(item.url);

  await sharp(buf)
    .resize(item.w, item.h, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(outPath);

  await sharp(buf)
    .resize(Math.min(item.w, 1400), null, { withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(webpPath);

  // Responsive variants for key images
  const base = outPath.replace(/\.(jpg|jpeg|png)$/i, "");
  for (const width of [640, 960, 1280]) {
    if (width >= item.w) continue;
    await sharp(buf)
      .resize(width)
      .webp({ quality: 75 })
      .toFile(`${base}-${width}.webp`);
  }

  console.log("Saved", item.file);
}

async function main() {
  for (const item of images) {
    try {
      await processImage(item);
    } catch (err) {
      console.error("Failed", item.file, err.message);
    }
  }
  console.log("Image optimization complete.");
}

main();
