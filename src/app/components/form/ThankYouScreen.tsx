'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

import { useReducedMotion } from '@/app/hooks/useReducedMotion'

import { Button } from '../common/Button'

interface ThankYouScreenProps {
  onRedirect?: () => void
}

/**
 * ThankYouScreen component for the customer satisfaction survey.
 * Displays success message with newsletter subscription option and Finish button.
 *
 * @param onRedirect - Optional callback function for manual redirect (defaults to router.push('/'))
 */
export default function ThankYouScreen({ onRedirect }: ThankYouScreenProps) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)

  // Handle finish button click
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

      {/* Newsletter Subscription */}
      <div className="pt-6">
        <label className="flex items-start gap-3 cursor-pointer group max-w-md mx-auto">
          <input
            type="checkbox"
            checked={newsletterSubscribed}
            onChange={(e) => setNewsletterSubscribed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            Subscribe to our newsletter for updates, tips, and exclusive content
          </span>
        </label>
      </div>

      {/* Finish Button */}
      <div className="pt-6">
        <Button
          onClick={handleFinish}
          variant="gradient"
          size="lg"
          className="min-w-[200px] min-h-[44px]"
          aria-label="Return to homepage"
        >
          Finish
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
