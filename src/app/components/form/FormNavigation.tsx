'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/app/components/common/Button';

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
      {/* Progress indicator - only show on question steps */}
      {isOnQuestion && (
        <div className="text-center mb-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Question {currentStep} of {totalSteps}
          </p>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
        {/* Previous button - hidden on welcome screen */}
        {canGoPrevious && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onPrevious}
            disabled={!canGoPrevious || isSubmitting}
            leftIcon={<ChevronLeft size={20} />}
            className="w-full sm:w-auto sm:min-w-[140px] min-h-[44px]"
            aria-label="Go to previous question"
          >
            Previous
          </Button>
        )}

        {/* Next/Submit button */}
        <Button
          type="submit"
          variant={isOnLastQuestion ? 'gradient' : 'default'}
          size="lg"
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          loading={isSubmitting}
          rightIcon={!isSubmitting && !isOnLastQuestion ? <ChevronRight size={20} /> : undefined}
          className="w-full sm:flex-1 sm:min-w-[140px] min-h-[44px]"
          aria-label={isOnLastQuestion ? 'Submit survey' : 'Go to next question'}
        >
          {nextButtonText}
        </Button>
      </div>
    </div>
  );
}
