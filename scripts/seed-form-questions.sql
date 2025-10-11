-- FredonBytes Customer Satisfaction Form - Seed Data
-- This script populates the database with sample questions for the customer satisfaction survey
-- Execute this in Supabase SQL Editor after running the database-schema.sql migration
-- 
-- This script includes 6 diverse questions covering all answer types:
-- - short_text: Quick text responses
-- - long_text: Detailed feedback
-- - single_choice: Single selection from options
-- - multiple_choice: Multiple selections allowed
-- - checklist: Multiple selections with "select all" functionality

-- ============================================================================
-- CLEAR EXISTING DATA (Optional - uncomment to reset)
-- ============================================================================

-- DELETE FROM form_responses;
-- DELETE FROM form_sessions;
-- DELETE FROM question_options;
-- DELETE FROM questions;

-- ============================================================================
-- QUESTION 1: Overall Satisfaction (Single Choice)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'How satisfied are you with our service?',
  'Rate your overall experience with FredonBytes',
  'single_choice',
  true,
  1
);

-- Insert options for Question 1
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

-- ============================================================================
-- QUESTION 2: Services Used (Multiple Choice)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Which services did you use?',
  'Select all services you have experienced with FredonBytes',
  'multiple_choice',
  true,
  2
);

-- Insert options for Question 2
DO $$
DECLARE
  q2_id UUID;
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

-- ============================================================================
-- QUESTION 3: What You Liked (Long Text)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'What did you like most about our service?',
  'Tell us what worked well for you and what exceeded your expectations',
  'long_text',
  false,
  3
);

-- ============================================================================
-- QUESTION 4: Project Name (Short Text)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'What project did we work on together?',
  'Optional: Help us identify which project this feedback relates to',
  'short_text',
  false,
  4
);

-- ============================================================================
-- QUESTION 5: Areas for Improvement (Checklist)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Which areas could we improve?',
  'Select all areas where you think we could do better',
  'checklist',
  false,
  5
);

-- Insert options for Question 5
DO $$
DECLARE
  q5_id UUID;
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

-- ============================================================================
-- QUESTION 6: Additional Feedback (Long Text)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Any additional feedback or suggestions?',
  'Share any other thoughts, concerns, or ideas you have',
  'long_text',
  false,
  6
);

-- ============================================================================
-- QUESTION 7: Recommendation Likelihood (Single Choice)
-- ============================================================================

INSERT INTO questions (question_text, description, answer_type, required, display_order)
VALUES (
  'Would you recommend FredonBytes to others?',
  'How likely are you to recommend our services to colleagues or friends?',
  'single_choice',
  true,
  7
);

-- Insert options for Question 7
DO $$
DECLARE
  q7_id UUID;
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

-- Display all questions with their answer types
SELECT 
  display_order,
  question_text,
  answer_type,
  required,
  description
FROM questions
ORDER BY display_order;

-- Display all question options
SELECT 
  q.display_order as question_order,
  q.question_text,
  qo.display_order as option_order,
  qo.option_text
FROM questions q
JOIN question_options qo ON q.id = qo.question_id
ORDER BY q.display_order, qo.display_order;

-- Summary statistics
SELECT 
  answer_type,
  COUNT(*) as count,
  SUM(CASE WHEN required THEN 1 ELSE 0 END) as required_count
FROM questions
GROUP BY answer_type
ORDER BY answer_type;
