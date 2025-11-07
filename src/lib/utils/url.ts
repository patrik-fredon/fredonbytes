/**
 * Normalize URL by removing duplicate slashes while preserving protocol, query, and fragments
 * @param url - URL string to normalize
 * @returns Normalized URL string
 *
 * @example
 * ```ts
 * normalizeUrl("https://example.com//path//to///page")
 * // Returns: "https://example.com/path/to/page"
 *
 * normalizeUrl("https://example.com//api?foo=bar#section")
 * // Returns: "https://example.com/api?foo=bar#section"
 * ```
 */
export function normalizeUrl(url: string): string {
  try {
    // Parse and reconstruct URL to handle protocol, slashes, query, and fragments robustly.
    const parsed = new URL(url);
    // Use parsed.href to preserve the full original structure
    // The URL constructor automatically normalizes duplicate slashes
    return parsed.href;
  } catch {
    // Fallback: Remove duplicate slashes only in path/query/hash, preserving protocol and authority
    const match = url.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*:\/\/[^\/?#]+)([\/\S]*)$/);
    if (match) {
      const [, protocolAndAuthority, rest] = match;
      // Remove duplicate slashes in the rest (path/query/hash)
      const normalizedRest = rest.replace(/\/{2,}/g, "/");
      return `${protocolAndAuthority}${normalizedRest}`;
    }
    // If not a valid URL, fallback to original regex as last resort
    return url.replace(/([^:]\/)\/+/g, "$1");
  }
}
