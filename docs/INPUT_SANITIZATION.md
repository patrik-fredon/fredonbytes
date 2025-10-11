# Input Sanitization Guide

## Overview

This document describes the comprehensive input sanitization strategy implemented across the FredonBytes application to prevent XSS (Cross-Site Scripting), SQL injection, and other security vulnerabilities.

## Security Layers

### 1. Zod Validation (First Line of Defense)

All API endpoints use Zod schemas for runtime type validation and format checking.

**Endpoints with Zod Validation:**
- `/api/contact` - Contact form submissions
- `/api/form/submit` - Customer satisfaction form submissions
- `/api/survey/submit` - Survey response submissions
- `/api/cookies/consent` - Cookie consent preferences
- `/api/analytics` - Web Vitals metrics

**Example:**
```typescript
const contactSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  // ... other fields
});

const validatedData = contactSchema.parse(body);
```

### 2. Input Sanitization (Second Line of Defense)

After Zod validation, all user-provided string inputs are sanitized using utility functions from `src/app/lib/input-sanitization.ts`.

#### Sanitization Functions

**`sanitizeString(input: string): string`**
- Removes HTML tags
- Removes script tags and content
- Removes event handlers (onclick, onerror, etc.)
- Removes javascript: protocol
- Removes data:text/html protocol
- Limits length to 10,000 characters (DoS prevention)
- Trims whitespace

**`sanitizeStringArray(input: string[]): string[]`**
- Validates array type
- Applies `sanitizeString()` to each element
- Filters out empty strings after sanitization

**`sanitizeAnswerValue(value: string | string[]): string | string[]`**
- Handles both string and array inputs
- Applies appropriate sanitization based on type

**`sanitizeSessionId(sessionId: string): string | null`**
- Validates UUID format
- Returns null for invalid UUIDs

**`sanitizeQuestionId(questionId: string): string | null`**
- Validates UUID format
- Returns null for invalid UUIDs

#### Where Sanitization is Applied

**Contact API (`/api/contact/route.ts`):**
```typescript
const sanitizedData = {
  firstName: sanitizeString(validatedData.firstName),
  lastName: sanitizeString(validatedData.lastName),
  phone: sanitizeString(validatedData.phone),
  company: validatedData.company ? sanitizeString(validatedData.company) : undefined,
  projectType: sanitizeString(validatedData.projectType),
  budget: sanitizeString(validatedData.budget),
  timeline: sanitizeString(validatedData.timeline),
  message: sanitizeString(validatedData.message),
  requirements: validatedData.requirements ? sanitizeStringArray(validatedData.requirements) : undefined,
  userAgent: sanitizeString(rawUserAgent),
};
```

**Form Submit API (`/api/form/submit/route.ts`):**
```typescript
const sanitizedResponses = responses.map(response => ({
  ...response,
  answer_value: sanitizeAnswerValue(response.answer_value),
}));
```

**Survey Submit API (`/api/survey/submit/route.ts`):**
```typescript
const sanitizedResponses = responses.map(response => ({
  ...response,
  answer_value: typeof response.answer_value === 'number' 
    ? response.answer_value 
    : sanitizeAnswerValue(response.answer_value),
}));
```

**Cookie Consent API (`/api/cookies/consent/route.ts`):**
```typescript
const rawUserAgent = request.headers.get('user-agent') || '';
const userAgent = rawUserAgent ? sanitizeString(rawUserAgent) : null;
```

**Analytics API (`/api/analytics/route.ts`):**
```typescript
const sanitizedMetric = {
  ...metric,
  name: sanitizeString(metric.name),
  id: sanitizeString(metric.id),
  navigationType: metric.navigationType ? sanitizeString(metric.navigationType) : undefined,
};
```

### 3. XSS Prevention in Email Templates

All user-generated content in email templates is escaped using the `escapeHtml()` function in `src/app/lib/email-templates.ts`.

**Escape Function:**
```typescript
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
```

**Usage in Templates:**
```typescript
<h1>${escapeHtml(data.firstName)}!</h1>
<p>${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
```

### 4. SQL Injection Prevention

**Supabase Parameterized Queries:**
All database operations use Supabase's query builder, which automatically parameterizes queries and prevents SQL injection.

```typescript
// Safe - Supabase automatically parameterizes
const { data } = await supabase
  .from('contact_submissions')
  .insert({
    first_name: sanitizedData.firstName,
    email: validatedData.email,
  })
  .select();
```

**No Raw SQL:**
The application does not use raw SQL queries or string concatenation for database operations.

