'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { 
  ExternalLink, 
  Github, 
  Filter,
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  ArrowRight
} from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

import { Link } from '@/i18n/navigation'

import { Button } from '../common/Button'


interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured: boolean
}

export default function ProjectsSection() {
  const [activeFilter, setActiveFilter] = useState('all')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  }

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  }

  const projects: Project[] = [
    {
      id: 1,
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with advanced inventory management, payment processing, and analytics dashboard.",
      image: "/placeholder-project-fredon.png",
      category: "web",
      technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/FredonBytes/example",
      featured: true
    },
    {
      id: 2,
      title: "Brand Identity System",
      description: "Complete visual identity and brand guidelines for a tech startup, including logo, color palette, and marketing materials.",
      image: "/placeholder-project-fredon.png",
      category: "design",
      technologies: ["Figma", "Adobe Creative Suite", "Brand Strategy"],
      liveUrl: "https://example.com",
      featured: true
    },
    {
      id: 3,
      title: "Mobile Fitness App",
      description: "Cross-platform fitness tracking application with social features, workout plans, and progress analytics.",
      image: "/placeholder-project-fredon.png",
      category: "mobile",
      technologies: ["React Native", "Firebase", "Node.js", "MongoDB"],
      githubUrl: "https://github.com/FredonBytes/fitness-app",
      featured: true
    },
    {
      id: 4,
      title: "SEO Campaign Results",
      description: "Comprehensive SEO strategy that increased organic traffic by 300% and improved search rankings for 50+ keywords.",
      image: "/placeholder-project-fredon.png",
      category: "marketing",
      technologies: ["Google Analytics", "SEMrush", "Content Strategy", "Technical SEO"],
      featured: false
    },
    {
      id: 5,
      title: "Enterprise Dashboard",
      description: "Real-time analytics dashboard for enterprise clients with custom reporting and data visualization capabilities.",
      image: "/placeholder-project-fredon.png",
      category: "web",
      technologies: ["React", "D3.js", "Node.js", "Redis"],
      liveUrl: "https://example.com",
      githubUrl: "https://github.com/FredonBytes/dashboard",
      featured: false
    },
    {
      id: 6,
      title: "Social Media Strategy",
      description: "Complete social media overhaul resulting in 500% increase in engagement and 10x follower growth.",
      image: "/placeholder-project-fredon.png",
      category: "marketing",
      technologies: ["Content Creation", "Instagram", "LinkedIn", "Analytics"],
      featured: false
    }
  ]

  const categories = [
    { id: 'all', label: 'All Projects', icon: Filter },
    { id: 'web', label: 'Web Development', icon: Code },
    { id: 'mobile', label: 'Mobile Apps', icon: Smartphone },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'marketing', label: 'Marketing', icon: Globe }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  const getTechIcon = (tech: string) => {
    if (tech.includes('js') || tech.includes('React') || tech.includes('Next')) return <Code className="w-4 h-4" />
    if (tech.includes('Figma') || tech.includes('Adobe')) return <Palette className="w-4 h-4" />
    if (tech.includes('SQL') || tech.includes('MongoDB') || tech.includes('Firebase')) return <Database className="w-4 h-4" />
    return <Globe className="w-4 h-4" />
  }

  return (
    <section id="projects" className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Project <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Showcase</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of successful projects across web development, mobile applications, 
              design, and digital marketing campaigns.
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    activeFilter === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              )
            })}
          </motion.div>

          {/* Projects Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={filterVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                      quality={80}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {project.featured && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    
                    {/* Overlay with Links */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
                        >
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 bg-white dark:bg-slate-700 px-2 py-1 rounded-md text-xs text-slate-700 dark:text-slate-300"
                        >
                          {getTechIcon(tech)}
                          <span>{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 lg:p-12">
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Ready to Start Your Project?
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Let&apos;s bring your vision to life with our expertise in development, design, and digital marketing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="gradient"
                  size="xl"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => {
                    const element = document.getElementById('contact')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Get Started
                </Button>
                <Link href="/projects">
                  <Button variant="outline" size="xl">
                    View All Projects
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}