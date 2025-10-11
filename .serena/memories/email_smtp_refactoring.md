# Email System Refactoring - Resend to SMTP

## Overview

Successfully refactored the email system from Resend API to nodemailer with SMTP configuration. This provides more flexibility and allows using any SMTP provider (Gmail, SendGrid, AWS SES, Mailgun, etc.).

## Changes Made

### 1. New Email Utility (`src/app/lib/email.ts`)

Created a centralized email utility using nodemailer:

**Key Features:**
- SMTP transporter configuration from environment variables
- TLS security with minimum version TLSv1.2
- Support for single or multiple recipients
- Consistent error handling
- TypeScript interfaces for type safety

**Configuration Options:**
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (587 for TLS, 465 for SSL)
- `SMTP_SECURE`: Boolean for SSL/TLS
- `SMTP_USER`: SMTP authentication username
- `SMTP_PASS`: SMTP authentication password
- `SMTP_REJECT_UNAUTHORIZED`: Certificate validation (default: true)

### 2. Updated API Routes

**Contact Form (`src/app/api/contact/route.ts`):**
- Replaced `Resend` import with `sendEmail` utility
- Updated email sending calls to use new interface
- Changed response to use `messageId` instead of `data?.id`

**Survey Form (`src/app/api/form/submit/route.ts`):**
- Replaced `Resend` import with `sendEmail` utility
- Updated admin notification email sending
- Maintained non-blocking error handling

### 3. Package Updates

**Added:**
- `nodemailer@^6.9.16` - Email sending library
- `@types/nodemailer@^6.4.17` - TypeScript definitions

**Removed:**
- `resend@^4.5.1` - No longer needed

### 4. Configuration Updates

**Environment Variables (`.env.example`):**
```env
# Old (Resend)
RESEND_API_KEY=your_resend_api_key_here

# New (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_REJECT_UNAUTHORIZED=true
```

**Content Security Policy (`next.config.ts`):**
- Removed `https://api.resend.com` from `connect-src` directive
- Now only allows connections to Supabase

**Tech Stack Documentation (`.kiro/steering/tech.md`):**
- Updated from "Resend API" to "Nodemailer with SMTP"
- Updated environment variables documentation

## SMTP Provider Options

### Gmail
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password  # Use App Password, not regular password
```

### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### AWS SES
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_aws_smtp_username
SMTP_PASS=your_aws_smtp_password
```

### Mailgun
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_smtp_password
```

## Migration Steps

1. **Install Dependencies:**
   ```bash
   npm install nodemailer @types/nodemailer
   npm uninstall resend
   ```

2. **Update Environment Variables:**
   - Remove `RESEND_API_KEY`
   - Add SMTP configuration variables
   - Update `.env` file with your SMTP provider credentials

3. **Test Email Functionality:**
   - Test contact form submission
   - Test survey form submission
   - Verify emails are received
   - Check email formatting

4. **Update Documentation:**
   - Update deployment guides
   - Update README with new SMTP setup instructions
   - Update any API documentation

## Benefits of SMTP Approach

1. **Provider Flexibility:** Can switch between any SMTP provider
2. **Cost Control:** Many SMTP providers offer free tiers
3. **No Vendor Lock-in:** Standard SMTP protocol
4. **Self-Hosting Option:** Can use own SMTP server
5. **Better Control:** Direct access to SMTP configuration

## Security Considerations

- Always use TLS/SSL for SMTP connections
- Store SMTP credentials in environment variables
- Use app-specific passwords for Gmail
- Enable certificate validation (`SMTP_REJECT_UNAUTHORIZED=true`)
- Minimum TLS version set to TLSv1.2

## Testing

All TypeScript checks passed:
- ✅ `src/app/lib/email.ts` - No diagnostics
- ✅ `src/app/api/contact/route.ts` - No diagnostics
- ✅ `src/app/api/form/submit/route.ts` - No diagnostics

## Code Quality

- Maintains existing error handling patterns
- Preserves non-blocking email sending for form submissions
- Type-safe with TypeScript interfaces
- Follows project conventions and code style
- XSS protection maintained in email templates

## Next Steps

1. Configure SMTP credentials in production environment
2. Test email delivery in production
3. Monitor email sending logs
4. Update deployment documentation
5. Consider implementing email queue for high volume (optional)
