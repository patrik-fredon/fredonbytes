'use client'

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';

import ErrorState from '@/app/components/form/ErrorState';
import FormBackground from '@/app/components/form/FormBackground';
import FormNavigation from '@/app/components/form/FormNavigation';
import QuestionStep from '@/app/components/form/QuestionStep';
// Lazy load ThankYouScreen since it's only needed at the end
const ThankYouScreen = dynamic(() => import('@/app/components/form/ThankYouScreen'), {
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-300">Loading...</p>
    </div>
  ),
});
import { useReducedMotion } from '@/app/hooks/useReducedMotion';
import { getCsrfToken } from '@/app/hooks/useCsrfToken';
import { logError, getUserFriendlyErrorMessage } from '@/app/lib/error-logger';
import { loadAnswers, saveAnswer, clearStorageData } from '@/app/lib/form-storage';
import { validateAnswer, validateAllAnswers, findFirstUnansweredRequired } from '@/app/lib/form-validation';
import type { Question, AnswerValue, LocalizedString } from '@/app/lib/supabase';

// Helper function to extract localized string based on locale
function getLocalizedString(localizedStr: LocalizedString | string, locale: string): string {
  // If it's already a string, return it
  if (typeof localizedStr === 'string') {
    return localizedStr;
  }
  
  // Try to get the requested locale, fallback to English
  return localizedStr[locale as keyof LocalizedString] || localizedStr.en || '';
}

// FormState interface for managing component state
interface FormState {
  questions: Question[];
  currentStep: number; // 1-n = questions, n+1 = thank you
  answers: Map<string, AnswerValue>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  validationError: string | null; // Error message for current question validation
  submissionError: string | null; // Separate error for submission failures (shown in modal)
  direction: 'forward' | 'backward'; // Navigation direction for animations
}

// QuestionsResponse interface matching API response
interface QuestionsResponse {
  questions: Question[];
  error?: string;
}

// SubmitResponse interface matching API response
interface SubmitResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface FormClientProps {
  sessionId: string;
  locale: string;
}

/**
 * Client component for the customer satisfaction form.
 * Displays questions in sequence with animated transitions.
 *
 * @param sessionId - The unique session identifier for this form submission
 * @param locale - The current locale for localized content
 */
