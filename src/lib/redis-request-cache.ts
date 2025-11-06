import { redisGet, redisSet } from './redis';

/**
 * Redis-backed request cache with in-memory deduplication fallback
 *
 * This provides distributed caching across multiple application instances
 * while maintaining in-memory deduplication for concurrent requests.
 *
 * Features:
 * - Distributed cache via Redis (shared across instances)
 * - In-memory deduplication for concurrent identical requests
 * - Automatic fallback if Redis is unavailable
 * - Configurable TTL per cache entry
 */

const inMemoryCache = new Map<string, Promise<any>>();
const CLEANUP_DELAY_MS = 100;

export interface CacheOptions {
  /**
   * Time-to-live in seconds for Redis cache
   * @default 300 (5 minutes)
   */
  ttl?: number;

  /**
   * Prefix for cache key (useful for namespacing)
   * @default ''
   */
  prefix?: string;

  /**
   * Skip Redis and only use in-memory deduplication
   * @default false
   */
  skipRedis?: boolean;
}

/**
 * Get cached data or fetch and cache it
 *
 * @param cacheKey Unique cache key
 * @param fetchFn Function to fetch data if not cached
 * @param options Cache options (ttl, prefix, etc.)
 * @returns Cached or freshly fetched data
 *
 * @example
 * ```ts
 * const projects = await getCachedData(
 *   'projects:active',
 *   async () => {
 *     const { data } = await supabase.from('projects').select('*');
 *     return data;
 *   },
 *   { ttl: 3600, prefix: 'api' } // api:projects:active
 * );
 * ```
 */
export async function getCachedData<T>(
  cacheKey: string,
  fetchFn: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const {
    ttl = 300,
    prefix = '',
    skipRedis = false,
  } = options;

  const fullKey = prefix ? `${prefix}:${cacheKey}` : cacheKey;

  // Step 1: Try Redis cache (distributed)
  if (!skipRedis) {
    try {
      const cached = await redisGet<T>(fullKey);
      if (cached !== null) {
        console.log(`[Cache HIT] Redis: ${fullKey}`);
        return cached;
      }
    } catch (error) {
      console.warn(`[Cache MISS] Redis error for ${fullKey}, falling back to fetch`, error);
    }
  }

  // Step 2: Check in-memory cache for concurrent requests
  if (inMemoryCache.has(fullKey)) {
    console.log(`[Cache HIT] In-Memory: ${fullKey}`);
    return inMemoryCache.get(fullKey)! as Promise<T>;
  }

  // Step 3: Fetch data and cache it
  console.log(`[Cache MISS] Fetching: ${fullKey}`);

  const promise = fetchFn()
    .then(async (data) => {
      // Store in Redis for distributed cache
      if (!skipRedis) {
        try {
          await redisSet(fullKey, data, ttl);
          console.log(`[Cache SET] Redis: ${fullKey} (TTL: ${ttl}s)`);
        } catch (err) {
          console.error(`[Cache ERROR] Failed to cache in Redis:`, err);
        }
      }

      return data;
    })
    .catch((error) => {
      // Remove from in-memory cache on error
      inMemoryCache.delete(fullKey);
      throw error;
    });

  // Store promise in-memory for deduplication
  inMemoryCache.set(fullKey, promise);

  // Clean up in-memory cache after a short delay
  setTimeout(() => {
    inMemoryCache.delete(fullKey);
  }, CLEANUP_DELAY_MS);

  return promise;
}

/**
 * Invalidate cache entry
 *
 * @param cacheKey Cache key to invalidate
 * @param options Cache options (must match original prefix)
 */
export async function invalidateCache(
  cacheKey: string,
  options: Pick<CacheOptions, 'prefix'> = {}
): Promise<void> {
  const { prefix = '' } = options;
  const fullKey = prefix ? `${prefix}:${cacheKey}` : cacheKey;

  try {
    const { redisDel } = await import('./redis');
    await redisDel(fullKey);
    console.log(`[Cache INVALIDATE] ${fullKey}`);
  } catch (error) {
    console.error(`[Cache ERROR] Failed to invalidate ${fullKey}:`, error);
  }

  // Also remove from in-memory cache
  inMemoryCache.delete(fullKey);
}

/**
 * Invalidate multiple cache entries by pattern
 * Note: This is a simple implementation that requires exact keys.
 * For pattern matching, you'd need to use Redis SCAN + DEL
 *
 * @param cacheKeys Array of cache keys to invalidate
 * @param options Cache options (must match original prefix)
 */
export async function invalidateCacheMultiple(
  cacheKeys: string[],
  options: Pick<CacheOptions, 'prefix'> = {}
): Promise<void> {
  const { prefix = '' } = options;
  const fullKeys = cacheKeys.map(key => prefix ? `${prefix}:${key}` : key);

  try {
    const { redisDel } = await import('./redis');
    const deleted = await redisDel(fullKeys);
    console.log(`[Cache INVALIDATE] Deleted ${deleted} keys`);
  } catch (error) {
    console.error('[Cache ERROR] Failed to invalidate multiple keys:', error);
  }

  // Also remove from in-memory cache
  fullKeys.forEach(key => inMemoryCache.delete(key));
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    inMemoryCacheSize: inMemoryCache.size,
    inMemoryCacheKeys: Array.from(inMemoryCache.keys()),
  };
}

/**
 * Clear all in-memory cache (does not affect Redis)
 */
export function clearInMemoryCache(): void {
  inMemoryCache.clear();
  console.log('[Cache] In-memory cache cleared');
}
