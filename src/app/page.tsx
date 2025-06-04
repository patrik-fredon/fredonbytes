import HeroSection from './components/homepage/HeroSection'
import AboutSection from './components/homepage/AboutSection'
import ServicesSection from './components/homepage/ServicesSection'
import ProjectsSection from './components/homepage/ProjectsSection'
import ContactSection from './components/homepage/ContactSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      
      {/* Placeholder for Pricing section - will be implemented next */}
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300">Interactive pricing calculator coming soon...</p>
        </div>
      </section>
      
      <ContactSection />
    </div>
  )
}
