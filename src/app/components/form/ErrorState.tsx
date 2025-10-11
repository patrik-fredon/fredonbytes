'use client'

import { AlertCircle, RefreshCw, Mail } from 'lucide-react';
import { Button } from '@/app/components/common/Button';

export interface ErrorAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  loading?: boolean;
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  actions?: ErrorAction[];
  showSupport?: boolean;
  supportEmail?: string;
  icon?: 'error' | 'warning' | 'info';
  className?: string;
}

/**
 * ErrorState component for displaying user-friendly error messages
 * with retry functionality and support contact information
 * 
 * @param title - Optional title for the error (defaults based on icon type)
 * @param message - The error message to display
 * @param actions - Array of action buttons (e.g., retry, cancel)
 * @param showSupport - Whether to show support contact information
 * @param supportEmail - Support email address (defaults to info@fredonbytes.cloud)
 * @param icon - Icon type to display (error, warning, or info)
 * @param className - Additional CSS classes
 */
export default function ErrorState({
  title,
  message,
  actions = [],
  showSupport = true,
  supportEmail = 'info@fredonbytes.cloud',
  icon = 'error',
  className = '',
}: ErrorStateProps) {
  // Default titles based on icon type
  const defaultTitles = {
    error: 'Something Went Wrong',
    warning: 'Warning',
    info: 'Information',
  };

  const displayTitle = title || defaultTitles[icon];

  // Icon colors
  const iconColors = {
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
  };

  return (
    <div className={`text-center ${className}`}>
      {/* Icon */}
      <div className={`${iconColors[icon]} mb-4 flex justify-center`}>
        <AlertCircle size={48} strokeWidth={1.5} aria-hidden="true" />
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
        {displayTitle}
      </h2>

      {/* Message */}
      <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md mx-auto">
        {message}
      </p>

      {/* Action Buttons */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          {actions.map((action, index) => (
            <Button
              key={index}
              onClick={action.onClick}
              variant={action.variant || 'default'}
              size="lg"
              loading={action.loading}
              leftIcon={action.label.toLowerCase().includes('retry') ? <RefreshCw size={18} /> : undefined}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}

      {/* Support Contact Information */}
      {showSupport && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
            Need help? Contact our support team:
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <Mail size={16} aria-hidden="true" />
            {supportEmail}
          </a>
        </div>
      )}
    </div>
  );
}
