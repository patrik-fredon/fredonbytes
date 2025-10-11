'use client'

import React, { useRef, useEffect } from 'react'

import type { QuestionOption } from '@/app/lib/supabase'

interface SingleChoiceInputProps {
  value: string
  onChange: (value: string) => void
  required: boolean
  error?: string
  questionId: string
  questionText: string
  options?: QuestionOption[]
}

/**
 * SingleChoiceInput component for radio button group selection.
 * Displays options ordered by display_order with custom styling.
 * Supports keyboard navigation with arrow keys.
 * 
 * @param value - Currently selected option value
 * @param onChange - Callback function when selection changes
 * @param required - Whether the field is required
 * @param error - Validation error message
 * @param questionId - Unique identifier for the question
 * @param questionText - Question text for ARIA label
 * @param options - Array of available options to choose from
 */
export default function SingleChoiceInput({
  value,
  onChange,
  required,
  error,
  questionId,
  questionText,
  options = [],
}: SingleChoiceInputProps) {
  const radioGroupRef = useRef<HTMLDivElement>(null)

  // Sort options by display_order
  const sortedOptions = [...options].sort((a, b) => a.display_order - b.display_order)

  // Handle keyboard navigation (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!radioGroupRef.current?.contains(document.activeElement)) return

      const currentIndex = sortedOptions.findIndex((opt) => opt.option_text === value)

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % sortedOptions.length
        onChange(sortedOptions[nextIndex].option_text)
        // Focus the next radio button
        const nextRadio = radioGroupRef.current?.querySelectorAll('input[type="radio"]')[
          nextIndex
        ] as HTMLInputElement
        nextRadio?.focus()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const prevIndex = currentIndex <= 0 ? sortedOptions.length - 1 : currentIndex - 1
        onChange(sortedOptions[prevIndex].option_text)
        // Focus the previous radio button
        const prevRadio = radioGroupRef.current?.querySelectorAll('input[type="radio"]')[
          prevIndex
        ] as HTMLInputElement
        prevRadio?.focus()
      }
    }

    const groupElement = radioGroupRef.current
    groupElement?.addEventListener('keydown', handleKeyDown)

    return () => {
      groupElement?.removeEventListener('keydown', handleKeyDown)
    }
  }, [value, onChange, sortedOptions])

  if (!options || options.length === 0) {
    return (
      <div className="text-amber-600 dark:text-amber-400 text-sm">
        No options available for this question.
      </div>
    )
  }

  return (
    <div
      ref={radioGroupRef}
      className="space-y-3"
      role="radiogroup"
      aria-label={questionText}
      aria-required={required}
      aria-invalid={!!error}
      aria-describedby={error ? `error-${questionId}` : undefined}
    >
      {sortedOptions.map((option) => {
        const isSelected = value === option.option_text
        const inputId = `${questionId}-option-${option.id}`

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`flex items-center gap-3 p-4 min-h-[44px] rounded-md border transition-all duration-200 cursor-pointer
                       ${
                         isSelected
                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                           : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                       }
                       ${error ? 'border-red-300 dark:border-red-700' : ''}
                       focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
          >
            {/* Custom Radio Button */}
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                id={inputId}
                name={questionId}
                value={option.option_text}
                checked={isSelected}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only peer"
                aria-label={option.option_text}
              />
              <div
                className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                           ${
                             isSelected
                               ? 'border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400'
                               : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700'
                           }
                           peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2`}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-white dark:bg-slate-900" />
                )}
              </div>
            </div>

            {/* Option Text */}
            <span
              className={`flex-1 text-base transition-colors duration-200
                         ${
                           isSelected
                             ? 'text-slate-900 dark:text-white font-medium'
                             : 'text-slate-700 dark:text-slate-300'
                         }`}
            >
              {option.option_text}
            </span>

            {/* Selected Indicator */}
            {isSelected && (
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </label>
        )
      })}
    </div>
  )
}
