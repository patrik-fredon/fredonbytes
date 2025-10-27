# FredonBytes Deployment Checklist & Runbook

## Pre-Deployment Verification

### 1. Environment Variables Setup

#### Required Variables (Production)
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# SMTP Email (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_REJECT_UNAUTHORIZED=true
ADMIN_EMAIL=info@fredonbytes.cloud

# Site
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud

# Optional: Analytics
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Environment Variable Checklist
- [ ] All SUPABASE_* variables configured in Vercel
- [ ] All SMTP_* variables configured (use Gmail App Password, not regular password)
- [ ] ADMIN_EMAIL set for contact notifications
- [ ] NEXT_PUBLIC_SITE_URL matches production domain
- [ ] All variables marked as "Production" scope in Vercel

### 2. Database Migrations

#### Run migrations in order:
```bash
# Connect to Supabase (via CLI or psql)
supabase db remote set <PROJECT_REF>

# Apply migrations
supabase db push

# Or manually via psql:
psql $DATABASE_URL -f supabase/migrations/01_fresh_unified_schema.sql
psql $DATABASE_URL -f supabase/migrations/02_fix_cookie_consents_and_rating.sql
psql $DATABASE_URL -f supabase/migrations/03_add_email_newsletter_to_sessions.sql
psql $DATABASE_URL -f supabase/migrations/04_add_pricing_system.sql
psql $DATABASE_URL -f supabase/migrations/05_add_projects_system.sql
psql $DATABASE_URL -f supabase/migrations/06_enhance_contact_submissions.sql
```

#### Migration Verification Checklist
- [ ] All 6 migrations applied successfully
- [ ] No migration errors in Supabase logs
- [ ] Tables exist: `contact_submissions`, `projects`, `pricing_tiers`, `pricing_items`, `newsletter_subscribers`
- [ ] Indexes created successfully
- [ ] RLS policies active

#### Verify tables:
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 3. Build Test

```bash
# Local build test
npm run build

# Check for:
# - No TypeScript errors
# - No ESLint errors
# - All pages build successfully
# - Bundle size warnings (if any)
```

#### Build Checklist
- [ ] `npm run build` completes without errors
- [ ] All routes generate static/dynamic pages correctly
- [ ] Bundle analyzer shows reasonable sizes (if enabled with `ANALYZE=true npm run build`)
- [ ] No deprecated API warnings

### 4. Functional Testing

#### Core Features to Test (Manual or Automated)
- [ ] Homepage loads (Hero, About, Services, Pricing sections visible)
- [ ] Navigation works (desktop + mobile hamburger)
- [ ] Language switcher (CS, EN, DE)
- [ ] Projects page loads from DB
- [ ] Pricing page loads from DB
- [ ] About page shows team section
- [ ] Contact form: submit, DB insert, email send (customer + admin)
- [ ] Cookie consent banner appears and persists
- [ ] Forms: validation, CSRF protection, rate limiting

#### Browser Compatibility
Test on:
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome (Android)
- [ ] Mobile Safari (iOS)

### 5. Performance Check

Run Lighthouse audit:
```bash
# In dev mode or on staging URL
npx lighthouse https://your-staging-url.vercel.app --view
```

#### Performance Targets
- [ ] Performance score >85
- [ ] Accessibility score >90
- [ ] Best Practices score >90
- [ ] SEO score >90
- [ ] LCP <2.5s
- [ ] FID <100ms
- [ ] CLS <0.1

### 6. Security Audit

- [ ] CSP headers configured (`next.config.ts`)
- [ ] CSRF protection active (middleware)
- [ ] Rate limiting functional (10 req/min per IP)
- [ ] Sensitive data (SMTP passwords, API keys) not in repo
- [ ] RLS policies enabled on all tables
- [ ] API routes require CSRF for mutations
- [ ] CORS restricted to production domain

## Deployment Steps

### Option A: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Via Vercel Dashboard or CLI
   vercel login
   vercel link
   ```

2. **Configure Project Settings**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
   - Node Version: 20.x

3. **Set Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Mark sensitive vars as "Secret"

4. **Deploy**
   ```bash
   vercel --prod
   ```

5. **Post-Deploy Verification**
   - [ ] Production URL accessible
   - [ ] All pages load
   - [ ] Contact form sends emails
   - [ ] DB queries work
   - [ ] SSL certificate active
   - [ ] Custom domain configured (if applicable)

### Option B: Docker + Self-Hosted

```bash
# Build image
docker build -t fredonbytes:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e SMTP_HOST=... \
  --env-file .env.production \
  fredonbytes:latest
```

## Post-Deployment

### 1. Cache Invalidation
- Clear Vercel edge cache: `vercel redeploy --prod`
- Clear browser cache (or use cache-busting URLs)

### 2. DNS & SSL
- [ ] Custom domain DNS configured (A/CNAME records)
- [ ] SSL certificate active and auto-renewing
- [ ] Redirects: www → non-www (or vice versa)

### 3. Monitoring Setup
- [ ] Configure Vercel Analytics (built-in)
- [ ] Set up error tracking (Sentry, if configured)
- [ ] Enable email delivery monitoring (SMTP provider dashboard)
- [ ] Create uptime monitor (UptimeRobot, Pingdom, etc.)

### 4. Content Population
- [ ] Seed projects table (via Supabase UI or SQL)
- [ ] Verify pricing tiers/items populated
- [ ] Test contact form end-to-end

## Rollback Plan

If deployment fails:

1. **Immediate Rollback (Vercel)**
   ```bash
   # Redeploy previous successful deployment
   vercel rollback
   ```

2. **Database Rollback**
   ```sql
   -- Revert last migration (if needed)
   -- Create rollback script for each migration
   DROP TABLE IF EXISTS new_table_name CASCADE;
   ```

3. **Environment Variable Reversion**
   - Restore previous values via Vercel dashboard
   - Redeploy with `vercel --prod`

## Troubleshooting

### Common Issues

**Build Fails**
- Check TypeScript/ESLint errors: `npm run build`
- Verify all imports resolve
- Check Node version (should be 20.x)

**Database Connection Fails**
- Verify `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- Check Supabase project status (not paused)
- Test connection: `curl https://your-project.supabase.co/rest/v1/`

**Emails Not Sending**
- Verify SMTP credentials (use App Password for Gmail)
- Check SMTP_HOST and SMTP_PORT
- Test locally: `node scripts/test-email.js` (if created)
- Review Vercel function logs for errors

**Rate Limit Issues**
- Adjust `MAX_REQUESTS_PER_WINDOW` in `middleware.ts`
- Clear rate limit: restart server or wait 1 minute

**API Routes 403 (CSRF)**
- Ensure client sends `x-csrf-token` header
- Verify cookie `_csrf_token` is set
- Check middleware exemptions for public endpoints

## Maintenance

### Regular Tasks
- **Weekly**: Check Vercel logs for errors
- **Monthly**: Review DB size and performance
- **Quarterly**: Update dependencies (`npm update`)
- **Annually**: Renew SSL certificates (auto with Vercel)

### Backups
- Supabase: daily auto-backups (check project settings)
- Manual backup: `pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql`

## Support Contacts
- **Hosting**: Vercel Support (support@vercel.com)
- **Database**: Supabase Support (support@supabase.io)
- **SMTP**: Provider support (e.g., Gmail, SendGrid)

---

**Created**: 2025-10-27  
**Last Updated**: 2025-10-27  
**Version**: 1.0
