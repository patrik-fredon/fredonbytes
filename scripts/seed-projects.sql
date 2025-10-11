-- Seed script for projects gallery
-- This script can be run independently to populate the projects table with sample data
-- Run with: psql -h <host> -U <user> -d <database> -f scripts/seed-projects.sql
-- Or via Supabase dashboard SQL editor

-- Clear existing sample data (optional - comment out if you want to keep existing projects)
-- DELETE FROM projects WHERE id IN (
--   SELECT id FROM projects WHERE title->>'en' LIKE '%FredonBytes%' OR title->>'en' LIKE '%Cloud Infrastructure%'
-- );

-- Insert sample projects with full translations
INSERT INTO projects (
  title,
  description,
  short_description,
  image_url,
  github_link,
  live_demo_link,
  technologies,
  status,
  display_order,
  featured,
  visible
) VALUES
-- Project 1: FredonBytes Corporate Website
(
  '{"en": "FredonBytes Corporate Website", "cs": "Firemní web FredonBytes", "de": "FredonBytes Unternehmenswebsite"}'::jsonb,
  '{"en": "A modern, performant corporate website built with Next.js 15 and TypeScript. Features include multilingual support (EN, CS, DE), GDPR-compliant cookie consent management, contact forms with automated email notifications, and integrated customer satisfaction surveys. Optimized for Core Web Vitals with Server-Side Rendering, streaming, and comprehensive accessibility features (WCAG 2.1 AA).", "cs": "Moderní a výkonný firemní web postavený na Next.js 15 a TypeScript. Funkce zahrnují vícejazyčnou podporu (EN, CS, DE), správu souhlasu s cookies v souladu s GDPR, kontaktní formuláře s automatickými e-mailovými oznámeními a integrované průzkumy spokojenosti zákazníků. Optimalizováno pro Core Web Vitals s renderováním na straně serveru, streamováním a komplexními funkcemi přístupnosti (WCAG 2.1 AA).", "de": "Eine moderne, leistungsstarke Unternehmenswebsite, die mit Next.js 15 und TypeScript erstellt wurde. Zu den Funktionen gehören mehrsprachige Unterstützung (EN, CS, DE), DSGVO-konforme Cookie-Einwilligungsverwaltung, Kontaktformulare mit automatisierten E-Mail-Benachrichtigungen und integrierte Kundenzufriedenheitsumfragen. Optimiert für Core Web Vitals mit serverseitigem Rendering, Streaming und umfassenden Barrierefreiheitsfunktionen (WCAG 2.1 AA)."}'::jsonb,
  '{"en": "Next.js 15 corporate site with multilingual support and GDPR compliance", "cs": "Firemní stránka Next.js 15 s vícejazyčnou podporou a soulad s GDPR", "de": "Next.js 15 Unternehmensseite mit mehrsprachiger Unterstützung und DSGVO-Konformität"}'::jsonb,
  '/placeholder-project-fredon.png',
  'https://github.com/fredonbytes/fredonbytes-website',
  'https://fredonbytes.cloud',
  '["Next.js 15", "TypeScript", "React 19", "Tailwind CSS 4", "Supabase", "Framer Motion", "Zod", "React Hook Form", "next-intl", "Nodemailer"]'::jsonb,
  'active',
  1,
  true,
  true
),

