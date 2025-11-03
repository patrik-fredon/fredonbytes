/**
 * Form Image Utilities
 * 
 * Utilities for handling image uploads in the form system:
 * - File size validation (5MB per file, 50MB per session)
 * - MIME type checking
 * - Formatted size display
 * - Session total size tracking
 */

// Constants
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const MAX_SESSION_SIZE = 50 * 1024 * 1024; // 50MB in bytes
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate individual image file size and type
 * 
 * @param file - File object to validate
 * @returns Validation result with error message if invalid
 */
export function validateImageFile(file: File): ValidationResult {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check MIME type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Please upload an image (${ALLOWED_IMAGE_TYPES.map(t => t.split('/')[1]).join(', ')})`,
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${getFormattedSize(MAX_FILE_SIZE)}`,
    };
  }

  return { valid: true };
}

/**
 * Validate total session image size
 * 
 * @param currentSize - Current total size in bytes
 * @param newFileSize - New file size to add in bytes
 * @returns Validation result with error message if exceeds limit
 */
export function validateSessionTotalSize(
  currentSize: number,
  newFileSize: number
): ValidationResult {
  const totalSize = currentSize + newFileSize;

  if (totalSize > MAX_SESSION_SIZE) {
    const remaining = MAX_SESSION_SIZE - currentSize;
    return {
      valid: false,
      error: `Session upload limit would be exceeded. ${getFormattedSize(remaining)} remaining of ${getFormattedSize(MAX_SESSION_SIZE)} total`,
    };
  }

  return { valid: true };
}

/**
 * Format bytes into human-readable size string
 * 
 * @param bytes - Size in bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "5.2 MB"
 */
export function getFormattedSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Calculate remaining upload capacity for session
 * 
 * @param currentSize - Current total size in bytes
 * @returns Remaining bytes available for upload
 */
export function getRemainingSize(currentSize: number): number {
  return Math.max(0, MAX_SESSION_SIZE - currentSize);
}

/**
 * Get upload progress percentage
 * 
 * @param uploadedBytes - Bytes uploaded so far
 * @param totalBytes - Total bytes to upload
 * @returns Progress percentage (0-100)
 */
export function getUploadProgress(uploadedBytes: number, totalBytes: number): number {
  if (totalBytes === 0) return 0;
  return Math.min(100, Math.round((uploadedBytes / totalBytes) * 100));
}

/**
 * Generate unique file name for storage
 * 
 * @param originalName - Original file name
 * @returns Unique file name with timestamp
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${timestamp}_${sanitized}`;
}

/**
 * Extract file extension from filename
 * 
 * @param filename - File name
 * @returns Extension with dot (e.g., ".jpg") or empty string
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  return lastDot > 0 ? filename.slice(lastDot) : '';
}
