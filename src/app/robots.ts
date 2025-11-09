import { MetadataRoute } from "next";
import { domainConfig } from "@/lib/domain-config";

/**
 * Dynamic robots.txt generation
 *
 * Configures search engine crawling rules and sitemap location.
 * Uses primary domain from environment configuration.
 *
 * Crawl Rules:
 * - Allow all pages by default
 * - Disallow: API routes, Next.js internals, admin, session pages
 * - Sitemap points to primary domain
 *
 * SEO Benefits:
 * - Prevents indexing of utility/session pages
 * - Directs crawlers to sitemap for efficient discovery
 * - Host directive helps consolidate to primary domain
 *
 * @returns {MetadataRoute.Robots} Robots.txt configuration
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = domainConfig.siteUrl;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/form/", "/survey/"],
      },
      {
        userAgent: ["Googlebot", "Googlebot-Image", "Googlebot-News", "AdsBot-Google"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/form/", "/survey/"],
      },
      {
        userAgent: ["Bingbot", "msnbot", "BingPreview"],
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/form/", "/survey/"],
        crawlDelay: 1,
      },
      {
        userAgent: "SeznamBot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/", "/form/", "/survey/"],
        crawlDelay: 1,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
