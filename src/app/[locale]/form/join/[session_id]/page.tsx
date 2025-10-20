import { setRequestLocale } from 'next-intl/server';

import { redirect } from '@/i18n/navigation';

interface JoinFormPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Join page for shareable form links
 * Redirects to the main form page with the provided session_id
 */
export default async function JoinFormPage({ params }: JoinFormPageProps) {
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Redirect to the main form page with the session_id
  redirect({ href: `/form/${session_id}`, locale });
}
