import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { setRequestLocale } from "next-intl/server";

import FormLoadingSkeleton from "@/components/form/FormLoadingSkeleton";

// Dynamic import for SurveyClient with loading skeleton
const SurveyClient = dynamic(() => import("./SurveyClient"), {
  loading: () => <FormLoadingSkeleton />,
});

interface SurveyPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

// No caching for dynamic session pages
export const revalidate = false;

/**
 * Metadata for the customer satisfaction survey page
 */
export async function generateMetadata({
  params,
}: SurveyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const titles = {
    cs: "Průzkum spokojenosti zákazníků | FredonBytes",
    en: "Customer Satisfaction Survey | FredonBytes",
    de: "Kundenzufriedenheitsumfrage | FredonBytes",
  };

  const descriptions = {
    cs: "Děkujeme, že jste kontaktovali FredonBytes. Věnujte prosím chvíli vyplnění tohoto krátkého průzkumu o vaší zkušenosti.",
    en: "Thank you for contacting FredonBytes. Please take a moment to complete this brief survey about your experience.",
    de: "Vielen Dank, dass Sie FredonBytes kontaktiert haben. Nehmen Sie sich bitte einen Moment Zeit, um diese kurze Umfrage über Ihre Erfahrungen auszufüllen.",
  };

  return {
    title: titles[locale as keyof typeof titles] || titles.en,
    description:
      descriptions[locale as keyof typeof descriptions] || descriptions.en,
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      url: `${baseUrl}/${locale}/survey`,
      siteName: "FredonBytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
    },
    twitter: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description:
        descriptions[locale as keyof typeof descriptions] || descriptions.en,
      creator: "@FredonBytes",
    },
    robots: {
      index: false, // Don't index individual survey sessions
      follow: false,
    },
  };
}

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
 * Main survey page with dynamic session routing.
 * Validates the session_id and passes it to the client component.
 */
export default async function SurveyPage({ params }: SurveyPageProps) {
  // Await params to get the locale and session_id
  const { locale, session_id } = await params;
  setRequestLocale(locale);

  // Validate session_id format
  if (!isValidUUID(session_id)) {
    // If invalid, show error in client component
    return (
      <SurveyClient
        sessionId={session_id}
        locale={locale}
        invalidSession={true}
      />
    );
  }

  // Pass the validated session_id and locale to the client component
  return (
    <SurveyClient
      sessionId={session_id}
      locale={locale}
      invalidSession={false}
    />
  );
}
