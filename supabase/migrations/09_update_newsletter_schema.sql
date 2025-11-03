-- Migration 09: Update newsletter_subscribers schema
-- Created: 2025-11-03
-- Purpose: Add missing columns and rename 'subscribed' to 'active' to match API code

-- Add new columns
ALTER TABLE newsletter_subscribers 
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website',
  ADD COLUMN IF NOT EXISTS subscribed_at TIMESTAMP WITH TIME ZONE;

-- Rename 'subscribed' column to 'active' to match API expectations
ALTER TABLE newsletter_subscribers 
  RENAME COLUMN subscribed TO active;

-- Update subscribed_at for existing records (set to created_at)
UPDATE newsletter_subscribers 
SET subscribed_at = created_at 
WHERE subscribed_at IS NULL;

-- Add index for active status
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(active);
CREATE INDEX IF NOT EXISTS idx_newsletter_source ON newsletter_subscribers(source);

-- Update comment
COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscribers with opt-in/opt-out tracking';
COMMENT ON COLUMN newsletter_subscribers.active IS 'Whether subscription is currently active';
COMMENT ON COLUMN newsletter_subscribers.unsubscribed_at IS 'Timestamp when user unsubscribed (null if subscribed)';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source of subscription (website, form, survey, etc.)';
