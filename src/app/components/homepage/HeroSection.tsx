'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../common/Button'
import { ArrowRight, Code, Zap, Globe } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HeroSection() {
  const [typedText, setTypedText] = useState('')
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const codeSnippets = [
    'const success = await buildAmazingWebsite();',
    'function createDigitalDominance() { return "Fredonbytes"; }',
    'const innovation = () => code + creativity + strategy;',
    'export default class Fredonbytes extends Excellence {}',
  ]

  useEffect(() => {
    const currentLine = codeSnippets[currentLineIndex]
    const typingSpeed = isDeleting ? 50 : 100
    const pauseTime = isDeleting ? 1000 : 2000

    const timer = setTimeout(() => {
      if (!isDeleting && charIndex < currentLine.length) {
        setTypedText(currentLine.substring(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      } else if (isDeleting && charIndex > 0) {
        setTypedText(currentLine.substring(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      } else if (!isDeleting && charIndex === currentLine.length) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false)
        setCurrentLineIndex((prev) => (prev + 1) % codeSnippets.length)
      }
    }, typingSpeed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, currentLineIndex, codeSnippets])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

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

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <motion.div
        className="absolute top-20 left-10 text-blue-500 opacity-20"
        variants={floatingVariants}
        animate="animate"
      >
        <Code className="w-8 h-8" />
      </motion.div>
      <motion.div
        className="absolute top-40 right-20 text-purple-500 opacity-20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 1 }}
      >
        <Zap className="w-6 h-6" />
      </motion.div>
      <motion.div
        className="absolute bottom-40 left-20 text-cyan-500 opacity-20"
        variants={floatingVariants}
        animate="animate"
        transition={{ delay: 2 }}
      >
        <Globe className="w-7 h-7" />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Code Editor Mockup */}
          <motion.div
            variants={itemVariants}
            className="mb-8 mx-auto max-w-2xl"
          >
            <div className="bg-slate-900 rounded-lg shadow-2xl p-4 text-left">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 text-xs ml-4">fredonbytes.ts</span>
              </div>
              <div className="text-green-400 font-mono text-sm">
                <span className="text-gray-500">1</span>
                <span className="ml-4 text-blue-400">{'//'} </span>
                <span className="text-gray-400">Creating digital excellence...</span>
              </div>
              <div className="text-green-400 font-mono text-sm mt-1">
                <span className="text-gray-500">2</span>
                <span className="ml-4">{typedText}</span>
                <span className="animate-pulse">|</span>
              </div>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Your All-in-One
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              IT Powerhouse
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            From <strong>code to clicks</strong>, we deliver complete digital dominance. 
            Eliminate complexity and supercharge your brand&apos;s potential with our unified IT solutions.
          </motion.p>

          {/* Value Proposition */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-6 mb-10"
          >
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Code className="w-5 h-5 text-blue-500" />
              <span className="font-medium">Development</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="font-medium">Design</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
              <Globe className="w-5 h-5 text-cyan-500" />
              <span className="font-medium">Marketing</span>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Button
              variant="gradient"
              size="xl"
              onClick={() => scrollToSection('contact')}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Project
            </Button>
            <Button
              variant="outline"
              size="xl"
              onClick={() => scrollToSection('projects')}
            >
              View Our Work
            </Button>
          </motion.div>

          {/* Company Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                2023
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Founded
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                5+
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Core Services
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-1">
                100%
              </div>
              <div className="text-slate-600 dark:text-slate-400 text-sm">
                Client Focus
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 dark:bg-slate-500 rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}