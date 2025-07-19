'use client'

import { motion } from 'framer-motion'
import { MapPin, Mail, Phone } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

export default function ProfileHeader() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center mb-12"
    >
      {/* Profile Image */}
      <motion.div variants={itemVariants} className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse"></div>
        <div className="relative w-full h-full bg-white dark:bg-slate-800 rounded-full p-1">
          <Image
            src="/FredonBytes_GraphicLogo.png"
            alt="Fredonbytes Logo"
            fill
            className="object-contain rounded-full p-4"
            priority
          />
        </div>
      </motion.div>

      {/* Name & Title */}
      <motion.h1
        variants={itemVariants}
        className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-2"
      >
        Fredonbytes
      </motion.h1>
      
      <motion.p
        variants={itemVariants}
        className="text-lg text-slate-600 dark:text-slate-300 mb-4"
      >
        Your All-in-One IT Powerhouse
      </motion.p>

      {/* Short Description */}
      <motion.p
        variants={itemVariants}
        className="text-slate-700 dark:text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed"
      >
        From code to clicks, we deliver complete digital dominance. 
        Full-spectrum IT solutions combining cutting-edge development, 
        striking design, and strategic marketing—all under one roof.
      </motion.p>

      {/* Company Info */}
      <motion.div
        variants={itemVariants}
        className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 dark:text-slate-400"
      >
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>Brno, Czech Republic</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-purple-500" />
          <a 
            href="tel:+420799027984" 
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            +420 799 027 984
          </a>
        </div>
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-cyan-500" />
          <a 
            href="mailto:info@fredonbytes.cloud" 
            className="hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            info@fredonbytes.cloud
          </a>
        </div>
      </motion.div>

      {/* Motto */}
      <motion.div
        variants={itemVariants}
        className="mt-8 text-center"
      >
        <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Code. Create. Conquer.
        </p>
      </motion.div>
    </motion.div>
  )
}