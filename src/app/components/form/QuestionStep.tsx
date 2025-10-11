'use client'

import { motion } from 'framer-motion'
import React from 'react'

import type { Question, AnswerValue } from '@/app/lib/supabase'

interface QuestionStepProps {
  question: Question
  answer: AnswerValue | undefined
  onAnswerChange: (value: AnswerValue) => void
  error: string | null
}

/**
 * QuestionStep component for displaying individual survey questions.
 * Renders the appropriate input component based on the question's answer_type.
 * 
 * @param question - The question object containing text, description, type, and options
 * @param answer - The current answer value for this question
 * @param onAnswerChange - Callback function to update the answer
 * @param error - Validation error message to display (if any)
 */
export default function QuestionStep({
  question,
  answer,
  onAnswerChange,
  error,
}: QuestionStepProps) {
  // Render the appropriate input component based on answer_type
  const renderInput = () => {
    switch (question.answer_type) {
      case 'short_text':
        // TODO: Replace with ShortTextInput component (Task 11.1)
        return (
          <input
            type="text"
            value={(answer as string) || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200
                     text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            maxLength={200}
            aria-label={question.question_text}
            aria-required={question.required}
            aria-invalid={!!error}
            aria-describedby={error ? `error-${question.id}` : undefined}
          />
        )

      case 'long_text':
        // TODO: Replace with LongTextInput component (Task 11.2)
        return (
          <textarea
            value={(answer as string) || ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your detailed answer..."
            rows={5}
            className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     transition-all duration-200 resize-y
                     text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            maxLength={1000}
            aria-label={question.question_text}
            aria-required={question.required}
            aria-invalid={!!error}
            aria-describedby={error ? `error-${question.id}` : undefined}
          />
        )

      case 'single_choice':
        // TODO: Replace with SingleChoiceInput component (Task 11.3)
        return (
          <div className="space-y-3" role="radiogroup" aria-label={question.question_text}>
            {question.options?.map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-3 p-4 rounded-md border border-slate-300 dark:border-slate-600 
                         hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.option_text}
                  checked={answer === option.option_text}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-slate-900 dark:text-white">{option.option_text}</span>
              </label>
            ))}
          </div>
        )

      case 'multiple_choice':
        // TODO: Replace with MultipleChoiceInput component (Task 11.4)
        return (
          <div className="space-y-3" role="group" aria-label={question.question_text}>
            {question.options?.map((option) => {
              const selectedValues = (answer as string[]) || []
              const isChecked = selectedValues.includes(option.option_text)

              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-4 rounded-md border border-slate-300 dark:border-slate-600 
                           hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={option.option_text}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = (answer as string[]) || []
                      if (e.target.checked) {
                        onAnswerChange([...currentValues, option.option_text])
                      } else {
                        onAnswerChange(currentValues.filter((v) => v !== option.option_text))
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-900 dark:text-white">{option.option_text}</span>
                </label>
              )
            })}
          </div>
        )

      case 'checklist':
        // TODO: Replace with ChecklistInput component (Task 11.5)
        return (
          <div className="space-y-3" role="group" aria-label={question.question_text}>
            {question.options?.map((option) => {
              const selectedValues = (answer as string[]) || []
              const isChecked = selectedValues.includes(option.option_text)

              return (
                <label
                  key={option.id}
                  className="flex items-center gap-3 p-4 rounded-md border border-slate-300 dark:border-slate-600 
                           hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    value={option.option_text}
                    checked={isChecked}
                    onChange={(e) => {
                      const currentValues = (answer as string[]) || []
                      if (e.target.checked) {
                        onAnswerChange([...currentValues, option.option_text])
                      } else {
                        onAnswerChange(currentValues.filter((v) => v !== option.option_text))
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-900 dark:text-white">{option.option_text}</span>
                </label>
              )
            })}
          </div>
        )

      default:
        return (
          <div className="text-red-600 dark:text-red-400">
            Unsupported question type: {question.answer_type}
          </div>
        )
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="space-y-6"
    >
      {/* Question Text with Required Indicator */}
      <div className="space-y-2">
        <h2 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white">
          {question.question_text}
          {question.required && (
            <span className="text-red-600 dark:text-red-400 ml-2" aria-label="required">
              *
            </span>
          )}
        </h2>

        {/* Description (if provided) */}
        {question.description && (
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {question.description}
          </p>
        )}
      </div>

      {/* Input Component */}
      <div className="pt-2">{renderInput()}</div>

      {/* Validation Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 
                   px-4 py-3 rounded-md border border-red-200 dark:border-red-800"
          id={`error-${question.id}`}
          role="alert"
          aria-live="polite"
        >
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  )
}
