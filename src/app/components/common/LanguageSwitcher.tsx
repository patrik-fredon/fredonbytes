"use client";

import { Globe, Check, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { useState, useEffect, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale, routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by waiting for client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const languageFlags: Record<Locale, string> = {
    en: "🇺🇸",
    de: "🇩🇪",
    cs: "🇨🇿",
  };

  const localeDisplayNames: Record<Locale, string> = {
    en: "English",
    de: "Deutsch",
    cs: "Čeština",
  };

  const handleLocaleChange = (newLocale: Locale) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  // Don't render until mounted to prevent hydration mismatches
  if (!isMounted) {
    return (
      <div className="flex items-center space-x-2 text-slate-700 dark:text-slate-300">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">🇺🇸 English</span>
        <span className="sm:hidden">🇺🇸</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium min-h-[44px] min-w-[44px] px-2 py-2"
        aria-label="Language switcher"
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {languageFlags[locale]} {localeDisplayNames[locale]}
        </span>
        <span className="sm:hidden">{languageFlags[locale]}</span>
      </button>

      <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {routing.locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            disabled={isPending}
            className={`w-full text-left px-4 py-3 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 flex items-center justify-between min-h-[44px] ${
              locale === lang
                ? "bg-slate-100 dark:bg-slate-700 font-medium"
                : ""
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`Switch to ${localeDisplayNames[lang]}`}
          >
            <div className="flex items-center space-x-2">
              <span>{languageFlags[lang]}</span>
              <span className="text-sm">{localeDisplayNames[lang]}</span>
            </div>
            {locale === lang && (
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
