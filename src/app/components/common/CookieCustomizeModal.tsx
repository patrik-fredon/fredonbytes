"use client";

import { X, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import type { CookiePreferences } from "./CookieConsentBanner";

interface CookieCustomizeModalProps {
  onSave: (preferences: CookiePreferences) => void;
  onClose: () => void;
  isLoading: boolean;
}

export default function CookieCustomizeModal({
  onSave,
  onClose,
  isLoading,
}: CookieCustomizeModalProps) {
  const t = useTranslations("cookies.preferences");

  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  const handleToggle = (key: keyof CookiePreferences) => {
    if (key === "essential") return; // Cannot disable essential cookies

    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAcceptAll = () => {
    onSave({
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  };

  const handleRejectAll = () => {
    onSave({
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t("description")}
          </p>

          <div className="space-y-4">
            {/* Essential Cookies */}
            <CookieOption
              title={t("necessary.title")}
              description={t("necessary.description")}
              enabled={preferences.essential}
              onToggle={() => handleToggle("essential")}
              disabled={true}
              alwaysActive="Always Active"
            />

            {/* Analytics Cookies */}
            <CookieOption
              title={t("analytics.title")}
              description={t("analytics.description")}
              enabled={preferences.analytics}
              onToggle={() => handleToggle("analytics")}
            />

            {/* Marketing Cookies */}
            <CookieOption
              title={t("marketing.title")}
              description={t("marketing.description")}
              enabled={preferences.marketing}
              onToggle={() => handleToggle("marketing")}
            />

            {/* Preference Cookies */}
            <CookieOption
              title={t("preferences.title")}
              description={t("preferences.description")}
              enabled={preferences.preferences}
              onToggle={() => handleToggle("preferences")}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Preferences
          </button>
          <button
            onClick={handleAcceptAll}
            disabled={isLoading}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Accept All
          </button>
          <button
            onClick={handleRejectAll}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Necessary Only
          </button>
        </div>
      </div>
    </div>
  );
}

interface CookieOptionProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  disabled?: boolean;
  alwaysActive?: string;
}

function CookieOption({
  title,
  description,
  enabled,
  onToggle,
  disabled = false,
  alwaysActive,
}: CookieOptionProps) {
  return (
    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0">
          {disabled ? (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
              {alwaysActive}
            </span>
          ) : (
            <button
              onClick={onToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                enabled ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
              }`}
              aria-label={`Toggle ${title}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enabled ? "translate-x-6" : "translate-x-1"
                }`}
              >
                {enabled && (
                  <Check className="w-3 h-3 text-blue-600 absolute top-0.5 left-0.5" />
                )}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
