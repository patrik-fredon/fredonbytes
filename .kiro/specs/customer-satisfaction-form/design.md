# Design Document

## Overview

This design document outlines the technical architecture and implementation strategy for the FredonBytes Customer Satisfaction Form system. The solution leverages Next.js 15 App Router with dynamic routing, Supabase PostgreSQL for data persistence, localStorage for client-side caching, and Framer Motion for smooth animations.

### Key Design Principles

1. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with client-side features
2. **Mobile-First**: Responsive design optimized for touch devices
3. **Performance**: Lighthouse score 90+ through code splitting and lazy loading
4. **Accessibility**: WCAG 2.1 Level AA compliance with keyboard navigation and screen reader support
5. **Brand Consistency**: Seamless integration with existing FredonBytes design system
6. **Data Integrity**: Robust validation, error handling, and transaction management

### Technology Stack Alignment

- **Framework**: Next.js 15.3.3 with App Router and TypeScript
- **Database**: Supabase (PostgreSQL) with client SDK
- **Styling**: Tailwind CSS 4 with existing design tokens
- **Animations**: Framer Motion 12 for transitions
- **Forms**: React Hook Form 7 with Zod validation
- **Email**: Resend API for notifications
- **State Management**: React hooks + localStorage

## Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    A[User Browser] -->|HTTPS| B[Next.js App Router]
    B -->|Dynamic Route| C[/form/session_id Page]
    C -->|Read/Write| D[localStorage]
    C -->|Fetch Questions| E[Supabase Client]
    C -->|Submit Responses| E
    E -->|PostgreSQL| F[(Database)]
    C -->|POST| G[/api/form/submit]
    G -->|Send Email| H[Resend API]
    G -->|Store Data| E

    H -->|Email Sent| I[Admin Inbox]
