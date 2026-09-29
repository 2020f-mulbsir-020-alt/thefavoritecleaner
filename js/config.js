/**
 * The Favorite Cleaner — Site Configuration
 * Edit these values to update contact info, social links, and feature flags site-wide.
 */
const SITE_CONFIG = {
  companyName: "The Favorite Cleaner",
  tagline: "Clean Beyond Expectations.",
  supportingLine: "A Higher Standard of Clean.",
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
  businessHours: "",
  instagramFeedEndpoint: "/api/instagram"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SITE_CONFIG };
}
