/**
 * Hook to get CSRF token from cookies for API requests
 * Usage: const csrfToken = useCsrfToken();
 */

"use client";

import { useEffect, useState } from "react";

export function useCsrfToken(): string | null {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Get CSRF token from cookie
    const getCsrfToken = () => {
      if (typeof document === "undefined") {
        return null;
      }

      const cookies = document.cookie.split(";");
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "csrf_token") {
          return decodeURIComponent(value);
        }
      }
      return null;
    };

    setToken(getCsrfToken());
  }, []);

  return token;
}

/**
 * Helper function to get CSRF token synchronously
 * Use this in API calls
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "csrf_token") {
      return decodeURIComponent(value);
    }
  }
  return null;
}
