import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { validateCsrfToken, CSRF_TOKEN_HEADER_NAME } from '@/lib/csrf';
import { sanitizeAnswerValue } from '@/lib/input-sanitization';
import { supabase, type Session, type Questionnaire, type LocalizedString } from '@/lib/supabase';

// Zod schema for request validation
const submitSurveyRequestSchema = z.object({
  session_id: z.string().uuid('Invalid session ID format'),
  responses: z.array(
    z.object({
      question_id: z.string().uuid('Invalid question ID format'),
      answer_value: z.union([
        z.string(),
        z.array(z.string()),
        z.number().min(1).max(5), // For rating questions
      ]),
    })
  ).min(1, 'At least one response is required'),
  metadata: z.object({
    user_agent: z.string().optional(),
    ip_address: z.string().optional(),
  }).optional(),
});

// Response interface for submit endpoint
export interface SubmitSurveyResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // CSRF validation
    const csrfTokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER_NAME);
    const csrfTokenFromCookie = request.cookies.get('csrf_token')?.value;

    if (!validateCsrfToken(csrfTokenFromHeader || null, csrfTokenFromCookie || null)) {
      return NextResponse.json(
        {
          success: false,
          message: 'CSRF validation failed',
          error: 'Invalid or missing CSRF token',
        } as SubmitSurveyResponse,
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submitSurveyRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: validationResult.error.errors.map(e => e.message).join(', '),
        } as SubmitSurveyResponse,
        { status: 400 }
      );
    }

    const { session_id, responses, metadata } = validationResult.data;

    // Check if session exists and is valid
    const { data: sessionData, error: sessionCheckError } = await supabase
      .from('sessions')
      .select('session_id, questionnaire_id, completed_at, expires_at')
      .eq('session_id', session_id)
      .maybeSingle();

    if (sessionCheckError || !sessionData) {
      console.error('Session validation error:', sessionCheckError);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired session',
          error: 'Session not found',
        } as SubmitSurveyResponse,
        { status: 404 }
      );
    }

    // Type assertion for session
    const session = sessionData as Session;
    if (session.expires_at && new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Session expired',
          error: 'This session has expired',
        } as SubmitSurveyResponse,
        { status: 410 }
      );
    }

    // Check if session is already completed
    if (session.completed_at) {
      return NextResponse.json(
        {
          success: false,
          message: 'Survey already submitted',
          error: 'This survey has already been completed',
        } as SubmitSurveyResponse,
        { status: 409 }
      );
    }

    // Verify session is for a survey questionnaire
    const { data: questionnaireData, error: questionnaireError } = await supabase
      .from('questionnaires')
      .select('type')
      .eq('id', session.questionnaire_id)
      .maybeSingle();

    if (questionnaireError || !questionnaireData) {
      console.error('Questionnaire validation error:', questionnaireError);
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid questionnaire',
          error: 'Questionnaire not found',
        } as SubmitSurveyResponse,
        { status: 400 }
      );
    }

    const questionnaire = questionnaireData as Questionnaire;
    if (questionnaire.type !== 'survey') {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid questionnaire',
          error: 'Session is not associated with a survey',
        } as SubmitSurveyResponse,
        { status: 400 }
      );
    }

    // Sanitize all answer values to prevent XSS attacks
    const sanitizedResponses = responses.map(response => ({
      ...response,
      answer_value: typeof response.answer_value === 'number'
        ? response.answer_value
        : sanitizeAnswerValue(response.answer_value),
    }));

    // Batch insert survey_answers
    const surveyAnswers = sanitizedResponses.map(response => ({
      session_id,
      question_id: response.question_id,
      answer_value: response.answer_value as never, // Type workaround for JSONB
    }));

    const { error: answersError } = await supabase
      .from('survey_answers')
      .insert(surveyAnswers as never[]);

    if (answersError) {
      console.error('Error inserting survey answers:', answersError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save responses',
          error: 'Database error',
        } as SubmitSurveyResponse,
        { status: 500 }
      );
    }

    // Update session to mark as completed
    const { error: sessionUpdateError } = await supabase
      .from('sessions')
      .update({
        completed_at: new Date().toISOString(),
        ip_address_hash: metadata?.ip_address ?? null,
        user_agent: metadata?.user_agent ?? null,
      } as never)
      .eq('session_id', session_id);

    if (sessionUpdateError) {
      console.error('Error updating session:', sessionUpdateError);
      // Don't fail the request if session update fails, answers are already saved
    }

    // Update contact_submissions to mark survey as completed if session is linked
    const { data: contactData } = await supabase
      .from('contact_submissions')
      .select('id, email, first_name, locale')
      .eq('session_id', session_id)
      .maybeSingle();

    if (contactData) {
      const { error: contactUpdateError } = await supabase
        .from('contact_submissions')
        .update({ survey_completed: true } as never)
        .eq('session_id', session_id);

      if (contactUpdateError) {
        console.error('Error updating contact submission:', contactUpdateError);
        // Don't fail the request if contact update fails
      }

      // Send thank you email to customer
      try {
        const { sendEmail } = await import('@/lib/email');
        const { generateSurveyThankYouHTML, generateSurveyThankYouText } = await import('@/lib/email-templates');
        const { getTranslations } = await import('next-intl/server');

        const customerEmail = (contactData as { email: string }).email;
        const firstName = (contactData as { first_name: string }).first_name;
        const locale = ((contactData as { locale: string | null }).locale) || 'en';

        // Get translations for email subject
        const t = await getTranslations({ locale, namespace: 'emails' });

        const emailHtml = await generateSurveyThankYouHTML({
          firstName,
          email: customerEmail,
          locale,
        });

        const emailText = await generateSurveyThankYouText({
          firstName,
          email: customerEmail,
          locale,
        });

        await sendEmail({
          from: 'Fredonbytes <noreply@fredonbytes.cloud>',
          to: customerEmail,
          subject: t('survey.subject'),
          html: emailHtml,
          text: emailText,
        });

        console.log('Survey thank you email sent successfully');
      } catch (emailError) {
        console.error('Error sending survey thank you email:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Send admin notification with survey responses
    try {
      const { sendEmail } = await import('@/lib/email');
      const { generateAdminNotificationHTML } = await import('@/lib/email-templates');

      // Fetch questions for admin notification
      const questionIds = sanitizedResponses.map(r => r.question_id);
      const { data: questionsData } = await supabase
        .from('questions')
        .select('id, question_text, answer_type')
        .in('id', questionIds);

      if (questionsData) {
        const formattedResponses = sanitizedResponses.map(response => {
          const question = questionsData.find((q: { id: string }) => q.id === response.question_id) as { id: string; question_text: LocalizedString; answer_type: string } | undefined;
          
          // Convert LocalizedString to string (use English as default for admin)
          let questionText = 'Unknown question';
          if (question) {
            const localizedText = question.question_text;
            questionText = typeof localizedText === 'string' 
              ? localizedText 
              : (localizedText.en || localizedText.cs || localizedText.de || 'Unknown question');
          }
          
          return {
            question_id: response.question_id,
            question_text: questionText,
            answer_value: response.answer_value,
            answer_type: question ? question.answer_type : 'text',
          };
        });

        const adminEmailHtml = generateAdminNotificationHTML({
          session_id,
          timestamp: new Date().toISOString(),
          responses: formattedResponses,
        });

        await sendEmail({
          from: 'Survey System <noreply@fredonbytes.cloud>',
          to: 'info@fredonbytes.cloud',
          subject: `New Survey Submission - ${session_id}`,
          html: adminEmailHtml,
        });

        console.log('Admin notification email sent successfully');
      }
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Survey submitted successfully',
      } as SubmitSurveyResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in survey submit endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as SubmitSurveyResponse,
      { status: 500 }
    );
  }
}

// Disable caching for POST endpoint
export const dynamic = 'force-dynamic';