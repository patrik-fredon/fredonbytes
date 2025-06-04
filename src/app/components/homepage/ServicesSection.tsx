'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '../common/Button'
import { 
  Code, 
  Palette, 
  Search, 
  Share2, 
  Shield, 
  ArrowRight,
  CheckCircle,
  Zap,
  Globe,
  Smartphone
} from 'lucide-react'

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
      title: "Software Development",
      description: "Custom web applications, mobile apps, and enterprise solutions built with cutting-edge technologies.",
      features: ["Full-Stack Development", "Mobile Applications", "API Integration", "Cloud Solutions"],
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: Palette,
      title: "Graphic & UX/UI Design",
      description: "Stunning visual identities, user interfaces, and brand experiences that captivate and convert.",
      features: ["Brand Identity", "UX/UI Design", "Prototyping", "Design Systems"],
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: Search,
      title: "SEO & Digital Marketing",
      description: "Data-driven strategies to boost your online visibility and drive targeted traffic to your business.",
      features: ["Search Engine Optimization", "Content Strategy", "Analytics & Reporting", "PPC Campaigns"],
      color: "from-green-500 to-emerald-500",
      iconBg: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: Share2,
      title: "Social Media Management",
      description: "Engaging content creation and strategic social media campaigns that build communities and drive growth.",
      features: ["Content Creation", "Community Management", "Social Media Ads", "Growth Strategies"],
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600 dark:text-orange-400"
    },
    {
      icon: Shield,
      title: "IT Consulting & Cybersecurity",
      description: "Strategic technology guidance and robust security solutions to protect and optimize your digital infrastructure.",
      features: ["Security Audits", "Infrastructure Planning", "Technology Consulting", "Risk Assessment"],
      color: "from-slate-500 to-slate-700",
      iconBg: "bg-slate-100 dark:bg-slate-900/20",
      iconColor: "text-slate-600 dark:text-slate-400"
    }
  ]

  const stats = [
    { number: "100%", label: "Client Satisfaction", icon: CheckCircle },
    { number: "5+", label: "Core Services", icon: Zap },
    { number: "24/7", label: "Support Available", icon: Globe },
    { number: "1", label: "Unified Team", icon: Smartphone }
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
              We offer a comprehensive suite of IT solutions designed to eliminate the need for multiple vendors. 
              From development to marketing, we&apos;ve got you covered.
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-xl ${service.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                        {service.description}
                      </p>
                      
                      <ul className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center space-x-2 text-sm text-slate-700 dark:text-slate-300">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Why Choose Us */}
          <motion.div variants={itemVariants} className="mb-16">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 lg:p-12 text-white">
              <div className="text-center mb-8">
                <h3 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Fredonbytes?</h3>
                <p className="text-xl opacity-90 max-w-3xl mx-auto">
                  We&apos;re not just another IT company. We&apos;re your unified digital army, delivering seamless solutions under one roof.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                      <div className="text-white/80">{stat.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Let&apos;s discuss how our unified approach can streamline your IT needs and accelerate your business growth.
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
                Start Your Project
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => {
                  const element = document.getElementById('pricing')
                  if (element) element.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                View Pricing
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}