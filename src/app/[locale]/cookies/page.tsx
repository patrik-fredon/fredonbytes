import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = 86400; // 1 day

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const pageUrl = `${baseUrl}${localePrefix}/cookies`;

  const titles = {
    cs: "Zásady používání cookies | Fredonbytes",
    en: "Cookie Policy | Fredonbytes",
    de: "Cookie-Richtlinie | Fredonbytes",
  };

  const descriptions = {
    cs: "Zjistěte, jak Fredonbytes používá cookies a podobné technologie ke zlepšení vašeho prohlížení. Informace o souborech cookie, jejich použití a vašich právech.",
    en: "Learn about how Fredonbytes uses cookies and similar technologies to enhance your browsing experience. Information about cookies, their use and your rights.",
    de: "Erfahren Sie, wie Fredonbytes Cookies und ähnliche Technologien verwendet, um Ihr Browsing-Erlebnis zu verbessern. Informationen über Cookies, deren Verwendung und Ihre Rechte.",
  };

  const keywords = {
    cs: "cookies, zásady cookies, cookie policy, soubory cookie, sledovací cookies, analyticke cookies, Fredonbytes cookies",
    en: "cookies, cookie policy, tracking cookies, analytics cookies, cookie consent, Fredonbytes cookies",
    de: "Cookies, Cookie-Richtlinie, Tracking-Cookies, Analyse-Cookies, Cookie-Zustimmung, Fredonbytes Cookies",
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
        cs: `${baseUrl}/cookies`,
        en: `${baseUrl}/en/cookies`,
        de: `${baseUrl}/de/cookies`,
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
          alt: "Fredonbytes Cookie Policy",
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

export default async function CookiePolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;

  const Content = (await import(`./page.${locale}.mdx`)).default;

  const titles = {
    cs: "Zásady používání cookies",
    en: "Cookie Policy",
    de: "Cookie-Richtlinie",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}${localePrefix}/cookies#webpage`,
    url: `${baseUrl}${localePrefix}/cookies`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    about: {
      "@type": "Thing",
      name: "Cookie Policy",
      description: "Cookie usage and consent policy information",
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
        item: `${baseUrl}${localePrefix}/cookies`,
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
