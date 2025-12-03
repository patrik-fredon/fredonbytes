"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/common/Button";
import FormSkeleton from "@/components/form/FormSkeleton";
import { getCsrfToken } from "@/hooks/useCsrfToken";
import { Link } from "@/i18n/navigation";

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

// Lazy load Step 2 & 3 components (loaded only when needed)
const Step2Content = dynamic(
  () => import("./Step2").then((mod) => ({ default: mod.Step2 })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  },
);

const Step3Content = dynamic(
  () => import("./Step3").then((mod) => ({ default: mod.Step3 })),
  {
    loading: () => <FormSkeleton />,
    ssr: false,
  },
);

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
  ];
  const nextStep = async () => {
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
      // Get CSRF token
      const csrfToken = getCsrfToken();

      if (!csrfToken) {
        throw new Error("CSRF token not found");
      }

      // Include locale in the submission
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
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
      alert(
        t("contact.error.message") ||
          "Failed to submit form. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isSubmitted) {
    return (
      <div className="min-h-screen z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-terminal-dark border-2 border-slate-950/20 rounded-full flex items-center justify-center shadow-lg inset-shadow-3xl inset-shadow-slate-950/50">
              <CheckCircle className="w-10 h-10 text-neon-cyan" />
            </div>
            <h1 className="text-3xl font-mono font-bold text-terminal-light mb-4">
              // {t("contact.success.title")}
            </h1>
            <p className="text-xl text-terminal-light/80 mb-8">
              {t("contact.success.message")}
            </p>
            <Link href="/">
              <Button variant="gradient">{t("contact.success.cta")}</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen z-10">
      <div className="container mx-auto mt-10 px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-3xl lg:text-5xl font-mono font-bold text-neon-cyan mb-6">
              // {t("contact.sectionTitle")}
            </h1>
            <p className="text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("contact.sectionDescription")}
            </p>
          </motion.div>{" "}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-2xl font-mono font-bold text-terminal-light mb-6">
                  // {t("contact.getInTouch")}
                </h2>
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bg backdrop-blur-glass border-2 border-neon-cyan/40 rounded-lg flex items-center justify-center shadow-glow-cyan-subtle">
                      <Mail className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-terminal-light">
                        {t("contact.email")}
                      </h3>
                      <a
                        href="mailto:info@fredonbytes.cz"
                        className="text-terminal-light/80 hover:text-neon-cyan transition-colors"
                      >
                        info@fredonbytes.cz
                      </a>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bg backdrop-blur-glass border-2 border-neon-purple/40 rounded-lg flex items-center justify-center shadow-glow-purple-subtle">
                      <Phone className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-terminal-light">
                        {t("contact.phone")}
                      </h3>
                      <a
                        href="tel:+420799027984"
                        className="text-terminal-light/80 hover:text-neon-purple transition-colors"
                      >
                        +420 799 027 984
                      </a>
                    </div>
                  </div>{" "}
                  {/* Location */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bg backdrop-blur-glass border-2 border-neon-cyan/40 rounded-lg flex items-center justify-center shadow-glow-cyan-subtle">
                      <MapPin className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-terminal-light">
                        {t("contact.location")}
                      </h3>
                      <p className="text-terminal-light/80">
                        Brno, Czech Republic
                      </p>
                    </div>
                  </div>
                  {/* Response Time */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 glass-bg backdrop-blur-glass border-2 border-neon-purple/40 rounded-lg flex items-center justify-center shadow-glow-purple-subtle">
                      <Clock className="w-6 h-6 text-neon-purple" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-terminal-light">
                        {t("contact.responseTime")}
                      </h3>
                      <p className="text-terminal-light/80">
                        {t("contact.responseTimeValue")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Shield className="w-5 h-5 text-neon-cyan" />
                  <h3 className="font-mono font-semibold text-terminal-light">
                    {t("contact.secureConfidential.title")}
                  </h3>
                </div>
                <p className="text-sm text-terminal-light/80">
                  {t("contact.secureConfidential.message")}
                </p>
              </div>
            </motion.div>{" "}
            {/* Multi-step Form */}
            <motion.div variants={itemVariants}>
              <div className="glass-bg backdrop-blur-glass bg-terminal-dark border-2 border-slate-950/30 rounded-2xl p-8 shadow-lg inset-shadow-2xs inset-shadow-slate-950/30">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono font-medium text-terminal-light/80">
                      {t("contact.step")} {currentStep} {t("contact.of")} 3
                    </span>
                    <span className="text-sm font-mono font-medium text-terminal-light/80">
                      {Math.round((currentStep / 3) * 100)}%{" "}
                      {t("contact.complete")}
                    </span>
                  </div>
                  <div className="w-full bg-terminal-light/10 rounded-full h-2">
                    <div
                      className="bg-linear-to-r from-neon-cyan to-neon-purple h-2 rounded-full transition-all duration-500 shadow-glow-cyan-subtle"
                      style={{ width: `${(currentStep / 3) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="flex items-center space-x-3 mb-6">
                          <User className="w-6 h-6 text-neon-cyan" />
                          <h3 className="text-xl font-mono font-bold text-terminal-light">
                            // {t("contact.basicInfo")}
                          </h3>
                        </div>{" "}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
                              {t("contact.firstName")} *
                            </label>
                            <input
                              {...register("firstName")}
                              className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
                              placeholder={t("contact.firstNamePlaceholder")}
                            />
                            <AnimatePresence>
                              {errors.firstName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-1 text-sm text-red-600"
                                >
                                  {errors.firstName.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>

                          <div>
                            <label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
                              {t("contact.lastName")} *
                            </label>
                            <input
                              {...register("lastName")}
                              className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
                              placeholder={t("contact.lastNamePlaceholder")}
                            />
                            <AnimatePresence>
                              {errors.lastName && (
                                <motion.p
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ duration: 0.2 }}
                                  className="mt-1 text-sm text-red-600"
                                >
                                  {errors.lastName.message}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>{" "}
                        <div>
                          <label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
                            {t("contact.email")} *
                          </label>
                          <input
                            {...register("email")}
                            type="email"
                            className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
                            placeholder={t("contact.emailPlaceholder")}
                          />
                          <AnimatePresence>
                            {errors.email && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="mt-1 text-sm text-red-600"
                              >
                                {errors.email.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                        <div>
                          <label className="block text-sm font-mono font-medium text-terminal-light/90 mb-2">
                            {t("contact.phone")} *
                          </label>
                          <input
                            {...register("phone")}
                            type="tel"
                            className="w-full px-4 py-3 glass-bg backdrop-blur-glass border-2 border-neon-cyan/30 rounded-lg focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-200 text-terminal-light placeholder:text-terminal-light/50"
                            placeholder={t("contact.phonePlaceholder")}
                          />
                          <AnimatePresence>
                            {errors.phone && (
                              <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="mt-1 text-sm text-red-600"
                              >
                                {errors.phone.message}
                              </motion.p>
                            )}
                          </AnimatePresence>
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
                    )}{" "}
                    {/* Step 2: Project Details */}
                    {currentStep === 2 && (
                      <Step2Content
                        register={register}
                        errors={errors}
                        t={t}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        projectTypes={projectTypes}
                        budgetRanges={budgetRanges}
                        timelines={timelines}
                      />
                    )}{" "}
                    {/* Step 3: Requirements & Message */}
                    {currentStep === 3 && (
                      <Step3Content
                        register={register}
                        errors={errors}
                        t={t}
                        prevStep={prevStep}
                        isSubmitting={isSubmitting}
                        isValid={isValid}
                        requirements={requirements}
                      />
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
