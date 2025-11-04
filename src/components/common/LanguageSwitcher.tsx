"use client";

import { Globe, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import React, { useState, useEffect, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Locale, routing } from "@/i18n/routing";

interface LanguageSwitcherProps {
  variant?: "desktop" | "mobile";
}

export default function LanguageSwitcher({
  variant = "desktop",
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);

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

  if (!isMounted) {
    return variant === "mobile" ? (
      <div className="flex items-center justify-center gap-2 py-2">
        <div className="w-12 h-12 rounded-lg bg-terminal-dark/50" />
        <div className="w-12 h-12 rounded-lg bg-terminal-dark/50" />
        <div className="w-12 h-12 rounded-lg bg-terminal-dark/50" />
      </div>
    ) : (
      <div className="flex items-center space-x-2 text-white">
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">🇺🇸 English</span>
      </div>
    );
  }

  // Mobile variant: horizontal flag buttons
  if (variant === "mobile") {
    return (
      <div className="flex items-center justify-center gap-3 py-4">
        {routing.locales.map((lang, index) => (
          <button
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            disabled={isPending}
            className={`
              flex items-center justify-center text-2xl min-h-[52px] min-w-[52px] px-4 py-3
              border-2 transition-all duration-200
              ${index === 0 ? "rounded-l-lg" : ""}
              ${index === routing.locales.length - 1 ? "rounded-r-lg" : ""}
              ${
                locale === lang
                  ? "bg-neon-cyan/20 border-neon-cyan shadow-glow-cyan-subtle scale-110"
                  : "bg-terminal-dark/50 border-neon-cyan/20 hover:bg-neon-cyan/10 hover:border-neon-cyan/40"
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            aria-label={`Switch to ${localeDisplayNames[lang]}`}
            aria-current={locale === lang ? "true" : undefined}
          >
            {isPending && locale === lang ? (
              <Loader2 className="w-5 h-5 animate-spin text-neon-cyan" />
            ) : (
              <span>{languageFlags[lang]}</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  // Desktop variant: dropdown menu
  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 text-terminal-light hover:text-neon-cyan transition-fast font-medium min-h-[44px] min-w-[44px] px-2 py-2"
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

      <div className="absolute top-full right-0 mt-2 rounded-lg shadow-lg border border-neon-cyan/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 bg-terminal-dark/95 backdrop-blur-md">
        {routing.locales.map((lang) => (
          <button
            key={lang}
            onClick={() => handleLocaleChange(lang)}
            disabled={isPending}
            className={`
              w-full text-left px-4 py-3 text-terminal-light hover:text-neon-cyan hover:bg-neon-cyan/10
              transition-fast flex items-center justify-between min-h-[44px] font-mono
              first:rounded-t-lg last:rounded-b-lg
              ${locale === lang ? "bg-neon-cyan/20 font-bold" : ""}
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
            aria-label={`Switch to ${localeDisplayNames[lang]}`}
          >
            <span>
              {languageFlags[lang]} {localeDisplayNames[lang]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
