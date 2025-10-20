'use client';

import { AnimatePresence, motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback, useRef } from 'react';

import AnimatedBackground from '@/app/components/common/AnimatedBackground';
import ErrorState from '@/app/components/form/ErrorState';
import FormNavigation from '@/app/components/form/FormNavigation';
import QuestionStep from '@/app/components/form/QuestionStep';
import { useReducedMotion } from '@/app/hooks/useReducedMotion';
import { logError, getUserFriendlyErrorMessage } from '@/app/lib/error-logger';
import { loadAnswers, saveAnswer, clearStorageData } from '@/app/lib/form-storage';
import { validateAnswer, validateAllAnswers, findFirstUnansweredRequired, type ValidatableQuestion } from '@/app/lib/form-validation';
import type { SurveyQuestion, AnswerValue, LocalizedString } from '@/app/lib/supabase';

// Lazy load ThankYouScreen since it's only needed at the end
const ThankYouScreen = dynamic(() => import('@/app/components/form/ThankYouScreen'), {
  loading: () => (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-slate-600 dark:text-slate-300">Loading...</p>
    </div>
  ),
});

// Adapter to convert SurveyQuestion to Question format for reusing form components
interface AdaptedQuestion extends ValidatableQuestion {
  options?: Array<{
    id: string;
    question_id: string;
    option_text: string;
    display_order: number;
  }>;
}

// FormState interface for managing component state
interface SurveyState {
  questions: AdaptedQuestion[];
  currentStep: number; // 0 = welcome, 1-n = questions, n+1 = thank you
  answers: Map<string, AnswerValue | number>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  validationError: string | null;
  submissionError: string | null;
  direction: 'forward' | 'backward';
  locale: string;
  completed: boolean;
}

// SurveyQuestionsResponse interface matching API response
interface SurveyQuestionsResponse {
  questions: SurveyQuestion[];
  locale: string;
  error?: string;
}

// SubmitResponse interface matching API response
interface SubmitSurveyResponse {
  success: boolean;
  message: string;
  error?: string;
}

interface SurveyClientProps {
  sessionId: string;
  locale: string;
  invalidSession?: boolean;
}

/**
 * Client component for the customer satisfaction survey.
 * Reuses form components from the existing /form implementation.
 *
 * @param sessionId - The unique session identifier for this survey submission
 * @param locale - The current locale for localized content
 * @param invalidSession - Whether the session ID format is invalid
 */
