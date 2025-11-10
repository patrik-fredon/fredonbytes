import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing"; // ← Ujistěte se, že tento import existuje
import { domainConfig } from "@/lib/domain-config";

// Helper function to get actual last modified dates
async function getLastModified(route: string, locale: string): Promise<Date> {
  try {
    // Pro statické stránky - zkuste získat skutečné datum modifikace
    if (route === "") {
      // Homepage - použijte datum buildu
      return new Date();
    }

    // Pro služby - můžete mít specifická data
    if (route.startsWith("/services/")) {
      // Zde můžete načíst datum z CMS nebo použít fixní datum aktualizace služeb
      return new Date("2025-11-10"); // Případně dynamicky načíst
    }

    // Fallback na aktuální datum
    return new Date();
  } catch {
    return new Date();
  }
}

// Define route configuration for better maintainability
const routeConfig = [
  { path: "", priority: 1.0, changeFrequency: "daily" as const },
  { path: "/about", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/cookies", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/links", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/policies", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/terms", priority: 0.4, changeFrequency: "yearly" as const },
  { path: "/gdpr", priority: 0.4, changeFrequency: "yearly" as const },
  {
    path: "/services/hosting",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/services/branding",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/services/consulting",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  { path: "/services/seo", priority: 0.9, changeFrequency: "weekly" as const },
  {
    path: "/services/social-media",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/services/development",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
  {
    path: "/services/design",
    priority: 0.9,
    changeFrequency: "weekly" as const,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = domainConfig.siteUrl;
  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const route of routeConfig) {
      const url = `${baseUrl}/${locale}${route.path}`;

      sitemapEntries.push({
        url,
        lastModified: await getLastModified(route.path, locale),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((altLocale) => [
              altLocale,
              `${baseUrl}/${altLocale}${route.path}`,
            ]),
          ),
        },
        images: [
          `${baseUrl}/og-image-${locale}.jpg`,
          `${baseUrl}/screenshot-desktop.png`,
        ],
      });
    }
  }

  return sitemapEntries;
}
