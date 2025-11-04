"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { CreateFormSessionResponse } from "@/app/api/form/route";
import { Button } from "@/components/common/Button";
import { useRouter } from "@/i18n/navigation";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
/**
 * FormLanding component - Welcome screen for customer satisfaction form.
 * Features IT-themed animations and a Start button to begin the form.
 */
export default function FormLanding() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "cs";
  const t = useTranslations("form");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setIsStarting(true);
    setError(null);

    try {
      // Create session via API
      const response = await fetch("/api/form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ locale }),
      });

      const data: CreateFormSessionResponse = await response.json();

      if (!response.ok || !data.success || !data.session_id) {
        throw new Error(data.error || "Failed to create session");
      }

      // Store CSRF token in localStorage for later use
      if (data.csrf_token) {
        localStorage.setItem(`form_csrf_${data.session_id}`, data.csrf_token);
      }

      // Store preloaded questions in sessionStorage (solves blank container issue)
      if (data.questions && data.questions.length > 0) {
        try {
          sessionStorage.setItem(
            `form_questions_${data.session_id}`,
            JSON.stringify(data.questions),
          );
        } catch (storageErr) {
          console.warn(
            "Failed to cache questions in sessionStorage:",
            storageErr,
          );
          // Continue anyway - FormClient will fetch if needed
        }
      }

      // Navigate to form with session_id using locale-aware router
      router.push(`/form/${data.session_id}`);
    } catch (err) {
      console.error("Error starting form:", err);
      setError(err instanceof Error ? err.message : "Failed to start form");
      setIsStarting(false);
    }
  };

  return (
    <div className="container  mx-auto px-4 py-12 lg:py-20 ">
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center relative">
        {/* Main content */}
        <TerminalWindow className="relative z-10 w-full max-w-2xl  rounded-xl shadow-2xl">
          <div className="p-8 lg:p-12">
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
              <h1 className="text-3xl lg:text-4xl font-bold text-neon-purple dark:text-neon-cyan">
                {t("title")}
              </h1>
              <p className="text-lg text-white dark:text-white max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
              <p className="text-sm text-white/30 dark:text-white/30">
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
                className="min-w-[200px] min-h-[44px] flex items-center justify-center mx-auto mb-8"
                aria-label="Start the customer satisfaction form"
              >
                {isStarting ? t("starting") : t("startButton")}
              </Button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-white/50 dark:text-white/50 max-w-md mx-auto">
              {t("privacyNote")}
            </p>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
