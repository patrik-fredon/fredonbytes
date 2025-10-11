'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { Button } from '../common/Button'

interface WelcomeScreenProps {
  onNext: () => void
}

/**
 * WelcomeScreen component for the customer satisfaction form.
 * Displays the FredonBytes logo, welcome message, and start button.
 * 
 * @param onNext - Callback function to proceed to the first question
 */
export default function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-8"
    >
      {/* FredonBytes Logo */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <Image
          src="/FredonBytes_GraphicLogo.png"
          alt="FredonBytes Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Welcome Message */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
          Welcome to Our Customer Satisfaction Survey
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Thank you for taking the time to share your feedback with us. Your insights help us improve our services and better serve you.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Estimated time: 3-5 minutes
          </span>
        </p>
      </div>

      {/* Start Button */}
      <div className="pt-4">
        <Button
          onClick={onNext}
          variant="gradient"
          size="lg"
          className="min-w-[200px] min-h-[44px]"
          aria-label="Start the customer satisfaction survey"
        >
          Start Survey
        </Button>
      </div>

      {/* Privacy Note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
        Your responses are confidential and will be used solely to improve our services.
      </p>
    </motion.div>
  )
}
