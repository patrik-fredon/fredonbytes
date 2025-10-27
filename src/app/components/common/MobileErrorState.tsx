import React from 'react';

import { Button } from './Button';

interface MobileErrorStateProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function MobileErrorState({ 
  message, 
  onRetry, 
  className = '' 
}: MobileErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-6 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="default"
          size="lg"
        >
          Try Again
        </Button>
      )}
    </div>
  );
}