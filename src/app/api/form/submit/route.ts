import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';

import { validateCsrfToken, CSRF_TOKEN_HEADER_NAME } from '@/app/lib/csrf';
import { sendEmail } from '@/app/lib/email';
import { generateAdminNotificationHTML, type FormResponseData } from '@/app/lib/email-templates';
import { sanitizeAnswerValue } from '@/app/lib/input-sanitization';
import { supabase, type AnswerValue, type Question, type LocalizedString } from '@/app/lib/supabase';

// Hash IP address for privacy
function hashIpAddress(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

// Zod schema for request validation
const submitRequestSchema = z.object({
  session_id: z.string().uuid('Invalid session ID format').optional(),
  responses: z.array(
    z.object({
      question_id: z.string().uuid('Invalid question ID format'),
      answer_value: z.union([z.string(), z.array(z.string()), z.number()]),
    })
  ).min(1, 'At least one response is required'),
  metadata: z.object({
    user_agent: z.string().optional(),
    ip_address: z.string().optional(),
  }).optional(),
  newsletter_optin: z.boolean().optional(),
  email: z.string().email().optional(),
  locale: z.string().optional(),
  original_session_id: z.string().uuid().optional(),
});

// Response interface for submit endpoint
export interface SubmitResponse {
  success: boolean;
  message: string;
  session_id?: string;
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
        } as SubmitResponse,
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = submitRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: validationResult.error.errors.map(e => e.message).join(', '),
        } as SubmitResponse,
        { status: 400 }
      );
    }

    const { session_id: providedSessionId, responses, metadata, newsletter_optin, email, locale, original_session_id } = validationResult.data;

    // Sanitize all answer values to prevent XSS attacks
    const sanitizedResponses = responses.map(response => ({
      ...response,
      answer_value: sanitizeAnswerValue(response.answer_value),
    }));

    // Validate locale
    const sessionLocale = locale && ['en', 'cs', 'de'].includes(locale) ? locale : 'en';

    // Get the form questionnaire ID
    const { data: questionnaire, error: questionnaireError } = await supabase
      .from('questionnaires')
      .select('id')
      .eq('type', 'form')
      .eq('active', true)
      .maybeSingle();

    if (questionnaireError || !questionnaire) {
      console.error('Error fetching form questionnaire:', questionnaireError);
      return NextResponse.json(
        {
          success: false,
          message: 'Form questionnaire not found',
          error: 'Database error',
        } as SubmitResponse,
        { status: 500 }
      );
    }

    let sessionId = providedSessionId;

    // If session_id is provided, verify it exists and isn't completed
    if (sessionId) {
      const { data: existingSession, error: sessionCheckError } = await supabase
        .from('sessions')
        .select('session_id, completed_at, questionnaire_id')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (sessionCheckError) {
        console.error('Error checking session:', sessionCheckError);
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to verify session',
            error: 'Database error',
          } as SubmitResponse,
          { status: 500 }
        );
      }

      // If session exists and is already completed, reject duplicate submission
      if (existingSession?.completed_at) {
        return NextResponse.json(
          {
            success: false,
            message: 'Form already submitted',
            error: 'This session has already been completed',
          } as SubmitResponse,
          { status: 409 }
        );
      }

      // If session doesn't exist, create it
      if (!existingSession) {
        const { error: createSessionError } = await supabase
          .from('sessions')
          .insert({
            session_id: sessionId,
            questionnaire_id: questionnaire.id,
            original_session_id: original_session_id || null,
            locale: sessionLocale,
            ip_address_hash: metadata?.ip_address ? hashIpAddress(metadata.ip_address) : null,
            user_agent: metadata?.user_agent || null,
            email: email || null,
            newsletter_optin: newsletter_optin || false,
          });

        if (createSessionError) {
          console.error('Error creating session:', createSessionError);
          return NextResponse.json(
            {
              success: false,
              message: 'Failed to create session',
              error: 'Database error',
            } as SubmitResponse,
            { status: 500 }
          );
        }
      }
    } else {
      // Create new session
      const { data: newSession, error: createSessionError } = await supabase
        .from('sessions')
        .insert({
          questionnaire_id: questionnaire.id,
          original_session_id: original_session_id || null,
          locale: sessionLocale,
          ip_address_hash: metadata?.ip_address ? hashIpAddress(metadata.ip_address) : null,
          user_agent: metadata?.user_agent || null,
          email: email || null,
          newsletter_optin: newsletter_optin || false,
        })
        .select('session_id')
        .single();

      if (createSessionError || !newSession) {
        console.error('Error creating session:', createSessionError);
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create session',
            error: 'Database error',
          } as SubmitResponse,
          { status: 500 }
        );
      }

      sessionId = newSession.session_id;
    }

    // Update session to mark as completed
    const { error: updateSessionError } = await supabase
      .from('sessions')
      .update({
        completed_at: new Date().toISOString(),
        email: email || null,
        newsletter_optin: newsletter_optin || false,
      })
      .eq('session_id', sessionId);

    if (updateSessionError) {
      console.error('Error updating session:', updateSessionError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to update session',
          error: 'Database error',
        } as SubmitResponse,
        { status: 500 }
      );
    }

    // Batch insert form_answers (using sanitized responses)
    const formAnswers = sanitizedResponses.map(response => ({
      session_id: sessionId!,
      question_id: response.question_id,
      answer_value: response.answer_value as AnswerValue,
    }));

    const { error: answersError } = await supabase
      .from('form_answers')
      .insert(formAnswers);

    if (answersError) {
      console.error('Error inserting form answers:', answersError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save answers',
          error: 'Database error',
        } as SubmitResponse,
        { status: 500 }
      );
    }

    // Cache session data for offline continuity
    try {
      await supabase
        .from('session_cache')
        .upsert({
          session_id: sessionId!,
          cache_key: 'form_submission',
          cache_data: {
            responses: sanitizedResponses,
            completed_at: new Date().toISOString(),
          },
        });
    } catch (cacheError) {
      console.error('Failed to cache session data:', cacheError);
      // Non-blocking, continue
    }

    // Send admin notification email (non-blocking)
    try {
      // Fetch question details to include in email
      const questionIds = sanitizedResponses.map(r => r.question_id);
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id, question_text, answer_type')
        .in('id', questionIds);

      if (!questionsError && questions) {
        // Map responses to include question text in English (using sanitized responses)
        const formattedResponses: FormResponseData[] = sanitizedResponses.map(response => {
          const question = (questions as Question[]).find((q: Question) => q.id === response.question_id);
          const questionText = question?.question_text as LocalizedString | undefined;
          return {
            question_id: response.question_id,
            question_text: questionText?.en || 'Unknown Question',
            answer_value: response.answer_value,
            answer_type: question?.answer_type || 'unknown',
          };
        });

        // Generate email HTML
        const emailHtml = generateAdminNotificationHTML({
          session_id: sessionId!,
          timestamp: new Date().toISOString(),
          responses: formattedResponses,
        });

        // Send email via SMTP
        await sendEmail({
          from: 'Customer Feedback <noreply@fredonbytes.cloud>',
          to: process.env.ADMIN_EMAIL || 'info@fredonbytes.cloud',
          subject: `New Customer Satisfaction Form - ${sessionId!.substring(0, 8)}`,
          html: emailHtml,
        });

        console.log(`Admin notification email sent for session: ${sessionId}`);
      }
    } catch (emailError) {
      // Log email error but don't block form submission
      console.error('Failed to send admin notification email:', emailError);
      console.error('Session ID:', sessionId);
      // Continue with success response despite email failure
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
        session_id: sessionId,
      } as SubmitResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in submit endpoint:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
      } as SubmitResponse,
      { status: 500 }
    );
  }
}

// Disable caching for POST endpoint
export const dynamic = 'force-dynamic';
