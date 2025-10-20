-- ============================================================================
-- UNIFIED DATABASE SCHEMA MIGRATION FOR FREDONBYTES PROJECT
-- ============================================================================
-- Based on: unified-database-schema-design.md
-- This migration implements a unified schema for forms and surveys with:
-- - Unified questionnaires table (replaces separate form/survey tables)
-- - Shared questions and question_options tables
-- - Unified sessions table with shareable link support
-- - Separate form_answers and survey_answers for data isolation
-- - CSRF token support for security
-- - Session cache for offline continuity
-- - Complete multilingual support (en, cs, de)
-- - Row Level Security policies
-- - Performance indexes
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

DROP TABLE IF EXISTS csrf_tokens CASCADE;
DROP TABLE IF EXISTS session_cache CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS cookie_consents CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- Drop unified tables if they exist
DROP TABLE IF EXISTS form_answers CASCADE;
DROP TABLE IF EXISTS survey_answers CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS questionnaires CASCADE;

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

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates the updated_at column on row update';

-- ============================================================================
-- STEP 3: CREATE CORE UNIFIED TABLES
-- ============================================================================

-- Table: questionnaires (unified for both forms and surveys)
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('form', 'survey')),
  title JSONB NOT NULL,
  description JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE questionnaires IS 'Unified table for both forms and surveys';
COMMENT ON COLUMN questionnaires.type IS 'Type: form or survey';
COMMENT ON COLUMN questionnaires.title IS 'Multilingual title in JSONB format {en, cs, de}';
COMMENT ON COLUMN questionnaires.description IS 'Multilingual description in JSONB format {en, cs, de}';

CREATE INDEX idx_questionnaires_type ON questionnaires(type);
CREATE INDEX idx_questionnaires_active ON questionnaires(active);

-- Table: questions (unified for both forms and surveys)
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_text JSONB NOT NULL,
  description JSONB,
  answer_type VARCHAR(20) NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist', 'rating')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(questionnaire_id, display_order)
);

COMMENT ON TABLE questions IS 'Questions for both forms and surveys';
COMMENT ON COLUMN questions.question_text IS 'Multilingual question text in JSONB format {en, cs, de}';
COMMENT ON COLUMN questions.answer_type IS 'Type: short_text, long_text, single_choice, multiple_choice, checklist, rating';

CREATE INDEX idx_questions_questionnaire_id ON questions(questionnaire_id);
CREATE INDEX idx_questions_display_order ON questions(display_order);
CREATE INDEX idx_questions_active ON questions(active);

-- Table: question_options (for choice-based questions)
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

COMMENT ON TABLE question_options IS 'Options for choice-based questions';
COMMENT ON COLUMN question_options.option_text IS 'Multilingual option text in JSONB format {en, cs, de}';

CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_question_options_display_order ON question_options(display_order);

-- Table: sessions (unified session management)
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  original_session_id UUID REFERENCES sessions(session_id),
  locale VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'cs', 'de')),
  ip_address_hash TEXT,
  user_agent TEXT,
  email TEXT,
  newsletter_optin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

COMMENT ON TABLE sessions IS 'Session management for forms and surveys';
COMMENT ON COLUMN sessions.original_session_id IS 'Reference to original session for shareable link analytics';
COMMENT ON COLUMN sessions.expires_at IS 'Session expiration time (24 hours default)';

CREATE INDEX idx_sessions_questionnaire_id ON sessions(questionnaire_id);
CREATE INDEX idx_sessions_original_session_id ON sessions(original_session_id);
CREATE INDEX idx_sessions_locale ON sessions(locale);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Table: form_answers (separate storage for form responses)
CREATE TABLE form_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE form_answers IS 'Answers for forms only';
COMMENT ON COLUMN form_answers.answer_value IS 'Answer value in JSONB format (string, array, or number)';

CREATE INDEX idx_form_answers_session_id ON form_answers(session_id);
CREATE INDEX idx_form_answers_question_id ON form_answers(question_id);
CREATE INDEX idx_form_answers_submitted_at ON form_answers(submitted_at);

-- Table: survey_answers (separate storage for survey responses)
CREATE TABLE survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE survey_answers IS 'Answers for surveys only';
COMMENT ON COLUMN survey_answers.answer_value IS 'Answer value in JSONB format (string, array, or number)';

CREATE INDEX idx_survey_answers_session_id ON survey_answers(session_id);
CREATE INDEX idx_survey_answers_question_id ON survey_answers(question_id);
CREATE INDEX idx_survey_answers_submitted_at ON survey_answers(submitted_at);

