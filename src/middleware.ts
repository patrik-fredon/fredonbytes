import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import {
  generateCsrfToken,
  validateCsrfToken,
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
} from "./app/lib/csrf";
import { routing } from "./i18n/routing";

// Simple in-memory rate limiter
// In production, consider using Redis or a dedicated rate limiting service
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the rate limit key
  // Try multiple headers for IP detection (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip =
    forwardedFor ? (forwardedFor.split(",")[0]?.trim() || "unknown") :
    request.headers.get("x-real-ip") ||
    "unknown";
  const pathname = request.nextUrl.pathname;
  return `${ip}:${pathname}`;
}

function checkRateLimit(key: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    const resetTime = now + RATE_LIMIT_WINDOW_MS;
    rateLimitMap.set(key, { count: 1, resetTime });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  // Increment count
  entry.count++;
  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
    resetTime: entry.resetTime,
  };
}

// Create the next-intl middleware
const handleI18nRouting = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  // Handle API routes separately (CSRF + rate limiting)
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Paths that don't require CSRF validation (session creation endpoints)
    const csrfExemptPaths = [
      "/api/form", // Form session creation
      "/api/survey", // Survey session creation
      "/api/cookies/consent", // Cookie consent
      "/api/analytics", // Analytics tracking
    ];

    // Only check CSRF for state-changing methods (POST, PUT, DELETE, PATCH)
    // EXCEPT for session creation endpoints which generate CSRF tokens
    const requiresCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const isExempt = csrfExemptPaths.some(exemptPath => pathname === exemptPath);

    if (requiresCsrf && !isExempt) {
      const csrfTokenFromCookie = request.cookies.get(
        CSRF_TOKEN_COOKIE_NAME
      )?.value;
      const csrfTokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER_NAME);

      // Validate CSRF token
      if (
        !validateCsrfToken(
          csrfTokenFromHeader || null,
          csrfTokenFromCookie || null
        )
      ) {
        return NextResponse.json(
          {
            error: "CSRF validation failed",
            message: "Invalid or missing CSRF token",
          },
          { status: 403 }
        );
      }
    }

    // Apply rate limiting to all API routes (except health checks)
    if (!request.nextUrl.pathname.startsWith("/api/health")) {
      const key = getRateLimitKey(request);
      const { allowed, remaining, resetTime } = checkRateLimit(key);

      if (!allowed) {
        // Rate limit exceeded
        const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
        return NextResponse.json(
          {
            error: "Too many requests",
            message: "Rate limit exceeded. Please try again later.",
          },
          {
            status: 429,
            headers: {
              "Retry-After": retryAfter.toString(),
              "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": new Date(resetTime).toISOString(),
            },
          }
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set(
        "X-RateLimit-Limit",
        MAX_REQUESTS_PER_WINDOW.toString()
      );
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(resetTime).toISOString()
      );

      // Set CSRF token cookie if not present (for GET requests and API routes that need it)
      // NOT httpOnly so JavaScript can read it for x-csrf-token header (double-submit pattern)
      if (!request.cookies.get(CSRF_TOKEN_COOKIE_NAME)) {
        const newCsrfToken = generateCsrfToken();
        response.cookies.set(CSRF_TOKEN_COOKIE_NAME, newCsrfToken, {
          httpOnly: false, // Client needs to read this for x-csrf-token header
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24, // 24 hours
        });
      }

      return response;
    }

    return NextResponse.next();
  }

  // For all other routes, use next-intl middleware
  return handleI18nRouting(request);
}

// Configure which routes the middleware runs on
export const config = {
  matcher: ["/((?!_next|_vercel|.*..*).*)", "/api/:path*"],
};
