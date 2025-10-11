-- ============================================================================
-- Add Newsletter Subscription Field to Form Sessions
-- Run this in Supabase SQL Editor to add newsletter opt-in tracking
-- ============================================================================

-- Add newsletter_optin column to form_sessions table
ALTER TABLE form_sessions
ADD COLUMN IF NOT EXISTS newsletter_optin BOOLEAN DEFAULT false;

-- Add email column to form_sessions (optional - for newsletter)
ALTER TABLE form_sessions
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for newsletter queries
CREATE INDEX IF NOT EXISTS idx_form_sessions_newsletter
ON form_sessions(newsletter_optin)
WHERE newsletter_optin = true;

-- Verify the changes
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'form_sessions'
  AND column_name IN ('newsletter_optin', 'email')
ORDER BY column_name;
