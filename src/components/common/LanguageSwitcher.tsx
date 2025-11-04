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
      <div className="flex items-center space-x-2 text-white dark:text-slate-300">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">🇺🇸 English</span>
        <span className="sm:hidden">🇺🇸</span>
      </div>
    );
  }

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 text-white dark:text-slate-300 hover:text-neon-cyan dark:hover:text-white transition-colors duration-200 font-medium min-h-[44px] min-w-[44px] px-2 py-2"
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

      <div className="absolute flex justify-center top-full right-0 mt-2 rounded-lg first:rounded-tl-lg last:rounded-br-lg shadow-lg border border-neon-cyan/10 dark:border-neon-purple/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {routing.locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            disabled={isPending}
            className={`w-full text-left px-4 py-3 text-white dark:text-slate-300 hover:text-neon-cyan/50  transition-colors duration-200 flex items-center justify-between min-h-[44px] ${locale === lang
              ? " bg-neon-cyan/30 first:rounded-tl-lg first:rounded-bl-lg last:rounded-br-lg last:rounded-tr-lg font-bold"
              : ""
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={`Switch to ${localeDisplayNames[lang]}`}
          >

            <span>{languageFlags[lang]}</span>



          </button>
        ))}
      </div>
    </div>
  );
}
