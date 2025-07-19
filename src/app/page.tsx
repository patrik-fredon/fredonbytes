import AboutSection from './components/homepage/AboutSection'
import ContactSection from './components/homepage/ContactSection'
import HeroSection from './components/homepage/HeroSection'
import PricingSection from './components/homepage/PricingSection'
import ProjectsSection from './components/homepage/ProjectsSection'
import ServicesSection from './components/homepage/ServicesSection'

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
