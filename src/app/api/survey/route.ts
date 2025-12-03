import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { CSRF_TOKEN_COOKIE_NAME, generateCsrfToken } from "@/lib/csrf";
import { supabase } from "@/lib/supabase";

// Schema for session creation request
const createSessionSchema = z.object({
  locale: z.enum(["en", "cs", "de"]).default("cs"),
});

// Response interface
export interface CreateSurveySessionResponse {
  success: boolean;
  session_id?: string;
  csrf_token?: string;
  questionnaire_id?: string;
  error?: string;
}

/**
 * POST /api/survey
 * Creates a new survey session with CSRF token
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
        } as CreateSurveySessionResponse,
        { status: 400 },
      );
    }

    const { locale } = validationResult.data;

    // Find active survey questionnaire
    const { data: questionnaireData, error: questionnaireError } = await (supabase as any)
      .from("questionnaires")
      .select("id")
      .eq("type", "survey")
      .eq("active", true)
      .maybeSingle();

    if (questionnaireError || !questionnaireData) {
      console.error("Error fetching survey questionnaire:", questionnaireError);
      return NextResponse.json(
        {
          success: false,
          error: "Survey questionnaire not found",
        } as CreateSurveySessionResponse,
        { status: 404 },
      );
    }

    // Generate CSRF token
    const csrfToken = generateCsrfToken();

    // Create session
    const sessionId = crypto.randomUUID();
    const { error: sessionError } = await (supabase as any)
      .from("sessions")
      .insert({
        session_id: sessionId,
        questionnaire_id: questionnaireData.id,
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
        } as CreateSurveySessionResponse,
        { status: 500 },
      );
    }

    // Create response with CSRF token in cookie
    const response = NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        csrf_token: csrfToken,
        questionnaire_id: questionnaireData.id,
      } as CreateSurveySessionResponse,
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
    console.error("Unexpected error in survey session creation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as CreateSurveySessionResponse,
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