-- ============================================================================
-- STEP 4: CREATE SECURITY TABLES
-- ============================================================================

-- Table: csrf_tokens (CSRF token validation)
CREATE TABLE csrf_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash TEXT NOT NULL UNIQUE,
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_agent TEXT,
  ip_address_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '1 hour'),
  used BOOLEAN NOT NULL DEFAULT false
);

COMMENT ON TABLE csrf_tokens IS 'CSRF tokens for security validation';
COMMENT ON COLUMN csrf_tokens.token_hash IS 'Hashed CSRF token for security';
COMMENT ON COLUMN csrf_tokens.expires_at IS 'Token expiration time (1 hour default)';

CREATE INDEX idx_csrf_tokens_token_hash ON csrf_tokens(token_hash);
CREATE INDEX idx_csrf_tokens_session_id ON csrf_tokens(session_id);
CREATE INDEX idx_csrf_tokens_expires_at ON csrf_tokens(expires_at);
CREATE INDEX idx_csrf_tokens_used ON csrf_tokens(used);

-- ============================================================================
-- STEP 5: CREATE CACHING TABLES
-- ============================================================================

-- Table: session_cache (for offline continuity)
CREATE TABLE session_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  cache_key TEXT NOT NULL,
  cache_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  UNIQUE(session_id, cache_key)
);

COMMENT ON TABLE session_cache IS 'Cached session data for offline continuity';
COMMENT ON COLUMN session_cache.cache_key IS 'Cache key for data identification';
COMMENT ON COLUMN session_cache.cache_data IS 'Cached data in JSONB format';
COMMENT ON COLUMN session_cache.expires_at IS 'Cache expiration time (24 hours default)';

CREATE INDEX idx_session_cache_session_id ON session_cache(session_id);
CREATE INDEX idx_session_cache_cache_key ON session_cache(cache_key);
CREATE INDEX idx_session_cache_expires_at ON session_cache(expires_at);

-- ============================================================================
-- STEP 6: CREATE SUPPORTING TABLES
-- ============================================================================

-- Table: contact_submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL UNIQUE REFERENCES sessions(session_id) ON DELETE CASCADE,
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
  survey_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE contact_submissions IS 'Contact form submissions linked to sessions';

CREATE INDEX idx_contact_submissions_session_id ON contact_submissions(session_id);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

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

-- Table: projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  short_description JSONB,
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
-- STEP 7: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_questionnaires_updated_at
BEFORE UPDATE ON questionnaires
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON questions
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
-- STEP 8: ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE csrf_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 9: CREATE RLS POLICIES
-- ============================================================================

-- Questionnaires policies
CREATE POLICY "Public can read active questionnaires"
ON questionnaires FOR SELECT
TO anon, authenticated
USING (active = true);

-- Questions policies
CREATE POLICY "Public can read active questions"
ON questions FOR SELECT
TO anon, authenticated
USING (active = true);

-- Question Options policies
CREATE POLICY "Public can read question options"
ON question_options FOR SELECT
TO anon, authenticated
USING (true);

-- Sessions policies
CREATE POLICY "Public can create sessions"
ON sessions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update own sessions"
ON sessions FOR UPDATE
TO anon, authenticated
USING (true);

CREATE POLICY "Public can read sessions"
ON sessions FOR SELECT
TO anon, authenticated
USING (true);

-- Form Answers policies
CREATE POLICY "Public can create form answers"
ON form_answers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can read own form answers"
ON form_answers FOR SELECT
TO anon, authenticated
USING (true);

-- Survey Answers policies
CREATE POLICY "Public can create survey answers"
ON survey_answers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can read own survey answers"
ON survey_answers FOR SELECT
TO anon, authenticated
USING (true);

-- CSRF Tokens policies
CREATE POLICY "Public can create csrf tokens"
ON csrf_tokens FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can validate csrf tokens"
ON csrf_tokens FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can update csrf tokens"
ON csrf_tokens FOR UPDATE
TO anon, authenticated
USING (true);

-- Session Cache policies
CREATE POLICY "Public can create session cache"
ON session_cache FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can read own session cache"
ON session_cache FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Public can update session cache"
ON session_cache FOR UPDATE
TO anon, authenticated
USING (true);

-- Contact Submissions policies
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

-- Cookie Consent policies
CREATE POLICY "Public can create cookie consents"
ON cookie_consents FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can update cookie consents"
ON cookie_consents FOR UPDATE
TO anon, authenticated
USING (true);

-- Project Gallery policies
CREATE POLICY "Public can read visible projects"
ON projects FOR SELECT
TO anon, authenticated
USING (visible = true);

