-- ============================================================================
-- FRESH UNIFIED DATABASE SCHEMA FOR FREDONBYTES FORMS & SURVEYS
-- ============================================================================
-- Created: 2025-10-20
-- Purpose: Complete unified schema for forms and surveys with multilingual
--          support (cs, en, de), CSRF protection, and session management
-- ============================================================================

-- ============================================================================
-- STEP 1: CLEAN SLATE - DROP ALL EXISTING TABLES
-- ============================================================================

DROP TABLE IF EXISTS form_answers CASCADE;
DROP TABLE IF EXISTS survey_answers CASCADE;
DROP TABLE IF EXISTS form_responses CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS form_sessions CASCADE;
DROP TABLE IF EXISTS survey_sessions CASCADE;
DROP TABLE IF EXISTS questionnaires CASCADE;
DROP TABLE IF EXISTS csrf_tokens CASCADE;
DROP TABLE IF EXISTS session_cache CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS cookie_consents CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS survey_question_options CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS clean_expired_sessions() CASCADE;

-- ============================================================================
-- STEP 2: UTILITY FUNCTIONS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Automatically updates updated_at timestamp';

-- ============================================================================
-- STEP 3: CORE TABLES
-- ============================================================================

-- Questionnaires: Unified for forms and surveys
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('form', 'survey')),
  title JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questionnaires_type ON questionnaires(type);
CREATE INDEX idx_questionnaires_active ON questionnaires(active);

CREATE TRIGGER update_questionnaires_updated_at 
  BEFORE UPDATE ON questionnaires
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Questions: Linked to questionnaires
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  answer_type VARCHAR(20) NOT NULL CHECK (answer_type IN (
    'short_text', 'long_text', 'single_choice', 'multiple_choice', 'rating'
  )),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(questionnaire_id, display_order)
);

CREATE INDEX idx_questions_questionnaire ON questions(questionnaire_id);
CREATE INDEX idx_questions_active ON questions(active);
CREATE INDEX idx_questions_display_order ON questions(questionnaire_id, display_order);

CREATE TRIGGER update_questions_updated_at 
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Question Options: For choice-based questions
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

CREATE INDEX idx_question_options_question ON question_options(question_id);

-- Sessions: Track user sessions
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'cs' CHECK (locale IN ('en', 'cs', 'de')),
  csrf_token VARCHAR(255),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '48 hours'),
  ip_address_hash VARCHAR(255),
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_questionnaire ON sessions(questionnaire_id);
CREATE INDEX idx_sessions_completed ON sessions(completed_at);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

CREATE TRIGGER update_sessions_updated_at 
  BEFORE UPDATE ON sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Form Answers: Store form responses
CREATE TABLE form_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL, -- Flexible: string, array, number
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX idx_form_answers_session ON form_answers(session_id);
CREATE INDEX idx_form_answers_question ON form_answers(question_id);

-- Survey Answers: Store survey responses
CREATE TABLE survey_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL, -- Flexible: string, array, number
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

CREATE INDEX idx_survey_answers_session ON survey_answers(session_id);
CREATE INDEX idx_survey_answers_question ON survey_answers(question_id);

