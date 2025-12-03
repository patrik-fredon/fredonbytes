"use client";

import { Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/common/Button";
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
      <div className="bg-terminal-darker rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neon-purple">
          <h2 className="text-2xl font-bold text-neon-cyan">{t("title")}</h2>
          <Button
            variant="gradient"
            onClick={onClose}
            className="  transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <p className="text-slate-200 mb-6">{t("description")}</p>

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
        <div className="flex flex-wrap gap-3 p-6 border-t border-neon-purple/50 bg-terminal-darker">
          <Button
            variant="gradient"
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 px-6 py-3  font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("savePreferences")}
          </Button>
          <Button
            variant="neon-purple"
            onClick={handleAcceptAll}
            disabled={isLoading}
            className="px-6 py-3  font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("acceptAll")}
          </Button>
          <Button
            variant="gradient"
            onClick={handleRejectAll}
            disabled={isLoading}
            className="px-6 py-3  font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("rejectAll")}
          </Button>
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
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
        <div className="flex-shrink-0">
          {disabled ? (
            <span className="text-xs font-medium text-slate-200 px-3 py-1 bg-neon-purple rounded-full">
              {alwaysActive}
            </span>
          ) : (
            <Button
              variant="ghost"
              onClick={onToggle}
              className={`relative inline-flex h-4 w-4 items-center rounded-full transition-colors ${
                enabled ? "bg-neon-cyan/50" : "bg-gray-600"
              }`}
              aria-label={`Toggle ${title}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full  transition-transform ${
                  enabled ? "translate-x-0" : "translate-x-0"
                }`}
              >
                {enabled && (
                  <Check className="w-5 h-5 flex justify-center  relative top-0 left-0" />
                )}
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
