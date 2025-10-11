import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { sanitizeAnswerValue } from '@/app/lib/input-sanitization';
import { supabase, type SurveySession } from '@/app/lib/supabase';

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

    // Check if session exists and is not already completed
    const { data: existingSession, error: sessionCheckError } = await supabase
      .from('survey_sessions')
      .select('session_id, completed_at, contact_submission_id')
      .eq('session_id', session_id)
      .single();

    if (sessionCheckError || !existingSession) {
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

    // If session is already completed, reject duplicate submission
    if ((existingSession as SurveySession).completed_at) {
      return NextResponse.json(
        {
          success: false,
          message: 'Survey already submitted',
          error: 'This survey has already been completed',
        } as SubmitSurveyResponse,
        { status: 409 }
      );
    }

    // Sanitize all answer values to prevent XSS attacks
    const sanitizedResponses = responses.map(response => ({
      ...response,
      answer_value: typeof response.answer_value === 'number' 
        ? response.answer_value 
        : sanitizeAnswerValue(response.answer_value),
    }));

    // Batch insert survey_responses
    const surveyResponses = sanitizedResponses.map(response => ({
      session_id,
      question_id: response.question_id,
      answer_value: response.answer_value,
    }));

    const { error: responsesError } = await supabase
      .from('survey_responses')
      .insert(surveyResponses as any);

    if (responsesError) {
      console.error('Error inserting survey responses:', responsesError);
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to save responses',
          error: 'Database error',
        } as SubmitSurveyResponse,
        { status: 500 }
      );
    }

    // Update survey_sessions to mark as completed
    const { error: sessionUpdateError } = await supabase
      .from('survey_sessions')
      .update({
        completed_at: new Date().toISOString(),
        ip_address_hash: metadata?.ip_address ?? null,
        user_agent: metadata?.user_agent ?? null,
      } as any)
      .eq('session_id', session_id);

    if (sessionUpdateError) {
      console.error('Error updating survey session:', sessionUpdateError);
      // Don't fail the request if session update fails, responses are already saved
    }

    // Update contact_submissions to mark survey as completed
    if ((existingSession as SurveySession).contact_submission_id) {
      const { error: contactUpdateError } = await supabase
        .from('contact_submissions')
        .update({ survey_completed: true } as any)
        .eq('session_id', (existingSession as SurveySession).contact_submission_id);

      if (contactUpdateError) {
        console.error('Error updating contact submission:', contactUpdateError);
        // Don't fail the request if contact update fails
      }
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
