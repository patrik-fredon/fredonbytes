-- ============================================================================
-- COMPLETE DATABASE RESET AND SETUP FOR FREDONBYTES PROJECT
-- ============================================================================
-- This script will:
-- 1. Drop all existing tables (clean slate)
-- 2. Create all tables with proper structure
-- 3. Set up RLS policies
-- 4. Seed with sample data
--
-- WARNING: This will DELETE ALL DATA in the database!
-- Only run this in development or when you want a fresh start.
-- ============================================================================

-- ============================================================================
-- STEP 1: DROP ALL EXISTING TABLES
-- ============================================================================

DROP TABLE IF EXISTS form_responses CASCADE;
DROP TABLE IF EXISTS form_sessions CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_sessions CASCADE;
DROP TABLE IF EXISTS survey_question_options CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;

DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS cookie_consents CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- ============================================================================
-- STEP 2: CREATE UTILITY FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 3: CREATE FORM SYSTEM TABLES
-- ============================================================================

-- Table: questions (for standalone form)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  answer_type TEXT NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist', 'rating')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE questions IS 'Form questions with multilingual support';
COMMENT ON COLUMN questions.question_text IS 'Question text in multiple languages (JSONB: {en, cs, de})';
COMMENT ON COLUMN questions.answer_type IS 'Type of answer: short_text, long_text, single_choice, multiple_choice, checklist, rating';

CREATE INDEX idx_questions_display_order ON questions(display_order);
CREATE INDEX idx_questions_active ON questions(active);

-- Table: question_options (for form choice questions)
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

COMMENT ON TABLE question_options IS 'Options for choice-based form questions';
COMMENT ON COLUMN question_options.option_text IS 'Option text in multiple languages (JSONB: {en, cs, de})';

CREATE INDEX idx_question_options_question_id ON question_options(question_id);

