/**
 * Session Cache Utilities for Form and Survey
 * Provides localStorage caching with 24h TTL
 */

export interface CachedSessionData {
  timestamp: number;
  locale: string;
  sessionId: string;
  questionnaireId?: string;
  questions?: any[];
  answers: Record<string, any>;
  csrfToken?: string;
  currentStep?: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Generate cache key for a session
 */
function getCacheKey(type: 'form' | 'survey', sessionId: string): string {
  return `${type}_session_${sessionId}`;
}

/**
 * Check if cached data is still valid (within TTL)
 */
function isValid(data: CachedSessionData): boolean {
  const now = Date.now();
  return now - data.timestamp < CACHE_TTL;
}

/**
 * Save session data to localStorage
 */
export function saveToCache(
  type: 'form' | 'survey',
  sessionId: string,
  data: Partial<CachedSessionData>
): void {
  try {
    const existing = loadFromCache(type, sessionId);
    const cacheData: CachedSessionData = {
      ...existing,
      ...data,
      timestamp: Date.now(),
      sessionId,
    } as CachedSessionData;

    const key = getCacheKey(type, sessionId);
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

/**
 * Load session data from localStorage
 * Returns null if cache is expired or doesn't exist
 */
export function loadFromCache(
  type: 'form' | 'survey',
  sessionId: string
): CachedSessionData | null {
  try {
    const key = getCacheKey(type, sessionId);
    const cached = localStorage.getItem(key);

    if (!cached) {
      return null;
    }

    const data: CachedSessionData = JSON.parse(cached);

    if (!isValid(data)) {
      // Remove expired cache
      clearCache(type, sessionId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error loading from cache:', error);
    return null;
  }
}

/**
 * Update answers in cache
 */
export function updateAnswers(
  type: 'form' | 'survey',
  sessionId: string,
  answers: Record<string, any>
): void {
  saveToCache(type, sessionId, { answers });
}

/**
 * Update current step in cache
 */
export function updateStep(
  type: 'form' | 'survey',
  sessionId: string,
  step: number
): void {
  saveToCache(type, sessionId, { currentStep: step });
}

/**
 * Clear specific session cache
 */
export function clearCache(type: 'form' | 'survey', sessionId: string): void {
  try {
    const key = getCacheKey(type, sessionId);
    localStorage.removeItem(key);
    
    // Also remove CSRF token
    localStorage.removeItem(`${type}_csrf_${sessionId}`);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

/**
 * Clear all expired caches
 */
export function clearExpiredCaches(): void {
  try {
    const keys = Object.keys(localStorage);
    const sessionKeys = keys.filter(
      key => key.startsWith('form_session_') || key.startsWith('survey_session_')
    );

    sessionKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const data: CachedSessionData = JSON.parse(cached);
          if (!isValid(data)) {
            localStorage.removeItem(key);
          }
        }
      } catch (error) {
        // Invalid JSON, remove it
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing expired caches:', error);
  }
}

/**
 * Get CSRF token from localStorage
 */
export function getCsrfToken(type: 'form' | 'survey', sessionId: string): string | null {
  try {
    return localStorage.getItem(`${type}_csrf_${sessionId}`);
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
}

/**
 * Save CSRF token to localStorage
 */
export function saveCsrfToken(
  type: 'form' | 'survey',
  sessionId: string,
  token: string
): void {
  try {
    localStorage.setItem(`${type}_csrf_${sessionId}`, token);
  } catch (error) {
    console.error('Error saving CSRF token:', error);
  }
}
