"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/common/Button";

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
  const nextButtonText = isOnLastQuestion ? "Submit" : "Next";

  // Determine if we're on a question step (not welcome or thank you)
  const isOnQuestion = currentStep > 0 && currentStep <= totalSteps;

  return (
    <div className="w-full">
      {/* Terminal Progress Bar - only show on question steps */}
      {isOnQuestion && (
        <div className="mb-6 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-mono text-neon-cyan font-semibold">
              $ Question {currentStep}/{totalSteps}
            </p>
            <p className="text-sm font-mono text-terminal-light/70">
              {Math.round((currentStep / totalSteps) * 100)}%
            </p>
          </div>
          <div className="h-2 bg-glass-bg backdrop-blur-glass rounded-full border border-neon-cyan/40 overflow-hidden shadow-glow-cyan-subtle">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple shadow-glow-cyan transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Terminal Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
        {/* Previous button - hidden on welcome screen */}
        {canGoPrevious && (
          <Button
            variant="gradient"
            prefix="$"
            onClick={onPrevious}
            disabled={!canGoPrevious || isSubmitting}
            className="w-full sm:w-auto sm:min-w-[140px] mt-10"
          >
            previous
            <ChevronLeft className="w-4 h-4 ml-2" />
          </Button>
        )}

        {/* Next/Submit button */}
        <Button
          variant={isOnLastQuestion ? "gradient" : "neon-purple"}
          prefix="$"
          onClick={onNext}
          disabled={!canGoNext || isSubmitting}
          className="max-w-1 flex mt-10  sm:flex-1 sm:min-w-[140px]"
        >
          {isSubmitting
            ? "processing..."
            : isOnLastQuestion
              ? "submit"
              : "next"}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
