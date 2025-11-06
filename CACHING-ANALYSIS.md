# FredonBytes Next.js Project - Comprehensive Caching Analysis

## 1. PROJECT STRUCTURE & TYPE

### Application Type
- **Multi-language SaaS/Portfolio Platform** (Czech, English, German)
- **Primary Function**: Professional portfolio, project gallery, pricing pages, and forms
- **Framework**: Next.js 15.5.4 with React 19
- **Database**: Supabase (PostgreSQL)
- **Hosting**: Coolify (Docker-based)

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/               # RESTful API routes
│   ├── [locale]/          # i18n dynamic routes
│   │   ├── projects/      # Portfolio with ISR
│   │   ├── pricing/       # Pricing tables
│   │   ├── form/          # Dynamic forms
│   │   ├── survey/        # Survey system
│   │   └── ...
│   └── ...
├── lib/                   # Utilities & helpers
│   ├── request-cache.ts   # Request deduplication
│   ├── session-cache.ts   # Client-side localStorage cache
│   ├── supabase.ts        # Database client & types
│   ├── csrf.ts            # CSRF protection
│   └── ...
└── ...
```

---

## 2. CURRENT CACHING MECHANISMS

### 2.1 Redis (Infrastructure Level)
**Status**: ✅ CONFIGURED BUT CURRENTLY UNUSED
- **Docker Config**: Redis 7 Alpine (256MB max memory, LRU eviction)
- **Location**: `docker-compose.yml` (lines 90-107)
- **REDIS_URL**: `redis://redis:6379`
- **Configuration**: 
  - Max memory: 256MB
  - Eviction policy: `allkeys-lru`
  - Health check: Redis CLI ping
- **Current Usage**: None detected in codebase (ready for implementation)

### 2.2 In-Memory Request Deduplication (`src/lib/request-cache.ts`)
**Status**: ✅ ACTIVELY USED

**Purpose**: Prevent duplicate database queries from concurrent identical requests

**Implementation**:
```typescript
- Uses Map<string, Promise> to cache in-flight requests
- Auto-clears after 100ms to prevent stale data
- Cache key format: "projects:status=active&category=web"
```

**API Routes Using It**:
- `/api/projects` - Filters by status, category, featured
- `/api/pricing/tiers` - Filters by type, popular
- `/api/pricing/items` - Filters by category
- `/api/projects/technologies` - No deduplication (no filters)

**Limitations**:
- Per-request scope only (new process = new cache)
- 100ms TTL (very short)
- Perfect for preventing thundering herd during build time

### 2.3 Client-Side Session Cache (`src/lib/session-cache.ts`)
**Status**: ✅ ACTIVELY USED

**Purpose**: localStorage caching for form/survey session state

**Features**:
- 24-hour TTL (configurable)
- Stores: Session ID, locale, questions, answers, CSRF token, current step
- Auto-cleanup of expired entries
- JSON serialization with error handling

**Usage**:
- Form sessions: `form_session_${sessionId}`
- Survey sessions: `survey_session_${sessionId}`
- CSRF tokens: `${type}_csrf_${sessionId}`

**Integration**: Form and survey components for offline continuity

### 2.4 HTTP Response Caching (Next.js CDN Headers)
**Status**: ✅ ACTIVELY USED

**Caching Headers by Route**:

| Route | Cache-Control | Purpose |
|-------|---------------|---------|
| `/api/projects` | `public, s-maxage=3600, stale-while-revalidate=7200` | 1h with 2h stale-while-revalidate |
| `/api/pricing/tiers` | `public, s-maxage=3600, stale-while-revalidate=7200` | Same as projects |
| `/api/pricing/items` | `public, s-maxage=3600, stale-while-revalidate=7200` | Same as projects |
| `/api/projects/technologies` | `public, s-maxage=86400, stale-while-revalidate=172800` | 24h with 2d stale-while-revalidate |
| `/api/form/questions` | `public, s-maxage=3600, stale-while-revalidate=86400` | 1h with 1d stale-while-revalidate |
| `/api/survey/questions` | `no-store, must-revalidate` | No caching (session-specific) |
| Static Assets | `public, max-age=31536000, immutable` | 1 year (images, fonts) |
| Manifests/JSON | `public, max-age=86400, must-revalidate` | 1 day |

### 2.5 Next.js Incremental Static Regeneration (ISR)
**Status**: ✅ ACTIVELY USED

