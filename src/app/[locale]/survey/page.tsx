import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';

import FormLoadingSkeleton from '@/components/form/FormLoadingSkeleton';

// Dynamic import for SurveyLanding with loading skeleton
const SurveyLanding = dynamic(() => import('./SurveyLanding'), {
  loading: () => <FormLoadingSkeleton />,
});

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Metadata for the survey landing page
 */
export const metadata: Metadata = {
  title: 'Customer Satisfaction Survey - FredonBytes',
  description: 'Help us improve our services by sharing your feedback. Take our quick customer satisfaction survey.',
  openGraph: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Help us improve our services by sharing your feedback.',
    url: 'https://fredonbytes.cloud/survey',
  },
  twitter: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Help us improve our services by sharing your feedback.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f172a',
};

/**
 * Survey landing page with welcome screen and Start button.
 * Generates session ID on client side when user clicks Start.
 */
export default async function SurveyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SurveyLanding />;
}
