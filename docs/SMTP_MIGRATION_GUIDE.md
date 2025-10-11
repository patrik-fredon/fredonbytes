# SMTP Migration Guide - From Resend to Nodemailer

This guide helps you migrate from Resend API to SMTP-based email sending using nodemailer.

## Overview

The email system has been refactored to use standard SMTP instead of Resend API. This provides:
- Greater flexibility in choosing email providers
- No vendor lock-in
- Cost optimization options
- Self-hosting capabilities

## Quick Start

### 1. Install Dependencies

Dependencies are already updated in `package.json`. Run:

```bash
npm install
```

### 2. Configure Environment Variables

Update your `.env` file with SMTP credentials:

```env
# Remove old Resend configuration
# RESEND_API_KEY=your_resend_api_key_here

# Add SMTP configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_REJECT_UNAUTHORIZED=true
```

### 3. Choose Your SMTP Provider

Select one of the following providers and configure accordingly:

## SMTP Provider Configurations

### Option 1: Gmail (Free Tier Available)

**Setup Steps:**
1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in your `.env` file

**Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
SMTP_REJECT_UNAUTHORIZED=true
```

**Limits:**
- 500 emails per day (free)
- 2000 emails per day (Google Workspace)

---

### Option 2: SendGrid (Free Tier: 100 emails/day)

**Setup Steps:**
1. Sign up at https://sendgrid.com
2. Create an API key in Settings > API Keys
3. Verify your sender domain

**Configuration:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
SMTP_REJECT_UNAUTHORIZED=true
```

**Limits:**
- Free: 100 emails/day
- Essentials: 40,000 emails/month ($19.95)

---

### Option 3: AWS SES (Pay-as-you-go)

**Setup Steps:**
1. Create AWS account and enable SES
2. Verify your domain or email address
3. Create SMTP credentials in SES console
4. Request production access (starts in sandbox mode)

**Configuration:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_aws_smtp_username
SMTP_PASS=your_aws_smtp_password
SMTP_REJECT_UNAUTHORIZED=true
```

**Pricing:**
- $0.10 per 1,000 emails
- First 62,000 emails free (if sent from EC2)

---

### Option 4: Mailgun (Free Tier: 5,000 emails/month)

**Setup Steps:**
1. Sign up at https://mailgun.com
2. Add and verify your domain
3. Get SMTP credentials from Domain Settings

**Configuration:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_smtp_password
SMTP_REJECT_UNAUTHORIZED=true
```

**Limits:**
- Free: 5,000 emails/month (first 3 months)
- Foundation: 50,000 emails/month ($35)

---

### Option 5: Brevo (formerly Sendinblue) (Free Tier: 300 emails/day)

**Setup Steps:**
1. Sign up at https://brevo.com
2. Generate SMTP credentials in Settings > SMTP & API

**Configuration:**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_brevo_login
SMTP_PASS=your_brevo_smtp_key
SMTP_REJECT_UNAUTHORIZED=true
```

**Limits:**
- Free: 300 emails/day
- Starter: 20,000 emails/month ($25)

---

## Testing Your Configuration

### Local Testing

1. Create a `.env.local` file with your SMTP credentials
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Test the contact form at http://localhost:3000
4. Check your email inbox for test messages

### Production Testing

1. Add SMTP environment variables to your hosting platform (Vercel, etc.)
2. Deploy your application
3. Send a test email through the contact form
4. Monitor logs for any errors

## Troubleshooting

### Common Issues

**1. Authentication Failed**
- Verify SMTP username and password are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check if 2FA is enabled (required for Gmail App Passwords)

**2. Connection Timeout**
- Verify SMTP_HOST and SMTP_PORT are correct
- Check firewall settings
- Try alternative ports (465 for SSL, 587 for TLS)

**3. TLS/SSL Errors**
- Set `SMTP_SECURE=true` for port 465
- Set `SMTP_SECURE=false` for port 587
- Try setting `SMTP_REJECT_UNAUTHORIZED=false` (not recommended for production)

**4. Emails Not Received**
- Check spam/junk folders
- Verify sender domain is authenticated (SPF, DKIM, DMARC)
- Check provider's sending limits
- Review email logs in your SMTP provider's dashboard

### Debug Mode

To enable detailed SMTP debugging, temporarily modify `src/app/lib/email.ts`:

```typescript
const config = {
  // ... existing config
  debug: true,
  logger: true,
};
```

## Security Best Practices

1. **Never commit credentials:** Always use environment variables
2. **Use App Passwords:** For Gmail, never use your main password
3. **Enable TLS:** Always use encrypted connections
4. **Validate Certificates:** Keep `SMTP_REJECT_UNAUTHORIZED=true` in production
5. **Rotate Credentials:** Regularly update SMTP passwords
6. **Monitor Usage:** Watch for unusual sending patterns
7. **Rate Limiting:** Implement rate limiting on your API endpoints

## Vercel Deployment

Add environment variables in Vercel dashboard:

1. Go to your project settings
2. Navigate to Environment Variables
3. Add each SMTP variable:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_SECURE`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_REJECT_UNAUTHORIZED`
4. Redeploy your application

## Rollback Plan

If you need to rollback to Resend:

1. Reinstall Resend:
   ```bash
   npm install resend
   npm uninstall nodemailer @types/nodemailer
   ```

2. Restore the original code from git:
   ```bash
   git checkout HEAD~1 -- src/app/api/contact/route.ts
   git checkout HEAD~1 -- src/app/api/form/submit/route.ts
   git checkout HEAD~1 -- next.config.ts
   ```

3. Remove the email utility:
   ```bash
   rm src/app/lib/email.ts
   ```

4. Update environment variables back to `RESEND_API_KEY`

## Support

For issues or questions:
- Check nodemailer documentation: https://nodemailer.com
- Review your SMTP provider's documentation
- Check application logs for detailed error messages
- Contact your SMTP provider's support team

## Cost Comparison

| Provider | Free Tier | Paid Plans Start At | Best For |
|----------|-----------|---------------------|----------|
| Gmail | 500/day | N/A | Small projects |
| SendGrid | 100/day | $19.95/month | Growing apps |
| AWS SES | 62,000/month* | $0.10/1000 | High volume |
| Mailgun | 5,000/month** | $35/month | Medium volume |
| Brevo | 300/day | $25/month | Budget-conscious |

*If sent from EC2  
**First 3 months only

## Next Steps

1. ✅ Choose your SMTP provider
2. ✅ Configure environment variables
3. ✅ Test email sending locally
4. ✅ Deploy to production
5. ✅ Monitor email delivery
6. ✅ Set up domain authentication (SPF, DKIM, DMARC)
7. ✅ Configure email templates (optional)
8. ✅ Implement email queue for high volume (optional)
