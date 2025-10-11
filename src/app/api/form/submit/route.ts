import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { sendEmail } from '@/app/lib/email';
import { generateAdminNotificationHTML, type FormResponseData } from '@/app/lib/email-templates';
import { sanitizeAnswerValue } from '@/app/lib/input-sanitization';
import { supabase, type AnswerValue, type FormSession, type Question } from '@/app/lib/supabase';

// Zod schema for request validation
const submitRequestSchema = z.object({
  session_id: z.string().uuid('Invalid session ID format'),
  responses: z.array(
    z.object({
      question_id: z.string().uuid('Invalid question ID format'),
      answer_value: z.union([z.string(), z.array(z.string())]),
    })
  ).min(1, 'At least one response is required'),
  metadata: z.object({
    user_agent: z.string().optional(),
    ip_address: z.string().optional(),
  }).optional(),
  newsletter_optin: z.boolean().optional(),
  email: z.string().email().optional(),
  locale: z.string().optional(),
});

// Response interface for submit endpoint
export interface SubmitResponse {
  success: boolean;
  message: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
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

    const { session_id, responses, metadata, newsletter_optin, email, locale } = validationResult.data;

    // Sanitize all answer values to prevent XSS attacks
    const sanitizedResponses = responses.map(response => ({
      ...response,
      answer_value: sanitizeAnswerValue(response.answer_value),
    }));

    // Check if session already completed (duplicate submission)
    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('form_sessions')
      .select('completed_at')
      .eq('session_id', session_id)
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
    if (existingSession && (existingSession as FormSession).completed_at) {
      return NextResponse.json(
        {
          success: false,
          message: 'Form already submitted',
          error: 'This session has already been completed',
        } as SubmitResponse,
        { status: 409 }
      );
    }

    // Insert or update form_sessions record
    const { error: sessionError } = await supabase
      .from('form_sessions')
      .upsert({
        session_id,
        completed_at: new Date().toISOString(),
        ip_address_hash: metadata?.ip_address ?? null,
        user_agent: metadata?.user_agent ?? null,
        newsletter_optin: newsletter_optin ?? false,
        email: email ?? null,
        locale: locale ?? 'en',
      } as any, {
        onConflict: 'session_id',
      });

    if (sessionError) {
      console.error('Error upserting form session:', sessionError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save session',
          error: 'Database error',
        } as SubmitResponse,
        { status: 500 }
      );
    }

    // Batch insert form_responses (using sanitized responses)
    const formResponses = sanitizedResponses.map(response => ({
      session_id,
      question_id: response.question_id,
      answer_value: response.answer_value as AnswerValue,
    }));

    const { error: responsesError } = await supabase
      .from('form_responses')
      .insert(formResponses as any);

    if (responsesError) {
      console.error('Error inserting form responses:', responsesError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save responses',
          error: 'Database error',
        } as SubmitResponse,
        { status: 500 }
      );
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
        // Map responses to include question text (using sanitized responses)
        const formattedResponses: FormResponseData[] = sanitizedResponses.map(response => {
          const question = (questions as Question[]).find((q: Question) => q.id === response.question_id);
          return {
            question_id: response.question_id,
            question_text: question?.question_text ?? 'Unknown Question',
            answer_value: response.answer_value,
            answer_type: question?.answer_type ?? 'unknown',
          };
        });

        // Generate email HTML
        const emailHtml = generateAdminNotificationHTML({
          session_id,
          timestamp: new Date().toISOString(),
          responses: formattedResponses,
        });

        // Send email via SMTP
        await sendEmail({
          from: 'Customer Feedback <noreply@fredonbytes.cloud>',
          to: process.env.ADMIN_EMAIL ?? 'info@fredonbytes.cloud',
          subject: `New Customer Satisfaction Survey - ${session_id.substring(0, 8)}`,
          html: emailHtml,
        });

        console.log(`Admin notification email sent for session: ${session_id}`);
      }
    } catch (emailError) {
      // Log email error but don't block form submission
      console.error('Failed to send admin notification email:', emailError);
      console.error('Session ID:', session_id);
      // Continue with success response despite email failure
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Form submitted successfully',
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