**Revalidate Schedule**:

| Page | Revalidate | Reason |
|------|-----------|--------|
| `/projects` | 3600s (1 hour) | Portfolio updates frequently |
| `/[locale]/` (Home) | 86400s (24 hours) | Homepage content |
| `/pricing` | 604800s (7 days) | Pricing rarely changes |
| `/about`, `/terms`, `/gdpr`, `/cookies` | 604800s (7 days) | Static content |
| `/links` | 86400s (24 hours) | Link shortcuts |
| `/form/[id]` | `false` | Force dynamic (session-specific) |
| `/survey/[id]` | `false` | Force dynamic (session-specific) |
| `/contact` | 86400s (24 hours) | Contact page |

**Static Generation**:
- All locale-prefixed pages use `generateStaticParams()` at build time
- Locales: en, cs, de
- Pre-renders all combinations: `layout.tsx`, `projects/page.tsx`

### 2.6 Rate Limiting (In-Memory)
**Status**: ✅ ACTIVELY USED

**Configuration** (`src/middleware.ts`):
- **Rate Limit**: 10 requests per minute per IP
- **Window**: 60 seconds
- **Storage**: In-memory Map (not persistent)
- **Headers**: 
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
  - `Retry-After` (on 429)

**Exempt Endpoints**:
- `/api/health` (health checks)
- `/api/share` (PWA)
- `/api/open-file` (PWA)
- `/api/handle-protocol` (PWA)

### 2.7 Security Caching
**Status**: ✅ ACTIVELY USED

**CSRF Token Protection** (`src/lib/csrf.ts`):
- Generated per session
- Stored in cookie (NOT httpOnly - client can read for header)
- Double-submit pattern (cookie + header validation)
- 24-hour expiry

**Request Validation**:
- Middleware validates all POST/PUT/DELETE/PATCH requests
- Session creation endpoints exempt

---

## 3. TECHNOLOGIES USED

### Core Stack
| Tech | Version | Purpose |
|------|---------|---------|
| Next.js | 15.5.4 | React framework with SSR |
| React | 19.0.0 | UI library |
| TypeScript | 5.9.3 | Type safety |
| Tailwind CSS | 4.1.16 | Styling |
| MDX | 3.1.1 | Content (blog/docs) |
| Supabase JS | 2.75.0 | Database client |
| Nodemailer | 7.0.9 | Email service |
| next-intl | 4.3.12 | i18n framework |

### Performance Tools
- `@next/bundle-analyzer` - Bundle size analysis
- `framer-motion` 12.23.24 - Animations
- `lucide-react` 0.546.0 - Icons
- `react-hook-form` 7.57.0 - Form management
- `zod` 3.25.51 - Schema validation

### Build Optimization
- Output: "standalone" (production-optimized)
- Package imports optimization for lucide-react, framer-motion, react-hook-form
- CSS optimization enabled
- Console removal in production
- No source maps in production
- Webpack chunk splitting configured

---

## 4. API ROUTES & DATA FETCHING PATTERNS

### Public Data Endpoints (with HTTP Caching)

#### Projects & Portfolio
```
GET /api/projects?status=active&category=web&featured=true
├─ Deduplication: Yes (by query params)
├─ Cache: 1h + 2h SWR
├─ Database: Supabase "projects" table
└─ Filter Fields: visible, status, category, featured, display_order
```

#### Pricing
```
GET /api/pricing/tiers?type=professional&popular=true
├─ Deduplication: Yes
├─ Cache: 1h + 2h SWR
└─ Database: "pricing_tiers" table (active only)

GET /api/pricing/items?category=addon
├─ Deduplication: Yes
├─ Cache: 1h + 2h SWR
└─ Database: "pricing_items" table (active only)
```

#### Technologies
```
GET /api/projects/technologies
├─ Deduplication: No (no filters)
├─ Cache: 24h + 2d SWR
└─ Database: "technologies" table
```

### Dynamic Form/Survey Endpoints

#### Form Lifecycle
```
POST /api/form (Session Creation)
├─ Request Deduplication: No
├─ Cache: force-dynamic (new session each time)
├─ Returns: session_id, csrf_token, preloaded questions
├─ Parallel fetch: Session insert + Questions fetch
└─ Side Effect: CSRF token in cookie

GET /api/form/questions?locale=en
├─ Cache: 1h + 1d SWR
└─ Locale-specific question text

POST /api/form/submit
├─ Cache: force-dynamic (no caching for submissions)
├─ Side Effects:
│  ├─ Insert form_answers
│  ├─ Cache session in session_cache table
│  ├─ Send customer thank-you email
│  └─ Send admin notification email
└─ Validations: CSRF token, session ID, rate limiting
```