```

### System Components

1. **Client-Side Application** (`/form/[session_id]/page.tsx`)
   - Session management and routing
   - Question rendering and navigation
   - Local state and localStorage management
   - Form validation and submission

2. **API Layer** (`/api/form/*`)
   - Question fetching endpoint
   - Response submission endpoint
   - Email notification handler

3. **Database Layer** (Supabase)
   - Questions and options storage
   - Response persistence
   - Session tracking

4. **Email Service** (Resend)
   - Admin notification emails
   - Customer confirmation emails (optional)

### Data Flow

1. **Initial Access**: User visits `/form` → Generate UUID → Redirect to `/form/{session_id}`
2. **Question Loading**: Fetch questions from Supabase → Cache in component state
3. **Answer Collection**: User answers → Save to localStorage → Update component state
4. **Submission**: Validate all answers → POST to API → Save to Supabase → Send email → Show thank you
5. **Completion**: Display success → Auto-redirect after 10s

## Components and Interfaces

### Component Hierarchy

```
FormPage (Server Component)
└── FormClient (Client Component)
    ├── WelcomeScreen
    ├── QuestionStep
    │   ├── ShortTextInput
    │   ├── LongTextInput
    │   ├── SingleChoiceInput
    │   ├── MultipleChoiceInput
    │   └── ChecklistInput
    ├── FormNavigation
    └── ThankYouScreen
```


### Component Specifications

#### 1. FormPage (Server Component)

**Purpose**: Handle initial routing, session generation, and SEO metadata

**Props**:
```typescript
interface FormPageProps {
  params: { session_id?: string };
  searchParams: { [key: string]: string | string[] | undefined };
}
```

**Responsibilities**:
- Validate session_id from URL params
- Generate new UUID if missing
- Redirect to `/form/{session_id}` with proper session
- Set page metadata for SEO
- Pass session_id to client component

**Implementation Notes**:
- Use `redirect()` from `next/navigation` for server-side redirects
- Use `crypto.randomUUID()` for session generation
- Implement as async server component

#### 2. FormClient (Client Component)

**Purpose**: Main orchestrator for form logic, state management, and API interactions

**Props**:
```typescript
interface FormClientProps {
  sessionId: string;
}
```

**State Management**:
```typescript
interface FormState {
  questions: Question[];
  currentStep: number; // 0 = welcome, 1-n = questions, n+1 = thank you
  answers: Map<string, AnswerValue>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}
```

**Responsibilities**:
- Fetch questions from Supabase on mount
- Manage current step navigation
- Sync answers with localStorage
- Handle form submission
- Coordinate animations between steps


#### 3. WelcomeScreen

**Purpose**: Display introduction and start button

**Props**:
```typescript
interface WelcomeScreenProps {
  onNext: () => void;
}
```

**Design**:
- Centered card with FredonBytes logo
- Brief welcome message (2-3 sentences)
- Estimated completion time
- Primary "Start Survey" button
- Smooth fade-in animation on mount

#### 4. QuestionStep

**Purpose**: Render individual question with appropriate input type

**Props**:
```typescript
interface QuestionStepProps {
  question: Question;
  answer: AnswerValue | undefined;
  onAnswerChange: (value: AnswerValue) => void;
  error: string | null;
}
```

**Responsibilities**:
- Display question text and description
- Render correct input component based on answer_type
- Show required indicator
- Display validation errors
- Handle answer updates

#### 5. Input Components (ShortTextInput, LongTextInput, etc.)

**Purpose**: Specialized input components for each answer type

**Common Interface**:
```typescript
interface InputComponentProps {
  value: AnswerValue;
  onChange: (value: AnswerValue) => void;
  required: boolean;
  error?: string;
  options?: QuestionOption[]; // For choice-based inputs
}
```

**Variants**:
- **ShortTextInput**: Single-line text input (max 200 chars)
- **LongTextInput**: Textarea (max 1000 chars)
- **SingleChoiceInput**: Radio button group
- **MultipleChoiceInput**: Checkbox group (min 1, max all)
- **ChecklistInput**: Checkbox group with "Select All" option


#### 6. FormNavigation

**Purpose**: Provide Previous/Next navigation controls

**Props**:
```typescript
interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoPrevious: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onNext: () => void;
}
```

**Design**:
- Fixed bottom position on mobile, inline on desktop
- Previous button (hidden on welcome screen)
- Next/Submit button (changes text on last question)
- Progress indicator (e.g., "Question 3 of 10")
- Loading state during submission

#### 7. ThankYouScreen

**Purpose**: Confirmation and redirect after successful submission

**Props**:
```typescript
interface ThankYouScreenProps {
  onRedirect: () => void;
}
```

**Features**:
- Success checkmark animation
- Thank you message
- 10-second countdown timer
- Manual "Return to Homepage" button
- Auto-redirect on countdown completion

## Data Models

### TypeScript Interfaces

```typescript
// Question from database
interface Question {
  id: string;
  question_text: string;
  description: string | null;
  answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist';
  required: boolean;
  display_order: number;
  options?: QuestionOption[];
}

// Question option for choice-based questions
interface QuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  display_order: number;
}


// Answer value (union type for all answer types)
type AnswerValue = string | string[];

// Form response for submission
interface FormResponse {
  session_id: string;
  question_id: string;
  answer_value: AnswerValue;
}

// localStorage structure
interface LocalStorageData {
  session_id: string;
  answers: Record<string, AnswerValue>;
  timestamp: number;
  expiresAt: number;
}

// API response types
interface QuestionsResponse {
  questions: Question[];
  error?: string;
}

interface SubmitResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### Database Schema

#### Table: `questions`

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  description TEXT,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(display_order)
);

CREATE INDEX idx_questions_display_order ON questions(display_order);
```

#### Table: `question_options`

```sql
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

CREATE INDEX idx_question_options_question_id ON question_options(question_id);
```


#### Table: `form_sessions`

```sql
CREATE TABLE form_sessions (
  session_id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX idx_form_sessions_created_at ON form_sessions(created_at);
CREATE INDEX idx_form_sessions_completed_at ON form_sessions(completed_at);
```

#### Table: `form_responses`

```sql
CREATE TABLE form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES form_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX idx_form_responses_session_id ON form_responses(session_id);
CREATE INDEX idx_form_responses_question_id ON form_responses(question_id);
CREATE INDEX idx_form_responses_submitted_at ON form_responses(submitted_at);
```

### Supabase Client Configuration

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth required for public forms
  },
});

// Type-safe database helpers
export type Database = {
  public: {
    Tables: {
      questions: { Row: Question; Insert: Omit<Question, 'id' | 'created_at'> };
      question_options: { Row: QuestionOption; Insert: Omit<QuestionOption, 'id'> };
      form_sessions: { Row: FormSession; Insert: Omit<FormSession, 'created_at'> };
      form_responses: { Row: FormResponse; Insert: Omit<FormResponse, 'id' | 'submitted_at'> };
    };
  };
};
```


## API Endpoints

### GET `/api/form/questions`

**Purpose**: Fetch all active questions with their options

**Response**:
```typescript
{
  questions: Question[];
  error?: string;
}
```

**Implementation**:
```typescript
// Fetch questions with options in a single query
const { data, error } = await supabase
  .from('questions')
  .select(`
    *,
    options:question_options(*)
  `)
  .order('display_order', { ascending: true });
```

**Error Handling**:
- 500: Database connection error
- 200: Success with empty array if no questions

### POST `/api/form/submit`

**Purpose**: Submit form responses and trigger notifications

**Request Body**:
```typescript
{
  session_id: string;
  responses: Array<{
    question_id: string;
    answer_value: AnswerValue;
  }>;
  metadata?: {
    user_agent: string;
    ip_address: string;
  };
}
```

**Response**:
```typescript
{
  success: boolean;
  message: string;
  error?: string;
}
```

**Implementation Flow**:
1. Validate request body with Zod schema
2. Begin Supabase transaction
3. Insert/update form_session record
4. Insert form_responses (batch insert)
5. Commit transaction
6. Send admin notification email via Resend
7. Return success response

**Error Handling**:
- 400: Invalid request body
- 409: Duplicate submission (session already completed)
- 500: Database or email service error


## localStorage Management

### Storage Key Structure

```typescript
const STORAGE_KEY = 'fredonbytes_form_data';
const EXPIRATION_HOURS = 24;
```

### Storage Operations

#### Save Answer
```typescript
function saveAnswer(sessionId: string, questionId: string, value: AnswerValue): void {
  const data = getStorageData(sessionId) || createNewStorageData(sessionId);
  data.answers[questionId] = value;
  data.timestamp = Date.now();
  localStorage.setItem(`${STORAGE_KEY}_${sessionId}`, JSON.stringify(data));
}
```

#### Load Answers
```typescript
function loadAnswers(sessionId: string): Record<string, AnswerValue> | null {
  const stored = localStorage.getItem(`${STORAGE_KEY}_${sessionId}`);
  if (!stored) return null;

  const data: LocalStorageData = JSON.parse(stored);

  // Check expiration
  if (Date.now() > data.expiresAt) {
    clearStorageData(sessionId);
    return null;
  }

  return data.answers;
}
```

#### Clear Storage
```typescript
function clearStorageData(sessionId: string): void {
  localStorage.removeItem(`${STORAGE_KEY}_${sessionId}`);
}
```

### Fallback Strategy

If localStorage is unavailable:
1. Store answers in component state only
2. Display warning banner: "Your progress won't be saved if you leave this page"
3. Continue with full functionality
4. Skip localStorage operations silently

## Error Handling

### Error Categories and Strategies

#### 1. Network Errors (Question Loading)

**Scenario**: Supabase connection fails during initial load

**Strategy**:
- Display error message: "Unable to load survey questions. Please check your connection."
- Show retry button
- Log error to console for debugging
- Provide support contact information

**UI Component**:
```typescript
<ErrorState
  title="Connection Error"
  message="We couldn't load the survey questions."
  action={{ label: "Retry", onClick: retryLoad }}
  supportLink="mailto:info@fredonbytes.cloud"
/>
```


#### 2. Validation Errors

**Scenario**: User attempts to proceed without answering required question

**Strategy**:
- Prevent navigation
- Display inline error message below input
- Scroll to error location
- Focus on invalid input
- Use ARIA live region for screen readers

**Error Messages**:
- Required field: "This question is required"
- Invalid format: "Please provide a valid answer"
- Min/max length: "Answer must be between X and Y characters"

#### 3. Submission Errors

**Scenario**: Database write or email send fails

**Strategy**:
- Keep localStorage data intact
- Display error modal with retry option
- Log detailed error for debugging
- Provide alternative contact method

**Error Modal**:
```typescript
<ErrorModal
  title="Submission Failed"
  message="We couldn't save your responses. Your answers are saved locally."
  actions={[
    { label: "Retry Submission", onClick: retrySubmit, variant: "primary" },
    { label: "Contact Support", onClick: openSupport, variant: "secondary" }
  ]}
/>
```

#### 4. Session Errors

**Scenario**: Invalid or malformed session_id in URL

**Strategy**:
- Generate new valid UUID
- Redirect to `/form/{new_session_id}`
- No error message shown to user (seamless recovery)

#### 5. localStorage Quota Exceeded

**Scenario**: Browser storage limit reached

**Strategy**:
- Catch QuotaExceededError
- Display warning banner
- Continue with in-memory state
- Suggest clearing browser data

### Error Logging

```typescript
function logError(context: string, error: Error, metadata?: Record<string, any>): void {
  console.error(`[FormError:${context}]`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...metadata
  });

  // Optional: Send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(error, { contexts: { custom: metadata } });
  // }
}
```


## Animation Strategy

### Transition Types

#### 1. Page Entry (Welcome Screen)
- **Effect**: Fade in + scale up
- **Duration**: 500ms
- **Easing**: ease-out
- **Implementation**: Framer Motion `initial`, `animate`, `exit`

```typescript
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  {/* Welcome content */}
</motion.div>
```

#### 2. Question Navigation (Forward)
- **Effect**: Slide left + fade
- **Duration**: 300ms
- **Easing**: ease-in-out

```typescript
const slideVariants = {
  enter: { x: 100, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
};
```

#### 3. Question Navigation (Backward)
- **Effect**: Slide right + fade
- **Duration**: 300ms
- **Easing**: ease-in-out

#### 4. Error Messages
- **Effect**: Shake + fade in
- **Duration**: 400ms
- **Easing**: ease-out

```typescript
<motion.div
  initial={{ opacity: 0, x: 0 }}
  animate={{ opacity: 1, x: [0, -10, 10, -10, 10, 0] }}
  transition={{ duration: 0.4 }}
>
  {errorMessage}
</motion.div>
```

#### 5. Success Checkmark (Thank You Screen)
- **Effect**: Scale up + rotate
- **Duration**: 600ms
- **Easing**: spring

```typescript
<motion.div
  initial={{ scale: 0, rotate: -180 }}
  animate={{ scale: 1, rotate: 0 }}
  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
>
  <CheckCircle size={64} />
</motion.div>
```

### Performance Considerations

- Use `AnimatePresence` for exit animations
- Implement `will-change: transform` for animated elements
- Respect `prefers-reduced-motion` media query
- Lazy load Framer Motion components
- Use CSS transforms (not position properties) for smooth 60fps animations


## Styling and Design System Integration

### Color Palette (from globals.css)

```css
/* Primary colors for form elements */
--primary: #0f172a;           /* Buttons, headers */
--primary-foreground: #ffffff; /* Button text */
--secondary: #f1f5f9;         /* Input backgrounds */
--accent: #e2e8f0;            /* Hover states */
--border: #e2e8f0;            /* Input borders */
--destructive: #ef4444;       /* Error messages */
--ring: #94a3b8;              /* Focus rings */
```

### Component Styling Patterns

#### Form Container
```typescript
<div className="min-h-screen flex items-center justify-center p-4 relative">
  {/* Blurred background */}
  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800" />
  <div className="absolute inset-0 backdrop-blur-sm"
       style={{ backgroundImage: 'url(/fredonbytes-logo-with-background.png)', backgroundSize: 'cover', opacity: 0.1 }} />

  {/* Form card */}
  <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg shadow-xl p-8">
    {/* Content */}
  </div>
</div>
```

#### Input Fields
```typescript
<input
  className="w-full px-4 py-3 rounded-md border border-border bg-secondary
             focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
             transition-all duration-200
             text-foreground placeholder:text-muted-foreground"
/>
```

#### Buttons (using existing Button component)
```typescript
<Button
  variant="default"  // or "outline", "ghost"
  size="lg"
  className="min-w-[120px]"
>
  Next
</Button>
```

#### Error Messages
```typescript
<p className="text-sm text-destructive mt-1 flex items-center gap-1">
  <AlertCircle size={16} />
  {errorMessage}
</p>
```

### Responsive Breakpoints

```typescript
// Mobile: < 640px (default)
// Tablet: 640px - 1024px (sm, md)
// Desktop: > 1024px (lg, xl, 2xl)

<div className="
  p-4 sm:p-6 md:p-8           // Padding scales with screen size
  text-base sm:text-lg         // Font size increases on larger screens
  max-w-full sm:max-w-2xl      // Container width constraints
  grid grid-cols-1 md:grid-cols-2  // Layout changes
">
```


### Dark Mode Support

All components must respect the dark mode color scheme:

```typescript
// Automatic dark mode via Tailwind
<div className="bg-white dark:bg-slate-800 text-foreground">
  <input className="bg-secondary dark:bg-slate-700 border-border dark:border-slate-600" />
</div>
```

## Email Notification Design

### Admin Notification Email

**Subject**: `New Customer Satisfaction Survey - Session {session_id}`

**Content Structure**:
1. Header with FredonBytes branding
2. Session information (ID, timestamp, completion time)
3. Responses organized by question
4. Summary statistics (completion rate, time taken)
5. Footer with action links

**HTML Template** (following existing contact email pattern):

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; }
    .response { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #3b82f6; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Customer Satisfaction Survey Results</h1>
      <p>Session: {session_id}</p>
    </div>
    <div class="content">
      <!-- Responses here -->
    </div>
  </div>
</body>
</html>
```

### Email Service Integration

```typescript
// api/form/submit/route.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendAdminNotification(sessionId: string, responses: FormResponse[]) {
  await resend.emails.send({
    from: 'Customer Feedback <noreply@fredonbytes.cloud>',
    to: ['info@fredonbytes.cloud'],
    subject: `New Customer Satisfaction Survey - ${sessionId}`,
    html: generateEmailHTML(responses),
  });
}
```


## Testing Strategy

### Unit Testing

**Framework**: Jest + React Testing Library (to be added)

**Test Coverage Areas**:

1. **Utility Functions**
   - localStorage operations (save, load, clear, expiration)
   - Session ID generation and validation
   - Answer validation logic
   - Date/time formatting

2. **Component Logic**
   - Input component value changes
   - Validation error display
   - Button enable/disable states
   - Navigation logic

**Example Test**:
```typescript
describe('localStorage utilities', () => {
  it('should save and retrieve answers correctly', () => {
    const sessionId = 'test-session';
    const questionId = 'q1';
    const answer = 'Test answer';

    saveAnswer(sessionId, questionId, answer);
    const loaded = loadAnswers(sessionId);

    expect(loaded[questionId]).toBe(answer);
  });

  it('should return null for expired data', () => {
    // Mock Date.now() to simulate expiration
    // Test expiration logic
  });
});
```

### Integration Testing

**Test Scenarios**:

1. **Complete Form Flow**
   - Load questions from mock Supabase
   - Navigate through all questions
   - Submit form
   - Verify API calls

2. **Error Recovery**
   - Network failure during load
   - Submission failure with retry
   - Invalid session handling

3. **localStorage Persistence**
   - Save progress mid-survey
   - Reload page
   - Verify answers restored

### End-to-End Testing

**Framework**: Playwright (recommended) or Cypress

**Critical User Journeys**:

1. **Happy Path**
   - Access `/form`
   - Complete all questions
   - Submit successfully
   - See thank you screen
   - Auto-redirect to homepage

2. **Validation Path**
   - Skip required question
   - See error message
   - Answer question
   - Proceed successfully

3. **Navigation Path**
   - Answer questions
   - Use Previous button
   - Verify answers preserved
   - Complete form

4. **Mobile Responsiveness**
   - Test on mobile viewport
   - Verify touch targets
   - Test keyboard on mobile


### Accessibility Testing

**Tools**:
- axe DevTools browser extension
- WAVE accessibility checker
- Lighthouse accessibility audit
- Screen reader testing (NVDA/JAWS/VoiceOver)

**Test Checklist**:
- [ ] All form inputs have associated labels
- [ ] Error messages announced to screen readers
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible and clear
- [ ] Color contrast meets WCAG AA standards
- [ ] Form can be completed without mouse
- [ ] Skip links provided for long forms
- [ ] ARIA attributes correctly implemented

### Performance Testing

**Metrics to Monitor**:
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Cumulative Layout Shift (CLS) < 0.1
- Total Blocking Time (TBT) < 200ms

**Testing Tools**:
- Lighthouse CI
- WebPageTest
- Chrome DevTools Performance panel

**Optimization Targets**:
- Bundle size < 200KB (gzipped)
- Initial load time < 2s on 3G
- Smooth 60fps animations
- No layout shifts during question transitions

## Security Considerations

### Data Protection

1. **No Authentication Required**
   - Public form accessible via link
   - Session-based tracking only
   - No PII collected unless explicitly asked in questions

2. **Input Sanitization**
   - Sanitize all user inputs before storage
   - Use parameterized queries (Supabase handles this)
   - Validate answer types match question types

3. **Rate Limiting**
   - Implement rate limiting on API routes
   - Prevent spam submissions
   - Use Vercel's built-in rate limiting or custom middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limiting logic
  const ip = request.ip || 'unknown';
  // Check rate limit for this IP
  // Return 429 if exceeded
}

