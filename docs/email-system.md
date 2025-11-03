# Email System Documentation

## Overview

FredonBytes uses a comprehensive email notification system to communicate with customers and administrators across multiple touchpoints:

1. **Contact Form Submission** - Customer confirmation + Admin notification
2. **Survey Completion** - Customer thank you + Admin notification with responses
3. **Newsletter Subscription** - Customer welcome email
4. **Customer Satisfaction Form** - Admin notification with form responses

## Email Templates

All email templates are located in `/src/lib/email-templates.ts` and support:

- HTML and plain text versions
- Multi-language support (English, Czech, German)
- Responsive design
- XSS protection via HTML escaping

### Available Templates

#### 1. Contact Form Emails

- `generateCustomerConfirmationHTML()` - Customer confirmation with survey link
- `generateCustomerConfirmationText()` - Plain text version
- `generateAdminContactNotificationHTML()` - Admin notification with submission details
- `generateAdminContactNotificationText()` - Plain text version

#### 2. Survey Emails

- `generateSurveyThankYouHTML()` - Thank you email after survey completion
- `generateSurveyThankYouText()` - Plain text version
- `generateAdminNotificationHTML()` - Admin notification with survey responses

#### 3. Newsletter Emails

- `generateNewsletterWelcomeHTML()` - Welcome email for new subscribers
- `generateNewsletterWelcomeText()` - Plain text version

#### 4. Customer Satisfaction Form

- Uses `generateAdminNotificationHTML()` for admin notifications

## SMTP Configuration

### Email Service: Nodemailer with Forpsi SMTP

The email system uses **nodemailer** library with Forpsi SMTP server configuration.

**File:** `/src/lib/email.ts`

### Required Environment Variables

```bash
# SMTP Server Configuration
SMTP_HOST=smtp.forpsi.com          # SMTP server hostname
SMTP_PORT=587                       # Port (587 for STARTTLS, 465 for SSL/TLS)
SMTP_SECURE=false                   # true for 465, false for 587
SMTP_USER=info@fredonbytes.com     # Your email account username
SMTP_PASS=your_password             # Your email account password
SMTP_REJECT_UNAUTHORIZED=true       # Verify SSL certificates (set false for dev only)

# Admin Email for Notifications
ADMIN_EMAIL=info@fredonbytes.cloud  # Receives all admin notifications
```

### Setup Instructions

1. **Create Email Account in Forpsi Control Panel:**
   - Navigate to Email > Email accounts
   - Create accounts:
     - `info@fredonbytes.com` (SMTP sending)
     - `noreply@fredonbytes.cloud` (automated emails)
     - `newsletter@fredonbytes.cloud` (newsletter emails)
   - Set strong passwords

2. **Configure Environment Variables:**
   - Copy `.env.example` to `.env.local`
   - Fill in your SMTP credentials
   - Update `ADMIN_EMAIL` to your admin email address

3. **Test SMTP Connection:**
   - Use port 587 with STARTTLS (recommended)
   - Alternative: port 465 with SSL/TLS
   - Forpsi documentation: <https://support.forpsi.com/kb/a3147/konfigurace-smtp-serveru.aspx>

### Troubleshooting

**Authentication Failed:**

- Verify username and password are correct
- Ensure email account is created in Forpsi control panel
- Username should be full email address (e.g., `info@fredonbytes.com`)

**Connection Refused:**

- Check SMTP_PORT and SMTP_SECURE settings match
- Port 587 requires `SMTP_SECURE=false`
- Port 465 requires `SMTP_SECURE=true`
- Verify firewall allows outbound SMTP connections

**Certificate Errors:**

- Production: Keep `SMTP_REJECT_UNAUTHORIZED=true`
- Development only: Try `SMTP_REJECT_UNAUTHORIZED=false`

**Emails Not Sending:**

- Check server logs for detailed error messages
- Verify SMTP credentials are correct
- Ensure email account is active in Forpsi
- Check spam folder on recipient side

## Email Flow

### 1. Contact Form Submission (`/src/app/api/contact/route.ts`)

**Customer receives:**

- Confirmation email with project summary
- Link to satisfaction survey
- What to expect next