## Special Cases

### Email Addresses
Email addresses are **NOT** sanitized because:
1. They are validated by Zod's `.email()` validator
2. They need to maintain exact format for email delivery
3. Email format validation prevents XSS vectors

### UUIDs
UUIDs (session_id, question_id) are validated using regex patterns:
```typescript
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
```

### Numbers
Numeric values (ratings, metrics) are validated by Zod and do not require sanitization.

### User Agent Strings
User agent strings from HTTP headers are sanitized before storage to prevent XSS attacks if they are ever displayed.

## Testing Input Sanitization

### XSS Test Payloads

Test with these payloads to verify sanitization:

```javascript
// Script injection
"<script>alert('xss')</script>"

// Image onerror
"<img src=x onerror=alert('xss')>"

// JavaScript protocol
"javascript:alert('xss')"

// Event handler
"<div onclick=\"alert('xss')\">Click</div>"

// Data URI
"data:text/html,<script>alert('xss')</script>"

// HTML entities
"&lt;script&gt;alert('xss')&lt;/script&gt;"
```

### Expected Results

All payloads should be sanitized:
- HTML tags removed
- Script content removed
- Event handlers removed
- JavaScript protocols removed
- Safe to store and display

### Testing Procedure

1. **API Testing:**
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -H "x-csrf-token: YOUR_TOKEN" \
  -d '{
    "firstName": "<script>alert(\"xss\")</script>",
    "lastName": "Test",
    "email": "test@example.com",
    "phone": "1234567890",
    "projectType": "web",
    "budget": "5000",
    "timeline": "1-3 months",
    "message": "<img src=x onerror=alert(\"xss\")>",
    "privacy": true,
    "locale": "en"
  }'
```

2. **Database Verification:**
Check that stored data has sanitized values:
```sql
SELECT first_name, message FROM contact_submissions ORDER BY created_at DESC LIMIT 1;
```

3. **Email Template Testing:**
Verify that emails render safely without executing scripts.

## Compliance

### OWASP Top 10 (2021)

- ✅ **A03: Injection** - Prevented through:
  - Zod validation
  - Input sanitization
  - Parameterized queries (Supabase)
  - HTML escaping in templates

### Security Best Practices

1. **Defense in Depth:** Multiple layers of protection
2. **Fail Secure:** Invalid input is rejected, not processed
3. **Least Privilege:** Database uses RLS policies
4. **Input Validation:** Whitelist approach with Zod schemas
5. **Output Encoding:** HTML escaping in email templates

## Maintenance

### Adding New API Endpoints

When creating new API endpoints that accept user input:

1. **Define Zod Schema:**
```typescript
const mySchema = z.object({
  field: z.string().min(1).max(100),
});
```

2. **Validate Input:**
```typescript
const validatedData = mySchema.parse(body);
```

3. **Sanitize Strings:**
```typescript
import { sanitizeString } from '@/app/lib/input-sanitization';

const sanitized = sanitizeString(validatedData.field);
```

4. **Use Parameterized Queries:**
```typescript
await supabase.from('table').insert({ field: sanitized });
```

5. **Escape in Templates:**
```typescript
const html = `<p>${escapeHtml(sanitized)}</p>`;
```

### Updating Sanitization Logic

If you need to enhance the sanitization function:

1. Update `src/app/lib/input-sanitization.ts`
2. Add test cases for new patterns
3. Update this documentation
4. Test all affected endpoints

## Future Enhancements

### Recommended Improvements

1. **DOMPurify Integration:**
   - More robust HTML sanitization
   - Configurable whitelist/blacklist
   - Better handling of edge cases

2. **Content Security Policy (CSP):**
   - Already configured in `next.config.ts`
   - Consider adding CSP reporting

3. **Rate Limiting:**
   - Already implemented in middleware
   - Consider per-endpoint limits

4. **Input Length Limits:**
   - Already enforced in Zod schemas
   - Consider database-level constraints

5. **Logging and Monitoring:**
   - Log sanitization events
   - Alert on suspicious patterns
   - Track XSS attempt frequency

## Related Files

- `src/app/lib/input-sanitization.ts` - Sanitization utilities
- `src/app/lib/email-templates.ts` - HTML escaping for emails
- `src/app/api/*/route.ts` - API endpoints with validation
- `docs/SECURITY_AUDIT.md` - Comprehensive security audit
- `supabase/migrations/` - Database schema and RLS policies

## References

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Zod Documentation](https://zod.dev/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