export default function FormClient({ sessionId, locale }: FormClientProps) {
  // Ref for focus management
  const questionContainerRef = useRef<HTMLDivElement>(null);
  
  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // State management - Start at step 1 (first question) since welcome is on landing page
  const [formState, setFormState] = useState<FormState>({
    questions: [],
    currentStep: 1,
    answers: new Map<string, AnswerValue>(),
    isLoading: true,
    isSubmitting: false,
    error: null,
    validationError: null,
    submissionError: null,
    direction: 'forward',
  });

  // Fetch questions from API on mount
  const fetchQuestions = useCallback(async () => {
    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/form/questions');
      const data: QuestionsResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'Failed to fetch questions');
      }

      // Transform questions to use localized strings
      const localizedQuestions = data.questions.map(question => ({
        ...question,
        question_text: getLocalizedString(question.question_text, locale),
        description: question.description ? getLocalizedString(question.description, locale) : null,
        options: question.options?.map(option => ({
          ...option,
          option_text: getLocalizedString(option.option_text, locale),
        })),
      }));

      setFormState(prev => ({
        ...prev,
        questions: localizedQuestions,
        isLoading: false,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load survey questions');
      logError('QuestionLoading', error, { sessionId });
      
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: getUserFriendlyErrorMessage(error),
      }));
    }
  }, [sessionId, locale]);

  // Retry function for question loading
  const retryLoadQuestions = () => {
    setFormState(prev => ({ ...prev, error: null, isLoading: true }));
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Focus management - move focus to first input when question changes
  useEffect(() => {
    // Only manage focus when on a question step (not thank you)
    if (formState.currentStep >= 1 && formState.currentStep <= formState.questions.length) {
      // Small delay to allow animation to start
      const timer = setTimeout(() => {
        // Find the first focusable input element
        const firstInput = questionContainerRef.current?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), textarea, select, button'
        );
        
        if (firstInput) {
          firstInput.focus();
        }
      }, 350); // Slightly longer than animation duration (300ms)

      return () => clearTimeout(timer);
    }
  }, [formState.currentStep, formState.questions.length]);

  // Load saved answers from localStorage on mount
  useEffect(() => {
    const savedAnswers = loadAnswers(sessionId);
    
    if (savedAnswers) {
      const answersMap = new Map<string, AnswerValue>();
      Object.entries(savedAnswers).forEach(([questionId, value]) => {
        answersMap.set(questionId, value);
      });

      setFormState(prev => ({
        ...prev,
        answers: answersMap,
      }));
    }
  }, [sessionId]);

  // Navigation handlers
  const handleNext = () => {
    const { currentStep, questions } = formState;

    // Validate current question if required
    const currentQuestionIndex = currentStep - 1;
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      const answer = formState.answers.get(currentQuestion.id);
      
      // Use validation function to check answer
      const validationError = validateAnswer(currentQuestion, answer);
      
      if (validationError) {
        // Validation failed - prevent navigation and show error
        setFormState(prev => ({ 
          ...prev, 
          validationError: validationError.message 
        }));
        return;
      }
    }

    // Clear any previous validation errors
    setFormState(prev => ({ ...prev, validationError: null }));

    // If on last question, trigger form submission
    if (currentStep === questions.length) {
      handleSubmit();
      return;
    }

    // Move to next question
    setFormState(prev => ({ ...prev, currentStep: currentStep + 1, direction: 'forward' }));
  };;

  const handlePrevious = () => {
    const { currentStep } = formState;

    // Don't allow going back from first question
    if (currentStep <= 1) {
      return;
    }

    // Move to previous step
    setFormState(prev => ({ ...prev, currentStep: currentStep - 1, direction: 'backward' }));
  };

  // Handle answer changes with localStorage persistence
  const handleAnswerChange = (questionId: string, value: AnswerValue) => {
    try {
      // Save to localStorage immediately
      saveAnswer(sessionId, questionId, value);

      // Update component state and clear validation error
      setFormState(prev => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(questionId, value);
        
        return {
          ...prev,
          answers: newAnswers,
          validationError: null, // Clear validation error when user provides answer
        };
      });
    } catch (err) {
      // Handle localStorage failures gracefully
      const error = err instanceof Error ? err : new Error('Failed to save answer to localStorage');
      logError('LocalStorageSave', error, { sessionId, questionId });
      
      // Still update component state even if localStorage fails
      setFormState(prev => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(questionId, value);
        
        return {
          ...prev,
          answers: newAnswers,
          validationError: null, // Clear validation error when user provides answer
        };
      });

      // Optional: Show a warning to the user that progress won't be saved
      // This could be implemented as a toast notification in a future enhancement
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { questions, answers } = formState;

    // Validate all required questions are answered
    const validationErrors = validateAllAnswers(questions, answers);

    if (validationErrors.length > 0) {
      // Validation failed - navigate to first unanswered required question
      const firstUnansweredIndex = findFirstUnansweredRequired(questions, answers);
      
      if (firstUnansweredIndex !== -1) {
        // Navigate to the first unanswered question (add 1 because step 0 is welcome screen)
        const targetStep = firstUnansweredIndex + 1;
        
        setFormState(prev => ({
          ...prev,
          currentStep: targetStep,
          validationError: validationErrors[0].message,
        }));
      }
      
      return;
    }

    // All validations passed - proceed with submission
    setFormState(prev => ({ ...prev, isSubmitting: true, error: null }));

    // Format responses for API submission
    const responses = Array.from(answers.entries()).map(([question_id, answer_value]) => ({
      question_id,
      answer_value,
    }));

    try {
      // Call POST /api/form/submit
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken() || '',
        },
        body: JSON.stringify({
          session_id: sessionId,
          responses,
          locale: locale,
        }),
      });

      const data: SubmitResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Failed to submit form');
      }

      // Submission successful - clear localStorage
      clearStorageData(sessionId);

      // Update currentStep to show ThankYouScreen (questions.length + 1)
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        currentStep: questions.length + 1,
        direction: 'forward',
      }));
    } catch (err) {
      // Handle submission errors - retain localStorage and show error
      const error = err instanceof Error ? err : new Error('Failed to submit form');
      logError('FormSubmission', error, { sessionId, responseCount: responses.length });
      
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        submissionError: getUserFriendlyErrorMessage(error),
      }));

      // localStorage is retained automatically (we only clear on success)
    }
  };

  // Close submission error modal
  const closeSubmissionError = () => {
    setFormState(prev => ({ ...prev, submissionError: null }));
  };

  // Animation variants for slide transitions with prefers-reduced-motion support
  const slideVariants = {
    enter: (direction: 'forward' | 'backward') => ({
      x: prefersReducedMotion ? 0 : (direction === 'forward' ? 100 : -100),
      opacity: prefersReducedMotion ? 1 : 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: prefersReducedMotion ? 0 : (direction === 'forward' ? -100 : 100),
      opacity: prefersReducedMotion ? 1 : 0,
    }),
  };

  // Transition configuration optimized for 60fps performance
  // Respects prefers-reduced-motion by using instant transitions
  const slideTransition = {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration: prefersReducedMotion ? 0.01 : 0.3,
  };

  // Style for optimized animations (will-change for 60fps)
  const animatedStyle = {
    willChange: 'transform, opacity',
  };

  // Determine navigation button states
  const canGoPrevious = formState.currentStep > 1;
  const canGoNext = true; // Always allow next, validation happens in handleNext

  // Render loading state
  if (formState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <FormBackground />
        
        {/* Form container */}
        <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading survey questions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (formState.error && !formState.isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <FormBackground />
        
        {/* Form container */}
        <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
          <ErrorState
            title={formState.isLoading ? 'Unable to Load Survey' : 'Submission Failed'}
            message={formState.error}
            actions={[
              {
                label: 'Retry',
                onClick: formState.isLoading ? retryLoadQuestions : handleSubmit,
                variant: 'default',
              },
            ]}
            showSupport={true}
            icon="error"
          />
        </div>
      </div>
    );
  }

  // Render form
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" role="main" aria-label="Customer Satisfaction Survey">
      <FormBackground />
      
      {/* Submission Error Modal */}
      {formState.submissionError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 animate-in zoom-in duration-200">
            <ErrorState
              title="Submission Failed"
              message={formState.submissionError}
              actions={[
                {
                  label: 'Retry Submission',
                  onClick: handleSubmit,
                  variant: 'default',
                  loading: formState.isSubmitting,
                },
                {
                  label: 'Close',
                  onClick: closeSubmissionError,
                  variant: 'outline',
                },
              ]}
              showSupport={true}
              icon="error"
            />
          </div>
        </div>
      )}
      
      {/* Skip link for screen readers */}
      <a 
        href="#form-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
      >
        Skip to form content
      </a>

      {/* Form container */}
      <div 
        id="form-content"
        className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50"
      >
        {/* ARIA live region for announcements */}
        <div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {formState.currentStep >= 1 && formState.currentStep <= formState.questions.length &&
            `Question ${formState.currentStep} of ${formState.questions.length}`}
          {formState.currentStep > formState.questions.length && "Thank you for completing the form"}
          {formState.validationError && `Error: ${formState.validationError}`}
        </div>

        {/* AnimatePresence wrapper for exit animations */}
        <AnimatePresence mode="wait" custom={formState.direction}>
          {/* Question Steps (Steps 1 to questions.length) */}
          {formState.currentStep >= 1 && formState.currentStep <= formState.questions.length && (
            <motion.div
              key={`question-${formState.currentStep}`}
              custom={formState.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              style={animatedStyle}
              ref={questionContainerRef}
            >
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNext();
                }}
                className="space-y-8"
              >
                <fieldset className="border-0 p-0 m-0">
                  <legend className="sr-only">
                    Question {formState.currentStep} of {formState.questions.length}
                  </legend>
                  <QuestionStep
                question={formState.questions[formState.currentStep - 1]}
                answer={formState.answers.get(formState.questions[formState.currentStep - 1]?.id)}
                onAnswerChange={(value) =>
                  handleAnswerChange(formState.questions[formState.currentStep - 1].id, value)
                }
                error={formState.validationError}
              />
               </fieldset>

                {/* Form Navigation */}
                <FormNavigation
                currentStep={formState.currentStep}
                totalSteps={formState.questions.length}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
                isSubmitting={formState.isSubmitting}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
              </form>
            </motion.div>
          )}

          {/* Thank You Screen (Step questions.length + 1) */}
          {formState.currentStep > formState.questions.length && (
            <motion.div
              key="thankyou"
              custom={formState.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              style={animatedStyle}
            >
              <ThankYouScreen />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
