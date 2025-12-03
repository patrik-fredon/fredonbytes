import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import GridBackground from "@/components/dev-ui/GridBackground";

type Props = {
  params: Promise<{ locale: string }>;
};

// ISR configuration - revalidate every 24 hours
export const revalidate = 86400;

// Dynamic imports for Framer Motion components
const ProfileHeader = dynamic(
  () => import("@/components/linktree/ProfileHeader"),
  {
    loading: () => (
      <div className="text-center mb-12">
        <div className="w-32 h-32 mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        <div className="h-8 w-48 mx-auto mb-2 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-6 w-64 mx-auto mb-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-20 max-w-2xl mx-auto mb-6 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>
    ),
  },
);

const LinkList = dynamic(() => import("@/components/linktree/LinkList"), {
  loading: () => (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    </div>
  ),
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const pageUrl = `${baseUrl}/${locale}/links`;

  const titles = {
    cs: "Odkazy | Fredonbytes",
    en: "Links | Fredonbytes",
    de: "Links | Fredonbytes",
  };

  const descriptions = {
    cs: "Všechny důležité odkazy pro Fredonbytes - Your All-in-One IT Powerhouse. Portfolio, galerie, support portál a sociální média.",
    en: "All important links for Fredonbytes - Your All-in-One IT Powerhouse. Find our portfolio, gallery, support portal, and social media.",
    de: "Alle wichtigen Links für Fredonbytes - Ihr All-in-One-IT-Kraftpaket. Portfolio, Galerie, Support-Portal und soziale Medien.",
  };

  const keywords = {
    cs: "fredonbytes odkazy, linktree, portfolio odkazy, sociální média fredonbytes, kontaktní odkazy",
    en: "fredonbytes links, linktree, portfolio links, fredonbytes social media, contact links",
    de: "Fredonbytes Links, Linktree, Portfolio-Links, Fredonbytes soziale Medien, Kontaktlinks",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: keywords[locale as keyof typeof keywords] || keywords.en,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/links`,
        en: `${baseUrl}/en/links`,
        de: `${baseUrl}/de/links`,
      },
    },
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: pageUrl,
      siteName: "FredonBytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          secureUrl: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "Fredonbytes Links",
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      creator: "@FredonBytes",
      images: [`${baseUrl}/og-image.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LinksPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.eu";

  const titles = {
    cs: "Odkazy",
    en: "Links",
    de: "Links",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/links#webpage`,
    url: `${baseUrl}/${locale}/links`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    about: {
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      name: "Fredonbytes",
    },
    inLanguage: locale,
  };

  // BreadcrumbList schema for navigation hierarchy
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name:
          locale === "cs" ? "Domů" : locale === "de" ? "Startseite" : "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titles[locale as keyof typeof titles] || titles.en,
        item: `${baseUrl}/${locale}/links`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="min-h-screen bg-terminal-dark relative">
        {/* Grid Background */}
        <div className="absolute inset-0">
          <GridBackground />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <ProfileHeader />
          <LinkList />
        </div>
      </div>
    </>
  );
}