-- Contact Submissions: For contact form integration
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID UNIQUE REFERENCES sessions(session_id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  company VARCHAR(255),
  message TEXT NOT NULL,
  survey_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_contact_email ON contact_submissions(email);
CREATE INDEX idx_contact_session ON contact_submissions(session_id);

CREATE TRIGGER update_contact_submissions_updated_at 
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed BOOLEAN DEFAULT true,
  locale VARCHAR(5) DEFAULT 'cs',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribed ON newsletter_subscribers(subscribed);

CREATE TRIGGER update_newsletter_subscribers_updated_at 
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Cookie Consents
CREATE TABLE cookie_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consent_id VARCHAR(255) NOT NULL UNIQUE,
  preferences JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cookie_consent_id ON cookie_consents(consent_id);

CREATE TRIGGER update_cookie_consents_updated_at 
  BEFORE UPDATE ON cookie_consents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 4: SEED DATA - FORM QUESTIONNAIRE
-- ============================================================================

-- Insert Form Questionnaire
INSERT INTO questionnaires (id, type, title, description, active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'form',
  '{"en": "Customer Satisfaction Form", "cs": "Formulář spokojenosti zákazníků", "de": "Kundenzufriedenheitsformular"}',
  '{"en": "Help us improve our services by sharing your feedback", "cs": "Pomozte nám zlepšit naše služby sdílením vaší zpětné vazby", "de": "Helfen Sie uns, unsere Dienstleistungen zu verbessern, indem Sie Ihr Feedback teilen"}',
  true
);

-- Form Questions
INSERT INTO questions (id, questionnaire_id, question_text, description, answer_type, required, display_order, active) VALUES
-- Q1: Name
(
  '11111111-2222-3333-4444-000000000001',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "What is your name?", "cs": "Jaké je vaše jméno?", "de": "Wie ist Ihr Name?"}',
  '{"en": "Please enter your full name", "cs": "Zadejte prosím své celé jméno", "de": "Bitte geben Sie Ihren vollständigen Namen ein"}',
  'short_text',
  true,
  1,
  true
),
-- Q2: Email
(
  '11111111-2222-3333-4444-000000000002',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "What is your email address?", "cs": "Jaká je vaše emailová adresa?", "de": "Wie lautet Ihre E-Mail-Adresse?"}',
  '{"en": "We will use this to contact you if needed", "cs": "Použijeme to pro kontakt v případě potřeby", "de": "Wir verwenden diese, um Sie bei Bedarf zu kontaktieren"}',
  'short_text',
  true,
  2,
  true
),
-- Q3: Service Quality
(
  '11111111-2222-3333-4444-000000000003',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "How would you rate our service quality?", "cs": "Jak byste ohodnotili kvalitu našich služeb?", "de": "Wie würden Sie die Qualität unserer Dienstleistungen bewerten?"}',
  NULL,
  'single_choice',
  true,
  3,
  true
),
-- Q4: Communication
(
  '11111111-2222-3333-4444-000000000004',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "How satisfied are you with our communication?", "cs": "Jak jste spokojeni s naší komunikací?", "de": "Wie zufrieden sind Sie mit unserer Kommunikation?"}',
  NULL,
  'rating',
  true,
  4,
  true
),
-- Q5: Services Used
(
  '11111111-2222-3333-4444-000000000005',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "Which of our services have you used?", "cs": "Které z našich služeb jste využili?", "de": "Welche unserer Dienstleistungen haben Sie genutzt?"}',
  '{"en": "Select all that apply", "cs": "Vyberte vše, co se vztahuje", "de": "Wählen Sie alle zutreffenden aus"}',
  'multiple_choice',
  false,
  5,
  true
),
-- Q6: Feedback
(
  '11111111-2222-3333-4444-000000000006',
  '11111111-1111-1111-1111-111111111111',
  '{"en": "What can we improve?", "cs": "Co můžeme zlepšit?", "de": "Was können wir verbessern?"}',
  '{"en": "Your detailed feedback helps us grow", "cs": "Vaše detailní zpětná vazba nám pomáhá růst", "de": "Ihr detailliertes Feedback hilft uns zu wachsen"}',
  'long_text',
  false,
  6,
  true
);

