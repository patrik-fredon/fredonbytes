-- ============================================================================
-- FredonBytes Customer Satisfaction Form - Complete Database Setup
-- This script creates the schema AND seeds the questions in one go
-- Execute this in Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PART 1: CREATE SCHEMA
-- ============================================================================

-- TABLE: questions
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

CREATE INDEX IF NOT EXISTS idx_questions_display_order ON questions(display_order);

-- TABLE: question_options
CREATE TABLE IF NOT EXISTS question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON question_options(question_id);

-- TABLE: form_sessions
CREATE TABLE IF NOT EXISTS form_sessions (
  session_id UUID PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_form_sessions_created_at ON form_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_form_sessions_completed_at ON form_sessions(completed_at);

-- TABLE: form_responses
CREATE TABLE IF NOT EXISTS form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES form_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_form_responses_session_id ON form_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_question_id ON form_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_form_responses_submitted_at ON form_responses(submitted_at);

-- ROW LEVEL SECURITY
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read questions" ON questions;
DROP POLICY IF EXISTS "Public can read question options" ON question_options;
DROP POLICY IF EXISTS "Public can create sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can update sessions" ON form_sessions;
DROP POLICY IF EXISTS "Public can submit responses" ON form_responses;

-- Create policies
CREATE POLICY "Public can read questions"
ON questions FOR SELECT TO anon USING (true);

CREATE POLICY "Public can read question options"
ON question_options FOR SELECT TO anon USING (true);

CREATE POLICY "Public can create sessions"
ON form_sessions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can update sessions"
ON form_sessions FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Public can submit responses"
ON form_responses FOR INSERT TO anon WITH CHECK (true);

-- TRIGGER
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 2: SEED QUESTIONS
-- ============================================================================

-- Clear existing data (optional - comment out if you want to keep existing data)
DELETE FROM form_responses;
DELETE FROM form_sessions;
DELETE FROM question_options;
DELETE FROM questions;

-- QUESTION 1: Overall Satisfaction
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'How satisfied are you with our service?',
  'Rate your overall experience with FredonBytes',
  'single_choice',
  true,
  1
);

DO $$
DECLARE q1_id UUID;
BEGIN
  SELECT id INTO q1_id FROM questions WHERE display_order = 1;
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q1_id, 'Very Satisfied', 1),
    (q1_id, 'Satisfied', 2),
    (q1_id, 'Neutral', 3),
    (q1_id, 'Dissatisfied', 4),
    (q1_id, 'Very Dissatisfied', 5);
END $$;

-- QUESTION 2: Services Used
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Which services did you use?',
  'Select all services you have experienced with FredonBytes',
  'multiple_choice',
  true,
  2
);

DO $$
DECLARE q2_id UUID;
BEGIN
  SELECT id INTO q2_id FROM questions WHERE display_order = 2;
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q2_id, 'Cloud Infrastructure & DevOps', 1),
    (q2_id, 'Web Development', 2),
    (q2_id, 'Mobile App Development', 3),
    (q2_id, 'Technical Consulting', 4),
    (q2_id, 'Support & Maintenance', 5),
    (q2_id, 'Other', 6);
END $$;

-- QUESTION 3: What You Liked
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'What did you like most about our service?',
  'Tell us what worked well for you and what exceeded your expectations',
  'long_text',
  false,
  3
);

-- QUESTION 4: Project Name
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'What project did we work on together?',
  'Optional: Help us identify which project this feedback relates to',
  'short_text',
  false,
  4
);

-- QUESTION 5: Areas for Improvement
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Which areas could we improve?',
  'Select all areas where you think we could do better',
  'checklist',
  false,
  5
);

DO $$
DECLARE q5_id UUID;
BEGIN
  SELECT id INTO q5_id FROM questions WHERE display_order = 5;
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q5_id, 'Communication & Updates', 1),
    (q5_id, 'Response Time', 2),
    (q5_id, 'Technical Expertise', 3),
    (q5_id, 'Project Management', 4),
    (q5_id, 'Documentation', 5),
    (q5_id, 'Pricing & Value', 6),
    (q5_id, 'Post-Project Support', 7);
END $$;

-- QUESTION 6: Additional Feedback
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Any additional feedback or suggestions?',
  'Share any other thoughts, concerns, or ideas you have',
  'long_text',
  false,
  6
);

-- QUESTION 7: Recommendation Likelihood
INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Would you recommend FredonBytes to others?',
  'How likely are you to recommend our services to colleagues or friends?',
  'single_choice',
  true,
  7
);

DO $$
DECLARE q7_id UUID;
BEGIN
  SELECT id INTO q7_id FROM questions WHERE display_order = 7;
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q7_id, 'Definitely Yes', 1),
    (q7_id, 'Probably Yes', 2),
    (q7_id, 'Not Sure', 3),
    (q7_id, 'Probably Not', 4),
    (q7_id, 'Definitely Not', 5);
END $$;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

SELECT 
  '✅ Database setup complete!' as status,
  COUNT(*) as total_questions
FROM questions;

SELECT 
  display_order,
  question_text,
  answer_type,
  required
FROM questions
ORDER BY display_order;
