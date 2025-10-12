import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server';

import HeroSection from '../components/homepage/HeroSection'
import { 
  AboutSectionSkeleton,
  ServicesSectionSkeleton,
  ProjectsSectionSkeleton, 
  PricingSectionSkeleton, 
  ContactSectionSkeleton 
} from '../components/homepage/HomepageSkeletons'

// Dynamic imports for below-the-fold sections with Suspense
const AboutSection = dynamic(
  () => import('../components/homepage/AboutSection'),
  {
    ssr: true,
    loading: () => <AboutSectionSkeleton />
  }
);

const ServicesSection = dynamic(
  () => import('../components/homepage/ServicesSection'),
  {
    ssr: true,
    loading: () => <ServicesSectionSkeleton />
  }
);

const ProjectsSection = dynamic(
  () => import('../components/homepage/ProjectsSection'),
  {
    ssr: true,
    loading: () => <ProjectsSectionSkeleton />
  }
);

const PricingSection = dynamic(
  () => import('../components/homepage/PricingSection'),
  {
    ssr: true,
    loading: () => <PricingSectionSkeleton />
  }
);

const ContactSection = dynamic(
  () => import('../components/homepage/ContactSection'),
  {
    ssr: true,
    loading: () => <ContactSectionSkeleton />
  }
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
      <AboutSection />
      <ServicesSection />
      
      {/* Suspense boundaries for below-the-fold sections */}
      <Suspense fallback={<ProjectsSectionSkeleton />}>
        <ProjectsSection />
      </Suspense>
      
      <Suspense fallback={<PricingSectionSkeleton />}>
        <PricingSection />
      </Suspense>
      
      <Suspense fallback={<ContactSectionSkeleton />}>
        <ContactSection />
      </Suspense>
    </div>
  )
}
