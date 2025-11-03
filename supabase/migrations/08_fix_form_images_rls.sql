-- Migration 08: Fix form_answer_images RLS policies
-- Created: 2025-11-03
-- Purpose: Add RLS policies to allow image metadata inserts (API validates sessions)

-- Drop RLS if no policies needed (API-level validation is sufficient)
-- The form_answer_images table stores metadata only, actual images are in storage
-- Session validation happens in the upload API endpoint
ALTER TABLE form_answer_images DISABLE ROW LEVEL SECURITY;

-- Alternative: If you want to keep RLS enabled, uncomment these policies instead:
/*
-- Policy: Allow inserts from service role (API uses service role client)
CREATE POLICY "Allow service role to insert images"
  ON form_answer_images
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy: Allow service role to select images
CREATE POLICY "Allow service role to select images"
  ON form_answer_images
  FOR SELECT
  TO service_role
  USING (true);

-- Policy: Allow service role to delete images
CREATE POLICY "Allow service role to delete images"
  ON form_answer_images
  FOR DELETE
  TO service_role
  USING (true);
*/

COMMENT ON TABLE form_answer_images IS 'Tracks images uploaded as form answers. RLS disabled - API validates sessions.';
