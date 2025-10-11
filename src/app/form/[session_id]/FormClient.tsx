'use client'

import { useState, useEffect } from 'react';

import { loadAnswers } from '@/app/lib/form-storage';
import type { Question, AnswerValue } from '@/app/lib/supabase';

// FormState interface for managing component state
interface FormState {
  questions: Question[];
  currentStep: number; // 0 = welcome, 1-n = questions, n+1 = thank you
  answers: Map<string, AnswerValue>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// QuestionsResponse interface matching API response
interface QuestionsResponse {
  questions: Question[];
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
  });

  // Fetch questions from API on mount
  useEffect(() => {
    async function fetchQuestions() {
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
        console.error('Error fetching questions:', err);
        setFormState(prev => ({
          ...prev,
          isLoading: false,
          error: err instanceof Error ? err.message : 'Failed to load survey questions',
        }));
      }
    }

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
  if (formState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
          <div className="text-center">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Unable to Load Survey
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              {formState.error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render form (placeholder for now - will be enhanced in later tasks)
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
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
          <p className="text-sm text-slate-400 dark:text-slate-500">
            {formState.answers.size > 0 && `Restored ${formState.answers.size} saved answer(s) from localStorage`}
          </p>
        </div>
      </div>
    </div>
  );
}
