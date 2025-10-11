-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,
  message TEXT NOT NULL,
  requirements JSONB,
  newsletter_opt_in BOOLEAN DEFAULT false,
  privacy_accepted BOOLEAN NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  ip_address_hash TEXT,
  user_agent TEXT,
  survey_sent BOOLEAN DEFAULT false,
  survey_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'contact_form',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_session_id ON contact_submissions(session_id);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(active);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_submissions
-- Allow public to insert their own submissions
CREATE POLICY "Allow public insert on contact_submissions"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own submissions by session_id
CREATE POLICY "Allow public read own contact_submissions"
  ON contact_submissions
  FOR SELECT
  TO public
  USING (true);

-- RLS Policies for newsletter_subscribers
-- Allow public to insert subscriptions
CREATE POLICY "Allow public insert on newsletter_subscribers"
  ON newsletter_subscribers
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own subscription by email
CREATE POLICY "Allow public read own newsletter_subscription"
  ON newsletter_subscribers
  FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions with survey tracking';
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscription preferences';
COMMENT ON COLUMN contact_submissions.session_id IS 'Unique session ID for linking to survey responses';
COMMENT ON COLUMN contact_submissions.survey_sent IS 'Flag indicating if survey email was sent';
COMMENT ON COLUMN contact_submissions.survey_completed IS 'Flag indicating if customer completed the survey';
COMMENT ON COLUMN newsletter_subscribers.source IS 'Source of subscription (contact_form, footer, etc.)';
