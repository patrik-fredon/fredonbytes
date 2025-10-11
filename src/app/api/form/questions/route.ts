import { NextResponse } from 'next/server';

import { supabase, type Question } from '@/app/lib/supabase';

// Response interface for questions endpoint
export interface QuestionsResponse {
  questions: Question[];
  error?: string;
}

export async function GET() {
  try {
    // Fetch questions with their options in a single query using join
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        options:question_options(*)
      `)
      .order('display_order', { ascending: true });

    // Handle database errors
    if (error) {
      console.error('Database error fetching questions:', error);
      return NextResponse.json(
        {
          questions: [],
          error: 'Failed to fetch questions from database',
        } as QuestionsResponse,
        { status: 500 }
      );
    }

    // Handle case where no questions exist
    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          questions: [],
        } as QuestionsResponse,
        { status: 200 }
      );
    }

    // Type assertion for Supabase query result with join
    const questionsData = data as unknown as Question[];

    // Sort options by display_order for each question
    const questionsWithSortedOptions = questionsData.map((question) => ({
      ...question,
      options: question.options?.sort(
        (a, b) => a.display_order - b.display_order
      ),
    }));

    return NextResponse.json(
      {
        questions: questionsWithSortedOptions,
      } as QuestionsResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error('Unexpected error in questions endpoint:', error);
    return NextResponse.json(
      {
        questions: [],
        error: 'Internal server error',
      } as QuestionsResponse,
      { status: 500 }
    );
  }
}
