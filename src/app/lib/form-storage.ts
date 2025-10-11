import type { AnswerValue } from './supabase';

// Storage key prefix for form data
const STORAGE_KEY = 'fredonbytes_form_data';

// Expiration time in milliseconds (24 hours)
const EXPIRATION_HOURS = 24;
const EXPIRATION_MS = EXPIRATION_HOURS * 60 * 60 * 1000;

// localStorage data structure
export interface LocalStorageData {
  session_id: string;
  answers: Record<string, AnswerValue>;
  timestamp: number;
  expiresAt: number;
}

/**
 * Check if localStorage is available in the current environment
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    // Test if we can actually use it
    const testKey = '__test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get the storage key for a specific session
 */
function getStorageKey(sessionId: string): string {
  return `${STORAGE_KEY}_${sessionId}`;
}

/**
 * Create a new storage data structure
 */
export function createNewStorageData(sessionId: string): LocalStorageData {
  const now = Date.now();
  return {
    session_id: sessionId,
    answers: {},
    timestamp: now,
    expiresAt: now + EXPIRATION_MS,
  };
}

/**
 * Get storage data for a specific session
 */
function getStorageData(sessionId: string): LocalStorageData | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const key = getStorageKey(sessionId);
    const stored = window.localStorage.getItem(key);
    
    if (!stored) {
      return null;
    }

    const data: LocalStorageData = JSON.parse(stored);
    
    // Validate data structure
    if (!data.session_id || !data.answers || !data.expiresAt) {
      console.warn('[FormStorage] Invalid data structure, clearing storage');
      clearStorageData(sessionId);
      return null;
    }

    return data;
  } catch (error) {
    console.error('[FormStorage] Error reading from localStorage:', error);
    return null;
  }
}

/**
 * Save an individual answer to localStorage
 * @param sessionId - The session ID
 * @param questionId - The question ID
 * @param value - The answer value
 */
export function saveAnswer(
  sessionId: string,
  questionId: string,
  value: AnswerValue
): void {
  if (!isLocalStorageAvailable()) {
    console.warn('[FormStorage] localStorage is not available');
    return;
  }

  try {
    // Get existing data or create new
    let data = getStorageData(sessionId);
    
    if (!data) {
      data = createNewStorageData(sessionId);
    }

    // Update the answer
    data.answers[questionId] = value;
    data.timestamp = Date.now();

    // Save to localStorage
    const key = getStorageKey(sessionId);
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    // Handle QuotaExceededError
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.error('[FormStorage] localStorage quota exceeded');
      // Optionally, try to clear old data and retry
      // For now, just log the error
    } else {
      console.error('[FormStorage] Error saving to localStorage:', error);
    }
  }
}

/**
 * Load all answers for a session with expiration check
 * @param sessionId - The session ID
 * @returns The answers object or null if expired/not found
 */
export function loadAnswers(sessionId: string): Record<string, AnswerValue> | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const data = getStorageData(sessionId);
    
    if (!data) {
      return null;
    }

    // Check expiration
    if (Date.now() > data.expiresAt) {
      clearStorageData(sessionId);
      return null;
    }

    return data.answers;
  } catch (error) {
    console.error('[FormStorage] Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear storage data for a specific session
 * @param sessionId - The session ID
 */
export function clearStorageData(sessionId: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const key = getStorageKey(sessionId);
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error('[FormStorage] Error clearing localStorage:', error);
  }
}

/**
 * Get all form session keys from localStorage (for cleanup purposes)
 */
export function getAllFormSessionKeys(): string[] {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(STORAGE_KEY)) {
        keys.push(key);
      }
    }
    return keys;
  } catch (error) {
    console.error('[FormStorage] Error getting session keys:', error);
    return [];
  }
}

/**
 * Clear all expired form data from localStorage
 */
export function clearExpiredData(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    const keys = getAllFormSessionKeys();
    const now = Date.now();

    keys.forEach((key) => {
      try {
        const stored = window.localStorage.getItem(key);
        if (stored) {
          const data: LocalStorageData = JSON.parse(stored);
          if (now > data.expiresAt) {
            window.localStorage.removeItem(key);
          }
        }
      } catch {
        // If we can't parse it, remove it
        window.localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('[FormStorage] Error clearing expired data:', error);
  }
}
