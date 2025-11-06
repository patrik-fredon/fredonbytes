import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Generate metadata for the pricing page
 */
export async function getPricingMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pricing.meta" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/pricing`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}/cs/pricing`,
        en: `${baseUrl}/en/pricing`,
        de: `${baseUrl}/de/pricing`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      url: canonicalUrl,
      siteName: "Fredonbytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      images: [
        {
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          secureUrl: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          width: 1200,
          height: 630,
          alt: "Fredonbytes Pricing Plans",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