#### Survey Lifecycle
```
POST /api/survey (Session Creation)
├─ Similar to form creation
└─ Parallel operations

GET /api/survey/questions?locale=en
├─ Cache: no-store, must-revalidate (session-specific)
└─ NO request deduplication

POST /api/survey/submit
├─ Similar to form submit
└─ Database: "survey_answers" table
```

### Other Endpoints
```
POST /api/contact (Contact form submission)
├─ Email recipients, session tracking
├─ Newsletter opt-in support
└─ Rate limited

GET /api/health (Health check)
├─ Simple ping endpoint
└─ Used by Docker health checks

POST /api/projects/revalidate (On-Demand ISR)
├─ Requires: Bearer token (REVALIDATE_TOKEN)
├─ Action: Revalidates /[locale]/projects page
└─ Returns: Timestamp and path

POST /api/newsletter/subscribe
├─ Email validation, tracking
└─ Database: newsletter_subscribers

POST /api/cookies/consent
├─ Cookie consent tracking
└─ Database: cookie_consents table
```

### Database Query Patterns

**Server Components** (SSR during build/request):
- Direct Supabase client queries
- Automatic Next.js request deduplication
- Data included in HTML or JSON responses

**Client Components**:
- Fetch API calls to `/api/*` routes
- React Query/SWR patterns (implied from component structure)
- Offline support via session cache (localStorage)

---

## 5. DOCKER & DEPLOYMENT SETUP

### docker-compose.yml Structure

#### App Service
```yaml
Services:
  - fredonbytes-app (Next.js)
    Ports: 3000:3000
    Health Check: HTTP GET /api/health (30s interval)
    Depends On: Redis (service_healthy condition)
    Environment Variables:
      - NODE_ENV=production
      - REDIS_URL=redis://redis:6379 (available but unused)
      - All Supabase credentials
      - SMTP credentials (Nodemailer)
      - Domain config
      - SEO verification codes
```

#### Redis Service
```yaml
  - fredonbytes-redis
    Image: redis:7-alpine
    Command: --maxmemory 256mb --maxmemory-policy allkeys-lru
    Health Check: redis-cli ping (10s interval)
    Volumes: redis-data:/data (persistent)
    Labels:
      - coolify.managed=true
      - traefik.enable=false (internal only)
```

### Dockerfile (Multi-stage)
```dockerfile
Stage 1 (deps): npm ci --only=production
Stage 2 (builder): npm ci + npm run build + NEXT_TELEMETRY_DISABLED
Stage 3 (runner): Production image
  - Node 20-alpine
  - Non-root user (nextjs:1001)
  - Standalone output
  - Port 3000
```

---

## 6. ENVIRONMENT VARIABLES

### Caching-Related Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `REDIS_URL` | Redis connection (configured, unused) | `redis://redis:6379` |
| `NODE_ENV` | Environment type | `production` \| `development` |
| `REVALIDATE_TOKEN` | On-demand ISR auth | Bearer token |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for caching | `https://fredonbytes.cz` |

### Data/Service Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server-side only)
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
NEXT_PUBLIC_SUPPORT_EMAIL, NEXT_PUBLIC_CONTACT_EMAIL
CSRF_SECRET (if needed)
```

---

## 7. STATIC/DYNAMIC RENDERING PATTERNS

### Static Pages (generateStaticParams)
```typescript
// Built at compile time for all locales
- `/[locale]/` (home)
- `/[locale]/projects`
- `/[locale]/pricing`
- `/[locale]/about`
- `/[locale]/terms`
- etc.

// Pattern:
export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}
// Generates: en/, cs/, de/ versions
```

### ISR Pages
```typescript
// Revalidates on interval
- /projects (1h)
- / (24h)
- /pricing (7d)
- /about (7d)

// Pattern:
export const revalidate = 3600 // seconds
```

### Dynamic Pages (No Pre-rendering)
```typescript
// Rendered on-demand
- /form/[session_id]
- /survey/[session_id]

