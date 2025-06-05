import en from '../locales/en/common.json';
import de from '../locales/de/common.json';

export type Locale = 'en' | 'de';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'de'];

// Cached translations for performance
const translationCache = new Map<Locale, Record<string, unknown>>();

const translations = {
  en,
  de,
} as const;

/**
 * Get translations with caching for performance
 */
export function getTranslations(locale: Locale = defaultLocale): Record<string, unknown> {
  if (translationCache.has(locale)) {
    return translationCache.get(locale)!;
  }
  
  const translation = translations[locale] || translations[defaultLocale];
  translationCache.set(locale, translation);
  return translation;
}

/**
 * Enhanced translation function with better error handling and performance
 */
export function t(key: string, locale: Locale = defaultLocale): string {
  try {
    const translation = getTranslations(locale);
    const keys = key.split('.');
    
    let result: unknown = translation;
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key; // Early return if path is invalid
      }
    }
    
    return typeof result === 'string' ? result : key;
  } catch (error) {
    console.debug(`Translation error for key "${key}":`, error);
    return key;
  }
}

/**
 * Enhanced message formatting with better performance
 */
export function formatMessage(template: string, values: Record<string, string | number>): string {
  if (!template || typeof template !== 'string') {
    return template || '';
  }
  
  try {
    return template.replace(/{(\w+)}/g, (match, key) => {
      const value = values[key];
      return value !== undefined && value !== null ? value.toString() : match;
    });
  } catch (error) {
    console.debug('Message formatting error:', error);
    return template;
  }
}

/**
 * Check if translation exists for key
 */
export function hasTranslation(key: string, locale: Locale = defaultLocale): boolean {
  try {
    const translation = getTranslations(locale);
    const keys = key.split('.');
    
    let result: unknown = translation;
    for (const k of keys) {
      if (result && typeof result === 'object') {
        result = (result as Record<string, unknown>)[k];
      } else {
        return false;
      }
    }
    
    return typeof result === 'string';
  } catch {
    return false;
  }
}

/**
 * Preload translations for better performance
 */
export function preloadTranslations(): void {
  locales.forEach(locale => {
    getTranslations(locale);
  });
}

/**
 * Get locale display name
 */
export function getLocaleDisplayName(locale: Locale): string {
  const displayNames: Record<Locale, string> = {
    en: 'English',
    de: 'Deutsch'
  };
  return displayNames[locale] || locale;
}

/**
 * Validate if a string is a supported locale
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}