export const config = {
  matcher: '/api/form/:path*',
};
```


4. **CORS Configuration**
   - Restrict API access to fredonbytes.cloud domain
   - Set appropriate CORS headers

5. **Environment Variables**
   - Never expose Supabase service key on client
   - Use anon key with Row Level Security (RLS)
   - Secure Resend API key server-side only

### Database Security (Supabase RLS Policies)

```sql
-- Allow public read access to questions
CREATE POLICY "Public can read questions"
ON questions FOR SELECT
TO anon
USING (true);

-- Allow public read access to question options
CREATE POLICY "Public can read question options"
ON question_options FOR SELECT
TO anon
USING (true);

-- Allow public insert to form_sessions
CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT
TO anon
WITH CHECK (true);

-- Allow public insert to form_responses
CREATE POLICYn submit responses"
ON form_responses FOR INSERT
TO anon
WITH CHECK (true);

-- Prevent updates and deletes from public
-- (Only admins can modify via service key)
```

### XSS Prevention

- Use React's built-in XSS protection (JSX escaping)
- Sanitize HTML in email templates
- Validate and escape user input in API responses
- Set Content-Security-Policy headers

```typescript
// next.config.ts
headers: [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  }
]
```

## Deployment Strategy

### Environment Setup

**Required Environment Variables**:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend
RESEND_API_KEY=re_your_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
```

