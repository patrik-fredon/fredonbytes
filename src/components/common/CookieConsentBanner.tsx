"use client";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import CookieCustomizeModal from "./CookieCustomizeModal";

const COOKIE_CONSENT_NAME = "cookie-consent";
const COOKIE_CONSENT_VERSION = 1;

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

interface CookieConsentData {
  session_id: string;
  version: number;
  timestamp: string;
  preferences: CookiePreferences;
}

export default function CookieConsentBanner() {
  const t = useTranslations("cookies.banner");
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if user has already set cookie preferences
    const consentCookie = getCookie(COOKIE_CONSENT_NAME);

    if (!consentCookie) {
      // Show banner after a short delay for better UX
      setTimeout(() => setShowBanner(true), 1000);
    } else {
      try {
        const consentData: CookieConsentData = JSON.parse(consentCookie);

        // Check if consent version has changed (re-prompt user)
        if (consentData.version < COOKIE_CONSENT_VERSION) {
          setShowBanner(true);
        }
      } catch (error) {
        console.error("Error parsing cookie consent:", error);
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = async () => {
    setIsLoading(true);

    const preferences: CookiePreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };

    await saveConsent(preferences);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleRejectAll = async () => {
    setIsLoading(true);

    const preferences: CookiePreferences = {
      essential: true, // Essential cookies cannot be disabled
      analytics: false,
      marketing: false,
      preferences: false,
    };

    await saveConsent(preferences);
    setShowBanner(false);
    setIsLoading(false);
  };

  const handleCustomize = () => {
    setShowModal(true);
  };

  const handleSaveCustomPreferences = async (
    preferences: CookiePreferences
  ) => {
    setIsLoading(true);
    await saveConsent(preferences);
    setShowModal(false);
    setShowBanner(false);
    setIsLoading(false);
  };

  const saveConsent = async (preferences: CookiePreferences) => {
    try {
      const sessionId = generateSessionId();

      // Save to API
      const response = await fetch("/api/cookies/consent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          essential: preferences.essential,
          analytics: preferences.analytics,
          marketing: preferences.marketing,
          preferences: preferences.preferences,
          consent_version: COOKIE_CONSENT_VERSION,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save cookie consent");
      }

      // Save to cookie
      const consentData: CookieConsentData = {
        session_id: sessionId,
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        preferences,
      };

      setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consentData), 365);

      // Apply preferences immediately
      applyPreferences(preferences);
    } catch (error) {
      console.error("Error saving cookie consent:", error);
      // Still save to cookie even if API fails
      const sessionId = generateSessionId();
      const consentData: CookieConsentData = {
        session_id: sessionId,
        version: COOKIE_CONSENT_VERSION,
        timestamp: new Date().toISOString(),
        preferences,
      };
      setCookie(COOKIE_CONSENT_NAME, JSON.stringify(consentData), 365);
      applyPreferences(preferences);
    }
  };

  const applyPreferences = (preferences: CookiePreferences) => {
    // Reload page to apply analytics/marketing scripts
    if (preferences.analytics || preferences.marketing) {
      window.location.reload();
    }
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 animate-slide-up">
        <div className="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {t("title")}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                  {t("description")}
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("acceptAll")}
                  </button>
                  <button
                    onClick={handleRejectAll}
                    disabled={isLoading}
                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("necessaryOnly")}
                  </button>
                  <button
                    onClick={handleCustomize}
                    disabled={isLoading}
                    className="px-6 py-2.5 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t("customize")}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <CookieCustomizeModal
          onSave={handleSaveCustomPreferences}
          onClose={() => setShowModal(false)}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

// Helper functions
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
}

function setCookie(name: string, value: string, days: number) {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
