import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

export const revalidate = 604800; // 7 days - regulatory content

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const pageUrl = `${baseUrl}${localePrefix}/gdpr`;

  const titles = {
    cs: "GDPR | Fredonbytes",
    en: "GDPR Compliance | Fredonbytes",
    de: "DSGVO-Konformität | Fredonbytes",
  };

  const descriptions = {
    cs: "GDPR compliance a ochrana osobních údajů Fredonbytes. Informace o zpracování osobních údajů, právech uživatelů a dodržování GDPR v ČR.",
    en: "GDPR compliance and personal data protection at Fredonbytes. Information about personal data processing, user rights, and GDPR compliance.",
    de: "DSGVO-Konformität und Datenschutz bei Fredonbytes. Informationen über die Verarbeitung personenbezogener Daten, Nutzerrechte und DSGVO-Compliance.",
  };

  const keywords = {
    cs: "GDPR, ochrana osobních údajů, zpracování dat, práva uživatelů, compliance ČR, GDPR Česká republika, osobní údaje",
    en: "GDPR, personal data protection, data processing, user rights, compliance, GDPR Czech Republic, personal data",
    de: "DSGVO, Datenschutz, Datenverarbeitung, Nutzerrechte, Compliance, DSGVO Tschechien, personenbezogene Daten",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: keywords[locale as keyof typeof keywords] || keywords.en,
    authors: [{ name: "FredonBytes Legal Team" }],
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/gdpr`,
        en: `${baseUrl}/en/gdpr`,
        de: `${baseUrl}/de/gdpr`,
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
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          secureUrl: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          width: 1200,
          height: 630,
          alt: "FredonBytes GDPR Compliance",
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
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function GDPRPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;

  const Content = (await import(`./page.${locale}.mdx`)).default;

  const titles = {
    cs: "GDPR",
    en: "GDPR Compliance",
    de: "DSGVO-Konformität",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${localePrefix}/gdpr#webpage`,
    url: `${baseUrl}${localePrefix}/gdpr`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    about: {
      "@type": "Thing",
      name: "GDPR Compliance",
      description: "General Data Protection Regulation compliance information",
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
        name: locale === "cs" ? "Domů" : locale === "de" ? "Startseite" : "Home",
        item: `${baseUrl}${localePrefix}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titles[locale as keyof typeof titles] || titles.en,
        item: `${baseUrl}${localePrefix}/gdpr`,
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

      <main className="min-h-screen">
        <article className="prose prose-lg dark:prose-invert max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Content />
        </article>
      </main>
    </>
  );
}
