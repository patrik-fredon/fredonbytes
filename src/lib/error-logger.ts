/**
 * Error logging utility for the customer satisfaction form
 * Provides consistent error logging with context and metadata
 */

export interface ErrorMetadata {
  [key: string]: unknown;
}

/**
 * Log an error with context and metadata
 * 
 * @param context - The context where the error occurred (e.g., 'FormClient', 'QuestionLoading')
 * @param error - The error object or message
 * @param metadata - Additional metadata to include in the log
 */
export function logError(
  context: string,
  error: Error | string,
  metadata?: ErrorMetadata
): void {
  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const logData = {
    context: `[FormError:${context}]`,
    message: errorMessage,
    stack: errorStack,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(logData.context, logData);
  } else {
    // In production, log only essential information
    console.error(logData.context, {
      message: logData.message,
      timestamp: logData.timestamp,
    });
  }

  // Optional: Send to error tracking service (e.g., Sentry)
  // This can be enabled in the future by uncommenting and configuring
  // if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
  //   // Example: Sentry.captureException(error, { contexts: { custom: metadata } });
  // }
}

/**
 * Get a user-friendly error message based on the error type
 * 
 * @param error - The error object or message
 * @returns A user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: Error | string): string {
  const errorMessage = error instanceof Error ? error.message : error;

  // Network errors
  if (errorMessage.includes('fetch') || errorMessage.includes('network')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Timeout errors
  if (errorMessage.includes('timeout')) {
    return 'The request took too long to complete. Please try again.';
  }

  // Database errors
  if (errorMessage.includes('database') || errorMessage.includes('supabase')) {
    return 'We encountered a problem saving your data. Please try again in a moment.';
  }

  // Validation errors
  if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
    return errorMessage; // Validation errors are already user-friendly
  }

  // Generic fallback
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
}
