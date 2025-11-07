import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import {
  CSRF_TOKEN_COOKIE_NAME,
  CSRF_TOKEN_HEADER_NAME,
  generateCsrfToken,
  validateCsrfToken,
} from "./lib/csrf";
import { domainConfig } from "./lib/domain-config";

// Environment configuration flags
const isDev = process.env.NODE_ENV !== "production";
const stripPort = !isDev || process.env.BEHIND_PROXY === "true";

// Simple dev-only logger
function debug(...args: unknown[]) {
  if (isDev) console.log("[Middleware]", ...args);
}

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
setInterval(
  () => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap.entries()) {
      if (now > entry.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  },
  5 * 60 * 1000,
);

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the rate limit key
  // Try multiple headers for IP detection (Vercel, Cloudflare, etc.)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor
    ? forwardedFor.split(",")[0]?.trim() || "unknown"
    : request.headers.get("x-real-ip") || "unknown";
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
  // DOMAIN REDIRECT LOGIC - Execute first, before any other middleware
  // Redirect secondary domains to primary domain (301 permanent redirect)
  const host = request.headers.get("host");

  // Debug logging for multi-domain setup
  debug(
    "Host:", host,
    "Primary:", domainConfig.primary,
    "Secondaries:", domainConfig.secondary,
    "Strategy:", domainConfig.strategy,
    "WillRedirect:", !!host && domainConfig.shouldRedirect(host)
  );

  if (host && domainConfig.shouldRedirect(host)) {
    // Extract protocol from configured site URL to ensure consistent HTTPS redirects
    const protocol = new URL(domainConfig.siteUrl).protocol.replace(":", "");
    const url = request.nextUrl.clone();

    // Construct redirect URL with primary domain
    // IMPORTANT: Use hostname (not host) to exclude port - critical for proxied/tunneled deployments
    url.protocol = protocol;
    url.hostname = domainConfig.primary;

    // Remove port when running behind a proxy or in production
    // This preserves local development workflows where port may be needed (e.g., localhost:3000)
    if (stripPort) {
      url.port = ""; // Remove port for clean URLs behind proxy/in production
    }

    debug("Redirecting →", url.toString());

    // 301 Permanent Redirect - SEO-friendly, tells search engines domain has moved
    return NextResponse.redirect(url, 301);
  }

  // Skip middleware for static metadata routes
  const pathname = request.nextUrl.pathname;
  if (
    pathname === "/manifest.webmanifest" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml"
  ) {
    return NextResponse.next();
  }

  // Handle API routes separately (CSRF + rate limiting)
  if (pathname.startsWith("/api/")) {
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Paths that don't require CSRF validation (session creation endpoints)
    const csrfExemptPaths = [
      "/api/form", // Form session creation
      "/api/survey", // Survey session creation
      "/api/cookies/consent", // Cookie consent
      "/api/analytics", // Analytics tracking
      "/api/share", // PWA share target
      "/api/open-file", // PWA file handler
    ];

    // Only check CSRF for state-changing methods (POST, PUT, DELETE, PATCH)
    // EXCEPT for session creation endpoints which generate CSRF tokens
    const requiresCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
    const isExempt = csrfExemptPaths.some(
      (exemptPath) => pathname === exemptPath,
    );

    if (requiresCsrf && !isExempt) {
      const csrfTokenFromCookie = request.cookies.get(
        CSRF_TOKEN_COOKIE_NAME,
      )?.value;
      const csrfTokenFromHeader = request.headers.get(CSRF_TOKEN_HEADER_NAME);

      // Validate CSRF token
      if (
        !validateCsrfToken(
          csrfTokenFromHeader || null,
          csrfTokenFromCookie || null,
        )
      ) {
        return NextResponse.json(
          {
            error: "CSRF validation failed",
            message: "Invalid or missing CSRF token",
          },
          { status: 403 },
        );
      }
    }

    // Apply rate limiting to all API routes (except health checks and PWA endpoints)
    const pwaEndpoints = [
      "/api/share",
      "/api/open-file",
      "/api/handle-protocol",
    ];
    const isPwaEndpoint = pwaEndpoints.some(
      (endpoint) => pathname === endpoint,
    );

    if (!request.nextUrl.pathname.startsWith("/api/health") && !isPwaEndpoint) {
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
          },
        );
      }

      // Add rate limit headers to successful responses
      const response = NextResponse.next();
      response.headers.set(
        "X-RateLimit-Limit",
        MAX_REQUESTS_PER_WINDOW.toString(),
      );
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set(
        "X-RateLimit-Reset",
        new Date(resetTime).toISOString(),
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
