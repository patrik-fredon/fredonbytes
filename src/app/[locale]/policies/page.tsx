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
  const pageUrl = `${baseUrl}${localePrefix}/policies`;

  const titles = {
    cs: "Zásady ochrany osobních údajů | Fredonbytes",
    en: "Privacy Policy | Fredonbytes",
    de: "Datenschutzrichtlinie | Fredonbytes",
  };

  const descriptions = {
    cs: "Zjistěte, jak Fredonbytes shromažďuje, používá a chrání vaše osobní údaje. Informace o vašich právech a ochraně soukromí.",
    en: "Learn how Fredonbytes collects, uses, and protects your personal information. Information about your data rights and privacy protection.",
    de: "Erfahren Sie, wie Fredonbytes Ihre persönlichen Daten sammelt, verwendet und schützt. Informationen über Ihre Datenrechte und Datenschutz.",
  };

  const keywords = {
    cs: "zásady ochrany osobních údajů, privacy policy, ochrana soukromí, osobní údaje, práva uživatelů, Fredonbytes privacy",
    en: "privacy policy, data protection, personal information, user rights, data privacy, Fredonbytes privacy",
    de: "Datenschutzrichtlinie, Datenschutz, persönliche Informationen, Nutzerrechte, Datenschutz, Fredonbytes Datenschutz",
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
        cs: `${baseUrl}/cs/policies`,
        en: `${baseUrl}/en/policies`,
        de: `${baseUrl}/de/policies`,
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
          alt: "FredonBytes Privacy Policy",
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

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;

  const Content = (await import(`./page.${locale}.mdx`)).default;

  const titles = {
    cs: "Zásady ochrany osobních údajů",
    en: "Privacy Policy",
    de: "Datenschutzrichtlinie",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${localePrefix}/policies#webpage`,
    url: `${baseUrl}${localePrefix}/policies`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    about: {
      "@type": "Thing",
      name: "Privacy Policy",
      description: "Data privacy and personal information protection policy",
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
        item: `${baseUrl}${localePrefix}/policies`,
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
