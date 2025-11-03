-- Migration 07: Add Image Support to Form System
-- Created: 2025-11-03
-- Purpose: Add 'image' answer type and image storage tracking

-- Step 1: Add 'image' to answer_type CHECK constraint
ALTER TABLE questions 
  DROP CONSTRAINT IF EXISTS questions_answer_type_check;

ALTER TABLE questions
  ADD CONSTRAINT questions_answer_type_check 
  CHECK (answer_type IN (
    'short_text', 
    'long_text', 
    'single_choice', 
    'multiple_choice', 
    'rating',
    'image'
  ));

-- Step 2: Create form_answer_images table for tracking uploaded images
CREATE TABLE form_answer_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  file_size INTEGER NOT NULL CHECK (file_size > 0 AND file_size <= 5242880), -- Max 5MB per file
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  mime_type TEXT NOT NULL CHECK (mime_type LIKE 'image/%'),
  original_filename TEXT,
  CONSTRAINT unique_session_question_image UNIQUE(session_id, question_id, image_url)
);

-- Indexes for performance
CREATE INDEX idx_form_answer_images_session ON form_answer_images(session_id);
CREATE INDEX idx_form_answer_images_question ON form_answer_images(question_id);
CREATE INDEX idx_form_answer_images_uploaded ON form_answer_images(uploaded_at);

-- Step 3: Enable Row Level Security
ALTER TABLE form_answer_images ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only insert images for their own session
-- Note: In production, you may want more sophisticated authentication
-- For now, we rely on session_id validation in the API layer

-- Step 4: Create function to calculate total session image size
CREATE OR REPLACE FUNCTION get_session_image_total_size(p_session_id UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(file_size), 0)::BIGINT
  FROM form_answer_images
  WHERE session_id = p_session_id;
$$ LANGUAGE SQL STABLE;

-- Step 5: Create function to validate session image upload limit (50MB)
CREATE OR REPLACE FUNCTION validate_session_image_limit()
RETURNS TRIGGER AS $$
DECLARE
  total_size BIGINT;
  size_limit BIGINT := 52428800; -- 50MB in bytes
BEGIN
  total_size := get_session_image_total_size(NEW.session_id);
  
  IF (total_size + NEW.file_size) > size_limit THEN
    RAISE EXCEPTION 'Session image upload limit exceeded. Total size would be % bytes, limit is % bytes', 
      (total_size + NEW.file_size), size_limit;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Create trigger to enforce 50MB session limit
CREATE TRIGGER enforce_session_image_limit
  BEFORE INSERT ON form_answer_images
  FOR EACH ROW
  EXECUTE FUNCTION validate_session_image_limit();

-- Step 7: Add comment documentation
COMMENT ON TABLE form_answer_images IS 'Tracks images uploaded as form answers. Enforces 5MB per file and 50MB per session limits.';
COMMENT ON COLUMN form_answer_images.file_size IS 'File size in bytes. Max 5MB (5242880 bytes) per file.';
COMMENT ON FUNCTION get_session_image_total_size IS 'Returns total size of all images uploaded for a session in bytes.';
COMMENT ON FUNCTION validate_session_image_limit IS 'Trigger function to enforce 50MB total image limit per session.';
