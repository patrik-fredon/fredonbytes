import { createClient, type RedisClientType } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://redis:6379';

let redisClient: RedisClientType | null = null;
let isConnecting = false;

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
      await new Promise(resolve => setTimeout(resolve, 100));
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
            console.error('[Redis] Max reconnection attempts (10) reached');
            return new Error('Max retries reached');
          }
          const delay = Math.min(retries * 100, 3000);
          console.log(`[Redis] Reconnecting... attempt ${retries}, delay ${delay}ms`);
          return delay;
        },
        connectTimeout: 10000,
      },
    });

    redisClient.on('error', (err) => {
      console.error('[Redis] Client error:', err);
    });

    redisClient.on('connect', () => {
      console.log('[Redis] Client connected');
    });

    redisClient.on('ready', () => {
      console.log('[Redis] Client ready');
    });

    redisClient.on('reconnecting', () => {
      console.log('[Redis] Client reconnecting...');
    });

    redisClient.on('end', () => {
      console.log('[Redis] Connection closed');
    });

    await redisClient.connect();
    console.log('[Redis] Successfully connected to', redisUrl);

    return redisClient;
  } catch (error) {
    console.error('[Redis] Failed to connect:', error);
    redisClient = null;
    throw error;
  } finally {
    isConnecting = false;
  }
}

/**
 * Get value from Redis cache
 * @param key Cache key
 * @returns Parsed JSON value or null if not found/error
 */
export async function redisGet<T = any>(key: string): Promise<T | null> {
  try {
    const client = await getRedisClient();
    const value = await client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value) as T;
  } catch (error) {
    console.error(`[Redis] GET error for key "${key}":`, error);
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
  value: any,
  expirySeconds?: number
): Promise<boolean> {
  try {
    const client = await getRedisClient();
    const serialized = JSON.stringify(value);

    if (expirySeconds) {
      await client.setEx(key, expirySeconds, serialized);
    } else {
      await client.set(key, serialized);
    }

    return true;
  } catch (error) {
    console.error(`[Redis] SET error for key "${key}":`, error);
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
    console.error('[Redis] DEL error:', error);
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
export async function redisExpire(key: string, seconds: number): Promise<boolean> {
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
    console.log('[Redis] Database flushed');
    return true;
  } catch (error) {
    console.error('[Redis] FLUSHDB error:', error);
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
    console.error('[Redis] INFO error:', error);
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
    return pong === 'PONG';
  } catch (error) {
    console.error('[Redis] PING error:', error);
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
      console.log('[Redis] Connection closed gracefully');
    }
  } catch (error) {
    console.error('[Redis] Disconnect error:', error);
  }
}

export { getRedisClient };
