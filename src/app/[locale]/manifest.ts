import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";

/**
 * Dynamic PWA manifest generation per locale
 *
 * Generates localized Progressive Web App manifest for each locale (cs, en, de).
 * Provides translated app names and descriptions for better UX in different languages.
 *
 * PWA Features:
 * - Standalone display mode (app-like experience)
 * - Custom theme colors matching brand
 * - Maskable icons for adaptive display
 * - Proper categorization for app stores
 * - Multi-resolution icons (192x192, 512x512)
 *
 * @param {Promise<{locale: string}>} params - Route params with locale
 * @returns {Promise<MetadataRoute.Manifest>} Localized manifest configuration
 */

interface ManifestProps {
  params: Promise<{ locale: string }>;
}

export default async function manifest({
  params,
}: ManifestProps): Promise<MetadataRoute.Manifest> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "manifest" });

  return {
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),
    start_url: `/${locale}`,
    scope: "/",
    lang: locale,
    dir: "ltr", // Left-to-right text direction
    display: "standalone", // App-like display without browser UI
    orientation: "portrait-primary", // Default orientation
    theme_color: "#0f172a", // Dark slate theme (matches brand)
    background_color: "#f8fafc", // Light slate background
    categories: ["business", "productivity", "utilities", "developer-tools", "development", "technology", "hosting", "software"], // Relevant app categories
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any", // Supports both maskable and standard display
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    // Optional: Add screenshots for richer app store listings
    screenshots: [
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
  };
}
