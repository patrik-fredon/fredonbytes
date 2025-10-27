-- ============================================================================
-- PROJECTS SYSTEM MIGRATION
-- ============================================================================
-- Created: 2025-10-27
-- Purpose: Add projects system tables with multilingual support for FredonBytes
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE PROJECTS TABLES
-- ============================================================================

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title JSONB NOT NULL, -- {en: "Project Name", cs: "Název projektu", de: "Projektname"}
  description JSONB NOT NULL, -- Full description
  short_description JSONB, -- Brief description for cards
  image_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL, -- web_development, mobile_app, cloud_solution, etc.
  github_link TEXT,
  live_demo_link TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}', -- Array of technology names
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  display_order INTEGER NOT NULL DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Technologies Junction Table (for more structured tech management)
CREATE TABLE project_technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  technology_name VARCHAR(100) NOT NULL,
  technology_icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technologies Reference Table (for consistent tech naming and icons)
CREATE TABLE technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  icon VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL, -- frontend, backend, database, cloud, etc.
  color VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_featured ON projects(featured);
CREATE INDEX idx_projects_visible ON projects(visible);
CREATE INDEX idx_projects_display_order ON projects(display_order);
CREATE INDEX idx_projects_technologies ON projects USING GIN(technologies);

CREATE INDEX idx_project_technologies_project ON project_technologies(project_id);
CREATE INDEX idx_project_technologies_tech ON project_technologies(technology_name);

CREATE INDEX idx_technologies_category ON technologies(category);
CREATE INDEX idx_technologies_name ON technologies(name);

-- ============================================================================
-- STEP 3: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 4: SEED DATA - TECHNOLOGIES
-- ============================================================================

INSERT INTO technologies (name, icon, category, color) VALUES
-- Frontend Technologies
('React', 'react', 'frontend', '#61DAFB'),
('Next.js', 'nextjs', 'frontend', '#000000'),
('TypeScript', 'typescript', 'frontend', '#3178C6'),
('JavaScript', 'javascript', 'frontend', '#F7DF1E'),
('HTML5', 'html5', 'frontend', '#E34F26'),
('CSS3', 'css3', 'frontend', '#1572B6'),
('Tailwind CSS', 'tailwindcss', 'frontend', '#06B6D4'),
('Vue.js', 'vuejs', 'frontend', '#4FC08D'),
('Angular', 'angular', 'frontend', '#DD0031'),

-- Backend Technologies
('Node.js', 'nodejs', 'backend', '#339933'),
('Python', 'python', 'backend', '#3776AB'),
('Java', 'java', 'backend', '#007396'),
('C#', 'csharp', 'backend', '#239120'),
('PHP', 'php', 'backend', '#777BB4'),
('Go', 'go', 'backend', '#00ADD8'),
('Rust', 'rust', 'backend', '#000000'),

-- Database Technologies
('PostgreSQL', 'postgresql', 'database', '#336791'),
('MySQL', 'mysql', 'database', '#4479A1'),
('MongoDB', 'mongodb', 'database', '#47A248'),
('Redis', 'redis', 'database', '#DC382D'),
('Supabase', 'supabase', 'database', '#3ECF8E'),

-- Cloud & DevOps
('AWS', 'aws', 'cloud', '#FF9900'),
('Azure', 'azure', 'cloud', '#0078D4'),
('Google Cloud', 'googlecloud', 'cloud', '#4285F4'),
('Docker', 'docker', 'devops', '#2496ED'),
('Kubernetes', 'kubernetes', 'devops', '#326CE5'),
('Vercel', 'vercel', 'cloud', '#000000'),

-- Mobile Technologies
('React Native', 'reactnative', 'mobile', '#61DAFB'),
('Flutter', 'flutter', 'mobile', '#02569B'),
('Swift', 'swift', 'mobile', '#FA7343'),
('Kotlin', 'kotlin', 'mobile', '#7F52FF');

-- ============================================================================
-- STEP 5: SEED DATA - SAMPLE PROJECTS
-- ============================================================================

