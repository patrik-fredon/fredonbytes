'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, Award, Target, Heart } from 'lucide-react'

export default function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
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

  const values = [
    {
      icon: Award,
      title: "Unified Excellence",
      description: "One team, infinite solutions.",
      color: "text-blue-500"
    },
    {
      icon: Users,
      title: "Client-Centric Agility",
      description: "Your goals drive our tech.",
      color: "text-purple-500"
    },
    {
      icon: Target,
      title: "Innovation Without Compromise",
      description: "Bold ideas, flawless execution.",
      color: "text-cyan-500"
    },
    {
      icon: Heart,
      title: "Transparency & Trust",
      description: "No black boxes, just results.",
      color: "text-pink-500"
    }
  ]

  const teamMembers = [
    {
      name: "Bc. Patrik \"Fredon\" Svoboda BSc.",
      role: "CEO & Founder",
      expertise: "Full-Stack Development, Digital Strategy",
      quote: "Efficiency is the new innovation.",
      image: "/profile-picture-fredon-ceo-co-founder.jpg"
    },
    {
      name: "Ing. Jana Nováková",
      role: "CTO",
      expertise: "AI, Cloud Architecture", 
      quote: "If it's not scalable, it's not sustainable.",
      image: "/placeholder-project-fredon.png"
    },
    {
      name: "Lucie Dvořáková",
      role: "Creative Director",
      expertise: "Branding, UX/UI Design",
      quote: "Pixel-perfect isn't a goal—it's the baseline.",
      image: "/placeholder-project-fredon.png"
    },
    {
      name: "Tomáš Horák",
      role: "SEO & Metadata Specialist",
      expertise: "Data Analytics, SEM",
      quote: "Visibility without strategy is just noise.",
      image: "/placeholder-project-fredon.png"
    }
  ]

  return (
    <section id="about" className="py-20 lg:py-24 bg-white dark:bg-slate-900">
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
              About <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Fredonbytes</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Founded in <strong>2023</strong>, we eliminate the need for multiple vendors by becoming your 
              <strong className="text-blue-600 dark:text-blue-400"> one-stop digital army</strong>, 
              ensuring seamless, high-impact results under one roof.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;To empower businesses with unified, cutting-edge IT solutions—delivering speed, creativity, and relentless efficiency.&rdquo;
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic">
                &ldquo;A world where brands thrive digitally without fragmentation—Fredonbytes as the global standard for integrated tech excellence.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Core Values */}
          <motion.div variants={itemVariants} className="mb-20">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
              Our Core Values
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="text-center group"
                  >
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center ${value.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {value.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">
                        {value.description}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Company Motto */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl lg:text-4xl font-bold mb-4">Code. Create. Conquer.</h3>
              <p className="text-xl opacity-90">Our Motto</p>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-12">
              Meet Our Team
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
                >
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-white text-center mb-1">
                    {member.name}
                  </h4>
                  <p className="text-blue-600 dark:text-blue-400 text-sm text-center mb-2 font-medium">
                    {member.role}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs text-center mb-3">
                    {member.expertise}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300 text-xs text-center italic">
                    &ldquo;{member.quote}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Founder Quote */}
          <motion.div variants={itemVariants} className="mt-20">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 lg:p-12 text-center">
              <blockquote className="text-2xl lg:text-3xl font-medium text-slate-900 dark:text-white mb-6 leading-relaxed">
                &ldquo;In a fragmented digital world, we are the glue—merging creativity, technology, and strategy into one unstoppable force.&rdquo;
              </blockquote>
              <cite className="text-slate-600 dark:text-slate-400 text-lg">
                — Bc. Patrik &ldquo;Fredon&rdquo; Svoboda BSc., CEO & Founder
              </cite>
            </div>
          </motion.div>

          {/* Company Mantra */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                One Team. Zero Limits.
              </span>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}