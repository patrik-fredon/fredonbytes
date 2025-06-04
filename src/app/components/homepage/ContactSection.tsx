'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../common/Button'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Building,
  MessageSquare,
  Shield
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const contactSchema = z.object({
  // Step 1: Basic Info
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  
  // Step 2: Project Details
  company: z.string().optional(),
  projectType: z.string().min(1, 'Please select a project type'),
  budget: z.string().min(1, 'Please select a budget range'),
  timeline: z.string().min(1, 'Please select a timeline'),
  
  // Step 3: Requirements
  message: z.string().min(10, 'Please provide more details about your project'),
  requirements: z.array(z.string()).optional(),
  newsletter: z.boolean().optional(),
  privacy: z.boolean().refine(val => val === true, 'You must accept the privacy policy')
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactSection() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onChange'
  })

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

  const projectTypes = [
    'Website Development',
    'Mobile App Development',
    'E-commerce Platform',
    'Brand Design & Identity',
    'SEO & Digital Marketing',
    'Social Media Management',
    'IT Consulting',
    'Custom Software',
    'Other'
  ]

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000 - $100,000',
    'Over $100,000',
    'Not sure yet'
  ]

  const timelines = [
    'ASAP (Rush project)',
    '1-2 months',
    '3-6 months',
    '6-12 months',
    'More than 12 months',
    'Flexible timeline'
  ]

  const requirements = [
    'Responsive Design',
    'E-commerce Functionality',
    'Content Management',
    'User Authentication',
    'Payment Integration',
    'Analytics & Reporting',
    'Third-party Integrations',
    'Multi-language Support'
  ]

  const nextStep = async () => {
    let fieldsToValidate: (keyof ContactFormData)[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone']
    } else if (currentStep === 2) {
      fieldsToValidate = ['projectType', 'budget', 'timeline']
    }
    
    const isStepValid = await trigger(fieldsToValidate)
    if (isStepValid && currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    
    try {
      // Here you would integrate with Resend API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error('Failed to submit form')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      // Handle error (show notification, etc.)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Thank You!
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Your message has been sent successfully. We&apos;ll get back to you within 24 hours.
            </p>
            <Button
              variant="gradient"
              onClick={() => {
                setIsSubmitted(false)
                setCurrentStep(1)
              }}
            >
              Send Another Message
            </Button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              Let&apos;s Work <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Together</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Ready to transform your digital presence? Let&apos;s discuss your project and create something amazing together.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Email</h4>
                      <a 
                        href="mailto:info@fredonbytes.cloud" 
                        className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        info@fredonbytes.cloud
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Phone</h4>
                      <a 
                        href="tel:+420799027984" 
                        className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        +420 799 027 984
                      </a>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Location</h4>
                      <p className="text-slate-600 dark:text-slate-400">Brno, Czech Republic</p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Response Time</h4>
                      <p className="text-slate-600 dark:text-slate-400">Within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">Secure & Confidential</h4>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Your information is encrypted and protected. We respect your privacy and will never share your details with third parties.
                </p>
              </div>
            </motion.div>

            {/* Multi-step Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Step {currentStep} of 3
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {Math.round((currentStep / 3) * 100)}% Complete
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <User className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Basic Information</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            First Name *
                          </label>
                          <input
                            {...register('firstName')}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            placeholder="John"
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Last Name *
                          </label>
                          <input
                            {...register('lastName')}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            placeholder="Doe"
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder="john@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number *
                        </label>
                        <input
                          {...register('phone')}
                          type="tel"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder="+420 123 456 789"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                        )}
                      </div>

                      <Button
                        type="button"
                        variant="gradient"
                        size="lg"
                        className="w-full"
                        onClick={nextStep}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continue
                      </Button>
                    </motion.div>
                  )}

                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <Building className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Details</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Company (Optional)
                        </label>
                        <input
                          {...register('company')}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder="Your Company Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Project Type *
                        </label>
                        <select
                          {...register('projectType')}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="">Select a project type</option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                        {errors.projectType && (
                          <p className="mt-1 text-sm text-red-600">{errors.projectType.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Budget Range *
                          </label>
                          <select
                            {...register('budget')}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="">Select budget</option>
                            {budgetRanges.map((range) => (
                              <option key={range} value={range}>{range}</option>
                            ))}
                          </select>
                          {errors.budget && (
                            <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Timeline *
                          </label>
                          <select
                            {...register('timeline')}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="">Select timeline</option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline}>{timeline}</option>
                            ))}
                          </select>
                          {errors.timeline && (
                            <p className="mt-1 text-sm text-red-600">{errors.timeline.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={prevStep}
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          Back
                        </Button>
                        <Button
                          type="button"
                          variant="gradient"
                          size="lg"
                          className="flex-1"
                          onClick={nextStep}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          Continue
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Requirements & Message */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project Requirements</h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Project Description *
                        </label>
                        <textarea
                          {...register('message')}
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder="Tell us about your project, goals, and any specific requirements..."
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          Additional Requirements (Optional)
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {requirements.map((req) => (
                            <label key={req} className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                value={req}
                                {...register('requirements')}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">{req}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register('newsletter')}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Subscribe to our newsletter for updates and tips
                          </span>
                        </label>

                        <label className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register('privacy')}
                            className="w-4 h-4 mt-1 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            I agree to the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> and 
                            <a href="/terms-of-service" className="text-blue-600 hover:underline ml-1">Terms of Service</a> *
                          </span>
                        </label>
                        {errors.privacy && (
                          <p className="text-sm text-red-600">{errors.privacy.message}</p>
                        )}
                      </div>

                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={prevStep}
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="gradient"
                          size="lg"
                          className="flex-1"
                          loading={isSubmitting}
                          disabled={!isValid}
                        >
                          Send Message
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}