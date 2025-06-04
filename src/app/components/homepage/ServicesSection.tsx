'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Code, Palette, Search, Share2, Shield, Zap } from 'lucide-react'
import { Button } from '../common/Button'

export default function ServicesSection() {
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

  const services = [
    {
      icon: Code,
      title: 'Software Development',
      description: 'Custom web applications, mobile apps, and enterprise solutions built with cutting-edge technologies.',
      features: ['Full-Stack Development', 'Mobile Applications', 'API Development', 'Database Design'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Palette,
      title: 'Graphic & UX/UI Design',
      description: 'Stunning visual identities, user interfaces, and brand experiences that captivate and convert.',
      features: ['Brand Identity', 'UI/UX Design', 'Logo Design', 'Prototyping'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Search,
      title: 'SEO & Digital Marketing',
      description: 'Data-driven strategies to boost your online visibility and drive targeted traffic to your business.',
      features: ['Search Optimization', 'Content Strategy', 'PPC Campaigns', 'Analytics'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Share2,
      title: 'Social Media Management',
      description: 'Engaging content strategies and community management to build your brand presence across platforms.',
      features: ['Content Creation', 'Community Management', 'Social Ads', 'Growth Strategies'],
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Shield,
      title: 'IT Consulting & Cybersecurity',
      description: 'Strategic technology guidance and robust security solutions to protect and optimize your digital assets.',
      features: ['Security Audits', 'IT Strategy', 'Risk Assessment', 'Compliance'],
      color: 'from-slate-500 to-gray-600'
    },
    {
      icon: Zap,
      title: 'Performance Optimization',
      description: 'Speed up your digital presence with advanced optimization techniques and monitoring solutions.',
      features: ['Website Speed', 'SEO Optimization', 'User Experience', 'Monitoring'],
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <section id="services" className="py-20 lg:py-24 bg-slate-50 dark:bg-slate-800">
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
              Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              From <strong>software development</strong> to <strong>digital marketing</strong>, 
              we provide comprehensive IT solutions that eliminate the need for multiple vendors.
            </p>
          </motion.div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="group"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-slate-200 dark:border-slate-700">
                    {/* Icon */}
                    <div className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-3 flex-shrink-0`}></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Call to Action */}
          <motion.div variants={itemVariants} className="text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Ready to Transform Your Digital Presence?
              </h3>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Let&apos;s discuss how our unified approach can streamline your technology needs 
                and accelerate your business growth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  variant="secondary" 
                  size="xl"
                  onClick={() => {
                    const element = document.getElementById('contact')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Get Free Consultation
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  onClick={() => {
                    const element = document.getElementById('projects')
                    if (element) element.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  View Our Work
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div variants={itemVariants} className="mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">5+</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Core Services</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">100%</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Client Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">24/7</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Support Available</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2">2023</div>
                <div className="text-slate-600 dark:text-slate-400 text-sm">Year Founded</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}