import HeroSection from './components/homepage/HeroSection'
import AboutSection from './components/homepage/AboutSection'

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <AboutSection />
      
      {/* Placeholder sections for future implementation */}
      <section id="services" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Our Services</h2>
          <p className="text-slate-600 dark:text-slate-300">Coming soon...</p>
        </div>
      </section>
      
      <section id="projects" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Project Showcase</h2>
          <p className="text-slate-600 dark:text-slate-300">Coming soon...</p>
        </div>
      </section>
      
      <section id="pricing" className="py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Pricing</h2>
          <p className="text-slate-600 dark:text-slate-300">Coming soon...</p>
        </div>
      </section>
      
      <section id="contact" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Contact Us</h2>
          <p className="text-slate-600 dark:text-slate-300">Coming soon...</p>
        </div>
      </section>
    </div>
  )
}
