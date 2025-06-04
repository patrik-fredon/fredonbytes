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
