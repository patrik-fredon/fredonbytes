"use client";

import { useTranslations } from "../../hooks/useTranslations";
import { locales, type Locale } from "../../lib/i18n";
import { useEffect } from "react";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image";
  canonical?: string;
  noindex?: boolean;
  useCustomStructuredData?: boolean;
  customStructuredData?: object;
  page?: string; // Page identifier for page-specific SEO
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  tags?: string[];
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage = "/FredonBytes_GraphicLogo.png",
  ogUrl,
  twitterCard = "summary_large_image",
  canonical,
  noindex = false,
  useCustomStructuredData = false,
  customStructuredData,
  page,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  tags,
}: SEOHeadProps) {
  const { t, locale } = useTranslations();

  // Use page-specific SEO if page prop is provided
  const getPageSpecificSEO = (key: string) => {
    if (page && t(`pages.${page}.${key}`) !== `pages.${page}.${key}`) {
      return t(`pages.${page}.${key}`);
    }
    return null;
  };

  // Use provided values or fall back to page-specific or default translations
  const seoTitle =
    title || getPageSpecificSEO("title") || t("seo.defaultTitle");
  const seoDescription =
    description ||
    getPageSpecificSEO("description") ||
    t("seo.defaultDescription");
  const seoKeywords =
    keywords || getPageSpecificSEO("keywords") || t("seo.keywords");
  const siteName = t("seo.siteName");
  const twitterHandle = t("seo.twitterHandle");
  const twitterCreator = t("seo.twitterCreator");

  // Build full title with site name if not already included
  const fullTitle = seoTitle.includes(siteName)
    ? seoTitle
    : `${seoTitle} | ${siteName}`;

  // Get current URL
  const currentUrl =
    ogUrl || (typeof window !== "undefined" ? window.location.href : "");

  // Convert locale to Open Graph format
  const getOgLocale = (locale: Locale) => {
    const localeMap: Record<Locale, string> = {
      en: "en_US",
      de: "de_DE",
      cs: "cs_CZ",
    };
    return localeMap[locale] || "en_US";
  };

  const ogLocale = getOgLocale(locale);

  // Generate organization structured data from translations
  const generateOrganizationStructuredData = () => {
    if (useCustomStructuredData && customStructuredData) {
      return customStructuredData;
    }

    const baseStructuredData = {
      "@context": "https://schema.org",
      "@type": t("jsonLd.organizationType"),
      name: t("jsonLd.organizationName"),
      description: t("jsonLd.organizationDescription"),
      url: typeof window !== "undefined" ? window.location.origin : "",
      logo: `${
        typeof window !== "undefined" ? window.location.origin : ""
      }${ogImage}`,
      foundingDate: t("jsonLd.foundingDate"),
      founder: {
        "@type": "Person",
        name: t("jsonLd.founder"),
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: t("jsonLd.address.streetAddress"),
        addressLocality: t("jsonLd.address.addressLocality"),
        addressRegion: t("jsonLd.address.addressRegion"),
        postalCode: t("jsonLd.address.postalCode"),
        addressCountry: t("jsonLd.address.addressCountry"),
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: t("jsonLd.contactPoint.telephone"),
        contactType: t("jsonLd.contactPoint.contactType"),
        email: t("jsonLd.contactPoint.email"),
      },
      sameAs: [
        "https://github.com/FredonBytes",
        "https://github.com/patrikfredon",
        "https://linkedin.com/company/fredonbytes",
        "https://twitter.com/fredonbytes",
      ],
      knowsAbout: t("jsonLd.services"),
      areaServed: {
        "@type": "Country",
        name: "Czech Republic",
      },
    };

    // Add article-specific data if provided
    if (publishedTime || modifiedTime || articleSection || author) {
      return {
        ...baseStructuredData,
        "@type": "Article",
        headline: seoTitle,
        description: seoDescription,
        author: author
          ? {
              "@type": "Person",
              name: author,
            }
          : undefined,
        publisher: {
          "@type": "Organization",
          name: t("jsonLd.organizationName"),
          logo: {
            "@type": "ImageObject",
            url: `${
              typeof window !== "undefined" ? window.location.origin : ""
            }${ogImage}`,
          },
        },
        datePublished: publishedTime,
        dateModified: modifiedTime || publishedTime,
        articleSection: articleSection,
        keywords: tags?.join(", ") || seoKeywords,
      };
    }

    return baseStructuredData;
  };

  // Update document metadata
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Update title
    document.title = fullTitle;

    // Function to set or update meta tag
    const setMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? "property" : "name";
      let meta = document.querySelector(
        `meta[${attribute}="${name}"]`
      ) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }

      meta.content = content;
    };

    // Function to set or update link tag
    const setLinkTag = (rel: string, href: string, hreflang?: string) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let link = document.querySelector(selector) as HTMLLinkElement;

      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        if (hreflang) link.hreflang = hreflang;
        document.head.appendChild(link);
      }

      link.href = href;
    };

    // Set basic meta tags
    setMetaTag("description", seoDescription);
    setMetaTag("keywords", seoKeywords);
    setMetaTag("author", author || siteName);
    setMetaTag("robots", noindex ? "noindex,nofollow" : "index,follow");

    // Set Open Graph tags
    setMetaTag("og:type", "website", true);
    setMetaTag("og:url", currentUrl, true);
    setMetaTag("og:title", fullTitle, true);
    setMetaTag("og:description", seoDescription, true);
    setMetaTag("og:image", ogImage, true);
    setMetaTag("og:site_name", siteName, true);
    setMetaTag("og:locale", ogLocale, true);

    // Set Twitter tags
    setMetaTag("twitter:card", twitterCard, true);
    setMetaTag("twitter:url", currentUrl, true);
    setMetaTag("twitter:title", fullTitle, true);
    setMetaTag("twitter:description", seoDescription, true);
    setMetaTag("twitter:image", ogImage, true);
    setMetaTag("twitter:site", twitterHandle, true);
    setMetaTag("twitter:creator", twitterCreator, true);

    // Set additional meta tags
    setMetaTag("theme-color", "#0f172a");
    setMetaTag("msapplication-TileColor", "#0f172a");

    // Set canonical URL
    if (canonical) {
      setLinkTag("canonical", canonical);
    }

    // Set hreflang alternates
    const baseUrl = window.location.origin;
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);

    locales.forEach((loc: Locale) => {
      const url = new URL(pathname, baseUrl);
      searchParams.set("lang", loc);
      url.search = searchParams.toString();
      setLinkTag("alternate", url.toString(), loc);
    });

    // Set structured data
    const structuredDataId = "structured-data-script";
    let script = document.getElementById(structuredDataId) as HTMLScriptElement;

    if (!script) {
      script = document.createElement("script");
      script.id = structuredDataId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(generateOrganizationStructuredData());
  }, [
    fullTitle,
    seoDescription,
    seoKeywords,
    ogImage,
    currentUrl,
    ogLocale,
    twitterCard,
    twitterHandle,
    twitterCreator,
    siteName,
    canonical,
    noindex,
    author,
    locale,
    useCustomStructuredData,
    customStructuredData,
  ]);

  // This component doesn't render anything visible
  return null;
}
