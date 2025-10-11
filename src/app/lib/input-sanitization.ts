/**
 * Input sanitization utilities for form submissions
 * Prevents XSS attacks by sanitizing user input
 */

/**
 * Sanitize a string by removing potentially dangerous HTML/script content
 * This is a basic implementation - for production, consider using DOMPurify
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');

  // Remove script tags and their content
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length to prevent DoS
  const MAX_LENGTH = 10000;
  if (sanitized.length > MAX_LENGTH) {
    sanitized = sanitized.substring(0, MAX_LENGTH);
  }

  return sanitized;
}

/**
 * Sanitize an array of strings
 */
export function sanitizeStringArray(input: string[]): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .filter((item) => typeof item === 'string')
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0); // Remove empty strings after sanitization
}

/**
 * Sanitize answer value (can be string or string array)
 */
export function sanitizeAnswerValue(value: string | string[]): string | string[] {
  if (typeof value === 'string') {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return sanitizeStringArray(value);
  }

  return '';
}

/**
 * Validate and sanitize session ID (must be valid UUID)
 */
export function sanitizeSessionId(sessionId: string): string | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (typeof sessionId !== 'string' || !uuidRegex.test(sessionId)) {
    return null;
  }

  return sessionId.toLowerCase();
}

/**
 * Validate and sanitize question ID (must be valid UUID)
 */
export function sanitizeQuestionId(questionId: string): string | null {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (typeof questionId !== 'string' || !uuidRegex.test(questionId)) {
    return null;
  }

  return questionId.toLowerCase();
}
