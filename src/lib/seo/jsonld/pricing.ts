/**
 * Pricing page JSON-LD schemas
 *
 * @see AGENTS.md Phase 4: JSON-LD Schema Implementation
 */

import { getTranslations } from "next-intl/server";
import { normalizeUrl } from "@/lib/utils/url";
import { seoConfig } from "@/lib/config/seo.config";
import { businessConfig } from "@/lib/config/business.config";

type Schema = Record<string, unknown>;

/**
 * Plan configuration for mapping
 */
interface PlanConfig {
  key: "starter" | "professional" | "enterprise";
  price: string;
  vatIncluded?: boolean;
}

/**
 * Breadcrumb configuration
 */
interface BreadcrumbConfig {
  pos: number;
  labelCs: string;
  labelEn: string;
  labelDe: string;
  path: string;
}

// Plan configuration array
const PLAN_CONFIGS: PlanConfig[] = [
  { key: "starter", price: "Od 15 000" },
  { key: "professional", price: "Od 35 000" },
  { key: "enterprise", price: "0", vatIncluded: true },
];

// Breadcrumb configuration array
const BREADCRUMB_CONFIG: BreadcrumbConfig[] = [
  { pos: 1, labelCs: "Domů", labelEn: "Home", labelDe: "Startseite", path: "" },
  { pos: 2, labelCs: "Ceník", labelEn: "Pricing", labelDe: "Preise", path: "/pricing" },
];

/**
 * Generate all JSON-LD schemas for the pricing page
 * Returns an array of schema objects for consolidated rendering
 */
export async function getPricingSchemas(locale: string): Promise<Schema[]> {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const baseUrl = seoConfig.baseUrl;

  // Offers/Products schema - map over plan configs
  const offersSchema: Schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PLAN_CONFIGS.map(({ key, price, vatIncluded }) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Product",
        name: t(`plans.${key}.name`),
        description: t(`plans.${key}.description`),
      },
      priceCurrency: "CZK",
      priceSpecification: {
        "@type": "PriceSpecification",
        price,
        priceCurrency: "CZK",
        ...(vatIncluded && { valueAddedTaxIncluded: true }),
      },
      seller: {
        "@type": "Organization",
        name: businessConfig.company.displayName,
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
    itemListElement: BREADCRUMB_CONFIG.map(
      ({ pos, labelCs, labelEn, labelDe, path }) => ({
        "@type": "ListItem",
        position: pos,
        name: locale === "cs" ? labelCs : locale === "de" ? labelDe : labelEn,
        item: normalizeUrl(`${baseUrl}/${locale}${path}`),
      }),
    ),
  };

  return [offersSchema, breadcrumbSchema];
}
