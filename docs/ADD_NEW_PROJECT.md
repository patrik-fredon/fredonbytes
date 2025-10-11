# Quick Guide: Adding a New Project to the Gallery

## Prerequisites

- Access to Supabase database
- Project image (optimized, 1200x800px, < 500KB)
- Project details in all three languages (EN, CS, DE)

## Step-by-Step Process

### 1. Prepare Project Information

Create a document with the following information in **English, Czech, and German**:

```
Title: [Project Name]
Short Description: [1-2 sentences]
Full Description: [2-3 paragraphs with key features and achievements]
Technologies: [List of technologies used]
Status: [active | completed | archived]
GitHub Link: [URL or NULL]
Live Demo Link: [URL or NULL]
Featured: [true | false]
```

### 2. Prepare and Upload Image

**Option A: Local Storage (Simple)**
```bash
# Optimize image
cwebp -q 85 -resize 1200 800 input.png -o project-{slug}.webp

# Copy to public folder
cp project-{slug}.webp public/projects/

# Commit to repository
git add public/projects/project-{slug}.webp
git commit -m "Add image for {project-name}"
```

**Option B: Supabase Storage (Recommended)**
```bash
# Upload via Supabase CLI
supabase storage upload project-images project-{slug}.webp

# Or use Supabase Dashboard > Storage > project-images > Upload
```

### 3. Get Next Display Order

```sql
-- Find the highest display_order
SELECT MAX(display_order) + 1 as next_order FROM projects;
```

### 4. Insert Project into Database

```sql
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
) VALUES (
  -- Title (multilingual)
  '{
    "en": "Your Project Title",
    "cs": "Název vašeho projektu",
    "de": "Ihr Projekttitel"
  }'::jsonb,
  
  -- Full Description (multilingual)
  '{
    "en": "Detailed description in English with features and achievements...",
    "cs": "Podrobný popis v češtině s funkcemi a úspěchy...",
    "de": "Detaillierte Beschreibung auf Deutsch mit Funktionen und Erfolgen..."
  }'::jsonb,
  
  -- Short Description (multilingual)
  '{
    "en": "Brief one-liner in English",
    "cs": "Stručný popis v češtině",
    "de": "Kurze Beschreibung auf Deutsch"
  }'::jsonb,
  
  -- Image URL
  '/projects/project-{slug}.webp',
  -- OR for Supabase Storage:
  -- 'https://{project-ref}.supabase.co/storage/v1/object/public/project-images/project-{slug}.webp',
  
  -- GitHub Link (optional)
  'https://github.com/username/repo',
  -- OR NULL if not available
  
  -- Live Demo Link (optional)
  'https://demo.example.com',
  -- OR NULL if not available
  
  -- Technologies (array)
  '["Next.js", "TypeScript", "React", "Tailwind CSS"]'::jsonb,
  
  -- Status
  'active',  -- or 'completed' or 'archived'
  
  -- Display Order (use the number from step 3)
  9,
  
  -- Featured
  false,  -- or true for featured projects
  
  -- Visible
  true    -- or false to hide from public
);
```

### 5. Verify the Project

```sql
-- Check the newly added project
SELECT 
  display_order,
  title->>'en' as title,
  status,
  featured,
  visible,
  image_url
FROM projects
WHERE display_order = 9;  -- Use your display_order
```

### 6. Test in Browser

```bash
# Start development server
npm run dev

# Navigate to projects page
open http://localhost:3000/projects

# Verify:
# - Project appears in correct order
# - Image loads correctly
# - All translations work
# - Links work (GitHub, Live Demo)
# - Hover effects work
# - Responsive design works
```

## Example: Complete Project Addition

Here's a complete example for adding a "Customer Portal" project:

