"use client";

import type { Metadata } from "next";
import Error from "next/error";

// Metadata for root 404 page
export const metadata: Metadata = {
  title: "404 - Page Not Found | FredonBytes",
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false, // Don't index 404 pages
    follow: false,
  },
};

// Root-level not-found page for non-localized routes
// This handles requests that don't match the [locale] segment
export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found | FredonBytes</title>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