-- Table: form_sessions
CREATE TABLE form_sessions (
  session_id UUID PRIMARY KEY,
  locale TEXT NOT NULL DEFAULT 'en',
  newsletter_optin BOOLEAN DEFAULT false,
  email TEXT,
  ip_address_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE form_sessions IS 'Tracks individual form completion sessions';

CREATE INDEX idx_form_sessions_created_at ON form_sessions(created_at);
CREATE INDEX idx_form_sessions_completed_at ON form_sessions(completed_at);

-- Table: form_responses
CREATE TABLE form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES form_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL, -- Can be string, array, or number
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE form_responses IS 'Individual question responses for form sessions';

CREATE INDEX idx_form_responses_session_id ON form_responses(session_id);
CREATE INDEX idx_form_responses_question_id ON form_responses(question_id);
CREATE INDEX idx_form_responses_submitted_at ON form_responses(submitted_at);

-- ============================================================================
-- STEP 4: CREATE SURVEY SYSTEM TABLES
-- ============================================================================

-- Table: survey_questions (for post-contact survey)
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  answer_type TEXT NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist', 'rating')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE survey_questions IS 'Survey questions with multilingual support';

CREATE INDEX idx_survey_questions_display_order ON survey_questions(display_order);
CREATE INDEX idx_survey_questions_active ON survey_questions(active);

-- Table: survey_question_options
CREATE TABLE survey_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

COMMENT ON TABLE survey_question_options IS 'Options for choice-based survey questions';

CREATE INDEX idx_survey_question_options_question_id ON survey_question_options(question_id);

-- Table: contact_submissions (must exist before survey_sessions)
CREATE TABLE contact_submissions (
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
  requirements TEXT[],
  newsletter_opt_in BOOLEAN NOT NULL DEFAULT false,
  privacy_accepted BOOLEAN NOT NULL DEFAULT true,
  locale TEXT NOT NULL DEFAULT 'en',
  ip_address_hash TEXT,
  user_agent TEXT,
  survey_sent BOOLEAN NOT NULL DEFAULT false,
  survey_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE contact_submissions IS 'Contact form submissions';

CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);
CREATE INDEX idx_contact_submissions_session_id ON contact_submissions(session_id);

-- Table: survey_sessions
CREATE TABLE survey_sessions (
  session_id UUID PRIMARY KEY,
  contact_submission_id UUID REFERENCES contact_submissions(id) ON DELETE CASCADE,
  locale TEXT NOT NULL DEFAULT 'en',
  ip_address_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE survey_sessions IS 'Tracks survey completion sessions linked to contact submissions';

CREATE INDEX idx_survey_sessions_contact_submission_id ON survey_sessions(contact_submission_id);
CREATE INDEX idx_survey_sessions_created_at ON survey_sessions(created_at);
CREATE INDEX idx_survey_sessions_completed_at ON survey_sessions(completed_at);

-- Table: survey_responses
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL, -- Can be string, array, or number
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE survey_responses IS 'Individual question responses for survey sessions';

CREATE INDEX idx_survey_responses_session_id ON survey_responses(session_id);
CREATE INDEX idx_survey_responses_question_id ON survey_responses(question_id);
CREATE INDEX idx_survey_responses_submitted_at ON survey_responses(submitted_at);

-- ============================================================================
-- STEP 5: CREATE SUPPORTING TABLES
-- ============================================================================

-- Table: newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE newsletter_subscribers IS 'Newsletter subscription management';

CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_active ON newsletter_subscribers(active);

-- Table: cookie_consents
CREATE TABLE cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_address_hash TEXT NOT NULL,
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

COMMENT ON TABLE cookie_consents IS 'Cookie consent tracking for GDPR compliance';

CREATE INDEX idx_cookie_consents_session_id ON cookie_consents(session_id);
CREATE INDEX idx_cookie_consents_created_at ON cookie_consents(created_at);

-- Table: projects (for project gallery)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  short_description JSONB, -- {en: "...", cs: "...", de: "..."}
  image_url TEXT NOT NULL,
  github_link TEXT,
  live_demo_link TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  display_order INTEGER NOT NULL UNIQUE,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE projects IS 'Project gallery with multilingual support';

CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_visible ON projects(visible);
CREATE INDEX idx_projects_featured ON projects(featured);

-- ============================================================================
-- STEP 6: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_survey_questions_updated_at
BEFORE UPDATE ON survey_questions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cookie_consents_updated_at
BEFORE UPDATE ON cookie_consents
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 7: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_responses ENABLE ROW LEVEL SECURITY;

ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 8: CREATE RLS POLICIES
-- ============================================================================

-- Form system policies
CREATE POLICY "Public can read active questions"
ON questions FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "Public can read question options"
ON question_options FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can create form sessions"
ON form_sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update own form sessions"
ON form_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Public can create form responses"
ON form_responses FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Survey system policies
CREATE POLICY "Public can read active survey questions"
ON survey_questions FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "Public can read survey question options"
ON survey_question_options FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read survey sessions"
ON survey_sessions FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can update survey sessions"
ON survey_sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Public can create survey responses"
ON survey_responses FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Contact submissions policies
CREATE POLICY "Public can create contact submissions"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update contact submissions"
ON contact_submissions FOR UPDATE
TO anon, authenticated
USING (true);

-- Newsletter policies
CREATE POLICY "Public can subscribe to newsletter"
ON newsletter_subscribers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Cookie consent policies
CREATE POLICY "Public can create cookie consents"
ON cookie_consents FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update cookie consents"
ON cookie_consents FOR UPDATE
TO anon, authenticated
USING (true);

-- Project gallery policies
CREATE POLICY "Public can read visible projects"
ON projects FOR SELECT
TO anon, authenticated
USING (visible = true);

-- ============================================================================
-- STEP 9: SEED FORM QUESTIONS
-- ============================================================================

-- Form Question 1: Rating
INSERT INTO questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "How would you rate your overall experience?", "cs": "Jak byste ohodnotili svou celkovou zkušenost?", "de": "Wie würden Sie Ihre Gesamterfahrung bewerten?"}'::jsonb,
  '{"en": "Rate from 1 (poor) to 5 (excellent)", "cs": "Ohodnoťte od 1 (špatné) do 5 (výborné)", "de": "Bewerten Sie von 1 (schlecht) bis 5 (ausgezeichnet)"}'::jsonb,
  'rating',
  true,
  1,
  true
);

-- Form Question 2: Checklist
INSERT INTO questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "What did you like most about our service?", "cs": "Co se vám na naší službě nejvíce líbilo?", "de": "Was hat Ihnen an unserem Service am besten gefallen?"}'::jsonb,
  '{"en": "Select all that apply", "cs": "Vyberte vše, co platí", "de": "Wählen Sie alle zutreffenden aus"}'::jsonb,
  'checklist',
  true,
  2,
  true
);

