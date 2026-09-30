/**
 * Builds all static HTML pages with shared chrome (header/footer/meta helpers).
 * Run: node scripts/build-pages.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://www.thefavoritecleaner.com";
const EMAIL = "contact@thefavoritecleaner.com";

const ICONS = {
  chevron: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  arrow: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>`,
  close: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  spark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
  heart: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`,
  refresh: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>`,
  chevrons: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  top: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg>`
};

function socialLinks(extraClass = "") {
  return `
    <div class="social-links ${extraClass}">
      <a class="social-link" data-social="instagram" href="https://www.instagram.com/thefavoritecleaner" target="_blank" rel="noopener noreferrer" aria-label="Follow The Favorite Cleaner on Instagram">${ICONS.instagram}</a>
      <a class="social-link" data-social="facebook" href="https://www.facebook.com/thefavoritecleaner" target="_blank" rel="noopener noreferrer" aria-label="Follow The Favorite Cleaner on Facebook">${ICONS.facebook}</a>
      <a class="social-link" data-social="linkedin" href="https://www.linkedin.com/company/thefavoritecleaner" target="_blank" rel="noopener noreferrer" aria-label="Follow The Favorite Cleaner on LinkedIn">${ICONS.linkedin}</a>
    </div>`;
}

function header(opts = {}) {
  const forceSolid = opts.solid ? ' data-force-solid="true" class="site-header is-solid"' : ' class="site-header"';
  return `
  <a class="skip-link" href="#main">Skip to content</a>
  <header${forceSolid} role="banner">
    <div class="header-inner">
      <a class="logo" href="index.html" aria-label="The Favorite Cleaner home">
        <img class="logo-light" src="assets/brand/logo-light.png" width="152" height="71" alt="The Favorite Cleaner" decoding="async" />
        <img class="logo-dark" src="assets/brand/logo-dark.png" width="152" height="71" alt="The Favorite Cleaner" decoding="async" />
      </a>
      <nav class="nav" id="primary-nav" aria-label="Primary">
        <ul class="nav-list">
          <li><a class="nav-link" href="index.html">Home</a></li>
          <li><a class="nav-link" href="about.html">About</a></li>
          <li class="nav-item--dropdown">
            <a class="nav-link" href="services.html" data-services-trigger aria-haspopup="true" aria-expanded="false">Services ${ICONS.chevron}</a>
            <div class="dropdown" role="menu" aria-label="Services">
              <a href="residential-cleaning.html" role="menuitem">Residential Cleaning</a>
              <a href="commercial-cleaning.html" role="menuitem">Commercial Cleaning</a>
              <a href="deep-cleaning.html" role="menuitem">Deep Cleaning</a>
              <a href="move-in-move-out.html" role="menuitem">Move-In and Move-Out Cleaning</a>
              <a href="services.html#recurring" role="menuitem">Recurring Cleaning</a>
              <a href="services.html#customized" role="menuitem">Customized Cleaning</a>
            </div>
          </li>
          <li><a class="nav-link" href="gallery.html">Gallery</a></li>
          <li><a class="nav-link" href="index.html#faq">FAQ</a></li>
          <li><a class="nav-link" href="contact.html">Contact</a></li>
        </ul>
        <div class="nav-mobile-extras">
          <a class="btn btn--gold" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book Now</a>
          ${socialLinks()}
        </div>
      </nav>
      <div class="header-actions">
        ${socialLinks("social-links--header-desktop")}
        <a class="btn btn--gold" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book Now</a>
        <button class="nav-toggle" type="button" aria-controls="primary-nav" aria-expanded="false" aria-label="Open menu">
          ${ICONS.menu}
        </button>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="index.html" aria-label="The Favorite Cleaner home">
            <img class="logo-light" src="assets/brand/logo-light.png" width="152" height="71" alt="The Favorite Cleaner" decoding="async" />
          </a>
          <p>Professional cleaning for homes and businesses, delivered with quality, consistency, and careful attention to detail.</p>
          ${socialLinks()}
        </div>
        <div class="footer-col">
          <h3>Quick Links</h3>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="services.html">Services</a></li>
            <li><a href="gallery.html">Gallery</a></li>
            <li><a href="contact.html">Contact</a></li>
            <li><a href="index.html#faq">FAQ</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Services</h3>
          <ul class="footer-links">
            <li><a href="residential-cleaning.html">Residential Cleaning</a></li>
            <li><a href="commercial-cleaning.html">Commercial Cleaning</a></li>
            <li><a href="deep-cleaning.html">Deep Cleaning</a></li>
            <li><a href="move-in-move-out.html">Move-In / Move-Out</a></li>
            <li><a href="services.html#recurring">Recurring Cleaning</a></li>
            <li><a href="services.html#customized">Customized Cleaning</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h3>Contact</h3>
          <ul class="footer-links">
            <li><a data-config-email="text" href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><span data-config-area-line>Service area: Texas, USA</span></li>
            <li><span data-business-hours>Monday–Saturday: 8:00 AM – 6:00 PM (Central Time)</span></li>
            <li><a data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book a Cleaning</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; <span data-year></span> <span data-config-company>The Favorite Cleaner</span>. All rights reserved.</p>
        <div class="footer-legal">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
        </div>
      </div>
    </div>
  </footer>

  <div class="floating-ui" aria-label="Quick actions">
    <a class="fab fab--desktop-book" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book Now</a>
    <a class="fab fab--icon fab--secondary is-hidden-config" data-requires-phone href="#" aria-label="Call us"><span class="sr-only" data-phone-label></span>${ICONS.phone}</a>
    <a class="fab fab--icon fab--secondary is-hidden-config" data-requires-whatsapp href="#" aria-label="Chat on WhatsApp"><span aria-hidden="true">WA</span></a>
    <a class="fab fab--icon fab--secondary" href="mailto:${EMAIL}" data-config-email aria-label="Email The Favorite Cleaner">${ICONS.mail}</a>
    <a class="fab fab--icon fab--secondary" href="#top" data-back-to-top aria-label="Back to top">${ICONS.top}</a>
  </div>

  <div class="mobile-contact-bar" role="navigation" aria-label="Mobile contact">
    <a class="mcb-email" href="mailto:${EMAIL}" data-config-email>${ICONS.mail} Email</a>
    <a class="mcb-book" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book Now</a>
  </div>`;
}

function ctaBand() {
  return `
  <section class="section section--navy cta-band" aria-labelledby="cta-heading">
    <div class="cta-band__line" aria-hidden="true"></div>
    <div class="container cta-band__content">
      <p class="eyebrow">Get Started</p>
      <h2 id="cta-heading" class="display-lg">A Better Clean Starts Here.</h2>
      <span class="gold-line gold-line--center draw"></span>
      <p class="lead">Tell us about the space and receive a cleaning plan designed around your needs.</p>
      <div class="btn-group" style="justify-content:center;margin-top:1.75rem">
        <a class="btn btn--gold" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book Now ${ICONS.arrow}</a>
      </div>
      <a class="cta-email" data-config-email="text" href="mailto:${EMAIL}">${EMAIL}</a>
    </div>
  </section>`;
}

function head({ title, description, path: pagePath, ogType = "website", schema = "", extraHead = "" }) {
  const url = `${SITE}/${pagePath === "index.html" ? "" : pagePath}`;
  const canonical = pagePath === "index.html" ? SITE + "/" : `${SITE}/${pagePath}`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE}/assets/brand/social-preview.jpg?v=20260930" />
  <meta property="og:site_name" content="The Favorite Cleaner" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${SITE}/assets/brand/social-preview.jpg?v=20260930" />
  <link rel="icon" type="image/png" href="assets/brand/favicon.png?v=20260930" />
  <link rel="apple-touch-icon" href="assets/brand/apple-touch-icon.png?v=20260930" />
  <meta name="theme-color" content="#00183F" />
  <meta property="og:locale" content="en_US" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/styles.css" />
  <link rel="stylesheet" href="css/responsive.css" />
  ${extraHead}
  ${schema}
</head>`;
}

function scripts(extra = []) {
  const base = [
    '<script src="js/config.js" defer></script>',
    '<script src="js/main.js" defer></script>'
  ];
  return [...base, ...extra.map((s) => `<script src="${s}" defer></script>`)].join("\n  ");
}

function pageShell({ meta, bodyClass = "", solidHeader = false, content, extraScripts = [] }) {
  return `${head(meta)}
<body class="${bodyClass} has-mobile-bar" id="top">
  ${header({ solid: solidHeader })}
  <main id="main">
    ${content}
  </main>
  ${footer()}
  ${scripts(extraScripts)}
</body>
</html>
`;
}

function breadcrumbs(items) {
  const parts = items
    .map((item, i) => {
      if (i === items.length - 1) {
        return `<span aria-current="page">${item.label}</span>`;
      }
      return `<a href="${item.href}">${item.label}</a><span aria-hidden="true">/</span>`;
    })
    .join("");
  return `<nav class="breadcrumbs" aria-label="Breadcrumb">${parts}</nav>`;
}

function pageHero({ title, copy, image, imageAlt, crumbs }) {
  return `
  <section class="page-hero" aria-labelledby="page-title">
    <div class="page-hero__media" aria-hidden="true">
      <img src="${image}" alt="" width="1800" height="1200" fetchpriority="high" />
    </div>
    <div class="page-hero__overlay" aria-hidden="true"></div>
    <div class="page-hero__content">
      ${breadcrumbs(crumbs)}
      <h1 id="page-title" class="display-lg">${title}</h1>
      <span class="gold-line draw"></span>
      <p>${copy}</p>
    </div>
  </section>`;
}

function faqItems(items, idPrefix = "faq") {
  return items
    .map((item, i) => {
      const id = `${idPrefix}-${i + 1}`;
      return `
      <div class="faq-item">
        <h3>
          <button class="faq-question" type="button" id="${id}-q" aria-expanded="false" aria-controls="${id}">
            ${item.q}
            ${ICONS.plus}
          </button>
        </h3>
        <div class="faq-answer" id="${id}" role="region" aria-labelledby="${id}-q" hidden>
          <div class="faq-answer__inner">
            <p>${item.a}</p>
          </div>
        </div>
      </div>`;
    })
    .join("");
}

const HOME_FAQS = [
  {
    q: "What types of properties do you clean?",
    a: "We provide cleaning services for residential and commercial properties, including homes, apartments, offices, and selected rental or turnover spaces. Share details about your property so we can recommend a suitable approach."
  },
  {
    q: "Do you offer recurring cleaning services?",
    a: "Yes. Recurring cleaning can be arranged on a weekly, biweekly, monthly, or customized schedule based on your needs and availability."
  },
  {
    q: "Can a cleaning plan be customized?",
    a: "Absolutely. Every property is different, and cleaning plans can be tailored around specific rooms, priorities, product preferences, and access requirements."
  },
  {
    q: "Do you provide move-in and move-out cleaning?",
    a: "Yes. Move-in and move-out cleaning is available to help make transitions simpler and spaces ready for the next chapter."
  },
  {
    q: "How can a cleaning service be booked?",
    a: "Submit a request through our booking form or email contact@thefavoritecleaner.com. We will follow up to confirm details, scope, timing, and next steps."
  },
  {
    q: "How is pricing determined?",
    a: "Pricing depends on property size, condition, service type, frequency, and the scope you request. After reviewing your details, we confirm pricing before service begins."
  },
  {
    q: "Do you bring cleaning supplies and equipment?",
    a: "Yes. Unless otherwise arranged, our team brings professional cleaning supplies and equipment. If you prefer specific products (such as fragrance-free options), let us know when booking."
  },
  {
    q: "What should be prepared before the appointment?",
    a: "Please clear personal items from key surfaces when possible, secure valuables, arrange safe access (keys, codes, or an adult present), and note any pets, parking, or special instructions in advance."
  },
  {
    q: "How long does a cleaning usually take?",
    a: "Timing depends on the size of the property, its condition, and the service selected. We will give a clearer time expectation when your booking details are confirmed."
  },
  {
    q: "What is your cancellation policy?",
    a: "Please provide at least 24 hours’ notice when canceling or rescheduling whenever possible. Late cancellations, no-shows, or lack of access may incur a fee as outlined in our Terms & Conditions."
  },
  {
    q: "How can special cleaning instructions be shared?",
    a: "Include special instructions in your booking request or mention them when we confirm your service so preferences can be noted and followed."
  },
  {
    q: "How far in advance should a service be scheduled?",
    a: "Scheduling ahead is recommended, especially for deep cleans, move-related services, or preferred time windows. Availability can be discussed when you reach out."
  }
];

const localBusinessSchema = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "CleaningService"],
  "name": "The Favorite Cleaner",
  "description": "Professional cleaning services for homes and businesses across Texas, delivered with reliability, consistency, and careful attention to detail.",
  "url": "${SITE}/",
  "email": "${EMAIL}",
  "image": "${SITE}/assets/brand/social-preview.jpg?v=20260930",
  "logo": "${SITE}/assets/brand/logo-mark.png?v=20260930",
  "areaServed": {
    "@type": "State",
    "name": "Texas"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "08:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.instagram.com/thefavoritecleaner",
    "https://www.facebook.com/thefavoritecleaner",
    "https://www.linkedin.com/company/thefavoritecleaner"
  ],
  "priceRange": "$$",
  "currenciesAccepted": "USD",
  "paymentAccepted": "Invoice, arrangements confirmed at booking"
}
</script>`;

const faqSchema = `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": ${JSON.stringify(
    HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  )}
}
</script>`;

/* ===================== PAGES ===================== */

