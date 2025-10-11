import { randomUUID } from 'crypto';

import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Redirect handler for the survey route.
 * Generates a unique session ID and redirects to the dynamic survey page.
 */
export default async function SurveyRedirectPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Generate a unique session ID using crypto.randomUUID()
  const sessionId = randomUUID();

  // Redirect to the dynamic survey route with the generated session ID
  redirect({ href: `/survey/${sessionId}`, locale });
}
