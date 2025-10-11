'use client'

import { useState, useEffect } from 'react';

import { loadAnswers, saveAnswer, clearStorageData } from '@/app/lib/form-storage';
import { validateAnswer, validateAllAnswers, findFirstUnansweredRequired } from '@/app/lib/form-validation';
import { logError, getUserFriendlyErrorMessage } from '@/app/lib/error-logger';
import type { Question, AnswerValue } from '@/app/lib/supabase';
import ErrorState from '@/app/components/form/ErrorState';

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
  });

  // Retry function for question loading
  const retryLoadQuestions = () => {
    setFormState(prev => ({ ...prev, error: null, isLoading: true }));
    fetchQuestions();
  };

  // Fetch questions from API on mount
  const fetchQuestions = async () => {
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
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

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
      setFormState(prev => ({ ...prev, currentStep: 1, validationError: null }));
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
    setFormState(prev => ({ ...prev, currentStep: currentStep + 1 }));
  };;

  const handlePrevious = () => {
    const { currentStep } = formState;

    // Don't allow going back from welcome screen
    if (currentStep <= 0) {
      return;
    }

    // Move to previous step
    setFormState(prev => ({ ...prev, currentStep: currentStep - 1 }));
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

    try {
      // Format responses for API submission
      const responses = Array.from(answers.entries()).map(([question_id, answer_value]) => ({
        question_id,
        answer_value,
      }));

      // Call POST /api/form/submit
      const response = await fetch('/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          responses,
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

  // Determine navigation button states
  const canGoPrevious = formState.currentStep > 0;
  const isOnLastQuestion = formState.currentStep === formState.questions.length;
  const nextButtonText = isOnLastQuestion ? 'Submit' : 'Next';

  // Render loading state
  if (formState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
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

  // Render form (placeholder for now - will be enhanced in later tasks)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Submission Error Modal */}
      {formState.submissionError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-lg shadow-2xl p-6 animate-in fade-in zoom-in duration-200">
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
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Customer Satisfaction Survey
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Session ID: <code className="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{sessionId}</code>
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Loaded {formState.questions.length} questions successfully!
            </p>
            {formState.answers.size > 0 && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Restored {formState.answers.size} saved answer(s) from localStorage
              </p>
            )}
          </div>

          {/* Navigation state display (for testing) */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Current Step: {formState.currentStep} 
                {formState.currentStep === 0 && ' (Welcome)'}
                {formState.currentStep > 0 && formState.currentStep <= formState.questions.length && 
                  ` (Question ${formState.currentStep} of ${formState.questions.length})`}
                {formState.currentStep > formState.questions.length && ' (Thank You)'}
              </p>
              
              {/* Navigation buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="px-6 py-3 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {nextButtonText}
                </button>
              </div>

              {/* Current question info (if on a question) */}
              {formState.currentStep > 0 && formState.currentStep <= formState.questions.length && (
                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-md text-left">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Current Question:
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {formState.questions[formState.currentStep - 1]?.question_text}
                  </p>
                  {formState.questions[formState.currentStep - 1]?.required && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      * Required
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