function buildHome() {
  const content = `
  <section class="hero" aria-labelledby="hero-heading">
    <div class="hero__media parallax-media">
      <picture>
        <source type="image/webp" srcset="assets/images/hero/hero-main-1280.webp 1280w, assets/images/hero/hero-main.webp 1600w" sizes="100vw" />
        <img src="assets/images/hero/hero-main.jpg" alt="Professional cleaners in navy uniforms carefully cleaning a bright modern living room" width="2000" height="1125" fetchpriority="high" />
      </picture>
    </div>
    <div class="hero__overlay" aria-hidden="true"></div>
    <div class="hero__content">
      <p class="eyebrow hero-reveal">Premium Cleaning Services</p>
      <h1 id="hero-heading" class="display-xl hero-reveal hero-reveal-delay-1">Clean Beyond Expectations.</h1>
      <p class="hero__copy hero-reveal hero-reveal-delay-2">Detail-focused cleaning for homes and businesses across Texas — delivered with consistency, care, and a higher standard of finish.</p>
      <div class="btn-group hero-reveal hero-reveal-delay-3">
        <a class="btn btn--gold" data-book-now data-book-fallback="contact.html#booking" href="contact.html#booking">Book a Cleaning ${ICONS.arrow}</a>
        <a class="btn btn--outline" href="services.html">Explore Services</a>
      </div>
      <div class="hero__trust hero-reveal hero-reveal-delay-4" aria-label="Brand qualities">
        <span>Reliable</span><span class="divider" aria-hidden="true"></span>
        <span>Detailed</span><span class="divider" aria-hidden="true"></span>
        <span>Trusted</span>
      </div>
    </div>
    <a class="scroll-indicator" href="#intro" aria-label="Scroll to introduction">
      <span class="scroll-indicator__mouse" aria-hidden="true"></span>
      <span>Scroll</span>
    </a>
  </section>

  <section class="section" id="intro" aria-labelledby="intro-heading">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Our Approach</p>
        <h2 id="intro-heading" class="display-lg">More Than Clean. Exceptionally Cared For.</h2>
        <span class="gold-line draw"></span>
        <p class="lead">The Favorite Cleaner provides professional cleaning services designed to create spotless, fresh, and welcoming spaces. Every service is delivered with careful attention, dependable communication, and respect for the property.</p>
        <a class="text-link" href="about.html">Discover Our Approach ${ICONS.arrow}</a>
      </div>
      <div class="split__media reveal reveal-delay-2 parallax-media">
        <picture>
          <source type="image/webp" srcset="assets/images/about/intro-interior-960.webp 960w, assets/images/about/intro-interior.webp 1400w" sizes="(max-width:768px) 100vw, 45vw" />
          <img src="assets/images/about/intro-interior.jpg" alt="Sunlit premium living room with soft furnishings and polished finishes" width="1600" height="1200" loading="lazy" />
        </picture>
      </div>
    </div>
  </section>

  <section class="section section--off-white" aria-labelledby="services-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">What We Offer</p>
        <h2 id="services-heading" class="display-lg">Cleaning Services Designed Around Every Space</h2>
        <span class="gold-line draw"></span>
      </div>
      <div class="services-grid">
        ${serviceCard("residential-cleaning.html", "assets/images/services/residential.jpg", "Residential living room prepared for professional home cleaning", "Residential Cleaning", "Professional care that keeps living spaces fresh, comfortable, and beautifully maintained.")}
        ${serviceCard("commercial-cleaning.html", "assets/images/services/commercial.jpg", "Modern commercial office interior suited for professional cleaning", "Commercial Cleaning", "Dependable cleaning solutions that support professional, welcoming business environments.")}
        ${serviceCard("deep-cleaning.html", "assets/images/services/deep-cleaning.jpg", "Organized professional cleaning supplies prepared for detailed service", "Deep Cleaning", "A detailed top-to-bottom clean for spaces requiring extra attention.")}
        ${serviceCard("move-in-move-out.html", "assets/images/services/move-in-out.jpg", "Bright empty home interior ready for move-in or move-out cleaning", "Move-In and Move-Out Cleaning", "Thorough cleaning that helps make every transition easier.")}
        ${serviceCard("services.html#recurring", "assets/images/services/recurring.jpg", "Elegant residential interior maintained with recurring cleaning care", "Recurring Cleaning", "Consistent weekly, biweekly, or customized cleaning support.")}
        ${serviceCard("services.html#customized", "assets/images/services/customized.jpg", "Professional cleaner attending to detailed surface care", "Customized Cleaning", "Flexible cleaning plans built around specific properties and priorities.")}
      </div>
    </div>
  </section>

  <section class="section section--navy" aria-labelledby="why-heading">
    <div class="container">
      <div class="section__header section__header--center reveal">
        <p class="eyebrow">Why Choose Us</p>
        <h2 id="why-heading" class="display-lg">A Higher Standard in Every Detail</h2>
        <span class="gold-line gold-line--center draw"></span>
      </div>
      <div class="benefits-grid">
        <article class="benefit reveal">
          <div class="benefit__icon">${ICONS.shield}</div>
          <h3>Reliable Service</h3>
          <p>Dependable scheduling, communication, and service.</p>
        </article>
        <article class="benefit reveal reveal-delay-1">
          <div class="benefit__icon">${ICONS.spark}</div>
          <h3>Detail-Focused Cleaning</h3>
          <p>Careful attention to the areas that shape how a space looks and feels.</p>
        </article>
        <article class="benefit reveal reveal-delay-2">
          <div class="benefit__icon">${ICONS.heart}</div>
          <h3>Respectful Care</h3>
          <p>Every property, belonging, and preference is treated with care.</p>
        </article>
        <article class="benefit reveal reveal-delay-3">
          <div class="benefit__icon">${ICONS.refresh}</div>
          <h3>Consistent Quality</h3>
          <p>Professional standards applied to every visit.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="process-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">How It Works</p>
        <h2 id="process-heading" class="display-lg">A Simple Path to a Better Clean</h2>
        <span class="gold-line draw"></span>
      </div>
      <ol class="timeline">
        <li class="timeline__step reveal">
          <span class="timeline__number">01</span>
          <h3>Tell Us About the Space</h3>
          <p>Share property details, priorities, and any special instructions.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-1">
          <span class="timeline__number">02</span>
          <h3>Receive a Personalized Plan</h3>
          <p>We outline a cleaning approach tailored to your needs.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-2">
          <span class="timeline__number">03</span>
          <h3>Choose a Convenient Time</h3>
          <p>Select a schedule that works for your home or business.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-3">
          <span class="timeline__number">04</span>
          <h3>Enjoy a Fresh, Clean Space</h3>
          <p>Settle into a space that feels cared for and renewed.</p>
        </li>
      </ol>
    </div>
  </section>

  <section class="section section--surface" aria-labelledby="ba-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">Results</p>
        <h2 id="ba-heading" class="display-lg">See the Difference</h2>
        <span class="gold-line draw"></span>
      </div>
      <div class="ba-tabs" role="tablist" aria-label="Before and after examples">
        <button class="ba-tab" role="tab" id="tab-kitchen" aria-selected="true" aria-controls="panel-kitchen">Kitchen Cleaning</button>
        <button class="ba-tab" role="tab" id="tab-bath" aria-selected="false" aria-controls="panel-bath">Bathroom Cleaning</button>
        <button class="ba-tab" role="tab" id="tab-living" aria-selected="false" aria-controls="panel-living">Living Space Cleaning</button>
      </div>
      ${baPanel("panel-kitchen", "tab-kitchen", false, "kitchen", "Messy kitchen before professional cleaning", "Spotless kitchen after professional cleaning")}
      ${baPanel("panel-bath", "tab-bath", true, "bathroom", "Dirty bathroom before professional cleaning", "Spotless bathroom after professional cleaning")}
      ${baPanel("panel-living", "tab-living", true, "living", "Cluttered living room before professional cleaning", "Neat living room after professional cleaning")}
      <p class="ba-note">Drag the handle to compare before and after.</p>
    </div>
  </section>

  <section class="section" aria-labelledby="gallery-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">Our Work</p>
        <h2 id="gallery-heading" class="display-lg">Cleaning in Action</h2>
        <span class="gold-line draw"></span>
      </div>
      <div class="gallery-grid" data-instagram-feed>
        ${galleryItem("assets/images/gallery/cleaner-work-1.jpg", "Professional cleaner attending to a residential interior", "Professional care")}
        ${galleryItem("assets/images/gallery/tools-1.jpg", "Organized cleaning tools and supplies", "Prepared tools")}
        ${galleryItem("assets/images/gallery/kitchen-1.jpg", "Bright clean kitchen interior", "Kitchen care")}
        ${galleryItem("assets/images/gallery/bathroom-1.jpg", "Fresh bathroom with clean finishes", "Bathroom detail")}
        ${galleryItem("assets/images/gallery/office-1.jpg", "Professional office environment", "Commercial spaces")}
        ${galleryItem("assets/images/gallery/living-1.jpg", "Styled living room with natural light", "Living spaces")}
        ${galleryItem("assets/images/gallery/moveout-1.jpg", "Open residential interior ready for turnover", "Move-out ready")}
        ${galleryItem("assets/images/gallery/commercial-1.jpg", "Modern commercial workspace", "Business environments")}
      </div>
      <div class="text-center" style="margin-top:2rem">
        <a class="btn btn--outline-navy" data-social="instagram" href="https://www.instagram.com/thefavoritecleaner" target="_blank" rel="noopener noreferrer">${ICONS.instagram} Follow Our Work on Instagram</a>
      </div>
    </div>
  </section>

  <section class="section section--off-white" data-testimonials-section hidden aria-hidden="true" aria-labelledby="testimonials-heading">
    <!-- PLACEHOLDER: Enable via SITE_CONFIG.showTestimonials when authentic reviews are available. Do not invent reviews. -->
    <div class="container">
      <div class="section__header section__header--center">
        <p class="eyebrow">Testimonials</p>
        <h2 id="testimonials-heading" class="display-lg">Service Worth Remembering</h2>
        <span class="gold-line gold-line--center"></span>
        <p class="placeholder-banner is-visible">Authentic customer reviews will appear here once approved for publication.</p>
      </div>
    </div>
  </section>

  <section class="section" id="faq" aria-labelledby="faq-heading">
    <div class="container">
      <div class="section__header section__header--center reveal">
        <p class="eyebrow">FAQ</p>
        <h2 id="faq-heading" class="display-lg">Questions, Answered</h2>
        <span class="gold-line gold-line--center draw"></span>
      </div>
      <div class="faq-list reveal">
        ${faqItems(HOME_FAQS)}
      </div>
    </div>
  </section>

  ${ctaBand()}
  `;

  return pageShell({
    meta: {
      title: "The Favorite Cleaner | Premium Cleaning Services",
      description:
        "Professional cleaning services for homes and businesses, delivered with reliability, consistency, and careful attention to detail.",
      path: "index.html",
      schema: localBusinessSchema + faqSchema,
      extraHead: `<link rel="preload" as="image" href="assets/images/hero/hero-main.jpg" fetchpriority="high" />`
    },
    content,
    extraScripts: ["js/gallery.js"]
  });
}

