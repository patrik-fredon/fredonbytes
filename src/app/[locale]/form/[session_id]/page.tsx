import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import FormLoadingSkeleton from "@/components/form/FormLoadingSkeleton";
import { redirect } from "@/i18n/navigation";

// Dynamic import for FormClient with loading skeleton
const FormClient = dynamic(() => import("./FormClient"), {
  loading: () => <FormLoadingSkeleton />,
});

interface FormPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Metadata for the customer satisfaction form page
 */
export const metadata: Metadata = {
  title: "Customer Satisfaction Survey - FredonBytes",
  description:
    "Share your feedback with FredonBytes. Help us improve our services by completing this brief customer satisfaction survey.",
  openGraph: {
    title: "Customer Satisfaction Survey - FredonBytes",
    description:
      "Share your feedback with FredonBytes. Help us improve our services.",
    url: "https://fredonbytes.cz/form",
  },
  twitter: {
    title: "Customer Satisfaction Survey - FredonBytes",
    description:
      "Share your feedback with FredonBytes. Help us improve our services.",
  },
  robots: {
    index: false, // Don't index individual form sessions
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

/**
 * Validates if a string is a valid UUID v4 format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Main form page with dynamic session routing.
 * Validates the session_id and passes it to the client component.
 */
export default async function FormPage({ params }: FormPageProps) {
  // Await params to get the locale and session_id
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Validate session_id format
  if (!isValidUUID(session_id)) {
    // If invalid, generate a new valid session_id and redirect
    const newSessionId = crypto.randomUUID();
    redirect({ href: `/form/${newSessionId}`, locale });
  }

  // Pass the validated session_id and locale to the client component
  return <FormClient sessionId={session_id} locale={locale} />;
}
