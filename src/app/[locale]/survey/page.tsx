import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import FormLoadingSkeleton from "@/components/form/FormLoadingSkeleton";

// Dynamic import for SurveyLanding with loading skeleton
const SurveyLanding = dynamic(() => import("./SurveyLanding"), {
  loading: () => <FormLoadingSkeleton />,
});

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Metadata for the survey landing page
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const pageUrl = `${baseUrl}/${locale}/survey`;

  const titles = {
    cs: "Průzkum spokojenosti zákazníků | FredonBytes",
    en: "Customer Satisfaction Survey | FredonBytes",
    de: "Kundenzufriedenheitsumfrage | FredonBytes",
  };

  const descriptions = {
    cs: "Pomozte nám zlepšit naše služby sdílením vaší zpětné vazby. Vyplňte náš krátký průzkum spokojenosti zákazníků.",
    en: "Help us improve our services by sharing your feedback. Take our quick customer satisfaction survey.",
    de: "Helfen Sie uns, unsere Dienstleistungen zu verbessern, indem Sie Ihr Feedback teilen. Nehmen Sie an unserer kurzen Kundenzufriedenheitsumfrage teil.",
  };

  const keywords = {
    cs: "průzkum spokojenosti, zpětná vazba, fredonbytes survey, hodnocení služeb",
    en: "customer satisfaction survey, feedback, fredonbytes survey, service rating",
    de: "Kundenzufriedenheitsumfrage, Feedback, Fredonbytes Umfrage, Service-Bewertung",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: keywords[locale as keyof typeof keywords] || keywords.en,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/survey`,
        en: `${baseUrl}/en/survey`,
        de: `${baseUrl}/de/survey`,
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
          alt: "FredonBytes Customer Survey",
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
      index: false, // Utility page - don't index
      follow: false,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

/**
 * Survey landing page with welcome screen and Start button.
 * Generates session ID on client side when user clicks Start.
 */
export default async function SurveyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const titles = {
    cs: "Průzkum spokojenosti",
    en: "Customer Satisfaction Survey",
    de: "Kundenzufriedenheitsumfrage",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/survey#webpage`,
    url: `${baseUrl}/${locale}/survey`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
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
        name: locale === "cs" ? "Domů" : locale === "de" ? "Startseite" : "Home",
        item: `${baseUrl}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: titles[locale as keyof typeof titles] || titles.en,
        item: `${baseUrl}/${locale}/survey`,
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
      <SurveyLanding />
    </>
  );
}
