"use client";

import React, { useState } from "react";

import type { QuestionOption } from "@/lib/supabase";

interface ShortTextInputProps {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
  error?: string;
  questionId: string;
  questionText: string;
  options?: QuestionOption[];
}

const MAX_LENGTH = 200;

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
  const [isFocused, setIsFocused] = useState(false);
  const currentLength = value?.length || 0;
  const remainingChars = MAX_LENGTH - currentLength;

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="$ Enter your answer..."
        maxLength={MAX_LENGTH}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                   bg-glass-bg backdrop-blur-glass font-mono
                   text-terminal-light placeholder:text-terminal-light/50
                   focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:shadow-glow-cyan
                   ${
                     error
                       ? "border-error-red focus:ring-error-red focus:shadow-glow-red-subtle"
                       : "border-neon-cyan/40 focus:border-neon-cyan"
                   }`}
        aria-label={questionText}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={
          error ? `error-${questionId}` : `char-count-${questionId}`
        }
      />

      {/* Character Counter */}
      <div
        id={`char-count-${questionId}`}
        className={`text-sm text-right font-mono transition-colors duration-200
                   ${isFocused ? "text-neon-cyan" : "text-terminal-light/70"}
                   ${remainingChars < 20 ? "text-warning-amber font-medium" : ""}
                   ${remainingChars === 0 ? "text-error-red font-semibold" : ""}`}
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
  );
}
