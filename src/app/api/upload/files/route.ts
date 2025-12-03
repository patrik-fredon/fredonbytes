import { NextRequest, NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import { logError } from "@/lib/error-logger";
import {
  validateUploadFile,
  validateSessionFileCount,
  validateSessionTotalSize,
  generateUniqueFileName,
  MAX_FILES_PER_SESSION,
} from "@/lib/upload-file-utils";

// Response interface
export interface UploadFileResponse {
  success: boolean;
  file_url?: string;
  file_size?: number;
  error?: string;
}

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * POST /api/upload/files
 * Upload a file to the client-uploads bucket
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<UploadFileResponse>> {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const sessionId = formData.get("session_id") as string | null;

    // Validate required fields
    if (!file || !sessionId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate session exists and is not expired
    const { data: session, error: sessionError } = await supabase
      .from("upload_sessions")
      .select("session_id, project_id, file_count, total_size_bytes, expires_at")
      .eq("session_id", sessionId)
      .single();

    if (sessionError || !session) {
      logError("UploadSessionValidation", new Error("Invalid session"), {
        sessionId,
      });
      return NextResponse.json(
        { success: false, error: "Invalid or expired session" },
        { status: 404 }
      );
    }

    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: "Session expired" },
        { status: 410 }
      );
    }

    // Validate file
    const fileValidation = validateUploadFile(file);
    if (!fileValidation.valid) {
      return NextResponse.json(
        { success: false, error: fileValidation.error },
        { status: 400 }
      );
    }

    // Validate file count
    const countValidation = validateSessionFileCount(session.file_count);
    if (!countValidation.valid) {
      return NextResponse.json(
        { success: false, error: countValidation.error },
        { status: 400 }
      );
    }

    // Validate session total size
    const sizeValidation = validateSessionTotalSize(
      session.total_size_bytes,
      file.size
    );
    if (!sizeValidation.valid) {
      return NextResponse.json(
        { success: false, error: sizeValidation.error },
        { status: 413 }
      );
    }

    // Generate unique file path
    const uniqueFileName = generateUniqueFileName(file.name);
    const filePath = `${session.project_id}/${sessionId}/${uniqueFileName}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("client-uploads")
      .upload(filePath, file, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      logError("StorageUpload", uploadError, {
        sessionId,
        filePath,
      });
      return NextResponse.json(
        { success: false, error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Get file URL (signed URL for private bucket)
    const { data: urlData } = await supabase.storage
      .from("client-uploads")
      .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 days

    const fileUrl = urlData?.signedUrl || filePath;

    // Store metadata in uploaded_files table
    const { error: metadataError } = await supabase
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
      // Attempt to delete uploaded file if metadata insert fails
      await supabase.storage.from("client-uploads").remove([filePath]);

      logError("MetadataInsert", metadataError, { sessionId });
      return NextResponse.json(
        { success: false, error: "Failed to save file metadata" },
        { status: 500 }
      );
    }

    // Success - session stats are updated by database trigger
    return NextResponse.json(
      {
        success: true,
        file_url: fileUrl,
        file_size: file.size,
      },
      { status: 200 }
    );
  } catch (error) {
    const err =
      error instanceof Error ? error : new Error("Unknown error during upload");
    logError("FileUpload", err, {});

    return NextResponse.json(
      { success: false, error: "Internal server error during upload" },
      { status: 500 }
    );
  }
}