### Database Migration

1. **Create Tables** (run in Supabase SQL editor)
   - Execute schema SQL from Data Models section
   - Verify indexes created
   - Set up RLS policies

2. **Seed Initial Questions** (optional)
   ```sql
   INSERT INTO questions (question_text, description, answer_type, required, display_order)
   VALUES
     ('How satisfied are you with our service?', 'Rate your overall experience', 'single_choice', true, 1),
     ('What did you like most?', 'Tell us what worked well', 'long_text', false, 2);

   INSERT INTO question_options (question_id, option_text, display_order)
   VALUES
     ((SELECT id FROM questions WHERE display_order = 1), 'Very Satisfied', 1),
     ((SELECT id FROM questions WHERE display_order = 1), 'Satisfied', 2),
     ((SELECT id FROM questions WHERE display_order = 1), 'Neutral', 3),
     ((SELECT id FROM questions WHERE display_order = 1), 'Dissatisfied', 4),
     ((SELECT id FROM questions WHERE display_order = 1), 'Very Dissatisfied', 5);
   ```


### Vercel Deployment

1. **Install Supabase Package**
   ```bash
   npm install @supabase/supabase-js
   ```

2. **Configure Environment Variables** in Vercel dashboard
   - Add all required environment variables
   - Ensure NEXT_PUBLIC_* variables are set for client-side access

