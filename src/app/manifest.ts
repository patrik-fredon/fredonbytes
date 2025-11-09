import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  return {
    name: "Fredonbytes | Komplexní IT Služby Brno, Praha, Ostrava",
    short_name: "Fredonbytes",
    description:
      "Všechny IT služby pod jednou střechou: Hosting, Vývoj, Design, Branding, Copywriting, SEO, Social Media, IT Poradenství. 24h odezva, platba jen při spokojenosti.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0E27",
    theme_color: "#00D9FF",
    orientation: "portrait-primary",
    lang: "cs",
    dir: "ltr",
    scope: "/",
    categories: [
      "business",
      "productivity",
      "technology",
      "web development",
      "design",
      "marketing",
    ],
    icons: [
      {
        src: "/FredonBytes_GraphicLogo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/FredonBytes_GraphicLogo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/FredonBytes_GraphicLogo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: `${baseUrl}/FredonBytes_GraphicLogo.png`,
        sizes: "1200x630",
        type: "image/png",
        form_factor: "wide",
      },
    ],
    shortcuts: [
      {
        name: "Kontakt",
        short_name: "Kontakt",
        description: "Kontaktujte nás pro nezávaznou konzultaci",
        url: "/contact",
        icons: [{ src: "/FredonBytes_GraphicLogo.png", sizes: "192x192" }],
      },
      {
        name: "Projekty",
        short_name: "Projekty",
        description: "Prohlédněte si naše portfolio projektů",
        url: "/projects",
        icons: [{ src: "/FredonBytes_GraphicLogo.png", sizes: "192x192" }],
      },
      {
        name: "Ceník",
        short_name: "Ceník",
        description: "Zjistěte ceny našich služeb",
        url: "/pricing",
        icons: [{ src: "/FredonBytes_GraphicLogo.png", sizes: "192x192" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