**Admin receives:**

- Contact details (name, email, phone, company)
- Project details (type, budget, timeline)
- Project description
- Additional requirements
- Newsletter opt-in status

### 2. Survey Submission (`/src/app/api/survey/submit/route.ts`)

**Customer receives:**

- Thank you email for completing survey
- Appreciation message
- Company contact information

**Admin receives:**

- Survey responses with question texts
- Session ID for tracking
- Timestamp
- Links to contact submission (if applicable)

### 3. Newsletter Subscription (`/src/app/api/newsletter/subscribe/route.ts`)

**Customer receives:**

- Welcome email with company introduction
- What to expect from newsletter
- Benefits of subscription
- Unsubscribe information

**Admin receives:**

- No notification (subscription is logged in database)

### 4. Customer Satisfaction Form (`/src/app/api/form/submit/route.ts`)

**Customer receives:**

- No email (anonymous form submission)

**Admin receives:**

- Form responses with question texts
- Session ID for tracking
- Timestamp

## Translation Keys

All email content is internationalized using `next-intl`. Translation keys are located in:

- `/src/messages/en.json`
- `/src/messages/cs.json`
- `/src/messages/de.json`

### Email Translation Namespace: `emails`

```json
{
  "emails": {
    "customer": { ... },    // Customer confirmation emails
    "admin": { ... },       // Admin notification emails
    "common": { ... },      // Shared content (company info)
    "survey": { ... },      // Survey thank you emails
    "newsletter": { ... }   // Newsletter welcome emails
  }
}
```

## Error Handling

All email sending is **non-blocking** - if email fails, the form submission still succeeds:

```typescript
try {
  await sendEmail({ ... });
  console.log('Email sent successfully');
} catch (emailError) {
  console.error('Error sending email:', emailError);
  // Don't fail the request if email fails
}
```

This ensures:

- User experience is not disrupted
- Data is saved to database even if email fails
- Errors are logged for debugging
- Admin can be notified of email failures via monitoring

## Monitoring & Logs

**Check email logs in console:**

```bash
# Success messages
✅ Customer email sent successfully
✅ Admin notification email sent successfully
✅ Newsletter welcome email sent successfully
✅ Survey thank you email sent successfully

# Error messages
❌ Failed to send customer email: [error details]
❌ Failed to send admin email: [error details]
```

**Database tracking:**

- Contact submissions: `survey_sent` flag
- Newsletter subscribers: Active subscription status
- Survey responses: `completed_at` timestamp

## Testing

### Manual Testing

1. **Test Contact Form:**
   - Submit contact form at `/contact`
   - Check customer email inbox
   - Check admin email inbox (ADMIN_EMAIL)

2. **Test Survey:**
   - Complete survey via link from contact email
   - Check customer email for thank you
   - Check admin email for survey responses

3. **Test Newsletter:**
   - Subscribe via newsletter form
   - Check email for welcome message

### Automated Testing (Future)

```bash
# Install test dependencies
npm install --save-dev nodemailer-mock

# Run email tests
npm run test:email
```

## Security Considerations

1. **CSRF Protection:** All email-triggering endpoints require CSRF token
2. **Input Sanitization:** All user inputs are sanitized before including in emails
3. **XSS Prevention:** HTML escaping in email templates
4. **Rate Limiting:** Consider implementing rate limits on email endpoints
5. **SMTP Credentials:** Never commit real credentials to version control
6. **TLS Encryption:** All emails sent over encrypted connection (STARTTLS/SSL)

## Future Enhancements

- [ ] Email queue system for better reliability
- [ ] Retry logic for failed emails
- [ ] Email templates preview in admin panel
- [ ] A/B testing for email content
- [ ] Email analytics (open rates, click-through rates)
- [ ] Scheduled newsletter campaigns
- [ ] Automated follow-up sequences
- [ ] Email template editor
- [ ] Transactional email logs in database

## Support

For SMTP configuration issues, contact:

- **Forpsi Support:** <https://support.forpsi.com>
- **Internal:** Check server logs and environment variables
- **Documentation:** This file and `/src/lib/email.ts` comments
