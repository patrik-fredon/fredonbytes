-- ============================================================================
-- Fix RLS Policies for Form Submission
-- Run this in Supabase SQL Editor to fix the permission issues
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Public can create sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can update sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can submit responses" ON form_responses;
DROP POLICY IF EXISTS "Public can read questions" ON questions;
DROP POLICY IF EXISTS "Public can read question options" ON question_options;

-- Recreate policies with correct permissions

-- Allow anonymous users to read questions
CREATE POLICY "Public can read questions"
ON questions FOR SELECT
TO public
USING (true);

-- Allow anonymous users to read question options
CREATE POLICY "Public can read question options"
ON question_options FOR SELECT
TO public
USING (true);

-- Allow anonymous users to create sessions
CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT
TO public
WITH CHECK (true);

-- Allow anonymous users to update their own sessions
CREATE POLICY "Public can update sessions"
ON form_sessions FOR UPDATE
TO public
USING (true)
WITH CHECK (true);

-- Allow anonymous users to submit responses
CREATE POLICY "Public can submit responses"
ON form_responses FOR INSERT
TO public
WITH CHECK (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE schemaname = 'public' 
  AND tablename IN ('questions', 'question_options', 'form_sessions', 'form_responses')
ORDER BY tablename, policyname;
