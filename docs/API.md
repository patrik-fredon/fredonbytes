# API Documentation

This document provides comprehensive documentation for all API endpoints in the FredonBytes application.

## Table of Contents

- [Contact Form API](#contact-form-api)
- [Customer Satisfaction Form API](#customer-satisfaction-form-api)
  - [GET /api/form/questions](#get-apiformquestions)
  - [POST /api/form/submit](#post-apiformsubmit)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Contact Form API

### POST /api/contact

Submit a contact form inquiry.

**Endpoint:** `/api/contact`

**Method:** `POST`

**Request Body:**

```typescript
{
  name: string;           // Full name (required)
  email: string;          // Valid email address (required)
  phone?: string;         // Phone number (optional)
  company?: string;       // Company name (optional)
  message: string;        // Message content (required)
  services?: string[];    // Selected services (optional)
}
```

**Response:**

```typescript
// Success (200)
{
  success: true;
  message: "Message sent successfully"
}

// Error (400)
{
  success: false;
  error: "Validation error message"
}

// Error (500)
{
  success: false;
  error: "Failed to send message"
}
```

**Example Request:**

```bash
curl -X POST https://fredonbytes.cloud/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I would like to discuss a project"
  }'
```

---

## Customer Satisfaction Form API

### GET /api/form/questions

Fetch all active survey questions with their options.

**Endpoint:** `/api/form/questions`

**Method:** `GET`

**Authentication:** None required (public endpoint)

**Response:**

```typescript
// Success (200)
{
  questions: Array<{
    id: string;                    // UUID
    question_text: string;         // Question text
    description: string | null;    // Optional description
    answer_type: 'short_text' | 'long_text' | 'single_choice' | 'multiple_choice' | 'checklist';
    required: boolean;             // Whether answer is required
    display_order: number;         // Order in which to display
    options?: Array<{              // Only for choice-based questions
      id: string;                  // UUID
      question_id: string;         // Parent question UUID
      option_text: string;         // Option text
      display_order: number;       // Order within options
    }>;
  }>;
}

// Error (500)
{
  error: "Failed to fetch questions"
}
```

**Example Request:**

```bash
curl https://fredonbytes.cloud/api/form/questions
```

**Example Response:**

```json
{
  "questions": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "question_text": "How satisfied are you with our service?",
      "description": "Please rate your overall experience",
      "answer_type": "single_choice",
      "required": true,
      "display_order": 1,
      "options": [
        {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "question_id": "550e8400-e29b-41d4-a716-446655440000",
          "option_text": "Very Satisfied",
          "display_order": 1
        },
        {
          "id": "660e8400-e29b-41d4-a716-446655440002",
          "question_id": "550e8400-e29b-41d4-a716-446655440000",
          "option_text": "Satisfied",
          "display_order": 2
        }
      ]
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "question_text": "What did you like most about our service?",
      "description": null,
      "answer_type": "long_text",
      "required": false,
      "display_order": 2,
      "options": []
    }
  ]
}
```

**Notes:**
- Questions are ordered by `display_order` ascending
- Options are only included for choice-based question types
- Empty questions array is returned if no questions exist

---

### POST /api/form/submit

Submit completed survey responses.

**Endpoint:** `/api/form/submit`

**Method:** `POST`

**Authentication:** None required (public endpoint)

**Request Body:**

```typescript
{
  session_id: string;              // UUID from URL
  responses: Array<{
    question_id: string;           // UUID of the question
    answer_value: string | string[]; // Answer (string for text, array for choices)
  }>;
}
```

**Response:**

```typescript
// Success (200)
{
  success: true;
  message: "Form submitted successfully"
}

// Validation Error (400)
{
  success: false;
  error: "Invalid request data",
  details?: string;  // Specific validation error
}

// Duplicate Submission (409)
{
  success: false;
  error: "This form has already been submitted"
}

// Server Error (500)
{
  success: false;
  error: "Failed to submit form"
}
```

**Example Request:**

```bash
curl -X POST https://fredonbytes.cloud/api/form/submit \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "550e8400-e29b-41d4-a716-446655440000",
    "responses": [
      {
        "question_id": "660e8400-e29b-41d4-a716-446655440001",
        "answer_value": "Very Satisfied"
      },
      {
        "question_id": "660e8400-e29b-41d4-a716-446655440002",
        "answer_value": ["Web Development", "Mobile Apps"]
      },
      {
        "question_id": "660e8400-e29b-41d4-a716-446655440003",
        "answer_value": "Great communication and timely delivery"
      }
    ]
  }'
```

**Validation Rules:**
- `session_id` must be a valid UUID
- `responses` must be a non-empty array
- Each response must have `question_id` and `answer_value`
- `answer_value` must be string for text questions, array for choice questions
- All required questions must be answered

**Side Effects:**
- Creates or updates `form_sessions` record
- Inserts records into `form_responses` table
- Sends email notification to admin via Resend API
- Email failure does not prevent successful submission

**Notes:**
- Duplicate submissions (same session_id) are rejected with 409 status
- Email notifications are sent asynchronously
- If email fails, error is logged but submission still succeeds

---

## Authentication

Currently, all API endpoints are public and do not require authentication. Future versions may implement:

- API key authentication for programmatic access
- Rate limiting per IP address
- CAPTCHA for spam prevention

---

## Error Handling

All API endpoints follow a consistent error response format:

```typescript
{
  success: false;
  error: string;        // Human-readable error message
  details?: string;     // Optional detailed error information
  code?: string;        // Optional error code for programmatic handling
}
```

### Common HTTP Status Codes

| Status Code | Meaning | When Used |
|-------------|---------|-----------|
| 200 | OK | Successful request |
| 400 | Bad Request | Invalid request data or validation error |
| 404 | Not Found | Endpoint does not exist |
| 409 | Conflict | Duplicate submission or resource conflict |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Error Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Invalid request data",
  "details": "Email address is not valid"
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": "Too many requests",
  "details": "Please try again in 60 seconds"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "error": "Failed to process request",
  "details": "Database connection error"
}
```

---

## Rate Limiting

Rate limiting is implemented to prevent abuse and ensure fair usage.

### Current Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/contact | 5 requests | 1 minute |
| /api/form/questions | 30 requests | 1 minute |
| /api/form/submit | 3 requests | 5 minutes |

### Rate Limit Headers

Responses include rate limit information in headers:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1640000000
```

### Handling Rate Limits

When rate limit is exceeded, the API returns:

```json
{
  "success": false,
  "error": "Too many requests",
  "retryAfter": 60
}
```

**Best Practices:**
- Implement exponential backoff for retries
- Cache responses when appropriate
- Monitor rate limit headers
- Contact support for higher limits if needed

---

## Data Types

### Question Answer Types

| Type | Description | Example Value |
|------|-------------|---------------|
| `short_text` | Single-line text input (max 200 chars) | `"John Doe"` |
| `long_text` | Multi-line text input (max 1000 chars) | `"Great service..."` |
| `single_choice` | Radio button selection | `"Very Satisfied"` |
| `multiple_choice` | Checkbox selections | `["Option 1", "Option 2"]` |
| `checklist` | Checkbox list with select all | `["Item A", "Item B"]` |

### UUID Format

All IDs use UUID v4 format:
```
550e8400-e29b-41d4-a716-446655440000
```

---

## Testing

### Development Environment

Base URL: `http://localhost:3000`

### Production Environment

Base URL: `https://fredonbytes.cloud`

### Testing Tools

**cURL Examples:**

```bash
# Test questions endpoint
curl http://localhost:3000/api/form/questions

# Test form submission
curl -X POST http://localhost:3000/api/form/submit \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

**Postman Collection:**

Import the following collection for easy testing:

```json
{
  "info": {
    "name": "FredonBytes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Form Questions",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/form/questions"
      }
    },
    {
      "name": "Submit Form",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/form/submit",
        "body": {
          "mode": "raw",
          "raw": "{\n  \"session_id\": \"{{sessionId}}\",\n  \"responses\": []\n}"
        }
      }
    }
  ]
}
```

---

## Support

For API support or questions:

- **Email:** info@fredonbytes.cloud
- **Documentation:** [docs/](.)
- **Issues:** Check application logs for detailed error information

---

## Changelog

### Version 1.0.0 (Current)

- Initial API release
- Contact form endpoint
- Customer satisfaction form endpoints
- Basic rate limiting
- Error handling standardization

### Planned Features

- API key authentication
- Webhook support for form submissions
- Batch operations
- Advanced analytics endpoints
- GraphQL API option
