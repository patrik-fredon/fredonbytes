import { randomUUID } from 'crypto'

import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import FormClient from './FormClient'

interface FormPageProps {
  params: Promise<{
    session_id: string
  }>
}

/**
 * Metadata for the customer satisfaction form page
 */
export const metadata: Metadata = {
  title: 'Customer Satisfaction Survey - FredonBytes',
  description: 'Share your feedback with FredonBytes. Help us improve our services by completing this brief customer satisfaction survey.',
  openGraph: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Share your feedback with FredonBytes. Help us improve our services.',
    url: 'https://fredonbytes.cloud/form',
  },
  twitter: {
    title: 'Customer Satisfaction Survey - FredonBytes',
    description: 'Share your feedback with FredonBytes. Help us improve our services.',
  },
  robots: {
    index: false, // Don't index individual form sessions
    follow: false,
  },
}

/**
 * Validates if a string is a valid UUID v4 format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

/**
 * Main form page with dynamic session routing.
 * Validates the session_id and passes it to the client component.
 */
export default async function FormPage({ params }: FormPageProps) {
  // Await params to get the session_id
  const { session_id } = await params

  // Validate session_id format
  if (!isValidUUID(session_id)) {
    // If invalid, generate a new valid session_id and redirect
    const newSessionId = randomUUID()
    redirect(`/form/${newSessionId}`)
  }

  // Pass the validated session_id to the client component
  return <FormClient sessionId={session_id} />
}
