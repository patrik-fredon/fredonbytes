/**
 * Hreflang generation utilities for multilingual SEO
 *
 * @see AGENTS.md Phase 2: Localization Setup
 */

import { seoConfig } from "@/lib/config/seo.config";

/**
 * Generate hreflang links for a given pathname
 * Used in metadata alternates and sitemap generation
 */
export function generateHreflangLinks(pathname: string) {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  // Remove trailing slash if present (except for root)
  const normalizedPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");

  const links: Array<{ rel: "alternate"; hrefLang: string; href: string }> =
    seoConfig.locales.map((locale) => ({
      rel: "alternate" as const,
      hrefLang: locale,
      href: `${seoConfig.baseUrl}/${locale}${normalizedPath}`,
    }));

  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: `${seoConfig.baseUrl}/${seoConfig.defaultLocale}${normalizedPath}`,
  });

  return links;
}

/**
 * Generate alternates object for Next.js Metadata API
 * Includes canonical and language alternates
 */
export function generateMetadataAlternates(locale: string, pathname: string) {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalizedPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");

  const languages: Record<string, string> = {};
  for (const loc of seoConfig.locales) {
    languages[loc] = `${seoConfig.baseUrl}/${loc}${normalizedPath}`;
  }
  languages["x-default"] = `${seoConfig.baseUrl}/${seoConfig.defaultLocale}${normalizedPath}`;

  return {
    canonical: `${seoConfig.baseUrl}/${locale}${normalizedPath}`,
    languages,
  };
}

/**
 * Generate sitemap entry alternates with hreflang
 * For use in sitemap.ts
 */
export function generateSitemapAlternates(pathname: string) {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalizedPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");

  const languages: Record<string, string> = {};
  for (const locale of seoConfig.locales) {
    languages[locale] = `${seoConfig.baseUrl}/${locale}${normalizedPath}`;
  }
  languages["x-default"] = `${seoConfig.baseUrl}/${seoConfig.defaultLocale}${normalizedPath}`;

  return { languages };
}
