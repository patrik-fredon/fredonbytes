'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react';

import CommandButton from '@/components/dev-ui/CommandButton';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * FormNavigation component provides Previous/Next navigation controls for the form.
 * Displays progress indicator and handles button states based on current step.
 * 
 * @param currentStep - Current step number (0 = welcome, 1-n = questions, n+1 = thank you)
 * @param totalSteps - Total number of questions
 * @param canGoNext - Whether navigation to next step is allowed
 * @param canGoPrevious - Whether navigation to previous step is allowed
 * @param isSubmitting - Whether form is currently being submitted
 * @param onPrevious - Handler for Previous button click
 * @param onNext - Handler for Next button click
 */
export default function FormNavigation({
  currentStep,
  totalSteps,
  canGoNext,
  canGoPrevious,
  isSubmitting,
  onPrevious,
  onNext,
}: FormNavigationProps) {
  // Determine if we're on the last question
  const isOnLastQuestion = currentStep === totalSteps;

  // Determine button text based on current step
  const nextButtonText = isOnLastQuestion ? 'Submit' : 'Next';

  // Determine if we're on a question step (not welcome or thank you)
  const isOnQuestion = currentStep > 0 && currentStep <= totalSteps;

  return (
    <div className="w-full">
      {/* Terminal Progress Bar - only show on question steps */}
      {isOnQuestion && (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-neon-cyan">
              $ Question {currentStep}/{totalSteps}
            </p>
            <p className="text-sm font-mono text-terminal-muted">
              {Math.round((currentStep / totalSteps) * 100)}%
            </p>
          </div>
          <div className="h-1.5 bg-terminal-dark rounded-full border border-neon-cyan/30 overflow-hidden">
            <div 
              className="h-full bg-neon-cyan shadow-glow-cyan-subtle transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Terminal Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        {/* Previous button - hidden on welcome screen */}
        {canGoPrevious && (
          <CommandButton
            variant="cyan"
            prefix="$"
            onClick={onPrevious}
            disabled={!canGoPrevious || isSubmitting}
            className="w-full sm:w-auto sm:min-w-[140px]"
          >
            previous
          </CommandButton>
        )}

        {/* Next/Submit button */}
        <CommandButton
          variant={isOnLastQuestion ? 'purple' : 'cyan'}
          prefix="$"
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className="w-full sm:flex-1 sm:min-w-[140px]"
        >
          {isSubmitting ? 'processing...' : isOnLastQuestion ? 'submit' : 'next'}
        </CommandButton>
      </div>
    </div>
  );
}
