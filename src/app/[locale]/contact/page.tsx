import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import ContactClient from "./ContactClient";

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.cz";
  const pageUrl = `${siteUrl}/${locale}/contact`;

  return {
    title: t("title"),
    description: t("description"),
    keywords:
      "contact fredonbytes, get in touch, IT consultation, software development inquiry, digital transformation contact, Brno tech company, Czech Republic IT services",
    authors: [{ name: "FredonBytes Team" }],
    creator: "FredonBytes",
    publisher: "FredonBytes",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${siteUrl}/cs/contact`,
        en: `${siteUrl}/en/contact`,
        de: `${siteUrl}/de/contact`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: "FredonBytes",
      locale,
      type: "website",
      images: [
        {
          url: `${siteUrl}/fredonbytes-logo-with-background.png`,
          width: 1200,
          height: 630,
          alt: "FredonBytes - Your All-in-One Digital Army",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@FredonBytes",
      images: [`${siteUrl}/fredonbytes-logo-with-background.png`],
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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ContactClient locale={locale} />;
}
