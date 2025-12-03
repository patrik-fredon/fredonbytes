import { getRedisClient } from "./redis";

/**
 * Cache invalidation utilities for Redis-backed caching system
 *
 * Use these functions when data is updated in Supabase to ensure
 * cached data stays fresh and accurate.
 */

/**
 * Invalidate all projects cache entries
 *
 * Call this after:
 * - Creating/updating/deleting a project
 * - Changing project visibility, status, category, or featured flag
 *
 * @example
 * ```ts
 * await supabase.from('projects').update({ status: 'completed' }).eq('id', projectId);
 * await invalidateProjectsCache();
 * ```
 */
export async function invalidateProjectsCache(): Promise<void> {
  try {
    const client = await getRedisClient();
    const pattern = "api:projects:*";

    // Get all keys matching the pattern
    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      console.log(
        `[Cache Invalidation] Deleted ${keys.length} projects cache entries`,
      );
    } else {
      console.log("[Cache Invalidation] No projects cache entries to delete");
    }
  } catch (error) {
    console.error(
      "[Cache Invalidation] Failed to invalidate projects cache:",
      error,
    );
  }
}

/**
 * Invalidate all pricing tiers cache entries
 *
 * Call this after:
 * - Creating/updating/deleting a pricing tier
 * - Changing tier active status, type, or popular flag
 *
 * @example
 * ```ts
 * await supabase.from('pricing_tiers').update({ popular: true }).eq('id', tierId);
 * await invalidatePricingTiersCache();
 * ```
 */
export async function invalidatePricingTiersCache(): Promise<void> {
  try {
    const client = await getRedisClient();
    const pattern = "api:pricing-tiers:*";

    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      console.log(
        `[Cache Invalidation] Deleted ${keys.length} pricing tiers cache entries`,
      );
    } else {
      console.log(
        "[Cache Invalidation] No pricing tiers cache entries to delete",
      );
    }
  } catch (error) {
    console.error(
      "[Cache Invalidation] Failed to invalidate pricing tiers cache:",
      error,
    );
  }
}

/**
 * Invalidate all pricing items cache entries
 *
 * Call this after:
 * - Creating/updating/deleting a pricing item
 * - Changing item active status, category, or price
 *
 * @example
 * ```ts
 * await supabase.from('pricing_items').update({ base_price_eur: 99 }).eq('id', itemId);
 * await invalidatePricingItemsCache();
 * ```
 */
export async function invalidatePricingItemsCache(): Promise<void> {
  try {
    const client = await getRedisClient();
    const pattern = "api:pricing-items:*";

    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      console.log(
        `[Cache Invalidation] Deleted ${keys.length} pricing items cache entries`,
      );
    } else {
      console.log(
        "[Cache Invalidation] No pricing items cache entries to delete",
      );
    }
  } catch (error) {
    console.error(
      "[Cache Invalidation] Failed to invalidate pricing items cache:",
      error,
    );
  }
}

/**
 * Invalidate all technologies cache
 *
 * Call this after:
 * - Creating/updating/deleting a technology
 * - Changing technology category or name
 *
 * @example
 * ```ts
 * await supabase.from('technologies').insert({ name: 'Next.js 15', category: 'framework' });
 * await invalidateTechnologiesCache();
 * ```
 */
export async function invalidateTechnologiesCache(): Promise<void> {
  try {
    const client = await getRedisClient();
    const pattern = "api:technologies:*";

    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      console.log(
        `[Cache Invalidation] Deleted ${keys.length} technologies cache entries`,
      );
    } else {
      console.log(
        "[Cache Invalidation] No technologies cache entries to delete",
      );
    }
  } catch (error) {
    console.error(
      "[Cache Invalidation] Failed to invalidate technologies cache:",
      error,
    );
  }
}

/**
 * Invalidate all API caches at once
 *
 * Use with caution! Only call this when you need a complete cache refresh,
 * such as after a major data migration or deployment.
 *
 * @example
 * ```ts
 * await invalidateAllApiCaches();
 * ```
 */
export async function invalidateAllApiCaches(): Promise<void> {
  try {
    const client = await getRedisClient();
    const pattern = "api:*";

    const keys = await client.keys(pattern);

    if (keys.length > 0) {
      await client.del(keys);
      console.log(
        `[Cache Invalidation] Deleted ${keys.length} total API cache entries`,
      );
    } else {
      console.log("[Cache Invalidation] No API cache entries to delete");
    }
  } catch (error) {
    console.error(
      "[Cache Invalidation] Failed to invalidate all API caches:",
      error,
    );
  }
}

/**
 * Invalidate specific cache key
 *
 * Use this for targeted invalidation when you know the exact cache key.
 *
 * @param fullKey The complete cache key including prefix
 *
 * @example
 * ```ts
 * await invalidateSpecificCache('api:projects:status=active');
 * ```
 */
export async function invalidateSpecificCache(fullKey: string): Promise<void> {
  try {
    const client = await getRedisClient();
    const deleted = await client.del(fullKey);

    if (deleted > 0) {
      console.log(`[Cache Invalidation] Deleted cache key: ${fullKey}`);
    } else {
      console.log(`[Cache Invalidation] Cache key not found: ${fullKey}`);
    }
  } catch (error) {
    console.error(
      `[Cache Invalidation] Failed to invalidate ${fullKey}:`,
      error,
    );
  }
}

/**
 * Get all cached API keys (for debugging)
 *
 * @returns Array of cache keys
 */
export async function getAllApiCacheKeys(): Promise<string[]> {
  try {
    const client = await getRedisClient();
    return await client.keys("api:*");
  } catch (error) {
    console.error("[Cache] Failed to get cache keys:", error);
    return [];
  }
}

/**
 * Get cache statistics
 *
 * @returns Object with cache statistics
 */
export async function getCacheStatistics(): Promise<{
  totalKeys: number;
  projects: number;
  pricingTiers: number;
  pricingItems: number;
  technologies: number;
  other: number;
}> {
  try {
    const client = await getRedisClient();

    const [
      allKeys,
      projectsKeys,
      pricingTiersKeys,
      pricingItemsKeys,
      technologiesKeys,
    ] = await Promise.all([
      client.keys("api:*"),
      client.keys("api:projects:*"),
      client.keys("api:pricing-tiers:*"),
      client.keys("api:pricing-items:*"),
      client.keys("api:technologies:*"),
    ]);

    return {
      totalKeys: allKeys.length,
      projects: projectsKeys.length,
      pricingTiers: pricingTiersKeys.length,
      pricingItems: pricingItemsKeys.length,
      technologies: technologiesKeys.length,
      other:
        allKeys.length -
        projectsKeys.length -
        pricingTiersKeys.length -
        pricingItemsKeys.length -
        technologiesKeys.length,
    };
  } catch (error) {
    console.error("[Cache] Failed to get cache statistics:", error);
    return {
      totalKeys: 0,
      projects: 0,
      pricingTiers: 0,
      pricingItems: 0,
      technologies: 0,
      other: 0,
    };
  }
}
