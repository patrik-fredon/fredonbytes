import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { CSRF_TOKEN_COOKIE_NAME, generateCsrfToken } from "@/lib/csrf";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/redis-rate-limiter";
import { supabase } from "@/lib/supabase";

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
  project_id?: string;
  project_title?: string;
  error?: string;
}

/**
 * POST /api/upload
 * Creates a new upload session with project password validation
 */
export async function POST(
  request: NextRequest,
): Promise<NextResponse<CreateUploadSessionResponse>> {
  try {
    // Rate limiting for brute-force protection (5 attempts/min per IP)
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = await checkRateLimit(`upload_auth:${ip}`, {
      maxRequests: 5,
      windowMs: 60 * 1000, // 1 minute
      prefix: "rl",
    });

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult),
        },
      );
    }

    const body = await request.json();
    const validationResult = createUploadSessionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 },
      );
    }

    const { project_id, password, locale } = validationResult.data;

    // Fetch project and validate password
    const { data: project, error: projectError } = await (supabase as any)
      .from("projects")
      .select("id, title, upload_password")
      .eq("id", project_id)
      .eq("visible", true)
      .single() as {
        data: {
          id: string;
          title: string | Record<string, string>;
          upload_password: string | null;
        } | null;
        error: Error | null;
      };

    if (projectError || !project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 },
      );
    }

    // Check if upload is enabled for this project
    if (!project.upload_password) {
      return NextResponse.json(
        { success: false, error: "Uploads not enabled for this project" },
        { status: 403 },
      );
    }

    // Validate password (plain text comparison)
    if (project.upload_password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 },
      );
    }

    // Generate CSRF token and session ID
    const csrfToken = generateCsrfToken();
    const sessionId = crypto.randomUUID();

    // Create upload session
    const { error: sessionError } = await (supabase as any)
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
        { success: false, error: "Failed to create session" },
        { status: 500 },
      );
    }

    // Extract localized title
    const projectTitle =
      typeof project.title === "object"
        ? (project.title as Record<string, string>)[locale] ||
        (project.title as Record<string, string>).en ||
        "Project"
        : String(project.title);

    // Create response with CSRF token
    const response = NextResponse.json(
      {
        success: true,
        session_id: sessionId,
        csrf_token: csrfToken,
        project_id: project_id,
        project_title: projectTitle,
      },
      { status: 201 },
    );

    // Set CSRF token cookie
    response.cookies.set(CSRF_TOKEN_COOKIE_NAME, csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Unexpected error in upload session creation:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
