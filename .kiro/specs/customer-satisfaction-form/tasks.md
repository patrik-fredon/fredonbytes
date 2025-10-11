# Implementation Plan

This implementation plan breaks down the customer satisfaction form feature into discrete, manageable coding tasks. Each task builds incrementally on previous work, following test-driven development principles where appropriate. Tasks are organized to validate core functionality early and ensure no orphaned code.

## Task List

- [-] 1. Set up Supabase integration and database schema
  - Install @supabase/supabase-js package
  - Create Supabase client configuration in `src/app/lib/supabase.ts`
  - Define TypeScript interfaces for database tables (Question, QuestionOption, FormSession, FormResponse)
  - Create database migration SQL file in `docs/database-schema.sql` with all tables, indexes, and RLS policies
  - Add environment variables to `.env.example` (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [ ] 2. Create localStorage utility functions
  - Create `src/app/lib/form-storage.ts` with storage utilities
  - Implement `saveAnswer()` function to store individual answers with session_id
  - Implement `loadAnswers()` function with 24-hour expiration check
  - Implement `clearStorageData()` function for cleanup
  - Implement `createNewStorageData()` helper for initial data structure
  - Add error handling for QuotaExceededError and unavailable localStorage
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 3. Build API endpoint for fetching questions
  - Create `src/app/api/form/questions/route.ts`
  - Implement GET handler to fetch questions with options from Supabase
  - Use Supabase query with join to get questions and their options in single request
  - Order questions by display_order
  - Add error handling for database connection failures
  - Return typed response with QuestionsResponse interface
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 4. Build API endpoint for form submission
  - Create `src/app/api/form/submit/route.ts`
  - Define Zod schema for request validation (session_id, responses array)
  - Implement POST handler to receive form responses
  - Insert/update form_sessions record with session_id and completion timestamp
  - Batch insert form_responses records using Supabase transaction
  - Add error handling for validation errors, duplicate submissions, and database failures
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_


- [ ] 5. Implement email notification system
  - Create email template generation function in `src/app/lib/email-templates.ts`
  - Implement `generateAdminNotificationHTML()` to format survey responses
  - Integrate Resend API call in submit endpoint to send admin notification
  - Include session_id, timestamp, and formatted responses in email
  - Add error handling to log email failures without blocking form submission
  - _Requirements: 5.7, 5.8_

- [ ] 6. Create form page with dynamic routing and session management
  - Create `src/app/form/page.tsx` (redirect handler)
  - Implement server-side session_id generation using crypto.randomUUID()
  - Add redirect logic to `/form/[session_id]` using next/navigation
  - Create `src/app/form/[session_id]/page.tsx` (main form page)
  - Extract session_id from params and validate format
  - Set up page metadata for SEO (title, description)
  - Pass session_id to client component
  - _Requirements: 1.1, 1.3, 1.6_

- [ ] 7. Build core FormClient component with state management
  - Create `src/app/form/[session_id]/FormClient.tsx` as client component
  - Define FormState interface (questions, currentStep, answers, loading, error states)
  - Implement useEffect to fetch questions from API on mount
  - Set up answers state using Map for efficient lookups
  - Implement localStorage sync on component mount to restore saved answers
  - Add loading and error states for question fetching
  - _Requirements: 1.2, 1.4, 2.1, 4.3_

- [ ] 8. Implement form navigation logic
  - Add currentStep state management (0=welcome, 1-n=questions, n+1=thank you)
  - Implement `handleNext()` function with validation for required questions
  - Implement `handlePrevious()` function to navigate backward
  - Add validation to prevent navigation from required unanswered questions
  - Implement logic to determine when to show Previous button (not on welcome screen)
  - Add logic to change Next button text to "Submit" on final question
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.7_

- [ ] 9. Create WelcomeScreen component
  - Create `src/app/components/form/WelcomeScreen.tsx`
  - Display FredonBytes logo using Next.js Image component
  - Add welcome message and estimated completion time
  - Implement "Start Survey" button using existing Button component
  - Add Framer Motion fade-in animation on mount
  - _Requirements: 3.1, 10.10_


- [ ] 10. Create QuestionStep component
  - Create `src/app/components/form/QuestionStep.tsx`
  - Accept question, answer, onAnswerChange, and error props
  - Display question text with proper heading level
  - Show description text if provided
  - Add required indicator (asterisk) for required questions
  - Render appropriate input component based on answer_type
  - Display validation error message below input
  - Add Framer Motion slide animation for question transitions
  - _Requirements: 2.5, 2.7, 3.6, 3.7_

- [ ] 11. Build input components for all answer types
- [ ] 11.1 Create ShortTextInput component
  - Create `src/app/components/form/inputs/ShortTextInput.tsx`
  - Implement single-line text input with 200 character limit
  - Add character counter display
  - Apply FredonBytes input styling from design system
  - Include proper ARIA labels and attributes
  - _Requirements: 2.4, 10.1, 10.2, 10.9_

- [ ] 11.2 Create LongTextInput component
  - Create `src/app/components/form/inputs/LongTextInput.tsx`
  - Implement textarea with 1000 character limit
  - Add character counter and auto-resize functionality
  - Apply consistent styling with other inputs
  - Include proper ARIA attributes
  - _Requirements: 2.4, 10.1, 10.2, 10.9_

- [ ] 11.3 Create SingleChoiceInput component
  - Create `src/app/components/form/inputs/SingleChoiceInput.tsx`
  - Implement radio button group from question options
  - Order options by display_order
  - Apply custom radio button styling matching brand
  - Add keyboard navigation support (arrow keys)
  - Include proper ARIA role and attributes
  - _Requirements: 2.4, 2.6, 10.1, 10.2, 10.9_

- [ ] 11.4 Create MultipleChoiceInput component
  - Create `src/app/components/form/inputs/MultipleChoiceInput.tsx`
  - Implement checkbox group from question options
  - Allow multiple selections
  - Apply custom checkbox styling
  - Add keyboard navigation support
  - Include proper ARIA attributes
  - _Requirements: 2.4, 2.6, 10.1, 10.2, 10.9_

- [ ] 11.5 Create ChecklistInput component
  - Create `src/app/components/form/inputs/ChecklistInput.tsx`
  - Implement checkbox group with "Select All" option
  - Add logic to toggle all checkboxes
  - Apply consistent styling with MultipleChoiceInput
  - Include proper ARIA attributes for group
  - _Requirements: 2.4, 2.6, 10.1, 10.2, 10.9_


- [ ] 12. Create FormNavigation component
  - Create `src/app/components/form/FormNavigation.tsx`
  - Implement Previous button (hidden on welcome screen)
  - Implement Next/Submit button with dynamic text
  - Add progress indicator showing "Question X of Y"
  - Apply fixed bottom positioning on mobile, inline on desktop
  - Add loading state during form submission
  - Use existing Button component with appropriate variants
  - _Requirements: 3.4, 3.5_

- [ ] 13. Implement answer persistence with localStorage
  - Add `handleAnswerChange()` function in FormClient
  - Call `saveAnswer()` utility immediately when answer changes
  - Update component state with new answer
  - Sync answers Map with localStorage on every change
  - Add error handling for localStorage failures
  - _Requirements: 4.1, 4.2, 4.5_

- [ ] 14. Implement form validation logic
  - Create validation utility function in `src/app/lib/form-validation.ts`
  - Implement `validateAnswer()` to check required fields
  - Add validation for answer format based on question type
  - Implement `validateAllAnswers()` to check all required questions before submission
  - Return validation errors with question_id and error message
  - Integrate validation into handleNext() function
  - _Requirements: 3.7, 5.1, 5.2_

- [ ] 15. Implement form submission flow
  - Add `handleSubmit()` function in FormClient
  - Validate all required questions are answered
  - If validation fails, navigate to first unanswered required question
  - Format responses for API submission
  - Call POST /api/form/submit with session_id and responses
  - Handle submission success by clearing localStorage
  - Handle submission errors by retaining localStorage and showing error
  - Update currentStep to show ThankYouScreen on success
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 16. Create ThankYouScreen component
  - Create `src/app/components/form/ThankYouScreen.tsx`
  - Display success checkmark with Framer Motion spring animation
  - Show thank you message with FredonBytes branding
  - Implement 10-second countdown timer using useEffect
  - Add "Return to Homepage" button for manual navigation
  - Implement auto-redirect to "/" after countdown
  - Add fade-in animation on component mount
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_


- [ ] 17. Implement error handling and recovery
  - Create ErrorState component in `src/app/components/form/ErrorState.tsx`
  - Display user-friendly error messages for network failures
  - Add retry button for failed question loading
  - Implement error modal for submission failures
  - Add support contact information in error states
  - Handle invalid session_id by generating new one and redirecting
  - Add error logging utility for debugging
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8_

- [ ] 18. Apply styling and design system integration
  - Create form-specific styles in `src/app/form/[session_id]/styles.module.css` if needed
  - Implement blurred background with FredonBytes brand image
  - Apply design tokens from globals.css (colors, spacing, typography)
  - Style form container with rounded corners and shadow
  - Ensure all inputs use consistent border, focus, and hover states
  - Apply responsive breakpoints for mobile, tablet, and desktop
  - Implement dark mode support for all components
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9_

- [ ] 19. Implement animations with Framer Motion
  - Add AnimatePresence wrapper in FormClient for exit animations
  - Implement slide-right animation for forward navigation
  - Implement slide-left animation for backward navigation
  - Add fade-in animation for WelcomeScreen
  - Add spring animation for ThankYouScreen checkmark
  - Add shake animation for validation errors
  - Implement prefers-reduced-motion support
  - Optimize animations for 60fps performance
  - _Requirements: 3.6, 3.10_

- [ ] 20. Implement accessibility features
  - Add semantic HTML structure (main, form, fieldset, legend)
  - Implement proper ARIA labels for all form inputs
  - Add ARIA live regions for error announcements
  - Implement keyboard navigation support (Tab, Enter, Arrow keys)
  - Add focus management to move focus to first input on question change
  - Ensure minimum 44px touch targets for mobile
  - Add skip links for screen readers
  - Verify color contrast meets WCAG AA standards
  - _Requirements: 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 21. Add performance optimizations
  - Implement code splitting with dynamic imports for FormClient
  - Lazy load ThankYouScreen component
  - Optimize background image with Next.js Image component
  - Add loading skeleton for question loading state
  - Implement bundle size optimizations in next.config.ts
  - Add will-change CSS property for animated elements
  - Verify Lighthouse performance score meets 90+ target
  - _Requirements: 8.1_


- [ ] 22. Create database seed script and documentation
  - Create `scripts/seed-form-questions.sql` with sample questions
  - Add at least 5 diverse questions covering all answer types
  - Include question options for choice-based questions
  - Create `docs/FORM_SETUP.md` with setup instructions
  - Document environment variable configuration
  - Document database migration steps
  - Add instructions for running seed script in Supabase
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 23. Add security measures
  - Implement rate limiting middleware for API routes
  - Add input sanitization in API endpoints
  - Configure CORS headers in next.config.ts
  - Verify RLS policies are correctly applied in Supabase
  - Add Content-Security-Policy headers
  - Ensure environment variables are properly secured
  - Test that Supabase service key is never exposed to client
  - _Requirements: 9.3, 9.4, 9.5_

- [ ] 24. Integration and end-to-end testing
  - Test complete form flow from /form to submission
  - Verify session_id generation and redirect
  - Test localStorage persistence across page reloads
  - Verify all question types render and accept input correctly
  - Test form validation for required questions
  - Verify successful submission and email notification
  - Test error recovery scenarios (network failures, invalid data)
  - Test on multiple browsers (Chrome, Firefox, Safari)
  - Test on mobile devices (iOS and Android)
  - Verify accessibility with screen reader
  - _Requirements: All requirements_

- [ ] 25. Documentation and deployment preparation
  - Update main README.md with form feature documentation
  - Add form feature to CHANGELOG.md
  - Create deployment checklist in docs/DEPLOYMENT.md
  - Document API endpoints in docs/API.md
  - Add troubleshooting guide for common issues
  - Verify all environment variables are documented
  - Create admin guide for managing questions in Supabase
  - Prepare Vercel deployment configuration
  - _Requirements: All requirements_

## Notes

- Each task should be completed and verified before moving to the next
- Tasks build incrementally to ensure no orphaned code
- Core functionality (tasks 1-8) should be prioritized
- UI components (tasks 9-12) can be developed in parallel after core is complete
- Testing (task 24) should be performed continuously throughout development
- All code should follow TypeScript strict mode and existing project conventions
- Use existing FredonBytes components (Button, etc.) where possible for consistency
