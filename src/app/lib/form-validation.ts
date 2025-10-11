import type { Question, AnswerValue } from './supabase';

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
  question: Question,
  answer: AnswerValue | undefined
): ValidationError | null {
  // If question is not required and answer is empty, it's valid
  if (!question.required) {
    return null;
  }

  // Check if answer is missing
  if (answer === undefined || answer === null) {
    return {
      question_id: question.id,
      message: 'This question is required',
    };
  }

  // Validate based on answer type
  switch (question.answer_type) {
    case 'short_text':
    case 'long_text':
    case 'single_choice':
      // For text and single choice, answer should be a non-empty string
      if (typeof answer !== 'string' || answer.trim() === '') {
        return {
          question_id: question.id,
          message: 'This question is required',
        };
      }
      break;

    case 'multiple_choice':
    case 'checklist':
      // For multiple choice and checklist, answer should be a non-empty array
      if (!Array.isArray(answer) || answer.length === 0) {
        return {
          question_id: question.id,
          message: 'Please select at least one option',
        };
      }
      break;

    default:
      // Unknown answer type
      return {
        question_id: question.id,
        message: 'Invalid question type',
      };
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
  questions: Question[],
  answers: Map<string, AnswerValue>
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
  questions: Question[],
  answers: Map<string, AnswerValue>
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