-- Project 2: Cloud Infrastructure Automation
(
  '{"en": "Cloud Infrastructure Automation", "cs": "Automatizace cloudové infrastruktury", "de": "Cloud-Infrastruktur-Automatisierung"}'::jsonb,
  '{"en": "Enterprise-grade infrastructure automation solution using Terraform and AWS. Implements Infrastructure as Code (IaC) best practices with modular design, automated testing, and CI/CD pipelines. Features include multi-environment support, automated backups, monitoring with CloudWatch, centralized logging, and disaster recovery capabilities. Reduced deployment time by 75% and infrastructure costs by 30%.", "cs": "Řešení automatizace infrastruktury na podnikové úrovni pomocí Terraform a AWS. Implementuje osvědčené postupy Infrastructure as Code (IaC) s modulárním designem, automatizovaným testováním a CI/CD pipeline. Funkce zahrnují podporu více prostředí, automatizované zálohy, monitorování pomocí CloudWatch, centralizované protokolování a možnosti obnovy po havárii. Snížení času nasazení o 75 % a nákladů na infrastrukturu o 30 %.", "de": "Unternehmensweite Infrastrukturautomatisierungslösung mit Terraform und AWS. Implementiert Infrastructure as Code (IaC) Best Practices mit modularem Design, automatisierten Tests und CI/CD-Pipelines. Zu den Funktionen gehören Multi-Umgebungs-Unterstützung, automatisierte Backups, Überwachung mit CloudWatch, zentralisierte Protokollierung und Disaster-Recovery-Funktionen. Reduzierung der Bereitstellungszeit um 75% und der Infrastrukturkosten um 30%."}'::jsonb,
  '{"en": "Terraform-based AWS infrastructure automation with IaC best practices", "cs": "Automatizace AWS infrastruktury založená na Terraform s osvědčenými postupy IaC", "de": "Terraform-basierte AWS-Infrastrukturautomatisierung mit IaC Best Practices"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Terraform", "AWS", "Docker", "Kubernetes", "GitHub Actions", "Python", "Bash", "CloudWatch", "S3", "EC2"]'::jsonb,
  'completed',
  2,
  true,
  true
),

-- Project 3: E-commerce Platform Migration
(
  '{"en": "E-commerce Platform Migration", "cs": "Migrace e-commerce platformy", "de": "E-Commerce-Plattform-Migration"}'::jsonb,
  '{"en": "Successfully migrated a legacy monolithic e-commerce platform to a modern microservices architecture. Implemented event-driven design with RabbitMQ message queues, containerized services with Docker, and automated deployment pipelines with Kubernetes. Features include distributed caching with Redis, database sharding, API gateway with rate limiting, and comprehensive monitoring. Achieved 99.9% uptime, 40% performance improvement, and 60% reduction in infrastructure costs.", "cs": "Úspěšná migrace starší monolitické e-commerce platformy na moderní architekturu mikroslužeb. Implementován event-driven design s frontami zpráv RabbitMQ, kontejnerizovanými službami s Docker a automatizovanými deployment pipeline s Kubernetes. Funkce zahrnují distribuované ukládání do mezipaměti s Redis, sharding databáze, API gateway s omezením rychlosti a komplexní monitorování. Dosaženo 99,9% dostupnosti, 40% zlepšení výkonu a 60% snížení nákladů na infrastrukturu.", "de": "Erfolgreiche Migration einer monolithischen Legacy-E-Commerce-Plattform zu einer modernen Microservices-Architektur. Implementierung eines ereignisgesteuerten Designs mit RabbitMQ-Nachrichtenwarteschlangen, containerisierten Diensten mit Docker und automatisierten Bereitstellungspipelines mit Kubernetes. Zu den Funktionen gehören verteiltes Caching mit Redis, Datenbank-Sharding, API-Gateway mit Rate-Limiting und umfassendes Monitoring. 99,9% Verfügbarkeit, 40% Leistungsverbesserung und 60% Reduzierung der Infrastrukturkosten erreicht."}'::jsonb,
  '{"en": "Legacy monolith to microservices migration with event-driven architecture", "cs": "Migrace z legacy monolitu na mikroslužby s event-driven architekturou", "de": "Migration von Legacy-Monolith zu Microservices mit ereignisgesteuerter Architektur"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Node.js", "Express", "PostgreSQL", "Redis", "RabbitMQ", "Docker", "Kubernetes", "AWS", "Nginx", "Prometheus"]'::jsonb,
  'completed',
  3,
  false,
  true
),

