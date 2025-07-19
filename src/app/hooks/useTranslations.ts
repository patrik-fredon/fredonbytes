"use client";

import { useLocale } from "../contexts/LocaleContext";
import {
  t,
  tArray,
  formatMessage,
  getTranslations,
  hasTranslation,
  type Locale,
} from "../lib/i18n";

/**
 * Enhanced translation hook with additional utility methods
 * Provides centralized translation logic for the entire application
 */
export function useTranslations() {
  const { locale, setLocale, isTransitioning } = useLocale();

  /**
   * Basic translation function
   * @param key - Translation key (dot notation supported)
   * @param fallback - Optional fallback text if translation is missing
   */
  const translate = (key: string, fallback?: string): string => {
    const result = t(key, locale);
    return result === key && fallback ? fallback : result;
  };

  /**
   * Translation with variable interpolation
   * @param key - Translation key
   * @param values - Object with values to interpolate
   * @param fallback - Optional fallback text
   */
  const translateWithFormat = (
    key: string,
    values: Record<string, string | number>,
    fallback?: string
  ): string => {
    const template = t(key, locale);
    if (template === key && fallback) {
      return formatMessage(fallback, values);
    }
    return formatMessage(template, values);
  };

  /**
   * Get all translations for current locale
   * Useful for bulk operations or context providers
   */
  const getAllTranslations = () => {
    return getTranslations(locale);
  };

  /**
   * Check if a translation key exists
   * @param key - Translation key to check
   */
  const hasTranslationKey = (key: string): boolean => {
    return hasTranslation(key, locale);
  };

  /**
   * Get translation for a specific locale (useful for language comparison)
   * @param key - Translation key
   * @param targetLocale - Target locale
   */
  const getTranslationForLocale = (
    key: string,
    targetLocale: Locale
  ): string => {
    return t(key, targetLocale);
  };

  /**
   * Pluralization helper
   * @param key - Base translation key
   * @param count - Number for pluralization
   * @param values - Additional interpolation values
   */
  const translatePlural = (
    key: string,
    count: number,
    values: Record<string, string | number> = {}
  ): string => {
    const pluralKey = count === 1 ? `${key}.singular` : `${key}.plural`;
    const fallbackKey = key;

    const result = t(pluralKey, locale);
    const template = result === pluralKey ? t(fallbackKey, locale) : result;

    return formatMessage(template, { count, ...values });
  };

  /**
   * Translation function for arrays
   * @param key - Translation key (dot notation supported)
   * @param fallback - Optional fallback array if translation is missing
   */
  const translateArray = (key: string, fallback: string[] = []): string[] => {
    const result = tArray(key, locale);
    return result.length > 0 ? result : fallback;
  };

  return {
    // Core translation functions
    t: translate,
    tArray: translateArray,
    format: translateWithFormat,

    // Utility functions
    getAllTranslations,
    hasTranslation: hasTranslationKey,
    getTranslationForLocale,
    translatePlural,

    // Locale management
    locale,
    setLocale,
    isTransitioning,

    // Legacy support - kept for backward compatibility
    translate,
    translateWithFormat,
  };
}

// Export type for components that need to type the hook return
export type UseTranslationsReturn = ReturnType<typeof useTranslations>;
