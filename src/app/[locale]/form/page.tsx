import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import FormLanding from "./FormLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

// No caching for utility page
export const revalidate = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const pageUrl = `${baseUrl}/${locale}/form`;

  const titles = {
    cs: "Kontaktní formulář | Fredonbytes",
    en: "Contact Form | Fredonbytes",
    de: "Kontaktformular | Fredonbytes",
  };

  const descriptions = {
    cs: "Vyplňte náš kontaktní formulář a my se vám ozveme co nejdříve. Sdělte nám o svém projektu a my vám pomůžeme ho realizovat.",
    en: "Fill out our contact form and we'll get back to you as soon as possible. Tell us about your project and we'll help you make it happen.",
    de: "Füllen Sie unser Kontaktformular aus und wir melden uns so schnell wie möglich bei Ihnen. Erzählen Sie uns von Ihrem Projekt und wir helfen Ihnen bei der Umsetzung.",
  };

  const keywords = {
    cs: "kontaktní formulář, fredonbytes kontakt, objednávka webu, poptávka IT služby, kontakt Brno",
    en: "contact form, fredonbytes contact, website order, IT services inquiry, contact Brno",
    de: "Kontaktformular, Fredonbytes Kontakt, Website-Bestellung, IT-Service-Anfrage, Kontakt Brno",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: keywords[locale as keyof typeof keywords] || keywords.en,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/form`,
        en: `${baseUrl}/en/form`,
        de: `${baseUrl}/de/form`,
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
          alt: "Fredonbytes Contact Form",
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
      follow: true,
    },
  };
}

/**
 * Form landing page with IT-themed animations and Start button.
 * Displays animated welcome screen before user begins the form.
 */
export default async function FormPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const titles = {
    cs: "Kontaktní formulář",
    en: "Contact Form",
    de: "Kontaktformular",
  };

  // WebPage schema for SEO
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/form#webpage`,
    url: `${baseUrl}/${locale}/form`,
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
        item: `${baseUrl}/${locale}/form`,
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
      <FormLanding />
    </>
  );
}
