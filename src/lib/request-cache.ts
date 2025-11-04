/**
 * Request deduplication cache for API routes
 * 
 * Prevents multiple concurrent identical requests from triggering duplicate
 * database queries. When multiple requests arrive simultaneously with the same
 * cache key, only one query executes and all requests share the same promise.
 * 
 * Cache automatically clears 100ms after request completes to prevent stale data.
 */

const requestCache = new Map<string, Promise<any>>();

/**
 * Deduplicate concurrent requests by cache key
 * 
 * @param key - Unique cache key for the request (e.g., "projects:status=active")
 * @param fetchFn - Function that performs the actual data fetch
 * @returns Promise resolving to the fetched data
 * 
 * @example
 * const data = await deduplicateRequest(
 *   `projects:${searchParams.toString()}`,
 *   async () => supabase.from("projects").select("*")
 * );
 */
export async function deduplicateRequest<T>(
  key: string,
  fetchFn: () => Promise<T>,
): Promise<T> {
  // Return existing promise if request is in-flight
  if (requestCache.has(key)) {
    return requestCache.get(key)!;
  }

  // Execute fetch and cache promise
  const promise = fetchFn().finally(() => {
    // Clear cache after 100ms to prevent stale data
    setTimeout(() => requestCache.delete(key), 100);
  });

  requestCache.set(key, promise);
  return promise;
}

/**
 * Get current cache size (for debugging/monitoring)
 */
export function getCacheSize(): number {
  return requestCache.size;
}

/**
 * Clear all cached requests (for testing/debugging)
 */
export function clearCache(): void {
  requestCache.clear();
}
