import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';

import FormLoadingSkeleton from '@/app/components/form/FormLoadingSkeleton';

// Dynamic import for SurveyClient with loading skeleton
const SurveyClient = dynamic(() => import('./SurveyClient'), {
  loading: () => <FormLoadingSkeleton />,
});

interface SurveyPageProps {
  params: Promise<{
    session_id: string;
  }>;
}

/**
 * Metadata for the customer satisfaction survey page
 */
export const metadata: Metadata = {
  title: 'Customer Satisfaction Survey - FredonBytes',
  description: 'Thank you for contacting FredonBytes. Please take a moment to complete this brief survey about your experience.',
  openGraph: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Thank you for contacting FredonBytes. Please share your feedback.',
    url: 'https://fredonbytes.cloud/survey',
  },
  twitter: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Thank you for contacting FredonBytes. Please share your feedback.',
  },
  robots: {
    index: false, // Don't index individual survey sessions
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

/**
 * Validates if a string is a valid UUID v4 format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Main survey page with dynamic session routing.
 * Validates the session_id and passes it to the client component.
 */
export default async function SurveyPage({ params }: SurveyPageProps) {
  // Await params to get the session_id
  const { session_id } = await params;

  // Validate session_id format
  if (!isValidUUID(session_id)) {
    // If invalid, show error in client component
    return <SurveyClient sessionId={session_id} invalidSession={true} />;
  }

  // Pass the validated session_id to the client component
  return <SurveyClient sessionId={session_id} invalidSession={false} />;
}