function serviceCard(href, img, alt, title, desc) {
  const webp = img.replace(/\.jpg$/i, ".webp");
  return `
  <a class="service-card reveal" href="${href}">
    <div class="service-card__media">
      <picture>
        <source type="image/webp" srcset="${webp}" />
        <img src="${img}" alt="${alt}" width="1200" height="800" loading="lazy" />
      </picture>
    </div>
    <div class="service-card__body">
      <h3>${title}</h3>
      <p>${desc}</p>
      <span class="text-link">Learn More ${ICONS.arrow}</span>
    </div>
  </a>`;
}

function baPanel(id, tabId, hidden, key, beforeAlt, afterAlt) {
  return `
  <div class="ba-panel" id="${id}" role="tabpanel" aria-labelledby="${tabId}" ${hidden ? "hidden" : ""}>
    <div class="ba-slider" data-ba-slider>
      <img class="ba-slider__img ba-slider__after" src="assets/images/before-after/${key}-after.jpg" alt="${afterAlt}" width="1200" height="800" />
      <div class="ba-slider__before-wrap">
        <img class="ba-slider__img" src="assets/images/before-after/${key}-before.jpg" alt="${beforeAlt}" width="1200" height="800" />
      </div>
      <span class="ba-label ba-label--before">Before</span>
      <span class="ba-label ba-label--after">After</span>
      <div class="ba-slider__handle">
        <button type="button" class="ba-slider__handle-btn" aria-label="Drag to compare">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18-6-6 6-6"/><path d="m15 6 6 6-6 6"/></svg>
        </button>
      </div>
    </div>
  </div>`;
}

