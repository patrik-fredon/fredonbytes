# Newsletter & Privacy Features Guide

## ✅ Implemented Features

### 1. **Configurable Admin Email** 📧
### 2. **Newsletter Opt-in Checkbox** ✉️
### 3. **Anonymous Data Assurance** 🔒

---

## 📧 1. Admin Email Configuration

### Where to Configure

The admin email (where form notifications are sent) is now configurable via environment variable.

**File:** `.env`

```env
# Admin Email (receives form notifications)
ADMIN_EMAIL=info@fredonbytes.cloud
```

### How It Works

- Default: `info@fredonbytes.cloud`
- Override: Set `ADMIN_EMAIL` in your `.env` file
- Used in: `src/app/api/form/submit/route.ts`

```typescript
await sendEmail({
  from: 'Customer Feedback <noreply@fredonbytes.cloud>',
  to: process.env.ADMIN_EMAIL || 'info@fredonbytes.cloud',  // ← Configurable
  subject: `New Customer Satisfaction Survey - ${session_id}`,
  html: emailHtml,
});
```

### To Change Admin Email

1. Open `.env` file
2. Add or update: `ADMIN_EMAIL=your-email@example.com`
3. Restart dev server: `npm run dev`
4. Test form submission

---

## ✉️ 2. Newsletter Opt-in Feature

### Database Changes Required

**Run this SQL in Supabase Dashboard:**

File: `scripts/add-newsletter-field.sql`

```sql
-- Add newsletter fields to form_sessions table
ALTER TABLE form_sessions 
ADD COLUMN IF NOT EXISTS newsletter_optin BOOLEAN DEFAULT false;

ALTER TABLE form_sessions 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Create index for newsletter queries
CREATE INDEX IF NOT EXISTS idx_form_sessions_newsletter 
ON form_sessions(newsletter_optin) 
WHERE newsletter_optin = true;
```

### How It Works

**On the Last Question:**
1. Privacy notice is displayed
2. Newsletter checkbox appears
3. If checked, email input field shows
4. Email is required when newsletter is opted-in

**Data Saved:**
- `newsletter_optin`: `true` or `false`
- `email`: User's email (only if opted-in)

### UI Features

- ✅ Checkbox on last question only
- ✅ Animated email input field
- ✅ Email validation (required if checked)
- ✅ Clear privacy messaging
- ✅ Accessible with keyboard navigation

---

## 🔒 3. Anonymous Data Assurance

### Privacy Notice Display

A prominent privacy notice appears on the last question:

```
🔒 Your Privacy Matters

This survey is completely anonymous. We do not collect any 
personally identifiable information unless you choose to 
provide your email below. Your responses help us improve 
our services.
```

### What's Anonymous

**NOT Collected (unless newsletter opted-in):**
- ❌ Name
- ❌ Email
- ❌ Phone number
- ❌ Personal identifiers

**Collected for Analytics:**
- ✅ Session ID (random UUID)
- ✅ Timestamp
- ✅ IP address (for spam prevention)
- ✅ User agent (browser info)
- ✅ Survey responses

**Only Collected if Newsletter Opted-in:**
- ✅ Email address

### Privacy Features

1. **Clear Communication:** Users see privacy notice before submitting
2. **Opt-in Only:** Email is optional and only collected if user checks newsletter
3. **No Tracking:** No cookies, no third-party analytics
4. **Secure Storage:** All data stored in Supabase with RLS policies
5. **Anonymous by Default:** No PII collected unless explicitly provided

---

## 🚀 Setup Instructions

### Step 1: Update Database Schema

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy content from `scripts/add-newsletter-field.sql`
3. Paste and click **"Run"**
4. Verify: You should see `newsletter_optin` and `email` columns added

### Step 2: Configure Admin Email

1. Open `.env` file
2. Add: `ADMIN_EMAIL=your-email@example.com`
3. Save the file

### Step 3: Restart Dev Server

```bash
npm run dev
```

### Step 4: Test the Features

1. Go to http://localhost:3000/form
2. Fill out the survey
3. On the **last question**, you should see:
   - 🔒 Privacy notice (blue box)
   - ☑️ Newsletter checkbox
4. Check the newsletter box
5. Email input field should appear
6. Submit the form
7. Check your admin email for notification

---

## 📊 Accessing Newsletter Subscribers

### Query Newsletter Opt-ins

Run this in Supabase SQL Editor:

