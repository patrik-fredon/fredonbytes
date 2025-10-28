'use client'

import React, { useState } from 'react'

import type { QuestionOption } from '@/lib/supabase'

interface ShortTextInputProps {
  value: string
  onChange: (value: string) => void
  required: boolean
  error?: string
  questionId: string
  questionText: string
  options?: QuestionOption[]
}

const MAX_LENGTH = 200

/**
 * ShortTextInput component for single-line text input with character limit.
 * Displays a character counter and enforces a 200 character maximum.
 * 
 * @param value - Current input value
 * @param onChange - Callback function when value changes
 * @param required - Whether the field is required
 * @param error - Validation error message
 * @param questionId - Unique identifier for the question
 * @param questionText - Question text for ARIA label
 */
export default function ShortTextInput({
  value,
  onChange,
  required,
  error,
  questionId,
  questionText,
}: ShortTextInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const currentLength = value?.length || 0
  const remainingChars = MAX_LENGTH - currentLength

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="Enter your answer..."
        maxLength={MAX_LENGTH}
        className={`w-full px-4 py-3 rounded-md border transition-all duration-200
                   bg-white dark:bg-slate-700 
                   text-slate-900 dark:text-white 
                   placeholder:text-slate-400 dark:placeholder:text-slate-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   ${error
            ? 'border-red-500 dark:border-red-500'
            : 'border-slate-300 dark:border-slate-600'
          }`}
        aria-label={questionText}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${questionId}` : `char-count-${questionId}`}
      />

      {/* Character Counter */}
      <div
        id={`char-count-${questionId}`}
        className={`text-sm text-right transition-colors duration-200
                   ${isFocused ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}
                   ${remainingChars < 20 ? 'text-amber-600 dark:text-amber-400 font-medium' : ''}
                   ${remainingChars === 0 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentLength} / {MAX_LENGTH} characters
        {remainingChars < 20 && remainingChars > 0 && (
          <span className="ml-1">({remainingChars} remaining)</span>
        )}
        {remainingChars === 0 && <span className="ml-1">(limit reached)</span>}
      </div>
    </div>
  )
}
