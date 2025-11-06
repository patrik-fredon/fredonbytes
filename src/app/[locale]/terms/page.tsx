import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 604800; // 7 days

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const pageUrl = `${baseUrl}${localePrefix}/terms`;

  const titles = {
    cs: "Obchodní podmínky | Fredonbytes",
    en: "Terms of Service | Fredonbytes",
    de: "Allgemeine Geschäftsbedingungen | Fredonbytes",
  };

  const descriptions = {
    cs: "Obchodní podmínky pro používání IT služeb a softwarových řešení Fredonbytes. Podmínky spolupráce, práva a povinnosti.",
    en: "Terms and conditions for using Fredonbytes IT services and software development solutions. Cooperation terms, rights and obligations.",
    de: "Allgemeine Geschäftsbedingungen für die Nutzung von Fredonbytes IT-Dienstleistungen und Softwarelösungen. Zusammenarbeitsbedingungen, Rechte und Pflichten.",
  };

  const keywords = {
    cs: "obchodní podmínky, terms of service, podmínky spolupráce, práva uživatelů, Fredonbytes podmínky, IT služby podmínky",
    en: "terms of service, business terms, cooperation conditions, user rights, Fredonbytes terms, IT services terms",
    de: "Geschäftsbedingungen, Nutzungsbedingungen, Zusammenarbeitsbedingungen, Nutzerrechte, Fredonbytes Bedingungen",
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
        cs: `${baseUrl}/cs/terms`,
        en: `${baseUrl}/en/terms`,
        de: `${baseUrl}/de/terms`,
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
          alt: "FredonBytes Terms of Service",
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

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;

  const Content = (await import(`./page.${locale}.mdx`)).default;

  const titles = {
    cs: "Obchodní podmínky",
    en: "Terms of Service",
    de: "Allgemeine Geschäftsbedingungen",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${localePrefix}/terms#webpage`,
    url: `${baseUrl}${localePrefix}/terms`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    about: {
      "@type": "Thing",
      name: "Terms of Service",
      description: "Legal terms and conditions for service usage",
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
        item: `${baseUrl}${localePrefix}/terms`,
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

      <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <Content />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
