import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

/**
 * Generate metadata for the pricing page
 */
export async function getPricingMetadata(locale: string): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "pricing.meta" });

  const baseUrlEnv = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const baseUrl = baseUrlEnv.replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/${locale}/pricing`;

  const languages = routing.locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${baseUrl}/${currentLocale}/pricing`;
    return acc;
  }, {});
  languages["x-default"] = `${baseUrl}/${routing.defaultLocale}/pricing`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
    alternates: {
      canonical: canonicalUrl,
      languages,
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
    metadataBase: new URL(baseUrl),
  };
}
