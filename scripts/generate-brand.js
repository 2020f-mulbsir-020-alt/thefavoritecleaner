/**
 * Generates web-ready brand assets from SVG wordmarks.
 * Replace these with exports from TFC Black.psd / TFC White.psd when available.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const brandDir = path.join(__dirname, "..", "assets", "brand");
fs.mkdirSync(brandDir, { recursive: true });

const logoDarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="160" viewBox="0 0 720 160" role="img" aria-label="The Favorite Cleaner">
  <rect width="720" height="160" fill="none"/>
  <circle cx="52" cy="80" r="36" fill="none" stroke="#002157" stroke-width="3"/>
  <path d="M36 88c8-18 24-28 32-28s24 10 32 28" fill="none" stroke="#FFC50C" stroke-width="3" stroke-linecap="round"/>
  <circle cx="52" cy="68" r="5" fill="#FFC50C"/>
  <text x="108" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="600" fill="#002157" letter-spacing="1">The Favorite</text>
  <text x="108" y="118" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="600" fill="#002157" letter-spacing="4">CLEANER</text>
</svg>`;

const logoLightSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="160" viewBox="0 0 720 160" role="img" aria-label="The Favorite Cleaner">
  <rect width="720" height="160" fill="none"/>
  <circle cx="52" cy="80" r="36" fill="none" stroke="#FFFFFF" stroke-width="3"/>
  <path d="M36 88c8-18 24-28 32-28s24 10 32 28" fill="none" stroke="#FFC50C" stroke-width="3" stroke-linecap="round"/>
  <circle cx="52" cy="68" r="5" fill="#FFC50C"/>
  <text x="108" y="72" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="600" fill="#FFFFFF" letter-spacing="1">The Favorite</text>
  <text x="108" y="118" font-family="Georgia, 'Times New Roman', serif" font-size="42" font-weight="600" fill="#FFFFFF" letter-spacing="4">CLEANER</text>
</svg>`;

const logoMarkSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256" role="img" aria-label="The Favorite Cleaner mark">
  <rect width="256" height="256" rx="32" fill="#002157"/>
  <circle cx="128" cy="118" r="58" fill="none" stroke="#FFFFFF" stroke-width="6"/>
  <path d="M96 132c14-30 42-46 56-46s42 16 56 46" fill="none" stroke="#FFC50C" stroke-width="6" stroke-linecap="round"/>
  <circle cx="128" cy="98" r="8" fill="#FFC50C"/>
  <text x="128" y="214" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="4">TFC</text>
</svg>`;

async function writePng(name, svg, width, height) {
  await sharp(Buffer.from(svg))
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(brandDir, name));
  console.log("Created", name);
}

async function main() {
  await writePng("logo-dark.png", logoDarkSvg, 720, 160);
  await writePng("logo-light.png", logoLightSvg, 720, 160);
  await writePng("logo-mark.png", logoMarkSvg, 256, 256);
  await writePng("favicon.png", logoMarkSvg, 64, 64);

  // Social preview: navy background with logo
  const previewSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#00183F"/>
  <rect x="0" y="0" width="8" height="630" fill="#FFC50C"/>
  <circle cx="180" cy="280" r="70" fill="none" stroke="#FFFFFF" stroke-width="5"/>
  <path d="M140 298c18-38 52-58 70-58s52 20 70 58" fill="none" stroke="#FFC50C" stroke-width="5" stroke-linecap="round"/>
  <circle cx="180" cy="255" r="10" fill="#FFC50C"/>
  <text x="290" y="260" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="600" fill="#FFFFFF">The Favorite Cleaner</text>
  <text x="290" y="330" font-family="Arial, Helvetica, sans-serif" font-size="32" fill="#FFC50C">Clean Beyond Expectations.</text>
  <text x="290" y="390" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="#F8F7F3" opacity="0.85">Premium cleaning services · Texas</text>
</svg>`;

  await sharp(Buffer.from(previewSvg))
    .jpeg({ quality: 88 })
    .toFile(path.join(brandDir, "social-preview.jpg"));
  console.log("Created social-preview.jpg");

  // Keep SVG sources for crisp rendering where useful
  fs.writeFileSync(path.join(brandDir, "logo-dark.svg"), logoDarkSvg);
  fs.writeFileSync(path.join(brandDir, "logo-light.svg"), logoLightSvg);
  fs.writeFileSync(path.join(brandDir, "logo-mark.svg"), logoMarkSvg);
  console.log("Brand assets ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