function galleryItem(src, alt, caption) {
  return `
  <button type="button" class="gallery-item reveal" data-lightbox data-full="${src}" data-caption="${caption}" aria-label="View ${caption}">
    <img src="${src}" alt="${alt}" width="1200" height="800" loading="lazy" />
    <span class="gallery-item__caption">${caption}</span>
  </button>`;
}

function bookingForm() {
  return `
  <form class="form-card" data-contact-form id="booking" novalidate>
    <div class="form-grid">
      <div class="form-field">
        <label for="name">Full Name <span aria-hidden="true">*</span></label>
        <input id="name" name="name" type="text" autocomplete="name" required />
        <span class="field-error"></span>
      </div>
      <div class="form-field">
        <label for="email">Email Address <span aria-hidden="true">*</span></label>
        <input id="email" name="email" type="email" autocomplete="email" required />
        <span class="field-error"></span>
      </div>
      <div class="form-field">
        <label for="phone">Phone Number <span class="optional">(optional)</span></label>
        <input id="phone" name="phone" type="tel" autocomplete="tel" />
        <span class="field-error"></span>
      </div>
      <div class="form-field">
        <label for="propertyType">Property Type <span class="optional">(optional)</span></label>
        <select id="propertyType" name="propertyType">
          <option value="">Select…</option>
          <option>Home</option>
          <option>Apartment</option>
          <option>Office</option>
          <option>Commercial Space</option>
          <option>Rental / Airbnb</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-field">
        <label for="service">Service Needed <span aria-hidden="true">*</span></label>
        <select id="service" name="service" required>
          <option value="">Select…</option>
          <option>Residential Cleaning</option>
          <option>Commercial Cleaning</option>
          <option>Deep Cleaning</option>
          <option>Move-In Cleaning</option>
          <option>Move-Out Cleaning</option>
          <option>Recurring Cleaning</option>
          <option>Customized Cleaning</option>
          <option>Other</option>
        </select>
        <span class="field-error"></span>
      </div>
      <div class="form-field">
        <label for="preferredDate">Preferred Date <span class="optional">(optional)</span></label>
        <input id="preferredDate" name="preferredDate" type="date" />
      </div>
      <div class="form-field">
        <label for="preferredTime">Preferred Time <span class="optional">(optional)</span></label>
        <select id="preferredTime" name="preferredTime">
          <option value="">Select…</option>
          <option>Morning</option>
          <option>Afternoon</option>
          <option>Flexible</option>
        </select>
      </div>
      <div class="form-field">
        <label for="propertySize">Property Size <span class="optional">(optional)</span></label>
        <input id="propertySize" name="propertySize" type="text" placeholder="e.g., 2 bed / 1,400 sq ft" />
      </div>
      <div class="form-field">
        <label for="frequency">Service Frequency <span class="optional">(optional)</span></label>
        <select id="frequency" name="frequency">
          <option value="">Select…</option>
          <option>One-time</option>
          <option>Weekly</option>
          <option>Biweekly</option>
          <option>Monthly</option>
          <option>Custom</option>
        </select>
      </div>
      <div class="form-field form-field--full">
        <label for="location">Address or ZIP Code <span class="optional">(optional)</span></label>
        <input id="location" name="location" type="text" autocomplete="postal-code" />
      </div>
      <div class="form-field form-field--full">
        <label for="message">Message or Special Instructions <span class="optional">(optional)</span></label>
        <textarea id="message" name="message" rows="5" placeholder="Tell us about the space, priorities, or access notes."></textarea>
      </div>
      <div class="checkbox-field">
        <input id="consent" name="consent" type="checkbox" required />
        <div>
          <label for="consent">I agree to the <a href="terms.html">Terms &amp; Conditions</a> and the processing of my information as described in the <a href="privacy-policy.html">Privacy Policy</a>. <span aria-hidden="true">*</span></label>
          <span class="field-error"></span>
        </div>
      </div>
      <div class="form-actions">
        <button class="btn btn--gold" type="submit">Submit Request ${ICONS.arrow}</button>
      </div>
    </div>
    <div class="form-message form-message--success" role="status" aria-live="polite"></div>
    <div class="form-message form-message--error" role="alert" aria-live="assertive"></div>
  </form>`;
}

function buildAbout() {
  const content = `
  ${pageHero({
    title: "About The Favorite Cleaner",
    copy: "A higher standard of clean, built on professionalism, integrity, and dependable service.",
    image: "assets/images/about/about-hero.jpg",
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "About" }
    ]
  })}
  <section class="section" aria-labelledby="story-heading">
    <div class="container split">
      <div class="reveal">
        <p class="eyebrow">Our Story</p>
        <h2 id="story-heading" class="display-lg">Built Around Care, Consistency, and Trust</h2>
        <span class="gold-line draw"></span>
        <div class="prose">
          <p>The Favorite Cleaner provides reliable and professional cleaning services for homes and businesses. Our mission is to create spotless, fresh, and welcoming spaces while giving customers more time and peace of mind.</p>
          <p>We focus on quality, consistency, and attention to detail. Every property is treated with care and respect, and every service is tailored to the customer’s cleaning needs.</p>
          <p>Built on professionalism, integrity, and dependable service, The Favorite Cleaner aims to become the cleaning company customers confidently choose and recommend.</p>
        </div>
      </div>
      <div class="split__media reveal reveal-delay-2">
        <img src="assets/images/about/team-work.jpg" alt="Professional cleaner carefully maintaining a polished interior space" width="1600" height="1067" loading="lazy" />
      </div>
    </div>
  </section>
  <section class="section section--off-white" aria-labelledby="mission-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">Guiding Principles</p>
        <h2 id="mission-heading" class="display-lg">Mission, Vision &amp; Values</h2>
        <span class="gold-line draw"></span>
      </div>
      <div class="values-grid">
        <article class="value-card reveal">
          <h3>Mission</h3>
          <p>Create spotless, fresh, and welcoming spaces while giving customers more time and peace of mind.</p>
        </article>
        <article class="value-card reveal reveal-delay-1">
          <h3>Vision</h3>
          <p>Become the cleaning company customers confidently choose and recommend across Texas.</p>
        </article>
        <article class="value-card reveal reveal-delay-2">
          <h3>Values</h3>
          <p>Professionalism, integrity, respectful care, and consistent attention to detail in every visit.</p>
        </article>
      </div>
    </div>
  </section>
  <section class="section" aria-labelledby="philosophy-heading">
    <div class="container" style="max-width:46rem">
      <p class="eyebrow reveal">Service Philosophy</p>
      <h2 id="philosophy-heading" class="display-lg reveal">A Customer-First Approach to Quality</h2>
      <span class="gold-line draw"></span>
      <div class="prose reveal">
        <p>We believe a premium clean is about more than appearance. It is about how a space feels — ordered, refreshed, and thoughtfully cared for.</p>
        <p>Our commitment to quality means listening carefully, communicating clearly, and applying professional standards with respect for every property and preference.</p>
        <ul>
          <li>Plans tailored to each home or business</li>
          <li>Clear communication before and after service</li>
          <li>Respect for belongings, access, and privacy</li>
          <li>Consistent standards from visit to visit</li>
        </ul>
      </div>
    </div>
  </section>
  <section class="section section--surface" aria-labelledby="standards-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">How We Work</p>
        <h2 id="standards-heading" class="display-lg">Professional Service Standards</h2>
        <span class="gold-line draw"></span>
        <p>Practical details customers expect from a reliable cleaning company.</p>
      </div>
      <div class="values-grid">
        <article class="value-card reveal">
          <h3>Supplies &amp; Equipment</h3>
          <p>We bring professional cleaning supplies and tools unless you request otherwise. Specialty product preferences can be noted when booking.</p>
        </article>
        <article class="value-card reveal reveal-delay-1">
          <h3>Communication</h3>
          <p>We confirm scope, timing, access needs, and pricing before service so expectations stay clear from the first visit.</p>
        </article>
        <article class="value-card reveal reveal-delay-2">
          <h3>Respectful Access</h3>
          <p>Keys, codes, and property access are handled carefully. Pets, parking, and building rules should be shared in advance.</p>
        </article>
        <article class="value-card reveal">
          <h3>Quality Follow-Through</h3>
          <p>If something within the agreed scope was missed, contact us within 24 hours so we can make it right according to our Terms.</p>
        </article>
        <article class="value-card reveal reveal-delay-1">
          <h3>Service Area</h3>
          <p data-area-detail>Professional cleaning for homes and businesses across Texas. Coverage for your location is confirmed when you inquire.</p>
        </article>
        <article class="value-card reveal reveal-delay-2">
          <h3>Business Hours</h3>
          <p data-business-hours>Monday–Saturday: 8:00 AM – 6:00 PM (Central Time)</p>
          <p data-response-time style="margin-top:0.65rem">We typically respond within 1 business day.</p>
        </article>
      </div>
    </div>
  </section>
  ${ctaBand()}
  `;
  return pageShell({
    meta: {
      title: "About | The Favorite Cleaner",
      description:
        "Learn about The Favorite Cleaner’s mission, values, service standards, and commitment to premium cleaning for homes and businesses across Texas.",
      path: "about.html",
      schema: localBusinessSchema
    },
    solidHeader: true,
    content
  });
}

