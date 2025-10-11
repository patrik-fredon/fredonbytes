import { cookies, headers } from 'next/headers';
import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Try to get locale from multiple sources
  let locale = await requestLocale;
  
  // If not from requestLocale, try from header set by middleware
  if (!locale) {
    const headersList = await headers();
    locale = headersList.get('x-next-intl-locale') || undefined;
  }
  
  // If still not found, try from cookie
  if (!locale) {
    const cookieStore = await cookies();
    locale = cookieStore.get('NEXT_LOCALE')?.value;
  }

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Europe/Prague',
    now: new Date()
  };
});
