'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import CommandButton from '../dev-ui/CommandButton'

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
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: 'easeOut' }}
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
          quality={85}
          sizes="128px"
        />
      </div>

      {/* Terminal Welcome Message */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-mono font-bold text-white">
          $ Customer Satisfaction Survey
        </h1>
        <p className="text-lg font-mono text-neon-cyan max-w-2xl mx-auto leading-relaxed">
          // Thank you for sharing your feedback with us.
        </p>
        <p className="text-base font-mono text-terminal-muted max-w-2xl mx-auto">
          // Your insights help us improve and better serve you.
        </p>
        <p className="text-sm font-mono text-terminal-muted">
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            // Estimated time: 3-5 minutes
          </span>
        </p>
      </div>

      {/* Terminal Start Command */}
      <div className="pt-4">
        <CommandButton
          onClick={onNext}
          variant="cyan"
          prefix="$"
          className="min-w-[200px]"
        >
          start_survey
        </CommandButton>
      </div>

      {/* Terminal Privacy Note */}
      <p className="text-xs font-mono text-terminal-muted max-w-md mx-auto">
        // Your responses are confidential and used solely to improve our services.
      </p>
    </motion.div>
  )
}
