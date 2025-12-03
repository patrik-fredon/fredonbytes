import { createClient, type RedisClientType } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379";

let redisClient: RedisClientType | null = null;
let isConnecting = false;
let redisDownUntil: number | null = null;

/**
 * Get or create Redis client instance
 * Implements singleton pattern with automatic reconnection
 */
async function getRedisClient(): Promise<RedisClientType> {
  if (redisClient?.isOpen) {
    return redisClient;
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting) {
    // Wait for the connection to complete
    while (isConnecting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (redisClient?.isOpen) {
      return redisClient;
    }
  }

  isConnecting = true;

  try {
    redisClient = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error("[Redis] Max reconnection attempts (10) reached");
            return new Error("Max retries reached");
          }
          const delay = Math.min(retries * 100, 3000);
          console.log(
            `[Redis] Reconnecting... attempt ${retries}, delay ${delay}ms`,
          );
          return delay;
        },
        connectTimeout: 10000,
      },
    });

    redisClient.on("error", (err) => {
      console.error("[Redis] Client error:", err);
    });

    redisClient.on("connect", () => {
      console.log("[Redis] Client connected");
    });

    redisClient.on("ready", () => {
      console.log("[Redis] Client ready");
    });

    redisClient.on("reconnecting", () => {
      console.log("[Redis] Client reconnecting...");
    });

    redisClient.on("end", () => {
      console.log("[Redis] Connection closed");
    });

    await redisClient.connect();
    console.log("[Redis] Successfully connected to", redisUrl);

    return redisClient;
  } catch (error) {
    console.error("[Redis] Failed to connect:", error);
    redisClient = null;
    throw error;
  } finally {
    isConnecting = false;
  }
}

/**
 * Attempt to get a redis client but do not block requests for long.
 * Returns a client if available/open within `timeoutMs` or `null` when not.
 */
export async function getRedisClientOrNull(
  timeoutMs = 200,
): Promise<RedisClientType | null> {
  const CIRCUIT_BREAK_MS = parseInt(
    process.env.REDIS_CIRCUIT_BREAK_MS || "30000",
    10,
  );

  // Fast-fail when we recently detected Redis being down
  if (redisDownUntil && Date.now() < redisDownUntil) {
    console.log(
      `[Redis] Circuit open until ${new Date(redisDownUntil).toISOString()}`,
    );
    return null;
  }
  if (redisClient?.isOpen) return redisClient;

  // If a connection is already being attempted, wait briefly up to timeout
  if (isConnecting) {
    const step = 10;
    let waited = 0;
    while (isConnecting && waited < timeoutMs) {
      // quick sleep
      await new Promise((res) => setTimeout(res, step));
      waited += step;
    }

    if (redisClient?.isOpen) return redisClient;
    return null;
  }

  // Try to connect but bound the wait time to `timeoutMs`.
  try {
    const clientPromise = getRedisClient();
    const result = await Promise.race([
      clientPromise,
      new Promise<null>((res) => setTimeout(() => res(null), timeoutMs)),
    ]);

    return result as RedisClientType | null;
  } catch (error) {
    // Set circuit breaker to avoid repeated connection attempts
    redisDownUntil = Date.now() + CIRCUIT_BREAK_MS;
    console.error("[Redis] getRedisClientOrNull error:", error);
    return null;
  }
}