function buildServices() {
  const content = `
  ${pageHero({
    title: "Cleaning Services",
    copy: "Thoughtfully organized cleaning solutions for homes, businesses, and every space in between.",
    image: "assets/images/services/office.jpg",
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "Services" }
    ]
  })}
  <section class="section" aria-labelledby="overview-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">Overview</p>
        <h2 id="overview-heading" class="display-lg">Services Organized Around Your Needs</h2>
        <span class="gold-line draw"></span>
        <p>Browse our core offerings below. Exact task lists can be confirmed when we discuss your property and priorities.</p>
      </div>
      <div class="service-groups">
        <div class="service-group reveal" id="homes">
          <h3>Homes &amp; Residences</h3>
          <div class="service-group__list">
            <a href="residential-cleaning.html">Residential Cleaning</a>
            <a href="residential-cleaning.html">House Cleaning</a>
            <a href="residential-cleaning.html">Apartment Cleaning</a>
            <a href="services.html#kitchen">Kitchen Cleaning</a>
            <a href="services.html#bathroom">Bathroom Cleaning</a>
            <span>Floor Cleaning</span>
            <span>Seasonal Cleaning</span>
          </div>
        </div>
        <div class="service-group reveal" id="business">
          <h3>Business &amp; Commercial</h3>
          <div class="service-group__list">
            <a href="commercial-cleaning.html">Commercial Cleaning</a>
            <a href="commercial-cleaning.html">Office Cleaning</a>
            <span>Professional Cleaning Services</span>
            <span>Post-Construction Cleaning</span>
          </div>
        </div>
        <div class="service-group reveal" id="specialty">
          <h3>Specialty &amp; Transitions</h3>
          <div class="service-group__list">
            <a href="deep-cleaning.html">Deep Cleaning</a>
            <a href="move-in-move-out.html">Move-In Cleaning</a>
            <a href="move-in-move-out.html">Move-Out Cleaning</a>
            <span>Rental Property Cleaning</span>
            <span>Airbnb Cleaning</span>
            <span>Property Turnover Cleaning</span>
            <span>One-Time Cleaning</span>
          </div>
        </div>
        <div class="service-group reveal" id="recurring">
          <h3>Recurring Cleaning</h3>
          <p>Consistent weekly, biweekly, or customized schedules that keep spaces maintained over time.</p>
          <div class="service-group__list" style="margin-top:1rem">
            <a href="contact.html#booking">Request Recurring Service</a>
          </div>
        </div>
        <div class="service-group reveal" id="customized">
          <h3>Customized Cleaning Plans</h3>
          <p>Flexible plans built around specific properties, priorities, and access requirements.</p>
          <div class="service-group__list" style="margin-top:1rem">
            <a href="contact.html#booking">Build a Custom Plan</a>
          </div>
        </div>
        <div class="service-group reveal" id="kitchen">
          <h3>Kitchen &amp; Bathroom Focus</h3>
          <div class="service-group__list">
            <span>Kitchen Cleaning</span>
            <span>Bathroom Cleaning</span>
          </div>
        </div>
        <div class="service-group reveal" id="bathroom"></div>
      </div>
    </div>
  </section>
  <section class="section section--off-white">
    <div class="container">
      <div class="services-grid">
        ${serviceCard("residential-cleaning.html", "assets/images/services/residential.jpg", "Residential interior", "Residential Cleaning", "Fresh, comfortable living spaces maintained with professional care.")}
        ${serviceCard("commercial-cleaning.html", "assets/images/services/commercial.jpg", "Commercial office", "Commercial Cleaning", "Welcoming business environments supported by dependable cleaning.")}
        ${serviceCard("deep-cleaning.html", "assets/images/services/deep-cleaning.jpg", "Cleaning supplies", "Deep Cleaning", "Detailed attention for spaces that need more than a standard clean.")}
        ${serviceCard("move-in-move-out.html", "assets/images/services/move-in-out.jpg", "Empty bright home", "Move-In / Move-Out", "Thorough cleaning that supports smoother transitions.")}
      </div>
    </div>
  </section>
  ${ctaBand()}
  `;
  return pageShell({
    meta: {
      title: "Services | The Favorite Cleaner",
      description:
        "Explore residential, commercial, deep cleaning, move-in/move-out, recurring, and customized cleaning services from The Favorite Cleaner.",
      path: "services.html"
    },
    solidHeader: true,
    content
  });
}

function buildServicePage({ file, title, metaTitle, description, heroImg, intro, includes, suitable, related }) {
  const faqs = [
    {
      q: `What does ${title.toLowerCase()} typically involve?`,
      a: "The exact scope depends on the property and your priorities. We discuss details before service so expectations are clear."
    },
    {
      q: "Can this service be customized?",
      a: "Yes. Cleaning plans can be adjusted around focus areas, access needs, and preferred timing."
    },
    {
      q: "How do I request this service?",
      a: "Use the booking form or email us with property details. We will follow up to confirm next steps."
    }
  ];

  const content = `
  ${pageHero({
    title,
    copy: intro.slice(0, 140) + (intro.length > 140 ? "…" : ""),
    image: heroImg,
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "Services", href: "services.html" },
      { label: title }
    ]
  })}
  <section class="section">
    <div class="container prose reveal">
      <p class="eyebrow">Overview</p>
      <h2 class="display-md">Service Introduction</h2>
      <span class="gold-line draw"></span>
      <p>${intro}</p>
      <h2>What This Service May Include</h2>
      <p>Scopes vary by property. The following areas are commonly discussed when planning service:</p>
      <ul class="checklist">
        ${includes.map((i) => `<li>${i}</li>`).join("")}
      </ul>
      <p><em>Final inclusions are confirmed with you before service begins.</em></p>
      <h2>Who This Service Is Suitable For</h2>
      <p>${suitable}</p>
      <h2>Customization Notice</h2>
      <p>Every space is unique. Share priorities, restricted areas, preferred products considerations, and access instructions so your plan can be tailored appropriately.</p>
    </div>
  </section>
  <section class="section section--off-white" aria-labelledby="svc-faq">
    <div class="container">
      <div class="section__header section__header--center reveal">
        <h2 id="svc-faq" class="display-md">Frequently Asked Questions</h2>
        <span class="gold-line gold-line--center draw"></span>
      </div>
      <div class="faq-list">${faqItems(faqs, file.replace(".html", ""))}</div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section__header reveal">
        <h2 class="display-md">Related Services</h2>
        <span class="gold-line draw"></span>
      </div>
      <div class="related-services">
        ${related
          .map(
            (r) => `
          <a class="service-card" href="${r.href}">
            <div class="service-card__media">
              <img src="${r.img}" alt="${r.title}" width="800" height="560" loading="lazy" />
            </div>
            <div class="service-card__body">
              <h3>${r.title}</h3>
              <span class="text-link">Learn More ${ICONS.arrow}</span>
            </div>
          </a>`
          )
          .join("")}
      </div>
    </div>
  </section>
  ${ctaBand()}
  `;

  return pageShell({
    meta: { title: metaTitle, description, path: file },
    solidHeader: true,
    content
  });
}

