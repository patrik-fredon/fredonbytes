"use client";

import { useReportWebVitals } from "next/web-vitals";
import { useRef } from "react";

/**
 * Web Vitals Performance Monitoring Component
 *
 * Tracks and reports Core Web Vitals metrics:
 * - FCP (First Contentful Paint)
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - INP (Interaction to Next Paint)
 * - TTFB (Time to First Byte)
 *
 * Features:
 * - Console grouping for better readability
 * - Rate limiting to reduce console spam
 * - Production analytics endpoint integration
 * - Conditional logging via environment variable
 */

const ENABLE_WEB_VITALS_LOGGING =
  process.env.NEXT_PUBLIC_ENABLE_WEB_VITALS_LOGGING !== "false";

export function WebVitals() {
  // Track metrics to avoid duplicate logging
  const loggedMetrics = useRef(new Set<string>());
  const lastLogTime = useRef(0);

  useReportWebVitals((metric) => {
    // Skip if logging is disabled
    if (!ENABLE_WEB_VITALS_LOGGING) {
      return;
    }

    // Create unique key for this metric (name + id to handle multiple navigations)
    const metricKey = `${metric.name}-${metric.id}`;

    // Skip if already logged (prevents duplicate logs)
    if (loggedMetrics.current.has(metricKey)) {
      return;
    }

    // Rate limiting: max 1 log per 100ms to prevent console spam
    const now = Date.now();
    if (now - lastLogTime.current < 100) {
      return;
    }

    // Mark as logged
    loggedMetrics.current.add(metricKey);
    lastLogTime.current = now;

    // Clean up old entries (keep last 50 to prevent memory leak)
    if (loggedMetrics.current.size > 50) {
      const entries = Array.from(loggedMetrics.current);
      loggedMetrics.current = new Set(entries.slice(-50));
    }

    // Development: Log to console with grouping
    if (process.env.NODE_ENV === "development") {
      console.groupCollapsed(
        `%c⚡ Web Vitals: ${metric.name} %c${metric.rating}`,
        "color: #00D9FF; font-weight: bold;",
        getRatingColor(metric.rating),
      );
      console.table({
        Value: formatValue(metric.name, metric.value),
        Rating: metric.rating,
        Delta: formatValue(metric.name, metric.delta),
        ID: `${metric.id.substring(0, 12)}...`,
      });
      console.groupEnd();
    }

    // Production: Send to analytics endpoint
    if (process.env.NODE_ENV === "production") {
      const body = JSON.stringify(metric);
      const url = "/api/analytics";

      // Use sendBeacon if available for better reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(url, body);
      } else {
        // Fallback to fetch with keepalive
        fetch(url, {
          body,
          method: "POST",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
          },
        }).catch(() => {
          // Silently fail to avoid disrupting user experience
        });
      }
    }
  });

  return null;
}

/**
 * Get color for rating display
 */
function getRatingColor(rating: string): string {
  switch (rating) {
    case "good":
      return "color: #22c55e; font-weight: bold;"; // green
    case "needs-improvement":
      return "color: #f59e0b; font-weight: bold;"; // orange
    case "poor":
      return "color: #ef4444; font-weight: bold;"; // red
    default:
      return "color: #94a3b8;"; // gray
  }
}

/**
 * Format metric value based on type
 */
function formatValue(name: string, value: number): string {
  // Time-based metrics (ms)
  if (["FCP", "LCP", "FID", "INP", "TTFB"].includes(name)) {
    return `${Math.round(value)}ms`;
  }
  // CLS is unitless
  if (name === "CLS") {
    return value.toFixed(4);
  }
  // Default
  return value.toString();
}