-- Get question ID for checklist options
DO $$
DECLARE
  q2_id UUID;
BEGIN
  SELECT id INTO q2_id FROM questions WHERE display_order = 2;

  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q2_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (q2_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (q2_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (q2_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (q2_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);
END $$;

-- Form Question 3: Single choice
INSERT INTO questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "Would you recommend us to others?", "cs": "Doporučili byste nás ostatním?", "de": "Würden Sie uns anderen empfehlen?"}'::jsonb,
  NULL,
  'single_choice',
  true,
  3,
  true
);

-- Get question ID for single choice options
DO $$
DECLARE
  q3_id UUID;
BEGIN
  SELECT id INTO q3_id FROM questions WHERE display_order = 3;

  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q3_id, '{"en": "Definitely", "cs": "Rozhodně", "de": "Auf jeden Fall"}'::jsonb, 1),
    (q3_id, '{"en": "Probably", "cs": "Pravděpodobně", "de": "Wahrscheinlich"}'::jsonb, 2),
    (q3_id, '{"en": "Not sure", "cs": "Nejsem si jistý", "de": "Nicht sicher"}'::jsonb, 3),
    (q3_id, '{"en": "Probably not", "cs": "Pravděpodobně ne", "de": "Wahrscheinlich nicht"}'::jsonb, 4),
    (q3_id, '{"en": "Definitely not", "cs": "Rozhodně ne", "de": "Auf keinen Fall"}'::jsonb, 5);
END $$;

-- Form Question 4: Long text
INSERT INTO questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "Any additional feedback?", "cs": "Nějaká další zpětná vazba?", "de": "Zusätzliches Feedback?"}'::jsonb,
  '{"en": "Share your thoughts with us", "cs": "Podělte se s námi o své myšlenky", "de": "Teilen Sie uns Ihre Gedanken mit"}'::jsonb,
  'long_text',
  false,
  4,
  true
);

-- ============================================================================
-- STEP 10: SEED SURVEY QUESTIONS
-- ============================================================================

-- Survey Question 1: Rating
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "How satisfied are you with our initial response?", "cs": "Jak jste spokojeni s naší počáteční odpovědí?", "de": "Wie zufrieden sind Sie mit unserer ersten Antwort?"}'::jsonb,
  '{"en": "Rate from 1 (very dissatisfied) to 5 (very satisfied)", "cs": "Ohodnoťte od 1 (velmi nespokojený) do 5 (velmi spokojený)", "de": "Bewerten Sie von 1 (sehr unzufrieden) bis 5 (sehr zufrieden)"}'::jsonb,
  'rating',
  true,
  1,
  true
);

-- Survey Question 2: Rating
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "How would you rate the clarity of our communication?", "cs": "Jak byste ohodnotili jasnost naší komunikace?", "de": "Wie würden Sie die Klarheit unserer Kommunikation bewerten?"}'::jsonb,
  '{"en": "Rate from 1 (very unclear) to 5 (very clear)", "cs": "Ohodnoťte od 1 (velmi nejasné) do 5 (velmi jasné)", "de": "Bewerten Sie von 1 (sehr unklar) bis 5 (sehr klar)"}'::jsonb,
  'rating',
  true,
  2,
  true
);

-- Survey Question 3: Checklist
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "What aspects of our service are most important to you?", "cs": "Jaké aspekty naší služby jsou pro vás nejdůležitější?", "de": "Welche Aspekte unseres Services sind Ihnen am wichtigsten?"}'::jsonb,
  '{"en": "Select all that apply", "cs": "Vyberte vše, co platí", "de": "Wählen Sie alle zutreffenden aus"}'::jsonb,
  'checklist',
  true,
  3,
  true
);

-- Get question ID for survey checklist options
DO $$
DECLARE
  sq3_id UUID;