function buildGallery() {
  const content = `
  ${pageHero({
    title: "Gallery",
    copy: "A look at the spaces, tools, and professional care behind our work.",
    image: "assets/images/gallery/living-2.jpg",
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "Gallery" }
    ]
  })}
  <section class="section">
    <div class="container">
      <div class="gallery-grid">
        ${galleryItem("assets/images/gallery/cleaner-work-1.jpg", "Professional cleaner at work", "Professional cleaners working")}
        ${galleryItem("assets/images/gallery/tools-1.jpg", "Cleaning tools arranged neatly", "Cleaning tools")}
        ${galleryItem("assets/images/gallery/kitchen-1.jpg", "Clean modern kitchen", "Kitchens")}
        ${galleryItem("assets/images/gallery/bathroom-1.jpg", "Clean bathroom", "Bathrooms")}
        ${galleryItem("assets/images/gallery/office-1.jpg", "Office interior", "Offices")}
        ${galleryItem("assets/images/gallery/living-1.jpg", "Fresh living space", "Living spaces")}
        ${galleryItem("assets/images/gallery/moveout-1.jpg", "Move-out ready interior", "Move-out cleaning")}
        ${galleryItem("assets/images/gallery/commercial-1.jpg", "Commercial environment", "Commercial environments")}
        ${galleryItem("assets/images/gallery/cleaner-work-2.jpg", "Detailed cleaning in progress", "Detail work")}
        ${galleryItem("assets/images/gallery/living-2.jpg", "Bright residential interior", "Fresh interiors")}
      </div>
      <div class="text-center" style="margin-top:2.5rem">
        <a class="btn btn--gold" data-social="instagram" href="https://www.instagram.com/thefavoritecleaner" target="_blank" rel="noopener noreferrer">${ICONS.instagram} Follow on Instagram</a>
      </div>
    </div>
  </section>
  ${ctaBand()}
  `;
  return pageShell({
    meta: {
      title: "Gallery | The Favorite Cleaner",
      description: "Browse cleaning photography from The Favorite Cleaner — kitchens, bathrooms, offices, and professional care in action.",
      path: "gallery.html"
    },
    solidHeader: true,
    content,
    extraScripts: ["js/gallery.js"]
  });
}

function buildContact() {
  const content = `
  ${pageHero({
    title: "Contact & Booking",
    copy: "Tell us about your space. We will follow up to discuss a cleaning plan that fits.",
    image: "assets/images/about/intro-interior.jpg",
    crumbs: [
      { label: "Home", href: "index.html" },
      { label: "Contact" }
    ]
  })}
  <section class="section">
    <div class="container contact-layout">
      <aside class="contact-aside reveal">
        <p class="eyebrow">Reach Out</p>
        <h2 class="display-md">Let’s Plan Your Clean</h2>
        <span class="gold-line draw"></span>
        <p>Share your property details and preferred timing. We review every request carefully and confirm next steps by email.</p>
        <div class="contact-meta">
          <div class="contact-meta__item">
            <h3>Email</h3>
            <a data-config-email="text" href="mailto:${EMAIL}">${EMAIL}</a>
          </div>
          <div class="contact-meta__item is-hidden-config" data-requires-phone>
            <h3>Phone</h3>
            <a href="#" data-phone-label></a>
          </div>
          <div class="contact-meta__item">
            <h3>Service Area</h3>
            <p><span data-config-area>Texas</span>, USA</p>
            <p data-area-detail style="margin-top:0.4rem">Professional cleaning for homes and businesses across Texas. Coverage for your location is confirmed when you inquire.</p>
          </div>
          <div class="contact-meta__item">
            <h3>Business Hours</h3>
            <p data-business-hours>Monday–Saturday: 8:00 AM – 6:00 PM (Central Time)</p>
          </div>
          <div class="contact-meta__item">
            <h3>Response Time</h3>
            <p data-response-time>We typically respond within 1 business day.</p>
          </div>
          <div class="contact-meta__item">
            <h3>Payment</h3>
            <p data-payment-note>Pricing is confirmed before service. Payment instructions are shared with your booking confirmation or invoice.</p>
          </div>
          <div class="contact-meta__item">
            <h3>Policies</h3>
            <p><a href="terms.html">Terms &amp; Conditions</a> · <a href="privacy-policy.html">Privacy Policy</a></p>
          </div>
          <div class="contact-meta__item">
            <h3>Social</h3>
            ${socialLinks()}
          </div>
        </div>
      </aside>
      <div class="reveal reveal-delay-1">
        <h2 class="display-md" style="margin-bottom:1rem">Booking Form</h2>
        <p style="margin-bottom:1.25rem;color:var(--text-secondary)">Required fields help us prepare an accurate follow-up. Optional fields can improve scheduling and pricing accuracy.</p>
        ${bookingForm()}
      </div>
    </div>
  </section>
  <section class="section section--off-white" aria-labelledby="expect-heading">
    <div class="container">
      <div class="section__header reveal">
        <p class="eyebrow">What Happens Next</p>
        <h2 id="expect-heading" class="display-lg">A Clear Path From Inquiry to Service</h2>
        <span class="gold-line draw"></span>
      </div>
      <ol class="timeline">
        <li class="timeline__step reveal">
          <span class="timeline__number">01</span>
          <h3>Submit Your Request</h3>
          <p>Tell us the property type, service needed, location, and any access or preference notes.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-1">
          <span class="timeline__number">02</span>
          <h3>Receive a Follow-Up</h3>
          <p>We confirm availability, clarify scope, and share pricing details before anything is finalized.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-2">
          <span class="timeline__number">03</span>
          <h3>Schedule Your Cleaning</h3>
          <p>Once details are agreed, we lock in a convenient date and time for your home or business.</p>
        </li>
        <li class="timeline__step reveal reveal-delay-3">
          <span class="timeline__number">04</span>
          <h3>Enjoy a Fresh Space</h3>
          <p>Our team arrives prepared with supplies and completes the agreed scope with careful attention.</p>
        </li>
      </ol>
    </div>
  </section>
  <section class="section" aria-labelledby="prep-heading">
    <div class="container" style="max-width:46rem">
      <p class="eyebrow reveal">Before We Arrive</p>
      <h2 id="prep-heading" class="display-lg reveal">Helpful Preparation Checklist</h2>
      <span class="gold-line draw"></span>
      <ul class="checklist reveal">
        <li>Clear counters and floors of excess clutter where possible</li>
        <li>Secure cash, jewelry, and fragile valuables</li>
        <li>Confirm access (keys, codes, gate, or an adult present)</li>
        <li>Share pet details and any safety notes in advance</li>
        <li>Note parking, building rules, or product preferences</li>
        <li>List priority rooms or focus areas for the visit</li>
      </ul>
      <p class="reveal" style="color:var(--text-secondary)">Full customer terms, cancellations, and service expectations are detailed in our <a href="terms.html">Terms &amp; Conditions</a>.</p>
    </div>
  </section>
  `;
  return pageShell({
    meta: {
      title: "Contact & Book | The Favorite Cleaner",
      description:
        "Contact The Favorite Cleaner to book residential or commercial cleaning across Texas. Email contact@thefavoritecleaner.com. Hours Monday–Saturday 8 AM–6 PM CT.",
      path: "contact.html",
      schema: localBusinessSchema
    },
    solidHeader: true,
    content,
    extraScripts: ["js/contact-form.js"]
  });
}

function buildLegal(file, title, metaTitle, bodyHtml) {
  const content = `
  <section class="section" style="padding-top:calc(var(--header-height) + 3rem)">
    <div class="container prose">
      ${breadcrumbs([
        { label: "Home", href: "index.html" },
        { label: title }
      ])}
      <h1 class="display-lg">${title}</h1>
      <span class="gold-line"></span>
      <p><em>Last updated: September 30, 2026</em></p>
      ${bodyHtml}
    </div>
  </section>
  `;
  const description =
    file === "terms.html"
      ? "Customer Terms & Conditions for The Favorite Cleaner cleaning services in Texas."
      : `${title} for The Favorite Cleaner website.`;
  return pageShell({
    meta: {
      title: metaTitle,
      description,
      path: file
    },
    solidHeader: true,
    content
  });
}

