"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  Suspense,
} from "react";

import {
  type Locale,
  defaultLocale,
  locales,
  getTranslations,
} from "../lib/i18n";

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

/**
 * Enhanced LocaleProvider with additional translation management features
 * Provides centralized locale state and utility functions
 */
function LocaleProviderInner({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTranslations, setCurrentTranslations] =
    useState<TranslationData>(() => getTranslations(defaultLocale));

  const router = useRouter();
  const searchParams = useSearchParams();
  const LOCALE_STORAGE_KEY = "preferred-locale";

  // Detect initial locale safely
  const detectInitialLocale = (): Locale => {
    try {
      // Check URL parameters first (from searchParams)
      const urlLocale = searchParams?.get("lang") as Locale;
      if (urlLocale && locales.includes(urlLocale)) {
        return urlLocale;
      }

      // Check localStorage
      if (typeof window !== "undefined") {
        const storedLocale = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale;
        if (storedLocale && locales.includes(storedLocale)) {
          return storedLocale;
        }

        // Try to detect from browser language
        const browserLocale = navigator.language.split("-")[0] as Locale;
        if (locales.includes(browserLocale)) {
          return browserLocale;
        }
      }
    } catch (error) {
      console.warn("Error in locale detection:", error);
      return defaultLocale;
    }

    return defaultLocale;
  };

  // Initialize locale from URL or localStorage on mount
  useEffect(() => {
    const initialLocale = detectInitialLocale();
    if (initialLocale !== locale) {
      setLocaleState(initialLocale);
      setCurrentTranslations(getTranslations(initialLocale));

      // Save to localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, initialLocale);
        } catch (error) {
          console.warn("Failed to save locale to localStorage:", error);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only depend on searchParams to avoid infinite loops

  // Update translations when locale changes
  useEffect(() => {
    setCurrentTranslations(getTranslations(locale));
  }, [locale]);

  /**
   * Enhanced locale setter with improved transition handling and SSR safety
   */
  const setLocale = useMemo(() => {
    return (newLocale: Locale) => {
      if (newLocale === locale || !locales.includes(newLocale)) return;
      if (typeof window === "undefined") return; // SSR safety

      setIsTransitioning(true);

      // Update state immediately
      setLocaleState(newLocale);
      setCurrentTranslations(getTranslations(newLocale));

      try {
        localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      } catch (error) {
        console.warn("Failed to save locale to localStorage:", error);
      }

      // Update URL if needed
      try {
        router.push(`/?lang=${newLocale}`, { scroll: false });
      } catch (error) {
        console.warn("Could not update URL:", error);
      }

      // Reset transition state
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    };
  }, [locale, router]);

  const contextValue = useMemo(
    () => ({
      locale,
      setLocale,
      isTransitioning,
      availableLocales: locales,
      currentTranslations,
      isLocaleSupported: (locale: string): locale is Locale =>
        locales.includes(locale as Locale),
      getLocaleDisplayName: (locale: Locale): string => {
        const displayNames: Record<Locale, string> = {
          en: "English",
          de: "Deutsch",
          cs: "Čeština",
        };
        return displayNames[locale] || locale;
      },
    }),
    [locale, setLocale, isTransitioning, currentTranslations]
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

// Fallback component for Suspense
function LocaleProviderFallback({ children }: { children: ReactNode }) {
  const contextValue = useMemo(
    () => ({
      locale: defaultLocale,
      setLocale: () => {}, // No-op during loading
      isTransitioning: false,
      availableLocales: locales,
      currentTranslations: getTranslations(defaultLocale),
      isLocaleSupported: (locale: string): locale is Locale =>
        locales.includes(locale as Locale),
      getLocaleDisplayName: (locale: Locale): string => {
        const displayNames: Record<Locale, string> = {
          en: "English",
          de: "Deutsch",
          cs: "Čeština",
        };
        return displayNames[locale] || locale;
      },
    }),
    []
  );

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}

// Main LocaleProvider with Suspense wrapper
export function LocaleProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={<LocaleProviderFallback>{children}</LocaleProviderFallback>}
    >
      <LocaleProviderInner>{children}</LocaleProviderInner>
    </Suspense>
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
