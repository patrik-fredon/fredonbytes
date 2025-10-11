# Customer Satisfaction Form - Security Implementation

## Overview
Comprehensive security measures implemented for the customer satisfaction form to protect against common web vulnerabilities and abuse.

## Security Measures Implemented

### 1. Rate Limiting Middleware (`src/middleware.ts`)

**Purpose**: Prevent spam submissions and DoS attacks

**Implementation**:
- In-memory rate limiter with IP-based tracking
- Limits: 10 requests per minute per IP address
- Applies to all `/api/form/*` routes
- Returns 429 status code when limit exceeded
- Includes rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- Automatic cleanup of expired entries every 5 minutes

**Configuration**:
```typescript
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute
```

**Note**: For production at scale, consider using Redis or a dedicated rate limiting service like Upstash Rate Limit.

### 2. Input Sanitization (`src/app/lib/input-sanitization.ts`)

**Purpose**: Prevent XSS attacks by sanitizing user input

**Functions**:
- `sanitizeString()`: Removes HTML tags, script tags, event handlers, and dangerous protocols
- `sanitizeStringArray()`: Sanitizes arrays of strings
- `sanitizeAnswerValue()`: Sanitizes answer values (string or string array)
- `sanitizeSessionId()`: Validates and sanitizes UUID session IDs
- `sanitizeQuestionId()`: Validates and sanitizes UUID question IDs

**Features**:
- Removes HTML tags and script content
- Removes event handlers (onclick, onerror, etc.)
- Removes javascript: and data: protocols
- Limits string length to 10,000 characters to prevent DoS
- Validates UUID format for IDs

**Integration**:
- Applied in `src/app/api/form/submit/route.ts` before storing responses
- All user-submitted answer values are sanitized before database insertion

### 3. Content Security Policy (CSP)

**Purpose**: Prevent XSS, clickjacking, and other code injection attacks

**Configuration in `next.config.ts`**:
```typescript
"Content-Security-Policy": [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.resend.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")
```

**Directives**:
- `default-src 'self'`: Only allow resources from same origin by default
- `script-src`: Allow scripts from same origin (unsafe-eval/inline needed for Next.js)
- `connect-src`: Allow API calls to Supabase and Resend
- `frame-ancestors 'none'`: Prevent clickjacking
- `form-action 'self'`: Forms can only submit to same origin

### 4. CORS Headers

**Purpose**: Restrict API access to authorized domains

**Configuration in `next.config.ts`**:
```typescript
{
  source: "/api/:path*",
  headers: [
    {
      key: "Access-Control-Allow-Origin",
      value: process.env.NODE_ENV === "production" 
        ? "https://fredonbytes.cloud" 
        : "*",
    },
    {
      key: "Access-Control-Allow-Methods",
      value: "GET, POST, OPTIONS",
    },
    {
      key: "Access-Control-Allow-Headers",
      value: "Content-Type, Authorization",
    },
  ],
}
```

**Features**:
- Production: Only allows requests from `https://fredonbytes.cloud`
- Development: Allows all origins for testing
- Restricts methods to GET, POST, OPTIONS
- Specifies allowed headers

### 5. Additional Security Headers

**Implemented in `next.config.ts`**:

- **X-Frame-Options: DENY**: Prevents clickjacking by disallowing iframe embedding
- **X-Content-Type-Options: nosniff**: Prevents MIME type sniffing
- **Referrer-Policy: strict-origin-when-cross-origin**: Controls referrer information
- **Permissions-Policy**: Disables camera, microphone, and geolocation access

### 6. Row Level Security (RLS) Policies

**Purpose**: Database-level access control

**Implemented in `docs/database-schema.sql`**:

**Questions and Options**:
- Public read access (SELECT) for anonymous users
- No public write/update/delete access

**Form Sessions**:
- Public insert access for creating sessions
- Public update access for completion timestamp
- No public delete access

**Form Responses**:
- Public insert access for submitting responses
- No public read/update/delete access

**Admin Access**:
- All operations require service key (backend only)
- Service key never exposed to client

### 7. Environment Variable Security

**Verification**:
- ✅ Only `NEXT_PUBLIC_SUPABASE_ANON_KEY` is exposed to client
- ✅ `RESEND_API_KEY` is server-side only
- ✅ No service keys in client code
- ✅ Supabase client configured with `persistSession: false`

**Configuration in `src/app/lib/supabase.ts`**:
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // No auth required for public forms
  },
});
```

### 8. Request Validation

**Implemented in `src/app/api/form/submit/route.ts`**:

**Zod Schema Validation**:
```typescript
const submitRequestSchema = z.object({
  session_id: z.string().uuid('Invalid session ID format'),
  responses: z.array(
    z.object({
      question_id: z.string().uuid('Invalid question ID format'),
      answer_value: z.union([z.string(), z.array(z.string())]),
    })
  ).min(1, 'At least one response is required'),
  metadata: z.object({
    user_agent: z.string().optional(),
    ip_address: z.string().optional(),
  }).optional(),
});
```

**Features**:
- UUID format validation for session_id and question_id
- Type validation for answer values
- Minimum response count validation
- Returns 400 status with detailed error messages on validation failure

### 9. Duplicate Submission Prevention

**Implementation**:
- Checks if session already completed before accepting submission
- Returns 409 Conflict status if session already submitted
- Prevents data duplication and potential abuse

### 10. Error Handling

**Security-Conscious Error Messages**:
- Generic error messages to prevent information leakage
- Detailed errors logged server-side only
- No stack traces or sensitive data in client responses

## Testing Recommendations

### Rate Limiting
```bash
# Test rate limiting (should fail after 10 requests)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/form/submit \
    -H "Content-Type: application/json" \
    -d '{"session_id":"test","responses":[]}'
done
```

### Input Sanitization
- Test with HTML tags: `<script>alert('xss')</script>`
- Test with event handlers: `<img src=x onerror=alert('xss')>`
- Test with javascript: protocol: `javascript:alert('xss')`
- Verify all are sanitized before storage

### CORS
```bash
# Test CORS headers
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3000/api/form/submit
```

### CSP
- Check browser console for CSP violations
- Verify no inline scripts execute from user input
- Test with browser DevTools Security tab

## Production Considerations

1. **Rate Limiting**: Consider Redis-based rate limiting for distributed systems
2. **Input Sanitization**: Consider adding DOMPurify for more robust HTML sanitization
3. **Monitoring**: Set up alerts for rate limit violations and suspicious activity
4. **Logging**: Implement security event logging for audit trails
5. **WAF**: Consider adding a Web Application Firewall (e.g., Cloudflare) for additional protection

## Compliance

- ✅ OWASP Top 10 protections implemented
- ✅ XSS prevention through input sanitization and CSP
- ✅ CSRF protection through SameSite cookies and origin validation
- ✅ SQL injection prevention through parameterized queries (Supabase)
- ✅ DoS prevention through rate limiting
- ✅ Clickjacking prevention through X-Frame-Options
- ✅ Data validation through Zod schemas

## Related Files

- `src/middleware.ts` - Rate limiting middleware
- `src/app/lib/input-sanitization.ts` - Input sanitization utilities
- `src/app/api/form/submit/route.ts` - API endpoint with security measures
- `next.config.ts` - Security headers configuration
- `docs/database-schema.sql` - RLS policies
- `src/app/lib/supabase.ts` - Supabase client configuration
