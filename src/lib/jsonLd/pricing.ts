import { getTranslations } from "next-intl/server";

type Schema = Record<string, unknown>;

/**
 * Generate all JSON-LD schemas for the pricing page
 * Returns an array of schema objects for consolidated rendering
 */
export async function getPricingSchemas(locale: string): Promise<Schema[]> {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  // Offers/Products schema
  const offersSchema: Schema = {
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

  // Breadcrumb schema
  const breadcrumbSchema: Schema = {
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

  return [offersSchema, breadcrumbSchema];
}
