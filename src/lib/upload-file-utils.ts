/**
 * Upload File Utilities
 *
 * Utilities for handling client file uploads:
 * - File size validation (5MB per file, 100MB per session)
 * - MIME type checking (images + documents)
 * - Max files per session (20)
 * - Formatted size display
 */

// Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
export const MAX_SESSION_SIZE = 100 * 1024 * 1024; // 100MB per session
export const MAX_FILES_PER_SESSION = 20;

export const ALLOWED_FILE_TYPES = [
  // Images
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const FILE_TYPE_LABELS: Record<string, string> = {
  "image/jpeg": "JPEG",
  "image/jpg": "JPEG",
  "image/png": "PNG",
  "image/gif": "GIF",
  "image/webp": "WebP",
  "application/pdf": "PDF",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "DOCX",
  "text/plain": "TXT",
};

/**
 * Validation result interface
 */
export interface UploadValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate individual upload file size and type
 */
export function validateUploadFile(file: File): UploadValidationResult {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    const allowedLabels = [...new Set(Object.values(FILE_TYPE_LABELS))].join(
      ", ",
    );
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${allowedLabels}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
}

/**
 * Validate session total size and file count
 */
export function validateSessionLimits(
  currentFileCount: number,
  currentTotalSize: number,
  newFileSize: number,
): UploadValidationResult {
  if (currentFileCount >= MAX_FILES_PER_SESSION) {
    return {
      valid: false,
      error: `Maximum ${MAX_FILES_PER_SESSION} files per session`,
    };
  }

  const totalSize = currentTotalSize + newFileSize;
  if (totalSize > MAX_SESSION_SIZE) {
    const remaining = MAX_SESSION_SIZE - currentTotalSize;
    return {
      valid: false,
      error: `Session limit exceeded. ${formatFileSize(remaining)} remaining`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes into human-readable size string
 */
export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Generate unique file name for storage
 */
export function generateUniqueUploadFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, "_");
  return `${timestamp}_${random}_${sanitized}`;
}

/**
 * Sanitize filename for safe storage
 */
export function sanitizeFileName(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 200);
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  return lastDot > 0 ? filename.slice(lastDot).toLowerCase() : "";
}

/**
 * Check if file is an image based on MIME type
 */
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

/**
 * Check if file is a document based on MIME type
 */
export function isDocumentFile(mimeType: string): boolean {
  return (
    mimeType === "application/pdf" ||
    mimeType === "application/msword" ||
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "text/plain"
  );
}
