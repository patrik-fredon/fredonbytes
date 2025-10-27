-- ============================================================================
-- PRICING SYSTEM MIGRATION
-- ============================================================================
-- Created: 2025-10-27
-- Purpose: Add pricing system tables with multilingual support for FredonBytes
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE PRICING TABLES
-- ============================================================================

-- Pricing Tiers Table
CREATE TABLE pricing_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL, -- {en: "Professional", cs: "Profesionální", de: "Professionell"}
  description JSONB NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('starter', 'professional', 'enterprise')),
  price_czk INTEGER, -- Price in CZK (null for custom pricing)
  price_eur INTEGER, -- Price in EUR (null for custom pricing)
  features JSONB NOT NULL, -- Array of feature keys for translation
  popular BOOLEAN DEFAULT false,
  cta_text JSONB NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing Items Table (for calculator)
CREATE TABLE pricing_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name JSONB NOT NULL,
  description JSONB NOT NULL,
  base_price_czk INTEGER NOT NULL,
  base_price_eur INTEGER NOT NULL,
  category VARCHAR(50) NOT NULL,
  features JSONB NOT NULL,
  icon VARCHAR(50) NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_pricing_tiers_type ON pricing_tiers(type);
CREATE INDEX idx_pricing_tiers_active ON pricing_tiers(active);
CREATE INDEX idx_pricing_tiers_popular ON pricing_tiers(popular);

CREATE INDEX idx_pricing_items_category ON pricing_items(category);
CREATE INDEX idx_pricing_items_active ON pricing_items(active);

-- ============================================================================
-- STEP 3: CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_pricing_tiers_updated_at 
  BEFORE UPDATE ON pricing_tiers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_items_updated_at 
  BEFORE UPDATE ON pricing_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- STEP 4: SEED DATA - PRICING TIERS
-- ============================================================================

INSERT INTO pricing_tiers (id, name, description, type, price_czk, price_eur, features, popular, cta_text, active) VALUES
-- Starter Tier
(
  '33333333-1111-1111-1111-111111111111',
  '{"en": "Starter", "cs": "Začátečník", "de": "Starter"}',
  '{"en": "Perfect for small projects and startups", "cs": "Ideální pro malé projekty a startupy", "de": "Perfekt für kleine Projekte und Startups"}',
  'starter',
  25000, -- 25,000 CZK
  1000,  -- 1,000 EUR
  '["basic_web_development", "responsive_design", "basic_seo", "email_support", "1_month_support"]',
  false,
  '{"en": "Get Started", "cs": "Začít", "de": "Loslegen"}',
  true
),
-- Professional Tier
(
  '33333333-2222-2222-2222-222222222222',
  '{"en": "Professional", "cs": "Profesionální", "de": "Professionell"}',
  '{"en": "Comprehensive solution for growing businesses", "cs": "Komplexní řešení pro rostoucí firmy", "de": "Umfassende Lösung für wachsende Unternehmen"}',
  'professional',
  75000, -- 75,000 CZK
  3000,  -- 3,000 EUR
  '["advanced_web_development", "custom_design", "advanced_seo", "database_integration", "api_development", "priority_support", "3_months_support"]',
  true,
  '{"en": "Choose Professional", "cs": "Vybrat Profesionální", "de": "Professional wählen"}',
  true
),
-- Enterprise Tier
(
  '33333333-3333-3333-3333-333333333333',
  '{"en": "Enterprise", "cs": "Podnikový", "de": "Unternehmen"}',
  '{"en": "Full-scale solution for large organizations", "cs": "Plnohodnotné řešení pro velké organizace", "de": "Vollständige Lösung für große Organisationen"}',
  'enterprise',
  NULL, -- Custom pricing
  NULL, -- Custom pricing
  '["full_stack_development", "custom_architecture", "advanced_integrations", "cloud_deployment", "security_audit", "dedicated_support", "12_months_support", "training_included"]',
  false,
  '{"en": "Contact Us", "cs": "Kontaktujte nás", "de": "Kontaktieren Sie uns"}',
  true
);

-- ============================================================================
-- STEP 5: SEED DATA - PRICING CALCULATOR ITEMS
-- ============================================================================

