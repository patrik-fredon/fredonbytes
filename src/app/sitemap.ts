import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { domainConfig } from "@/lib/domain-config";

/**
 * Dynamic sitemap generation for multi-locale support
 *
 * Generates sitemap entries for all routes across all supported locales (cs, en, de).
 * Uses primary domain from environment configuration for canonical URLs.
 *
 * SEO Features:
 * - Automatic lastModified timestamps
 * - Priority and changeFrequency based on page importance
 * - Hreflang alternate language links for international SEO
 * - Excludes session-based pages (/form/*, /survey/*)
 *
 * @returns {MetadataRoute.Sitemap} Array of sitemap entries
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = domainConfig.siteUrl;

  // Define all static routes (excluding session-based/invitation-only pages)
  const routes = [
    "",
    "/about",
    "/contact",
    "/cookies",
    "/links",
    "/policies",
    "/pricing",
    "/projects",
    "/terms",
    "/gdpr",
    "/services/hosting",
    "/services/branding",
    "/services/consulting",
    "/services/seo",
    "/services/social-media",
    "/services/development",
    "/services/design",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale and route combination
  routing.locales.forEach((locale) => {
    routes.forEach((route) => {
      const url = `${baseUrl}/${locale}${route}`;

      // Determine priority and change frequency based on route
      let priority = 0.5;
      let changeFrequency:
        | "always"
        | "hourly"
        | "daily"
        | "weekly"
        | "monthly"
        | "yearly"
        | "never" = "weekly";

      if (route === "") {
        // Homepage
        priority = 1.0;
        changeFrequency = "daily";
      } else if (
        ["/about", "/contact", "/pricing", "/projects", "/links"].includes(
          route,
        )
      ) {
        // Important pages
        priority = 0.8;
        changeFrequency = "weekly";
      } else if (route.startsWith("/services/")) {
        // Service landing pages
        priority = 0.9;
        changeFrequency = "weekly";
      } else {
        // Other pages
        priority = 0.4;
        changeFrequency = "monthly";
      }

      sitemapEntries.push({
        url,
        lastModified: new Date(),
        changeFrequency,
        priority,
        // Add alternate language links for SEO
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((altLocale) => [
              altLocale,
              `${baseUrl}/${altLocale}${route}`,
            ]),
          ),
        },
      });
    });
  });

  return sitemapEntries;
}
