import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import { PricingSectionSkeleton } from "../../components/homepage/HomepageSkeletons";
import FAQSection from "../../components/homepage/FAQSection";
import AboutSection from "../../components/homepage/AboutSection";
import ServicesSection from "../../components/homepage/ServicesSection";
import { getHomeMetadata } from "@/lib/metadata/home";
import { getHomeSchemas } from "@/lib/jsonLd/home";

// Hero section - client-only for optimal animation performance
const HeroSection = dynamic(
  () => import("../../components/homepage/HeroSection"),
  {
    loading: () => (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 " />
      </section>
    ),
  },
);

const PricingSection = dynamic(
  () => import("../../components/homepage/PricingSection"),
  {
    ssr: true,
    loading: () => <PricingSectionSkeleton />,
  },
);

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ category?: string }>;
};

// Enhanced metadata for homepage with Czech market optimization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return getHomeMetadata(locale);
}

// ISR configuration for homepage - revalidate every 24 hours
export const revalidate = 86400; // 24 hours

export default async function Home({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;

  // Enable static rendering
  setRequestLocale(locale);

  // Get all JSON-LD schemas for the home page
  const schemas = await getHomeSchemas(locale);

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

      <div className="min-h-screen relative z-10">
        <HeroSection />
        <ServicesSection locale={locale} category={category} />
        <AboutSection locale={locale} showTeam={false} />
        <PricingSection />
        <FAQSection locale={locale} />
      </div>
    </>
  );
}
