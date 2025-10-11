import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

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
  const ip = 
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';
  const pathname = request.nextUrl.pathname;
  return `${ip}:${pathname}`;
}

function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetTime: number } {
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
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count, resetTime: entry.resetTime };
}

export function middleware(request: NextRequest) {
  // Handle locale detection from query parameter
  const langParam = request.nextUrl.searchParams.get('lang');
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // Determine the locale to use
  let locale: string = routing.defaultLocale;
  if (langParam && routing.locales.includes(langParam as any)) {
    locale = langParam as string;
  } else if (cookieLocale && routing.locales.includes(cookieLocale as any)) {
    locale = cookieLocale as string;
  }
  
  // Create response
  const response = NextResponse.next();
  
  // Set locale cookie if it changed
  if (locale !== cookieLocale) {
    response.cookies.set('NEXT_LOCALE', locale, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    });
  }
  
  // Set locale header for next-intl
  response.headers.set('x-next-intl-locale', locale);
  
  // Only apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/form')) {
    const key = getRateLimitKey(request);
    const { allowed, remaining, resetTime } = checkRateLimit(key);

    if (!allowed) {
      // Rate limit exceeded
      const retryAfter = Math.ceil((resetTime - Date.now()) / 1000);
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(resetTime).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW.toString());
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(resetTime).toISOString());
    return response;
  }

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\..*).*)',
    // However, match all pathnames within `/api/form`
    '/api/form/:path*'
  ],
};
