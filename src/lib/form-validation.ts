import type { Question, AnswerValue } from "./supabase";

// Generic question interface for validation that works with both Question and AdaptedQuestion
export interface ValidatableQuestion {
  id: string;
  question_text: string; // Can be LocalizedString or string - we only use the ID for validation
  description?: string | null;
  answer_type:
    | "short_text"
    | "long_text"
    | "single_choice"
    | "multiple_choice"
    | "checklist"
    | "rating"
    | "image";
  required: boolean;
  display_order: number;
  active: boolean;
  options?: ValidatableQuestionOption[];
}

// Generic option interface that works with both QuestionOption and adapted options
export interface ValidatableQuestionOption {
  id: string;
  question_id: string;
  option_text: string; // Can be LocalizedString or string
  display_order: number;
}

/**
 * Validation error interface
 */
export interface ValidationError {
  question_id: string;
  message: string;
}

/**
 * Validates a single answer based on question requirements
 *
 * @param question - The question to validate against
 * @param answer - The answer value to validate (can be undefined)
 * @returns ValidationError if validation fails, null if valid
 */
export function validateAnswer(
  question: Question | ValidatableQuestion,
  answer: AnswerValue | undefined,
): ValidationError | null {
  // If question is not required and answer is empty, it's valid
  if (!question.required) {
    return null;
  }

  // Check if answer is missing
  if (answer === undefined || answer === null) {
    return {
      question_id: question.id,
      message: "This question is required",
    };
  }

  // Validate based on answer type
  switch (question.answer_type) {
    case "short_text":
    case "long_text":
    case "single_choice":
      // For text and single choice, answer should be a non-empty string
      if (typeof answer !== "string" || answer.trim() === "") {
        return {
          question_id: question.id,
          message: "This question is required",
        };
      }
      break;

    case "multiple_choice":
    case "checklist":
      // For multiple choice and checklist, answer should be a non-empty array
      if (!Array.isArray(answer) || answer.length === 0) {
        return {
          question_id: question.id,
          message: "Please select at least one option",
        };
      }
      break;

    case "image":
      // For image type, answer should be a non-empty array of URLs
      if (!Array.isArray(answer) || answer.length === 0) {
        return {
          question_id: question.id,
          message: "Please upload at least one image",
        };
      }
      // Validate all URLs are non-empty strings
      if (
        !answer.every((url) => typeof url === "string" && url.trim() !== "")
      ) {
        return {
          question_id: question.id,
          message: "Invalid image data",
        };
      }
      break;

    case "rating":
      // Rating can be number or string, just needs to exist
      if (answer === undefined || answer === null) {
        return {
          question_id: question.id,
          message: "Please provide a rating",
        };
      }
      break;
  }

  return null;
}

/**
 * Validates all required questions have been answered
 *
 * @param questions - Array of all questions
 * @param answers - Map of question IDs to answer values
 * @returns Array of ValidationErrors (empty if all valid)
 */
export function validateAllAnswers(
  questions: (Question | ValidatableQuestion)[],
  answers: Map<string, AnswerValue>,
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const question of questions) {
    const answer = answers.get(question.id);
    const error = validateAnswer(question, answer);

    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

/**
 * Finds the first unanswered required question
 *
 * @param questions - Array of all questions
 * @param answers - Map of question IDs to answer values
 * @returns Index of first unanswered required question, or -1 if all answered
 */
export function findFirstUnansweredRequired(
  questions: (Question | ValidatableQuestion)[],
  answers: Map<string, AnswerValue>,
): number {
  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    const answer = answers.get(question.id);
    const error = validateAnswer(question, answer);

    if (error) {
      return i;
    }
  }

  return -1;
}
