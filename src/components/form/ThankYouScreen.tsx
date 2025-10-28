'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

import { useReducedMotion } from '@/hooks/useReducedMotion'

import { Button } from '../common/Button'

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
      {/* Success Checkmark with Spring Animation */}
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
          className="w-24 h-24 text-green-500 dark:text-green-400"
          strokeWidth={2}
        />
      </motion.div>

      {/* Thank You Message */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
          Thank You!
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Your feedback has been successfully submitted. We appreciate you taking the time to help us improve our services.
        </p>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Your responses will help us serve you better.
        </p>
      </div>

      {/* FredonBytes Branding */}
      <div className="pt-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          — FredonBytes Team
        </p>
      </div>

      {/* Newsletter Opt-in */}
      <div className="pt-6 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer group max-w-md mx-auto">
          <input
            type="checkbox"
            checked={newsletterOptin}
            onChange={(e) => setNewsletterOptin(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-offset-slate-800"
          />
          <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
            I'd like to receive updates and news from FredonBytes
          </span>
        </label>

        {/* Email input (shown when newsletter is checked) */}
        {newsletterOptin && (
          <div className="max-w-md mx-auto animate-in slide-in-from-top-2 duration-200">
            <label htmlFor="newsletter-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              required={newsletterOptin}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
            />
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              We'll only use this to send you occasional updates. You can unsubscribe anytime.
            </p>
          </div>
        )}
      </div>

      {/* Countdown and Finish Button */}
      <div className="pt-6 space-y-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Redirecting to homepage in {countdown} second{countdown !== 1 ? 's' : ''}...
        </p>
        <Button
          onClick={handleFinish}
          variant="gradient"
          size="lg"
          className="min-w-[200px] min-h-[44px]"
          aria-label="Return to homepage"
        >
          Go to Homepage Now
        </Button>
      </div>

      {/* Additional Note */}
      <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto pt-4">
        If you have any questions or concerns, feel free to contact us at{' '}
        <a
          href="mailto:info@fredonbytes.cloud"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          info@fredonbytes.cloud
        </a>
      </p>
    </motion.div>
  )
}
