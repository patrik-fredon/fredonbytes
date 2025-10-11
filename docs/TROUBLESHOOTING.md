# Troubleshooting Guide

This guide provides solutions to common issues you may encounter with the FredonBytes application, particularly the Customer Satisfaction Form feature.

## Table of Contents

- [Form Issues](#form-issues)
- [Database Issues](#database-issues)
- [Email Issues](#email-issues)
- [Build and Deployment Issues](#build-and-deployment-issues)
- [Performance Issues](#performance-issues)
- [Browser Compatibility Issues](#browser-compatibility-issues)
- [Development Environment Issues](#development-environment-issues)

---

## Form Issues

### Issue: Form Shows Loading State Indefinitely

**Symptoms:**
- Form page displays loading spinner continuously
- Questions never appear
- No error message shown

**Possible Causes:**
1. Supabase connection failure
2. Missing or incorrect environment variables
3. RLS policies blocking access
4. No questions in database

**Solutions:**

1. **Check Environment Variables:**
   ```bash
   # Verify variables are set
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   ```
   - Ensure variables are in `.env.local` for development
   - Verify variables in Vercel dashboard for production

2. **Test Supabase Connection:**
   ```bash
   # Test API endpoint directly
   curl http://localhost:3000/api/form/questions
   ```
   - Should return JSON with questions array
   - If error, check Supabase credentials

3. **Verify RLS Policies:**
   ```sql
   -- Check policies exist
   SELECT * FROM pg_policies WHERE tablename = 'questions';
   
   -- Test query as anon user
   SELECT * FROM questions;
   ```

4. **Check Questions Exist:**
   ```sql
   SELECT COUNT(*) FROM questions;
   ```
   - If 0, run seed script: `scripts/seed-form-questions.sql`

5. **Check Browser Console:**
   - Open DevTools → Console
   - Look for error messages
   - Check Network tab for failed requests

---

### Issue: Validation Errors Not Showing

**Symptoms:**
- Can skip required questions
- No error message when clicking Next
- Form submits with missing answers

**Possible Causes:**
1. Validation logic not executing
2. Required flag not set in database
3. JavaScript error preventing validation

**Solutions:**

1. **Verify Required Flag:**
   ```sql
   SELECT question_text, required FROM questions ORDER BY display_order;
   ```
   - Update if needed:
   ```sql
   UPDATE questions SET required = true WHERE id = 'question-uuid';
   ```

2. **Check Browser Console:**
   - Look for JavaScript errors
   - Verify validation function is called

3. **Test Validation Logic:**
   - Add console.log in validation function
   - Verify it's being called on Next click

4. **Clear Cache:**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run dev
   ```

---

### Issue: Answers Not Persisting in localStorage

**Symptoms:**
- Answers lost when page reloads
- Progress not saved
- No warning about localStorage

**Possible Causes:**
1. localStorage disabled in browser
2. Private/incognito mode
3. Storage quota exceeded
4. Browser extension blocking storage

**Solutions:**

1. **Check localStorage Availability:**
   ```javascript
   // In browser console
   try {
     localStorage.setItem('test', 'test');
     localStorage.removeItem('test');
     console.log('localStorage available');
   } catch (e) {
     console.error('localStorage not available:', e);
   }
   ```

2. **Check Storage Quota:**
   ```javascript
   // In browser console
   if (navigator.storage && navigator.storage.estimate) {
     navigator.storage.estimate().then(estimate => {
       console.log('Usage:', estimate.usage);
       console.log('Quota:', estimate.quota);
     });
   }
   ```

3. **Clear localStorage:**
   ```javascript
   // In browser console
   localStorage.clear();
   ```

4. **Test in Different Browser:**
   - Try Chrome, Firefox, Safari
   - Test in normal (non-incognito) mode

5. **Disable Browser Extensions:**
   - Privacy extensions may block storage
   - Test with extensions disabled

---

### Issue: Form Submission Fails

**Symptoms:**
- Error message on submission
- "Failed to submit form" displayed
- Data not saved to database

**Possible Causes:**
1. Network connection issue
2. Invalid session_id
3. Database write failure
4. RLS policy blocking insert

**Solutions:**

1. **Check Network Connection:**
   - Open DevTools → Network tab
   - Look for failed POST request to `/api/form/submit`
   - Check response status and body

2. **Verify Session ID:**
   ```javascript
   // In browser console
   console.log(window.location.pathname);
   // Should be /form/[valid-uuid]
   ```

3. **Test API Endpoint:**
   ```bash
   curl -X POST http://localhost:3000/api/form/submit \
     -H "Content-Type: application/json" \
     -d '{
       "session_id": "550e8400-e29b-41d4-a716-446655440000",
       "responses": [
         {
           "question_id": "660e8400-e29b-41d4-a716-446655440001",
           "answer_value": "Test answer"
         }
       ]
     }'
   ```

4. **Check RLS Policies:**
   ```sql
   -- Verify insert policies exist
   SELECT * FROM pg_policies 
   WHERE tablename IN ('form_sessions', 'form_responses')
   AND cmd = 'INSERT';
   ```

5. **Check Database Logs:**
   - Go to Supabase Dashboard → Logs → API
   - Look for error messages
   - Check for constraint violations

6. **Verify All Required Questions Answered:**
   - Check validation before submission
   - Ensure all required fields have values

---

### Issue: Thank You Screen Not Showing

**Symptoms:**
- Form submits successfully
- Stays on last question
- No redirect or confirmation

**Possible Causes:**
1. State not updating after submission
2. JavaScript error preventing render
3. Component not mounting

**Solutions:**

1. **Check Browser Console:**
   - Look for JavaScript errors
   - Verify submission success logged

2. **Check Network Response:**
   - DevTools → Network → POST /api/form/submit
   - Verify 200 status code
   - Check response body for success: true

3. **Clear Component State:**
   - Reload page
   - Clear localStorage
   - Try new session

4. **Check Component Code:**
   - Verify ThankYouScreen component exists
   - Check conditional rendering logic
   - Verify currentStep state updates

---

## Database Issues

### Issue: Cannot Connect to Supabase

**Symptoms:**
- "Failed to fetch questions" error
- Database queries timeout
- Connection refused errors

**Solutions:**

1. **Verify Supabase Project Status:**
   - Log in to Supabase Dashboard
   - Check project is not paused
   - Verify project is active

2. **Check Credentials:**
   ```bash
   # Verify URL format
   echo $NEXT_PUBLIC_SUPABASE_URL
   # Should be: https://xxxxx.supabase.co
   
   # Verify key format
   echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
   # Should be: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Test Connection:**
   ```bash
   # Test with curl
   curl https://your-project.supabase.co/rest/v1/questions \
     -H "apikey: your-anon-key" \
     -H "Authorization: Bearer your-anon-key"
   ```

4. **Check Network/Firewall:**
   - Verify no firewall blocking Supabase
   - Check VPN not interfering
   - Test from different network

5. **Restart Development Server:**
   ```bash
   # Kill and restart
   pkill -f "next dev"
   npm run dev
   ```

---

### Issue: RLS Policies Blocking Access

**Symptoms:**
- Empty results from queries
- "Row level security policy violation" errors
- Data exists but not returned

**Solutions:**

1. **Check RLS Enabled:**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE schemaname = 'public';
   ```

2. **Verify Policies Exist:**
   ```sql
   SELECT tablename, policyname, cmd, qual 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

3. **Test as Anon User:**
   ```sql
   -- In Supabase SQL Editor
   SET ROLE anon;
   SELECT * FROM questions;
   RESET ROLE;
   ```

4. **Recreate Policies:**
   ```sql
   -- Drop and recreate if needed
   DROP POLICY IF EXISTS "Public can read questions" ON questions;
   
   CREATE POLICY "Public can read questions"
   ON questions FOR SELECT
   TO anon
   USING (true);
   ```

5. **Check Service Role:**
   - Verify not using service_role key on client
   - Service role bypasses RLS (security risk)

---

### Issue: Database Migration Fails

**Symptoms:**
- Error executing schema SQL
- Tables not created
- Constraint violations

**Solutions:**

1. **Check Existing Tables:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. **Drop Existing Tables (if needed):**
   ```sql
   -- WARNING: This deletes all data
   DROP TABLE IF EXISTS form_responses CASCADE;
   DROP TABLE IF EXISTS form_sessions CASCADE;
   DROP TABLE IF EXISTS question_options CASCADE;
   DROP TABLE IF EXISTS questions CASCADE;
   ```

3. **Run Schema in Sections:**
   - Execute CREATE TABLE statements one at a time
   - Check for errors after each
   - Verify indexes created

4. **Check for Syntax Errors:**
   - Copy SQL to text editor
   - Check for missing semicolons
   - Verify PostgreSQL syntax

---

## Email Issues

### Issue: Admin Notification Not Received

**Symptoms:**
- Form submits successfully
- No email arrives
- No error shown to user

**Solutions:**

1. **Check Resend Dashboard:**
   - Log in to Resend
   - Go to Logs
   - Look for recent email attempts
   - Check delivery status

2. **Verify API Key:**
   ```bash
   echo $RESEND_API_KEY
   # Should start with: re_
   ```

3. **Check Sender Domain:**
   - Verify domain verified in Resend
   - Check DNS records configured
   - Verify sender email matches domain

4. **Check Spam Folder:**
   - Look in spam/junk folder
   - Whitelist sender address
   - Check email filters

5. **Test Email Sending:**
   ```bash
   # Test with curl
   curl -X POST https://api.resend.com/emails \
     -H "Authorization: Bearer $RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "from": "noreply@fredonbytes.cloud",
       "to": "info@fredonbytes.cloud",
       "subject": "Test Email",
       "html": "<p>Test</p>"
     }'
   ```

6. **Check Server Logs:**
   - Vercel: Functions → Logs
   - Look for email sending errors
   - Check for API key issues

---

### Issue: Email Formatting Issues

**Symptoms:**
- Email arrives but looks broken
- HTML not rendering
- Missing content

**Solutions:**

1. **Test Email Template:**
   - Send test email
   - Check in multiple email clients
   - Verify HTML structure

2. **Check Template Code:**
   - Review `src/app/lib/email-templates.ts`
   - Verify HTML is valid
   - Check for missing closing tags

3. **Test in Email Clients:**
   - Gmail
   - Outlook
   - Apple Mail
   - Mobile clients

4. **Use Email Testing Tool:**
   - Litmus or Email on Acid
   - Test rendering across clients

---

## Build and Deployment Issues

### Issue: Build Fails with TypeScript Errors

**Symptoms:**
- `npm run build` fails
- TypeScript compilation errors
- Type checking errors

**Solutions:**

1. **Run Type Check:**
   ```bash
   npm run type-check
   ```

2. **Check for Common Issues:**
   - Missing type definitions
   - Incorrect imports
   - Type mismatches

3. **Update Dependencies:**
   ```bash
   npm update
   npm install
   ```

4. **Clear Cache:**
   ```bash
   rm -rf .next
   rm -rf node_modules
   npm install
   npm run build
   ```

5. **Check TypeScript Version:**
   ```bash
   npx tsc --version
   ```

---

### Issue: Vercel Deployment Fails

**Symptoms:**
- Deployment fails in Vercel
- Build errors in Vercel logs
- Environment variables not working

**Solutions:**

1. **Check Build Logs:**
   - Go to Vercel Dashboard
   - Click on failed deployment
   - Review build logs

2. **Verify Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Verify all required variables set
   - Check for typos in variable names

3. **Test Build Locally:**
   ```bash
   npm run build
   npm run start
   ```

4. **Check Node Version:**
   - Verify Node version in `package.json`
   - Match local and Vercel versions

5. **Redeploy:**
   ```bash
   vercel --prod
   ```

---

## Performance Issues

### Issue: Slow Page Load Times

**Symptoms:**
- Pages take >3 seconds to load
- Poor Lighthouse scores
- Slow Time to Interactive

**Solutions:**

1. **Run Lighthouse Audit:**
   - Open DevTools → Lighthouse
   - Run audit
   - Review recommendations

2. **Check Bundle Size:**
   ```bash
   npm run build:analyze
   ```

3. **Optimize Images:**
   - Use Next.js Image component
   - Convert to WebP/AVIF
   - Implement lazy loading

4. **Check Database Queries:**
   - Review slow queries in Supabase
   - Add indexes if needed
   - Optimize query structure

5. **Enable Caching:**
   - Implement API response caching
   - Use CDN for static assets
   - Configure browser caching

---

### Issue: Animations Janky or Slow

**Symptoms:**
- Animations stutter
- Low frame rate
- Poor performance on mobile

**Solutions:**

1. **Check CPU Usage:**
   - Open DevTools → Performance
   - Record animation
   - Look for long tasks

2. **Optimize Animations:**
   - Use CSS transforms (not position)
   - Add `will-change` property
   - Reduce animation complexity

3. **Respect Reduced Motion:**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

4. **Test on Target Devices:**
   - Test on actual mobile devices
   - Use Chrome DevTools device emulation
   - Check on low-end devices

---

## Browser Compatibility Issues

### Issue: Form Not Working in Safari

**Symptoms:**
- Form works in Chrome but not Safari
- JavaScript errors in Safari
- Features not supported

**Solutions:**

1. **Check Browser Console:**
   - Open Safari DevTools
   - Look for errors
   - Check for unsupported features

2. **Test Polyfills:**
   - Verify polyfills loaded
   - Check for missing features

3. **Check localStorage:**
   - Safari has stricter localStorage rules
   - Test in normal (non-private) mode

4. **Update Safari:**
   - Ensure latest version
   - Check for known bugs

---

### Issue: Mobile Browser Issues

**Symptoms:**
- Form doesn't work on mobile
- Touch events not working
- Layout broken on mobile

**Solutions:**

1. **Test on Real Device:**
   - Don't rely only on emulation
   - Test on iOS and Android

2. **Check Viewport:**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1">
   ```

3. **Test Touch Events:**
   - Verify touch targets ≥44px
   - Check for hover-only interactions

4. **Check Mobile-Specific CSS:**
   - Review responsive breakpoints
   - Test in portrait and landscape

---

## Development Environment Issues

### Issue: Hot Reload Not Working

**Symptoms:**
- Changes not reflected
- Need to manually refresh
- Development server not updating

**Solutions:**

1. **Restart Dev Server:**
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

2. **Clear Cache:**
   ```bash
   rm -rf .next
   npm run dev
   ```

3. **Check File Watchers:**
   ```bash
   # Increase file watchers (Linux)
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

4. **Check for Syntax Errors:**
   - Fix any syntax errors
   - Check browser console

---

### Issue: Port Already in Use

**Symptoms:**
- "Port 3000 already in use" error
- Cannot start dev server

**Solutions:**

1. **Kill Process on Port:**
   ```bash
   # Find process
   lsof -i :3000
   
   # Kill process
   kill -9 <PID>
   ```

2. **Use Different Port:**
   ```bash
   PORT=3001 npm run dev
   ```

3. **Restart Computer:**
   - Last resort if process won't die

---

## Getting Help

If you've tried the solutions above and still have issues:

1. **Check Documentation:**
   - Review [README.md](../README.md)
   - Check [FORM_SETUP.md](./FORM_SETUP.md)
   - Review [API.md](./API.md)

2. **Check Logs:**
   - Browser console
   - Vercel function logs
   - Supabase logs
   - Resend logs

3. **Contact Support:**
   - Email: info@fredonbytes.cloud
   - Include error messages
   - Provide steps to reproduce
   - Share relevant logs

4. **Community Resources:**
   - Next.js Discord
   - Supabase Discord
   - Stack Overflow

---

**Last Updated:** [Date]

**Maintained By:** FredonBytes Development Team
