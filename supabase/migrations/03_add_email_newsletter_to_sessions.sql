-- ============================================================================
-- Add email and newsletter_optin columns to sessions table
-- ============================================================================
-- Created: 2025-10-20
-- Purpose: Add email and newsletter subscription tracking to sessions
-- ============================================================================

-- Add email column to sessions
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Add newsletter_optin column to sessions
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS newsletter_optin BOOLEAN DEFAULT false;

-- Add original_session_id for tracking shared/joined sessions
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS original_session_id UUID REFERENCES sessions(session_id) ON DELETE SET NULL;

-- Create session_cache table for offline continuity
CREATE TABLE IF NOT EXISTS session_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  cache_key VARCHAR(255) NOT NULL,
  cache_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, cache_key)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);
CREATE INDEX IF NOT EXISTS idx_sessions_newsletter ON sessions(newsletter_optin);
CREATE INDEX IF NOT EXISTS idx_sessions_original ON sessions(original_session_id);
CREATE INDEX IF NOT EXISTS idx_session_cache_session ON session_cache(session_id);
CREATE INDEX IF NOT EXISTS idx_session_cache_key ON session_cache(cache_key);

-- Add trigger for session_cache updated_at
DROP TRIGGER IF EXISTS update_session_cache_updated_at ON session_cache;
CREATE TRIGGER update_session_cache_updated_at 
  BEFORE UPDATE ON session_cache
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comment on new columns
COMMENT ON COLUMN sessions.email IS 'User email for contact and newsletter';
COMMENT ON COLUMN sessions.newsletter_optin IS 'Whether user opted in to newsletter';
COMMENT ON COLUMN sessions.original_session_id IS 'Reference to original session if this is a shared/joined session';
COMMENT ON TABLE session_cache IS 'Cache for session data to support offline continuity';
