-- ============================================================================
-- MIGRATION: 10_add_upload_system.sql
-- Description: Add client upload system with project password authentication
-- Date: 2025-12-03
-- ============================================================================

-- ============================================================================
-- STEP 1: ADD UPLOAD PASSWORD TO PROJECTS TABLE
-- ============================================================================

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS upload_password TEXT DEFAULT NULL;

COMMENT ON COLUMN projects.upload_password IS 'Simple access password for client file uploads. Set per project. NULL means uploads disabled for this project.';

-- ============================================================================
-- STEP 2: CREATE UPLOAD SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS upload_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(36) UNIQUE NOT NULL,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL DEFAULT 'cs',
  file_count INTEGER NOT NULL DEFAULT 0,
  total_size_bytes BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_upload_sessions_session_id ON upload_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_project_id ON upload_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_upload_sessions_expires_at ON upload_sessions(expires_at);

COMMENT ON TABLE upload_sessions IS 'Tracks client upload sessions with expiration and file counts';

-- ============================================================================
-- STEP 3: CREATE UPLOADED FILES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(36) NOT NULL REFERENCES upload_sessions(session_id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  original_filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_uploaded_files_session_id ON uploaded_files(session_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_project_id ON uploaded_files(project_id);

COMMENT ON TABLE uploaded_files IS 'Metadata for files uploaded by clients to Supabase Storage';


-- ============================================================================
-- STEP 4: ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE upload_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Upload sessions: Allow insert and select for valid sessions
CREATE POLICY "Allow anonymous session creation" ON upload_sessions 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own session" ON upload_sessions 
  FOR SELECT USING (true);

CREATE POLICY "Allow update own session" ON upload_sessions 
  FOR UPDATE USING (true);

-- Uploaded files: Allow insert for valid session, read for anyone
CREATE POLICY "Allow file upload" ON uploaded_files 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read uploaded files" ON uploaded_files 
  FOR SELECT USING (true);


-- ============================================================================
-- STEP 5: UPDATE TRIGGER FOR SESSION STATS
-- ============================================================================

-- Function to update file count and total size when files are uploaded
CREATE OR REPLACE FUNCTION update_upload_session_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE upload_sessions 
  SET 
    file_count = file_count + 1,
    total_size_bytes = total_size_bytes + NEW.file_size
  WHERE session_id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists (for re-running migration)
DROP TRIGGER IF EXISTS trigger_update_upload_session_stats ON uploaded_files;

CREATE TRIGGER trigger_update_upload_session_stats
  AFTER INSERT ON uploaded_files
  FOR EACH ROW EXECUTE FUNCTION update_upload_session_stats();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- INSTRUCTIONS:
-- 1. Run this migration in Supabase Dashboard → SQL Editor
-- 2. Create bucket 'client-uploads' in Storage with private access
-- 3. Set upload_password for projects that should allow uploads:
--    UPDATE projects SET upload_password = 'your-secret-code' WHERE id = 'project-uuid';

-- STORAGE POLICY (run separately in Storage → Policies or SQL Editor):
-- CREATE POLICY "Allow uploads to client-uploads" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'client-uploads');
-- CREATE POLICY "Allow read client-uploads" ON storage.objects
--   FOR SELECT USING (bucket_id = 'client-uploads');
