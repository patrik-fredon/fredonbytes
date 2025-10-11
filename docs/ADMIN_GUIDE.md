# Admin Guide - Customer Satisfaction Form

This guide provides comprehensive instructions for administrators to manage the Customer Satisfaction Form system, including question management, response analysis, and system maintenance.

## Table of Contents

- [Overview](#overview)
- [Accessing the Admin Panel](#accessing-the-admin-panel)
- [Managing Questions](#managing-questions)
- [Viewing Responses](#viewing-responses)
- [Analytics and Reporting](#analytics-and-reporting)
- [Email Configuration](#email-configuration)
- [System Maintenance](#system-maintenance)
- [Security Best Practices](#security-best-practices)

---

## Overview

The Customer Satisfaction Form system allows you to:
- Create and manage survey questions
- View and analyze customer responses
- Configure email notifications
- Monitor form performance
- Export data for analysis

**Key Components:**
- **Supabase Dashboard:** Database management and query interface
- **Resend Dashboard:** Email delivery monitoring
- **Vercel Dashboard:** Application deployment and logs

---

## Accessing the Admin Panel

### Supabase Dashboard

1. **Log in to Supabase:**
   - Go to [app.supabase.com](https://app.supabase.com)
   - Sign in with your credentials
   - Select the FredonBytes project

2. **Navigate to SQL Editor:**
   - Click "SQL Editor" in left sidebar
   - This is where you'll manage questions and view responses

3. **Navigate to Table Editor:**
   - Click "Table Editor" in left sidebar
   - View and edit data directly in tables

### Required Permissions

To manage the form system, you need:
- Supabase project owner or admin access
- SQL Editor access
- Table Editor access (optional, for visual editing)

---

## Managing Questions

### Viewing All Questions

```sql
-- View all questions with their details
SELECT 
  id,
  question_text,
  description,
  answer_type,
  required,
  display_order,
  created_at
FROM questions
ORDER BY display_order;
```

### Adding a New Question

#### Step 1: Determine Question Type

Choose from:
- `short_text` - Single-line text input (max 200 characters)
- `long_text` - Multi-line text area (max 1000 characters)
- `single_choice` - Radio buttons (one selection)
- `multiple_choice` - Checkboxes (multiple selections)
- `checklist` - Checkboxes with "Select All" option

#### Step 2: Insert Question

```sql
-- Insert a new question
INSERT INTO questions (
  question_text,
  description,
  answer_type,
  required,
  display_order
) VALUES (
  'How would you rate our communication?',
  'Please rate how well we kept you informed throughout the project',
  'single_choice',
  true,
  8  -- Next available display order
);
```

#### Step 3: Add Options (for choice-based questions only)

```sql
-- Get the ID of the question you just created
SELECT id, question_text FROM questions WHERE display_order = 8;

-- Insert options for the question
DO $$
DECLARE
  new_q_id UUID;
BEGIN
  -- Get the question ID
  SELECT id INTO new_q_id FROM questions WHERE display_order = 8;
  
  -- Insert options
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (new_q_id, 'Excellent', 1),
    (new_q_id, 'Good', 2),
    (new_q_id, 'Average', 3),
    (new_q_id, 'Poor', 4),
    (new_q_id, 'Very Poor', 5);
END $$;
```

#### Step 4: Verify Question Added

```sql
-- Verify the question and its options
SELECT 
  q.display_order,
  q.question_text,
  q.answer_type,
  q.required,
  COUNT(qo.id) as option_count
FROM questions q
LEFT JOIN question_options qo ON q.id = qo.question_id
WHERE q.display_order = 8
GROUP BY q.id, q.display_order, q.question_text, q.answer_type, q.required;
```

### Editing Existing Questions

#### Update Question Text

```sql
-- Update question text and description
UPDATE questions 
SET 
  question_text = 'Updated question text here',
  description = 'Updated description here'
WHERE display_order = 3;
```

#### Change Required Status

```sql
-- Make a question required
UPDATE questions 
SET required = true 
WHERE display_order = 5;

-- Make a question optional
UPDATE questions 
SET required = false 
WHERE display_order = 5;
```

#### Update Question Options

```sql
-- Update option text
UPDATE question_options
SET option_text = 'Updated option text'
WHERE id = 'option-uuid-here';

-- Add new option to existing question
INSERT INTO question_options (question_id, option_text, display_order)
VALUES (
  'question-uuid-here',
  'New Option',
  6  -- Next available display order
);

-- Delete an option
DELETE FROM question_options WHERE id = 'option-uuid-here';
```

### Reordering Questions

```sql
-- Swap display order of two questions
BEGIN;
  UPDATE questions SET display_order = 999 WHERE display_order = 2;
  UPDATE questions SET display_order = 2 WHERE display_order = 3;
  UPDATE questions SET display_order = 3 WHERE display_order = 999;
COMMIT;

-- Or use a more complex reordering
BEGIN;
  -- Move question 5 to position 2, shifting others down
  UPDATE questions SET display_order = display_order + 1 
  WHERE display_order >= 2 AND display_order < 5;
  
  UPDATE questions SET display_order = 2 WHERE display_order = 5;
COMMIT;
```

### Archiving Questions (Recommended over Deletion)

Instead of deleting questions, archive them to preserve historical data:

```sql
-- Add active column (one-time setup)
ALTER TABLE questions ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Update RLS policy to only show active questions
DROP POLICY IF EXISTS "Public can read questions" ON questions;
CREATE POLICY "Public can read questions"
ON questions FOR SELECT
TO anon
USING (active = true);

-- Archive a question (keeps data but hides from form)
UPDATE questions SET active = false WHERE display_order = 8;

-- Reactivate a question
UPDATE questions SET active = true WHERE display_order = 8;

-- View archived questions
SELECT * FROM questions WHERE active = false;
```

### Deleting Questions

**⚠️ Warning:** Deleting questions will also delete all responses to those questions due to CASCADE constraints.

```sql
-- Delete a single question (and its options and responses)
DELETE FROM questions WHERE display_order = 8;

-- Delete multiple questions
DELETE FROM questions WHERE display_order IN (8, 9, 10);

-- Delete all questions (DANGEROUS - use with extreme caution)
-- DELETE FROM questions;
```

**Best Practice:** Always backup data before deleting:

```sql
-- Create backup table
CREATE TABLE questions_backup AS SELECT * FROM questions;
CREATE TABLE question_options_backup AS SELECT * FROM question_options;
CREATE TABLE form_responses_backup AS SELECT * FROM form_responses;

-- Then perform deletion
DELETE FROM questions WHERE display_order = 8;
```

---

## Viewing Responses

### View All Form Submissions

```sql
-- Get all form submissions with completion status
SELECT 
  session_id,
  created_at,
  completed_at,
  CASE 
    WHEN completed_at IS NOT NULL THEN 'Completed'
    ELSE 'Incomplete'
  END as status,
  EXTRACT(EPOCH FROM (completed_at - created_at))/60 as completion_time_minutes
FROM form_sessions
ORDER BY created_at DESC
LIMIT 50;
```

### View Responses for a Specific Session

```sql
-- Replace 'session-uuid-here' with actual session_id
SELECT 
  q.display_order,
  q.question_text,
  fr.answer_value,
  fr.submitted_at
FROM form_responses fr
JOIN questions q ON fr.question_id = q.id
WHERE fr.session_id = 'session-uuid-here'
ORDER BY q.display_order;
```

### View Recent Submissions

```sql
-- Get last 10 submissions with all responses
SELECT 
  fs.session_id,
  fs.completed_at,
  q.question_text,
  fr.answer_value
FROM form_sessions fs
JOIN form_responses fr ON fs.session_id = fr.session_id
JOIN questions q ON fr.question_id = q.id
WHERE fs.completed_at IS NOT NULL
ORDER BY fs.completed_at DESC, q.display_order
LIMIT 100;
```

### Search Responses by Content

```sql
-- Find responses containing specific text
SELECT 
  fs.session_id,
  fs.completed_at,
  q.question_text,
  fr.answer_value
FROM form_responses fr
JOIN questions q ON fr.question_id = q.id
JOIN form_sessions fs ON fr.session_id = fs.session_id
WHERE fr.answer_value::text ILIKE '%excellent%'
ORDER BY fs.completed_at DESC;
```

### Export Responses to CSV

```sql
-- Generate CSV-friendly output
COPY (
  SELECT 
    fs.session_id,
    fs.completed_at,
    q.display_order,
    q.question_text,
    fr.answer_value
  FROM form_sessions fs
  JOIN form_responses fr ON fs.session_id = fr.session_id
  JOIN questions q ON fr.question_id = q.id
  WHERE fs.completed_at IS NOT NULL
  ORDER BY fs.completed_at DESC, q.display_order
) TO '/tmp/form_responses.csv' WITH CSV HEADER;
```

**Note:** For Supabase, you may need to use the Table Editor's export feature instead.

---

## Analytics and Reporting

### Completion Rate

```sql
-- Calculate form completion rate
SELECT 
  COUNT(*) as total_sessions,
  COUNT(completed_at) as completed_sessions,
  ROUND(COUNT(completed_at)::numeric / COUNT(*)::numeric * 100, 2) as completion_rate_percent
FROM form_sessions;
```

### Average Completion Time

```sql
-- Calculate average time to complete form
SELECT 
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60), 2) as avg_minutes,
  MIN(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as min_minutes,
  MAX(EXTRACT(EPOCH FROM (completed_at - created_at))/60) as max_minutes
FROM form_sessions
WHERE completed_at IS NOT NULL;
```

### Response Distribution for Single Choice Questions

```sql
-- Analyze responses for a specific single-choice question
SELECT 
  fr.answer_value,
  COUNT(*) as response_count,
  ROUND(COUNT(*)::numeric / SUM(COUNT(*)) OVER () * 100, 2) as percentage
FROM form_responses fr
JOIN questions q ON fr.question_id = q.id
WHERE q.question_text = 'How satisfied are you with our service?'
GROUP BY fr.answer_value
ORDER BY response_count DESC;
```

### Most Common Multiple Choice Selections

```sql
-- Analyze multiple choice responses
SELECT 
  q.question_text,
  jsonb_array_elements_text(fr.answer_value) as selected_option,
  COUNT(*) as selection_count
FROM form_responses fr
JOIN questions q ON fr.question_id = q.id
WHERE q.answer_type IN ('multiple_choice', 'checklist')
GROUP BY q.question_text, selected_option
ORDER BY q.question_text, selection_count DESC;
```

### Submissions Over Time

```sql
-- Daily submission counts for last 30 days
SELECT 
  DATE(completed_at) as submission_date,
  COUNT(*) as submissions
FROM form_sessions
WHERE completed_at >= NOW() - INTERVAL '30 days'
  AND completed_at IS NOT NULL
GROUP BY DATE(completed_at)
ORDER BY submission_date DESC;
```

### Question Skip Rate

```sql
-- Find which optional questions are most often skipped
SELECT 
  q.question_text,
  q.required,
  COUNT(DISTINCT fs.session_id) as total_submissions,
  COUNT(fr.id) as answered_count,
  COUNT(DISTINCT fs.session_id) - COUNT(fr.id) as skipped_count,
  ROUND((COUNT(DISTINCT fs.session_id) - COUNT(fr.id))::numeric / 
        COUNT(DISTINCT fs.session_id)::numeric * 100, 2) as skip_rate_percent
FROM questions q
CROSS JOIN form_sessions fs
LEFT JOIN form_responses fr ON q.id = fr.question_id AND fs.session_id = fr.session_id
WHERE fs.completed_at IS NOT NULL
GROUP BY q.id, q.question_text, q.required
ORDER BY skip_rate_percent DESC;
```

---

## Email Configuration

### Update Email Recipients

Edit `/src/app/api/form/submit/route.ts`:

```typescript
// Change the recipient email
await resend.emails.send({
  from: 'Customer Feedback <noreply@fredonbytes.cloud>',
  to: ['admin@fredonbytes.cloud', 'manager@fredonbytes.cloud'], // Add multiple recipients
  subject: `New Customer Satisfaction Survey - ${sessionId}`,
  html: emailHTML,
});
```

### Customize Email Template

Edit `/src/app/lib/email-templates.ts`:

```typescript
export function generateAdminNotificationHTML(
  sessionId: string,
  responses: Array<{ question_text: string; answer_value: any }>
): string {
  // Customize the HTML template here
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          /* Add your custom styles */
        </style>
      </head>
      <body>
        <!-- Add your custom content -->
      </body>
    </html>
  `;
}
```

### Monitor Email Delivery

1. **Log in to Resend Dashboard:**
   - Go to [resend.com/dashboard](https://resend.com/dashboard)
   - Click "Logs" in sidebar

2. **Check Email Status:**
   - View delivery status
   - Check bounce rates
   - Review spam reports

3. **Troubleshoot Issues:**
   - Check domain verification
   - Verify DNS records
   - Review sender reputation

---

## System Maintenance

### Database Maintenance

#### Check Database Size

```sql
-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Vacuum and Analyze

```sql
-- Optimize database performance
VACUUM ANALYZE questions;
VACUUM ANALYZE question_options;
VACUUM ANALYZE form_sessions;
VACUUM ANALYZE form_responses;
```

#### Archive Old Data

```sql
-- Archive responses older than 1 year
CREATE TABLE form_responses_archive AS
SELECT * FROM form_responses
WHERE submitted_at < NOW() - INTERVAL '1 year';

-- Delete archived data from main table
DELETE FROM form_responses
WHERE submitted_at < NOW() - INTERVAL '1 year';

-- Same for sessions
CREATE TABLE form_sessions_archive AS
SELECT * FROM form_sessions
WHERE created_at < NOW() - INTERVAL '1 year';

DELETE FROM form_sessions
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Backup and Restore

#### Create Backup

```sql
-- In Supabase Dashboard:
-- 1. Go to Database → Backups
-- 2. Click "Create Backup"
-- 3. Wait for completion
```

#### Restore from Backup

```sql
-- In Supabase Dashboard:
-- 1. Go to Database → Backups
-- 2. Select backup point
-- 3. Click "Restore"
-- 4. Confirm restoration
```

#### Export Data

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Or use pg_dump if you have direct access
pg_dump -h db.xxxxx.supabase.co -U postgres -d postgres > backup.sql
```

### Monitor Performance

#### Check Slow Queries

```sql
-- Enable query logging (if not already enabled)
-- Then view slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

#### Check Index Usage

```sql
-- Find unused indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
  AND schemaname = 'public'
ORDER BY tablename;
```

---

## Security Best Practices

### Access Control

1. **Limit Admin Access:**
   - Only grant Supabase access to trusted administrators
   - Use strong passwords
   - Enable 2FA on Supabase account

2. **Protect API Keys:**
   - Never commit API keys to version control
   - Rotate keys regularly
   - Use environment variables

3. **Monitor Access:**
   - Review Supabase audit logs
   - Check for suspicious activity
   - Monitor failed login attempts

### Data Protection

1. **Verify RLS Policies:**
   ```sql
   -- Regularly check RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **Review Policies:**
   ```sql
   -- Check all policies are appropriate
   SELECT * FROM pg_policies WHERE schemaname = 'public';
   ```

3. **Audit Data Access:**
   ```sql
   -- Check who accessed what (if logging enabled)
   SELECT * FROM auth.audit_log_entries
   ORDER BY created_at DESC
   LIMIT 100;
   ```

### Regular Security Tasks

- [ ] Weekly: Review access logs
- [ ] Monthly: Rotate API keys
- [ ] Monthly: Review and update RLS policies
- [ ] Quarterly: Security audit
- [ ] Quarterly: Update dependencies
- [ ] Yearly: Comprehensive security review

---

## Common Admin Tasks

### Task: Add a New Rating Question

```sql
-- 1. Insert question
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'How would you rate our response time?',
  'Please rate how quickly we responded to your inquiries',
  'single_choice',
  true,
  (SELECT MAX(display_order) + 1 FROM questions)
);

-- 2. Add rating options
DO $$
DECLARE
  new_q_id UUID;
BEGIN
  SELECT id INTO new_q_id FROM questions 
  WHERE question_text = 'How would you rate our response time?';
  
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (new_q_id, '⭐⭐⭐⭐⭐ Excellent', 1),
    (new_q_id, '⭐⭐⭐⭐ Good', 2),
    (new_q_id, '⭐⭐⭐ Average', 3),
    (new_q_id, '⭐⭐ Below Average', 4),
    (new_q_id, '⭐ Poor', 5);
END $$;
```

### Task: Generate Monthly Report

```sql
-- Monthly summary report
SELECT 
  DATE_TRUNC('month', completed_at) as month,
  COUNT(*) as total_submissions,
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at))/60), 2) as avg_completion_minutes,
  COUNT(DISTINCT DATE(completed_at)) as active_days
FROM form_sessions
WHERE completed_at IS NOT NULL
  AND completed_at >= DATE_TRUNC('month', NOW() - INTERVAL '6 months')
GROUP BY DATE_TRUNC('month', completed_at)
ORDER BY month DESC;
```

### Task: Find Incomplete Sessions

```sql
-- Find sessions started but not completed (potential issues)
SELECT 
  session_id,
  created_at,
  NOW() - created_at as time_since_start
FROM form_sessions
WHERE completed_at IS NULL
  AND created_at < NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

---

## Support and Resources

### Documentation
- [Form Setup Guide](./FORM_SETUP.md)
- [API Documentation](./API.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Deployment Guide](./DEPLOYMENT.md)

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Resend Documentation](https://resend.com/docs)

### Getting Help
- **Email:** info@fredonbytes.cloud
- **Supabase Support:** https://supabase.com/support
- **Resend Support:** https://resend.com/support

---

**Last Updated:** [Date]

**Maintained By:** FredonBytes Development Team
