import { redisGet, redisSet, redisDel, redisExpire } from './redis';

/**
 * Redis-based session cache store
 *
 * Provides faster session storage compared to database storage,
 * suitable for form/survey sessions and temporary user data.
 */

export interface SessionData {
  sessionId: string;
  type: 'form' | 'survey';
  locale: string;
  userId?: string;
  createdAt: number;
  expiresAt: number;
  lastAccessed: number;
  data: Record<string, any>;
}

// Session TTL: 48 hours (172800 seconds)
const SESSION_TTL_SECONDS = 48 * 60 * 60;

/**
 * Generate session cache key
 */
function getSessionKey(sessionId: string, type: 'form' | 'survey'): string {
  return `session:${type}:${sessionId}`;
}

/**
 * Store session data in Redis
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 * @param data Session data to store
 * @param ttlSeconds Optional custom TTL (defaults to 48 hours)
 *
 * @example
 * ```ts
 * await setSessionData('abc123', 'form', {
 *   locale: 'en',
 *   answers: { question1: 'answer1' },
 *   currentStep: 2
 * });
 * ```
 */
export async function setSessionData(
  sessionId: string,
  type: 'form' | 'survey',
  data: Omit<SessionData, 'sessionId' | 'type'>,
  ttlSeconds: number = SESSION_TTL_SECONDS
): Promise<boolean> {
  try {
    const key = getSessionKey(sessionId, type);
    const sessionData: SessionData = {
      sessionId,
      type,
      ...data,
      lastAccessed: Date.now(),
    };

    const success = await redisSet(key, sessionData, ttlSeconds);

    if (success) {
      console.log(`[Session Cache] SET ${key} (TTL: ${ttlSeconds}s)`);
    }

    return success;
  } catch (error) {
    console.error(`[Session Cache] Failed to set session ${sessionId}:`, error);
    return false;
  }
}

/**
 * Get session data from Redis
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 * @returns Session data or null if not found/expired
 *
 * @example
 * ```ts
 * const session = await getSessionData('abc123', 'form');
 * if (session) {
 *   console.log('Current step:', session.data.currentStep);
 * }
 * ```
 */
export async function getSessionData(
  sessionId: string,
  type: 'form' | 'survey'
): Promise<SessionData | null> {
  try {
    const key = getSessionKey(sessionId, type);
    const sessionData = await redisGet<SessionData>(key);

    if (sessionData) {
      console.log(`[Session Cache] HIT ${key}`);

      // Update last accessed time
      sessionData.lastAccessed = Date.now();
      await redisSet(key, sessionData, SESSION_TTL_SECONDS);

      return sessionData;
    }

    console.log(`[Session Cache] MISS ${key}`);
    return null;
  } catch (error) {
    console.error(`[Session Cache] Failed to get session ${sessionId}:`, error);
    return null;
  }
}

/**
 * Update session data (merge with existing)
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 * @param updates Partial data to merge with existing session
 *
 * @example
 * ```ts
 * await updateSessionData('abc123', 'form', {
 *   data: {
 *     currentStep: 3,
 *     answers: { question2: 'answer2' }
 *   }
 * });
 * ```
 */
export async function updateSessionData(
  sessionId: string,
  type: 'form' | 'survey',
  updates: Partial<Omit<SessionData, 'sessionId' | 'type'>>
): Promise<boolean> {
  try {
    const existing = await getSessionData(sessionId, type);

    if (!existing) {
      console.warn(`[Session Cache] Cannot update non-existent session ${sessionId}`);
      return false;
    }

    const updatedData: SessionData = {
      ...existing,
      ...updates,
      sessionId,
      type,
      lastAccessed: Date.now(),
    };

    return await setSessionData(sessionId, type, updatedData);
  } catch (error) {
    console.error(`[Session Cache] Failed to update session ${sessionId}:`, error);
    return false;
  }
}

/**
 * Delete session data from Redis
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 *
 * @example
 * ```ts
 * await deleteSessionData('abc123', 'form');
 * ```
 */
export async function deleteSessionData(
  sessionId: string,
  type: 'form' | 'survey'
): Promise<boolean> {
  try {
    const key = getSessionKey(sessionId, type);
    const deleted = await redisDel(key);

    if (deleted > 0) {
      console.log(`[Session Cache] DELETED ${key}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`[Session Cache] Failed to delete session ${sessionId}:`, error);
    return false;
  }
}

/**
 * Extend session TTL
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 * @param ttlSeconds New TTL in seconds (defaults to 48 hours)
 *
 * @example
 * ```ts
 * // Extend session for another 48 hours
 * await extendSessionTTL('abc123', 'form');
 * ```
 */
export async function extendSessionTTL(
  sessionId: string,
  type: 'form' | 'survey',
  ttlSeconds: number = SESSION_TTL_SECONDS
): Promise<boolean> {
  try {
    const key = getSessionKey(sessionId, type);
    const success = await redisExpire(key, ttlSeconds);

    if (success) {
      console.log(`[Session Cache] EXTENDED TTL for ${key} to ${ttlSeconds}s`);
    }

    return success;
  } catch (error) {
    console.error(`[Session Cache] Failed to extend session ${sessionId}:`, error);
    return false;
  }
}

/**
 * Check if session exists
 *
 * @param sessionId Unique session identifier
 * @param type Session type (form or survey)
 *
 * @example
 * ```ts
 * if (await sessionExists('abc123', 'form')) {
 *   console.log('Session is valid');
 * }
 * ```
 */
export async function sessionExists(
  sessionId: string,
  type: 'form' | 'survey'
): Promise<boolean> {
  const session = await getSessionData(sessionId, type);
  return session !== null;
}

/**
 * Get all active sessions (for debugging/admin)
 *
 * WARNING: This can be expensive if you have many sessions.
 * Use sparingly and only in development/admin contexts.
 *
 * @param type Optional session type filter
 * @returns Array of session IDs
 */
export async function getAllSessionIds(
  type?: 'form' | 'survey'
): Promise<string[]> {
  try {
    const { getRedisClient } = await import('./redis');
    const client = await getRedisClient();

    const pattern = type ? `session:${type}:*` : 'session:*';
    const keys = await client.keys(pattern);

    // Extract session IDs from keys
    return keys.map(key => {
      const parts = key.split(':');
      return parts[parts.length - 1];
    });
  } catch (error) {
    console.error('[Session Cache] Failed to get all session IDs:', error);
    return [];
  }
}
