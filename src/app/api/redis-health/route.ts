import { NextResponse } from "next/server";
import { getCacheStatistics } from "@/lib/cache-invalidation";
import { redisInfo, redisPing } from "@/lib/redis";

/**
 * Redis health check endpoint
 *
 * Returns Redis connection status and cache statistics
 *
 * @example
 * GET /api/redis-health
 *
 * Response (healthy):
 * {
 *   "status": "healthy",
 *   "redis": {
 *     "connected": true,
 *     "ping": "PONG"
 *   },
 *   "cache": {
 *     "totalKeys": 15,
 *     "projects": 5,
 *     "pricingTiers": 3,
 *     "pricingItems": 4,
 *     "technologies": 1,
 *     "other": 2
 *   },
 *   "timestamp": "2025-11-06T23:00:00.000Z"
 * }
 */
export async function GET() {
  try {
    // Check Redis connection
    const isConnected = await redisPing();

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "unhealthy",
          redis: {
            connected: false,
            error: "Failed to connect to Redis",
          },
          timestamp: new Date().toISOString(),
        },
        { status: 503 },
      );
    }

    // Get cache statistics
    const cacheStats = await getCacheStatistics();

    // Get Redis info (optional, can be expensive)
    const info = await redisInfo("stats");
    const memoryInfo = await redisInfo("memory");

    // Parse Redis info for useful metrics
    const parseRedisInfo = (infoString: string | null) => {
      if (!infoString) return {};

      const lines = infoString.split("\r\n");
      const metrics: Record<string, string> = {};

      for (const line of lines) {
        if (line && !line.startsWith("#")) {
          const [key, value] = line.split(":");
          if (key && value) {
            metrics[key] = value;
          }
        }
      }

      return metrics;
    };

    const statsMetrics = parseRedisInfo(info);
    const memoryMetrics = parseRedisInfo(memoryInfo);

    return NextResponse.json(
      {
        status: "healthy",
        redis: {
          connected: true,
          ping: "PONG",
          version: statsMetrics.redis_version,
        },
        cache: cacheStats,
        memory: {
          usedMemory: memoryMetrics.used_memory_human,
          usedMemoryPeak: memoryMetrics.used_memory_peak_human,
          maxMemory: memoryMetrics.maxmemory_human || "256MB",
        },
        stats: {
          totalConnectionsReceived: statsMetrics.total_connections_received,
          totalCommandsProcessed: statsMetrics.total_commands_processed,
          instantaneousOpsPerSec: statsMetrics.instantaneous_ops_per_sec,
        },
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, must-revalidate",
        },
      },
    );
  } catch (error) {
    console.error("[Redis Health] Error:", error);

    return NextResponse.json(
      {
        status: "error",
        redis: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown error",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
