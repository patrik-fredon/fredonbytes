import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { generateCsrfToken, CSRF_TOKEN_COOKIE_NAME } from '@/app/lib/csrf';
import { supabase } from '@/app/lib/supabase';

// Schema for session creation request
const createSessionSchema = z.object({
  locale: z.enum(['en', 'cs', 'de']).default('cs'),
});

// Response interface
export interface CreateFormSessionResponse {
  success: boolean;
  session_id?: string;
  csrf_token?: string;
  questionnaire_id?: string;
  error?: string;
}

/**
 * POST /api/form
 * Creates a new form session with CSRF token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = createSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request data',
        } as CreateFormSessionResponse,
        { status: 400 }
      );
    }

    const { locale } = validationResult.data;

    // Find active form questionnaire
    const { data: questionnaireData, error: questionnaireError } = await supabase
      .from('questionnaires')
      .select('id')
      .eq('type', 'form')
      .eq('active', true)
      .maybeSingle();

    if (questionnaireError || !questionnaireData) {
      console.error('Error fetching form questionnaire:', questionnaireError);
      return NextResponse.json(
        {
          success: false,
          error: 'Form questionnaire not found',
        } as CreateFormSessionResponse,
        { status: 404 }
      );
    }

    // Generate CSRF token
    const csrfToken = generateCsrfToken();

    // Create session
    const sessionId = crypto.randomUUID();
    const { error: sessionError } = await supabase
      .from('sessions')
      .insert({
        session_id: sessionId,
        questionnaire_id: questionnaireData.id,
        locale,
        csrf_token: csrfToken,
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create session',
        } as CreateFormSessionResponse,
        { status: 500 }
      );
    }

    // Create response with CSRF token in cookie
    const response = NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        csrf_token: csrfToken,
        questionnaire_id: questionnaireData.id,
      } as CreateFormSessionResponse,
      { status: 201 }
    );

    // Set CSRF token cookie
    response.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 48 * 60 * 60, // 48 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Unexpected error in form session creation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      } as CreateFormSessionResponse,
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
