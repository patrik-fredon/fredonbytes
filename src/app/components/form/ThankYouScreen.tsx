'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { useReducedMotion } from '@/app/hooks/useReducedMotion'

import { Button } from '../common/Button'

interface ThankYouScreenProps {
  onRedirect?: () => void
}

/**
 * ThankYouScreen component for the customer satisfaction form.
 * Displays success message with countdown timer and auto-redirect to homepage.
 * 
 * @param onRedirect - Optional callback function for manual redirect (defaults to router.push('/'))
 */
export default function ThankYouScreen({ onRedirect }: ThankYouScreenProps) {
  const router = useRouter()
  const prefersReducedMotion = useReducedMotion()
  const [countdown, setCountdown] = useState(10)

  // Countdown timer and auto-redirect
  useEffect(() => {
    // Decrement countdown every second
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Countdown complete - trigger redirect
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

    // Cleanup interval on unmount
    return () => clearInterval(timer)
  }, [router, onRedirect])

  // Handle manual redirect
  const handleManualRedirect = () => {
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

      {/* Countdown Timer */}
      <div className="pt-6">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Redirecting to homepage in{' '}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {countdown}
          </span>{' '}
          {countdown === 1 ? 'second' : 'seconds'}...
        </p>

        {/* Manual Redirect Button */}
        <Button
          onClick={handleManualRedirect}
          variant="gradient"
          size="lg"
          className="min-w-[200px] min-h-[44px]"
          aria-label="Return to homepage now"
        >
          Return to Homepage
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
