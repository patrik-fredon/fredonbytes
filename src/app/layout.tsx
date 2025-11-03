import type { ReactNode } from 'react';

// Required root layout when root not-found.tsx exists
// This is a minimal pass-through layout
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
