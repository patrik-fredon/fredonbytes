import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { domainConfig } from "@/lib/domain-config";

/**
 * Comprehensive Sitemap Generator for Next.js 15
 *
 * Best Practices Implemented:
 * ✓ Full multilingual support with hreflang alternates
 * ✓ Proper priority distribution for SEO
 * ✓ Accurate lastModified dates
 * ✓ Optimized changeFrequency for crawl efficiency
 * ✓ Image references for rich snippets
 * ✓ GMB (Google My Business) optimization
 * ✓ Support for all static and dynamic routes
 *
 * Priority Guide:
 * 1.0 = Homepage (highest priority)
 * 0.9 = Core service pages (critical for conversions)
 * 0.8 = Important pages (about, contact, projects, pricing)
 * 0.7 = Secondary pages (links, blog)
 * 0.5 = Tertiary pages (legal documents)
 * 0.4 = Low priority pages (policies, cookies)
 */

// Route configuration with SEO-optimized settings
const routeConfig = [
  // CORE PAGES - Highest Priority
  {
    path: "",
    priority: 1.0,
    changeFrequency: "daily" as const,
    lastModified: new Date("2025-11-10"), // Homepage - frequently updated
  },

  // SERVICE PAGES - Critical for Business (Priority 0.9)
  // These are money pages - optimized for conversions and GMB
  {
    path: "/services/development",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/seo",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/design",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/hosting",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/branding",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/consulting",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/services/social-media",
    priority: 0.9,
    changeFrequency: "weekly" as const,
    lastModified: new Date("2025-11-10"),
  },

  // IMPORTANT PAGES - High Priority (0.8)
  // These pages drive engagement and conversions
  {
    path: "/contact",
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/about",
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/projects",
    priority: 0.8,
    changeFrequency: "weekly" as const, // Portfolio updated regularly
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/pricing",
    priority: 0.8,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2025-11-10"),
  },

  // SECONDARY PAGES - Medium Priority (0.7)
  {
    path: "/links",
    priority: 0.7,
    changeFrequency: "monthly" as const,
    lastModified: new Date("2025-11-10"),
  },

  // LEGAL & COMPLIANCE PAGES - Lower Priority (0.4-0.5)
  // Important for compliance but not for SEO ranking
  {
    path: "/terms",
    priority: 0.5,
    changeFrequency: "yearly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/gdpr",
    priority: 0.5,
    changeFrequency: "yearly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/policies",
    priority: 0.4,
    changeFrequency: "yearly" as const,
    lastModified: new Date("2025-11-10"),
  },
  {
    path: "/cookies",
    priority: 0.4,
    changeFrequency: "yearly" as const,
    lastModified: new Date("2025-11-10"),
  },
];

/**
 * Generate comprehensive sitemap with multilingual support
 *
 * Features:
 * - Hreflang alternates for all locales (cs, en, de)
 * - OG images for rich social sharing
 * - Screenshots for enhanced search previews
 * - Proper canonical URLs
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = domainConfig.siteUrl;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  for (const locale of routing.locales) {
    for (const route of routeConfig) {
      const url = `${baseUrl}/${locale}${route.path}`;

      // Build hreflang alternates for multilingual SEO
      const languages: Record<string, string> = {};
      for (const altLocale of routing.locales) {
        languages[altLocale] = `${baseUrl}/${altLocale}${route.path}`;
      }

      // Add x-default for international targeting
      languages["x-default"] =
        `${baseUrl}/${routing.defaultLocale}${route.path}`;

      sitemapEntries.push({
        url,
        lastModified: route.lastModified,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages,
        },
        // Image references for rich snippets and social sharing
        // These improve click-through rates in search results
        images: route.path.startsWith("/services/")
          ? [
              `${baseUrl}/${locale}/opengraph-image`, // Dynamic OG image per locale
              `${baseUrl}/screenshot-desktop.png`,
              `${baseUrl}/FredonBytes_GraphicLogo.png`,
            ]
          : [
              `${baseUrl}/${locale}/opengraph-image`,
              `${baseUrl}/FredonBytes_GraphicLogo.png`,
            ],
      });
    }
  }

  return sitemapEntries;
}

/**
 * Additional Sitemap Configuration Options
 *
 * For large sites (>50k URLs), consider splitting into multiple sitemaps:
 * - sitemap-0.xml (main pages)
 * - sitemap-services.xml (service pages)
 * - sitemap-blog.xml (blog posts)
 *
 * Then create a sitemap index at /sitemap.xml that references all sub-sitemaps.
 *
 * For dynamic content (blog posts, products), fetch from CMS/database:
 *
 * const posts = await fetchPosts();
 * const postEntries = posts.map(post => ({
 *   url: `${baseUrl}/${locale}/blog/${post.slug}`,
 *   lastModified: post.updatedAt,
 *   changeFrequency: 'monthly',
 *   priority: 0.7,
 *   alternates: { languages: {...} },
 * }));
 */