// Helper for operation timeouts
async function promiseWithTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  try {
    return await Promise.race([
      p,
      new Promise<T>((_, reject) => {
        timer = setTimeout(() => reject(new Error("Operation timed out")), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Get value from Redis cache
 * @param key Cache key
 * @returns Parsed JSON value or null if not found/error
 */
export async function redisGet<T = unknown>(key: string): Promise<T | null> {
  try {
    const OP_TIMEOUT_MS = parseInt(
      process.env.REDIS_OP_TIMEOUT_MS || "250",
      10,
    );

    const client = await getRedisClientOrNull(OP_TIMEOUT_MS);
    if (!client) return null;

    const value = await promiseWithTimeout(client.get(key), OP_TIMEOUT_MS);

    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.warn(`[Redis] GET error/timeout for key "${key}":`, error);
    return null;
  }
}

/**
 * Set value in Redis cache with optional expiry
 * @param key Cache key
 * @param value Value to cache (will be JSON stringified)
 * @param expirySeconds Optional TTL in seconds
 */
export async function redisSet(
  key: string,
  value: unknown,
  expirySeconds?: number,
): Promise<boolean> {
  try {
    const OP_TIMEOUT_MS = parseInt(
      process.env.REDIS_OP_TIMEOUT_MS || "250",
      10,
    );

    const client = await getRedisClientOrNull(OP_TIMEOUT_MS);
    if (!client) return false;
    const serialized = JSON.stringify(value);

    if (expirySeconds) {
      await promiseWithTimeout(
        client.setEx(key, expirySeconds, serialized),
        OP_TIMEOUT_MS,
      );
    } else {
      await promiseWithTimeout(client.set(key, serialized), OP_TIMEOUT_MS);
    }

    return true;
  } catch (error) {
    const CIRCUIT_BREAK_MS = parseInt(
      process.env.REDIS_CIRCUIT_BREAK_MS || "30000",
      10,
    );
    redisDownUntil = Date.now() + CIRCUIT_BREAK_MS;
    console.warn(`[Redis] SET error/timeout for key "${key}":`, error);
    return false;
  }
}

/**
 * Delete key(s) from Redis cache
 * @param keys Single key or array of keys to delete
 */
export async function redisDel(keys: string | string[]): Promise<number> {
  try {
    const client = await getRedisClient();
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const deleted = await client.del(keysArray);
    return deleted;
  } catch (error) {
    console.error("[Redis] DEL error:", error);
    return 0;
  }
}

/**
 * Check if key exists in Redis
 * @param key Cache key
 */
export async function redisExists(key: string): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const exists = await client.exists(key);
    return exists === 1;
  } catch (error) {
    console.error(`[Redis] EXISTS error for key "${key}":`, error);
    return false;
  }
}

/**
 * Set expiry time for existing key
 * @param key Cache key
 * @param seconds TTL in seconds
 */
export async function redisExpire(
  key: string,
  seconds: number,
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const result = await client.expire(key, seconds);
    return result;
  } catch (error) {
    console.error(`[Redis] EXPIRE error for key "${key}":`, error);
    return false;
  }
}

/**
 * Get remaining TTL for a key
 * @param key Cache key
 * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
 */
export async function redisTTL(key: string): Promise<number> {
  try {
    const client = await getRedisClient();
    return await client.ttl(key);
  } catch (error) {
    console.error(`[Redis] TTL error for key "${key}":`, error);
    return -2;
  }
}

/**
 * Flush entire Redis database (use with caution!)
 */
export async function redisFlush(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.flushDb();
    console.log("[Redis] Database flushed");
    return true;
  } catch (error) {
    console.error("[Redis] FLUSHDB error:", error);
    return false;
  }
}

/**
 * Get Redis info and statistics
 */
export async function redisInfo(section?: string): Promise<string | null> {
  try {
    const client = await getRedisClient();
    return await client.info(section);
  } catch (error) {
    console.error("[Redis] INFO error:", error);
    return null;
  }
}

/**
 * Ping Redis to check connection
 */
export async function redisPing(): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const pong = await client.ping();
    return pong === "PONG";
  } catch (error) {
    console.error("[Redis] PING error:", error);
    return false;
  }
}

/**
 * Gracefully close Redis connection
 */
export async function redisDisconnect(): Promise<void> {
  try {
    if (redisClient?.isOpen) {
      await redisClient.quit();
      redisClient = null;
      console.log("[Redis] Connection closed gracefully");
    }
  } catch (error) {
    console.error("[Redis] Disconnect error:", error);
  }
}

export { getRedisClient };
