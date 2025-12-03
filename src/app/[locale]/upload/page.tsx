import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import UploadLanding from "./UploadLanding";

type Props = {
  params: Promise<{ locale: string }>;
};

export const revalidate = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const pageUrl = `${baseUrl}/${locale}/upload`;

  const titles = {
    cs: "Nahrání souborů | Fredonbytes",
    en: "File Upload | Fredonbytes",
    de: "Datei-Upload | Fredonbytes",
  };

  const descriptions = {
    cs: "Nahrajte soubory ke svému projektu. Bezpečné sdílení dokumentů a obrázků.",
    en: "Upload files to your project. Secure document and image sharing.",
    de: "Laden Sie Dateien zu Ihrem Projekt hoch. Sicheres Teilen von Dokumenten und Bildern.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/upload`,
        en: `${baseUrl}/en/upload`,
        de: `${baseUrl}/de/upload`,
      },
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function UploadPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const titles = {
    cs: "Nahrání souborů",
    en: "File Upload",
    de: "Datei-Upload",
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/${locale}/upload#webpage`,
    url: `${baseUrl}/${locale}/upload`,
    name: titles[locale as keyof typeof titles] || titles.en,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      name: "Fredonbytes",
    },
    inLanguage: locale,
  };

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
        item: `${baseUrl}/${locale}/upload`,
      },
    ],
  };

  return (
    <>
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
      <UploadLanding />
    </>
  );
}
