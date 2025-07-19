'use client'

import { motion } from 'framer-motion'
import { Code, Zap, Globe, Database, Server, Cpu, Terminal, Cloud, Smartphone, Monitor } from 'lucide-react'
import React from 'react'

export default function AnimatedBackground() {
  // Development-themed floating icons
  const floatingIcons = [
    { Icon: Code, position: { top: '10%', left: '5%' }, color: 'text-blue-500', delay: 0 },
    { Icon: Zap, position: { top: '20%', right: '10%' }, color: 'text-purple-500', delay: 1 },
    { Icon: Globe, position: { bottom: '30%', left: '8%' }, color: 'text-cyan-500', delay: 2 },
    { Icon: Database, position: { top: '40%', right: '5%' }, color: 'text-green-500', delay: 3 },
    { Icon: Server, position: { bottom: '15%', right: '15%' }, color: 'text-orange-500', delay: 0.5 },
    { Icon: Cpu, position: { top: '60%', left: '12%' }, color: 'text-pink-500', delay: 1.5 },
    { Icon: Terminal, position: { top: '80%', right: '8%' }, color: 'text-indigo-500', delay: 2.5 },
    { Icon: Cloud, position: { top: '15%', left: '40%' }, color: 'text-teal-500', delay: 0.8 },
    { Icon: Smartphone, position: { bottom: '60%', right: '40%' }, color: 'text-red-500', delay: 1.8 },
    { Icon: Monitor, position: { bottom: '45%', left: '35%' }, color: 'text-violet-500', delay: 2.3 },
  ]

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, 0, -5, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 60,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.6, 0.3],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" />
      
      {/* Large animated gradient blobs */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        variants={pulseVariants}
        animate="animate"
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10"
        variants={pulseVariants}
        animate="animate"
        transition={{ delay: 0.5 }}
      />

      {/* Additional moving gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-green-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"
        variants={orbitVariants}
        animate="animate"
        style={{ transformOrigin: '200px 200px' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-15"
        variants={orbitVariants}
        animate="animate"
        transition={{ delay: 30 }}
        style={{ transformOrigin: '-150px -150px' }}
      />

      {/* Floating development icons */}
      {floatingIcons.map((item, index) => {
        const { Icon, position, color, delay } = item
        return (
          <motion.div
            key={index}
            className={`absolute ${color} opacity-[0.08] dark:opacity-[0.12]`}
            style={position}
            variants={floatingVariants}
            animate="animate"
            transition={{ delay }}
          >
            <Icon className="w-6 h-6 md:w-8 md:h-8" />
          </motion.div>
        )
      })}

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Animated code-like particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 12 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 dark:bg-blue-300 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Subtle geometric shapes */}
      <motion.div
        className="absolute top-1/3 left-1/6 w-16 h-16 border border-blue-200 dark:border-blue-800 opacity-20"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/6 w-12 h-12 border border-purple-200 dark:border-purple-800 opacity-20 rounded-full"
        animate={{
          rotate: [360, 180, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}