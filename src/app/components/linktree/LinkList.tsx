'use client'

import { motion } from 'framer-motion'
import React from 'react'

import LinkCard from '../common/LinkCard'

export default function LinkList() {
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const mainLinks = [
    {
      title: 'Personal Portfolio',
      description: 'Explore my personal projects, skills, and professional journey',
      url: 'https://me.fredonbytes.cloud',
      icon: 'portfolio'
    },
    {
      title: 'Project Gallery',
      description: 'Browse through our comprehensive collection of completed projects',
      url: 'https://lib.fredonbytes.cloud',
      icon: 'gallery'
    },
    {
      title: 'Technical Support Portal',
      description: 'Get help, documentation, and technical support for our services',
      url: 'https://tech.fredonbytes.cloud',
      icon: 'support'
    }
  ]

  const githubLinks = [
    {
      title: 'FredonBytes Organization',
      description: 'Official company repositories and open-source projects',
      url: 'https://github.com/FredonBytes',
      icon: 'github',
      stats: {
        repos: 12,
        commits: 847,
        stars: 156
      }
    },
    {
      title: 'Patrik Fredon Personal',
      description: 'Personal coding projects and experimental repositories',
      url: 'https://github.com/patrik-fredon',
      icon: 'github',
      stats: {
        repos: 28,
        commits: 1243,
        stars: 89
      }
    }
  ]

  const companyLinks = [
    {
      title: 'Main Website',
      description: 'Return to our main company website',
      url: '/',
      icon: 'website',
      external: false
    }
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Main Platforms */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Our Platforms
        </h2>
        <div className="space-y-4">
          {mainLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={true}
            />
          ))}
        </div>
      </motion.div>

      {/* GitHub Repositories */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          GitHub Repositories
        </h2>
        <div className="space-y-4">
          {githubLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={true}
              stats={link.stats}
            />
          ))}
        </div>
      </motion.div>

      {/* Company Links */}
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
          Company
        </h2>
        <div className="space-y-4">
          {companyLinks.map((link, index) => (
            <LinkCard
              key={index}
              title={link.title}
              description={link.description}
              url={link.url}
              icon={link.icon}
              external={link.external}
            />
          ))}
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div variants={itemVariants} className="text-center pt-8 pb-4">
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Fredonbytes • Brno, Czech Republic • Founded 2023
        </p>
        <p className="text-slate-500 dark:text-slate-500 text-xs mt-2">
          One Team. Zero Limits.
        </p>
      </motion.div>
    </motion.div>
  )
}