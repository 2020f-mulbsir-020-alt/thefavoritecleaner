/**
 * Instagram feed serverless endpoint (placeholder).
 *
 * Deploy this as a Netlify/Vercel serverless function and point
 * SITE_CONFIG.instagramFeedEndpoint to the live URL.
 *
 * NEVER place Instagram access tokens in client-side JavaScript.
 *
 * Expected JSON response:
 * {
 *   "posts": [
 *     {
 *       "id": "...",
 *       "media_url": "https://...",
 *       "permalink": "https://www.instagram.com/p/...",
 *       "caption": "..."
 *     }
 *   ]
 * }
 */

export default async function handler(request, response) {
  // Example shape only — replace with a secure server-side Instagram API call.
  response.status(501).json({
    error: "Instagram feed not configured",
    message:
      "Connect Instagram Basic Display API or a trusted feed service on the server. See README."
  });
}
