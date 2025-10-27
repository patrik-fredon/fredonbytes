-- ============================================================================
-- CONTACT SUBMISSIONS ENHANCEMENT MIGRATION
-- ============================================================================
-- Created: 2025-10-27
-- Purpose: Extend contact_submissions table with detailed contact form fields
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD NEW COLUMNS TO CONTACT_SUBMISSIONS
-- ============================================================================

-- Add first_name and last_name (split from 'name' field)
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS first_name VARCHAR(255);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS last_name VARCHAR(255);

-- Add phone number
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Add project details
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS project_type VARCHAR(255);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS budget VARCHAR(100);
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS timeline VARCHAR(100);

-- Add requirements as JSONB array
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS requirements JSONB;

-- Add newsletter opt-in
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS newsletter_opt_in BOOLEAN DEFAULT false;

-- Add privacy acceptance
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS privacy_accepted BOOLEAN DEFAULT true;

-- Add locale for multilingual support
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS locale VARCHAR(5) DEFAULT 'en';

-- Add survey tracking
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS survey_sent BOOLEAN DEFAULT false;

-- Add IP address hash for tracking (privacy-preserving)
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS ip_address_hash VARCHAR(64);

-- Add user agent for device tracking
ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- ============================================================================
-- STEP 2: MIGRATE EXISTING DATA (if any exists)
-- ============================================================================

-- Split 'name' field into first_name and last_name for existing records
UPDATE contact_submissions
SET
  first_name = SPLIT_PART(name, ' ', 1),
  last_name = CASE
    WHEN ARRAY_LENGTH(STRING_TO_ARRAY(name, ' '), 1) > 1
    THEN SUBSTRING(name FROM LENGTH(SPLIT_PART(name, ' ', 1)) + 2)
    ELSE ''
  END
WHERE name IS NOT NULL AND (first_name IS NULL OR last_name IS NULL);

-- ============================================================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_contact_first_name ON contact_submissions(first_name);
CREATE INDEX IF NOT EXISTS idx_contact_last_name ON contact_submissions(last_name);
CREATE INDEX IF NOT EXISTS idx_contact_phone ON contact_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_contact_project_type ON contact_submissions(project_type);
CREATE INDEX IF NOT EXISTS idx_contact_locale ON contact_submissions(locale);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_newsletter ON contact_submissions(newsletter_opt_in);
CREATE INDEX IF NOT EXISTS idx_contact_survey_sent ON contact_submissions(survey_sent);

-- GIN index for JSONB requirements field
CREATE INDEX IF NOT EXISTS idx_contact_requirements ON contact_submissions USING GIN(requirements);

-- ============================================================================
-- STEP 4: UPDATE RLS POLICIES (if needed)
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can insert contact submissions" ON contact_submissions;

-- Create policy for public insert (contact form)
CREATE POLICY "Public can insert contact submissions" ON contact_submissions
  FOR INSERT
  WITH CHECK (true);

-- ============================================================================
-- STEP 5: ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON COLUMN contact_submissions.first_name IS 'Contact first name';
COMMENT ON COLUMN contact_submissions.last_name IS 'Contact last name';
COMMENT ON COLUMN contact_submissions.phone IS 'Contact phone number';
COMMENT ON COLUMN contact_submissions.project_type IS 'Type of project requested';
COMMENT ON COLUMN contact_submissions.budget IS 'Project budget range';
COMMENT ON COLUMN contact_submissions.timeline IS 'Project timeline';
COMMENT ON COLUMN contact_submissions.requirements IS 'Additional project requirements (JSONB array)';
COMMENT ON COLUMN contact_submissions.newsletter_opt_in IS 'Newsletter subscription opt-in';
COMMENT ON COLUMN contact_submissions.privacy_accepted IS 'Privacy policy acceptance';
COMMENT ON COLUMN contact_submissions.locale IS 'User locale (en, cs, de)';
COMMENT ON COLUMN contact_submissions.survey_sent IS 'Whether satisfaction survey was sent';
COMMENT ON COLUMN contact_submissions.ip_address_hash IS 'Hashed IP address for privacy';
COMMENT ON COLUMN contact_submissions.user_agent IS 'User agent string for device tracking';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE contact_submissions IS 'Enhanced contact form submissions with detailed fields and multilingual support';
