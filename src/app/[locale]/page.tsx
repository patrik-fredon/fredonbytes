import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import {
  AboutSectionSkeleton,
  PricingSectionSkeleton,
  ServicesSectionSkeleton,
} from "../../components/homepage/HomepageSkeletons";

// Hero section with SSR for SEO but optimized animations
const HeroSection = dynamic(
  () => import("../../components/homepage/HeroSection"),
  {
    ssr: true,
  },
);

// Dynamic imports for below-the-fold sections with Suspense
const AboutSection = dynamic(
  () => import("../../components/homepage/AboutSection"),
  {
    ssr: true,
    loading: () => <AboutSectionSkeleton />,
  },
);

const ServicesSection = dynamic(
  () => import("../../components/homepage/ServicesSection"),
  {
    ssr: true,
    loading: () => <ServicesSectionSkeleton />,
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
};

export default async function Home({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <div className="min-h-screen relative z-10">
      <HeroSection />
      <ServicesSection />
      <AboutSection showTeam={false} />
      <PricingSection />
    </div>
  );
}