function build404() {
  return `${head({
    title: "Page Not Found | The Favorite Cleaner",
    description: "The page you requested could not be found.",
    path: "404.html",
    extraHead: `<meta name="robots" content="noindex" />`
  })}
<body class="has-mobile-bar" id="top">
  ${header({ solid: true })}
  <main id="main" class="error-page">
    <div>
      <h1>404</h1>
      <p>This page is not available. Return home or book a cleaning to continue.</p>
      <div class="btn-group" style="justify-content:center">
        <a class="btn btn--gold" href="index.html">Back to Home</a>
        <a class="btn btn--outline" href="contact.html#booking">Book Now</a>
      </div>
    </div>
  </main>
  ${footer()}
  ${scripts()}
</body>
</html>
`;
}

/* ---- Write files ---- */
const relatedCommon = [
  {
    href: "residential-cleaning.html",
    img: "assets/images/services/residential.jpg",
    title: "Residential Cleaning"
  },
  {
    href: "commercial-cleaning.html",
    img: "assets/images/services/commercial.jpg",
    title: "Commercial Cleaning"
  },
  {
    href: "deep-cleaning.html",
    img: "assets/images/services/deep-cleaning.jpg",
    title: "Deep Cleaning"
  }
];

const pages = {
  "index.html": buildHome(),
  "about.html": buildAbout(),
  "services.html": buildServices(),
  "residential-cleaning.html": buildServicePage({
    file: "residential-cleaning.html",
    title: "Residential Cleaning",
    metaTitle: "Residential Cleaning | The Favorite Cleaner",
    description:
      "Professional residential cleaning for homes and apartments across Texas — detail-focused, respectful, and tailored to your space.",
    heroImg: "assets/images/services/residential.jpg",
    intro:
      "Residential cleaning from The Favorite Cleaner is designed to keep living spaces fresh, comfortable, and beautifully maintained. Whether you need ongoing care or a one-time refresh, we approach every home with respect and careful attention.",
    includes: [
      "Kitchen surfaces and commonly used areas",
      "Bathrooms and high-touch fixtures",
      "Living areas and flooring as discussed",
      "Dusting and general tidy-up of accessible spaces",
      "Custom focus areas based on your priorities"
    ],
    suitable:
      "Ideal for homeowners, renters, and families who want dependable cleaning support without compromising the feel of their space.",
    related: [
      relatedCommon[1],
      relatedCommon[2],
      { href: "move-in-move-out.html", img: "assets/images/services/move-in-out.jpg", title: "Move-In / Move-Out" }
    ]
  }),
  "commercial-cleaning.html": buildServicePage({
    file: "commercial-cleaning.html",
    title: "Commercial Cleaning",
    metaTitle: "Commercial Cleaning | The Favorite Cleaner",
    description:
      "Dependable commercial and office cleaning that supports professional, welcoming business environments across Texas.",
    heroImg: "assets/images/services/commercial.jpg",
    intro:
      "Commercial cleaning supports the impression your business makes every day. We provide dependable cleaning solutions designed for offices and professional environments that need to stay welcoming and well kept.",
    includes: [
      "Workstations and shared surfaces as access allows",
      "Common areas and reception spaces",
      "Restrooms and kitchenette areas",
      "Floor care appropriate to the space",
      "Scheduling options that respect business hours"
    ],
    suitable:
      "Well suited for offices, professional suites, and commercial spaces seeking consistent, discreet cleaning support.",
    related: [
      relatedCommon[0],
      relatedCommon[2],
      { href: "services.html#recurring", img: "assets/images/services/recurring.jpg", title: "Recurring Cleaning" }
    ]
  }),
  "deep-cleaning.html": buildServicePage({
    file: "deep-cleaning.html",
    title: "Deep Cleaning",
    metaTitle: "Deep Cleaning | The Favorite Cleaner",
    description:
      "Detailed deep cleaning for homes and businesses that need thorough, top-to-bottom attention.",
    heroImg: "assets/images/services/deep-cleaning.jpg",
    intro:
      "Deep cleaning is for spaces that need more than a standard maintenance visit. It is a detailed, top-to-bottom approach for properties requiring extra attention — planned carefully around your priorities.",
    includes: [
      "Extended attention to kitchens and bathrooms",
      "Detailed surface and fixture care",
      "Hard-to-reach areas as access and time allow",
      "Baseboards and secondary surfaces when requested",
      "A customized checklist based on property condition"
    ],
    suitable:
      "A strong choice for seasonal resets, pre-event preparation, or spaces that have gone longer between thorough cleanings.",
    related: [
      relatedCommon[0],
      { href: "move-in-move-out.html", img: "assets/images/services/move-in-out.jpg", title: "Move-In / Move-Out" },
      relatedCommon[1]
    ]
  }),
  "move-in-move-out.html": buildServicePage({
    file: "move-in-move-out.html",
    title: "Move-In and Move-Out Cleaning",
    metaTitle: "Move-In & Move-Out Cleaning | The Favorite Cleaner",
    description:
      "Thorough move-in and move-out cleaning to help make every residential or rental transition easier.",
    heroImg: "assets/images/services/move-in-out.jpg",
    intro:
      "Moving is demanding enough. Our move-in and move-out cleaning helps spaces feel ready for what comes next — whether you are welcoming new residents or closing out a chapter.",
    includes: [
      "Empty-home focused cleaning where applicable",
      "Kitchen and bathroom detailing",
      "Interior surfaces and accessible cabinets as discussed",
      "Floor care throughout primary areas",
      "Turnover-ready presentation for rentals when requested"
    ],
    suitable:
      "Helpful for homeowners, renters, landlords, and property managers managing transitions or turnovers.",
    related: [
      relatedCommon[2],
      relatedCommon[0],
      { href: "services.html#specialty", img: "assets/images/services/customized.jpg", title: "Customized Plans" }
    ]
  }),
  "gallery.html": buildGallery(),
  "contact.html": buildContact(),
  "privacy-policy.html": buildLegal(
    "privacy-policy.html",
    "Privacy Policy",
    "Privacy Policy | The Favorite Cleaner",
    `
    <h2>Introduction</h2>
    <p>The Favorite Cleaner (“we,” “us”) respects your privacy. This policy explains what information we collect through our website and booking process, how we use it, and the choices available to you.</p>

    <h2>Information We Collect</h2>
    <p>When you use our contact or booking forms, or email us directly, you may provide:</p>
    <ul>
      <li>Name and contact details (email address, phone number)</li>
      <li>Property type, size, address or ZIP code, and service preferences</li>
      <li>Preferred dates, times, frequency, and special instructions</li>
      <li>Access notes, product preferences, and other message content you choose to share</li>
    </ul>
    <p>Our hosting provider may also collect standard technical logs such as IP address, browser type, and page requests for security and reliability.</p>

    <h2>How We Use Information</h2>
    <p>We use inquiry and booking information to:</p>
    <ul>
      <li>Respond to your request and discuss cleaning services</li>
      <li>Confirm scheduling, scope, pricing, and access arrangements</li>
      <li>Provide customer support related to your service</li>
      <li>Improve our communication and website experience</li>
    </ul>
    <p>We do not sell personal information.</p>

    <h2>Sharing of Information</h2>
    <p>We may share information only as needed to operate the business, such as with trusted service providers that help us process form submissions or host the website, or when required by law. Providers process information according to their own policies in addition to ours.</p>

    <h2>Form Endpoints &amp; Third Parties</h2>
    <p>If a form endpoint provider (such as Formspree or Web3Forms) is connected, your submission is processed by that provider so we can receive and respond to your request.</p>

    <h2>Cookies &amp; Analytics</h2>
    <p>This static website does not set advertising cookies by default. Hosting providers may collect standard server logs. If analytics tools are added later, this policy will be updated.</p>

    <h2>Data Retention</h2>
    <p>We keep inquiry and booking-related information only as long as needed to respond to your request, provide service, maintain business records, or meet legal obligations.</p>

    <h2>Security</h2>
    <p>We take reasonable steps to protect information submitted to us. No method of transmission over the internet is completely secure, so please avoid sending unnecessary sensitive details in booking messages.</p>

    <h2>Children’s Privacy</h2>
    <p>Our services and website are directed to adults arranging cleaning for properties. We do not knowingly collect personal information from children.</p>

    <h2>Your Choices</h2>
    <p>You may contact us to ask questions about your information, request updates, or ask us to remove inquiry details that are no longer needed for an active booking or required recordkeeping.</p>
    <p>Email: <a href="mailto:${EMAIL}">${EMAIL}</a></p>

    <h2>Updates</h2>
    <p>We may update this policy periodically. The “Last updated” date at the top of this page reflects the latest revision.</p>`
  ),
  "terms.html": buildLegal(
    "terms.html",
    "Terms & Conditions",
    "Terms & Conditions | The Favorite Cleaner",
    `
    <p>These Terms &amp; Conditions ("Terms") govern cleaning services provided by The Favorite Cleaner ("we," "us," or "our") to customers ("you" or "customer") in Texas, and use of our website. By requesting, booking, or receiving our services—or by using www.thefavoritecleaner.com—you agree to these Terms.</p>

    <h2>1. Services</h2>
    <p>We provide professional residential and commercial cleaning, including recurring cleaning, deep cleaning, move-in/move-out cleaning, and customized plans as discussed with you. Website descriptions are general. The scope of work, areas included, timing, and pricing for your job are confirmed when your booking is accepted.</p>
    <p>Services include ordinary household or office cleaning within the agreed scope. Unless expressly agreed in writing, services do not include:</p>
    <ul>
      <li>Hoarding cleanup, biohazard, mold remediation, or sewage cleanup</li>
      <li>Construction or post-renovation debris removal beyond light dusting agreed in advance</li>
      <li>Exterior window washing above ground level, roof work, or ladder work beyond safe indoor reach</li>
      <li>Laundry, dishwashing, organizing, packing, or moving furniture beyond light repositioning needed to clean</li>
      <li>Repair, restoration, or furniture refinishing</li>
    </ul>

    <h2>2. Booking &amp; Confirmation</h2>
    <p>Submitting a booking request or inquiry does not guarantee availability. A booking is confirmed only when we accept it in writing (email or message) with a scheduled date and time. We may decline or reschedule service when conditions are unsafe, incomplete information is provided, or the property is outside our service capacity.</p>

    <h2>3. Customer Responsibilities</h2>
    <p>To allow a safe and effective clean, you agree to:</p>
    <ul>
      <li>Provide accurate property details, access instructions, and any special requests before the appointment</li>
      <li>Ensure safe access to the property at the agreed time (keys, codes, gate access, or an adult present)</li>
      <li>Secure pets, or disclose pets and any related safety concerns in advance</li>
      <li>Clear floors and surfaces of excessive clutter so cleaning can be performed within the booked time</li>
      <li>Safeguard cash, jewelry, important documents, and fragile valuables before our team arrives</li>
      <li>Disclose known hazards (broken glass, wet floors, electrical issues, contagious illness in the home)</li>
      <li>Confirm parking arrangements and any building/HOA rules that affect our visit</li>
    </ul>
    <p>If we cannot complete the agreed service because of lack of access, unsafe conditions, or excessive clutter that was not disclosed, a trip or cancellation fee may apply, and the appointment may need to be rescheduled.</p>

    <h2>4. Pricing &amp; Payment</h2>
    <p>Pricing is based on property size, condition, service type, frequency, and the scope you request. Estimates may change if the property condition differs materially from what was described. Final pricing will be confirmed before or at the time of service.</p>
    <p>Payment is due as stated on your invoice or confirmation (for example, upon completion or according to an agreed recurring schedule). Late payments may result in suspension of future bookings until the balance is resolved. Applicable sales tax will be added where required by law.</p>

    <h2>5. Cancellations, Rescheduling &amp; No-Shows</h2>
    <p>Please give as much notice as possible if you need to change or cancel an appointment.</p>
    <ul>
      <li><strong>Reschedule or cancel 24+ hours ahead:</strong> No fee in most cases.</li>
      <li><strong>Less than 24 hours’ notice:</strong> A cancellation or late-change fee of up to 50% of the scheduled service may apply.</li>
      <li><strong>No-show / locked out / no access:</strong> Up to 100% of the scheduled service fee may be charged.</li>
    </ul>
    <p>We will notify you as soon as practical if we must reschedule due to illness, weather, emergencies, or operational issues, and we will offer a new appointment time.</p>

    <h2>6. Recurring Cleaning</h2>
    <p>Recurring plans (weekly, biweekly, or customized) continue on the agreed schedule until you cancel or we discontinue service. Changes to frequency, scope, or day preference should be requested in advance so we can plan staffing. Pricing for recurring visits assumes a maintained property; if condition declines significantly between visits, we may recommend a deep clean or adjusted pricing.</p>

    <h2>7. Satisfaction &amp; Reclean</h2>
    <p>Your satisfaction matters. If something within the agreed scope was missed, please contact us within 24 hours of the completed service with details and, if helpful, photos. When the concern is reasonable and relates to our work, we will return to address it at no additional charge within a mutually agreed timeframe. Reclean requests do not apply to areas outside the original scope, wear-and-tear, or issues caused after our team left the property.</p>

    <h2>8. Damage, Belongings &amp; Liability</h2>
    <p>Our team is trained to work carefully and respectfully. Please report any suspected damage within 24 hours of the service. We are not responsible for:</p>
    <ul>
      <li>Pre-existing damage, wear, stains, or defects</li>
      <li>Items that are already fragile, poorly installed, or beyond normal useful life</li>
      <li>Loss of unsecured cash, jewelry, or valuables left accessible</li>
      <li>Third-party products, finishes, or surfaces that react poorly to standard professional cleaning methods when manufacturer care instructions were not disclosed</li>
      <li>Indirect, incidental, or consequential damages</li>
    </ul>
    <p>To the fullest extent permitted by law, our total liability related to any service visit is limited to the amount you paid for that visit. Nothing in these Terms limits liability that cannot be limited under Texas law.</p>

    <h2>9. Keys, Codes &amp; Security</h2>
    <p>If you provide keys, lockboxes, or access codes, you authorize us to use them solely to perform the scheduled service. We will handle access credentials with care. You remain responsible for updating codes after service if required by your building or personal preference. Lost-key situations will be handled case by case in good faith.</p>

    <h2>10. Supplies &amp; Equipment</h2>
    <p>Unless otherwise arranged, we bring professional cleaning supplies and equipment. If you require specific products (for example, fragrance-free or particular brands), tell us before the appointment. Additional specialty products or equipment may affect pricing.</p>

    <h2>11. Health &amp; Safety</h2>
    <p>We may postpone or leave a job if conditions are unsafe, including aggressive pets, harassment, illegal activity, contagious illness without disclosure, or environmental hazards. You agree not to request services that would require our team to violate safety standards or the law.</p>

    <h2>12. Website Use</h2>
    <p>Website content is for general information and does not create a binding service contract by itself. Brand assets, design, and original content belong to The Favorite Cleaner or their respective owners and may not be copied or reused without permission. We are not liable for temporary website outages or reliance on outdated general content.</p>

    <h2>13. Privacy</h2>
    <p>How we handle inquiry and booking information is described in our <a href="privacy-policy.html">Privacy Policy</a>.</p>

    <h2>14. Changes to These Terms</h2>
    <p>We may update these Terms from time to time. The "Last updated" date at the top of this page shows the latest revision. Continued use of our services or website after changes means you accept the updated Terms. Material changes affecting an existing confirmed booking will be communicated when practical.</p>

    <h2>15. Governing Law</h2>
    <p>These Terms are governed by the laws of the State of Texas, without regard to conflict-of-law rules. Any dispute arising from our services or these Terms will be handled in courts located in Texas, unless applicable law requires otherwise.</p>

    <h2>16. Contact</h2>
    <p>Questions about these Terms or your cleaning service may be sent to <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
    <p><em>These Terms are provided for customer clarity and do not replace advice from a licensed attorney. Specific job confirmations may include additional written details.</em></p>`
  ),
  "404.html": build404()
};

Object.entries(pages).forEach(([file, html]) => {
  const only = (process.env.WRITE_PAGES || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (only.length && !only.includes(file)) return;
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log("Wrote", file);
});

console.log(onlyLengthMessage());

function onlyLengthMessage() {
  const only = (process.env.WRITE_PAGES || "").split(",").map((s) => s.trim()).filter(Boolean);
  return only.length ? `Selected pages built (${only.join(", ")}).` : "All pages built.";
}