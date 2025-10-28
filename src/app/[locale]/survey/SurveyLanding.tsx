"use client";

import { motion } from "framer-motion";
import {
  Code,
  Cpu,
  Database,
  Globe,
  Rocket,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { CreateSurveySessionResponse } from "@/app/api/survey/route";
import { Button } from "@/components/common/Button";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRouter } from "@/i18n/navigation";

/**
 * SurveyLanding component - Welcome screen for customer satisfaction survey.
 * Features IT-themed animations and a Start button to begin the survey.
 */
export default function SurveyLanding() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "cs";
  const t = useTranslations("survey");
  const prefersReducedMotion = useReducedMotion();
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // IT-themed floating icons
  const floatingIcons = [
    {
      Icon: Code,
      position: { top: "10%", left: "5%" },
      color: "text-blue-500",
      delay: 0,
    },
    {
      Icon: Zap,
      position: { top: "20%", right: "10%" },
      color: "text-purple-500",
      delay: 1,
    },
    {
      Icon: Globe,
      position: { bottom: "30%", left: "8%" },
      color: "text-cyan-500",
      delay: 2,
    },
    {
      Icon: Database,
      position: { top: "40%", right: "5%" },
      color: "text-green-500",
      delay: 3,
    },
    {
      Icon: Server,
      position: { bottom: "15%", right: "15%" },
      color: "text-orange-500",
      delay: 0.5,
    },
    {
      Icon: Cpu,
      position: { top: "60%", left: "12%" },
      color: "text-pink-500",
      delay: 1.5,
    },
    {
      Icon: Terminal,
      position: { top: "80%", right: "8%" },
      color: "text-indigo-500",
      delay: 2.5,
    },
    {
      Icon: Rocket,
      position: { top: "15%", left: "40%" },
      color: "text-teal-500",
      delay: 0.8,
    },
  ];

  const floatingVariants = {
    animate: prefersReducedMotion
      ? {}
      : {
        y: [-10, 10, -10],
        rotate: [0, 5, 0, -5, 0],
        scale: [1, 1.05, 1],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      },
  };

  const pulseVariants = {
    animate: prefersReducedMotion
      ? {}
      : {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      },
  };

  const handleStart = async () => {
    setIsStarting(true);
    setError(null);

    try {
      // Create session via API
      const response = await fetch("/api/survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      const data: CreateSurveySessionResponse = await response.json();

      if (!response.ok || !data.success || !data.session_id) {
        throw new Error(data.error || "Failed to create session");
      }

      // Store CSRF token in localStorage for later use
      if (data.csrf_token) {
        localStorage.setItem(`survey_csrf_${data.session_id}`, data.csrf_token);
      }

      // Navigate to survey with session_id using locale-aware router
      router.push(`/survey/${data.session_id}`);
    } catch (err) {
      console.error("Error starting survey:", err);
      setError(err instanceof Error ? err.message : "Failed to start survey");
      setIsStarting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center relative">
        {/* Large animated gradient blobs */}
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          variants={pulseVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 dark:opacity-10"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 dark:opacity-5"
          variants={pulseVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />

        {/* Floating IT icons */}
        {floatingIcons.map((item, index) => {
          const { Icon, position, color, delay } = item;
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
          );
        })}

        {/* Main content */}
        <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
          <motion.div
            initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : 0.5,
              ease: "easeOut",
            }}
            className="text-center space-y-8"
          >
            {/* Logo */}
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

            {/* Welcome Message */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                {t("title")}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {t("estimatedTime")}
                </span>
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* Start Button */}
            <div className="pt-4">
              <Button
                onClick={handleStart}
                variant="gradient"
                size="lg"
                loading={isStarting}
                disabled={isStarting}
                className="min-w-[200px] min-h-[44px]"
                aria-label="Start the customer satisfaction survey"
              >
                {isStarting ? t("starting") : t("startButton")}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-md mx-auto">
              {t("privacyNote")}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
