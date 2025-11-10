import type { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

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
 * @param {Promise<{locale: string}>} params - Route params with locale (optional, defaults to 'cs')
 * @returns {Promise<MetadataRoute.Manifest>} Localized manifest configuration
 */

interface ManifestProps {
  params?: Promise<{ locale?: string }>;
}

/**
 * Generate static params for all supported locales
 * This enables Next.js to prerender the manifest for each locale at build time
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

export default async function manifest({
  params,
}: ManifestProps = {}): Promise<MetadataRoute.Manifest> {
  // Use default locale if params are not provided (during prerendering)
  const locale = params ? (await params).locale || routing.defaultLocale : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "manifest" });

  return {
    name: t("name"),
    short_name: t("shortName"),
    description: t("description"),
    start_url: `/${locale}`,
    scope: "/",
    lang: locale,
    display: "standalone",
    display_override: ['window-controls-overlay'],
    background_color: "#0A0E27",
    theme_color: "#00D9FF",
    orientation: "portrait-primary",
    dir: "ltr",
    categories: [
      "business",
      "productivity",
      "technology",
      "web development",
      "design",
      "marketing",
      "utilities", "developer-tools", "development", "hosting", "software"
    ],
    icons: [
      {
        src: '/favicon.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        src: '/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },

      // Apple Touch Icons
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/og-image.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },

      // Android/Chrome Icons
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },

      // Windows Metro Icons
      {
        src: '/mstile-70x70.png',
        sizes: '70x70',
        type: 'image/png',
      },
      {
        src: '/mstile-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/mstile-150x150.png',
        sizes: '150x150',
        type: 'image/png',
      },
      {
        src: '/mstile-310x150.png',
        sizes: '310x150',
        type: 'image/png',
      },
      {
        src: '/mstile-310x310.png',
        sizes: '310x310',
        type: 'image/png',
      },

      // Additional sizes for comprehensive coverage
      {
        src: '/pwa-64x64.png',
        sizes: '64x64',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-256x256.png',
        sizes: '256x256',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: "/FredonBytes_GraphicLogo.png",
        sizes: "any",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-72x72.png",
        sizes: "72x72",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-96x96.png",
        sizes: "96x96",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-128x128.png",
        sizes: "128x128",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-144x144.png",
        sizes: "144x144",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-152x152.png",
        sizes: "152x152",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-384x384.png",
        sizes: "384x384",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: `/placeholder-project-fredon.png`,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
        label: t('screenshots.desktop'),
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: t('screenshots.mobile'),
      },

    ],
    shortcuts: [
      {
        name: "Kontakt",
        short_name: "Kontakt",
        description: "Kontaktujte nás pro nezávaznou konzultaci",
        url: "/contact",
        icons: [{ src: "/og-image.jpg", sizes: "192x192" }],
      },
      {
        name: "Projekty",
        short_name: "Projekty",
        description: "Prohlédněte si naše portfolio projektů",
        url: "/projects",
        icons: [{ src: "/og-image.jpg", sizes: "192x192" }],
      },
      {
        name: "Ceník",
        short_name: "Ceník",
        description: "Zjistěte ceny našich služeb",
        url: "/pricing",
        icons: [{ src: "/og-image.jpg", sizes: "192x192" }],
      },
    ],

    related_applications: [],
    prefer_related_applications: false,
  };
}
