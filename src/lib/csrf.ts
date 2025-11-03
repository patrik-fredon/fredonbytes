/**
 * CSRF (Cross-Site Request Forgery) protection utilities
 * Implements double-submit cookie pattern for CSRF protection
 */

// Using Web Crypto API for edge runtime compatibility

/**
 * Generate a random CSRF token
 */
export function generateCsrfToken(): string {
  // Use Web Crypto API for edge runtime compatibility
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

/**
 * Validate CSRF token from request against cookie
 * @param tokenFromRequest - Token from request header or body
 * @param tokenFromCookie - Token from cookie
 * @returns true if tokens match, false otherwise
 */
export function validateCsrfToken(
  tokenFromRequest: string | null,
  tokenFromCookie: string | null,
): boolean {
  if (!tokenFromRequest || !tokenFromCookie) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  if (tokenFromRequest.length !== tokenFromCookie.length) {
    return false;
  }

  // Constant-time string comparison
  let result = 0;
  for (let i = 0; i < tokenFromRequest.length; i++) {
    result |= tokenFromRequest.charCodeAt(i) ^ tokenFromCookie.charCodeAt(i);
  }

  return result === 0;
}

/**
 * CSRF token cookie name
 */
export const CSRF_TOKEN_COOKIE_NAME = "csrf_token";

/**
 * CSRF token header name
 */
export const CSRF_TOKEN_HEADER_NAME = "x-csrf-token";
