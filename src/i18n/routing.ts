import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'cs', 'de'],

  // Used when no locale matches
  defaultLocale: 'cs',

  // The locale prefix strategy
  // 'as-needed' means the default locale won't have a prefix
  localePrefix: 'always'
});

export type Locale = 'en' | 'cs' | 'de';
