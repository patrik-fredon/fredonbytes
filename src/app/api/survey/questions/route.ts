import { NextRequest, NextResponse } from 'next/server';

import { supabase, type SurveyQuestion } from '@/app/lib/supabase';

// Response interface for survey questions endpoint
export interface SurveyQuestionsResponse {
  questions: SurveyQuestion[];
  session: {
    session_id: string;
    locale: string;
    completed: boolean;
  } | null;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('session_id');
    const locale = searchParams.get('locale') || 'en';

    // Validate session_id parameter
    if (!sessionId) {
      return NextResponse.json(
        {
          questions: [],
          session: null,
          error: 'Session ID is required',
        } as SurveyQuestionsResponse,
        { status: 400 }
      );
    }

    // Validate session exists and is not completed
    const { data: sessionData, error: sessionError } = await supabase
      .from('survey_sessions')
      .select('session_id, locale, completed_at')
      .eq('session_id', sessionId)
      .single();

    if (sessionError || !sessionData) {
      console.error('Session validation error:', sessionError);
      return NextResponse.json(
        {
          questions: [],
          session: null,
          error: 'Invalid or expired session',
        } as SurveyQuestionsResponse,
        { status: 404 }
      );
    }

    // Check if survey is already completed
    if (sessionData.completed_at) {
      return NextResponse.json(
        {
          questions: [],
          session: {
            session_id: sessionData.session_id,
            locale: sessionData.locale,
            completed: true,
          },
          error: 'Survey already completed',
        } as SurveyQuestionsResponse,
        { status: 400 }
      );
    }

    // Fetch active survey questions with their options
    const { data, error } = await supabase
      .from('survey_questions')
      .select(`
        *,
        options:survey_question_options(*)
      `)
      .eq('active', true)
      .order('display_order', { ascending: true });

    // Handle database errors
    if (error) {
      console.error('Database error fetching survey questions:', error);
      return NextResponse.json(
        {
          questions: [],
          session: null,
          error: 'Failed to fetch survey questions from database',
        } as SurveyQuestionsResponse,
        { status: 500 }
      );
    }

    // Handle case where no questions exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          questions: [],
          session: {
            session_id: sessionData.session_id,
            locale: sessionData.locale,
            completed: false,
          },
        } as SurveyQuestionsResponse,
        { status: 200 }
      );
    }

    // Type assertion for Supabase query result with join
    const questionsData = data as unknown as SurveyQuestion[];

    // Sort options by display_order for each question
    const questionsWithSortedOptions = questionsData.map((question) => ({
      ...question,
      options: question.options?.sort(
        (a, b) => a.display_order - b.display_order
      ),
    }));

    // Return with cache headers (no cache for survey questions as they're session-specific)
    return NextResponse.json(
      {
        questions: questionsWithSortedOptions,
        session: {
          session_id: sessionData.session_id,
          locale: sessionData.locale,
          completed: false,
        },
      } as SurveyQuestionsResponse,
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  } catch (error) {
    console.error('Unexpected error in survey questions endpoint:', error);
    return NextResponse.json(
      {
        questions: [],
        session: null,
        error: 'Internal server error',
      } as SurveyQuestionsResponse,
      { status: 500 }
    );
  }
}
