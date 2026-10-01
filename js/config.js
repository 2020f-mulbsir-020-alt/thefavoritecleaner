/**
 * The Favorite Cleaner - Site Configuration
 * Edit these values to update contact info, social links, and feature flags site-wide.
 * Leave phoneNumber / whatsappNumber / bookingUrl empty until real values are ready.
 */
const SITE_CONFIG = {
  companyName: "The Favorite Cleaner",
  tagline: "Clean Beyond Expectations.",
  supportingLine: "Professional cleaning done with care.",
  email: "contact@thefavoritecleaner.com",
  website: "https://thefavoritecleaner.com",
  serviceArea: "USA",
  serviceAreaDetail:
    "Professional cleaning for homes and businesses across the USA. Coverage for your location is confirmed when you inquire.",
  phoneNumber: "",
  whatsappNumber: "",
  bookingUrl: "",
  formEndpoint: "",
  instagramUrl: "https://www.instagram.com/thefavoritecleaner",
  facebookUrl: "https://www.facebook.com/thefavoritecleaner",
  linkedinUrl: "https://www.linkedin.com/company/thefavoritecleaner",
  showTestimonials: false,
  businessHours: "Monday-Saturday: 8:00 AM - 6:00 PM",
  responseTime: "We typically respond within 1 business day.",
  paymentNote:
    "Pricing is confirmed before service. Payment instructions are shared with your booking confirmation or invoice.",
  instagramFeedEndpoint: "",
  workPhotosEndpoint: "data/work-photos.json"
};

if (typeof window !== "undefined") {
  window.SITE_CONFIG = SITE_CONFIG;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { SITE_CONFIG };
}