-- Form Question Options
INSERT INTO question_options (question_id, option_text, display_order) VALUES
-- Q3 Options (Service Quality)
(
  '11111111-2222-3333-4444-000000000003',
  '{"en": "Excellent", "cs": "Vynikající", "de": "Ausgezeichnet"}',
  1
),
(
  '11111111-2222-3333-4444-000000000003',
  '{"en": "Good", "cs": "Dobrý", "de": "Gut"}',
  2
),
(
  '11111111-2222-3333-4444-000000000003',
  '{"en": "Average", "cs": "Průměrný", "de": "Durchschnittlich"}',
  3
),
(
  '11111111-2222-3333-4444-000000000003',
  '{"en": "Poor", "cs": "Špatný", "de": "Schlecht"}',
  4
),
-- Q5 Options (Services Used)
(
  '11111111-2222-3333-4444-000000000005',
  '{"en": "Web Development", "cs": "Vývoj webových stránek", "de": "Webentwicklung"}',
  1
),
(
  '11111111-2222-3333-4444-000000000005',
  '{"en": "Mobile App Development", "cs": "Vývoj mobilních aplikací", "de": "Mobile App-Entwicklung"}',
  2
),
(
  '11111111-2222-3333-4444-000000000005',
  '{"en": "Cloud Solutions", "cs": "Cloudová řešení", "de": "Cloud-Lösungen"}',
  3
),
(
  '11111111-2222-3333-4444-000000000005',
  '{"en": "Consulting", "cs": "Konzultace", "de": "Beratung"}',
  4
),
(
  '11111111-2222-3333-4444-000000000005',
  '{"en": "IT Support", "cs": "IT podpora", "de": "IT-Support"}',
  5
);

-- ============================================================================
-- STEP 5: SEED DATA - SURVEY QUESTIONNAIRE
-- ============================================================================

-- Insert Survey Questionnaire
INSERT INTO questionnaires (id, type, title, description, active) VALUES
(
  '22222222-2222-2222-2222-222222222222',
  'survey',
  '{"en": "Customer Satisfaction Survey", "cs": "Průzkum spokojenosti zákazníků", "de": "Kundenzufriedenheitsumfrage"}',
  '{"en": "Share your experience with FredonBytes", "cs": "Sdílejte svou zkušenost s FredonBytes", "de": "Teilen Sie Ihre Erfahrung mit FredonBytes"}',
  true
);

-- Survey Questions
INSERT INTO questions (id, questionnaire_id, question_text, description, answer_type, required, display_order, active) VALUES
-- Q1: Overall Satisfaction
(
  '22222222-3333-4444-5555-000000000001',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "How satisfied are you with our services overall?", "cs": "Jak jste celkově spokojeni s našimi službami?", "de": "Wie zufrieden sind Sie insgesamt mit unseren Dienstleistungen?"}',
  NULL,
  'rating',
  true,
  1,
  true
),
-- Q2: Recommendation
(
  '22222222-3333-4444-5555-000000000002',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "How likely are you to recommend us to others?", "cs": "Jak pravděpodobné je, že nás doporučíte ostatním?", "de": "Wie wahrscheinlich ist es, dass Sie uns weiterempfehlen?"}',
  '{"en": "On a scale of 1-5", "cs": "Na stupnici 1-5", "de": "Auf einer Skala von 1-5"}',
  'rating',
  true,
  2,
  true
),
-- Q3: Response Time
(
  '22222222-3333-4444-5555-000000000003',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "How would you rate our response time?", "cs": "Jak byste ohodnotili naši dobu odezvy?", "de": "Wie würden Sie unsere Reaktionszeit bewerten?"}',
  NULL,
  'single_choice',
  true,
  3,
  true
),
-- Q4: What did you like most
(
  '22222222-3333-4444-5555-000000000004',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "What did you like most about working with us?", "cs": "Co se vám na spolupráci s námi líbilo nejvíce?", "de": "Was hat Ihnen an der Zusammenarbeit mit uns am besten gefallen?"}',
  '{"en": "Select all that apply", "cs": "Vyberte vše, co se vztahuje", "de": "Wählen Sie alle zutreffenden aus"}',
  'multiple_choice',
  false,
  4,
  true
),
-- Q5: Improvements
(
  '22222222-3333-4444-5555-000000000005',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "What could we improve?", "cs": "Co bychom mohli zlepšit?", "de": "Was könnten wir verbessern?"}',
  '{"en": "Your honest feedback is appreciated", "cs": "Vaše upřímná zpětná vazba je ceněna", "de": "Ihr ehrliches Feedback wird geschätzt"}',
  'long_text',
  false,
  5,
  true
),
-- Q6: Future Services
(
  '22222222-3333-4444-5555-000000000006',
  '22222222-2222-2222-2222-222222222222',
  '{"en": "Are you interested in our future services?", "cs": "Máte zájem o naše budoucí služby?", "de": "Sind Sie an unseren zukünftigen Dienstleistungen interessiert?"}',
  NULL,
  'single_choice',
  false,
  6,
  true
);

