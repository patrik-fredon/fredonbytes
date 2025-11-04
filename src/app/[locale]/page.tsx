import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import {
  AboutSectionSkeleton,
  PricingSectionSkeleton,
  ServicesSectionSkeleton,
} from "../../components/homepage/HomepageSkeletons";

// Hero section - client-only for optimal animation performance
const HeroSection = dynamic(
  () => import("../../components/homepage/HeroSection"),
  {

    loading: () => (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </section>
    ),
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
