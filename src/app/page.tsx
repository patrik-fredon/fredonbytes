import dynamic from 'next/dynamic'

import AboutSection from './components/homepage/AboutSection'
import HeroSection from './components/homepage/HeroSection'
import ServicesSection from './components/homepage/ServicesSection'

// Dynamic imports for below-the-fold sections
const ProjectsSection = dynamic(
  () => import('./components/homepage/ProjectsSection'),
  { 
    loading: () => (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-slate-700/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
);

const PricingSection = dynamic(
  () => import('./components/homepage/PricingSection'),
  { 
    loading: () => (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-slate-700/50 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }
);

const ContactSection = dynamic(
  () => import('./components/homepage/ContactSection'),
  { 
    loading: () => (
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-slate-700/50 rounded w-1/3 mx-auto"></div>
            <div className="h-96 bg-slate-700/50 rounded-lg"></div>
          </div>
        </div>
      </section>
    )
  }
);

export default function Home() {
  return (
    <div className="min-h-screen relative z-10">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <PricingSection />
      <ContactSection />
    </div>
  )
}
