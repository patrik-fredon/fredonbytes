import { randomUUID } from 'crypto'

import { redirect } from 'next/navigation'

/**
 * Redirect handler for the form route.
 * Generates a unique session ID and redirects to the dynamic form page.
 */
export default function FormRedirectPage(): never {
  // Generate a unique session ID using crypto.randomUUID()
  const sessionId = randomUUID()
  
  // Redirect to the dynamic form route with the generated session ID
  redirect(`/form/${sessionId}`)
}
