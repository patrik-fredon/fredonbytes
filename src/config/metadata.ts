import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateLocalizedMetadata(
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}`;

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("description"),
    keywords: t("keywords"),
    authors: [{ name: "Fredonbytes", url: baseUrl }],
    creator: "Fredonbytes",
    publisher: "Fredonbytes",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    icons: {
      icon: "/FredonBytes_GraphicLogo.png",
      shortcut: "/FredonBytes_GraphicLogo.png",
      apple: "/FredonBytes_GraphicLogo.png",
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
      locale: getOpenGraphLocale(locale),
      url: canonicalUrl,
      siteName: t("siteName"),
      title: t("title"),
      description: t("description"),
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
      description: t("description"),
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
    },
    metadataBase: new URL(baseUrl),
  };
}

function getOpenGraphLocale(locale: string): string {
  const localeMap: Record<string, string> = {
    cs: "cs_CZ",
    en: "en_US",
    de: "de_DE",
  };
  return localeMap[locale] ?? "en_US";
}
