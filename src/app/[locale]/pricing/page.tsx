import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import PricingClient from "./PricingClient";

interface PricingPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({
  params,
}: PricingPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  const metaT = await getTranslations({ locale, namespace: "meta.pricing" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}/pricing`;

  return {
    title: metaT("title"),
    description: metaT("description"),
    keywords: metaT("keywords"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: `${baseUrl}/pricing`,
        en: `${baseUrl}/en/pricing`,
        de: `${baseUrl}/de/pricing`,
      },
    },
    openGraph: {
      title: metaT("title"),
      description: metaT("description"),
      type: "website",
      url: canonicalUrl,
      siteName: "Fredonbytes",
    },
    twitter: {
      card: "summary_large_image",
      title: metaT("title"),
      description: metaT("description"),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// ISR configuration - revalidate every 7 days
export const revalidate = 604800;

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  // JSON-LD Schema for Offers/Products
  const offersSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: t("plans.starter.name"),
          description: t("plans.starter.description"),
        },
        priceCurrency: "CZK",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "Od 15 000",
          priceCurrency: "CZK",
        },
        seller: {
          "@type": "Organization",
          name: "Fredonbytes",
          url: baseUrl,
        },
        availability: "https://schema.org/InStock",
        validFrom: "2024-01-01",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: t("plans.professional.name"),
          description: t("plans.professional.description"),
        },
        priceCurrency: "CZK",
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "Od 35 000",
          priceCurrency: "CZK",
        },
        seller: {
          "@type": "Organization",
          name: "Fredonbytes",
          url: baseUrl,
        },
        availability: "https://schema.org/InStock",
        validFrom: "2024-01-01",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: t("plans.enterprise.name"),
          description: t("plans.enterprise.description"),
        },
        price: "0",
        priceCurrency: "CZK",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "CZK",
          valueAddedTaxIncluded: true,
        },
        seller: {
          "@type": "Organization",
          name: "Fredonbytes",
          url: baseUrl,
        },
        availability: "https://schema.org/InStock",
        validFrom: "2024-01-01",
      },
    ],
  };

  // Breadcrumb schema for pricing page
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "cs" ? "Domů" : "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "cs" ? "Ceník" : "Pricing",
        item: `${baseUrl}${locale === "cs" ? "" : `/${locale}`}/pricing`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data for Pricing */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(offersSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <PricingClient locale={locale} />
    </>
  );
}
