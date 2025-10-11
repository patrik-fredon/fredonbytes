# Security Testing Guide

This document provides instructions for testing the security measures implemented in the customer satisfaction form.

## Prerequisites

- Development server running (`npm run dev`)
- curl or Postman for API testing
- Browser DevTools for CSP testing

## 1. Rate Limiting Tests

### Test Rate Limit Enforcement

```bash
# Test rate limiting - should succeed for first 10 requests, then fail
for i in {1..15}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/form/questions \
    -H "Content-Type: application/json" \
    -w "\nStatus: %{http_code}\n\n"
done
```

**Expected Results**:
- First 10 requests: Status 200
- Requests 11-15: Status 429 (Too Many Requests)
- Response includes `Retry-After` header

### Test Rate Limit Headers

```bash
curl -v http://localhost:3000/api/form/questions
```

**Expected Headers**:
- `X-RateLimit-Limit: 10`
- `X-RateLimit-Remaining: 9` (or less)
- `X-RateLimit-Reset: [ISO timestamp]`

## 2. Input Sanitization Tests

### Test XSS Prevention

Create a test script to submit malicious input:

```bash
# Test with HTML tags
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "<script>alert(\"xss\")</script>Hello"
    }]
  }'
```

**Expected Result**:
- Response: 200 OK
- Stored value in database should be sanitized (no script tags)

### Test Event Handler Removal

```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "<img src=x onerror=alert(\"xss\")>"
    }]
  }'
```

**Expected Result**:
- Event handlers removed from stored value

### Test JavaScript Protocol

```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "javascript:alert(\"xss\")"
    }]
  }'
```

**Expected Result**:
- `javascript:` protocol removed

## 3. CORS Tests

### Test CORS Headers

```bash
# Test with allowed origin (production)
curl -H "Origin: https://fredonbytes.cloud" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS http://localhost:3000/api/form/submit \
  -v
```

**Expected Headers** (in development):
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`

**Expected Headers** (in production):
- `Access-Control-Allow-Origin: https://fredonbytes.cloud`

### Test Blocked Origin (Production Only)

```bash
curl -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://fredonbytes.cloud/api/form/submit \
  -v
```

**Expected Result**:
- Request should be blocked by browser (CORS error)

## 4. Content Security Policy Tests

### Test CSP Headers

```bash
curl -v http://localhost:3000/ | grep -i "content-security-policy"
```

**Expected Header**:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api.resend.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```

### Test CSP Violations in Browser

1. Open browser DevTools (F12)
2. Navigate to the form page
3. Try to execute inline script in console:
   ```javascript
   eval('alert("test")')
   ```
4. Check Console for CSP violations

**Expected Result**:
- CSP violations logged in console
- Inline scripts from user input blocked

## 5. Request Validation Tests

### Test Invalid Session ID

```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "invalid-uuid",
    "responses": []
  }'
```

**Expected Result**:
- Status: 400 Bad Request
- Error: "Invalid session ID format"

### Test Invalid Question ID

```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "not-a-uuid",
      "answer_value": "test"
    }]
  }'
```

**Expected Result**:
- Status: 400 Bad Request
- Error: "Invalid question ID format"

### Test Empty Responses

```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": []
  }'
```

**Expected Result**:
- Status: 400 Bad Request
- Error: "At least one response is required"

## 6. Duplicate Submission Tests

### Test Duplicate Prevention

1. Submit a form successfully:
```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "test"
    }]
  }'
```

2. Try to submit again with same session_id:
```bash
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "test2"
    }]
  }'
```

**Expected Result**:
- First submission: Status 200 OK
- Second submission: Status 409 Conflict
- Error: "Form already submitted"

## 7. Security Headers Tests

### Test All Security Headers

```bash
curl -v http://localhost:3000/ 2>&1 | grep -E "(X-Frame-Options|X-Content-Type-Options|Referrer-Policy|Permissions-Policy)"
```

**Expected Headers**:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## 8. Environment Variable Security

### Verify No Service Key Exposure

1. Check browser DevTools Network tab
2. Look at any API requests
3. Verify only `NEXT_PUBLIC_SUPABASE_ANON_KEY` is visible
4. Verify `RESEND_API_KEY` is never exposed

**Expected Result**:
- Only public environment variables visible in client
- No service keys in client-side code or network requests

### Check Supabase Client Configuration

```bash
grep -r "SUPABASE.*KEY" src/app/lib/supabase.ts
```

**Expected Result**:
- Only `NEXT_PUBLIC_SUPABASE_ANON_KEY` used
- No service key references

## 9. RLS Policy Tests

### Test Public Read Access to Questions

```bash
# This should work (public read access)
curl http://localhost:3000/api/form/questions
```

**Expected Result**:
- Status: 200 OK
- Questions returned

### Test Direct Database Access (Requires Supabase Dashboard)

1. Go to Supabase Dashboard
2. Try to query `form_responses` table with anon key
3. Should be denied (no public read access)

**Expected Result**:
- Read access denied for form_responses
- Only insert access allowed

## 10. Performance Tests

### Test Rate Limiter Performance

```bash
# Measure response time with rate limiting
time curl http://localhost:3000/api/form/questions
```

**Expected Result**:
- Minimal overhead (< 10ms added latency)
- No memory leaks after many requests

## Automated Testing Script

Create a test script `scripts/test-security.sh`:

```bash
#!/bin/bash

echo "=== Security Testing Suite ==="
echo ""

echo "1. Testing Rate Limiting..."
for i in {1..12}; do
  status=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/form/questions)
  echo "Request $i: Status $status"
done

echo ""
echo "2. Testing Input Sanitization..."
response=$(curl -s -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "123e4567-e89b-12d3-a456-426614174000",
    "responses": [{
      "question_id": "123e4567-e89b-12d3-a456-426614174001",
      "answer_value": "<script>alert(\"xss\")</script>"
    }]
  }')
echo "Response: $response"

echo ""
echo "3. Testing Security Headers..."
curl -s -v http://localhost:3000/ 2>&1 | grep -E "(X-Frame-Options|Content-Security-Policy|X-Content-Type-Options)"

echo ""
echo "=== Testing Complete ==="
```

## Troubleshooting

### Rate Limiting Not Working

- Check middleware is in correct location (`src/middleware.ts`)
- Verify matcher configuration in middleware
- Check server logs for rate limit entries

### CSP Blocking Legitimate Resources

- Review CSP directives in `next.config.ts`
- Add necessary domains to `connect-src` or other directives
- Check browser console for specific CSP violations

### CORS Issues

- Verify `NODE_ENV` is set correctly
- Check origin header in request
- Review CORS configuration in `next.config.ts`

## Security Checklist

- [ ] Rate limiting prevents spam (10 req/min)
- [ ] Input sanitization removes XSS vectors
- [ ] CORS restricts API access to authorized domains
- [ ] CSP prevents inline script execution
- [ ] Security headers present on all responses
- [ ] Request validation rejects invalid input
- [ ] Duplicate submissions prevented
- [ ] RLS policies enforce database access control
- [ ] No service keys exposed to client
- [ ] Error messages don't leak sensitive information

## Production Monitoring

After deployment, monitor:

1. Rate limit violations (429 responses)
2. CSP violations (browser reports)
3. Failed validation attempts (400 responses)
4. Duplicate submission attempts (409 responses)
5. Unusual traffic patterns

Set up alerts for:
- High rate of 429 responses (potential attack)
- Spike in validation errors (potential probing)
- Multiple duplicate submission attempts (potential abuse)