3. **Deploy**
   ```bash
   npm run pre-deploy  # Runs lint, type-check, and build
   vercel --prod
   ```

4. **Post-Deployment Verification**
   - Test `/form` redirect
   - Verify question loading
   - Submit test form
   - Check admin email received
   - Test on mobile devices

### Monitoring and Analytics

**Recommended Tracking**:
- Form start rate (visits to `/form`)
- Completion rate (submissions / starts)
- Average completion time
- Drop-off points (which questions cause abandonment)
- Error rates (API failures, validation errors)

**Implementation Options**:
- Vercel Analytics (built-in)
- Google Analytics 4 (custom events)
- Supabase database queries for response analytics

```typescript
// Track form events
function trackFormEvent(event: string, metadata?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, {
      event_category: 'Form',
      ...metadata
    });
  }
}

// Usage
trackFormEvent('form_started', { session_id });
trackFormEvent('question_answered', { question_id, step: currentStep });
trackFormEvent('form_submitted', { session_id, duration: completionTime });
```

## Performance Optimization

### Code Splitting

```typescript
// Lazy load heavy components
const FormClient = dynamic(() => import('./FormClient'), {
  loading: () => <FormSkeleton />,
  ssr: false // Client-only component
});

const ThankYouScreen = dynamic(() => import('./ThankYouScreen'), {
  loading: () => <div>Loading...</div>
});
```

