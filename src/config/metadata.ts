import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateLocalizedMetadata(
  locale: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });

  const baseUrlEnv = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const baseUrl = baseUrlEnv.replace(/\/$/, "");
  const canonicalUrl = `${baseUrl}/${locale}`;

  const languages = routing.locales.reduce<Record<string, string>>((acc, currentLocale) => {
    acc[currentLocale] = `${baseUrl}/${currentLocale}`;
    return acc;
  }, {});
  languages["x-default"] = `${baseUrl}/${routing.defaultLocale}`;

  const localeLanguageMap: Record<string, string> = {
    cs: "cs-CZ",
    en: "en-US",
    de: "de-DE",
  };
  const contentLanguage = localeLanguageMap[locale] ?? "en-US";

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
    manifest: "/manifest.webmanifest",
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    other: (() => {
      const other: Record<string, string> = {
        "content-language": contentLanguage,
        "geo.region": "CZ-JM",
        "geo.placename": "Brno, Praha, Ostrava",
        "geo.position": "49.1951;16.6068",
        "ICBM": "49.1951, 16.6068",
        "coverage": "Česká republika",
        "distribution": "global",
        "rating": "general",
      };
      if (process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION) {
        other["google-site-verification"] = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;
      }
      return other;
    })(),
    icons: {
      shortcut: "/FredonBytes_GraphicLogo.png",
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
        { url: "/mstile-150x150.png", sizes: "150x150", type: "image/png" },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
      languages,
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