BEGIN
  SELECT id INTO sq3_id FROM survey_questions WHERE display_order = 3;

  INSERT INTO survey_question_options (question_id, option_text, display_order) VALUES
    (sq3_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (sq3_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (sq3_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (sq3_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (sq3_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);
END $$;

-- Survey Question 4: Single choice
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "How did you hear about FredonBytes?", "cs": "Jak jste se o FredonBytes dozvěděli?", "de": "Wie haben Sie von FredonBytes erfahren?"}'::jsonb,
  NULL,
  'single_choice',
  false,
  4,
  true
);

-- Get question ID for survey single choice options
DO $$
DECLARE
  sq4_id UUID;
BEGIN
  SELECT id INTO sq4_id FROM survey_questions WHERE display_order = 4;

  INSERT INTO survey_question_options (question_id, option_text, display_order) VALUES
    (sq4_id, '{"en": "Google search", "cs": "Vyhledávání Google", "de": "Google-Suche"}'::jsonb, 1),
    (sq4_id, '{"en": "Social media", "cs": "Sociální média", "de": "Soziale Medien"}'::jsonb, 2),
    (sq4_id, '{"en": "Referral", "cs": "Doporučení", "de": "Empfehlung"}'::jsonb, 3),
    (sq4_id, '{"en": "Online advertisement", "cs": "Online reklama", "de": "Online-Werbung"}'::jsonb, 4),
    (sq4_id, '{"en": "Other", "cs": "Jiné", "de": "Andere"}'::jsonb, 5);
END $$;

-- Survey Question 5: Long text
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active)
VALUES (
  '{"en": "Do you have any additional comments or suggestions?", "cs": "Máte nějaké další komentáře nebo návrhy?", "de": "Haben Sie zusätzliche Kommentare oder Vorschläge?"}'::jsonb,
  '{"en": "We value your feedback", "cs": "Vážíme si vaší zpětné vazby", "de": "Wir schätzen Ihr Feedback"}'::jsonb,
  'long_text',
  false,
  5,
  true
);

-- ============================================================================
-- STEP 11: SEED TEST DATA (Optional - for development)
-- ============================================================================

-- Test form session
INSERT INTO form_sessions (session_id, locale, created_at)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'en', NOW()),
  ('22222222-2222-2222-2222-222222222222', 'cs', NOW()),
  ('33333333-3333-3333-3333-333333333333', 'de', NOW());

-- Test contact submission
INSERT INTO contact_submissions (
  session_id, first_name, last_name, email, phone, company,
  project_type, budget, timeline, message, locale, survey_sent
)
VALUES (
  '44444444-4444-4444-4444-444444444444',
  'John', 'Doe', 'john.doe@example.com', '+420123456789', 'Test Company',
  'web_development', '10000-25000', '1-3_months', 'Test message', 'en', true
);

-- Test survey sessions (linked to contact submission)
INSERT INTO survey_sessions (session_id, contact_submission_id, locale, created_at)
VALUES
  ('55555555-5555-5555-5555-555555555555',
   (SELECT id FROM contact_submissions WHERE session_id = '44444444-4444-4444-4444-444444444444'),
   'en', NOW()),
  ('66666666-6666-6666-6666-666666666666',
   (SELECT id FROM contact_submissions WHERE session_id = '44444444-4444-4444-4444-444444444444'),
   'cs', NOW()),
  ('77777777-7777-7777-7777-777777777777',
   (SELECT id FROM contact_submissions WHERE session_id = '44444444-4444-4444-4444-444444444444'),
   'de', NOW());

-- ============================================================================
-- STEP 12: VERIFICATION
-- ============================================================================

-- Display table counts
SELECT
  'questions' as table_name, COUNT(*) as row_count FROM questions
UNION ALL
SELECT 'question_options', COUNT(*) FROM question_options
UNION ALL
SELECT 'form_sessions', COUNT(*) FROM form_sessions
UNION ALL
SELECT 'form_responses', COUNT(*) FROM form_responses
UNION ALL
SELECT 'survey_questions', COUNT(*) FROM survey_questions
UNION ALL
SELECT 'survey_question_options', COUNT(*) FROM survey_question_options
UNION ALL
SELECT 'survey_sessions', COUNT(*) FROM survey_sessions
UNION ALL
SELECT 'survey_responses', COUNT(*) FROM survey_responses
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'cookie_consents', COUNT(*) FROM cookie_consents
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
ORDER BY table_name;

-- ============================================================================
-- COMPLETE! Database is ready for use.
-- ============================================================================
-- Test URLs:
-- Form: http://localhost:3000/en/form
-- Survey: http://localhost:3000/en/survey/55555555-5555-5555-5555-555555555555
-- ============================================================================
