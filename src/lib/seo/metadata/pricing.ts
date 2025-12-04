/**
 * Pricing page metadata generator
 *
 * @see AGENTS.md Phase 3: Metadata Generation System
 */

import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  seoConfig,
  getOgLocale,
} from "@/lib/config/seo.config";
import { generateMetadataAlternates } from "../hreflang";

/**
 * Generate metadata for the pricing page
 */
export async function getPricingMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pricing.meta" });

  const alternates = generateMetadataAlternates(locale, "/pricing");

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates,
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: alternates.canonical,
      siteName: seoConfig.brandName,
      locale: getOgLocale(locale),
      images: [
        {
          url: `${seoConfig.baseUrl}/FredonBytes_GraphicLogo.png`,
          secureUrl: `${seoConfig.baseUrl}/FredonBytes_GraphicLogo.png`,
          width: seoConfig.ogImageDimensions.width,
          height: seoConfig.ogImageDimensions.height,
          alt: "Fredonbytes Pricing Plans",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: seoConfig.twitterCard,
      title: t("title"),
      description: t("description"),
    },
    robots: seoConfig.robots.default,
  };
}
