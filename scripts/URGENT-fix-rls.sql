-- ============================================================================
-- URGENT FIX: RLS Policies for Form Submission
-- Copy this ENTIRE script and run it in Supabase SQL Editor NOW
-- ============================================================================

-- Step 1: Check current policies (for debugging)
SELECT 
  tablename,
  policyname,
  roles::text,
  cmd
FROM pg_policies 
WHERE tablename IN ('form_sessions', 'form_responses')
ORDER BY tablename;

-- Step 2: Drop ALL existing policies on these tables
DROP POLICY IF EXISTS "Public can create sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can update sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can submit responses" ON form_responses;
DROP POLICY IF EXISTS "Enable insert for anon users" ON form_sessions;
DROP POLICY IF EXISTS "Enable update for anon users" ON form_sessions;
DROP POLICY IF EXISTS "Enable insert for anon users" ON form_responses;

-- Step 3: Create NEW policies that definitely work
CREATE POLICY "allow_anon_insert_sessions"
ON form_sessions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "allow_anon_update_sessions"
ON form_sessions
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "allow_anon_insert_responses"
ON form_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Step 4: Verify the new policies
SELECT 
  '✅ Policies created successfully!' as status,
  tablename,
  policyname,
  roles::text
FROM pg_policies 
WHERE tablename IN ('form_sessions', 'form_responses')
ORDER BY tablename, policyname;

-- Step 5: Test if RLS is enabled (should be true)
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('form_sessions', 'form_responses');
