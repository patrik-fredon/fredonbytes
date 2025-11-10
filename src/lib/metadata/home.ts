import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generate metadata for the home page
 * Includes SEO optimization for Czech market
 */
export async function getHomeMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const seoT = await getTranslations({ locale, namespace: "seo" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}`;

  // Enhanced keywords with Czech market focus (all services)
  const enhancedKeywords =
    locale === "cs"
      ? "fredon, fredonbytes, hosting brno praha ostrava, webhosting, vývoj webů brno praha, tvorba webových stránek, vývoj softwaru na míru, IT poradenství brno, grafický design brno praha, branding česká republika, copywriting služby, SEO optimalizace brno praha ostrava, social media management, digitální marketing, tvorba mobilních aplikací, e-shop na míru, wordpress vývoj, next.js react, kybernetická bezpečnost, IT podpora 24/7, měsíční balíčky služeb, cloudová řešení, ux ui design, kompletní it řešení, it firma jihomoravský kraj"
      : t("keywords");

  return {
    title: t("title"),
    description: seoT("defaultDescription"),
    keywords: enhancedKeywords,
    authors: [{ name: "Fredonbytes", url: baseUrl }],
    creator: "Fredonbytes",
    publisher: "Fredonbytes",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: baseUrl,
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      url: canonicalUrl,
      siteName: t("siteName"),
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          secureUrl: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: t("logoAlt"),
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Fredonbytes",
      creator: "@FredonBytes",
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [`${baseUrl}/og-image.png`],
    },
  };
}
