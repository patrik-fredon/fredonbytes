/**
 * WebPage JSON-LD schema generator
 *
 * Generates WebPage schema for individual pages, connected to
 * the main WebSite schema via @id references.
 *
 * @see AGENTS.md Phase 4: JSON-LD Schema Implementation
 * @see https://schema.org/WebPage
 */

import { seoConfig, getOgLocale } from "@/lib/config/seo.config";

interface WebPageSchemaOptions {
  /**
   * Current locale
   */
  locale: string;

  /**
   * Page pathname (without locale prefix)
   */
  pathname: string;

  /**
   * Page name/title
   */
  name: string;

  /**
   * Page description
   */
  description?: string;

  /**
   * Page type - defaults to WebPage
   */
  pageType?:
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "FAQPage"
    | "CollectionPage"
    | "ItemPage";

  /**
   * Date page was published
   */
  datePublished?: string;

  /**
   * Date page was last modified
   */
  dateModified?: string;

  /**
   * Primary image URL
   */
  primaryImageUrl?: string;
}

/**
 * Generate WebPage JSON-LD schema
 *
 * @example
 * generateWebPageSchema({
 *   locale: "cs",
 *   pathname: "/about",
 *   name: "O nás",
 *   description: "Informace o společnosti FredonBytes"
 * })
 */
export function generateWebPageSchema({
  locale,
  pathname,
  name,
  description,
  pageType = "WebPage",
  datePublished,
  dateModified,
  primaryImageUrl,
}: WebPageSchemaOptions) {
  const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const normalizedPath = cleanPath === "/" ? "" : cleanPath.replace(/\/$/, "");
  const pageUrl = `${seoConfig.baseUrl}/${locale}${normalizedPath}`;

  return {
    "@context": "https://schema.org",
    "@type": pageType,
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    ...(description && { description }),
    inLanguage: getOgLocale(locale).replace("_", "-"), // cs_CZ -> cs-CZ
    isPartOf: {
      "@id": `${seoConfig.baseUrl}/#website`,
    },
    about: {
      "@id": `${seoConfig.baseUrl}/#organization`,
    },
    ...(primaryImageUrl && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: primaryImageUrl.startsWith("http")
          ? primaryImageUrl
          : `${seoConfig.baseUrl}${primaryImageUrl}`,
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    potentialAction: [
      {
        "@type": "ReadAction",
        target: [pageUrl],
      },
    ],
  };
}

/**
 * Generate WebPage schema for common page types
 */
export const webPageSchemas = {
  /**
   * Homepage WebPage schema
   */
  home: (locale: string, name: string, description?: string) =>
    generateWebPageSchema({
      locale,
      pathname: "",
      name,
      description,
      pageType: "WebPage",
      primaryImageUrl: seoConfig.defaultOgImage,
    }),

  /**
   * About page schema
   */
  about: (locale: string, name: string, description?: string) =>
    generateWebPageSchema({
      locale,
      pathname: "/about",
      name,
      description,
      pageType: "AboutPage",
    }),

  /**
   * Contact page schema
   */
  contact: (locale: string, name: string, description?: string) =>
    generateWebPageSchema({
      locale,
      pathname: "/contact",
      name,
      description,
      pageType: "ContactPage",
    }),

  /**
   * Pricing/Services page schema
   */
  pricing: (locale: string, name: string, description?: string) =>
    generateWebPageSchema({
      locale,
      pathname: "/pricing",
      name,
      description,
      pageType: "CollectionPage",
    }),

  /**
   * Projects page schema
   */
  projects: (locale: string, name: string, description?: string) =>
    generateWebPageSchema({
      locale,
      pathname: "/projects",
      name,
      description,
      pageType: "CollectionPage",
    }),
};
