import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';

interface JoinSurveyPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Join page for shareable survey links
 * Redirects to the main survey page with the provided session_id
 */
export default async function JoinSurveyPage({ params }: JoinSurveyPageProps) {
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Redirect to the main survey page with the session_id
  redirect({ href: `/survey/${session_id}`, locale });
}
