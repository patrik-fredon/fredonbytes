"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      // Using console.warn for development visibility (ESLint allows warn/error)
      console.warn("[Web Vitals]", {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    }

    // Send to analytics in production
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
        }).catch((error) => {
          // Silently fail to avoid disrupting user experience
          console.error("Failed to send Web Vitals:", error);
        });
      }
    }
  });

  return null;
}
