import type { Metadata } from "next";
import { getPricingSchemas } from "@/lib/jsonLd/pricing";
import { getPricingMetadata } from "@/lib/metadata/pricing";
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
  return getPricingMetadata(locale);
}

// ISR configuration - revalidate every 7 days
export const revalidate = 604800;

export default async function PricingPage({ params }: PricingPageProps) {
  const { locale } = await params;

  // Get all JSON-LD schemas for the pricing page
  const schemas = await getPricingSchemas(locale);

  return (
    <>
      {/* Consolidated JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <PricingClient locale={locale} />
    </>
  );
}
