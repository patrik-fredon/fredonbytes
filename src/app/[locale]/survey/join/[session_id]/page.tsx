import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

interface JoinSurveyPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Join page for shareable survey links.
 * Redirects to the main survey page with the provided session_id.
 *
 * Usage: Share link like /cs/survey/join/[session_id] with clients
 */
export default async function JoinSurveyPage({ params }: JoinSurveyPageProps) {
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Redirect to the main survey page with the session_id
  redirect(`/${locale}/survey/${session_id}`);
}
