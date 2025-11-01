# Changelog

## 2025-11-01

### 🐛 Bug Fixes - Contact Form Email Issues

**Issue:** Contact form showed success but emails were not being sent to customers or admin.

**Root Causes:**
1. **Inverted SSL/TLS Logic** in `src/lib/email.ts` (line 43)
   - `secure: process.env.SMTP_SECURE === 'false'` was backwards
   - When `SMTP_SECURE=true`, SSL was disabled (should be enabled)
   - Fixed to `secure: process.env.SMTP_SECURE === 'true'`

2. **Missing Email Validation** in `src/app/api/contact/route.ts`
   - Route didn't check `customerEmail.success` or `adminEmail.success`
   - Always returned success even when emails failed
   - Added validation to throw errors if email sending fails

**Files Modified:**
- `src/lib/email.ts` - Fixed inverted secure flag logic
- `src/app/api/contact/route.ts` - Added email success validation

**Testing Required:**
- Test with `.env.local` properly configured
- Verify customer receives confirmation email with survey link
- Verify admin receives notification email
- Check error handling when SMTP credentials are invalid

### ✅ Mobile Navigation Improvements

Fixed mobile navigation overlay and enhanced with terminal/dev theme:
- Fixed z-index positioning for proper viewport overlay
- Enhanced hamburger icon with neon glow and animations
- Terminal-style dev theme throughout
- Custom scrollbar with neon accents

**Files Modified:**
- `src/components/common/Header.tsx`
- `src/app/globals.css`

### ✅ MDX + ISR Implementation (2025-01-06)

Optimized legal documentation with MDX and ISR caching.