```sql
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
) VALUES (
  '{
    "en": "Customer Self-Service Portal",
    "cs": "Samoobslužný zákaznický portál",
    "de": "Kunden-Self-Service-Portal"
  }'::jsonb,
  '{
    "en": "Modern customer portal enabling self-service account management, billing, support tickets, and knowledge base access. Features include SSO integration, real-time chat support, automated ticket routing, and comprehensive analytics dashboard. Built with Next.js and integrated with Salesforce CRM. Reduced support tickets by 45% and improved customer satisfaction by 30%.",
    "cs": "Moderní zákaznický portál umožňující samoobslužnou správu účtu, fakturaci, podporu tiketů a přístup ke znalostní bázi. Funkce zahrnují integraci SSO, podporu chatu v reálném čase, automatizované směrování tiketů a komplexní analytický dashboard. Vytvořeno s Next.js a integrováno s Salesforce CRM. Snížení podporních tiketů o 45 % a zlepšení spokojenosti zákazníků o 30 %.",
    "de": "Modernes Kundenportal für Self-Service-Kontoverwaltung, Abrechnung, Support-Tickets und Wissensdatenbank-Zugriff. Zu den Funktionen gehören SSO-Integration, Echtzeit-Chat-Support, automatisiertes Ticket-Routing und umfassendes Analytics-Dashboard. Erstellt mit Next.js und integriert mit Salesforce CRM. Reduzierung der Support-Tickets um 45% und Verbesserung der Kundenzufriedenheit um 30%."
  }'::jsonb,
  '{
    "en": "Next.js customer portal with SSO and Salesforce integration",
    "cs": "Zákaznický portál Next.js s SSO a integrací Salesforce",
    "de": "Next.js Kundenportal mit SSO und Salesforce-Integration"
  }'::jsonb,
  '/projects/project-customer-portal.webp',
  'https://github.com/company/customer-portal',
  'https://portal.example.com',
  '["Next.js", "TypeScript", "React", "Tailwind CSS", "Salesforce", "Auth0", "PostgreSQL", "Redis"]'::jsonb,
  'active',
  9,
  true,
  true
);
```

## Translation Tips

### English (EN)
- Use clear, professional language
- Focus on features and benefits
- Include metrics and achievements
- Use active voice

### Czech (CS)
- Maintain formal tone ("vy" form)
- Use technical terms in English when appropriate
- Ensure grammatical accuracy
- Consider Czech word order

### German (DE)
- Use formal address ("Sie" form)
- Capitalize nouns
- Use compound words appropriately
- Maintain technical accuracy

### Translation Tools
- [DeepL](https://www.deepl.com/) - High-quality translations
- [Google Translate](https://translate.google.com/) - Quick translations
- Native speaker review - Always recommended

## Common Issues and Solutions

### Issue: Display order conflict
```sql
-- Error: duplicate key value violates unique constraint "projects_display_order_key"

-- Solution: Update existing projects to make space
UPDATE projects 
SET display_order = display_order + 1 
WHERE display_order >= 9;

-- Then insert your project with display_order = 9
```

### Issue: Image not loading
```bash
# Check if file exists
ls -la public/projects/project-{slug}.webp

# Check file permissions
chmod 644 public/projects/project-{slug}.webp

# Verify Next.js can access it
curl http://localhost:3000/projects/project-{slug}.webp
```

### Issue: Translation not showing
```sql
-- Verify JSONB structure
SELECT title FROM projects WHERE id = '{project-id}';

-- Should return: {"en": "...", "cs": "...", "de": "..."}

-- Fix if needed
UPDATE projects
SET title = '{
  "en": "English Title",
  "cs": "Czech Title",
  "de": "German Title"
}'::jsonb
WHERE id = '{project-id}';
```

## Bulk Import

For importing multiple projects at once, use the seed script:

```bash
# Edit scripts/seed-projects.sql with your projects
# Then run:
psql -h <host> -U <user> -d <database> -f scripts/seed-projects.sql

# Or via Supabase Dashboard:
# SQL Editor > New Query > Paste script > Run
```

## Reordering Projects

To change the display order:

```sql
-- Move project to position 3
-- First, make space
UPDATE projects 
SET display_order = display_order + 1 
WHERE display_order >= 3;

-- Then update your project
UPDATE projects 
SET display_order = 3 
WHERE id = '{project-id}';
```

## Hiding/Archiving Projects

```sql
-- Hide from public view (but keep in database)
UPDATE projects 
SET visible = false 
WHERE id = '{project-id}';

-- Archive project (change status)
UPDATE projects 
SET status = 'archived' 
WHERE id = '{project-id}';

-- Delete project (permanent)
DELETE FROM projects 
WHERE id = '{project-id}';
```

## Next Steps

After adding your project:

1. ✅ Test on all devices (mobile, tablet, desktop)
2. ✅ Verify all three languages display correctly
3. ✅ Check image optimization with Lighthouse
4. ✅ Test links (GitHub, Live Demo)
5. ✅ Verify hover effects and animations
6. ✅ Check accessibility with screen reader
7. ✅ Deploy to production
8. ✅ Monitor for any issues

## Need Help?

- Check [PROJECT_IMAGES_GUIDE.md](./PROJECT_IMAGES_GUIDE.md) for image management
- Review [API.md](./API.md) for API endpoint details
- See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues
- Contact the development team for assistance