-- Project 4: Real-time Analytics Dashboard
(
  '{"en": "Real-time Analytics Dashboard", "cs": "Dashboard pro analýzu v reálném čase", "de": "Echtzeit-Analyse-Dashboard"}'::jsonb,
  '{"en": "Interactive analytics dashboard for monitoring business metrics in real-time. Features include customizable widgets with drag-and-drop interface, advanced data visualization with D3.js charts and graphs, role-based access control with JWT authentication, automated report generation with PDF export, and real-time updates via WebSocket. Supports multiple data sources and custom SQL queries. Handles 10,000+ concurrent users with sub-second latency.", "cs": "Interaktivní analytický dashboard pro sledování obchodních metrik v reálném čase. Funkce zahrnují přizpůsobitelné widgety s rozhraním drag-and-drop, pokročilou vizualizaci dat pomocí grafů D3.js, řízení přístupu na základě rolí s JWT autentizací, automatizované generování reportů s exportem do PDF a aktualizace v reálném čase přes WebSocket. Podporuje více zdrojů dat a vlastní SQL dotazy. Zvládá 10 000+ současných uživatelů s latencí pod sekundu.", "de": "Interaktives Analyse-Dashboard zur Überwachung von Geschäftskennzahlen in Echtzeit. Zu den Funktionen gehören anpassbare Widgets mit Drag-and-Drop-Oberfläche, erweiterte Datenvisualisierung mit D3.js-Diagrammen und -Grafiken, rollenbasierte Zugriffskontrolle mit JWT-Authentifizierung, automatisierte Berichterstellung mit PDF-Export und Echtzeit-Updates über WebSocket. Unterstützt mehrere Datenquellen und benutzerdefinierte SQL-Abfragen. Verarbeitet 10.000+ gleichzeitige Benutzer mit Latenz unter einer Sekunde."}'::jsonb,
  '{"en": "Real-time business metrics dashboard with customizable widgets", "cs": "Dashboard obchodních metrik v reálném čase s přizpůsobitelnými widgety", "de": "Echtzeit-Geschäftskennzahlen-Dashboard mit anpassbaren Widgets"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["React", "TypeScript", "D3.js", "WebSocket", "Node.js", "MongoDB", "Redis", "JWT", "Express", "Chart.js"]'::jsonb,
  'active',
  4,
  false,
  true
),

-- Project 5: Mobile Banking Application
(
  '{"en": "Mobile Banking Application", "cs": "Mobilní bankovní aplikace", "de": "Mobile Banking-Anwendung"}'::jsonb,
  '{"en": "Secure mobile banking application built with React Native for iOS and Android. Features include biometric authentication (Face ID, Touch ID), real-time transaction notifications, bill payments, fund transfers, QR code payments, and investment portfolio management. Implements end-to-end encryption, PCI DSS compliance, and fraud detection with machine learning. Supports offline mode with data synchronization. Serves 500,000+ active users with 4.8-star rating.", "cs": "Zabezpečená mobilní bankovní aplikace vytvořená pomocí React Native pro iOS a Android. Funkce zahrnují biometrickou autentizaci (Face ID, Touch ID), oznámení o transakcích v reálném čase, platby účtů, převody prostředků, platby QR kódem a správu investičního portfolia. Implementuje end-to-end šifrování, soulad s PCI DSS a detekci podvodů pomocí strojového učení. Podporuje offline režim se synchronizací dat. Obsluhuje 500 000+ aktivních uživatelů s hodnocením 4,8 hvězdičky.", "de": "Sichere Mobile-Banking-Anwendung, die mit React Native für iOS und Android erstellt wurde. Zu den Funktionen gehören biometrische Authentifizierung (Face ID, Touch ID), Echtzeit-Transaktionsbenachrichtigungen, Rechnungszahlungen, Geldüberweisungen, QR-Code-Zahlungen und Verwaltung von Anlageportfolios. Implementiert End-to-End-Verschlüsselung, PCI-DSS-Konformität und Betrugserkennung mit maschinellem Lernen. Unterstützt Offline-Modus mit Datensynchronisation. Bedient 500.000+ aktive Benutzer mit 4,8-Sterne-Bewertung."}'::jsonb,
  '{"en": "Secure React Native banking app with biometric authentication", "cs": "Zabezpečená bankovní aplikace React Native s biometrickou autentizací", "de": "Sichere React Native Banking-App mit biometrischer Authentifizierung"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["React Native", "TypeScript", "Node.js", "PostgreSQL", "Redis", "AWS", "TensorFlow", "JWT", "Socket.io"]'::jsonb,
  'completed',
  5,
  true,
  true
),

