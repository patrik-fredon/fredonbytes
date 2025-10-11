/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Implements double-submit cookie pattern for CSRF protection
 */

import { randomBytes } from 'crypto';

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  return randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token from request against cookie
 * @param tokenFromRequest - Token from request header or body
 * @param tokenFromCookie - Token from cookie
 * @returns true if tokens match, false otherwise
 */
export function validateCsrfToken(
  tokenFromRequest: string | null,
  tokenFromCookie: string | null
): boolean {
  if (!tokenFromRequest || !tokenFromCookie) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (tokenFromRequest.length !== tokenFromCookie.length) {
    return false;
  }

  // Convert to buffers for constant-time comparison
  const bufferRequest = Buffer.from(tokenFromRequest, 'utf-8');
  const bufferCookie = Buffer.from(tokenFromCookie, 'utf-8');

  // Use crypto.timingSafeEqual for constant-time comparison
  try {
    // Dynamic import for Node.js crypto module
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crypto = require('crypto');
    return crypto.timingSafeEqual(bufferRequest, bufferCookie);
  } catch {
    return false;
  }
}

/**
 * CSRF token cookie name
 */
export const CSRF_TOKEN_COOKIE_NAME = 'csrf_token';

/**
 * CSRF token header name
 */
export const CSRF_TOKEN_HEADER_NAME = 'x-csrf-token';
