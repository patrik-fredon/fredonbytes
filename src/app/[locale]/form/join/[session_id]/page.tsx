import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

interface JoinFormPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Join page for shareable form links.
 * Redirects to the main form page with the provided session_id.
 * 
 * Usage: Share link like /cs/form/join/[session_id] with clients
 */
export default async function JoinFormPage({ params }: JoinFormPageProps) {
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Redirect to the main form page with the session_id
  redirect(`/${locale}/form/${session_id}`);
}
