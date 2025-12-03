/**
 * POST /api/upload/files
 *
 * Handles file uploads for client projects
 * - CSRF protection (via middleware)
 * - File size validation (5MB per file, 100MB per session)
 * - Max files validation (20 per session)
 * - Session validation
 * - Supabase storage upload to client-uploads bucket
 * - Metadata tracking in uploaded_files table
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/error-logger";
import {
  validateUploadFile,
  validateSessionLimits,
  generateUniqueUploadFileName,
  MAX_FILES_PER_SESSION,
} from "@/lib/upload-file-utils";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface UploadFilesResponse {
  success: boolean;
  file_url?: string;
  file_size?: number;
  file_count?: number;
  error?: string;
}


export async function POST(
  request: NextRequest,
): Promise<NextResponse<UploadFilesResponse>> {
  try {
    // Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("session_id") as string | null;

    // Validate required fields
    if (!file || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate session exists and not expired
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: session, error: sessionError } = await (supabase as any)
      .from("upload_sessions")
      .select("session_id, project_id, file_count, total_size_bytes, expires_at")
      .eq("session_id", sessionId)
      .single() as { data: {
        session_id: string;
        project_id: string;
        file_count: number;
        total_size_bytes: number;
        expires_at: string;
      } | null; error: Error | null };

    if (sessionError || !session) {
      logError("UploadSessionValidation", new Error("Invalid session"), { sessionId });
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

    // Validate file type and size
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 },
      );
    }

    // Validate session limits (file count and total size)
    const limitsValidation = validateSessionLimits(
      session.file_count,
      session.total_size_bytes,
      file.size,
    );
    if (!limitsValidation.valid) {
      return NextResponse.json(
        { success: false, error: limitsValidation.error },
        { status: 413 },
      );
    }


    // Generate unique file path: {project_id}/{session_id}/{unique_filename}
    const uniqueFileName = generateUniqueUploadFileName(file.name);
    const filePath = `${session.project_id}/${sessionId}/${uniqueFileName}`;

    // Upload to Supabase Storage (client-uploads bucket)
    const { error: uploadError } = await supabase.storage
      .from("client-uploads")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      logError("ClientStorageUpload", uploadError, { sessionId, filePath });
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 },
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("client-uploads")
      .getPublicUrl(filePath);

    const fileUrl = urlData.publicUrl;


    // Store metadata in uploaded_files table
    // Note: trigger will update upload_sessions.file_count and total_size_bytes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: metadataError } = await (supabase as any)
      .from("uploaded_files")
      .insert({
        session_id: sessionId,
        project_id: session.project_id,
        file_url: fileUrl,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        original_filename: file.name,
      });

    if (metadataError) {
      // Cleanup: delete uploaded file if metadata insert fails
      await supabase.storage.from("client-uploads").remove([filePath]);
      logError("UploadMetadataInsert", metadataError, { sessionId });
      return NextResponse.json(
        { success: false, error: "Failed to save file metadata" },
        { status: 500 },
      );
    }

    // Success
    return NextResponse.json(
      {
        success: true,
        file_url: fileUrl,
        file_size: file.size,
        file_count: session.file_count + 1,
      },
      { status: 200 },
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown upload error");
    logError("ClientFileUpload", err, {});
    return NextResponse.json(
      { success: false, error: "Internal server error during upload" },
      { status: 500 },
    );
  }
}