INSERT INTO projects (id, title, description, short_description, image_url, category, github_link, live_demo_link, technologies, status, display_order, featured, visible) VALUES
-- Project 1: FredonBytes Website
(
  '55555555-1111-1111-1111-111111111111',
  '{"en": "FredonBytes Corporate Website", "cs": "Firemní web FredonBytes", "de": "FredonBytes Unternehmenswebsite"}',
  '{"en": "A comprehensive corporate website built with Next.js 15, featuring multilingual support, dynamic forms, and modern responsive design. The site includes customer satisfaction forms, pricing calculators, and project galleries with full internationalization support for Czech, English, and German languages.", "cs": "Komplexní firemní web postavený na Next.js 15 s vícejazyčnou podporou, dynamickými formuláři a moderním responzivním designem. Web obsahuje formuláře spokojenosti zákazníků, cenové kalkulačky a galerie projektů s plnou internacionalizací pro češtinu, angličtinu a němčinu.", "de": "Eine umfassende Unternehmenswebsite, die mit Next.js 15 erstellt wurde und mehrsprachige Unterstützung, dynamische Formulare und modernes responsives Design bietet. Die Website umfasst Kundenzufriedenheitsformulare, Preisrechner und Projektgalerien mit vollständiger Internationalisierung für Tschechisch, Englisch und Deutsch."}',
  '{"en": "Modern corporate website with multilingual support and dynamic features", "cs": "Moderní firemní web s vícejazyčnou podporou a dynamickými funkcemi", "de": "Moderne Unternehmenswebsite mit mehrsprachiger Unterstützung und dynamischen Funktionen"}',
  '/placeholder-project-fredon.png',
  'web_development',
  'https://github.com/fredonbytes/website',
  'https://fredonbytes.cloud',
  '{"Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"}',
  'active',
  1,
  true,
  true
),
-- Project 2: E-commerce Platform
(
  '55555555-2222-2222-2222-222222222222',
  '{"en": "Modern E-commerce Platform", "cs": "Moderní e-commerce platforma", "de": "Moderne E-Commerce-Plattform"}',
  '{"en": "A full-featured e-commerce platform built with React and Node.js, featuring product catalog management, secure payment processing, inventory tracking, and comprehensive admin dashboard. The platform supports multiple payment methods and provides detailed analytics for business insights.", "cs": "Plně vybavená e-commerce platforma postavená na React a Node.js s funkcemi pro správu katalogu produktů, bezpečné zpracování plateb, sledování zásob a komplexní administrátorský dashboard. Platforma podporuje více platebních metod a poskytuje detailní analytiku pro obchodní poznatky.", "de": "Eine vollständig ausgestattete E-Commerce-Plattform, die mit React und Node.js erstellt wurde und Produktkatalogverwaltung, sichere Zahlungsabwicklung, Bestandsverfolgung und ein umfassendes Admin-Dashboard bietet. Die Plattform unterstützt mehrere Zahlungsmethoden und bietet detaillierte Analysen für Geschäftseinblicke."}',
  '{"en": "Full-featured e-commerce solution with payment processing and analytics", "cs": "Plně vybavené e-commerce řešení se zpracováním plateb a analytikou", "de": "Vollständige E-Commerce-Lösung mit Zahlungsabwicklung und Analytik"}',
  '/placeholder-project-fredon.png',
  'web_development',
  'https://github.com/fredonbytes/ecommerce-platform',
  'https://demo-ecommerce.fredonbytes.cloud',
  '{"React", "Node.js", "PostgreSQL", "Stripe", "AWS"}',
  'completed',
  2,
  true,
  true
),
-- Project 3: Mobile Task Manager
(
  '55555555-3333-3333-3333-333333333333',
  '{"en": "Cross-Platform Task Manager", "cs": "Multiplatformní správce úkolů", "de": "Plattformübergreifender Aufgabenmanager"}',
  '{"en": "A comprehensive task management application built with React Native, offering seamless synchronization across iOS and Android devices. Features include project organization, team collaboration, deadline tracking, and offline functionality with automatic sync when connection is restored.", "cs": "Komplexní aplikace pro správu úkolů postavená na React Native, nabízející bezproblémovou synchronizaci napříč iOS a Android zařízeními. Funkce zahrnují organizaci projektů, týmovou spolupráci, sledování termínů a offline funkcionalitu s automatickou synchronizací po obnovení připojení.", "de": "Eine umfassende Aufgabenverwaltungsanwendung, die mit React Native erstellt wurde und nahtlose Synchronisation zwischen iOS- und Android-Geräten bietet. Zu den Funktionen gehören Projektorganisation, Teamzusammenarbeit, Deadline-Tracking und Offline-Funktionalität mit automatischer Synchronisation bei wiederhergestellter Verbindung."}',
  '{"en": "Cross-platform mobile app for task and project management", "cs": "Multiplatformní mobilní aplikace pro správu úkolů a projektů", "de": "Plattformübergreifende mobile App für Aufgaben- und Projektmanagement"}',
  '/placeholder-project-fredon.png',
  'mobile_app',
  'https://github.com/fredonbytes/task-manager-mobile',
  NULL,
  '{"React Native", "TypeScript", "MongoDB", "Node.js"}',
  'completed',
  3,
  false,
  true
),
-- Project 4: Cloud Infrastructure Setup
(
  '55555555-4444-4444-4444-444444444444',
  '{"en": "Enterprise Cloud Infrastructure", "cs": "Podniková cloudová infrastruktura", "de": "Unternehmens-Cloud-Infrastruktur"}',
  '{"en": "A scalable cloud infrastructure solution deployed on AWS, featuring auto-scaling capabilities, load balancing, database clustering, and comprehensive monitoring. The setup includes CI/CD pipelines, security hardening, and disaster recovery procedures for enterprise-grade reliability.", "cs": "Škálovatelné řešení cloudové infrastruktury nasazené na AWS s funkcemi automatického škálování, vyrovnávání zátěže, clusteringu databází a komplexního monitorování. Nastavení zahrnuje CI/CD pipeline, bezpečnostní zpevnění a postupy pro obnovu po havárii pro podnikovou spolehlivost.", "de": "Eine skalierbare Cloud-Infrastrukturlösung, die auf AWS bereitgestellt wird und Auto-Scaling-Funktionen, Load Balancing, Datenbank-Clustering und umfassendes Monitoring bietet. Das Setup umfasst CI/CD-Pipelines, Sicherheitshärtung und Disaster-Recovery-Verfahren für Zuverlässigkeit auf Unternehmensebene."}',
  '{"en": "Scalable AWS cloud infrastructure with monitoring and auto-scaling", "cs": "Škálovatelná AWS cloudová infrastruktura s monitorováním a auto-škálováním", "de": "Skalierbare AWS-Cloud-Infrastruktur mit Monitoring und Auto-Scaling"}',
  '/placeholder-project-fredon.png',
  'cloud_solution',
  NULL,
  NULL,
  '{"AWS", "Docker", "Kubernetes", "Terraform", "Prometheus"}',
  'active',
  4,
  false,
  true
);

