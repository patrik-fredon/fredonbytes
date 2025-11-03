"use client";

import React, { useState, useRef, useEffect } from "react";

import type { QuestionOption } from "@/lib/supabase";

interface LongTextInputProps {
  value: string;
  onChange: (value: string) => void;
  required: boolean;
  error?: string;
  questionId: string;
  questionText: string;
  options?: QuestionOption[];
}

const MAX_LENGTH = 1000;
const MIN_ROWS = 5;

/**
 * LongTextInput component for multi-line text input with character limit and auto-resize.
 * Displays a character counter and enforces a 1000 character maximum.
 * Automatically adjusts height based on content.
 *
 * @param value - Current input value
 * @param onChange - Callback function when value changes
 * @param required - Whether the field is required
 * @param error - Validation error message
 * @param questionId - Unique identifier for the question
 * @param questionText - Question text for ARIA label
 */
export default function LongTextInput({
  value,
  onChange,
  required,
  error,
  questionId,
  questionText,
}: LongTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const currentLength = value?.length || 0;
  const remainingChars = MAX_LENGTH - currentLength;

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set height to scrollHeight to fit content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <div className="space-y-2">
      <textarea
        ref={textareaRef}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="$ Enter your detailed answer..."
        rows={MIN_ROWS}
        maxLength={MAX_LENGTH}
        className={`w-full px-4 py-3 rounded-lg border-2 transition-all duration-200 resize-none
                   bg-glass-bg backdrop-blur-glass font-mono
                   text-terminal-light placeholder:text-terminal-light/50
                   focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 focus:shadow-glow-cyan
                   ${
                     error
                       ? "border-error-red focus:ring-error-red focus:shadow-glow-red-subtle"
                       : "border-neon-cyan/40 focus:border-neon-cyan"
                   }`}
        style={{ minHeight: `${MIN_ROWS * 1.5}rem` }}
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
                   ${remainingChars < 50 ? "text-warning-amber font-medium" : ""}
                   ${remainingChars === 0 ? "text-error-red font-semibold" : ""}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {currentLength} / {MAX_LENGTH} characters
        {remainingChars < 50 && remainingChars > 0 && (
          <span className="ml-1">({remainingChars} remaining)</span>
        )}
        {remainingChars === 0 && <span className="ml-1">(limit reached)</span>}
      </div>
    </div>
  );
}
