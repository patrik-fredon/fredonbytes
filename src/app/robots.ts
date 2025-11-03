import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/admin/", "/form/", "/survey/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cloud"}/sitemap.xml`,
  };
}
