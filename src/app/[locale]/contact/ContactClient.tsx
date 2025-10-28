"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
  Shield,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/common/Button";

const contactSchema = z.object({
  // Step 1: Basic Info
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // Step 2: Project Details
  company: z.string().optional(),
  projectType: z.string().min(1, "Please select a project type"),
  budget: z.string().min(1, "Please select a budget range"),
  timeline: z.string().min(1, "Please select a timeline"),

  // Step 3: Requirements
  message: z.string().min(10, "Please provide more details about your project"),
  requirements: z.array(z.string()).optional(),
  newsletter: z.boolean().optional(),
  privacy: z
    .boolean()
    .refine((val) => val === true, "You must accept the privacy policy"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactClientProps {
  locale: string;
}

export default function ContactClient({ locale }: ContactClientProps) {
  const t = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onChange",
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };

  const projectTypes = [
    t("contact.form.projectDetails.projectType.options.0"),
    t("contact.form.projectDetails.projectType.options.1"),
    t("contact.form.projectDetails.projectType.options.2"),
    t("contact.form.projectDetails.projectType.options.3"),
    t("contact.form.projectDetails.projectType.options.4"),
    t("contact.form.projectDetails.projectType.options.5"),
    t("contact.form.projectDetails.projectType.options.6"),
    t("contact.form.projectDetails.projectType.options.7"),
    t("contact.form.projectDetails.projectType.options.8"),
  ];

  const budgetRanges = [
    t("contact.form.projectDetails.budget.options.0"),
    t("contact.form.projectDetails.budget.options.1"),
    t("contact.form.projectDetails.budget.options.2"),
    t("contact.form.projectDetails.budget.options.3"),
    t("contact.form.projectDetails.budget.options.4"),
    t("contact.form.projectDetails.budget.options.5"),
  ];

  const timelines = [
    t("contact.form.projectDetails.timeline.options.0"),
    t("contact.form.projectDetails.timeline.options.1"),
    t("contact.form.projectDetails.timeline.options.2"),
    t("contact.form.projectDetails.timeline.options.3"),
    t("contact.form.projectDetails.timeline.options.4"),
    t("contact.form.projectDetails.timeline.options.5"),
  ];

  const requirements = [
    t("contact.form.requirements.features.options.0"),
    t("contact.form.requirements.features.options.1"),
    t("contact.form.requirements.features.options.2"),
    t("contact.form.requirements.features.options.3"),
    t("contact.form.requirements.features.options.4"),
    t("contact.form.requirements.features.options.5"),
    t("contact.form.requirements.features.options.6"),
    t("contact.form.requirements.features.options.7"),
  ]; const nextStep = async () => {
    let fieldsToValidate: (keyof ContactFormData)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["firstName", "lastName", "email", "phone"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["projectType", "budget", "timeline"];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);

    try {
      // Include locale in the submission
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          locale,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        const errorData = await response.json();
        console.error("Form submission error:", errorData);
        throw new Error(errorData.error || "Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(t("contact.error.message") || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }; if (isSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t("contact.success.title")}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              {t("contact.success.message")}
            </p>
            <Button
              variant="gradient"
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
            >
              {t("contact.success.cta")}
            </Button>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              {t("contact.sectionTitle")}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("contact.sectionDescription")}
            </p>
            <Button
              variant="gradient"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => {
                const formElement = document.querySelector('form');
                if (formElement) formElement.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t("common.buttons.contactUs")}
            </Button>
          </motion.div>          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                  {t("contact.getInTouch")}
                </h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t("contact.email")}
                      </h3>
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
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t("contact.phone")}
                      </h3>
                      <a
                        href="tel:+420799027984"
                        className="text-slate-600 dark:text-slate-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      >
                        +420 799 027 984
                      </a>
                    </div>
                  </div>                  {/* Location */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t("contact.location")}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Brno, Czech Republic
                      </p>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        {t("contact.responseTime")}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        {t("contact.responseTimeValue")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {t("contact.secureConfidential.title")}
                  </h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {t("contact.secureConfidential.message")}
                </p>
              </div>
            </motion.div>            {/* Multi-step Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t("contact.step")} {currentStep} {t("contact.of")} 3
                    </span>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {Math.round((currentStep / 3) * 100)}%{" "}
                      {t("contact.complete")}
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
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {t("contact.basicInfo")}
                        </h3>
                      </div>                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t("contact.firstName")} *
                          </label>
                          <input
                            {...register("firstName")}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            placeholder={t("contact.firstNamePlaceholder")}
                          />
                          {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.firstName.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t("contact.lastName")} *
                          </label>
                          <input
                            {...register("lastName")}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                            placeholder={t("contact.lastNamePlaceholder")}
                          />
                          {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.lastName.message}
                            </p>
                          )}
                        </div>
                      </div>                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t("contact.email")} *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder={t("contact.emailPlaceholder")}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t("contact.phone")} *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder={t("contact.phonePlaceholder")}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone.message}
                          </p>
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
                        {t("contact.continue")}
                      </Button>
                    </motion.div>
                  )}                  {/* Step 2: Project Details */}
                  {currentStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <Building className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {t("contact.projectDetails")}
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t("contact.company")}
                        </label>
                        <input
                          {...register("company")}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder={t("contact.companyPlaceholder")}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t("contact.projectType")} *
                        </label>
                        <select
                          {...register("projectType")}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        >
                          <option value="">
                            {t("contact.selectProjectType")}
                          </option>
                          {projectTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        {errors.projectType && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.projectType.message}
                          </p>
                        )}
                      </div>                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t("contact.budget")} *
                          </label>
                          <select
                            {...register("budget")}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="">
                              {t("contact.selectBudget")}
                            </option>
                            {budgetRanges.map((range) => (
                              <option key={range} value={range}>
                                {range}
                              </option>
                            ))}
                          </select>
                          {errors.budget && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.budget.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t("contact.timeline")} *
                          </label>
                          <select
                            {...register("timeline")}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          >
                            <option value="">
                              {t("contact.selectTimeline")}
                            </option>
                            {timelines.map((timeline) => (
                              <option key={timeline} value={timeline}>
                                {timeline}
                              </option>
                            ))}
                          </select>
                          {errors.timeline && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.timeline.message}
                            </p>
                          )}
                        </div>
                      </div>                      <div className="flex space-x-4">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          className="flex-1"
                          onClick={prevStep}
                          leftIcon={<ArrowLeft className="w-4 h-4" />}
                        >
                          {t("contact.back")}
                        </Button>
                        <Button
                          type="button"
                          variant="gradient"
                          size="lg"
                          className="flex-1"
                          onClick={nextStep}
                          rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                          {t("contact.continue")}
                        </Button>
                      </div>
                    </motion.div>
                  )}                  {/* Step 3: Requirements & Message */}
                  {currentStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <MessageSquare className="w-6 h-6 text-blue-600" />
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                          {t("contact.projectRequirements")}
                        </h3>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          {t("contact.projectDescription")} *
                        </label>
                        <textarea
                          {...register("message")}
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                          placeholder={t(
                            "contact.projectDescriptionPlaceholder"
                          )}
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.message.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          {t("contact.additionalRequirements")}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {requirements.map((req) => (
                            <label
                              key={req}
                              className="flex items-center space-x-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                value={req}
                                {...register("requirements")}
                                className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">
                                {req}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register("newsletter")}
                            className="w-4 h-4 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {t("contact.subscribeNewsletter")}
                          </span>
                        </label>

                        <label className="flex items-start space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            {...register("privacy")}
                            className="w-4 h-4 mt-1 text-blue-600 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {t("contact.agreePolicies")}
                          </span>
                        </label>
                        {errors.privacy && (
                          <p className="text-sm text-red-600">
                            {errors.privacy.message}
                          </p>
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
                          {t("contact.back")}
                        </Button>
                        <Button
                          type="submit"
                          variant="gradient"
                          size="lg"
                          className="flex-1"
                          loading={isSubmitting}
                          disabled={!isValid}
                        >
                          {t("contact.sendMessage")}
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
    </main>
  );
}