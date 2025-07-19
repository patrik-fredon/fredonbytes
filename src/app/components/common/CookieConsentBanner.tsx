"use client";

import { X, Cookie, Settings } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useTranslations } from "@/app/hooks/useTranslations";

import { Button } from "./Button";

interface CookieConsentBannerProps {
  className?: string;
}

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

export default function CookieConsentBanner({
  className,
}: CookieConsentBannerProps) {
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        ...allAccepted,
        timestamp: new Date().toISOString(),
        version: "1.0",
      })
    );

    setIsVisible(false);

    // Enable analytics and other tracking
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "granted",
        functionality_storage: "granted",
        personalization_storage: "granted",
      });
    }
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };

    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        ...necessaryOnly,
        timestamp: new Date().toISOString(),
        version: "1.0",
      })
    );

    setIsVisible(false);
  };

  const savePreferences = () => {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify({
        ...preferences,
        timestamp: new Date().toISOString(),
        version: "1.0",
      })
    );

    setIsVisible(false);

    // Update tracking consent based on preferences
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: preferences.analytics ? "granted" : "denied",
        ad_storage: preferences.marketing ? "granted" : "denied",
        functionality_storage: preferences.preferences ? "granted" : "denied",
        personalization_storage: preferences.preferences ? "granted" : "denied",
      });
    }
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === "necessary") return; // Cannot disable necessary cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          {!showDetails ? (
            // Simple Banner
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start space-x-3 flex-1">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
                    {t("cookies.banner.title")}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {t("cookies.banner.description")}
                    <Link
                      href="/privacy-policy"
                      className="text-blue-600 dark:text-blue-400 hover:underline ml-1"
                    >
                      {t("cookies.banner.learnMore")}
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(true)}
                  leftIcon={<Settings className="w-4 h-4" />}
                >
                  {t("cookies.banner.customize")}
                </Button>
                <Button variant="outline" size="sm" onClick={acceptNecessary}>
                  {t("cookies.banner.necessaryOnly")}
                </Button>
                <Button variant="gradient" size="sm" onClick={acceptAll}>
                  {t("cookies.banner.acceptAll")}
                </Button>
              </div>
            </div>
          ) : (
            // Detailed Preferences
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {t("cookies.preferences.title")}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  aria-label="Close preferences"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Necessary Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      {t("cookies.preferences.necessary.title")}
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.necessary}
                      disabled
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t("cookies.preferences.necessary.description")}
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      {t("cookies.preferences.analytics.title")}
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.analytics}
                      onChange={() => togglePreference("analytics")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t("cookies.preferences.analytics.description")}
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      {t("cookies.preferences.marketing.title")}
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={() => togglePreference("marketing")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t("cookies.preferences.marketing.description")}
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      {t("cookies.preferences.preferences.title")}
                    </label>
                    <input
                      type="checkbox"
                      checked={preferences.preferences}
                      onChange={() => togglePreference("preferences")}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {t("cookies.preferences.preferences.description")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-600">
                <Button variant="outline" size="sm" onClick={acceptNecessary}>
                  {t("cookies.banner.necessaryOnly")}
                </Button>
                <Button variant="gradient" size="sm" onClick={savePreferences}>
                  {t("cookies.banner.savePreferences")}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
