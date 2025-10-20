# Streamlined Survey and Form Database Schema Design

## Overview

This document presents a comprehensive database schema design for a unified survey and form system that eliminates redundancy while supporting independent completion, multilingual content, and shareable links with analytics tracking.

## Design Principles

1. **Unification**: Merge similar tables for forms and surveys to reduce redundancy
2. **Flexibility**: Support multiple question types and answer formats
3. **Internationalization**: Full multilingual support for Czech (cs), English (en), and German (de)
4. **Session Management**: Independent completion with shareable links
5. **Analytics**: Track session relationships for shareable link usage

## Database Schema

### Core Tables

#### 1. questionnaires

Stores both form and survey questionnaires as unified entities.

```sql
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(10) NOT NULL CHECK (type IN ('form', 'survey')),
  title JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE questionnaires IS 'Unified table for both forms and surveys';
COMMENT ON COLUMN questionnaires.type IS 'Type: form or survey';
COMMENT ON COLUMN questionnaires.title IS 'Multilingual title in JSONB format';
COMMENT ON COLUMN questionnaires.description IS 'Multilingual description in JSONB format';
```

#### 2. questions

Stores all questions for both forms and surveys.

```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  question_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  description JSONB, -- {en: "...", cs: "...", de: "..."}
  answer_type VARCHAR(20) NOT NULL CHECK (answer_type IN ('short_text', 'long_text', 'single_choice', 'multiple_choice', 'checklist', 'rating')),
  required BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(questionnaire_id, display_order)
);

COMMENT ON TABLE questions IS 'Questions for both forms and surveys';
COMMENT ON COLUMN questions.question_text IS 'Multilingual question text in JSONB format';
COMMENT ON COLUMN questions.answer_type IS 'Type: short_text, long_text, single_choice, multiple_choice, checklist, rating';
```

#### 3. question_options

Stores options for choice-based questions.

```sql
CREATE TABLE question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  option_text JSONB NOT NULL, -- {en: "...", cs: "...", de: "..."}
  display_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, display_order)
);

COMMENT ON TABLE question_options IS 'Options for choice-based questions';
COMMENT ON COLUMN question_options.option_text IS 'Multilingual option text in JSONB format';
```

#### 4. sessions

Manages session state for both forms and surveys with shareable link support.

```sql
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id) ON DELETE CASCADE,
  original_session_id UUID REFERENCES sessions(session_id), -- For shareable link analytics
  locale VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'cs', 'de')),
  ip_address_hash TEXT,
  user_agent TEXT,
  email TEXT, -- Optional for forms
  newsletter_optin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

COMMENT ON TABLE sessions IS 'Session management for forms and surveys';
COMMENT ON COLUMN sessions.original_session_id IS 'Reference to original session for shareable link analytics';
COMMENT ON COLUMN sessions.expires_at IS 'Session expiration time (24 hours default)';
```

#### 5. answers

Stores all answers for both forms and surveys.

```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer_value JSONB NOT NULL, -- Can be string, array, or number
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, question_id)
);

COMMENT ON TABLE answers IS 'Answers for both forms and surveys';
COMMENT ON COLUMN answers.answer_value IS 'Answer value in JSONB format (string, array, or number)';
```

### Supporting Tables

#### 6. contact_submissions

Maintains contact form submissions linked to surveys.

```sql
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

COMMENT ON TABLE contact_submissions IS 'Contact form submissions linked to survey sessions';
```

#### 7. newsletter_subscribers

Manages newsletter subscriptions.

```sql
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
```

#### 8. cookie_consents

Tracks cookie consent for GDPR compliance.

```sql
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
```

#### 9. projects

Project gallery with multilingual support.

```sql
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
```

## Indexes for Performance

```sql
-- Questionnaires
CREATE INDEX idx_questionnaires_type ON questionnaires(type);
CREATE INDEX idx_questionnaires_active ON questionnaires(active);

-- Questions
CREATE INDEX idx_questions_questionnaire_id ON questions(questionnaire_id);
CREATE INDEX idx_questions_display_order ON questions(display_order);
CREATE INDEX idx_questions_active ON questions(active);

-- Question Options
CREATE INDEX idx_question_options_question_id ON question_options(question_id);
CREATE INDEX idx_question_options_display_order ON question_options(display_order);

-- Sessions
CREATE INDEX idx_sessions_questionnaire_id ON sessions(questionnaire_id);
CREATE INDEX idx_sessions_original_session_id ON sessions(original_session_id);
CREATE INDEX idx_sessions_locale ON sessions(locale);
CREATE INDEX idx_sessions_created_at ON sessions(created_at);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Answers
CREATE INDEX idx_answers_session_id ON answers(session_id);
CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_submitted_at ON answers(submitted_at);

-- Contact Submissions
CREATE INDEX idx_contact_submissions_session_id ON contact_submissions(session_id);
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_created_at ON contact_submissions(created_at);

-- Newsletter Subscribers
CREATE INDEX idx_newsletter_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_subscribers_active ON newsletter_subscribers(active);

-- Cookie Consents
CREATE INDEX idx_cookie_consents_session_id ON cookie_consents(session_id);
CREATE INDEX idx_cookie_consents_created_at ON cookie_consents(created_at);

-- Projects
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_visible ON projects(visible);
CREATE INDEX idx_projects_featured ON projects(featured);
```