// Pattern:
export const revalidate = false
export const dynamic = "force-dynamic"
```

---

## 8. PERFORMANCE INSIGHTS

### Current Optimizations ✅
1. **Request Deduplication**: Eliminates duplicate DB queries within 100ms
2. **HTTP Caching**: CDN-friendly headers (s-maxage for server caches)
3. **Stale-While-Revalidate**: Serves stale content while fetching fresh data
4. **ISR**: Static pages with scheduled regeneration
5. **Image Optimization**: 
   - WebP/AVIF formats
   - Responsive device sizes
   - 7-day cache TTL
6. **Bundle Optimization**:
   - Webpack chunk splitting (framework, vendor, common)
   - CSS optimization
   - Console removal in production
   - Package import optimization
7. **Rate Limiting**: Prevents API abuse (10 req/min/IP)
8. **Session Caching**: Client-side localStorage for offline continuity

### Potential Improvements (Redis Ready)
1. **Distributed Caching**: Use Redis for cross-instance request deduplication
2. **Session Store**: Move session cache from DB to Redis
3. **Rate Limit Persistence**: Persist rate limits across instances
4. **Cache Invalidation**: Implement Pub/Sub for cache busting
5. **API Response Caching**: Cache frequently accessed API responses
6. **Database Query Caching**: Cache Supabase queries for 5-30 minutes
7. **Form/Survey Metadata**: Cache questionnaire definitions

---

## 9. CACHING CONFIGURATION SUMMARY

### Cache-Control Headers Strategy
```
Public Data (long-lived):
  - s-maxage=3600 (1h server cache)
  - stale-while-revalidate=7200 (2h)
  - Perfect for: Projects, Pricing, Technologies

Public Data (very static):
  - s-maxage=86400 (24h server cache)
  - stale-while-revalidate=172800 (2d)
  - Perfect for: Static technology list

Session-Specific (no cache):
  - no-store, must-revalidate
  - Used for: Survey questions, form submissions

Static Assets:
  - max-age=31536000 (1 year)
  - immutable flag
  - Perfect for: Images, fonts, manifests
```

### Middleware Flow
```
Request → Domain Redirect Check
       → Static Route Skip
       → API Route Processing:
         ├─ CSRF Validation
         ├─ Rate Limiting
         └─ CSRF Token Generation
       → i18n Middleware (non-API)
```

---

## 10. SECURITY & CACHING INTERACTION

### CSRF Token Strategy
- **Generation**: Automatic on first API request
- **Storage**: Cookie (NOT httpOnly, readable by JS)
- **Validation**: Cookie + Header must match (double-submit pattern)
- **TTL**: 24 hours
- **Excluded from Cache**: Dynamically generated per request

### Rate Limiting Impact on Caching
- Applied after CSRF validation
- Returns 429 with `Retry-After` header
- Doesn't cache rate-limited responses
- IP extraction: x-forwarded-for (Coolify/Traefik aware)

---

## 11. RECOMMENDATIONS FOR OPTIMIZATION

### Quick Wins (No Infrastructure Changes)
1. ✅ Already doing most optimizations!
2. Increase ISR revalidate times where appropriate (currently well-tuned)
3. Monitor bundle size with analyzer script

### Redis Integration (Ready to Use)
```typescript
// Pattern for Redis-backed request caching:
import Redis from "redis";

export async function getCachedProjects(filters) {
  const key = `projects:${JSON.stringify(filters)}`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await supabase.from("projects").select(...);
  await redis.setex(key, 3600, JSON.stringify(data));
  return data;
}
```

### Session Cache → Redis
```typescript
// Move from DB to Redis for faster access
const sessionCacheKey = `session:${sessionId}`;
await redis.setex(sessionCacheKey, 86400, JSON.stringify(data));
```

---

## 12. SUMMARY TABLE

| Caching Layer | Status | Type | TTL | Scope |
|--------------|--------|------|-----|-------|
| Request Deduplication | ✅ Active | In-Memory | 100ms | Per request |
| Session Cache | ✅ Active | localStorage | 24h | Browser |
| HTTP Headers | ✅ Active | CDN | 1h-7d | Public |
| ISR | ✅ Active | Static Gen | 1h-7d | Build time |
| Rate Limiting | ✅ Active | In-Memory | 1m | Per IP |
| CSRF Tokens | ✅ Active | Cookie | 24h | Session |
| Image Caching | ✅ Active | Static | 1y | Browser |
| Redis | ❌ Configured | Distributed | Custom | (Ready) |

