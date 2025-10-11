# Form and Survey System Separation Fix

## Problem
After the next-intl migration, both `/form` and `/survey` routes were broken because:
1. The `questions` table for `/form` didn't exist in the database
2. Both systems needed to support multilingual content via `[locale]` parameter
3. The systems needed to operate independently with their own database tables

## Solution Implemented

### 1. Database Migration Created
**File**: `supabase/migrations/20251012000000_form_system.sql`

Created separate tables for the form system:
- `questions` - Form questions with JSONB multilingual support
- `question_options` - Form question options with JSONB multilingual support
- `form_sessions` - Form session tracking with locale support
- `form_responses` - Form response storage

Sample questions added:
1. Rating: "How would you rate your overall experience?"
2. Checklist: "What did you like most about our service?"
3. Single choice: "Would you recommend us to others?"
4. Long text: "Any additional feedback?"

### 2. Type Definitions Updated
**File**: `src/app/lib/supabase.ts`

- Moved `LocalizedString` interface to top (shared by both systems)
- Updated `Question` interface to use `LocalizedString` for `question_text` and `description`
- Updated `QuestionOption` interface to use `LocalizedString` for `option_text`
- Added `active` field to `Question` interface

### 3. Form API Updated
**File**: `src/app/api/form/questions/route.ts`
- Added filter for `active = true` questions
- Returns multilingual questions with JSONB fields

**File**: `src/app/api/form/submit/route.ts`
- Added `locale` parameter to schema validation
- Updated form_sessions upsert to include locale
- Fixed field name: `ip_address` → `ip_address_hash`

### 4. Form Client Updated
**File**: `src/app/[locale]/form/[session_id]/FormClient.tsx`

- Added `locale` prop to `FormClientProps`
- Added `getLocalizedString()` helper function
- Transform questions after fetching to extract localized strings based on locale
- Send locale in submission payload

**File**: `src/app/[locale]/form/[session_id]/page.tsx`
- Pass `locale` parameter to `FormClient`

### 5. Survey System Verified
**File**: `src/app/[locale]/survey/[session_id]/SurveyClient.tsx`
- Already has proper locale support
- Uses `getLocalizedText()` helper
- Fetches locale from survey_sessions table
- Adapts multilingual questions to localized strings

**File**: `src/app/api/survey/questions/route.ts`
- Already properly configured
- Returns multilingual questions from `survey_questions` table

## Database Structure

### Form System Tables
- `questions` (multilingual JSONB)
- `question_options` (multilingual JSONB)
- `form_sessions` (with locale field)
- `form_responses`

### Survey System Tables (unchanged)
- `survey_questions` (multilingual JSONB)
- `survey_question_options` (multilingual JSONB)
- `survey_sessions` (with locale field)
- `survey_responses`

## How It Works

### Form Flow
1. User visits `/cs/form` (or `/en/form`, `/de/form`)
2. Server generates UUID and redirects to `/cs/form/{uuid}`
3. FormClient receives `locale` prop
4. Fetches questions from `/api/form/questions`
5. Transforms questions to extract localized strings based on locale
6. User completes form
7. Submits with locale included
8. API stores session with locale in `form_sessions`

### Survey Flow
1. User receives email with survey link: `/cs/survey/{uuid}`
2. SurveyClient fetches questions from `/api/survey/questions?session_id={uuid}`
3. API returns locale from `survey_sessions` table
4. SurveyClient adapts multilingual questions to localized strings
5. User completes survey
6. Submits to `/api/survey/submit`

## Key Features
- ✅ Both systems operate independently
- ✅ Both support multilingual content (en, cs, de)
- ✅ Locale determined from URL parameter `[locale]`
- ✅ Separate database tables for each system
- ✅ Proper RLS policies for security
- ✅ Sample questions included in migration

## Testing Required
1. Run migration: `supabase db push`
2. Test `/cs/form` - should show Czech questions
3. Test `/en/form` - should show English questions
4. Test `/de/form` - should show German questions
5. Test form submission with locale
6. Test `/survey` routes (should continue working)
7. Verify both systems work independently

## Migration Command
```bash
supabase db push
```

This will create the form system tables and populate them with sample questions.
