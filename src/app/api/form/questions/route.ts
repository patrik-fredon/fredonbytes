import { NextRequest, NextResponse } from 'next/server';

import { supabase, type Question, type LocalizedString } from '@/app/lib/supabase';

// Response interface for questions endpoint
export interface QuestionsResponse {
  questions: LocalizedQuestion[];
  locale?: string;
  error?: string;
}

// Localized question interface (questions with localized strings)
export interface LocalizedQuestion {
  id: string;
  question_text: string;
  description?: string | null;
  answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist' | 'rating';
  required: boolean;
  display_order: number;
  active: boolean;
  options?: LocalizedQuestionOption[];
}

// Localized option interface
export interface LocalizedQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  display_order: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get locale from query params (default to 'en')
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get('locale') || 'en';

    // Validate locale
    if (!['en', 'cs', 'de'].includes(locale)) {
      return NextResponse.json(
        {
          questions: [],
          error: 'Invalid locale. Supported locales: en, cs, de',
        } as QuestionsResponse,
        { status: 400 }
      );
    }

    // Get the form questionnaire ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: questionnaire, error: questionnaireError } = await (supabase as any)
      .from('questionnaires')
      .select('id')
      .eq('type', 'form')
      .eq('active', true)
      .maybeSingle();

    if (questionnaireError || !questionnaire) {
      console.error('Error fetching form questionnaire:', questionnaireError);
      return NextResponse.json(
        {
          questions: [],
          error: 'Form questionnaire not found',
        } as QuestionsResponse,
        { status: 404 }
      );
    }

    // Fetch questions with their options for the form questionnaire
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('questions')
      .select(`
        *,
        options:question_options(*)
      `)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .eq('questionnaire_id', (questionnaire as any).id)
      .eq('active', true)
      .order('display_order', { ascending: true });

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

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          questions: [],
          locale,
        } as QuestionsResponse,
        { status: 200 }
      );
    }

    // Type assertion and process questions
    const questionsData = data as Question[];

    // Localize questions and options, sort options by display_order
    const localizedQuestions = questionsData.map((question) => {
      const questionText = question.question_text as LocalizedString;
      const description = question.description as LocalizedString | null;

      return {
        ...question,
        question_text: questionText[locale as keyof LocalizedString] || questionText.en,
        description: description ? (description[locale as keyof LocalizedString] || description.en) : null,
        options: question.options
          ?.sort((a, b) => a.display_order - b.display_order)
          .map((option) => {
            const optionText = option.option_text as LocalizedString;
            return {
              ...option,
              option_text: optionText[locale as keyof LocalizedString] || optionText.en,
            };
          }),
      };
    });

    return NextResponse.json(
      {
        questions: localizedQuestions,
        locale,
      } as QuestionsResponse,
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
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

export const revalidate = 3600;