-- ============================================================================
-- STEP 10: SEED DATA - QUESTIONNAIRES
-- ============================================================================

-- Insert form questionnaire
INSERT INTO questionnaires (type, title, description)
VALUES (
  'form',
  '{"en": "Customer Satisfaction Form", "cs": "Formulář spokojenosti zákazníků", "de": "Kundenzufriedenheitsformular"}'::jsonb,
  '{"en": "Help us improve our services by sharing your feedback", "cs": "Pomozte nám zlepšit naše služby sdílením vaší zpětné vazby", "de": "Helfen Sie uns, unsere Dienstleistungen zu verbessern, indem Sie Ihr Feedback teilen"}'::jsonb
);

-- Insert survey questionnaire
INSERT INTO questionnaires (type, title, description)
VALUES (
  'survey',
  '{"en": "Post-Contact Survey", "cs": "Průzkum po kontaktu", "de": "Nach-Kontakt-Umfrage"}'::jsonb,
  '{"en": "Share your experience with our initial response", "cs": "Sdílejte své zkušenosti s naší počáteční odpovědí", "de": "Teilen Sie Ihre Erfahrung mit unserer ersten Antwort"}'::jsonb
);

-- ============================================================================
-- STEP 11: SEED DATA - FORM QUESTIONS
-- ============================================================================

DO $$
DECLARE
  form_questionnaire_id UUID;
  q2_id UUID;
  q3_id UUID;
