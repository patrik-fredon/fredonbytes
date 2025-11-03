import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fredonbytes - Your All-in-One IT Powerhouse",
    short_name: "Fredonbytes",
    description:
      "From code to clicks, we deliver complete digital dominance. Full-spectrum IT solutions including software development, graphic design, SEO, and social media marketing.",
    start_url: "/",
    scope: "/",
    lang: "en",
    dir: "ltr",
    display: "standalone",
    orientation: "portrait-primary",
    theme_color: "#0f172a",
    background_color: "#f8fafc",
    categories: ["business", "productivity", "utilities", "developer-tools"],
    icons: [
      {
        src: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
