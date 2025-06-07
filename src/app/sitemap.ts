import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.cloud";

  // Define supported locales
  const locales = ["en", "cs", "de"];

  // Define all pages that should be in the sitemap
  const routes = [
    "",
    "/links",
    "/privacy-policy",
    "/terms-of-service",
    "/cookie-policy",
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  // Generate URLs for each route and locale combination
  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemap.push({
        url: `${baseUrl}${locale === "en" ? "" : `/${locale}`}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
        alternates: {
          languages: locales.reduce((acc, lang) => {
            acc[lang] = `${baseUrl}${lang === "en" ? "" : `/${lang}`}${route}`;
            return acc;
          }, {} as Record<string, string>),
        },
      });
    });
  });

  return sitemap;
}
