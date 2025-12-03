/**
 * POST /api/form/upload
 *
 * Handles image uploads for form answers
 * - CSRF protection
 * - File size validation (5MB per file, 50MB per session)
 * - Session validation
 * - Supabase storage upload
 * - Metadata tracking in form_answer_images
 */

import { type NextRequest, NextResponse } from "next/server";
import { logError } from "@/lib/error-logger";
import {
  generateUniqueFileName,
  validateImageFile,
  validateSessionTotalSize,
} from "@/lib/form-image-utils";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for large uploads

interface UploadResponse {
  success: boolean;
  image_url?: string;
  file_size?: number;
  error?: string;
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<UploadResponse>> {
  try {
    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("session_id") as string | null;
    const questionId = formData.get("question_id") as string | null;

    // Validate required fields
    if (!file || !sessionId || !questionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // CSRF validation already handled by middleware
    // Middleware checks: x-csrf-token header matches csrf_token cookie
    // This endpoint is protected because it's a POST request not in csrfExemptPaths

    // Validate session exists and not expired
    const { data: session, error: sessionError } = await (supabase as any)
      .from("sessions")
      .select("session_id, expires_at")
      .eq("session_id", sessionId)
      .single<{ session_id: string; expires_at: string }>();

    if (sessionError || !session) {
      logError("SessionValidation", new Error("Invalid or expired session"), {
        sessionId,
      });
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 404 },
      );
    }

    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 410 },
      );
    }

    // Validate file
    const fileValidation = validateImageFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 },
      );
    }

    // Check current session total size
    const { data: currentImages } = await (supabase as any)
      .from("form_answer_images")
      .select("file_size")
      .eq("session_id", sessionId)
      .returns<Array<{ file_size: number }>>();

    const currentTotalSize =
      currentImages?.reduce((sum, img) => sum + img.file_size, 0) || 0;

    // Validate session total size
    const sizeValidation = validateSessionTotalSize(
      currentTotalSize,
      file.size,
    );
    if (!sizeValidation.valid) {
      return NextResponse.json(
        { success: false, error: sizeValidation.error },
        { status: 413 },
      );
    }

    // Generate unique file path
    const uniqueFileName = generateUniqueFileName(file.name);
    const filePath = `${sessionId}/${questionId}/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("form-uploads")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      logError("StorageUpload", uploadError, {
        sessionId,
        questionId,
        filePath,
      });
      return NextResponse.json(
        { success: false, error: "Failed to upload image" },
        { status: 500 },
      );
    }

    // Get public URL (or signed URL for private bucket)
    const { data: urlData } = supabase.storage
      .from("form-uploads")
      .getPublicUrl(filePath);

    const imageUrl = urlData.publicUrl;

    // Store metadata in form_answer_images table
    const { error: metadataError } = await (supabase as any)
      .from("form_answer_images")
      .insert({
        session_id: sessionId,
        question_id: questionId,
        image_url: imageUrl,
        file_size: file.size,
        mime_type: file.type,
        original_filename: file.name,
      } as any);

    if (metadataError) {
      // Attempt to delete uploaded file if metadata insert fails
      await supabase.storage.from("form-uploads").remove([filePath]);

      logError("MetadataInsert", metadataError, { sessionId, questionId });
      return NextResponse.json(
        { success: false, error: "Failed to save image metadata" },
        { status: 500 },
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        image_url: imageUrl,
        file_size: file.size,
      },
      { status: 200 },
    );
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("Unknown error during upload");
    logError("ImageUpload", err, {});

    return NextResponse.json(
      { success: false, error: "Internal server error during upload" },
      { status: 500 },
    );
  }
}