-- Project 6: DevOps Monitoring Platform
(
  '{"en": "DevOps Monitoring Platform", "cs": "Platforma pro DevOps monitoring", "de": "DevOps-Überwachungsplattform"}'::jsonb,
  '{"en": "Comprehensive monitoring and observability platform for DevOps teams. Integrates with Prometheus, Grafana, and ELK stack for metrics, logs, and traces. Features include custom alerting rules, incident management, on-call scheduling, SLA tracking, and automated remediation workflows. Provides unified dashboard for infrastructure, applications, and business metrics. Supports multi-cloud environments (AWS, Azure, GCP). Reduced mean time to resolution (MTTR) by 65%.", "cs": "Komplexní platforma pro monitorování a observability pro DevOps týmy. Integruje se s Prometheus, Grafana a ELK stackem pro metriky, logy a traces. Funkce zahrnují vlastní pravidla upozornění, správu incidentů, plánování pohotovosti, sledování SLA a automatizované workflow nápravy. Poskytuje jednotný dashboard pro infrastrukturu, aplikace a obchodní metriky. Podporuje multi-cloud prostředí (AWS, Azure, GCP). Snížení průměrné doby řešení (MTTR) o 65 %.", "de": "Umfassende Überwachungs- und Observability-Plattform für DevOps-Teams. Integriert mit Prometheus, Grafana und ELK-Stack für Metriken, Logs und Traces. Zu den Funktionen gehören benutzerdefinierte Alarmregeln, Incident-Management, Bereitschaftsplanung, SLA-Tracking und automatisierte Behebungs-Workflows. Bietet ein einheitliches Dashboard für Infrastruktur, Anwendungen und Geschäftskennzahlen. Unterstützt Multi-Cloud-Umgebungen (AWS, Azure, GCP). Reduzierung der mittleren Lösungszeit (MTTR) um 65%."}'::jsonb,
  '{"en": "Multi-cloud monitoring platform with automated incident response", "cs": "Multi-cloud monitorovací platforma s automatizovanou reakcí na incidenty", "de": "Multi-Cloud-Überwachungsplattform mit automatisierter Incident-Response"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Prometheus", "Grafana", "Elasticsearch", "Logstash", "Kibana", "Python", "Go", "Kubernetes", "Terraform"]'::jsonb,
  'active',
  6,
  false,
  true
),

-- Project 7: AI-Powered Content Management System
(
  '{"en": "AI-Powered Content Management System", "cs": "CMS poháněný umělou inteligencí", "de": "KI-gestütztes Content-Management-System"}'::jsonb,
  '{"en": "Next-generation CMS with AI-powered content creation and optimization. Features include automated content generation with GPT-4, SEO optimization suggestions, image recognition and tagging, sentiment analysis, A/B testing automation, and personalized content recommendations. Built with headless architecture supporting multiple frontends (web, mobile, IoT). Includes visual page builder, version control, and multi-tenant support. Increased content production by 300% and engagement by 45%.", "cs": "CMS nové generace s tvorbou a optimalizací obsahu poháněnou AI. Funkce zahrnují automatizované generování obsahu pomocí GPT-4, návrhy optimalizace SEO, rozpoznávání a označování obrázků, analýzu sentimentu, automatizaci A/B testování a personalizovaná doporučení obsahu. Vytvořeno s headless architekturou podporující více frontendů (web, mobil, IoT). Zahrnuje vizuální page builder, správu verzí a multi-tenant podporu. Zvýšení produkce obsahu o 300 % a zapojení o 45 %.", "de": "CMS der nächsten Generation mit KI-gestützter Content-Erstellung und -Optimierung. Zu den Funktionen gehören automatisierte Content-Generierung mit GPT-4, SEO-Optimierungsvorschläge, Bilderkennung und -Tagging, Sentiment-Analyse, A/B-Test-Automatisierung und personalisierte Content-Empfehlungen. Erstellt mit Headless-Architektur, die mehrere Frontends unterstützt (Web, Mobile, IoT). Enthält visuellen Page-Builder, Versionskontrolle und Multi-Tenant-Unterstützung. Steigerung der Content-Produktion um 300% und des Engagements um 45%."}'::jsonb,
  '{"en": "Headless CMS with GPT-4 content generation and SEO optimization", "cs": "Headless CMS s generováním obsahu GPT-4 a SEO optimalizací", "de": "Headless CMS mit GPT-4 Content-Generierung und SEO-Optimierung"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Next.js", "TypeScript", "OpenAI GPT-4", "PostgreSQL", "Elasticsearch", "Redis", "GraphQL", "React", "TensorFlow"]'::jsonb,
  'active',
  7,
  true,
  true
),

