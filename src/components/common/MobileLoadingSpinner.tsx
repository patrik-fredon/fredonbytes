import React from 'react';

interface MobileLoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MobileLoadingSpinner({ 
  size = 'md', 
  className = '' 
}: MobileLoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const innerSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center justify-center min-h-[200px] w-full ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-slate-200 dark:border-slate-700 rounded-full animate-spin border-t-blue-500`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${innerSizeClasses[size]} bg-blue-500 rounded-full animate-pulse`}></div>
        </div>
      </div>
    </div>
  );
}