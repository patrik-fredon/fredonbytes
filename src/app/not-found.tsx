"use client";

import Error from "next/error";

// Root-level not-found page for non-localized routes
// This handles requests that don't match the [locale] segment
export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
