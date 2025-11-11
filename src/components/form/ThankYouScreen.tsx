"use client";

import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { getCsrfToken } from "@/hooks/useCsrfToken";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import { Button } from "../common/Button";

interface ThankYouScreenProps {
  onRedirect?: () => void;
}

/**
 * ThankYouScreen component for the customer satisfaction form.
 * Displays success message with newsletter subscription option.
 *
 * @param onRedirect - Optional callback function for manual redirect (defaults to router.push('/'))
 */
export default function ThankYouScreen({ onRedirect }: ThankYouScreenProps) {
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();
  const [newsletterOptin, setNewsletterOptin] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(
    null,
  );

  // Handle newsletter subscription
  const handleNewsletterSubscription = async () => {
    if (!email || !email.includes("@")) {
      setSubscriptionError("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionError(null);

    try {
      const csrfToken = getCsrfToken();

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken || "",
        },
        body: JSON.stringify({
          email,
          source: "thank_you_screen",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to subscribe to newsletter");
      }

      setSubscriptionSuccess(true);
      setNewsletterOptin(false);
    } catch (error) {
      setSubscriptionError(
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again.",
      );
    } finally {
      setIsSubscribing(false);
    }
  };
  const t = useTranslations("form.thankYouScreen.newsletterInfo");
  // Handle manual finish button click
  const handleFinish = () => {
    if (onRedirect) {
      onRedirect();
    } else {
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.5,
        ease: "easeOut",
      }}
      className="text-center space-y-8"
    >
      {/* Terminal Success Checkmark with Glow */}
      <motion.div
        initial={{
          scale: prefersReducedMotion ? 1 : 0,
          rotate: prefersReducedMotion ? 0 : -180,
        }}
        animate={{ scale: 1, rotate: 0 }}
        transition={
          prefersReducedMotion
            ? { duration: 0.01 }
            : {
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }
        }
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
          {t("thankYouHeading")}
        </h1>
        <p className="text-lg font-mono text-neon-purple max-w-2xl mx-auto leading-relaxed">
          {t("thankYouTitle")}
        </p>
        <p className="text-base font-mono text-terminal-muted">
          {t("thankYouMessage")}
        </p>
      </div>

      {/* Terminal Branding */}
      <div className="pt-4">
        <p className="text-sm font-mono font-semibold text-neon-purple">
          — FredonBytes Team
        </p>
      </div>

      {/* Newsletter Subscription Section */}
      {!subscriptionSuccess ? (
        <div className="pt-6 space-y-4 max-w-md mx-auto">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={newsletterOptin}
              onChange={(e) => setNewsletterOptin(e.target.checked)}
              disabled={isSubscribing}
              className="mt-1 w-5 h-5 rounded border-2 border-neon-cyan/50 bg-terminal-dark/80 text-neon-cyan focus:ring-2 focus:ring-neon-cyan/50 focus:ring-offset-0 cursor-pointer checked:bg-neon-cyan checked:border-neon-cyan hover:border-neon-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="flex-1 text-sm font-mono text-terminal-muted group-hover:text-neon-cyan transition-colors duration-[180ms]">
              {t("newsletterInfo")}
            </span>
          </label>

          {/* Email Input & Subscribe Button */}
          {newsletterOptin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div>
                <label
                  htmlFor="newsletter-email"
                  className="block text-sm font-mono font-medium text-neon-cyan mb-2"
                >
                  {t("newsletterEmail")}{" "}
                  <span className="text-error-red">*</span>
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setSubscriptionError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && email) {
                      handleNewsletterSubscription();
                    }
                  }}
                  placeholder="$ your.email@example.com"
                  disabled={isSubscribing}
                  className="w-full px-4 py-2 border border-neon-cyan/30 rounded-md bg-terminal-dark font-mono text-white placeholder:text-terminal-muted focus:ring-2 focus:ring-neon-cyan focus:border-neon-cyan focus:shadow-glow-cyan-subtle transition-all duration-[180ms] disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <p className="mt-1 text-xs font-mono text-terminal-muted">
                  {t("subscriptionInfo")}
                </p>
              </div>

              {subscriptionError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm font-mono text-error-red"
                >
                  {subscriptionError}
                </motion.p>
              )}

              <Button
                onClick={handleNewsletterSubscription}
                variant="secondary"
                prefix="$"
                disabled={isSubscribing || !email}
                className="w-full"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                    {t("subscribing")}
                  </>
                ) : (
                  t("subscribe_newsletter")
                )}
              </Button>
            </motion.div>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="pt-6 max-w-md mx-auto text-center space-y-2"
        >
          <CheckCircle className="w-8 h-8 text-code-green mx-auto" />
          <p className="text-sm font-mono text-code-green">
            {t("subscriptionSuccess")}
          </p>
          <p className="text-xs font-mono text-terminal-muted">
            {t("subscriptionThanks")}
          </p>
        </motion.div>
      )}

      {/* Return to Homepage Button */}
      <div className="pt-8 space-y-3">
        <Button
          onClick={handleFinish}
          variant="gradient"
          prefix="$"
          className="min-w-[200px]"
        >
          {t("finishButton")}
        </Button>
      </div>

      {/* Terminal Contact Note */}
      <p className="text-xs font-mono text-terminal-muted max-w-md mx-auto p-4">
        {t("contactNote")}{" "}
        <a
          href="mailto:info@fredonbytes.cz"
          className="text-neon-cyan hover:text-white transition-all duration-[180ms]"
        >
          info@fredonbytes.com
        </a>
      </p>
    </motion.div>
  );
}