### Image Optimization

```typescript
// Use Next.js Image component for background
import Image from 'next/image';

<Image
  src="/fredonbytes-logo-with-background.png"
  alt="Background"
  fill
  className="object-cover opacity-10"
  priority={false}
  quality={75}
/>
```

### Bundle Size Optimization

- Tree-shake Framer Motion (import only needed components)
- Use Lucide React icons selectively
- Minimize Supabase client bundle
- Enable Next.js experimental optimizations

```typescript
// next.config.ts
experimental: {
  optimizePackageImports: ['lucide-react', 'framer-motion', '@supabase/supabase-js'],
}
```


## Accessibility Implementation

### Semantic HTML Structure

```typescript
<main role="main" aria-labelledby="form-title">
  <form onSubmit={handleSubmit} aria-label="Customer satisfaction survey">
    <fieldset>
      <legend id="form-title">Customer Satisfaction Survey</legend>

      {/* Question */}
      <div role="group" aria-labelledby={`question-${question.id}`}>
        <label id={`question-${question.id}`} htmlFor={`answer-${question.id}`}>
          {question.question_text}
          {question.required && <span aria-label="required">*</span>}
        </label>

        {question.description && (
          <p id={`desc-${question.id}`} className="text-sm text-muted-foreground">
            {question.description}
          </p>
        )}

        <input
          id={`answer-${question.id}`}
          aria-describedby={`desc-${question.id}`}
          aria-required={question.required}
          aria-invalid={!!error}
          aria-errormessage={error ? `error-${question.id}` : undefined}
        />

        {error && (
          <div id={`error-${question.id}`} role="alert" aria-live="polite">
            {error}
          </div>
        )}
      </div>
    </fieldset>
  </form>
</main>
```