INSERT INTO pricing_items (id, name, description, base_price_czk, base_price_eur, category, features, icon, active) VALUES
-- Web Development Items
(
  '44444444-1111-1111-1111-111111111111',
  '{"en": "Landing Page", "cs": "Vstupní stránka", "de": "Landing Page"}',
  '{"en": "Single page website with modern design", "cs": "Jednostránkový web s moderním designem", "de": "Einseitige Website mit modernem Design"}',
  15000, -- 15,000 CZK
  600,   -- 600 EUR
  'web_development',
  '["responsive_design", "contact_form", "basic_seo"]',
  'globe',
  true
),
(
  '44444444-2222-2222-2222-222222222222',
  '{"en": "Business Website", "cs": "Firemní web", "de": "Unternehmenswebsite"}',
  '{"en": "Multi-page website with CMS integration", "cs": "Vícestránkový web s CMS integrací", "de": "Mehrseitige Website mit CMS-Integration"}',
  35000, -- 35,000 CZK
  1400,  -- 1,400 EUR
  'web_development',
  '["cms_integration", "multi_page", "advanced_seo", "contact_forms"]',
  'building',
  true
),
(
  '44444444-3333-3333-3333-333333333333',
  '{"en": "E-commerce Store", "cs": "E-shop", "de": "E-Commerce-Shop"}',
  '{"en": "Full online store with payment integration", "cs": "Kompletní online obchod s platební integrací", "de": "Vollständiger Online-Shop mit Zahlungsintegration"}',
  85000, -- 85,000 CZK
  3400,  -- 3,400 EUR
  'web_development',
  '["payment_integration", "product_catalog", "inventory_management", "order_processing"]',
  'shopping-cart',
  true
),
-- Mobile Development Items
(
  '44444444-4444-4444-4444-444444444444',
  '{"en": "Mobile App (iOS/Android)", "cs": "Mobilní aplikace (iOS/Android)", "de": "Mobile App (iOS/Android)"}',
  '{"en": "Cross-platform mobile application", "cs": "Multiplatformní mobilní aplikace", "de": "Plattformübergreifende mobile Anwendung"}',
  120000, -- 120,000 CZK
  4800,   -- 4,800 EUR
  'mobile_development',
  '["cross_platform", "native_performance", "app_store_deployment"]',
  'smartphone',
  true
),
-- Cloud & Infrastructure Items
(
  '44444444-5555-5555-5555-555555555555',
  '{"en": "Cloud Hosting Setup", "cs": "Nastavení cloudového hostingu", "de": "Cloud-Hosting-Setup"}',
  '{"en": "Professional cloud infrastructure setup", "cs": "Profesionální nastavení cloudové infrastruktury", "de": "Professionelle Cloud-Infrastruktur-Einrichtung"}',
  25000, -- 25,000 CZK
  1000,  -- 1,000 EUR
  'cloud_services',
  '["scalable_infrastructure", "security_setup", "monitoring", "backup_solution"]',
  'cloud',
  true
),
(
  '44444444-6666-6666-6666-666666666666',
  '{"en": "Database Design", "cs": "Návrh databáze", "de": "Datenbankdesign"}',
  '{"en": "Custom database architecture and optimization", "cs": "Vlastní architektura databáze a optimalizace", "de": "Benutzerdefinierte Datenbankarchitektur und -optimierung"}',
  40000, -- 40,000 CZK
  1600,  -- 1,600 EUR
  'database',
  '["custom_schema", "performance_optimization", "security_implementation"]',
  'database',
  true
),
-- Consulting & Support Items
(
  '44444444-7777-7777-7777-777777777777',
  '{"en": "Technical Consultation", "cs": "Technická konzultace", "de": "Technische Beratung"}',
  '{"en": "Expert technical advice and planning", "cs": "Odborné technické poradenství a plánování", "de": "Fachkundige technische Beratung und Planung"}',
  5000,  -- 5,000 CZK per hour
  200,   -- 200 EUR per hour
  'consulting',
  '["expert_advice", "project_planning", "technology_selection"]',
  'users',
  true
),
(
  '44444444-8888-8888-8888-888888888888',
  '{"en": "Ongoing Support", "cs": "Průběžná podpora", "de": "Laufender Support"}',
  '{"en": "Monthly maintenance and support package", "cs": "Měsíční balíček údržby a podpory", "de": "Monatliches Wartungs- und Support-Paket"}',
  8000,  -- 8,000 CZK per month
  320,   -- 320 EUR per month
  'support',
  '["bug_fixes", "security_updates", "performance_monitoring", "priority_support"]',
  'headphones',
  true
);

-- ============================================================================
-- STEP 6: ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on pricing tables
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_items ENABLE ROW LEVEL SECURITY;

-- Public read access to active pricing data
CREATE POLICY "Public read active pricing tiers" ON pricing_tiers FOR SELECT USING (active = true);
CREATE POLICY "Public read active pricing items" ON pricing_items FOR SELECT USING (active = true);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE pricing_tiers IS 'Pricing tiers with multilingual support for FredonBytes services';
COMMENT ON TABLE pricing_items IS 'Pricing calculator items with multilingual support';