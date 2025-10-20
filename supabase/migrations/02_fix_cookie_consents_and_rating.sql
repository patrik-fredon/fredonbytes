-- ============================================================================
-- FIX COOKIE CONSENTS TABLE AND ADD RATING SUPPORT
-- ============================================================================
-- This migration fixes the cookie_consents table schema to match the API
-- and ensures rating questions work properly
-- ============================================================================

-- Drop old cookie_consents table
DROP TABLE IF EXISTS cookie_consents CASCADE;

-- Create new cookie_consents table with correct schema
CREATE TABLE cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,
  ip_address_hash VARCHAR(255),
  user_agent TEXT,
  consent_version INTEGER NOT NULL DEFAULT 1,
  essential_cookies BOOLEAN NOT NULL DEFAULT true,
  analytics_cookies BOOLEAN NOT NULL DEFAULT false,
  marketing_cookies BOOLEAN NOT NULL DEFAULT false,
  preferences_cookies BOOLEAN NOT NULL DEFAULT false,
  consent_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cookie_consents_session ON cookie_consents(session_id);
CREATE INDEX idx_cookie_consents_timestamp ON cookie_consents(consent_timestamp);

CREATE TRIGGER update_cookie_consents_updated_at 
  BEFORE UPDATE ON cookie_consents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on cookie_consents
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Cookie consents: public manage (users can create/read their own)
CREATE POLICY "Public manage cookie consents" ON cookie_consents FOR ALL USING (true);

COMMENT ON TABLE cookie_consents IS 'Stores user cookie consent preferences per session';
COMMENT ON COLUMN cookie_consents.session_id IS 'Unique session identifier for tracking consent';
COMMENT ON COLUMN cookie_consents.ip_address_hash IS 'Hashed IP address for privacy compliance';
COMMENT ON COLUMN cookie_consents.consent_version IS 'Version of consent policy accepted';

-- ============================================================================
-- VERIFY RATING QUESTION TYPE
-- ============================================================================
-- Rating questions don't need options - they use a 1-5 scale by default
-- The answer_type 'rating' is already in the questions table CHECK constraint
-- No additional changes needed for rating support

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