## Triggers for Timestamps

```sql
-- Create function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for tables with updated_at columns
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
```

## Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookie_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

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

-- Answers policies
CREATE POLICY "Public can create answers"
ON answers FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public can read own answers"
ON answers FOR SELECT
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
```

## Seed Data

### Form Questionnaire

```sql
-- Insert form questionnaire
INSERT INTO questionnaires (type, title, description)
VALUES (
  'form',
  '{"en": "Customer Satisfaction Form", "cs": "Formulář spokojenosti zákazníků", "de": "Kundenzufriedenheitsformular"}'::jsonb,
  '{"en": "Help us improve our services by sharing your feedback", "cs": "Pomozte nám zlepšit naše služby sdílením vaší zpětné vazby", "de": "Helfen Sie uns, unsere Dienstleistungen zu verbessern, indem Sie Ihr Feedback teilen"}'::jsonb
) RETURNING id;
```

### Survey Questionnaire

```sql
-- Insert survey questionnaire
INSERT INTO questionnaires (type, title, description)
VALUES (
  'survey',
  '{"en": "Post-Contact Survey", "cs": "Průzkum po kontaktu", "de": "Nach-Kontakt-Umfrage"}'::jsonb,
  '{"en": "Share your experience with our initial response", "cs": "Sdílejte své zkušenosti s naší počáteční odpovědí", "de": "Teilen Sie Ihre Erfahrung mit unserer ersten Antwort"}'::jsonb
) RETURNING id;
```

### Form Questions (4 sample questions)

```sql
-- Get form questionnaire ID
DO $$
DECLARE
  form_questionnaire_id UUID;
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
  ) RETURNING id INTO form_questionnaire_id;

  -- Add options for checklist question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (form_questionnaire_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (form_questionnaire_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (form_questionnaire_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (form_questionnaire_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (form_questionnaire_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);

  -- Question 3: Single choice
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    form_questionnaire_id,
    '{"en": "Would you recommend us to others?", "cs": "Doporučili byste nás ostatním?", "de": "Würden Sie uns anderen empfehlen?"}'::jsonb,
    NULL,
    'single_choice',
    true,
    3
  ) RETURNING id INTO form_questionnaire_id;

  -- Add options for single choice question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (form_questionnaire_id, '{"en": "Definitely", "cs": "Rozhodně", "de": "Auf jeden Fall"}'::jsonb, 1),
    (form_questionnaire_id, '{"en": "Probably", "cs": "Pravděpodobně", "de": "Wahrscheinlich"}'::jsonb, 2),
    (form_questionnaire_id, '{"en": "Not sure", "cs": "Nejsem si jistý", "de": "Nicht sicher"}'::jsonb, 3),
    (form_questionnaire_id, '{"en": "Probably not", "cs": "Pravděpodobně ne", "de": "Wahrscheinlich nicht"}'::jsonb, 4),
    (form_questionnaire_id, '{"en": "Definitely not", "cs": "Rozhodně ne", "de": "Auf keinen Fall"}'::jsonb, 5);

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
```

### Survey Questions (5 sample questions)

```sql
-- Get survey questionnaire ID
DO $$
DECLARE
  survey_questionnaire_id UUID;
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
  ) RETURNING id INTO survey_questionnaire_id;

  -- Add options for checklist question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (survey_questionnaire_id, '{"en": "Quality of work", "cs": "Kvalita práce", "de": "Arbeitsqualität"}'::jsonb, 1),
    (survey_questionnaire_id, '{"en": "Communication", "cs": "Komunikace", "de": "Kommunikation"}'::jsonb, 2),
    (survey_questionnaire_id, '{"en": "Timeliness", "cs": "Včasnost", "de": "Pünktlichkeit"}'::jsonb, 3),
    (survey_questionnaire_id, '{"en": "Pricing", "cs": "Ceny", "de": "Preisgestaltung"}'::jsonb, 4),
    (survey_questionnaire_id, '{"en": "Technical expertise", "cs": "Technická odbornost", "de": "Technisches Fachwissen"}'::jsonb, 5);

  -- Question 4: Single choice
  INSERT INTO questions (questionnaire_id, question_text, description, answer_type, required, display_order)
  VALUES (
    survey_questionnaire_id,
    '{"en": "How did you hear about FredonBytes?", "cs": "Jak jste se o FredonBytes dozvěděli?", "de": "Wie haben Sie von FredonBytes erfahren?"}'::jsonb,
    NULL,
    'single_choice',
    false,
    4
  ) RETURNING id INTO survey_questionnaire_id;

  -- Add options for single choice question
  INSERT INTO question_options (question_id, option_text, display_order) VALUES
    (survey_questionnaire_id, '{"en": "Google search", "cs": "Vyhledávání Google", "de": "Google-Suche"}'::jsonb, 1),
    (survey_questionnaire_id, '{"en": "Social media", "cs": "Sociální média", "de": "Soziale Medien"}'::jsonb, 2),
    (survey_questionnaire_id, '{"en": "Referral", "cs": "Doporučení", "de": "Empfehlung"}'::jsonb, 3),
    (survey_questionnaire_id, '{"en": "Online advertisement", "cs": "Online reklama", "de": "Online-Werbung"}'::jsonb, 4),
    (survey_questionnaire_id, '{"en": "Other", "cs": "Jiné", "de": "Andere"}'::jsonb, 5);

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
```

## Migration Strategy

### Step 1: Remove All Existing Migrations

```sql
-- Drop all existing tables in reverse order of dependencies
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS cookie_consents CASCADE;
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS contact_submissions CASCADE;
DROP TABLE IF EXISTS survey_responses CASCADE;
DROP TABLE IF EXISTS survey_sessions CASCADE;
DROP TABLE IF EXISTS survey_question_options CASCADE;
DROP TABLE IF EXISTS survey_questions CASCADE;
DROP TABLE IF EXISTS form_responses CASCADE;
DROP TABLE IF EXISTS form_sessions CASCADE;
DROP TABLE IF EXISTS question_options CASCADE;
DROP TABLE IF EXISTS questions CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;
```

### Step 2: Execute Complete Schema Creation

Run the complete DDL statements provided above to create the new unified schema.

### Step 3: Verification

```sql
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
SELECT 'answers', COUNT(*) FROM answers
UNION ALL
SELECT 'contact_submissions', COUNT(*) FROM contact_submissions
UNION ALL
SELECT 'newsletter_subscribers', COUNT(*) FROM newsletter_subscribers
UNION ALL
SELECT 'cookie_consents', COUNT(*) FROM cookie_consents
UNION ALL
SELECT 'projects', COUNT(*) FROM projects
ORDER BY table_name;
```

## API Implementation Notes

### Session Management

- Sessions automatically expire after 24 hours
- Shareable links create new sessions with `original_session_id` reference
- Sessions are tied to specific questionnaires (form or survey)

### Multilingual Content

- All user-facing text stored as JSONB with keys: en, cs, de
- API endpoints return content based on requested locale
- Fallback to English if requested locale translation is missing

### Question Types

- `short_text`: Single line text input
- `long_text`: Multi-line text input
- `single_choice`: Select one option
- `multiple_choice`: Select multiple options
- `checklist`: Select multiple options (checkboxes)
- `rating`: Numeric rating (1-5)

### Answer Storage

- All answers stored as JSONB for flexibility
- Text answers: stored as strings
- Choice answers: stored as arrays of selected option IDs
- Rating answers: stored as numbers

## Shareable Link Implementation

### Flow

1. User completes original session (form or survey)
2. System generates shareable link: `/form/join?session_id=UUID` or `/survey/join?session_id=UUID`
3. New user clicks shareable link
4. System creates new session with:
   - `original_session_id` pointing to the original
   - Same `questionnaire_id` as original
   - New generated `session_id`
5. New user completes independently

### Analytics

- Track how many sessions originate from each shareable link
- Measure conversion rates and engagement
- Understand sharing patterns

## Benefits of This Design

1. **Reduced Redundancy**: Unified tables eliminate duplicate structures
2. **Flexibility**: Easy to add new questionnaire types
3. **Scalability**: Efficient queries with proper indexing
4. **Internationalization**: Built-in multilingual support
5. **Analytics**: Trackable sharing mechanisms
6. **Security**: Row-level security policies in place
7. **Performance**: Optimized indexes for common query patterns

## TypeScript Interface Updates

The existing TypeScript interfaces in [`src/app/lib/supabase.ts`](src/app/lib/supabase.ts:1) will need to be updated to match the new unified schema:

```typescript
// New interfaces for unified system
export interface Questionnaire {
  id: string;
  type: "form" | "survey";
  title: LocalizedString;
  description?: LocalizedString | null;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Question {
  id: string;
  questionnaire_id: string;
  question_text: LocalizedString;
  description?: LocalizedString | null;
  answer_type:
    | "short_text"
    | "long_text"
    | "single_choice"
    | "multiple_choice"
    | "checklist"
    | "rating";
  required: boolean;
  display_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  options?: QuestionOption[];
}

export interface Session {
  session_id: string;
  questionnaire_id: string;
  original_session_id?: string | null;
  locale: string;
  email?: string | null;
  newsletter_optin?: boolean;
  created_at?: string;
  completed_at?: string | null;
  expires_at?: string;
  ip_address_hash?: string | null;
  user_agent?: string | null;
}

export interface Answer {
  id?: string;
  session_id: string;
  question_id: string;
  answer_value: AnswerValue;
  submitted_at?: string;
}
```

This comprehensive design provides a robust foundation for the streamlined survey and form APIs while maintaining all required functionality and adding new capabilities.
