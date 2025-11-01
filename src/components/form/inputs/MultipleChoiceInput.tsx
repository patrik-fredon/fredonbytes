'use client'

import React, { useRef, useEffect } from 'react'

import type { ValidatableQuestionOption } from '@/lib/form-validation'

interface MultipleChoiceInputProps {
  value: string[]
  onChange: (value: string[]) => void
  required: boolean
  error?: string
  questionId: string
  questionText: string
  options?: ValidatableQuestionOption[]
}

/**
 * MultipleChoiceInput component for checkbox group selection.
 * Allows multiple selections with custom checkbox styling.
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
export default function MultipleChoiceInput({
  value = [],
  onChange,
  required: _required,
  error,
  questionId,
  questionText,
  options = [],
}: MultipleChoiceInputProps) {
  const checkboxGroupRef = useRef<HTMLDivElement>(null)

  // Sort options by display_order
  const sortedOptions = [...options].sort((a, b) => a.display_order - b.display_order)

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

  if (!options || options.length === 0) {
    return (
      <div className="text-warning-amber font-mono text-sm">
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
      {sortedOptions.map((option) => {
        const isChecked = value?.includes(option.option_text) || false
        const inputId = `${questionId}-option-${option.id}`

        return (
          <label
            key={option.id}
            htmlFor={inputId}
            className={`flex items-center gap-3 p-4 min-h-[44px] rounded-md border transition-all duration-[180ms] cursor-pointer
                       ${isChecked
                ? 'border-neon-cyan bg-terminal-dark shadow-glow-cyan-subtle'
                : 'border-neon-cyan/20 bg-terminal-dark hover:border-neon-cyan/50 hover:shadow-glow-cyan-subtle'
              }
                       ${error ? 'border-error-red' : ''}
                       focus-within:ring-2 focus-within:ring-neon-cyan`}
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
                className={`w-5 h-5 rounded border-2 transition-all duration-[180ms] flex items-center justify-center
                           ${isChecked
                    ? 'border-neon-cyan bg-neon-cyan'
                    : 'border-terminal-muted bg-terminal-dark'
                  }
                           peer-focus:ring-2 peer-focus:ring-neon-cyan`}
              >
                {isChecked && (
                  <svg
                    className="w-3.5 h-3.5 text-terminal-dark"
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
              className={`flex-1 text-base font-mono transition-colors duration-[180ms]
                         ${isChecked
                  ? 'text-white font-medium'
                  : 'text-terminal-muted'
                }`}
            >
              {option.option_text}
            </span>
          </label>
        )
      })}

      {/* Selection Counter */}
      {value && value.length > 0 && (
        <div className="text-sm font-mono text-neon-cyan pt-1">
          {value.length} {value.length === 1 ? 'option' : 'options'} selected
        </div>
      )}
    </div>
  )
}
