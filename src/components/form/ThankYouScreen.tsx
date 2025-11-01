'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import CommandButton from '../dev-ui/CommandButton'

interface ThankYouScreenProps {
  onRedirect?: () => void
}

/**
 * ThankYouScreen component for the customer satisfaction form.
 * Displays success message with newsletter subscription option and 5-second countdown redirect.
 *
 * @param onRedirect - Optional callback function for manual redirect (defaults to router.push('/'))
 */
export default function ThankYouScreen({ onRedirect }: ThankYouScreenProps) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [newsletterOptin, setNewsletterOptin] = useState(false)
  const [email, setEmail] = useState('')
  const [countdown, setCountdown] = useState(5)

  // Countdown timer - redirect after 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (onRedirect) {
            onRedirect()
          } else {
            router.push('/')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, onRedirect])

  // Handle manual finish button click
  const handleFinish = () => {
    if (onRedirect) {
      onRedirect()
    } else {
      router.push('/')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: 'easeOut' }}
      className="text-center space-y-8"
    >
      {/* Terminal Success Checkmark with Glow */}
      <motion.div
        initial={{ scale: prefersReducedMotion ? 1 : 0, rotate: prefersReducedMotion ? 0 : -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={prefersReducedMotion ? { duration: 0.01 } : {
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="flex justify-center"
      >
        <CheckCircle
          className="w-24 h-24 text-code-green drop-shadow-[0_0_20px_rgba(16,185,129,0.7)]"
          strokeWidth={2}
        />
      </motion.div>

      {/* Terminal Success Message */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-mono font-bold text-white">
          $ ✓ Successfully Deployed!
        </h1>
        <p className="text-lg font-mono text-neon-cyan max-w-2xl mx-auto leading-relaxed">
          // Your feedback has been successfully submitted.
        </p>
        <p className="text-base font-mono text-terminal-muted">
          // Thank you for helping us improve our services.
        </p>
      </div>

      {/* Terminal Branding */}
      <div className="pt-4">
        <p className="text-sm font-mono font-semibold text-neon-cyan">
          — FredonBytes Team
        </p>
      </div>

      {/* Terminal Newsletter Opt-in */}
      <div className="pt-6 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group max-w-md mx-auto">
          <input
            type="checkbox"
            checked={newsletterOptin}
            onChange={(e) => setNewsletterOptin(e.target.checked)}
            className="mt-1 w-4 h-4 accent-neon-cyan border-neon-cyan/30 rounded focus:ring-2 focus:ring-neon-cyan bg-terminal-dark"
          />
          <span className="flex-1 text-sm font-mono text-terminal-muted group-hover:text-neon-cyan transition-colors duration-[180ms]">
            // Subscribe to updates and news from FredonBytes
          </span>
        </label>

        {/* Terminal Email Input */}
        {newsletterOptin && (
          <div className="max-w-md mx-auto animate-in slide-in-from-top-2 duration-200">
            <label htmlFor="newsletter-email" className="block text-sm font-mono font-medium text-neon-cyan mb-2">
              $ Email Address <span className="text-error-red">*</span>
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="$ your.email@example.com"
              required={newsletterOptin}
              className="w-full px-4 py-2 border border-neon-cyan/30 rounded-md bg-terminal-dark font-mono text-white placeholder:text-terminal-muted focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-[180ms]"
            />
            <p className="mt-1 text-xs font-mono text-terminal-muted">
              // We'll only send occasional updates. Unsubscribe anytime.
            </p>
          </div>
        )}
      </div>

      {/* Terminal Countdown and Finish */}
      <div className="pt-6 space-y-3">
        <p className="text-sm font-mono text-terminal-muted">
          // Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
        <CommandButton
          onClick={handleFinish}
          variant="purple"
          prefix="$"
          className="min-w-[200px]"
        >
          go_home
        </CommandButton>
      </div>

      {/* Terminal Contact Note */}
      <p className="text-xs font-mono text-terminal-muted max-w-md mx-auto pt-4">
        // Questions? Contact us at{' '}
        <a
          href="mailto:info@fredonbytes.cloud"
          className="text-neon-cyan hover:text-white hover:shadow-glow-cyan-subtle transition-all duration-[180ms]"
        >
          info@fredonbytes.cloud
        </a>
      </p>
    </motion.div>
  )
}
