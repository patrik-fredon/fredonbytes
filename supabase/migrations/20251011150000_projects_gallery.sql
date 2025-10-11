-- Create projects table with multilingual support
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL,
  description JSONB NOT NULL,
  short_description JSONB,
  image_url TEXT NOT NULL,
  github_link TEXT,
  live_demo_link TEXT,
  technologies JSONB NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'archived')),
  display_order INTEGER NOT NULL,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(display_order)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON projects(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_visible ON projects(visible);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
-- Allow public to read visible projects
CREATE POLICY "Allow public read visible projects"
  ON projects
  FOR SELECT
  TO public
  USING (visible = true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_projects_updated_at();

-- Comments for documentation
COMMENT ON TABLE projects IS 'Stores project portfolio items with multilingual support';
COMMENT ON COLUMN projects.title IS 'Multilingual project title as JSONB: {en: "...", cs: "...", de: "..."}';
COMMENT ON COLUMN projects.description IS 'Multilingual full description as JSONB: {en: "...", cs: "...", de: "..."}';
COMMENT ON COLUMN projects.short_description IS 'Optional multilingual short description as JSONB';
COMMENT ON COLUMN projects.image_url IS 'URL to project image (can be relative path in /public or external CDN)';
COMMENT ON COLUMN projects.github_link IS 'Optional link to GitHub repository';
COMMENT ON COLUMN projects.live_demo_link IS 'Optional link to live demo/production site';
COMMENT ON COLUMN projects.technologies IS 'Array of technology names as JSONB: ["Next.js", "TypeScript", ...]';
COMMENT ON COLUMN projects.status IS 'Project status: active, completed, or archived';
COMMENT ON COLUMN projects.display_order IS 'Order in which projects should be displayed (unique)';
COMMENT ON COLUMN projects.featured IS 'Whether project should be featured/highlighted';
COMMENT ON COLUMN projects.visible IS 'Whether project is visible to public';

-- Insert sample projects
INSERT INTO projects (title, description, short_description, image_url, github_link, live_demo_link, technologies, status, display_order, featured, visible) VALUES
(
  '{"en": "FredonBytes Corporate Website", "cs": "Firemní web FredonBytes", "de": "FredonBytes Unternehmenswebsite"}'::jsonb,
  '{"en": "A modern, performant corporate website built with Next.js 15 and TypeScript. Features include multilingual support, cookie consent management, contact forms with email integration, and customer satisfaction surveys. Optimized for Core Web Vitals with Server-Side Rendering and streaming.", "cs": "Moderní a výkonný firemní web postavený na Next.js 15 a TypeScript. Funkce zahrnují vícejazyčnou podporu, správu souhlasu s cookies, kontaktní formuláře s integrací e-mailů a průzkumy spokojenosti zákazníků. Optimalizováno pro Core Web Vitals s renderováním na straně serveru a streamováním.", "de": "Eine moderne, leistungsstarke Unternehmenswebsite, die mit Next.js 15 und TypeScript erstellt wurde. Zu den Funktionen gehören mehrsprachige Unterstützung, Cookie-Einwilligungsverwaltung, Kontaktformulare mit E-Mail-Integration und Kundenzufriedenheitsumfragen. Optimiert für Core Web Vitals mit serverseitigem Rendering und Streaming."}'::jsonb,
  '{"en": "Next.js 15 corporate site with multilingual support", "cs": "Firemní stránka Next.js 15 s vícejazyčnou podporou", "de": "Next.js 15 Unternehmensseite mit mehrsprachiger Unterstützung"}'::jsonb,
  '/placeholder-project-fredon.png',
  'https://github.com/fredonbytes/fredonbytes-website',
  'https://fredonbytes.cloud',
  '["Next.js 15", "TypeScript", "React 19", "Tailwind CSS", "Supabase", "Framer Motion", "Zod", "React Hook Form"]'::jsonb,
  'active',
  1,
  true,
  true
),
(
  '{"en": "Cloud Infrastructure Automation", "cs": "Automatizace cloudové infrastruktury", "de": "Cloud-Infrastruktur-Automatisierung"}'::jsonb,
  '{"en": "Enterprise-grade infrastructure automation solution using Terraform and AWS. Implements Infrastructure as Code (IaC) best practices with modular design, automated testing, and CI/CD pipelines. Includes monitoring, logging, and disaster recovery capabilities.", "cs": "Řešení automatizace infrastruktury na podnikové úrovni pomocí Terraform a AWS. Implementuje osvědčené postupy Infrastructure as Code (IaC) s modulárním designem, automatizovaným testováním a CI/CD pipeline. Zahrnuje možnosti monitorování, protokolování a obnovy po havárii.", "de": "Unternehmensweite Infrastrukturautomatisierungslösung mit Terraform und AWS. Implementiert Infrastructure as Code (IaC) Best Practices mit modularem Design, automatisierten Tests und CI/CD-Pipelines. Umfasst Überwachungs-, Protokollierungs- und Disaster-Recovery-Funktionen."}'::jsonb,
  '{"en": "Terraform-based AWS infrastructure automation", "cs": "Automatizace AWS infrastruktury založená na Terraform", "de": "Terraform-basierte AWS-Infrastrukturautomatisierung"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Terraform", "AWS", "Docker", "Kubernetes", "GitHub Actions", "Python", "Bash"]'::jsonb,
  'completed',
  2,
  true,
  true
),
(
  '{"en": "E-commerce Platform Migration", "cs": "Migrace e-commerce platformy", "de": "E-Commerce-Plattform-Migration"}'::jsonb,
  '{"en": "Successfully migrated a legacy e-commerce platform to a modern microservices architecture. Implemented event-driven design with message queues, containerized services, and automated deployment pipelines. Achieved 99.9% uptime and 40% performance improvement.", "cs": "Úspěšná migrace starší e-commerce platformy na moderní architekturu mikroslužeb. Implementován event-driven design s frontami zpráv, kontejnerizovanými službami a automatizovanými deployment pipeline. Dosaženo 99,9% dostupnosti a 40% zlepšení výkonu.", "de": "Erfolgreiche Migration einer Legacy-E-Commerce-Plattform zu einer modernen Microservices-Architektur. Implementierung eines ereignisgesteuerten Designs mit Nachrichtenwarteschlangen, containerisierten Diensten und automatisierten Bereitstellungspipelines. 99,9% Verfügbarkeit und 40% Leistungsverbesserung erreicht."}'::jsonb,
  '{"en": "Legacy to microservices migration", "cs": "Migrace z legacy na mikroslužby", "de": "Migration von Legacy zu Microservices"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Node.js", "Express", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes", "AWS"]'::jsonb,
  'completed',
  3,
  false,
  true
),
(
  '{"en": "Real-time Analytics Dashboard", "cs": "Dashboard pro analýzu v reálném čase", "de": "Echtzeit-Analyse-Dashboard"}'::jsonb,
  '{"en": "Interactive analytics dashboard for monitoring business metrics in real-time. Features include customizable widgets, data visualization with charts and graphs, role-based access control, and automated report generation. Built with React and WebSocket for live updates.", "cs": "Interaktivní analytický dashboard pro sledování obchodních metrik v reálném čase. Funkce zahrnují přizpůsobitelné widgety, vizualizaci dat pomocí grafů, řízení přístupu na základě rolí a automatizované generování reportů. Vytvořeno s React a WebSocket pro živé aktualizace.", "de": "Interaktives Analyse-Dashboard zur Überwachung von Geschäftskennzahlen in Echtzeit. Zu den Funktionen gehören anpassbare Widgets, Datenvisualisierung mit Diagrammen und Grafiken, rollenbasierte Zugriffskontrolle und automatisierte Berichterstellung. Erstellt mit React und WebSocket für Live-Updates."}'::jsonb,
  '{"en": "Real-time business metrics dashboard", "cs": "Dashboard obchodních metrik v reálném čase", "de": "Echtzeit-Geschäftskennzahlen-Dashboard"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["React", "TypeScript", "D3.js", "WebSocket", "Node.js", "MongoDB", "Redis"]'::jsonb,
  'active',
  4,
  false,
  true
);
