'use client'

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';

import ErrorState from '@/app/components/form/ErrorState';
import FormBackground from '@/app/components/form/FormBackground';
import FormNavigation from '@/app/components/form/FormNavigation';
import QuestionStep from '@/app/components/form/QuestionStep';
import WelcomeScreen from '@/app/components/form/WelcomeScreen';
// Lazy load ThankYouScreen since it's only needed at the end
const ThankYouScreen = dynamic(() => import('@/app/components/form/ThankYouScreen'), {
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-300">Loading...</p>
    </div>
  ),
});
import { logError, getUserFriendlyErrorMessage } from '@/app/lib/error-logger';
import { loadAnswers, saveAnswer, clearStorageData } from '@/app/lib/form-storage';
import { validateAnswer, validateAllAnswers, findFirstUnansweredRequired } from '@/app/lib/form-validation';
import type { Question, AnswerValue } from '@/app/lib/supabase';

// FormState interface for managing component state
interface FormState {
  questions: Question[];
  currentStep: number; // 0 = welcome, 1-n = questions, n+1 = thank you
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
  sessionId: string
}

/**
 * Client component for the customer satisfaction form.
 * This is a placeholder that will be fully implemented in task 7.
 * 
 * @param sessionId - The unique session identifier for this form submission
 */
export default function FormClient({ sessionId }: FormClientProps) {
  // Ref for focus management
  const questionContainerRef = useRef<HTMLDivElement>(null);

  // State management
  const [formState, setFormState] = useState<FormState>({
    questions: [],
    currentStep: 0,
    answers: new Map<string, AnswerValue>(),
    isLoading: true,
    isSubmitting: false,
    error: null,
    validationError: null,
    submissionError: null,
    direction: 'forward',
  });

  // Newsletter and email state
  const [newsletterOptin, setNewsletterOptin] = useState(false);
  const [email, setEmail] = useState('');

  // Fetch questions from API on mount
  const fetchQuestions = useCallback(async () => {
    try {
      setFormState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch('/api/form/questions');
      const data: QuestionsResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to fetch questions');
      }

      setFormState(prev => ({
        ...prev,
        questions: data.questions,
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
  }, [sessionId]);

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
    // Only manage focus when on a question step (not welcome or thank you)
    if (formState.currentStep > 0 && formState.currentStep <= formState.questions.length) {
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

    // If on welcome screen (step 0), move to first question
    if (currentStep === 0) {
      setFormState(prev => ({ ...prev, currentStep: 1, validationError: null, direction: 'forward' }));
      return;
    }

    // If on a question, validate if required
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

    // Don't allow going back from welcome screen
    if (currentStep <= 0) {
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
        },
        body: JSON.stringify({
          session_id: sessionId,
          responses,
          newsletter_optin: newsletterOptin,
          email: newsletterOptin && email ? email : undefined,
        }),
      });

      const data: SubmitResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit form');
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
      x: direction === 'forward' ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'forward' | 'backward') => ({
      x: direction === 'forward' ? -100 : 100,
      opacity: 0,
    }),
  };

  // Transition configuration optimized for 60fps performance
  const slideTransition = {
    type: 'tween' as const,
    ease: 'easeInOut',
    duration: 0.3,
  };

  // Style for optimized animations (will-change for 60fps)
  const animatedStyle = {
    willChange: 'transform, opacity',
  };

  // Determine navigation button states
  const canGoPrevious = formState.currentStep > 0;
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
          {formState.currentStep === 0 && "Welcome screen"}
          {formState.currentStep > 0 && formState.currentStep <= formState.questions.length && 
            `Question ${formState.currentStep} of ${formState.questions.length}`}
          {formState.currentStep > formState.questions.length && "Thank you for completing the survey"}
          {formState.validationError && `Error: ${formState.validationError}`}
        </div>

        {/* AnimatePresence wrapper for exit animations */}
        <AnimatePresence mode="wait" custom={formState.direction}>
          {/* Welcome Screen (Step 0) */}
          {formState.currentStep === 0 && (
            <motion.div
              key="welcome"
              custom={formState.direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              style={animatedStyle}
            >
              <WelcomeScreen onNext={handleNext} />
            </motion.div>
          )}

          {/* Question Steps (Steps 1 to questions.length) */}
          {formState.currentStep > 0 && formState.currentStep <= formState.questions.length && (
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

                {/* Privacy Notice & Newsletter (shown on last question) */}
                {formState.currentStep === formState.questions.length && (
                  <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                    {/* Privacy Notice */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                            Your Privacy Matters
                          </h3>
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            This survey is <strong>completely anonymous</strong>. We do not collect any personally identifiable information unless you choose to provide your email below. Your responses help us improve our services.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Newsletter Opt-in */}
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={newsletterOptin}
                          onChange={(e) => setNewsletterOptin(e.target.checked)}
                          className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-offset-slate-800"
                        />
                        <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                          I'd like to receive updates and news from FredonBytes
                        </span>
                      </label>

                      {/* Email input (shown when newsletter is checked) */}
                      {newsletterOptin && (
                        <div className="ml-7 animate-in slide-in-from-top-2 duration-200">
                          <label htmlFor="newsletter-email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="newsletter-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your.email@example.com"
                            required={newsletterOptin}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition-colors"
                          />
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            We'll only use this to send you occasional updates. You can unsubscribe anytime.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

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
