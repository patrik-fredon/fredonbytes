import type { Metadata, Viewport } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { supabase } from '@/app/lib/supabase';
import { redirect } from '@/i18n/navigation';

interface FormJoinPageProps {
  params: Promise<{
    locale: string;
    session_id: string;
  }>;
}

/**
 * Metadata for the shareable form link page
 */
export const metadata: Metadata = {
  title: 'Join Form - FredonBytes',
  description: 'Complete this shared customer satisfaction form.',
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
 * Validates if a string is a valid UUID v4 format
 */
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Form join page for shareable links.
 * Creates a new session linked to the original session_id for tracking.
 */
export default async function FormJoinPage({ params }: FormJoinPageProps) {
  const { locale, session_id: originalSessionId } = await params;
  setRequestLocale(locale);

  // Validate original session_id format
  if (!isValidUUID(originalSessionId)) {
    // Generate a new session_id and redirect
    const newSessionId = crypto.randomUUID();
    redirect({ href: `/form/${newSessionId}`, locale });
  }

  try {
    // Check if original session exists and is valid
    const { data: originalSession, error: sessionError } = await supabase
      .from('sessions')
      .select('session_id, questionnaire_id, expires_at, completed_at')
      .eq('session_id', originalSessionId)
      .maybeSingle();

    // If original session doesn't exist or there's an error, create fresh session
    if (sessionError || !originalSession) {
      const newSessionId = crypto.randomUUID();
      redirect({ href: `/form/${newSessionId}`, locale });
    }

    // Check if session is expired
    if (originalSession.expires_at && new Date(originalSession.expires_at) < new Date()) {
      const newSessionId = crypto.randomUUID();
      redirect({ href: `/form/${newSessionId}`, locale });
    }

    // Verify it's a form questionnaire
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaires')
      .select('id, type')
      .eq('id', originalSession.questionnaire_id)
      .eq('type', 'form')
      .eq('active', true)
      .maybeSingle();

    if (questionnaireError || !questionnaire) {
      const newSessionId = crypto.randomUUID();
      redirect({ href: `/form/${newSessionId}`, locale });
    }

    // Create a new session linked to the original
    const { data: newSession, error: createError } = await supabase
      .from('sessions')
      .insert({
        questionnaire_id: questionnaire.id,
        original_session_id: originalSessionId,
        locale,
      })
      .select('session_id')
      .single();

    if (createError || !newSession) {
      console.error('Error creating new session for join link:', createError);
      const fallbackSessionId = crypto.randomUUID();
      redirect({ href: `/form/${fallbackSessionId}`, locale });
    }

    // Redirect to the new session
    redirect({ href: `/form/${newSession.session_id}`, locale });
  } catch (error) {
    console.error('Error processing form join link:', error);
    const newSessionId = crypto.randomUUID();
    redirect({ href: `/form/${newSessionId}`, locale });
  }
}