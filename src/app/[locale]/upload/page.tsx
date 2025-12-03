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
    cs: "Nahrát soubory | Fredonbytes",
    en: "Upload Files | Fredonbytes",
    de: "Dateien hochladen | Fredonbytes",
  };

  const descriptions = {
    cs: "Nahrajte soubory ke svému projektu. Bezpečný přenos souborů pro klienty Fredonbytes.",
    en: "Upload files to your project. Secure file transfer for Fredonbytes clients.",
    de: "Laden Sie Dateien zu Ihrem Projekt hoch. Sichere Dateiübertragung für Fredonbytes-Kunden.",
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
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: pageUrl,
      siteName: "FredonBytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    robots: {
      index: false,
      follow: false,
      noarchive: true,
    },
  };
}

export default async function UploadPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const titles = {
    cs: "Nahrát soubory",
    en: "Upload Files",
    de: "Dateien hochladen",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <UploadLanding />
    </>
  );
}