### Keyboard Navigation

**Supported Keys**:
- `Tab` / `Shift+Tab`: Navigate between inputs and buttons
- `Enter`: Submit current step / activate button
- `Space`: Toggle checkboxes/radio buttons
- `Arrow Keys`: Navigate radio button groups
- `Escape`: Close error modals

**Implementation**:
```typescript
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleNext();
  }
}
```

### Screen Reader Support

**ARIA Live Regions**:
```typescript
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {currentStep === 0 && "Welcome screen. Press Next to begin."}
  {currentStep > 0 && currentStep <= questions.length &&
    `Question ${currentStep} of ${questions.length}: ${questions[currentStep - 1].question_text}`}
  {currentStep > questions.length && "Survey complete. Thank you for your feedback."}
</div>
```

**Progress Announcements**:
```typescript
<div role="status" aria-live="polite" aria-atomic="true">
  Step {currentStep} of {totalSteps}
</div>
```

### Focus Management

```typescript
useEffect(() => {
  // Focus first input when question changes
  const firstInput = document.querySelector<HTMLInputElement>('[data-question-input]');
  firstInput?.focus();
}, [currentStep]);
```

### Reduced Motion Support

```typescript
// Respect prefers-reduced-motion
const prefersReducedMotion = useReducedMotion();

<motion.div
  initial={prefersReducedMotion ? false : { opacity: 0, x: 100 }}
  animate={{ opacity: 1, x: 0 }}
  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
>
```

