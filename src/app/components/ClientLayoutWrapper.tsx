'use client'

import React, { ReactNode } from 'react';

interface ClientLayoutWrapperProps {
  children: ReactNode;
}

export default function ClientLayoutWrapper({ children }: ClientLayoutWrapperProps) {
  // The HTML lang attribute is now managed by the layout server component
  // No need for client-side updates with next-intl
  return <>{children}</>;
}