export default function SurveyClient({ sessionId, locale, invalidSession = false }: SurveyClientProps) {
  // Ref for focus management
  const questionContainerRef = useRef<HTMLDivElement>(null);

  // Detect reduced motion preference
  const prefersReducedMotion = useReducedMotion();

  // State management - Start at step 1 (first question) since welcome is on landing page
  const [surveyState, setSurveyState] = useState<SurveyState>({
    questions: [],
    currentStep: 1,
    answers: new Map<string, AnswerValue | number>(),
    isLoading: !invalidSession,
    isSubmitting: false,
    error: invalidSession ? 'Invalid survey link. Please check the URL and try again.' : null,
    validationError: null,
    submissionError: null,
    direction: 'forward',
    locale: locale, // Use the passed locale prop
    completed: false,
  });

  // Helper function to get localized text
  const getLocalizedText = (text: LocalizedString | string, locale: string): string => {
    if (typeof text === 'string') return text;
    return text[locale as keyof LocalizedString] || text.en || '';
  };



  // Fetch survey questions from API on mount
  const fetchQuestions = useCallback(async () => {
    if (invalidSession) return;

    try {
      setSurveyState(prev => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`/api/survey/questions?session_id=${sessionId}&locale=${locale}`);
      const data: SurveyQuestionsResponse = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error ?? 'Failed to fetch survey questions');
      }

      // Adapt SurveyQuestion to Question format for reusing form components
      const adaptedQuestions: AdaptedQuestion[] = data.questions.map(q => ({
        id: q.id,
        question_text: getLocalizedText(q.question_text, data.locale || 'en'),
        description: q.description ? getLocalizedText(q.description, data.locale || 'en') : null,
        answer_type: q.answer_type,
        required: q.required,
        display_order: q.display_order,
        active: true,
        options: q.options?.map(opt => ({
          id: opt.id,
          question_id: opt.question_id,
          option_text: getLocalizedText(opt.option_text, data.locale || 'en'),
          display_order: opt.display_order,
        })),
      }));

      setSurveyState(prev => ({
        ...prev,
        questions: adaptedQuestions,
        isLoading: false,
        locale: data.locale || locale,
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load survey questions');
      logError('SurveyQuestionLoading', error, { sessionId });

      setSurveyState(prev => ({
        ...prev,
        isLoading: false,
        error: getUserFriendlyErrorMessage(error),
      }));
    }
  }, [sessionId, locale, invalidSession]);

  // Retry function for question loading
  const retryLoadQuestions = () => {
    setSurveyState(prev => ({ ...prev, error: null, isLoading: true }));
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Focus management - move focus to first input when question changes
  useEffect(() => {
    if (surveyState.currentStep > 0 && surveyState.currentStep <= surveyState.questions.length) {
      const timer = setTimeout(() => {
        const firstInput = questionContainerRef.current?.querySelector<HTMLElement>(
          'input:not([type="hidden"]), textarea, select, button'
        );

        if (firstInput) {
          firstInput.focus();
        }
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [surveyState.currentStep, surveyState.questions.length]);

  // Load saved answers from localStorage on mount
  useEffect(() => {
    const savedAnswers = loadAnswers(`survey_${sessionId}`);

    if (savedAnswers) {
      const answersMap = new Map<string, AnswerValue | number>();
      Object.entries(savedAnswers).forEach(([questionId, value]) => {
        answersMap.set(questionId, value);
      });

      setSurveyState(prev => ({
        ...prev,
        answers: answersMap,
      }));
    }
  }, [sessionId]);

  // Navigation handlers
  const handleNext = () => {
    const { currentStep, questions } = surveyState;

    // Validate current question if required
    const currentQuestionIndex = currentStep - 1;
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
      const answer = surveyState.answers.get(currentQuestion.id);

      const validationError = validateAnswer(currentQuestion, answer);

      if (validationError) {
        setSurveyState(prev => ({
          ...prev,
          validationError: validationError.message
        }));
        return;
      }
    }

    // Clear any previous validation errors
    setSurveyState(prev => ({ ...prev, validationError: null }));

    // If on last question, trigger form submission
    if (currentStep === questions.length) {
      handleSubmit();
      return;
    }

    // Move to next question
    setSurveyState(prev => ({ ...prev, currentStep: currentStep + 1, direction: 'forward' }));
  };

  const handlePrevious = () => {
    const { currentStep } = surveyState;

    if (currentStep <= 1) {
      return;
    }

    setSurveyState(prev => ({ ...prev, currentStep: currentStep - 1, direction: 'backward' }));
  };

  // Handle answer changes with localStorage persistence
  const handleAnswerChange = (questionId: string, value: AnswerValue | number) => {
    try {
      saveAnswer(`survey_${sessionId}`, questionId, value);

      setSurveyState(prev => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(questionId, value);

        return {
          ...prev,
          answers: newAnswers,
          validationError: null,
        };
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to save answer to localStorage');
      logError('LocalStorageSave', error, { sessionId, questionId });

      setSurveyState(prev => {
        const newAnswers = new Map(prev.answers);
        newAnswers.set(questionId, value);

        return {
          ...prev,
          answers: newAnswers,
          validationError: null,
        };
      });
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const { questions, answers } = surveyState;

    // Validate all required questions are answered
    const validationErrors = validateAllAnswers(questions, answers);

    if (validationErrors.length > 0) {
      const firstUnansweredIndex = findFirstUnansweredRequired(questions, answers);

      if (firstUnansweredIndex !== -1) {
        const targetStep = firstUnansweredIndex + 1;

        setSurveyState(prev => ({
          ...prev,
          currentStep: targetStep,
          validationError: validationErrors[0].message,
        }));
      }

      return;
    }

    setSurveyState(prev => ({ ...prev, isSubmitting: true, error: null }));

    // Format responses for API submission
    const responses = Array.from(answers.entries()).map(([question_id, answer_value]) => ({
      question_id,
      answer_value,
    }));

    try {
      // Get CSRF token from cookie
      const csrfToken = (() => {
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name, value] = cookie.trim().split('=');
          if (name === 'csrf_token') {
            return value;
          }
        }
        return null;
      })();
      
      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken || '',
        },
        body: JSON.stringify({
          session_id: sessionId,
          responses,
        }),
      });

      const data: SubmitSurveyResponse = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Failed to submit survey');
      }

      // Submission successful - clear localStorage
      clearStorageData(`survey_${sessionId}`);

      // Update currentStep to show ThankYouScreen
      setSurveyState(prev => ({
        ...prev,
        isSubmitting: false,
        currentStep: questions.length + 1,
        direction: 'forward',
      }));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to submit survey');
      logError('SurveySubmission', error, { sessionId, responseCount: responses.length });

      setSurveyState(prev => ({
        ...prev,
        isSubmitting: false,
        submissionError: getUserFriendlyErrorMessage(error),
      }));
    }
  };

  // Close submission error modal
  const closeSubmissionError = () => {
    setSurveyState(prev => ({ ...prev, submissionError: null }));
  };

  // Animation variants
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

  const slideTransition = {
    type: 'tween' as const,
    ease: 'easeInOut' as const,
    duration: prefersReducedMotion ? 0.01 : 0.3,
  };

  const animatedStyle = {
    willChange: 'transform, opacity',
  };

  // Determine navigation button states
  const canGoPrevious = surveyState.currentStep > 1;
  const canGoNext = true;

  // Render loading state
  if (surveyState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300">Loading survey...</p>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (surveyState.error && !surveyState.isSubmitting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <AnimatedBackground />

        <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
          <ErrorState
            message={surveyState.error}
            actions={surveyState.completed ? [] : [{
              label: 'Try Again',
              onClick: retryLoadQuestions,
              variant: 'default' as const,
            }]}
          />
        </div>
      </div>
    );
  }

  // Render main survey form
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AnimatedBackground />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-2xl bg-white/95 dark:bg-slate-800/95 rounded-xl shadow-2xl p-6 sm:p-8 md:p-10 border border-slate-200/50 dark:border-slate-700/50">
        {/* Progress indicator */}
        {surveyState.currentStep >= 1 && surveyState.currentStep <= surveyState.questions.length && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Question {surveyState.currentStep} of {surveyState.questions.length}
              </span>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {Math.round((surveyState.currentStep / surveyState.questions.length) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(surveyState.currentStep / surveyState.questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Question container with AnimatePresence for smooth transitions */}
        <div ref={questionContainerRef} className="min-h-[400px] flex flex-col">
          <AnimatePresence mode="wait" custom={surveyState.direction}>
            {surveyState.currentStep >= 1 && surveyState.currentStep <= surveyState.questions.length && (
              <motion.div
                key={`question-${surveyState.currentStep}`}
                custom={surveyState.direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                style={animatedStyle}
                className="flex-1"
              >
                <QuestionStep
                  question={surveyState.questions[surveyState.currentStep - 1]}
                  answer={surveyState.answers.get(surveyState.questions[surveyState.currentStep - 1].id)}
                  onAnswerChange={(value) => handleAnswerChange(surveyState.questions[surveyState.currentStep - 1].id, value)}
                  error={surveyState.validationError}
                />
              </motion.div>
            )}

            {surveyState.currentStep === surveyState.questions.length + 1 && (
              <motion.div
                key="thankyou"
                custom={surveyState.direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={slideTransition}
                style={animatedStyle}
                className="flex-1"
              >
                <ThankYouScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {surveyState.currentStep <= surveyState.questions.length && (
          <FormNavigation
            currentStep={surveyState.currentStep}
            totalSteps={surveyState.questions.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            isSubmitting={surveyState.isSubmitting}
          />
        )}

        {/* Submission error modal */}
        {surveyState.submissionError && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                Submission Failed
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                {surveyState.submissionError}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeSubmissionError}
                  className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