## Future Enhancements

### Phase 2 Features (Post-MVP)

1. **Multi-language Support**
   - Integrate with existing i18n system
   - Translate questions dynamically
   - Store language preference

2. **Conditional Logic**
   - Show/hide questions based on previous answers
   - Branching survey paths
   - Skip logic implementation

3. **File Upload Questions**
   - Support image/document uploads
   - Store in Supabase Storage
   - Thumbnail previews

4. **Analytics Dashboard**
   - Admin panel for viewing responses
   - Charts and visualizations
   - Export to CSV/Excel

5. **Email Customization**
   - Custom email templates per survey
   - Personalized thank you emails
   - Follow-up email sequences

6. **Advanced Question Types**
   - Rating scales (1-5 stars)
   - Matrix questions
   - Ranking questions
   - Date/time pickers

7. **Survey Templates**
   - Pre-built question sets
   - Industry-specific templates
   - Quick survey creation

8. **Response Validation**
   - Email format validation
   - Phone number validation
   - Custom regex patterns
   - Min/max value constraints

## Design Decisions and Rationale

### Why Supabase over Other Solutions?

**Chosen**: Supabase (PostgreSQL)

**Alternatives Considered**:
- Firebase Firestore
- MongoDB Atlas
- Direct PostgreSQL

**Rationale**:
- PostgreSQL provides strong data integrity with foreign keys
- Supabase offers real-time capabilities for future features
- Built-in authentication for future admin panel
- Row Level Security for fine-grained access control
- Generous free tier suitable for MVP
- TypeScript support with generated types

### Why localStorage over Session Storage?

**Chosen**: localStorage with 24-hour expiration

**Alternatives Considered**:
- sessionStorage (cleared on tab close)
- IndexedDB (more complex API)
- Cookies (size limitations)

**Rationale**:
- Persists across browser sessions (user can close and return)
- Simple API suitable for key-value storage
- 24-hour expiration balances persistence with data freshness
- No server-side session management required
- Works offline for answer caching

### Why Dynamic Routing over Query Parameters?

**Chosen**: `/form/[session_id]` (dynamic route)

**Alternatives Considered**:
- `/form?session=xxx` (query parameter)
- `/form` with cookie-based session

**Rationale**:
- Cleaner URLs for email links
- Better SEO (though not critical for this feature)
- Easier to share and bookmark
- Follows REST conventions
- Simpler to implement with Next.js App Router

### Why Client Component over Server Component?

**Chosen**: Client Component for form logic

**Rationale**:
- Requires interactivity (state, event handlers)
- localStorage access (browser-only API)
- Framer Motion animations (client-side)
- Real-time validation feedback
- Server Component used for initial routing and metadata

## Conclusion

This design provides a comprehensive, production-ready architecture for the FredonBytes Customer Satisfaction Form. The implementation prioritizes:

- **User Experience**: Smooth animations, clear feedback, mobile-optimized
- **Developer Experience**: Type-safe, modular, well-documented
- **Performance**: Optimized bundle size, lazy loading, efficient rendering
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigable, screen reader friendly
- **Maintainability**: Clear separation of concerns, reusable components, consistent patterns
- **Scalability**: Database-driven questions, extensible architecture, future-proof design

The design aligns with FredonBytes' existing tech stack and design system, ensuring seamless integration with the current website while providing a solid foundation for future enhancements.