-- Survey Question Options
INSERT INTO question_options (question_id, option_text, display_order) VALUES
-- Q3 Options (Response Time)
(
  '22222222-3333-4444-5555-000000000003',
  '{"en": "Very Fast", "cs": "Velmi rychlý", "de": "Sehr schnell"}',
  1
),
(
  '22222222-3333-4444-5555-000000000003',
  '{"en": "Fast", "cs": "Rychlý", "de": "Schnell"}',
  2
),
(
  '22222222-3333-4444-5555-000000000003',
  '{"en": "Average", "cs": "Průměrný", "de": "Durchschnittlich"}',
  3
),
(
  '22222222-3333-4444-5555-000000000003',
  '{"en": "Slow", "cs": "Pomalý", "de": "Langsam"}',
  4
),
-- Q4 Options (What did you like)
(
  '22222222-3333-4444-5555-000000000004',
  '{"en": "Professional approach", "cs": "Profesionální přístup", "de": "Professioneller Ansatz"}',
  1
),
(
  '22222222-3333-4444-5555-000000000004',
  '{"en": "Technical expertise", "cs": "Technická expertíza", "de": "Technisches Fachwissen"}',
  2
),
(
  '22222222-3333-4444-5555-000000000004',
  '{"en": "Clear communication", "cs": "Jasná komunikace", "de": "Klare Kommunikation"}',
  3
),
(
  '22222222-3333-4444-5555-000000000004',
  '{"en": "Timely delivery", "cs": "Včasné dodání", "de": "Pünktliche Lieferung"}',
  4
),
(
  '22222222-3333-4444-5555-000000000004',
  '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}',
  5
),
-- Q6 Options (Future Services)
(
  '22222222-3333-4444-5555-000000000006',
  '{"en": "Yes, definitely", "cs": "Ano, určitě", "de": "Ja, auf jeden Fall"}',
  1
),
(
  '22222222-3333-4444-5555-000000000006',
  '{"en": "Maybe", "cs": "Možná", "de": "Vielleicht"}',
  2
),
(
  '22222222-3333-4444-5555-000000000006',
  '{"en": "No, not interested", "cs": "Ne, nemám zájem", "de": "Nein, nicht interessiert"}',
  3
);

-- ============================================================================
-- STEP 6: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;

-- Public read access to questionnaires, questions, and options
CREATE POLICY "Public read questionnaires" ON questionnaires FOR SELECT USING (active = true);
CREATE POLICY "Public read questions" ON questions FOR SELECT USING (active = true);
CREATE POLICY "Public read options" ON question_options FOR SELECT USING (true);

-- Sessions: users can only access their own sessions
CREATE POLICY "Users can create sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Users can update own sessions" ON sessions FOR UPDATE USING (true);

-- Answers: users can only access their own answers
CREATE POLICY "Users can insert form answers" ON form_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own form answers" ON form_answers FOR SELECT USING (true);
CREATE POLICY "Users can insert survey answers" ON survey_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own survey answers" ON survey_answers FOR SELECT USING (true);

-- Contact: public insert
CREATE POLICY "Public insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read own contact" ON contact_submissions FOR SELECT USING (true);

-- Newsletter: public insert and update
CREATE POLICY "Public manage newsletter" ON newsletter_subscribers FOR ALL USING (true);

-- Cookies: public manage
CREATE POLICY "Public manage cookies" ON cookie_consents FOR ALL USING (true);

-- ============================================================================
-- STEP 7: CLEANUP FUNCTION
-- ============================================================================

CREATE OR REPLACE FUNCTION clean_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION clean_expired_sessions() IS 'Remove expired sessions (run periodically)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON DATABASE postgres IS 'FredonBytes unified forms and surveys database - Fresh migration 2025-10-20';
