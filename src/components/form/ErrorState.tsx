'use client'

import { AlertCircle, RefreshCw, Mail } from 'lucide-react';

import CommandButton from '@/components/dev-ui/CommandButton';

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

  // Terminal icon colors with glow
  const iconColors = {
    error: 'text-error-red drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]',
    warning: 'text-warning-amber drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    info: 'text-neon-cyan drop-shadow-[0_0_10px_rgba(0,217,255,0.5)]',
  };

  return (
    <div className={`text-center ${className}`}>
      {/* Terminal Error Icon */}
      <div className={`${iconColors[icon]} mb-4 flex justify-center`}>
        <AlertCircle size={64} strokeWidth={2} aria-hidden="true" />
      </div>

      {/* Terminal Title */}
      <h2 className="text-xl font-mono font-semibold text-white mb-2">
        {icon === 'error' && '$ ERROR: '}{icon === 'warning' && '$ WARNING: '}{icon === 'info' && '$ INFO: '}{displayTitle}
      </h2>

      {/* Terminal Message */}
      <p className="font-mono text-terminal-muted mb-6 max-w-md mx-auto">
        {message}
      </p>

      {/* Terminal Action Buttons */}
      {actions.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          {actions.map((action, index) => (
            <CommandButton
              key={index}
              onClick={action.onClick}
              variant={icon === 'error' ? 'cyan' : 'purple'}
              prefix="$"
              disabled={action.loading}
              className="min-h-[44px]"
            >
              {action.loading ? 'processing...' : action.label.toLowerCase()}
            </CommandButton>
          ))}
        </div>
      )}

      {/* Terminal Support Section */}
      {showSupport && (
        <div className="mt-6 pt-6 border-t border-neon-cyan/20">
          <p className="text-sm font-mono text-terminal-muted mb-2">
            // Need help? Contact support:
          </p>
          <a
            href={`mailto:${supportEmail}`}
            className="inline-flex items-center gap-2 text-neon-cyan hover:text-white hover:shadow-glow-cyan-subtle transition-all duration-[180ms] text-sm font-mono"
          >
            <Mail size={16} aria-hidden="true" />
            {supportEmail}
          </a>
        </div>
      )}
    </div>
  );
}
