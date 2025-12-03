import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateCsrfToken, CSRF_TOKEN_COOKIE_NAME } from "@/lib/csrf";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/redis-rate-limiter";

// Schema for session creation request
const createUploadSessionSchema = z.object({
  project_id: z.string().uuid(),
  password: z.string().min(1),
  locale: z.enum(["en", "cs", "de"]).default("cs"),
});

// Response interface
export interface CreateUploadSessionResponse {
  success: boolean;
  session_id?: string;
  csrf_token?: string;
  project_title?: string;
  error?: string;
}

/**
 * POST /api/upload
 * Creates a new upload session with project password validation
 */
export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor
      ? forwardedFor.split(",")[0]?.trim() || "unknown"
      : request.headers.get("x-real-ip") || "unknown";

    // Strict rate limiting for password attempts (5 per minute per IP)
    const rateLimitResult = await checkRateLimit(`upload_auth:${ip}`, {
      maxRequests: 5,
      windowMs: 60 * 1000,
      prefix: "upload_auth",
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many attempts. Please try again later.",
        } as CreateUploadSessionResponse,
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        }
      );
    }

    const body = await request.json();
    const validationResult = createUploadSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        } as CreateUploadSessionResponse,
        { status: 400 }
      );
    }

    const { project_id, password, locale } = validationResult.data;

    // Fetch project and validate password
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, title, upload_password, visible")
      .eq("id", project_id)
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        {
          success: false,
          error: "Project not found",
        } as CreateUploadSessionResponse,
        { status: 404 }
      );
    }

    // Check if project allows uploads (has password set)
    if (!project.upload_password) {
      return NextResponse.json(
        {
          success: false,
          error: "Uploads not enabled for this project",
        } as CreateUploadSessionResponse,
        { status: 403 }
      );
    }

    // Validate password (plain text comparison)
    if (project.upload_password !== password) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        } as CreateUploadSessionResponse,
        { status: 401 }
      );
    }

    // Generate session ID and CSRF token
    const csrfToken = generateCsrfToken();
    const sessionId = crypto.randomUUID();

    // Create upload session
    const { error: sessionError } = await supabase
      .from("upload_sessions")
      .insert({
        session_id: sessionId,
        project_id: project_id,
        locale,
        file_count: 0,
        total_size_bytes: 0,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });

    if (sessionError) {
      console.error("Error creating upload session:", sessionError);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to create session",
        } as CreateUploadSessionResponse,
        { status: 500 }
      );
    }

    // Get project title for display
    const projectTitle =
      typeof project.title === "object"
        ? project.title[locale as keyof typeof project.title] ||
          project.title.en ||
          "Project"
        : project.title;

    // Create response with CSRF token
    const response = NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        csrf_token: csrfToken,
        project_title: projectTitle,
      } as CreateUploadSessionResponse,
      { status: 201 }
    );

    // Set CSRF token cookie
    response.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error in upload session creation:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      } as CreateUploadSessionResponse,
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
