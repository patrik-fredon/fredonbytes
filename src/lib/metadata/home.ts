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

  // Enhanced keywords with Czech market focus
  const enhancedKeywords =
    locale === "cs"
      ? "tvorba webových stránek Brno, vývoj webů Brno, IT firma Brno, vývoj software Brno, digitální marketing ČR, SEO optimalizace Brno, grafický design Brno, tvorba e-shopů, webové aplikace Brno, IT řešení pro firmy, vývoj mobilních aplikací ČR, WordPress Brno, Next.js vývoj, React vývoj Brno"
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
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          secureUrl: `${baseUrl}/FredonBytes_GraphicLogo.png`,
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
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
    },
  };
}
