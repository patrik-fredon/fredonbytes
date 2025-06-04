import HeroSection from './components/homepage/HeroSection'
import AboutSection from './components/homepage/AboutSection'
import ServicesSection from './components/homepage/ServicesSection'
import ProjectsSection from './components/homepage/ProjectsSection'
import PricingSection from './components/homepage/PricingSection'
import ContactSection from './components/homepage/ContactSection'

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
