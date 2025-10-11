# Deployment Checklist

This document provides a comprehensive checklist for deploying the FredonBytes application, including the Customer Satisfaction Form feature, to production.

## Table of Contents

- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Environment Setup](#environment-setup)
- [Database Configuration](#database-configuration)
- [Email Service Configuration](#email-service-configuration)
- [Build and Test](#build-and-test)
- [Vercel Deployment](#vercel-deployment)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedure](#rollback-procedure)
- [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Pre-Deployment Checklist

### Code Quality

- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] All tests passing (if applicable)
- [ ] Code reviewed and approved
- [ ] No console.log or debug statements in production code
- [ ] All TODO comments addressed or documented

### Documentation

- [ ] README.md updated with latest features
- [ ] CHANGELOG.md updated with version information
- [ ] API documentation complete and accurate
- [ ] Environment variables documented in .env.example
- [ ] Setup guides reviewed and tested

### Security

- [ ] No sensitive data in code or version control
- [ ] Environment variables properly configured
- [ ] API keys rotated if compromised
- [ ] CORS settings configured correctly
- [ ] Rate limiting implemented and tested
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified (using Supabase parameterized queries)
- [ ] XSS prevention verified (React escaping + sanitization)

### Performance

- [ ] Bundle size optimized (`npm run build:analyze`)
- [ ] Images optimized (WebP/AVIF formats)
- [ ] Lighthouse score 90+ on all pages
- [ ] Core Web Vitals meet targets
- [ ] Database queries optimized with indexes
- [ ] Caching strategy implemented

---

## Environment Setup

### Required Environment Variables

Create a `.env.production` file or configure in Vercel dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Resend Email Configuration
RESEND_API_KEY=re_your_production_api_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Environment Variable Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` - Production Supabase project URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Production anon key (NOT service key)
- [ ] `RESEND_API_KEY` - Production Resend API key
- [ ] `NEXT_PUBLIC_SITE_URL` - Production domain URL
- [ ] All variables added to Vercel project settings
- [ ] No development/staging keys in production
- [ ] Service role key kept secure (never exposed to client)

---

## Database Configuration

### Supabase Production Setup

#### 1. Create Production Project

- [ ] Create new Supabase project for production
- [ ] Choose appropriate region (closest to users)
- [ ] Select appropriate pricing tier
- [ ] Enable database backups
- [ ] Configure connection pooling

#### 2. Run Database Migrations

- [ ] Open Supabase SQL Editor
- [ ] Execute `docs/database-schema.sql`
- [ ] Verify all tables created successfully
- [ ] Verify indexes created
- [ ] Verify RLS policies enabled

**Verification Query:**
```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('questions', 'question_options', 'form_sessions', 'form_responses');

-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies exist
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

#### 3. Seed Production Data

- [ ] Review `scripts/seed-form-questions.sql`
- [ ] Customize questions for production use
- [ ] Execute seed script in production database
- [ ] Verify questions loaded correctly

**Verification Query:**
```sql
SELECT COUNT(*) as question_count FROM questions;
SELECT COUNT(*) as option_count FROM question_options;
```

#### 4. Database Security

- [ ] RLS policies tested and working
- [ ] Service role key secured (not in client code)
- [ ] Anon key permissions verified (read-only where appropriate)
- [ ] Database backups configured
- [ ] Point-in-time recovery enabled

---

## Email Service Configuration

### Resend Production Setup

#### 1. Domain Verification

- [ ] Add production domain to Resend
- [ ] Configure DNS records (SPF, DKIM, DMARC)
- [ ] Verify domain ownership
- [ ] Test email sending from domain

**DNS Records to Add:**
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all

Type: TXT
Name: resend._domainkey
Value: [provided by Resend]

Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:dmarc@fredonbytes.cloud
```

#### 2. Email Configuration

- [ ] Update sender email in `/src/app/api/form/submit/route.ts`
- [ ] Update recipient email for form notifications
- [ ] Test email delivery to admin inbox
- [ ] Check spam folder and whitelist if needed
- [ ] Configure email templates for production

#### 3. Email Testing

- [ ] Send test contact form submission
- [ ] Send test survey form submission
- [ ] Verify emails arrive within 1 minute
- [ ] Check email formatting in multiple clients
- [ ] Verify links in emails work correctly

---

## Build and Test

### Local Production Build

```bash
# Clean previous builds
npm run clean

# Run full validation
npm run pre-deploy

# Build for production
npm run build

# Test production build locally
npm run start
```

### Build Checklist

- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Bundle size acceptable (check output)
- [ ] All pages render correctly
- [ ] All API routes functional
- [ ] Forms submit successfully
- [ ] Email notifications working

### Manual Testing

#### Homepage Testing
- [ ] All sections load correctly
- [ ] Animations work smoothly
- [ ] Contact form submits successfully
- [ ] Links navigate correctly
- [ ] Mobile responsive design works

#### Form Testing
- [ ] Access `/form` redirects to `/form/[session_id]`
- [ ] Welcome screen displays
- [ ] All question types render correctly
- [ ] Navigation (Previous/Next) works
- [ ] Validation shows for required questions
- [ ] Answers persist in localStorage
- [ ] Form submits successfully
- [ ] Thank you screen displays
- [ ] Auto-redirect to homepage works
- [ ] Email notification received

#### Cross-Browser Testing
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

#### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Color contrast meets WCAG AA
- [ ] Forms accessible

---

## Vercel Deployment

### Initial Setup

#### 1. Connect Repository

- [ ] Log in to Vercel dashboard
- [ ] Click "New Project"
- [ ] Import Git repository
- [ ] Select main/production branch

#### 2. Configure Project

- [ ] Set framework preset to "Next.js"
- [ ] Set root directory (if needed)
- [ ] Configure build settings:
  - Build Command: `npm run build`
  - Output Directory: `.next`
  - Install Command: `npm install`

#### 3. Environment Variables

- [ ] Add all production environment variables
- [ ] Verify variable names match exactly
- [ ] Test variable access in preview deployment
- [ ] Mark sensitive variables as encrypted

#### 4. Domain Configuration

- [ ] Add custom domain `fredonbytes.cloud`
- [ ] Configure DNS records:
  ```
  Type: A
  Name: @
  Value: 76.76.21.21
  
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com
  ```
- [ ] Wait for DNS propagation (up to 48 hours)
- [ ] Verify SSL certificate issued
- [ ] Test HTTPS access

### Deployment Process

```bash
# Option 1: Deploy via Git push
git push origin main

# Option 2: Deploy via Vercel CLI
npm i -g vercel
vercel --prod
```

### Deployment Checklist

- [ ] Deployment triggered successfully
- [ ] Build logs show no errors
- [ ] Deployment completes successfully
- [ ] Preview URL accessible
- [ ] Production URL accessible
- [ ] SSL certificate active
- [ ] All environment variables loaded

---

## Post-Deployment Verification

### Functional Testing

#### Homepage
- [ ] Visit https://fredonbytes.cloud
- [ ] Verify all sections load
- [ ] Test contact form submission
- [ ] Check email notification received

#### Customer Satisfaction Form
- [ ] Visit https://fredonbytes.cloud/form
- [ ] Verify redirect to session URL
- [ ] Complete full form flow
- [ ] Verify submission success
- [ ] Check admin email received
- [ ] Verify data in Supabase

#### API Endpoints
- [ ] Test GET /api/form/questions
- [ ] Test POST /api/form/submit
- [ ] Test POST /api/contact
- [ ] Verify error handling
- [ ] Check rate limiting

### Performance Testing

- [ ] Run Lighthouse audit (target: 90+ all metrics)
- [ ] Check Core Web Vitals in Search Console
- [ ] Test page load times from different locations
- [ ] Verify images load optimally
- [ ] Check bundle sizes acceptable

### Security Testing

- [ ] Verify HTTPS enforced
- [ ] Test CORS configuration
- [ ] Verify rate limiting active
- [ ] Test input validation
- [ ] Check for exposed secrets
- [ ] Verify RLS policies working

### Monitoring Setup

- [ ] Configure Vercel Analytics
- [ ] Set up error tracking (optional: Sentry)
- [ ] Configure uptime monitoring
- [ ] Set up database monitoring in Supabase
- [ ] Configure email delivery monitoring in Resend

---

## Rollback Procedure

### Immediate Rollback (Vercel)

If critical issues are discovered:

1. **Via Vercel Dashboard:**
   - Go to Deployments
   - Find last working deployment
   - Click "..." menu → "Promote to Production"

2. **Via Vercel CLI:**
   ```bash
   vercel rollback
   ```

### Database Rollback

If database changes need to be reverted:

1. **Restore from Backup:**
   - Go to Supabase Dashboard → Database → Backups
   - Select backup point before deployment
   - Click "Restore"

2. **Manual Reversion:**
   - Write SQL to undo schema changes
   - Test in staging first
   - Execute in production

### Rollback Checklist

- [ ] Identify issue and severity
- [ ] Notify team of rollback
- [ ] Execute rollback procedure
- [ ] Verify rollback successful
- [ ] Test critical functionality
- [ ] Document issue for post-mortem
- [ ] Plan fix and redeployment

---

## Monitoring and Maintenance

### Daily Monitoring

- [ ] Check Vercel deployment status
- [ ] Review error logs
- [ ] Monitor form submission rates
- [ ] Check email delivery rates
- [ ] Review database performance

### Weekly Monitoring

- [ ] Review Lighthouse scores
- [ ] Check Core Web Vitals trends
- [ ] Analyze form completion rates
- [ ] Review user feedback
- [ ] Check for security updates

### Monthly Maintenance

- [ ] Update dependencies (`npm update`)
- [ ] Review and rotate API keys
- [ ] Analyze database growth
- [ ] Review and optimize queries
- [ ] Update documentation
- [ ] Review and update content

### Monitoring Tools

**Vercel Dashboard:**
- Deployment status
- Build logs
- Analytics
- Function logs

**Supabase Dashboard:**
- Database metrics
- Query performance
- Storage usage
- API logs

**Resend Dashboard:**
- Email delivery rates
- Bounce rates
- Spam reports
- API usage

### Alert Configuration

Set up alerts for:
- [ ] Deployment failures
- [ ] High error rates (>5%)
- [ ] Slow response times (>3s)
- [ ] Database connection issues
- [ ] Email delivery failures
- [ ] High form abandonment rates

---

## Troubleshooting

### Common Issues

#### Build Failures

**Symptom:** Deployment fails during build

**Solutions:**
1. Check build logs in Vercel
2. Verify all dependencies installed
3. Run `npm run build` locally
4. Check for TypeScript errors
5. Verify environment variables set

#### Form Not Loading

**Symptom:** Form shows loading state indefinitely

**Solutions:**
1. Verify Supabase credentials correct
2. Check RLS policies enabled
3. Verify questions exist in database
4. Check browser console for errors
5. Test API endpoint directly

#### Email Not Sending

**Symptom:** Form submits but no email received

**Solutions:**
1. Verify Resend API key correct
2. Check domain verification status
3. Review Resend dashboard logs
4. Check spam folder
5. Verify sender email matches verified domain

#### Database Connection Issues

**Symptom:** API returns database errors

**Solutions:**
1. Check Supabase project status
2. Verify connection string correct
3. Check connection pooling settings
4. Review database logs
5. Verify RLS policies not blocking

---

## Support Contacts

### Internal Team
- **DevOps:** [devops contact]
- **Backend:** [backend contact]
- **Frontend:** [frontend contact]

### External Services
- **Vercel Support:** https://vercel.com/support
- **Supabase Support:** https://supabase.com/support
- **Resend Support:** https://resend.com/support

---

## Deployment History

### Version 1.0.0 - [Date]

**Features:**
- Initial production deployment
- Homepage with all sections
- Link tree functionality
- Customer satisfaction form
- Contact form
- Legal pages

**Database:**
- Initial schema deployment
- Sample questions seeded

**Configuration:**
- Production environment variables
- Domain configuration
- Email service setup

---

## Next Steps After Deployment

1. **Monitor for 24 hours:**
   - Watch error rates
   - Check form submissions
   - Verify email delivery

2. **Gather feedback:**
   - Test with real users
   - Collect form completion data
   - Review user experience

3. **Optimize:**
   - Analyze performance metrics
   - Optimize slow queries
   - Improve based on feedback

4. **Plan next release:**
   - Document lessons learned
   - Plan improvements
   - Schedule next deployment

---

**Last Updated:** [Date]

**Deployment Team:** FredonBytes Development Team

**Next Review:** [Date]
