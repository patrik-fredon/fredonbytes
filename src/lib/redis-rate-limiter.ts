import { getRedisClient } from './redis';

/**
 * Redis-based distributed rate limiter
 *
 * Provides consistent rate limiting across multiple application instances.
 * Uses sliding window algorithm with Redis sorted sets.
 */

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the window
   * @default 10
   */
  maxRequests?: number;

  /**
   * Time window in milliseconds
   * @default 60000 (1 minute)
   */
  windowMs?: number;

  /**
   * Key prefix for namespacing
   * @default 'rate-limit'
   */
  prefix?: string;
}

const DEFAULT_MAX_REQUESTS = 10;
const DEFAULT_WINDOW_MS = 60 * 1000; // 1 minute
const DEFAULT_PREFIX = 'rate-limit';

/**
 * Check rate limit for a given identifier (e.g., IP address, user ID)
 *
 * @param identifier Unique identifier to rate limit (IP, user ID, etc.)
 * @param config Rate limit configuration
 * @returns Rate limit result with allowed status and metadata
 *
 * @example
 * ```ts
 * const result = await checkRateLimit(ipAddress, {
 *   maxRequests: 10,
 *   windowMs: 60000, // 1 minute
 *   prefix: 'api'
 * });
 *
 * if (!result.allowed) {
 *   return NextResponse.json(
 *     { error: 'Rate limit exceeded' },
 *     {
 *       status: 429,
 *       headers: {
 *         'X-RateLimit-Limit': result.limit.toString(),
 *         'X-RateLimit-Remaining': result.remaining.toString(),
 *         'X-RateLimit-Reset': result.resetTime.toString(),
 *         'Retry-After': result.retryAfter?.toString() || '60',
 *       }
 *     }
 *   );
 * }
 * ```
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {}
): Promise<RateLimitResult> {
  const {
    maxRequests = DEFAULT_MAX_REQUESTS,
    windowMs = DEFAULT_WINDOW_MS,
    prefix = DEFAULT_PREFIX,
  } = config;

  try {
    const client = await getRedisClient();
    const now = Date.now();
    const windowStart = now - windowMs;
    const key = `${prefix}:${identifier}`;

    // Remove old entries outside the current window
    await client.zRemRangeByScore(key, '-inf', windowStart);

    // Count requests in current window
    const count = await client.zCard(key);

    if (count >= maxRequests) {
      // Get the oldest request timestamp
      const oldestRequests = await client.zRangeWithScores(key, 0, 0);

      const oldestTimestamp = oldestRequests.length > 0
        ? oldestRequests[0].score
        : now;

      const resetTime = oldestTimestamp + windowMs;
      const retryAfter = Math.ceil((resetTime - now) / 1000);

      return {
        allowed: false,
        limit: maxRequests,
        remaining: 0,
        resetTime,
        retryAfter,
      };
    }

    // Add current request with unique member (timestamp + random to prevent duplicates)
    const member = `${now}-${Math.random().toString(36).substring(2, 15)}`;
    await client.zAdd(key, {
      score: now,
      value: member,
    });

    // Set expiry on the key (cleanup)
    await client.expire(key, Math.ceil(windowMs / 1000) + 10);

    const remaining = maxRequests - count - 1;
    const resetTime = now + windowMs;

    return {
      allowed: true,
      limit: maxRequests,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error('[Rate Limiter] Error checking rate limit:', error);

    // On error, allow the request (fail open)
    // In production, you might want to fail closed instead
    return {
      allowed: true,
      limit: maxRequests,
      remaining: -1,
      resetTime: Date.now() + windowMs,
    };
  }
}

/**
 * Reset rate limit for a specific identifier
 *
 * @param identifier Unique identifier to reset
 * @param prefix Key prefix (must match original rate limit prefix)
 *
 * @example
 * ```ts
 * // Reset rate limit for an IP
 * await resetRateLimit(ipAddress, 'api');
 * ```
 */
export async function resetRateLimit(
  identifier: string,
  prefix: string = DEFAULT_PREFIX
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const key = `${prefix}:${identifier}`;
    const deleted = await client.del(key);

    if (deleted > 0) {
      console.log(`[Rate Limiter] Reset rate limit for ${key}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`[Rate Limiter] Failed to reset rate limit for ${identifier}:`, error);
    return false;
  }
}

/**
 * Get current rate limit status without incrementing counter
 *
 * @param identifier Unique identifier to check
 * @param config Rate limit configuration
 * @returns Current rate limit status
 *
 * @example
 * ```ts
 * const status = await getRateLimitStatus(ipAddress);
 * console.log(`Remaining requests: ${status.remaining}`);
 * ```
 */
export async function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = {}
): Promise<Omit<RateLimitResult, 'allowed'>> {
  const {
    maxRequests = DEFAULT_MAX_REQUESTS,
    windowMs = DEFAULT_WINDOW_MS,
    prefix = DEFAULT_PREFIX,
  } = config;

  try {
    const client = await getRedisClient();
    const now = Date.now();
    const windowStart = now - windowMs;
    const key = `${prefix}:${identifier}`;

    // Count requests in current window
    const count = await client.zCount(key, windowStart, '+inf');

    const remaining = Math.max(0, maxRequests - count);
    const resetTime = now + windowMs;

    return {
      limit: maxRequests,
      remaining,
      resetTime,
    };
  } catch (error) {
    console.error('[Rate Limiter] Error getting rate limit status:', error);
    return {
      limit: maxRequests,
      remaining: maxRequests,
      resetTime: Date.now() + windowMs,
    };
  }
}

/**
 * Middleware helper to add rate limit headers to response
 *
 * @param result Rate limit result from checkRateLimit
 * @returns Headers object to merge with response headers
 *
 * @example
 * ```ts
 * const rateLimitResult = await checkRateLimit(ipAddress);
 * const headers = getRateLimitHeaders(rateLimitResult);
 *
 * return NextResponse.json(data, {
 *   headers: {
 *     ...headers,
 *     'Content-Type': 'application/json'
 *   }
 * });
 * ```
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.resetTime.toString(),
  };

  if (!result.allowed && result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }

  return headers;
}

/**
 * Batch reset rate limits for multiple identifiers
 *
 * @param identifiers Array of identifiers to reset
 * @param prefix Key prefix (must match original rate limit prefix)
 *
 * @example
 * ```ts
 * await batchResetRateLimits(['192.168.1.1', '192.168.1.2'], 'api');
 * ```
 */
export async function batchResetRateLimits(
  identifiers: string[],
  prefix: string = DEFAULT_PREFIX
): Promise<number> {
  try {
    const client = await getRedisClient();
    const keys = identifiers.map(id => `${prefix}:${id}`);

    if (keys.length === 0) {
      return 0;
    }

    const deleted = await client.del(keys);
    console.log(`[Rate Limiter] Batch reset ${deleted} rate limits`);

    return deleted;
  } catch (error) {
    console.error('[Rate Limiter] Failed to batch reset rate limits:', error);
    return 0;
  }
}
