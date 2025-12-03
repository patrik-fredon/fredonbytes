import type { MetadataRoute } from "next";
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
  const sitemaps = [
    `${siteUrl}/sitemap.xml`,
    // `${baseUrl}/sitemap-blog.xml`,    // If you have many blog posts
    // `${baseUrl}/sitemap-products.xml`, // If you have many products
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/contact",
          "/services/*",
          "/terms",
          "/policies",
          "/gdpr",
          "/cookies",
          "/links",
          "/projects",
          "/pricing",
          "/*.css$", // CSS files for proper rendering
          "/*.js$", // JavaScript files
          "/public/images/*", // Image assets
          "/public/fonts/*", // Font files
        ],
        disallow: [
          "/admin/", // Admin interfaces
          "/api/", // API routes (except public ones)
          "/private/", // Private user areas
          "/dashboard/", // User dashboards
          "/account/", // Account management
          "/checkout/", // Checkout process
          "/cart/", // Shopping cart
          "/search/", // Internal search results
          "/tmp/", // Temporary files
          "/backup/", // Backup directories
          "/node_modules/", // Dependencies
          "/.env", // Environment files
          "/.git/", // Version control
          "/*.json$", // JSON data files
          "/*.xml$", // XML data files
          "/_next/static/chunks/*.js$", // Internal Next.js chunks
          "/survey/",
          "/form/",
          "/upload/",
        ],
      },
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Googlebot-News",
          "AdsBot-Google",
        ],
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
        crawlDelay: 1, // Be gentle on servers
      },
      // Bingbot specific rules
      {
        userAgent: ["Bingbot", "msnbot", "BingPreview"],
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
        crawlDelay: 2,
      },
      {
        userAgent: "SeznamBot",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/admin/",
          "/form/",
          "/survey/",
          "/upload/",
        ],
        crawlDelay: 2,
      },
    ],

    sitemap: sitemaps,
    host: siteUrl.replace(/https?:\/\//, ""),
  };
}
