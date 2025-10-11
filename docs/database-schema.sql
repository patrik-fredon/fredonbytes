-- FredonBytes Customer Satisfaction Form Database Schema
-- This file contains the complete database schema for the customer satisfaction form feature
-- Execute this in Supabase SQL Editor to create all tables, indexes, and RLS policies

-- ============================================================================
-- TABLE: questions
-- Stores survey questions with their configuration
-- ============================================================================

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text TEXT NOT NULL,
  description TEXT,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(display_order)
);

-- Index for efficient ordering
CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(display_order);

-- ============================================================================
-- TABLE: question_options
-- Stores options for choice-based questions (single_choice, multiple_choice, checklist)
-- ============================================================================

CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

-- Index for efficient question option lookups
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

-- ============================================================================
-- TABLE: form_sessions
-- Tracks individual form sessions with metadata
-- ============================================================================

CREATE TABLE IF NOT EXISTS form_sessions (
  session_id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes for analytics and reporting
CREATE INDEX IF NOT EXISTS idx_form_sessions_created_at ON form_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_sessions_completed_at ON form_sessions(completed_at);

-- ============================================================================
-- TABLE: form_responses
-- Stores individual question responses for each session
-- ============================================================================

CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES form_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_form_responses_session_id ON form_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_question_id ON form_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses(submitted_at);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Configure access control for public form access
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to questions
CREATE POLICY "Public can read questions"
ON questions FOR SELECT
TO anon
USING (true);

-- Policy: Allow public read access to question options
CREATE POLICY "Public can read question options"
ON question_options FOR SELECT
TO anon
USING (true);

-- Policy: Allow public insert to form_sessions
CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Allow public update to form_sessions (for completion timestamp)
CREATE POLICY "Public can update sessions"
ON form_sessions FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- Policy: Allow public insert to form_responses
CREATE POLICY "Public can submit responses"
ON form_responses FOR INSERT
TO anon
WITH CHECK (true);

-- Policy: Prevent public updates and deletes
-- (Only admins with service key can modify via backend)

-- ============================================================================
-- TRIGGER: Update updated_at timestamp on questions
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to insert sample questions
-- ============================================================================

/*
-- Sample Question 1: Overall Satisfaction (Single Choice)
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'How satisfied are you with our service?',
  'Rate your overall experience with FredonBytes',
  'single_choice',
  true,
  1
);

-- Get the question ID for options
DO $$
DECLARE
  q1_id UUID;
BEGIN
  SELECT id INTO q1_id FROM questions WHERE display_order = 1;
  
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q1_id, 'Very Satisfied', 1),
    (q1_id, 'Satisfied', 2),
    (q1_id, 'Neutral', 3),
    (q1_id, 'Dissatisfied', 4),
    (q1_id, 'Very Dissatisfied', 5);
END $$;

-- Sample Question 2: What did you like? (Long Text)
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'What did you like most about our service?',
  'Tell us what worked well for you',
  'long_text',
  false,
  2
);

-- Sample Question 3: Service Areas (Multiple Choice)
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Which services did you use?',
  'Select all that apply',
  'multiple_choice',
  true,
  3
);

DO $$
DECLARE
  q3_id UUID;
BEGIN
  SELECT id INTO q3_id FROM questions WHERE display_order = 3;
  
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q3_id, 'Cloud Infrastructure', 1),
    (q3_id, 'Web Development', 2),
    (q3_id, 'Consulting', 3),
    (q3_id, 'Support & Maintenance', 4);
END $$;

-- Sample Question 4: Improvements (Long Text)
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'How can we improve?',
  'Share your suggestions for improvement',
  'long_text',
  false,
  4
);

-- Sample Question 5: Recommendation (Single Choice)
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Would you recommend FredonBytes to others?',
  null,
  'single_choice',
  true,
  5
);

DO $$
DECLARE
  q5_id UUID;
BEGIN
  SELECT id INTO q5_id FROM questions WHERE display_order = 5;
  
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q5_id, 'Definitely', 1),
    (q5_id, 'Probably', 2),
    (q5_id, 'Not Sure', 3),
    (q5_id, 'Probably Not', 4),
    (q5_id, 'Definitely Not', 5);
END $$;
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these to verify the schema was created correctly
-- ============================================================================

-- Check tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('questions', 'question_options', 'form_sessions', 'form_responses');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('questions', 'question_options', 'form_sessions', 'form_responses');

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- Check indexes exist
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('questions', 'question_options', 'form_sessions', 'form_responses');
