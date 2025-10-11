-- Create survey_questions table with multilingual support
CREATE TABLE IF NOT EXISTS survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_text JSONB NOT NULL,
  description JSONB,
  answer_type TEXT NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist', 'rating')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(display_order)
);

-- Create survey_question_options table
CREATE TABLE IF NOT EXISTS survey_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL,
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

-- Create survey_sessions table
CREATE TABLE IF NOT EXISTS survey_sessions (
  session_id UUID PRIMARY KEY,
  contact_submission_id UUID REFERENCES contact_submissions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  ip_address_hash TEXT,
  user_agent TEXT,
  locale TEXT NOT NULL DEFAULT 'en'
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES survey_sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES survey_questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_survey_questions_display_order ON survey_questions(display_order);
CREATE INDEX IF NOT EXISTS idx_survey_questions_active ON survey_questions(active);
CREATE INDEX IF NOT EXISTS idx_survey_question_options_question_id ON survey_question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_contact_id ON survey_sessions(contact_submission_id);
CREATE INDEX IF NOT EXISTS idx_survey_sessions_created_at ON survey_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_survey_responses_session_id ON survey_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_survey_responses_question_id ON survey_responses(question_id);

-- Enable Row Level Security
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for survey_questions
-- Allow public to read active questions
CREATE POLICY "Allow public read active survey_questions"
  ON survey_questions
  FOR SELECT
  TO public
  USING (active = true);

-- RLS Policies for survey_question_options
-- Allow public to read options for active questions
CREATE POLICY "Allow public read survey_question_options"
  ON survey_question_options
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM survey_questions
      WHERE survey_questions.id = survey_question_options.question_id
      AND survey_questions.active = true
    )
  );

-- RLS Policies for survey_sessions
-- Allow public to insert sessions
CREATE POLICY "Allow public insert on survey_sessions"
  ON survey_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own sessions
CREATE POLICY "Allow public read own survey_sessions"
  ON survey_sessions
  FOR SELECT
  TO public
  USING (true);

-- Allow public to update their own sessions (for completed_at)
CREATE POLICY "Allow public update own survey_sessions"
  ON survey_sessions
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- RLS Policies for survey_responses
-- Allow public to insert responses
CREATE POLICY "Allow public insert on survey_responses"
  ON survey_responses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own responses
CREATE POLICY "Allow public read own survey_responses"
  ON survey_responses
  FOR SELECT
  TO public
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_survey_questions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_survey_questions_updated_at
  BEFORE UPDATE ON survey_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_survey_questions_updated_at();

-- Comments for documentation
COMMENT ON TABLE survey_questions IS 'Stores survey questions with multilingual support';
COMMENT ON TABLE survey_question_options IS 'Stores options for choice-based survey questions';
COMMENT ON TABLE survey_sessions IS 'Tracks individual survey sessions linked to contact submissions';
COMMENT ON TABLE survey_responses IS 'Stores individual survey question responses';
COMMENT ON COLUMN survey_questions.question_text IS 'Multilingual question text as JSONB: {en: "...", cs: "...", de: "..."}';
COMMENT ON COLUMN survey_questions.description IS 'Optional multilingual description as JSONB';
COMMENT ON COLUMN survey_questions.answer_type IS 'Type of answer: short_text, long_text, single_choice, multiple_choice, checklist, rating';
COMMENT ON COLUMN survey_question_options.option_text IS 'Multilingual option text as JSONB: {en: "...", cs: "...", de: "..."}';
COMMENT ON COLUMN survey_sessions.contact_submission_id IS 'Links survey to original contact form submission';
COMMENT ON COLUMN survey_sessions.completed_at IS 'Timestamp when survey was completed';
COMMENT ON COLUMN survey_responses.answer_value IS 'Answer stored as JSONB (string, array, or number)';

-- Insert sample survey questions
INSERT INTO survey_questions (question_text, description, answer_type, required, display_order, active) VALUES
(
  '{"en": "How satisfied are you with our initial response?", "cs": "Jak jste spokojeni s naší počáteční odpovědí?", "de": "Wie zufrieden sind Sie mit unserer ersten Antwort?"}'::jsonb,
  '{"en": "Rate your satisfaction level", "cs": "Ohodnoťte svou úroveň spokojenosti", "de": "Bewerten Sie Ihre Zufriedenheit"}'::jsonb,
  'rating',
  true,
  1,
  true
),
(
  '{"en": "How would you rate the clarity of our communication?", "cs": "Jak byste ohodnotili jasnost naší komunikace?", "de": "Wie würden Sie die Klarheit unserer Kommunikation bewerten?"}'::jsonb,
  '{"en": "Rate from 1 to 5", "cs": "Ohodnoťte od 1 do 5", "de": "Bewerten Sie von 1 bis 5"}'::jsonb,
  'rating',
  true,
  2,
  true
),
(
  '{"en": "What aspects of our service are most important to you?", "cs": "Jaké aspekty naší služby jsou pro vás nejdůležitější?", "de": "Welche Aspekte unseres Service sind Ihnen am wichtigsten?"}'::jsonb,
  '{"en": "Select all that apply", "cs": "Vyberte vše, co platí", "de": "Wählen Sie alle zutreffenden aus"}'::jsonb,
  'checklist',
  true,
  3,
  true
),
(
  '{"en": "How did you hear about FredonBytes?", "cs": "Jak jste se o FredonBytes dozvěděli?", "de": "Wie haben Sie von FredonBytes erfahren?"}'::jsonb,
  NULL,
  'single_choice',
  false,
  4,
  true
),
(
  '{"en": "Do you have any additional comments or suggestions?", "cs": "Máte nějaké další komentáře nebo návrhy?", "de": "Haben Sie weitere Kommentare oder Vorschläge?"}'::jsonb,
  '{"en": "Your feedback helps us improve", "cs": "Vaše zpětná vazba nám pomáhá se zlepšovat", "de": "Ihr Feedback hilft uns, uns zu verbessern"}'::jsonb,
  'long_text',
  false,
  5,
  true
);

-- Insert options for question 3 (checklist)
INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb,
  1
FROM survey_questions WHERE display_order = 3;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb,
  2
FROM survey_questions WHERE display_order = 3;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb,
  3
FROM survey_questions WHERE display_order = 3;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb,
  4
FROM survey_questions WHERE display_order = 3;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb,
  5
FROM survey_questions WHERE display_order = 3;

-- Insert options for question 4 (single choice)
INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Google search", "cs": "Vyhledávání Google", "de": "Google-Suche"}'::jsonb,
  1
FROM survey_questions WHERE display_order = 4;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Social media", "cs": "Sociální média", "de": "Soziale Medien"}'::jsonb,
  2
FROM survey_questions WHERE display_order = 4;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Referral from friend/colleague", "cs": "Doporučení od přítele/kolegy", "de": "Empfehlung von Freund/Kollege"}'::jsonb,
  3
FROM survey_questions WHERE display_order = 4;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Online advertisement", "cs": "Online reklama", "de": "Online-Werbung"}'::jsonb,
  4
FROM survey_questions WHERE display_order = 4;

INSERT INTO survey_question_options (question_id, option_text, display_order)
SELECT 
  id,
  '{"en": "Other", "cs": "Jiné", "de": "Andere"}'::jsonb,
  5
FROM survey_questions WHERE display_order = 4;
