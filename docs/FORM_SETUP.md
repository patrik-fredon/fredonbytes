# Customer Satisfaction Form - Setup Guide

This guide provides step-by-step instructions for setting up the FredonBytes Customer Satisfaction Form feature, including database configuration, environment variables, and initial data seeding.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Seed Data Installation](#seed-data-installation)
- [Testing & Verification](#testing--verification)
- [Troubleshooting](#troubleshooting)
- [Managing Questions](#managing-questions)

## Overview

The Customer Satisfaction Form is a dynamic survey system that allows FredonBytes to collect structured feedback from clients. The system features:

- Session-based form access via unique URLs
- Multiple question types (text, choice, checklist)
- Local storage for progress persistence
- Email notifications for submissions
- Responsive design with smooth animations
- Full accessibility support

## Prerequisites

Before setting up the form feature, ensure you have:

1. **Supabase Account & Project**
   - Active Supabase project
   - Access to SQL Editor
   - Project URL and API keys

2. **Resend Account**
   - Active Resend account
   - API key for sending emails
   - Verified sender domain

3. **Development Environment**
   - Node.js 18+ installed
   - npm package manager
   - Project dependencies installed (`npm install`)

## Environment Configuration

### Required Environment Variables

Add the following environment variables to your `.env` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here

# Site Configuration (already configured)
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
```

### Getting Your Supabase Credentials

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Important:** Never use the `service_role` key on the client side. The `anon` key is protected by Row Level Security (RLS) policies.

### Getting Your Resend API Key

1. Log in to [Resend Dashboard](https://resend.com/dashboard)
2. Navigate to **API Keys**
3. Create a new API key or copy existing one
4. Add to `.env` as `RESEND_API_KEY`

### Update .env.example

Ensure `.env.example` is updated with placeholder values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend Email Configuration
RESEND_API_KEY=re_your_api_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
```

## Database Setup

### Step 1: Create Database Schema

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the contents of `docs/database-schema.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute

This will create:
- 4 tables: `questions`, `question_options`, `form_sessions`, `form_responses`
- Indexes for efficient querying
- Row Level Security (RLS) policies
- Triggers for timestamp updates

### Step 2: Verify Schema Creation

Run the following verification query in SQL Editor:

```sql
-- Check that all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('questions', 'question_options', 'form_sessions', 'form_responses');
```

Expected result: 4 rows showing all table names.

### Step 3: Verify RLS Policies

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('questions', 'question_options', 'form_sessions', 'form_responses');
```

Expected result: All tables should have `rowsecurity = true`.

```sql
-- Check policies exist
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

Expected result: At least 5 policies (read questions, read options, create sessions, update sessions, submit responses).

## Seed Data Installation

### Step 1: Load Sample Questions

1. Open Supabase SQL Editor
2. Click **New Query**
3. Copy the contents of `scripts/seed-form-questions.sql`
4. Paste into the SQL Editor
5. Click **Run** to execute

This will insert 7 sample questions covering all answer types:
- Overall satisfaction (single choice)
- Services used (multiple choice)
- What you liked (long text)
- Project name (short text)
- Areas for improvement (checklist)
- Additional feedback (long text)
- Recommendation likelihood (single choice)

### Step 2: Verify Seed Data

The seed script includes verification queries at the end. Check the results:

**Questions Summary:**
```sql
SELECT 
  display_order,
  question_text,
  answer_type,
  required
FROM questions
ORDER BY display_order;
```

Expected: 7 questions with various answer types.

**Options Summary:**
```sql
SELECT 
  q.display_order as question_order,
  q.question_text,
  COUNT(qo.id) as option_count
FROM questions q
LEFT JOIN question_options qo ON q.id = qo.question_id
GROUP BY q.id, q.display_order, q.question_text
ORDER BY q.display_order;
```

Expected: Questions with choice-based types should have multiple options.

### Optional: Clear Existing Data

If you need to reset the questions, uncomment the DELETE statements at the top of `seed-form-questions.sql`:

```sql
DELETE FROM form_responses;
DELETE FROM form_sessions;
DELETE FROM question_options;
DELETE FROM questions;
```

**Warning:** This will delete all form data including submitted responses.

## Testing & Verification

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Test Form Access

1. Open browser to `http://localhost:3000/form`
2. Verify redirect to `/form/{session_id}`
3. Verify welcome screen displays
4. Click "Start Survey" and verify first question loads

### Step 4: Test Question Flow

1. Answer each question
2. Verify "Previous" and "Next" buttons work
3. Verify validation on required questions
4. Verify answers persist in localStorage (check DevTools → Application → Local Storage)

### Step 5: Test Form Submission

1. Complete all required questions
2. Click "Submit" on final question
3. Verify thank you screen displays
4. Check admin email inbox for notification
5. Verify data in Supabase:

```sql
-- Check form sessions
SELECT * FROM form_sessions ORDER BY created_at DESC LIMIT 5;

-- Check form responses
SELECT 
  fs.session_id,
  q.question_text,
  fr.answer_value,
  fr.submitted_at
FROM form_responses fr
JOIN questions q ON fr.question_id = q.id
JOIN form_sessions fs ON fr.session_id = fs.session_id
ORDER BY fr.submitted_at DESC
LIMIT 20;
```

### Step 6: Test Error Handling

1. Disconnect internet and try to load form (should show error with retry)
2. Try to submit without answering required questions (should show validation error)
3. Reload page mid-survey (should restore progress from localStorage)

## Troubleshooting

### Issue: Questions Not Loading

**Symptoms:** Form shows loading state indefinitely or displays error message.

**Solutions:**
1. Verify Supabase credentials in `.env`
2. Check RLS policies are enabled:
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'questions';
   ```
3. Verify questions exist in database:
   ```sql
   SELECT COUNT(*) FROM questions;
   ```
4. Check browser console for error messages
5. Verify Supabase project is not paused

### Issue: Form Submission Fails

**Symptoms:** Error message on submission, data not saved to database.

**Solutions:**
1. Check RLS policies for `form_sessions` and `form_responses`
2. Verify Resend API key is correct
3. Check Supabase logs in dashboard (Logs → API)
4. Verify network requests in browser DevTools
5. Check that all required questions are answered

### Issue: Email Notifications Not Received

**Symptoms:** Form submits successfully but no email arrives.

**Solutions:**
1. Verify Resend API key in `.env`
2. Check Resend dashboard for email logs
3. Verify sender domain is verified in Resend
4. Check spam/junk folder
5. Review API logs in `/api/form/submit` endpoint

### Issue: localStorage Not Working

**Symptoms:** Progress not saved when reloading page.

**Solutions:**
1. Check browser localStorage is enabled
2. Verify no browser extensions blocking storage
3. Check localStorage quota (should show warning if exceeded)
4. Clear browser cache and try again
5. Test in incognito mode

### Issue: Session ID Invalid

**Symptoms:** Redirect loop or error about invalid session.

**Solutions:**
1. Clear localStorage for the site
2. Clear browser cookies
3. Access `/form` directly (not `/form/{session_id}`)
4. Check browser console for UUID validation errors

## Managing Questions

### Adding New Questions

1. Open Supabase SQL Editor
2. Insert new question:

```sql
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Your question text here',
  'Optional description',
  'single_choice', -- or 'long_text', 'short_text', 'multiple_choice', 'checklist'
  true, -- or false for optional
  8 -- next available display_order
);
```

3. For choice-based questions, add options:

```sql
DO $$
DECLARE
  new_q_id UUID;
BEGIN
  SELECT id INTO new_q_id FROM questions WHERE display_order = 8;
  
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (new_q_id, 'Option 1', 1),
    (new_q_id, 'Option 2', 2),
    (new_q_id, 'Option 3', 3);
END $$;
```

### Editing Questions

```sql
-- Update question text
UPDATE questions 
SET question_text = 'Updated question text',
    description = 'Updated description'
WHERE display_order = 1;

-- Update option text
UPDATE question_options
SET option_text = 'Updated option text'
WHERE id = 'option-uuid-here';
```

### Reordering Questions

```sql
-- Swap display order of two questions
UPDATE questions SET display_order = 999 WHERE display_order = 2;
UPDATE questions SET display_order = 2 WHERE display_order = 3;
UPDATE questions SET display_order = 3 WHERE display_order = 999;
```

### Deleting Questions

```sql
-- Delete a question (will cascade to options and responses)
DELETE FROM questions WHERE display_order = 8;

-- Note: This will also delete all responses to this question
-- Consider archiving instead if you need historical data
```

### Archiving Questions (Recommended)

Instead of deleting, add an `active` column:

```sql
-- Add active column (one-time setup)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update RLS policy to only show active questions
DROP POLICY IF EXISTS "Public can read questions" ON questions;
CREATE POLICY "Public can read questions"
ON questions FOR SELECT
TO anon
USING (active = true);

-- Archive a question
UPDATE questions SET active = false WHERE display_order = 8;
```

## Next Steps

After completing the setup:

1. **Customize Questions:** Modify the seed data to match your specific needs
2. **Test Thoroughly:** Complete multiple test submissions
3. **Configure Email Template:** Customize the email notification in `src/app/lib/email-templates.ts`
4. **Set Up Analytics:** Track form completion rates and drop-off points
5. **Deploy to Production:** Follow deployment guide in main README.md

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Project README](../README.md)
- [Database Schema](./database-schema.sql)
- [Seed Script](../scripts/seed-form-questions.sql)

## Support

For issues or questions:
- Email: info@fredonbytes.cloud
- Check project documentation in `/docs`
- Review Supabase logs for database errors
- Check Resend dashboard for email delivery issues
