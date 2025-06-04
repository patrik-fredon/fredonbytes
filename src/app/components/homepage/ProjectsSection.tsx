'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ExternalLink, Github } from 'lucide-react'
import { Button } from '../common/Button'

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
        ease: "easeOut"
      }
    }
  }

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Development' },
    { id: 'mobile', label: 'Mobile Apps' },
    { id: 'design', label: 'Design' },
    { id: 'marketing', label: 'Marketing' }
  ]

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Modern e-commerce solution with advanced features and seamless user experience.',
      image: '/placeholder-project-fredon.png',
      category: 'web',
      technologies: ['Next.js', 'TypeScript', 'Stripe', 'Tailwind CSS'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/fredonbytes/ecommerce',
      featured: true
    },
    {
      id: 2,
      title: 'Mobile Banking App',
      description: 'Secure and intuitive mobile banking application with biometric authentication.',
      image: '/placeholder-project-fredon.png',
      category: 'mobile',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'JWT'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/fredonbytes/banking-app',
      featured: true
    },
    {
      id: 3,
      title: 'Brand Identity Package',
      description: 'Complete visual identity design including logo, brand guidelines, and marketing materials.',
      image: '/placeholder-project-fredon.png',
      category: 'design',
      technologies: ['Adobe Creative Suite', 'Figma', 'Brand Strategy'],
      liveUrl: 'https://example.com',
      featured: false
    },
    {
      id: 4,
      title: 'SaaS Dashboard',
      description: 'Analytics dashboard for SaaS companies with real-time data visualization.',
      image: '/placeholder-project-fredon.png',
      category: 'web',
      technologies: ['React', 'D3.js', 'Node.js', 'PostgreSQL'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/fredonbytes/saas-dashboard',
      featured: false
    },
    {
      id: 5,
      title: 'Digital Marketing Campaign',
      description: 'Comprehensive digital marketing strategy resulting in 300% ROI increase.',
      image: '/placeholder-project-fredon.png',
      category: 'marketing',
      technologies: ['Google Ads', 'Facebook Ads', 'Analytics', 'SEO'],
      liveUrl: 'https://example.com',
      featured: false
    },
    {
      id: 6,
      title: 'AI-Powered Chatbot',
      description: 'Intelligent customer service chatbot with natural language processing.',
      image: '/placeholder-project-fredon.png',
      category: 'web',
      technologies: ['Python', 'TensorFlow', 'React', 'WebSocket'],
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/fredonbytes/ai-chatbot',
      featured: true
    }
  ]

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter)

  return (
    <section id="projects" className="py-20 lg:py-24 bg-white dark:bg-slate-900">
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
              Explore our portfolio of successful projects across various industries and technologies.
              Each project represents our commitment to excellence and innovation.
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                className={`group ${project.featured ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-4">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full text-slate-900 hover:bg-blue-500 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white rounded-full text-slate-900 hover:bg-purple-500 hover:text-white transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 lg:p-12">
              <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Have a Project in Mind?
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
                Let&apos;s collaborate to bring your vision to life. 
                Our team is ready to tackle your next digital challenge.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="gradient" 
                  size="xl"
                  onClick={() => {
                    const element = document.getElementById('contact')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Start Your Project
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => window.open('https://lib.fredonbytes.cloud', '_blank')}
                  rightIcon={<ExternalLink className="w-5 h-5" />}
                >
                  View Full Portfolio
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}