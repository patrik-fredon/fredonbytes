import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cloud";

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
