-- ============================================================================
-- Database Status Check
-- Run this to see what's currently configured in your database
-- ============================================================================

-- 1. Check if tables exist
SELECT 
  '📋 Tables Status' as check_type,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ Exists'
    ELSE '❌ Missing'
  END as status
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('questions', 'question_options', 'form_sessions', 'form_responses')
ORDER BY table_name;

-- 2. Check RLS status
SELECT 
  '🔒 RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as rls_status
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('questions', 'question_options', 'form_sessions', 'form_responses')
ORDER BY tablename;

-- 3. Check existing policies
SELECT 
  '🛡️ Current Policies' as check_type,
  tablename,
  policyname,
  roles::text as allowed_roles,
  cmd as operation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 4. Count questions
SELECT 
  '📊 Data Status' as check_type,
  'questions' as table_name,
  COUNT(*) as row_count
FROM questions
UNION ALL
SELECT 
  '📊 Data Status',
  'question_options',
  COUNT(*)
FROM question_options
UNION ALL
SELECT 
  '📊 Data Status',
  'form_sessions',
  COUNT(*)
FROM form_sessions
UNION ALL
SELECT 
  '📊 Data Status',
  'form_responses',
  COUNT(*)
FROM form_responses;

-- 5. Check Supabase service role (should exist)
SELECT 
  '🔑 Roles Status' as check_type,
  rolname as role_name,
  CASE 
    WHEN rolname IN ('anon', 'authenticated', 'service_role') THEN '✅ System Role'
    ELSE '👤 Custom Role'
  END as role_type
FROM pg_roles 
WHERE rolname IN ('anon', 'authenticated', 'service_role', 'postgres')
ORDER BY rolname;
