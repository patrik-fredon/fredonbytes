import { getTranslations } from "next-intl/server";
import { normalizeUrl } from "@/lib/utils/url";

type Schema = Record<string, unknown>;

/**
 * Plan configuration for mapping
 */
interface PlanConfig {
  key: "starter" | "professional" | "enterprise";
  priceCZK: number;
  vatIncluded?: boolean;
}

/**
 * Breadcrumb configuration
 */
interface BreadcrumbConfig {
  pos: number;
  labelCs: string;
  labelEn: string;
  path: string;
}

// Plan configuration array
const PLAN_CONFIGS: PlanConfig[] = [
  { key: "starter", priceCZK: 15000 },
  { key: "professional", priceCZK: 35000 },
  { key: "enterprise", priceCZK: 0, vatIncluded: true },
];

// Breadcrumb configuration array
const BREADCRUMB_CONFIG: BreadcrumbConfig[] = [
  { pos: 1, labelCs: "Domů", labelEn: "Home", path: "" },
  { pos: 2, labelCs: "Ceník", labelEn: "Pricing", path: "/pricing" },
];

/**
 * Generate all JSON-LD schemas for the pricing page
 * Returns an array of schema objects for consolidated rendering
 */
export async function getPricingSchemas(locale: string): Promise<Schema[]> {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  // Offers/Products schema - map over plan configs
  const offersSchema: Schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PLAN_CONFIGS.map(({ key, priceCZK, vatIncluded }) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: t(`plans.${key}.name`),
        description: t(`plans.${key}.description`),
      },
      priceCurrency: "CZK",
      priceSpecification: {
        "@type": "PriceSpecification",
        price: priceCZK,
        priceCurrency: "CZK",
        ...(vatIncluded && { valueAddedTaxIncluded: true }),
      },
      price: priceCZK,
      seller: {
        "@type": "Organization",
        name: "Fredonbytes",
        url: baseUrl,
      },
      availability: "https://schema.org/InStock",
      validFrom: "2024-01-01",
    })),
  };

  // Breadcrumb schema - map over breadcrumb configs
  const breadcrumbSchema: Schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: BREADCRUMB_CONFIG.map(({ pos, labelCs, labelEn, path }) => ({
      "@type": "ListItem",
      position: pos,
      name: locale === "cs" ? labelCs : labelEn,
      item: normalizeUrl(`${baseUrl}${locale === "cs" ? "" : `/${locale}`}${path}`),
    })),
  };

  return [offersSchema, breadcrumbSchema];
}
