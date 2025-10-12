import { NextRequest, NextResponse } from 'next/server';

import { supabase, type SurveyQuestion } from '@/app/lib/supabase';

// Response interface for survey questions endpoint
export interface SurveyQuestionsResponse {
  questions: SurveyQuestion[];
  locale: string;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

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
          locale,
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
          locale,
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
        locale,
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
        locale: 'en',
        error: 'Internal server error',
      } as SurveyQuestionsResponse,
      { status: 500 }
    );
  }
}