-- Project 8: Blockchain Supply Chain Tracker
(
  '{"en": "Blockchain Supply Chain Tracker", "cs": "Blockchain sledování dodavatelského řetězce", "de": "Blockchain-Lieferketten-Tracker"}'::jsonb,
  '{"en": "Decentralized supply chain tracking system built on Ethereum blockchain. Provides end-to-end visibility of products from manufacturer to consumer. Features include smart contracts for automated verification, QR code scanning for product authentication, real-time location tracking, temperature monitoring for perishables, and immutable audit trails. Integrates with IoT sensors and ERP systems. Reduced counterfeit incidents by 95% and improved delivery accuracy by 40%.", "cs": "Decentralizovaný systém sledování dodavatelského řetězce postavený na Ethereum blockchainu. Poskytuje end-to-end viditelnost produktů od výrobce ke spotřebiteli. Funkce zahrnují smart kontrakty pro automatizované ověřování, skenování QR kódů pro autentizaci produktů, sledování polohy v reálném čase, monitorování teploty pro zboží podléhající zkáze a neměnné auditní záznamy. Integruje se s IoT senzory a ERP systémy. Snížení incidentů s paděláním o 95 % a zlepšení přesnosti dodávek o 40 %.", "de": "Dezentrales Lieferketten-Tracking-System auf Ethereum-Blockchain. Bietet End-to-End-Sichtbarkeit von Produkten vom Hersteller zum Verbraucher. Zu den Funktionen gehören Smart Contracts für automatisierte Verifizierung, QR-Code-Scannen zur Produktauthentifizierung, Echtzeit-Standortverfolgung, Temperaturüberwachung für verderbliche Waren und unveränderliche Audit-Trails. Integriert mit IoT-Sensoren und ERP-Systemen. Reduzierung von Fälschungsvorfällen um 95% und Verbesserung der Liefergenauigkeit um 40%."}'::jsonb,
  '{"en": "Ethereum-based supply chain with smart contracts and IoT integration", "cs": "Dodavatelský řetězec založený na Ethereum se smart kontrakty a IoT integrací", "de": "Ethereum-basierte Lieferkette mit Smart Contracts und IoT-Integration"}'::jsonb,
  '/placeholder-project-fredon.png',
  NULL,
  NULL,
  '["Ethereum", "Solidity", "Web3.js", "Node.js", "React", "PostgreSQL", "IPFS", "IoT", "MQTT"]'::jsonb,
  'completed',
  8,
  false,
  true
)

ON CONFLICT (display_order) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  image_url = EXCLUDED.image_url,
  github_link = EXCLUDED.github_link,
  live_demo_link = EXCLUDED.live_demo_link,
  technologies = EXCLUDED.technologies,
  status = EXCLUDED.status,
  featured = EXCLUDED.featured,
  visible = EXCLUDED.visible,
  updated_at = NOW();

-- Verify the inserted data
SELECT 
  display_order,
  title->>'en' as title_en,
  status,
  featured,
  visible,
  array_length(technologies::text[]::jsonb, 1) as tech_count
FROM projects
ORDER BY display_order;
