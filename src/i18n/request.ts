// Locale configuration for next-intl
import { getRequestConfig } from "next-intl/server";

import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as "en" | "cs" | "de")) {
    locale = routing.defaultLocale;
  }

  // Dynamic import of modular translations
  // Webpack will automatically code-split the translation chunks
  // for better performance and smaller initial bundle size
  return {
    locale,
    messages: (await import(`../messages/${locale}.ts`)).default,
    timeZone: "Europe/Prague",
    now: new Date(),
  };
});
