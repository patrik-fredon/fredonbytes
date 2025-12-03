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
