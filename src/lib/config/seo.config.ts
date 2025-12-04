/**
 * Central SEO configuration for FredonBytes
 *
 * Single source of truth for:
 * - Base URLs and domain settings
 * - Supported locales and default locale
 * - Brand naming conventions
 * - Site-wide SEO settings
 *
 * @see AGENTS.md Phase 1: Foundation Configuration
 */

import { routing } from "@/i18n/routing";

export const seoConfig = {
  /**
   * Base URL for canonical URLs, sitemaps, and schemas
   * Uses environment variable with fallback
   */
  baseUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.eu",

  /**
   * Default locale for x-default hreflang and fallbacks
   */
  defaultLocale: routing.defaultLocale,

  /**
   * All supported locales - synced with next-intl routing
   */
  locales: routing.locales,

  /**
   * Brand name used in titles and schemas
   */
  brandName: "FredonBytes",

  /**
   * Legal entity name for schemas
   */
  legalName: "Fredonbytes s.r.o.",

  /**
   * Whether to use trailing slashes in URLs
   * MUST match Next.js config
   */
  trailingSlash: false,

  /**
   * Localized site names for OpenGraph and metadata
   */
  siteName: {
    cs: "FredonBytes - Moderní webový vývoj",
    en: "FredonBytes - Modern Web Development",
    de: "FredonBytes - Moderne Webentwicklung",
  } as const,

  /**
   * Localized site descriptions for metadata
   */
  siteDescription: {
    cs: "Všechny IT služby pod jednou střechou. Od kódu po kliky, zajišťujeme kompletní digitální převahu.",
    en: "All IT services under one roof. From code to clicks, we deliver complete digital dominance.",
    de: "Alle IT-Dienste unter einem Dach. Von Code bis Klicks liefern wir komplette digitale Dominanz.",
  } as const,

  /**
   * OpenGraph locale mapping
   */
  ogLocale: {
    cs: "cs_CZ",
    en: "en_US",
    de: "de_DE",
  } as const,

  /**
   * Default OG image path (relative to baseUrl)
   */
  defaultOgImage: "/og-image.png",

  /**
   * OG image dimensions
   */
  ogImageDimensions: {
    width: 1200,
    height: 630,
  },

  /**
   * Twitter card type
   */
  twitterCard: "summary_large_image" as const,

  /**
   * Social media handles
   */
  social: {
    twitter: "@fredonbytes",
    github: "https://github.com/FredonBytes",
    linkedin: "https://linkedin.com/company/fredonbytes",
  },

  /**
   * Robots directives for different page types
   */
  robots: {
    default: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large" as const,
        "max-snippet": -1,
      },
    },
    noIndex: {
      index: false,
      follow: false,
    },
  },

  /**
   * Sitemap configuration
   */
  sitemap: {
    changeFrequency: {
      homepage: "daily" as const,
      services: "weekly" as const,
      about: "monthly" as const,
      legal: "yearly" as const,
    },
    priority: {
      homepage: 1.0,
      services: 0.9,
      core: 0.8,
      secondary: 0.7,
      legal: 0.4,
    },
  },
} as const;

/**
 * Type for supported locales
 */
export type SeoLocale = (typeof seoConfig.locales)[number];

/**
 * Helper to get localized site name
 */
export function getSiteName(locale: string): string {
  return (
    seoConfig.siteName[locale as SeoLocale] || seoConfig.siteName.cs
  );
}

/**
 * Helper to get localized site description
 */
export function getSiteDescription(locale: string): string {
  return (
    seoConfig.siteDescription[locale as SeoLocale] ||
    seoConfig.siteDescription.cs
  );
}

/**
 * Helper to get OG locale
 */
export function getOgLocale(locale: string): string {
  return seoConfig.ogLocale[locale as SeoLocale] || seoConfig.ogLocale.cs;
}

/**
 * Helper to build canonical URL
 */
export function buildCanonicalUrl(locale: string, pathname: string): string {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${seoConfig.baseUrl}/${locale}${cleanPath}`;
}

/**
 * Helper to build hreflang alternates
 */
export function buildHreflangAlternates(pathname: string): Record<string, string> {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;

  const alternates: Record<string, string> = {};

  for (const locale of seoConfig.locales) {
    alternates[locale] = `${seoConfig.baseUrl}/${locale}${cleanPath}`;
  }

  // x-default points to default locale
  alternates["x-default"] = `${seoConfig.baseUrl}/${seoConfig.defaultLocale}${cleanPath}`;

  return alternates;
}
