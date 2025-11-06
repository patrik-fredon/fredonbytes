import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import GridBackground from "@/components/dev-ui/GridBackground";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string }>;
};

import ProjectsGrid from "./ProjectsGrid";
import ProjectsLoadingSkeleton from "./ProjectsLoadingSkeleton";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const pageUrl = `${baseUrl}${localePrefix}/projects`;

  return {
    title: `${t("title")} | FredonBytes`,
    description: t("subtitle"),
    keywords:
      locale === "cs"
        ? "portfolio, projekty Fredonbytes, webové aplikace, reference, IT projekty Brno, realizované weby, software projekty ČR"
        : "portfolio, Fredonbytes projects, web applications, references, IT projects Brno, realized websites, software projects",
    authors: [{ name: "FredonBytes Team" }],
    creator: "FredonBytes",
    publisher: "FredonBytes",
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/projects`,
        en: `${baseUrl}/en/projects`,
        de: `${baseUrl}/de/projects`,
      },
    },
    openGraph: {
      title: `${t("title")} | FredonBytes`,
      description: t("subtitle"),
      url: pageUrl,
      siteName: "FredonBytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          width: 1200,
          height: 630,
          alt: "FredonBytes Projects Portfolio",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${t("title")} | FredonBytes`,
      description: t("subtitle"),
      creator: "@FredonBytes",
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;

  // CollectionPage schema for SEO
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${baseUrl}${localePrefix}/projects#collectionpage`,
    url: `${baseUrl}${localePrefix}/projects`,
    name: t("title"),
    description: t("subtitle"),
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
  };

  // BreadcrumbList schema for navigation hierarchy
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "cs" ? "Domů" : locale === "de" ? "Startseite" : "Home",
        item: `${baseUrl}${localePrefix}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("title"),
        item: `${baseUrl}${localePrefix}/projects`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <div className="min-h-screen relative">
        {/* Grid Background */}
        <div className="absolute inset-0">
          <GridBackground />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 relative z-10">
          {/* Page Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-mono text-terminal-light">
              <span className="text-neon-cyan">//</span> {t("title")}
            </h1>
            <p className="text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          {/* Projects Grid with Suspense */}
          <Suspense fallback={<ProjectsLoadingSkeleton />}>
            <ProjectsGrid />
          </Suspense>
        </div>
      </div>
    </>
  );
}
