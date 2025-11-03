import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateCsrfToken, CSRF_TOKEN_COOKIE_NAME } from "@/lib/csrf";
import { supabase, type Question, type LocalizedString } from "@/lib/supabase";

// Schema for session creation request
const createSessionSchema = z.object({
  locale: z.enum(["en", "cs", "de"]).default("cs"),
});

// Localized question interface (same as in questions/route.ts)
export interface LocalizedQuestion {
  id: string;
  question_text: string;
  description?: string | null;
  answer_type:
    | "short_text"
    | "long_text"
    | "single_choice"
    | "multiple_choice"
    | "checklist"
    | "rating"
    | "image";
  required: boolean;
  display_order: number;
  active: boolean;
  options?: LocalizedQuestionOption[];
}

export interface LocalizedQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  display_order: number;
}

// Response interface
export interface CreateFormSessionResponse {
  success: boolean;
  session_id?: string;
  csrf_token?: string;
  questionnaire_id?: string;
  questions?: LocalizedQuestion[]; // NEW: Preloaded questions
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
          error: "Invalid request data",
        } as CreateFormSessionResponse,
        { status: 400 },
      );
    }

    const { locale } = validationResult.data;

    // Find active form questionnaire
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: questionnaireData, error: questionnaireError } = await (
      supabase as any
    )
      .from("questionnaires")
      .select("id")
      .eq("type", "form")
      .eq("active", true)
      .maybeSingle();

    if (questionnaireError || !questionnaireData) {
      console.error("Error fetching form questionnaire:", questionnaireError);
      return NextResponse.json(
        {
          success: false,
          error: "Form questionnaire not found",
        } as CreateFormSessionResponse,
        { status: 404 },
      );
    }

    // Generate CSRF token
    const csrfToken = generateCsrfToken();

    // Create session
    const sessionId = crypto.randomUUID();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: sessionError } = await (supabase as any)
      .from("sessions")
      .insert({
        session_id: sessionId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        questionnaire_id: (questionnaireData as any).id,
        locale,
        csrf_token: csrfToken,
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
      });

    if (sessionError) {
      console.error("Error creating session:", sessionError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create session",
        } as CreateFormSessionResponse,
        { status: 500 },
      );
    }

    // Fetch questions for locale to preload (solves blank container issue)
    const questionnaireId = (questionnaireData as any).id;
    const { data: questionsData, error: questionsError } = await supabase
      .from("questions")
      .select(`
        id,
        question_text,
        description,
        answer_type,
        required,
        display_order,
        active,
        options:question_options(id, question_id, option_text, display_order)
      `)
      .eq("questionnaire_id", questionnaireId)
      .eq("active", true)
      .order("display_order", { ascending: true });

    let localizedQuestions: LocalizedQuestion[] = [];

    if (!questionsError && questionsData) {
      // Helper to extract localized string
      const getLocalizedString = (str: LocalizedString | string): string => {
        if (typeof str === "string") return str;
        return str[locale as keyof LocalizedString] || str.en || "";
      };

      localizedQuestions = (questionsData as Question[]).map((q) => ({
        id: q.id,
        question_text: getLocalizedString(q.question_text),
        description: q.description ? getLocalizedString(q.description) : null,
        answer_type: q.answer_type as LocalizedQuestion["answer_type"],
        required: q.required,
        display_order: q.display_order,
        active: q.active,
        options: q.options
          ?.map((opt) => ({
            id: opt.id,
            question_id: opt.question_id,
            option_text: getLocalizedString(opt.option_text),
            display_order: opt.display_order,
          }))
          .sort((a, b) => a.display_order - b.display_order),
      }));
    }

    // Create response with CSRF token in cookie AND preloaded questions
    const response = NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        csrf_token: csrfToken,
        questionnaire_id: questionnaireId,
        questions: localizedQuestions, // NEW: Preloaded for immediate use
      } as CreateFormSessionResponse,
      { status: 201 },
    );

    // Set CSRF token cookie (NOT httpOnly so client can read it for header)
    // This is safe because we validate both cookie AND header match (double-submit pattern)
    response.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      httpOnly: false, // Client needs to read this for x-csrf-token header
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 48 * 60 * 60, // 48 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error in form session creation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as CreateFormSessionResponse,
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
