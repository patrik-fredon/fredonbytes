"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, defaultLocale, locales, getTranslations } from "../lib/i18n";

// Define proper type for translations - using unknown for flexible JSON structure
type TranslationData = Record<string, unknown>;

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isTransitioning: boolean;
  availableLocales: Locale[];
  currentTranslations: TranslationData;
  isLocaleSupported: (locale: string) => boolean;
  getLocaleDisplayName: (locale: Locale) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

/**
 * Enhanced LocaleProvider with additional translation management features
 * Provides centralized locale state and utility functions
 */
export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTranslations, setCurrentTranslations] =
    useState<TranslationData>(() => getTranslations(defaultLocale));

  const router = useRouter();
  const pathname = usePathname();

  // Initialize locale from URL or localStorage on mount
  useEffect(() => {
    const initializeLocale = () => {
      if (typeof window === "undefined") return;

      // Check URL parameters first
      const urlParams = new URLSearchParams(window.location.search);
      const urlLocale = urlParams.get("lang") as Locale;

      // Check localStorage
      let storedLocale: Locale | null = null;
      try {
        storedLocale = localStorage.getItem("preferred-locale") as Locale;
      } catch {
        // localStorage not available
      }

      // Determine the locale to use
      let initialLocale = defaultLocale;

      if (urlLocale && locales.includes(urlLocale)) {
        initialLocale = urlLocale;
      } else if (storedLocale && locales.includes(storedLocale)) {
        initialLocale = storedLocale;
      } else {
        // Try to detect from browser language
        try {
          const browserLocale = navigator.language.split("-")[0] as Locale;
          if (locales.includes(browserLocale)) {
            initialLocale = browserLocale;
          }
        } catch {
          // navigator not available
        }
      }

      if (initialLocale !== locale) {
        setLocaleState(initialLocale);
        setCurrentTranslations(getTranslations(initialLocale));
        try {
          localStorage.setItem("preferred-locale", initialLocale);
        } catch {
          // localStorage not available
        }
      }
    };

    initializeLocale();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update translations when locale changes
  useEffect(() => {
    setCurrentTranslations(getTranslations(locale));
  }, [locale]);

  /**
   * Enhanced locale setter with improved transition handling and SSR safety
   */
  const setLocale = useCallback(
    (newLocale: Locale) => {
      if (newLocale === locale || !locales.includes(newLocale)) return;
      if (typeof window === "undefined") return; // SSR safety

      setIsTransitioning(true);

      // Store the preference in localStorage (with error handling)
      try {
        localStorage.setItem("preferred-locale", newLocale);
      } catch (error) {
        console.debug("Could not save locale preference:", error);
      }

      // Update the state
      setLocaleState(newLocale);

      // Update URL params to reflect locale change (for analytics/tracking)
      try {
        const url = new URL(window.location.href);
        url.searchParams.set("lang", newLocale);

        // Use router.replace to update URL without page reload
        router.replace(`${pathname}?${url.searchParams.toString()}`, {
          scroll: false,
        });
      } catch (error) {
        console.debug("Could not update URL:", error);
      }

      // Reset transition state after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    },
    [locale, router, pathname]
  );

  /**
   * Check if a locale is supported
   */
  const isLocaleSupported = useCallback((localeToCheck: string): boolean => {
    return locales.includes(localeToCheck as Locale);
  }, []);

  /**
   * Get display name for a locale
   */
  const getLocaleDisplayName = useCallback((localeCode: Locale): string => {
    const displayNames: Record<Locale, string> = {
      en: "English",
      de: "Deutsch",
      cs: "Čeština",
    };
    return displayNames[localeCode] || localeCode;
  }, []);

  const contextValue: LocaleContextType = {
    locale,
    setLocale,
    isTransitioning,
    availableLocales: locales,
    currentTranslations,
    isLocaleSupported,
    getLocaleDisplayName,
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

/**
 * Enhanced useLocale hook with error boundary
 */
export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

// Export additional utility types
export type LocaleContextValue = LocaleContextType;
