/**
 * Home page metadata generator
 *
 * @see AGENTS.md Phase 3: Metadata Generation System
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  seoConfig,
  getOgLocale,
} from "@/lib/config/seo.config";
import { businessConfig } from "@/lib/config/business.config";
import { generateMetadataAlternates } from "../hreflang";

/**
 * Generate metadata for the home page
 * Includes SEO optimization for Czech market
 */
export async function getHomeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const seoT = await getTranslations({ locale, namespace: "seo" });

  // Enhanced keywords with Czech market focus (all services)
  const enhancedKeywords =
    locale === "cs"
      ? "fredon, fredonbytes, hosting brno praha ostrava, webhosting, vývoj webů brno praha, tvorba webových stránek, vývoj softwaru na míru, IT poradenství brno, grafický design brno praha, branding česká republika, copywriting služby, SEO optimalizace brno praha ostrava, social media management, digitální marketing, tvorba mobilních aplikací, e-shop na míru, wordpress vývoj, next.js react, kybernetická bezpečnost, IT podpora 24/7, měsíční balíčky služeb, cloudová řešení, ux ui design, kompletní it řešení, it firma jihomoravský kraj"
      : t("keywords");

  const alternates = generateMetadataAlternates(locale, "");

  return {
    title: t("title"),
    description: seoT("defaultDescription"),
    keywords: enhancedKeywords,
    authors: [{ name: businessConfig.company.displayName, url: seoConfig.baseUrl }],
    creator: businessConfig.company.displayName,
    publisher: businessConfig.company.displayName,
    robots: seoConfig.robots.default,
    alternates,
    openGraph: {
      type: "website",
      locale: getOgLocale(locale),
      url: alternates.canonical,
      siteName: t("siteName"),
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [
        {
          url: `${seoConfig.baseUrl}${seoConfig.defaultOgImage}`,
          secureUrl: `${seoConfig.baseUrl}${seoConfig.defaultOgImage}`,
          width: seoConfig.ogImageDimensions.width,
          height: seoConfig.ogImageDimensions.height,
          alt: t("logoAlt"),
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: seoConfig.twitterCard,
      site: seoConfig.social.twitter,
      creator: seoConfig.social.twitter,
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [`${seoConfig.baseUrl}${seoConfig.defaultOgImage}`],
    },
  };
}
