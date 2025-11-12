# Security Policy

## Overview

This document outlines the security measures implemented in the Fredonbytes application. We take security seriously and employ multiple layers of protection.

## Security Measures

### 1. CSRF Protection (Cross-Site Request Forgery)

**Implementation:** Double-Submit Cookie Pattern

**How it works:**
1. Server generates a random CSRF token and sets it as a cookie
2. Client reads the token from the cookie and includes it in the `x-csrf-token` header
3. Server validates that the header token matches the cookie token

**Configuration:**
- Cookie name: `csrf_token`
- httpOnly: `false` (required for client to read)
- secure: `true` (production only - HTTPS only)
- sameSite: `lax` (CSRF protection + multi-domain support)
- maxAge: 24 hours

**Why httpOnly: false?**
The double-submit pattern requires JavaScript to read the cookie and include it in request headers. While this exposes the token to XSS attacks, we mitigate this risk through:

1. **Content Security Policy (CSP)** - See section 2
2. **Input Sanitization** - See section 3
3. **Server-side Validation** - All inputs validated with Zod schemas
4. **Security Headers** - X-Content-Type-Options, X-Frame-Options, etc.

**Alternative patterns considered:**
- Synchronizer Token Pattern: Requires server-side session storage (not suitable for serverless/edge)
- Encrypted Token Pattern: More complex, similar security properties

**Reference:** [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

### 2. Content Security Policy (CSP)

**Location:** `next.config.ts` (lines 161-173)

**Policies:**
- `default-src 'self'` - Only load resources from same origin
- `script-src` - Allow scripts from trusted sources (Google Analytics, Plausible)
- `style-src` - Allow styles from self and Google Fonts
- `img-src` - Allow images from HTTPS and data URIs
- `connect-src` - Restrict API connections to trusted domains
- `frame-ancestors 'none'` - Prevent clickjacking

**XSS Protection:**
CSP helps prevent XSS attacks by controlling which scripts can execute. Combined with input sanitization, this provides defense-in-depth.

### 3. Input Sanitization

**Location:** `src/lib/input-sanitization.ts`

**Functions:**
- `sanitizeString()` - Removes HTML tags, script tags, event handlers, dangerous protocols
- `sanitizeStringArray()` - Sanitizes arrays of strings
- `sanitizeSessionId()` - Validates UUID format
- `sanitizeQuestionId()` - Validates UUID format

**Protections:**
- Removes `<script>` tags and content
- Removes event handlers (`onclick`, `onerror`, etc.)
- Removes `javascript:` protocol
- Removes dangerous `data:` URIs
- Limits input length (10,000 chars max)

**Applied to:**
- Contact form submissions
- Survey responses
- Newsletter subscriptions
- All user-generated content

### 4. Security Headers

**Configured in:** `next.config.ts` (lines 139-180)

| Header | Value | Purpose |
|--------|-------|---------|
| X-Frame-Options | DENY | Prevent clickjacking |
| X-Content-Type-Options | nosniff | Prevent MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Control referrer information |
| Content-Security-Policy | (see section 2) | XSS and injection protection |
| Permissions-Policy | camera=(), microphone=(), geolocation=() | Disable unnecessary browser features |

### 5. Rate Limiting

**Implementation:** Redis-based distributed rate limiter

**Location:** `src/lib/redis-rate-limiter.ts`

**Configuration:**
- Default: 10 requests per minute per IP
- Sliding window algorithm using Redis sorted sets
- Distributed across multiple instances

**Protected endpoints:**
- All `/api/*` routes (except health checks)
- Contact form submissions
- Newsletter subscriptions
- Survey submissions

### 6. HTTPS & Cookie Security

**Production cookies:**
- `secure: true` - Cookies only sent over HTTPS
- `sameSite: 'lax'` - CSRF protection while allowing multi-domain
- Path scoping - Cookies scoped to appropriate paths

**Environment-specific:**
- Development: HTTP allowed for localhost
- Production: HTTPS enforced via `secure` flag

### 7. Server-Side Validation

**Tool:** Zod schema validation

**Applied to:**
- Contact form data
- Survey responses
- Newsletter subscriptions
- API request bodies

**Example:** `src/app/api/contact/route.ts` (lines 19-33)

All client-side validation is duplicated server-side to prevent bypass attacks.

### 8. Database Security

**Provider:** Supabase (PostgreSQL)

**Protections:**
- Row Level Security (RLS) policies
- Prepared statements (prevents SQL injection)
- Service role key kept server-side only
- Separate anon key for client-side operations

### 9. Email Security

**SMTP Configuration:**
- STARTTLS encryption (port 587)
- Reject unauthorized TLS certificates (production)
- No email content trusted without sanitization

**Anti-abuse:**
- Rate limiting on contact form
- CSRF protection on submissions
- Email validation with Zod

### 10. Multi-Domain Security

**Domains:**
- Primary: fredonbytes.eu
- Secondary: fredonbytes.com, fredonbytes.cloud, fredonbytes.cz, fredonbytes.tech

**Protection:**
- Middleware handles 301 redirects to primary domain
- CORS configured for primary domain only (production)
- Cookie `sameSite: 'lax'` allows legitimate cross-domain navigation

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email us at **info@fredonbytes.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

**Please do not:**
- Publicly disclose the vulnerability before we've had a chance to fix it
- Exploit the vulnerability for any purpose

We will acknowledge receipt within 48 hours and provide a timeline for fixes.

## Security Checklist for Developers

When adding new features:

- [ ] Sanitize all user inputs
- [ ] Validate with Zod schemas server-side
- [ ] Apply CSRF protection to state-changing operations
- [ ] Test with CSP enabled
- [ ] Apply rate limiting to public endpoints
- [ ] Use HTTPS-only cookies in production
- [ ] Never trust client-side data
- [ ] Review OWASP Top 10 vulnerabilities
- [ ] Test authentication/authorization
- [ ] Document security decisions

## Dependency Security

**Tools:**
- `npm audit` - Regular dependency vulnerability scans
- Dependabot - Automated security updates (GitHub)

**Update policy:**
- Critical vulnerabilities: Immediate patch
- High vulnerabilities: Within 7 days
- Medium/Low: Next scheduled update

## Compliance

- **GDPR:** Cookie consent, privacy policy, data minimization
- **OWASP Top 10:** Protections against common vulnerabilities
- **CSP Level 3:** Modern content security policy
- **Secure Headers:** All recommended security headers implemented

## Security Audit History

| Date | Type | Findings | Status |
|------|------|----------|--------|
| 2025-11-12 | Code Review | CSRF sameSite policy | Fixed |
| 2025-11-12 | Code Review | XSS documentation | Documented |

## Resources

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security)
- [MDN Security Headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers#security)
- [CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

---

**Last Updated:** 2025-11-12
**Version:** 1.0
**Maintainer:** Fredonbytes Security Team