```sql
-- Get all newsletter subscribers
SELECT 
  session_id,
  email,
  completed_at,
  created_at
FROM form_sessions
WHERE newsletter_optin = true
  AND email IS NOT NULL
ORDER BY completed_at DESC;
```

### Export to CSV

1. Run the query above
2. Click **"Download CSV"** button in Supabase
3. Import to your email marketing tool

### Integration Ideas

- **Mailchimp:** Import CSV to mailing list
- **SendGrid:** Add contacts via API
- **Brevo:** Import subscribers
- **Custom:** Build API endpoint to sync

---

## 🎨 UI Preview

### Last Question Screen

```
┌─────────────────────────────────────────────┐
│  Question 7 of 7                            │
│                                             │
│  Would you recommend FredonBytes to others? │
│  ○ Definitely Yes                           │
│  ○ Probably Yes                             │
│  ○ Not Sure                                 │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ 🔒 Your Privacy Matters               │ │
│  │                                       │ │
│  │ This survey is completely anonymous. │ │
│  │ We do not collect any personally     │ │
│  │ identifiable information unless you  │ │
│  │ choose to provide your email below.  │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  ☑ I'd like to receive updates from        │
│    FredonBytes                              │
│                                             │
│    Email Address *                          │
│    ┌─────────────────────────────────────┐ │
│    │ your.email@example.com              │ │
│    └─────────────────────────────────────┘ │
│    We'll only use this to send you        │
│    occasional updates.                     │
│                                             │
│  [← Previous]              [Submit Form →] │
└─────────────────────────────────────────────┘
```

---

## 🔧 Customization

### Change Privacy Notice Text

**File:** `src/app/form/[session_id]/FormClient.tsx`

Find this section:

```tsx
<p className="text-sm text-blue-800 dark:text-blue-200">
  This survey is <strong>completely anonymous</strong>. 
  We do not collect any personally identifiable information 
  unless you choose to provide your email below. Your 
  responses help us improve our services.
</p>
```

### Change Newsletter Checkbox Text

```tsx
<span className="flex-1 text-sm text-slate-700 dark:text-slate-300">
  I'd like to receive updates and news from FredonBytes
</span>
```

### Change Email Placeholder

```tsx
<input
  placeholder="your.email@example.com"  // ← Change this
  ...
/>
```

---

## ✅ Testing Checklist

- [ ] Database schema updated (newsletter fields added)
- [ ] Admin email configured in `.env`
- [ ] Dev server restarted
- [ ] Privacy notice appears on last question
- [ ] Newsletter checkbox works
- [ ] Email field appears when checked
- [ ] Email validation works (required when checked)
- [ ] Form submits successfully
- [ ] Admin receives email notification
- [ ] Newsletter data saved in database
- [ ] Can query newsletter subscribers

---

## 📋 Files Modified

### Database
- ✅ `scripts/add-newsletter-field.sql` - New migration

### Backend
- ✅ `src/app/api/form/submit/route.ts` - Handle newsletter data
- ✅ `src/app/lib/supabase.ts` - Updated TypeScript types

### Frontend
- ✅ `src/app/form/[session_id]/FormClient.tsx` - UI for newsletter & privacy

### Configuration
- ✅ `.env.example` - Added `ADMIN_EMAIL`

---

## 🆘 Troubleshooting

### Newsletter checkbox not showing

**Check:**
1. Are you on the last question?
2. Did you restart the dev server?

### Email field not appearing

**Check:**
1. Is the checkbox checked?
2. Check browser console for errors

### Database error on submit

**Check:**
1. Did you run `scripts/add-newsletter-field.sql`?
2. Verify columns exist:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'form_sessions';
   ```

### Admin not receiving emails

**Check:**
1. Is `ADMIN_EMAIL` set in `.env`?
2. Are SMTP credentials configured?
3. Check terminal for email errors
4. Verify email isn't in spam folder

---

## 🎯 Summary

✅ **Admin Email:** Configurable via `ADMIN_EMAIL` environment variable  
✅ **Newsletter:** Opt-in checkbox with email collection on last question  
✅ **Privacy:** Clear notice that survey is anonymous by default  
✅ **Database:** New fields for newsletter tracking  
✅ **UI:** Beautiful, accessible interface with animations  
✅ **Validation:** Email required only when newsletter checked  

**Next Steps:**
1. Run database migration
2. Configure admin email
3. Test the form
4. Export newsletter subscribers
5. Integrate with email marketing tool
