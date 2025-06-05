import en from '../locales/en/common.json';
import de from '../locales/de/common.json';

export type Locale = 'en' | 'de';

export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'de'];

const translations = {
  en,
  de,
};

export function getTranslations(locale: Locale = defaultLocale) {
  return translations[locale] || translations[defaultLocale];
}

export function t(key: string, locale: Locale = defaultLocale): string {
  const translation = getTranslations(locale);
  const keys = key.split('.');
  
  let result: unknown = translation;
  for (const k of keys) {
    result = (result as Record<string, unknown>)?.[k];
  }
  
  return (typeof result === 'string' ? result : key);
}

export function formatMessage(template: string, values: Record<string, string | number>): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}