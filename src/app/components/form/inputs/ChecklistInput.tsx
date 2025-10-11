'use client'

import React, { useRef, useEffect } from 'react'

import type { QuestionOption } from '@/app/lib/supabase'

interface ChecklistInputProps {
  value: string[]
  onChange: (value: string[]) => void
  required: boolean
  error?: string
  questionId: string
  questionText: string
  options?: QuestionOption[]
}

/**
 * ChecklistInput component for checkbox group selection with "Select All" functionality.
 * Allows multiple selections with custom checkbox styling and a toggle-all option.
 * Supports keyboard navigation with arrow keys and space/enter to toggle.
 * 
 * @param value - Array of currently selected option values
 * @param onChange - Callback function when selection changes
 * @param required - Whether the field is required
 * @param error - Validation error message
 * @param questionId - Unique identifier for the question
 * @param questionText - Question text for ARIA label
 * @param options - Array of available options to choose from
 */
export default function ChecklistInput({
  value = [],
  onChange,
  required: _required,
  error,
  questionId,
  questionText,
  options = [],
}: ChecklistInputProps) {
  const checkboxGroupRef = useRef<HTMLDivElement>(null)

  // Sort options by display_order
  const sortedOptions = [...options].sort((a, b) => a.display_order - b.display_order)

  // Check if all options are selected
  const allSelected = sortedOptions.length > 0 && value.length === sortedOptions.length
  const someSelected = value.length > 0 && value.length < sortedOptions.length

  // Handle keyboard navigation (arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!checkboxGroupRef.current?.contains(document.activeElement)) return

      const checkboxes = Array.from(
        checkboxGroupRef.current?.querySelectorAll('input[type="checkbox"]') || []
      ) as HTMLInputElement[]
      const currentIndex = checkboxes.findIndex((cb) => cb === document.activeElement)

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % checkboxes.length
        checkboxes[nextIndex]?.focus()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const prevIndex = currentIndex <= 0 ? checkboxes.length - 1 : currentIndex - 1
        checkboxes[prevIndex]?.focus()
      }
    }

    const groupElement = checkboxGroupRef.current
    groupElement?.addEventListener('keydown', handleKeyDown)

    return () => {
      groupElement?.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleToggle = (optionText: string) => {
    const currentValues = value || []
    if (currentValues.includes(optionText)) {
      onChange(currentValues.filter((v) => v !== optionText))
    } else {
      onChange([...currentValues, optionText])
    }
  }

  const handleSelectAll = () => {
    if (allSelected) {
      // Deselect all
      onChange([])
    } else {
      // Select all
      onChange(sortedOptions.map((opt) => opt.option_text))
    }
  }

  if (!options || options.length === 0) {
    return (
      <div className="text-amber-600 dark:text-amber-400 text-sm">
        No options available for this question.
      </div>
    )
  }

  return (
    <div
      ref={checkboxGroupRef}
      className="space-y-3"
      role="group"
      aria-label={questionText}
      aria-describedby={error ? `error-${questionId}` : undefined}
    >
      {/* Select All Option */}
      <label
        htmlFor={`${questionId}-select-all`}
        className={`flex items-center gap-3 p-4 min-h-[44px] rounded-md border-2 transition-all duration-200 cursor-pointer
                   ${
                     allSelected
                       ? 'border-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:border-blue-500'
                       : someSelected
                         ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-600'
                         : 'border-slate-400 dark:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                   }
                   focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
      >
        {/* Custom Checkbox for Select All */}
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={`${questionId}-select-all`}
            checked={allSelected}
            onChange={handleSelectAll}
            className="sr-only peer"
            aria-label="Select all options"
          />
          <div
            className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                       ${
                         allSelected
                           ? 'border-blue-700 dark:border-blue-400 bg-blue-700 dark:bg-blue-500'
                           : someSelected
                             ? 'border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400'
                             : 'border-slate-500 dark:border-slate-400 bg-white dark:bg-slate-700'
                       }
                       peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2`}
          >
            {allSelected && (
              <svg
                className="w-3.5 h-3.5 text-white dark:text-slate-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {someSelected && !allSelected && (
              <div className="w-3 h-0.5 bg-white dark:bg-slate-900 rounded" />
            )}
          </div>
        </div>

        {/* Select All Text */}
        <span
          className={`flex-1 text-base font-semibold transition-colors duration-200
                     ${
                       allSelected || someSelected
                         ? 'text-slate-900 dark:text-white'
                         : 'text-slate-700 dark:text-slate-300'
                     }`}
        >
          Select All
        </span>

        {/* Count Indicator */}
        {(allSelected || someSelected) && (
          <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
            {value.length} / {sortedOptions.length}
          </span>
        )}
      </label>

      {/* Divider */}
      <div className="border-t border-slate-200 dark:border-slate-700" />

      {/* Individual Options */}
      {sortedOptions.map((option) => {
        const isChecked = value?.includes(option.option_text) || false
        const inputId = `${questionId}-option-${option.id}`

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`flex items-center gap-3 p-4 min-h-[44px] rounded-md border transition-all duration-200 cursor-pointer
                       ${
                         isChecked
                           ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                           : 'border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'
                       }
                       ${error ? 'border-red-300 dark:border-red-700' : ''}
                       focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2`}
          >
            {/* Custom Checkbox */}
            <div className="relative flex items-center justify-center">
              <input
                type="checkbox"
                id={inputId}
                value={option.option_text}
                checked={isChecked}
                onChange={() => handleToggle(option.option_text)}
                className="sr-only peer"
                aria-label={option.option_text}
              />
              <div
                className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center
                           ${
                             isChecked
                               ? 'border-blue-600 dark:border-blue-400 bg-blue-600 dark:bg-blue-400'
                               : 'border-slate-400 dark:border-slate-500 bg-white dark:bg-slate-700'
                           }
                           peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2`}
              >
                {isChecked && (
                  <svg
                    className="w-3.5 h-3.5 text-white dark:text-slate-900"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Option Text */}
            <span
              className={`flex-1 text-base transition-colors duration-200
                         ${
                           isChecked
                             ? 'text-slate-900 dark:text-white font-medium'
                             : 'text-slate-700 dark:text-slate-300'
                         }`}
            >
              {option.option_text}
            </span>
          </label>
        )
      })}

      {/* Selection Counter */}
      {value && value.length > 0 && (
        <div className="text-sm text-slate-600 dark:text-slate-400 pt-1">
          {value.length} {value.length === 1 ? 'option' : 'options'} selected
        </div>
      )}
    </div>
  )
}