-- ============================================================================
-- STEP 6: POPULATE PROJECT TECHNOLOGIES JUNCTION TABLE
-- ============================================================================

-- FredonBytes Website technologies
INSERT INTO project_technologies (project_id, technology_name, technology_icon) VALUES
('55555555-1111-1111-1111-111111111111', 'Next.js', 'nextjs'),
('55555555-1111-1111-1111-111111111111', 'TypeScript', 'typescript'),
('55555555-1111-1111-1111-111111111111', 'Tailwind CSS', 'tailwindcss'),
('55555555-1111-1111-1111-111111111111', 'Supabase', 'supabase'),
('55555555-1111-1111-1111-111111111111', 'Vercel', 'vercel');

-- E-commerce Platform technologies
INSERT INTO project_technologies (project_id, technology_name, technology_icon) VALUES
('55555555-2222-2222-2222-222222222222', 'React', 'react'),
('55555555-2222-2222-2222-222222222222', 'Node.js', 'nodejs'),
('55555555-2222-2222-2222-222222222222', 'PostgreSQL', 'postgresql'),
('55555555-2222-2222-2222-222222222222', 'AWS', 'aws');

-- Task Manager technologies
INSERT INTO project_technologies (project_id, technology_name, technology_icon) VALUES
('55555555-3333-3333-3333-333333333333', 'React Native', 'reactnative'),
('55555555-3333-3333-3333-333333333333', 'TypeScript', 'typescript'),
('55555555-3333-3333-3333-333333333333', 'MongoDB', 'mongodb'),
('55555555-3333-3333-3333-333333333333', 'Node.js', 'nodejs');

-- Cloud Infrastructure technologies
INSERT INTO project_technologies (project_id, technology_name, technology_icon) VALUES
('55555555-4444-4444-4444-444444444444', 'AWS', 'aws'),
('55555555-4444-4444-4444-444444444444', 'Docker', 'docker'),
('55555555-4444-4444-4444-444444444444', 'Kubernetes', 'kubernetes');

-- ============================================================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on projects tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;

-- Public read access to visible projects and related data
CREATE POLICY "Public read visible projects" ON projects FOR SELECT USING (visible = true);
CREATE POLICY "Public read project technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Public read technologies" ON technologies FOR SELECT USING (true);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE projects IS 'Projects portfolio with multilingual support for FredonBytes';
COMMENT ON TABLE project_technologies IS 'Junction table for project-technology relationships';
COMMENT ON TABLE technologies IS 'Reference table for consistent technology naming and icons';