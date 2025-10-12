import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Redirect handler for the form route.
 * Generates a unique session ID and redirects to the dynamic form page.
 */
export default async function FormRedirectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Generate a unique session ID using Web Crypto API
  const sessionId = crypto.randomUUID();
  
  // Redirect to the dynamic form route with the generated session ID
  redirect({ href: `/form/${sessionId}`, locale });
}
