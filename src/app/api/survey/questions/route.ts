import { NextRequest, NextResponse } from "next/server";

import { supabase, type Question, type Questionnaire } from "@/lib/supabase";

// Response interface for survey questions endpoint
export interface SurveyQuestionsResponse {
  questions: Question[];
  locale: string;
  error?: string;
}

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const locale = searchParams.get("locale") || "en";

    // Validate locale
    if (!["en", "cs", "de"].includes(locale)) {
      return NextResponse.json(
        {
          questions: [],
          locale: "en",
          error: "Invalid locale",
        } as SurveyQuestionsResponse,
        { status: 400 },
      );
    }

    // Fetch the survey questionnaire
    const { data: questionnaireData, error: questionnaireError } =
      await supabase
        .from("questionnaires")
        .select("id")
        .eq("type", "survey")
        .eq("active", true)
        .maybeSingle();

    if (questionnaireError || !questionnaireData) {
      console.error("Error fetching survey questionnaire:", questionnaireError);
      return NextResponse.json(
        {
          questions: [],
          locale,
          error: "Survey questionnaire not found",
        } as SurveyQuestionsResponse,
        { status: 404 },
      );
    }

    const questionnaire = questionnaireData as Questionnaire;

    // Fetch active survey questions with their options
    const { data, error } = await supabase
      .from("questions")
      .select(`
        *,
        options:question_options(*)
      `)
      .eq("questionnaire_id", questionnaire.id)
      .eq("active", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Database error fetching survey questions:", error);
      return NextResponse.json(
        {
          questions: [],
          locale,
          error: "Failed to fetch survey questions from database",
        } as SurveyQuestionsResponse,
        { status: 500 },
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        {
          questions: [],
          locale,
        } as SurveyQuestionsResponse,
        { status: 200 },
      );
    }

    const questionsData = data as Question[];

    // Sort options by display_order for each question
    const questionsWithSortedOptions = questionsData.map((question) => ({
      ...question,
      options: question.options?.sort(
        (a, b) => a.display_order - b.display_order,
      ),
    }));

    // Return with no-cache headers (survey questions are session-specific)
    return NextResponse.json(
      {
        questions: questionsWithSortedOptions,
        locale,
      } as SurveyQuestionsResponse,
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("Unexpected error in survey questions endpoint:", error);
    return NextResponse.json(
      {
        questions: [],
        locale: "en",
        error: "Internal server error",
      } as SurveyQuestionsResponse,
      { status: 500 },
    );
  }
}
