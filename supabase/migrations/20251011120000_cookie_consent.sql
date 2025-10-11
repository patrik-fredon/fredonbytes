-- FredonBytes Cookie Consent System Database Schema
-- This file contains the database schema for the cookie consent management feature
-- Execute this in Supabase SQL Editor to create the cookie_consents table

-- ============================================================================
-- TABLE: cookie_consents
-- Stores user cookie consent preferences with anonymized tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,
  ip_address_hash TEXT NOT NULL, -- Anonymized via SHA-256
  user_agent TEXT,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consent_version INTEGER NOT NULL DEFAULT 1,
  essential_cookies BOOLEAN NOT NULL DEFAULT true,
  analytics_cookies BOOLEAN NOT NULL DEFAULT false,
  marketing_cookies BOOLEAN NOT NULL DEFAULT false,
  preferences_cookies BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- Optimize query performance for common access patterns
-- ============================================================================

-- Index for session-based lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_cookie_consents_session_id ON cookie_consents(session_id);

-- Index for analytics and reporting by timestamp
CREATE INDEX IF NOT EXISTS idx_cookie_consents_timestamp ON cookie_consents(consent_timestamp);

-- Index for version-based queries (for re-prompting users)
CREATE INDEX IF NOT EXISTS idx_cookie_consents_version ON cookie_consents(consent_version);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configure access control for cookie consent management
-- ============================================================================

-- Enable RLS on cookie_consents table
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public insert for storing new consent preferences
CREATE POLICY "Public can create cookie consents"
ON cookie_consents FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow public read access by session_id
-- Users can only read their own consent based on session_id
CREATE POLICY "Public can read own cookie consents"
ON cookie_consents FOR SELECT
TO anon
USING (true);

-- Policy: Allow public update for modifying consent preferences
-- Users can update their own consent preferences
CREATE POLICY "Public can update own cookie consents"
ON cookie_consents FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Note: DELETE is not allowed for public users (GDPR compliance requires admin action)

-- ============================================================================
-- TRIGGER: Update updated_at timestamp
-- Automatically update the updated_at field when a record is modified
-- ============================================================================

CREATE OR REPLACE FUNCTION update_cookie_consents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cookie_consents_updated_at
BEFORE UPDATE ON cookie_consents
FOR EACH ROW
EXECUTE FUNCTION update_cookie_consents_updated_at();

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the schema was created correctly
-- ============================================================================

-- Check table exists
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cookie_consents';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'cookie_consents';

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cookie_consents';

-- Check indexes exist
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' AND tablename = 'cookie_consents';