BEGIN
  SELECT id INTO form_questionnaire_id FROM questionnaires WHERE type = 'form' LIMIT 1;

  -- Question 1: Rating
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    form_questionnaire_id,
    '{"en": "How would you rate your overall experience?", "cs": "Jak byste ohodnotili svou celkovou zkušenost?", "de": "Wie würden Sie Ihre Gesamterfahrung bewerten?"}'::jsonb,
    '{"en": "Rate from 1 (poor) to 5 (excellent)", "cs": "Ohodnoťte od 1 (špatné) do 5 (výborné)", "de": "Bewerten Sie von 1 (schlecht) bis 5 (ausgezeichnet)"}'::jsonb,
    'rating',
    true,
    1
  );

  -- Question 2: Checklist
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    form_questionnaire_id,
    '{"en": "What did you like most about our service?", "cs": "Co se vám na naší službě nejvíce líbilo?", "de": "Was hat Ihnen an unserem Service am besten gefallen?"}'::jsonb,
    '{"en": "Select all that apply", "cs": "Vyberte vše, co platí", "de": "Wählen Sie alle zutreffenden aus"}'::jsonb,
    'checklist',
    true,
    2
  ) RETURNING id INTO q2_id;

  -- Add options for checklist question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q2_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (q2_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (q2_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (q2_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (q2_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);

  -- Question 3: Single choice
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    form_questionnaire_id,
    '{"en": "Would you recommend us to others?", "cs": "Doporučili byste nás ostatním?", "de": "Würden Sie uns anderen empfehlen?"}'::jsonb,
    NULL,
    'single_choice',
    true,
    3
  ) RETURNING id INTO q3_id;

  -- Add options for single choice question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (q3_id, '{"en": "Definitely", "cs": "Rozhodně", "de": "Auf jeden Fall"}'::jsonb, 1),
    (q3_id, '{"en": "Probably", "cs": "Pravděpodobně", "de": "Wahrscheinlich"}'::jsonb, 2),
    (q3_id, '{"en": "Not sure", "cs": "Nejsem si jistý", "de": "Nicht sicher"}'::jsonb, 3),
    (q3_id, '{"en": "Probably not", "cs": "Pravděpodobně ne", "de": "Wahrscheinlich nicht"}'::jsonb, 4),
    (q3_id, '{"en": "Definitely not", "cs": "Rozhodně ne", "de": "Auf keinen Fall"}'::jsonb, 5);

  -- Question 4: Long text
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    form_questionnaire_id,
    '{"en": "Any additional feedback?", "cs": "Nějaká další zpětná vazba?", "de": "Zusätzliches Feedback?"}'::jsonb,
    '{"en": "Share your thoughts with us", "cs": "Podělte se s námi o své myšlenky", "de": "Teilen Sie uns Ihre Gedanken mit"}'::jsonb,
    'long_text',
    false,
    4
  );
END $$;

-- ============================================================================
-- STEP 12: SEED DATA - SURVEY QUESTIONS
-- ============================================================================

DO $$
DECLARE
  survey_questionnaire_id UUID;
  sq3_id UUID;
  sq4_id UUID;
BEGIN
  SELECT id INTO survey_questionnaire_id FROM questionnaires WHERE type = 'survey' LIMIT 1;

  -- Question 1: Rating
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "How satisfied are you with our initial response?", "cs": "Jak jste spokojeni s naší počáteční odpovědí?", "de": "Wie zufrieden sind Sie mit unserer ersten Antwort?"}'::jsonb,
    '{"en": "Rate from 1 (very dissatisfied) to 5 (very satisfied)", "cs": "Ohodnoťte od 1 (velmi nespokojený) do 5 (velmi spokojený)", "de": "Bewerten Sie von 1 (sehr unzufrieden) bis 5 (sehr zufrieden)"}'::jsonb,
    'rating',
    true,
    1
  );

  -- Question 2: Rating
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "How would you rate the clarity of our communication?", "cs": "Jak byste ohodnotili jasnost naší komunikace?", "de": "Wie würden Sie die Klarheit unserer Kommunikation bewerten?"}'::jsonb,
    '{"en": "Rate from 1 (very unclear) to 5 (very clear)", "cs": "Ohodnoťte od 1 (velmi nejasné) do 5 (velmi jasné)", "de": "Bewerten Sie von 1 (sehr unklar) bis 5 (sehr klar)"}'::jsonb,
    'rating',
    true,
    2
  );

  -- Question 3: Checklist
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "What aspects of our service are most important to you?", "cs": "Jaké aspekty naší služby jsou pro vás nejdůležitější?", "de": "Welche Aspekte unseres Services sind Ihnen am wichtigsten?"}'::jsonb,
    '{"en": "Select all that apply", "cs": "Vyberte vše, co platí", "de": "Wählen Sie alle zutreffenden aus"}'::jsonb,
    'checklist',
    true,
    3
  ) RETURNING id INTO sq3_id;

  -- Add options for checklist question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (sq3_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (sq3_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (sq3_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (sq3_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (sq3_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);

  -- Question 4: Single choice
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "How did you hear about FredonBytes?", "cs": "Jak jste se o FredonBytes dozvěděli?", "de": "Wie haben Sie von FredonBytes erfahren?"}'::jsonb,
    NULL,
    'single_choice',
    false,
    4
  ) RETURNING id INTO sq4_id;

  -- Add options for single choice question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (sq4_id, '{"en": "Google search", "cs": "Vyhledávání Google", "de": "Google-Suche"}'::jsonb, 1),
    (sq4_id, '{"en": "Social media", "cs": "Sociální média", "de": "Soziale Medien"}'::jsonb, 2),
    (sq4_id, '{"en": "Referral", "cs": "Doporučení", "de": "Empfehlung"}'::jsonb, 3),
    (sq4_id, '{"en": "Online advertisement", "cs": "Online reklama", "de": "Online-Werbung"}'::jsonb, 4),
    (sq4_id, '{"en": "Other", "cs": "Jiné", "de": "Andere"}'::jsonb, 5);

  -- Question 5: Long text
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "Do you have any additional comments or suggestions?", "cs": "Máte nějaké další komentáře nebo návrhy?", "de": "Haben Sie zusätzliche Kommentare oder Vorschläge?"}'::jsonb,
    '{"en": "We value your feedback", "cs": "Vážíme si vaší zpětné vazby", "de": "Wir schätzen Ihr Feedback"}'::jsonb,
    'long_text',
    false,
    5
  );
END $$;

-- ============================================================================
-- STEP 13: VERIFICATION
-- ============================================================================

-- Display table counts after migration
SELECT
  'questionnaires' as table_name, COUNT(*) as row_count FROM questionnaires
UNION ALL
SELECT 'questions', COUNT(*) FROM questions
UNION ALL
SELECT 'question_options', COUNT(*) FROM question_options
UNION ALL
SELECT 'sessions', COUNT(*) FROM sessions
UNION ALL
SELECT 'form_answers', COUNT(*) FROM form_answers
UNION ALL
SELECT 'survey_answers', COUNT(*) FROM survey_answers
UNION ALL
SELECT 'csrf_tokens', COUNT(*) FROM csrf_tokens
UNION ALL
SELECT 'session_cache', COUNT(*) FROM session_cache
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
-- MIGRATION COMPLETE!
-- ============================================================================
-- The unified database schema is now ready for use.
-- 
-- Key features:
-- - Unified questionnaires table (2 entries: form and survey)
-- - 9 questions total (4 form + 5 survey)
-- - Shareable link support via original_session_id
-- - CSRF token validation
-- - Session caching for offline continuity
-- - Complete multilingual support (en, cs, de)
-- - Row Level Security enabled
-- - Performance indexes in place
-- ============================================================================