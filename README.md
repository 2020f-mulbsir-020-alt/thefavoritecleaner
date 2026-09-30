# The Favorite Cleaner — Website

Premium static website for **The Favorite Cleaner** (`https://www.thefavoritecleaner.com`).

Built with semantic HTML5, modern CSS, and vanilla JavaScript. No frameworks, no jQuery.

---

## Run locally

```bash
npm install
npm run serve
```

Then open [http://localhost:3000](http://localhost:3000).

You can also open `index.html` directly, but a local server is recommended for accurate paths and form/fetch behavior.

To regenerate HTML pages after editing `scripts/build-pages.js`:

```bash
node scripts/build-pages.js
```

---

## Configuration (`js/config.js`)

All site-wide settings live in one object:

```js
const SITE_CONFIG = {
  companyName: "The Favorite Cleaner",
  tagline: "Clean Beyond Expectations.",
  email: "contact@thefavoritecleaner.com",
  website: "https://www.thefavoritecleaner.com",
  serviceArea: "Texas",
  phoneNumber: "",
  whatsappNumber: "",
  bookingUrl: "",
  formEndpoint: "",
  instagramUrl: "https://www.instagram.com/thefavoritecleaner",
  facebookUrl: "https://www.facebook.com/thefavoritecleaner",
  linkedinUrl: "https://www.linkedin.com/company/thefavoritecleaner",
  showTestimonials: false,
  businessHours: "Monday–Saturday: 8:00 AM – 6:00 PM (Central Time)",
  responseTime: "We typically respond within 1 business day.",
  formEndpoint: "",
  instagramFeedEndpoint: "/api/instagram"
};
```

Buttons and links that depend on these values update automatically via `js/main.js`.

### Launch checklist

1. Confirm email, hours, and service area in `js/config.js`
2. Add `phoneNumber` / `whatsappNumber` when ready (optional)
3. Set `formEndpoint` (Formspree/Web3Forms) for one-click form delivery — otherwise mailto fallback is used
4. Deploy the project root to Netlify, Vercel, or GitHub Pages
5. Point DNS for `www.thefavoritecleaner.com` (see `CNAME`)
6. Submit `sitemap.xml` in Google Search Console after go-live

---

## Update social media links

Edit `instagramUrl`, `facebookUrl`, and `linkedinUrl` in `js/config.js`.  
Links appear in the header, mobile menu, contact page, gallery CTA, and footer.

---

## Add a phone number

Set `phoneNumber` in `js/config.js`, for example:

```js
phoneNumber: "+1XXXXXXXXXX"
```

Phone buttons remain hidden while this value is empty.

---

## Add WhatsApp

Set `whatsappNumber` with the full international number (digits only or with `+`):

```js
whatsappNumber: "1XXXXXXXXXX"
```

The WhatsApp floating button appears only when this is set.

---

## Connect the booking form

1. Create a form endpoint with [Formspree](https://formspree.io/), [Web3Forms](https://web3forms.com/), or your own backend.
2. Paste the public endpoint URL into `formEndpoint` in `js/config.js`.
3. **Do not** put secret API keys in client-side JavaScript. For Web3Forms, use only the public access key intended for browsers, or proxy through a serverless function.

If `formEndpoint` is empty, the form falls back to a `mailto:` draft addressed to `contact@thefavoritecleaner.com`.

Optional: set `bookingUrl` to an external scheduler. If empty, all **Book Now** buttons go to `contact.html#booking`.

---

## Connect a live Instagram feed (securely)

The gallery can load posts from a serverless endpoint defined by `instagramFeedEndpoint`.

**Never place an Instagram access token in client-side JavaScript.**

Recommended approach:

1. Create a Netlify Function or Vercel Serverless Function (see `api/instagram.js` as a starting stub).
2. Store the Instagram token in the host’s environment variables.
3. Have the function call Instagram Basic Display API (or a trusted feed service such as Smash Balloon / Behold) on the server.
4. Return JSON shaped like:

```json
{
  "posts": [
    {
      "id": "123",
      "media_url": "https://...",
      "permalink": "https://www.instagram.com/p/...",
      "caption": "Optional caption"
    }
  ]
}
```

5. Point `instagramFeedEndpoint` at that function URL.

Until connected, the site shows the curated local gallery plus a **Follow on Instagram** button.

---

## Replace images

Local imagery lives under `assets/images/`:

| Folder | Use |
| --- | --- |
| `hero/` | Homepage hero |
| `about/` | About / intro photography |
| `services/` | Service cards and service heroes |
| `gallery/` | Gallery grid |
| `before-after/` | Comparison slider pairs |

Prefer WebP (with JPG fallback). Keep explicit widths/heights in HTML. After replacing source files you can re-run:

```bash
npm run optimize-images
```

Update image paths in `scripts/build-pages.js` if filenames change, then rebuild pages.

**Before/after section:** demonstration comparison imagery is installed. Replace with authentic project photos when available.

---

## Optimize images

```bash
npm run optimize-images
```

Uses `sharp` to create JPG + WebP outputs and responsive width variants. Aim for compressed hero assets and lazy-loaded below-the-fold media.

---

## Replace the logo

Official logos are exported from the brand PSD files into:

- `assets/brand/logo-dark.png` — black logo for light backgrounds  
- `assets/brand/logo-light.png` — white logo for navy / dark backgrounds  
- `assets/brand/logo-mark.png` — square mark  
- `assets/brand/favicon.png`  
- `assets/brand/social-preview.jpg` — Open Graph / Twitter image  

Original PSD sources (`TFC Black.psd`, `TFC White.psd`) and `Profile For FB.jpg` are stored in `assets/brand/` for reference only — **do not load PSD files in the browser**.

Export replacements at the same aspect ratio. Do not stretch or recolor logos in CSS.

To re-export the official logos from the PSD sources:

```bash
node scripts/export-official-logos.js
```

This reads `TFC (White).psd` and `TFC (Black).psd` and writes web PNGs without altering artwork.
---

## Update metadata

Each page has unique `<title>`, description, canonical, Open Graph, and Twitter tags.  
Edit titles/descriptions in `scripts/build-pages.js`, then run:

```bash
node scripts/build-pages.js
```

Also update `sitemap.xml` if you add pages.

Structured data includes `LocalBusiness` / `CleaningService`, business hours, and homepage FAQ schema. Do not add street address, phone, or review ratings unless real data is confirmed.

---

## Testimonials

`showTestimonials` is `false` by default. The testimonials section stays hidden until authentic reviews are added in the HTML and the flag is set to `true`. Do not invent reviews.

---

## Deploy

### Netlify

1. Drag the project folder into Netlify, or connect the Git repo.
2. Publish directory: project root (no build command required unless you want one).
3. `_redirects` maps unknown routes to `404.html`.
4. Add form/Instagram secrets as environment variables if using functions.

### Vercel

1. Import the repo.
2. Framework preset: Other.
3. Output: project root.
4. `vercel.json` is included for basic routing preferences.

### Standard hosting

Upload all files via SFTP/cPanel keeping the folder structure intact. Ensure `assets/`, `css/`, and `js/` paths remain relative as shipped.

---

## Configure the domain

1. Point your DNS (A/CNAME) to your host.  
2. Confirm HTTPS is enabled.  
3. Set the primary domain to `www.thefavoritecleaner.com` (or your preferred canonical).  
4. Keep canonical tags and `sitemap.xml` aligned with the live URL.

---

## Project structure

```
index.html
about.html
services.html
residential-cleaning.html
commercial-cleaning.html
deep-cleaning.html
move-in-move-out.html
gallery.html
contact.html
privacy-policy.html
terms.html
404.html
css/styles.css
css/responsive.css
js/config.js
js/main.js
js/gallery.js
js/contact-form.js
assets/brand/
assets/images/
assets/icons/
api/instagram.js
robots.txt
sitemap.xml
```

---

## Accessibility & motion

The site targets WCAG 2.2 AA patterns: skip link, keyboard nav, focus styles, accordion/lightbox semantics, form validation, and `prefers-reduced-motion` support.

---

## License notes

Stock photography currently sourced from Unsplash (free for commercial use). Replace with company photography when available. Brand logos remain property of The Favorite Cleaner.
