import { headers } from "next/headers";

import { type Locale, defaultLocale, locales, getTranslations } from "./i18n";

/**
 * Server-side locale detection utilities
 * Handles SSR/SSG locale detection without client-side APIs
 */

interface LanguageQuality {
  locale: string;
  quality: number;
}

export async function getServerLocale(): Promise<Locale> {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get("accept-language") ?? "";

    // Parse accept-language header
    const languages: LanguageQuality[] = acceptLanguage
      .split(",")
      .map((lang: string) => {
        const [locale, q = "1"] = lang.trim().split(";q=");
        return {
          locale: locale.split("-")[0].toLowerCase(),
          quality: parseFloat(q),
        };
      })
      .sort((a: LanguageQuality, b: LanguageQuality) => b.quality - a.quality);

    // Find first supported locale
    for (const { locale } of languages) {
      if (locales.includes(locale as Locale)) {
        return locale as Locale;
      }
    }
  } catch (error) {
    // Headers not available (static generation) or other error
    console.warn("Could not determine server locale, using default:", error);
  }

  return defaultLocale;
}

export async function getServerTranslations(locale?: Locale) {
  const detectedLocale = locale || (await getServerLocale());
  return getTranslations(detectedLocale);
}

export function generateI18nMetadata(locale: Locale) {
  const translations = getTranslations(locale);

  return {
    metadataBase: new URL("https://fredonbytes.cloud"),
    // Helper to get translation with fallback
    t: (key: string) => {
      const keys = key.split(".");
      let result: unknown = translations;

      for (const k of keys) {
        result = (result as Record<string, unknown>)?.[k];
      }

      return typeof result === "string" ? result : key;
    },
  };
}
