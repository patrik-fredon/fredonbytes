# Performance Optimization Plan (Recommendations 2-7)

**Date:** November 4, 2025  
**Status:** Planning  
**Target Improvements:** 60-70% TTFB reduction, 40-50% LCP improvement

---

## Overview

Based on performance audit results (Debug Log from /en, /cs, /de, /about, /projects, /pricing, /contact pages):

**Current Issues:**
- LCP: 1.7-5.4s (inconsistent across locales)
- TTFB: 1.2-2.0s on data-heavy pages (poor)
- FCP: 2.0s on projects page (needs improvement)
- Project card images loading sequentially (waterfall pattern)

**Expected Results After Implementation:**
- TTFB: <200ms (from 1200-2000ms)
- LCP: <2.0s (from 1.7-5.4s)
- FCP: <1.2s (from 2.0s)
- CLS: <0.1 (maintain current good state)

---

## Recommendation 2: Image Lazy Loading + Blur Placeholders

### Why This Matters
- Projects page loads 10+ images without proper optimization
- Images loading in sequential waterfall pattern (priority not set)
- No blur placeholders = jarring layout shifts during load
- FCP 2048ms is too high (images blocking paint)

### Implementation Plan

#### 2.1 Setup Next.js Image Component Base
**File:** `src/lib/image-utils.ts` (NEW)
```typescript
// Reusable image optimization utilities
export const imageQuality = {
  hero: 80,          // Above-fold hero images
  thumbnail: 75,     // Project/service cards
  background: 60,    // Background images
};

export const imageSizes = {
  hero: '(max-width: 768px) 100vw, 1280px',
  card: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  thumbnail: '(max-width: 768px) 100vw, (max-width: 1024px) 100vw, 400px',
};
```

#### 2.2 Projects Page Images - Blur + Lazy Loading
**File:** `src/app/[locale]/projects/page.tsx` (MODIFY)

Replace inline `<img>` tags with Next.js Image component:
```typescript
import Image from 'next/image';
import { imageSizes, imageQuality } from '@/lib/image-utils';

// In ProjectCard component:
<Image
  src={project.imageUrl}
  alt={project.title}
  width={400}
  height={300}
  loading="lazy"              // Only load when in viewport
  quality={imageQuality.thumbnail}
  sizes={imageSizes.card}
  placeholder="blur"          // Show blur while loading
  blurDataURL={project.blurDataUrl}  // From Supabase metadata
  className="w-full h-auto rounded-lg"
/>
```

#### 2.3 Homepage Sections - Priority Hints
**Files:** `src/components/homepage/HeroSection.tsx`, `AboutSection.tsx`

```typescript
// Hero image (critical - above fold)
<Image
  src="/hero-image.png"
  alt="Hero"
  width={1280}
  height={720}
  priority              // Preload immediately
  quality={imageQuality.hero}
/>

// Below-fold images (lazy load)
<Image
  src="/about-image.png"
  alt="About"
  width={600}
  height={400}
  loading="lazy"
  quality={imageQuality.thumbnail}
  placeholder="blur"
/>
```

#### 2.4 Supabase Integration - Blur Data Generation
**File:** `src/lib/supabase-image-optimization.ts` (NEW)

```typescript
// Generate blur placeholder from Supabase images
import { sharp } from 'sharp';

export async function generateBlurDataUrl(imageUrl: string): Promise<string> {
  const buffer = await fetch(imageUrl).then(r => r.arrayBuffer());
  const blurred = await sharp(buffer)
    .resize(10, 10)
    .blur(10)
    .toBuffer();
  
  return `data:image/svg+xml;base64,${blurred.toString('base64')}`;
}
```

#### 2.5 Acceptance Criteria
- [ ] All project card images use Next.js Image with blur placeholder
- [ ] Hero images marked with `priority=true`
- [ ] Below-fold images use `loading="lazy"`
- [ ] FCP improves from 2048ms to <1200ms
- [ ] No layout shift when images load (CLS <0.05)

---

## Recommendation 3: Code-Split Form Components

### Why This Matters
- Contact form LCP: 5328ms (poor)
- FormClient.tsx likely loads all 3 form steps upfront
- Form JS bundle included in initial page load
- Only Step 1 visible on initial render (Steps 2-3 render after user interaction)

### Implementation Plan

#### 3.1 Convert Form Steps to Dynamic Imports
**File:** `src/app/[locale]/form/[session_id]/FormClient.tsx` (MODIFY)

**BEFORE:**
```typescript
import FormStep1 from './FormStep1';
import FormStep2 from './FormStep2';
import FormStep3 from './FormStep3';

// All 3 components loaded upfront → ~150KB JS
```

**AFTER:**
```typescript
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import FormSkeleton from '@/components/form/FormSkeleton';

const FormStep1 = dynamic(() => import('./FormStep1'), {
  loading: () => <FormSkeleton />,
  ssr: true,
});

const FormStep2 = dynamic(() => import('./FormStep2'), {
  loading: () => <FormSkeleton />,
  ssr: false,  // Load client-side only (step 2+ never server-rendered)
});

const FormStep3 = dynamic(() => import('./FormStep3'), {
  loading: () => <FormSkeleton />,
  ssr: false,
});

export default function FormClient() {
  const [currentStep, setCurrentStep] = useState(1);
  
  return (
    <Suspense fallback={<FormSkeleton />}>
      {currentStep === 1 && <FormStep1 onNext={() => setCurrentStep(2)} />}
      {currentStep === 2 && <FormStep2 onNext={() => setCurrentStep(3)} />}
      {currentStep === 3 && <FormStep3 onNext={() => setCurrentStep(1)} />}
    </Suspense>
  );
}
```

#### 3.2 Create Form Skeleton Loader
**File:** `src/components/form/FormSkeleton.tsx` (NEW)

```typescript
export default function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-slate-300 rounded w-3/4"></div>
      <div className="h-10 bg-slate-300 rounded"></div>
      <div className="h-10 bg-slate-300 rounded"></div>
    </div>
  );
}
```

#### 3.3 Contact Page Lazy Load
**File:** `src/app/[locale]/contact/page.tsx` (MODIFY)

```typescript
import dynamic from 'next/dynamic';

const ContactForm = dynamic(() => import('@/components/contact/ContactForm'), {
  loading: () => <FormSkeleton />,
  ssr: true,  // Keep SSR for SEO, but defer JS loading
});

export default function ContactPage() {
  return (
    <main>
      {/* Other content loads first */}
      <Suspense fallback={<FormSkeleton />}>
        <ContactForm />
      </Suspense>
    </main>
  );
}
```

#### 3.4 Acceptance Criteria
- [ ] FormStep2 and FormStep3 not in initial JS bundle
- [ ] Skeleton loader shows while dynamic import fetches
- [ ] LCP on /en/contact improves from 5328ms to <2500ms
- [ ] Form still functional (no errors in console)
- [ ] Mobile performance improves more than desktop (lower bandwidth)

---

## Recommendation 4: Font Loading Optimization

### Why This Matters
- Multiple JetBrains Mono weights (400, 500, 600, 700) loaded upfront
- Fonts not using `font-display: swap` (text invisible while loading)
- No preload hints for critical fonts
- Impacts FCP on all pages

### Implementation Plan

#### 4.1 Add font-display: swap to Globals
**File:** `src/app/globals.css` (MODIFY)

**BEFORE:**
```css
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
}
```

**AFTER:**
```css
@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 400;
  font-display: swap;  /* Show fallback immediately, swap when loaded */
  src: url('/fonts/jetbrains-mono-400.woff2') format('woff2');
}

@font-face {
  font-family: 'JetBrains Mono';
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/jetbrains-mono-600.woff2') format('woff2');
}

/* Remove 500, 700 weights (not used in design system) */
```

#### 4.2 Add Preload Hints
**File:** `src/app/[locale]/layout.tsx` (MODIFY)

```typescript
export default function LocaleLayout({ children, params }) {
  return (
    <html lang={params.locale}>
      <head>
        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-600.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### 4.3 Acceptance Criteria
- [ ] font-display: swap applied to all JetBrains Mono weights
- [ ] Preload links added for 400, 600 weights
- [ ] Unused weights (500, 700) removed from @font-face
- [ ] TTFB stays same, FCP improves by 50-100ms
- [ ] No font flash on page load (text visible immediately)

---

## Recommendation 5: Parallelize Supabase Queries

### Why This Matters
- Projects page TTFB: 1982ms (poor) - fetches projects sequentially
- Pricing page TTFB: 1246ms - fetches tiers then items in sequence
- Each query waits for previous one (waterfall pattern)
- Can fetch all at once with Promise.all()

### Implementation Plan

#### 5.1 Projects Route Optimization
**File:** `src/app/api/projects/route.ts` (MODIFY)

**BEFORE:**
```typescript
export async function GET() {
  const projects = await supabase.from('projects').select();        // Wait 500ms
  const technologies = await supabase.from('technologies').select(); // Wait 400ms
  const categories = await supabase.from('categories').select();    // Wait 300ms
  // Total: ~1.2s sequential
  return NextResponse.json({ projects, technologies, categories });
}
```

**AFTER:**
```typescript
export async function GET() {
  const [projects, technologies, categories] = await Promise.all([
    supabase.from('projects').select(),
    supabase.from('technologies').select(),
    supabase.from('categories').select(),
  ]);
  // Total: ~500ms parallel (longest query only)
  return NextResponse.json({ projects, technologies, categories });
}
```

#### 5.2 Pricing Route Optimization
**File:** `src/app/api/pricing/tiers/route.ts` (MODIFY)

```typescript
// Before: Fetch tiers, then for each tier fetch items (N+1 problem)
// After: Fetch all tiers and all items in parallel
const [tiers, items] = await Promise.all([
  supabase.from('pricing_tiers').select(),
  supabase.from('pricing_items').select(),
]);
```

#### 5.3 Add Database Query Indexes
**File:** `supabase/migrations/XX_add_performance_indexes.sql` (NEW)

```sql
-- Create indexes for frequently filtered columns
CREATE INDEX idx_projects_category_id ON projects(category_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_pricing_items_tier_id ON pricing_items(tier_id);
CREATE INDEX idx_technologies_category_id ON project_technologies(category_id);

-- Composite index for common queries
CREATE INDEX idx_projects_category_status 
  ON projects(category_id, status) WHERE status = 'active';
```

#### 5.4 Acceptance Criteria
- [ ] All API route GET functions use Promise.all() for parallel queries
- [ ] Database indexes created for frequently filtered columns
- [ ] TTFB on /api/projects improves from 1982ms to <600ms
- [ ] TTFB on /api/pricing/tiers improves from 1246ms to <500ms
- [ ] No N+1 query problems in logs

---

## Recommendation 6: Per-Locale Static Generation (ISG)

### Why This Matters
- Projects page rendered dynamically on every request
- Supabase query runs for every visitor
- Same projects data served to all users
- Ideal for static generation with hourly revalidation

### Implementation Plan

#### 6.1 Enable ISG on Projects Page
**File:** `src/app/[locale]/projects/page.tsx` (MODIFY)

```typescript
// Enable static generation with revalidation
export const revalidate = 3600; // Revalidate every 1 hour

export async function generateStaticParams() {
  const { locales } = routing; // ['cs', 'en', 'de']
  return locales.map(locale => ({ locale }));
}

export default async function ProjectsPage({ params: { locale } }) {
  // This runs at build time, then revalidated hourly
  const projects = await supabase.from('projects').select();
  return <ProjectsList projects={projects} />;
}
```

#### 6.2 Setup ISG on Layout
**File:** `src/app/[locale]/projects/layout.tsx` (MODIFY)

```typescript
export const revalidate = 3600;

export default function ProjectsLayout({ children }) {
  return <div>{children}</div>;
}
```

#### 6.3 Invalidate Cache on Data Change
**File:** `src/app/api/projects/revalidate/route.ts` (NEW)

```typescript
import { revalidatePath } from 'next/cache';
import { routing } from '@/i18n/routing';

export async function POST(req: Request) {
  // Verify webhook token
  const token = req.headers.get('x-webhook-token');
  if (token !== process.env.REVALIDATE_TOKEN) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Revalidate all locale versions
  for (const locale of routing.locales) {
    revalidatePath(`/${locale}/projects`, 'page');
  }

  return Response.json({ revalidated: true, now: Date.now() });
}
```

#### 6.4 Configure Supabase Webhook (Manual)
```
Supabase Dashboard > Database > Webhooks
  Event: INSERT, UPDATE, DELETE on projects table
  HTTP Push: POST /api/projects/revalidate
  Headers: x-webhook-token: <env var>
```

#### 6.5 Acceptance Criteria
- [ ] Projects page generated at build time for all locales
- [ ] First request TTFB: <100ms (static file served)
- [ ] Subsequent requests: <50ms
- [ ] ISG revalidation triggers on projects table changes
- [ ] Stale content shown for max 1 hour if webhook fails

---

## Recommendation 7: Request Deduplication Middleware

### Why This Matters
- Multiple simultaneous requests to same API endpoint
- "Thundering herd" problem on high traffic
- Duplicate database queries (each request hits DB separately)
- Need to coalesce in-flight requests

### Implementation Plan

#### 7.1 Create Request Cache Utility
**File:** `src/lib/request-cache.ts` (NEW)

```typescript
/**
 * Deduplication cache for in-flight requests
 * Prevents thundering herd: multiple identical requests coalesced into one
 * 
 * Example: 10 simultaneous requests to /api/projects
 * Without: 10 database queries
 * With: 1 database query, result shared to all 10 requests
 */

interface CacheEntry<T> {
  promise: Promise<T>;
  timestamp: number;
  ttl: number; // Time-to-live in ms
}

const requestCache = new Map<string, CacheEntry<any>>();

export async function deduplicateRequest<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 100, // Default 100ms deduplication window
): Promise<T> {
  const now = Date.now();
  const cached = requestCache.get(key);

  // Return cached promise if still valid
  if (cached && now - cached.timestamp < cached.ttl) {
    return cached.promise;
  }

  // Create new request promise
  const promise = fetcher().finally(() => {
    // Clean up after TTL expires
    setTimeout(() => {
      if (requestCache.get(key)?.promise === promise) {
        requestCache.delete(key);
      }
    }, ttl);
  });

  // Store in cache
  requestCache.set(key, { promise, timestamp: now, ttl });

  return promise;
}

export function clearCache(keyPattern?: string) {
  if (!keyPattern) {
    requestCache.clear();
  } else {
    for (const [key] of requestCache) {
      if (key.includes(keyPattern)) {
        requestCache.delete(key);
      }
    }
  }
}
```

#### 7.2 Apply to Projects API
**File:** `src/app/api/projects/route.ts` (MODIFY)

```typescript
import { deduplicateRequest } from '@/lib/request-cache';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const cacheKey = 'api:projects:all';

  const data = await deduplicateRequest(
    cacheKey,
    async () => {
      const [projects, technologies, categories] = await Promise.all([
        supabase.from('projects').select(),
        supabase.from('technologies').select(),
        supabase.from('categories').select(),
      ]);
      return { projects, technologies, categories };
    },
    100, // Deduplicate for 100ms
  );

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
```

#### 7.3 Apply to Pricing API
**File:** `src/app/api/pricing/tiers/route.ts` (MODIFY)

```typescript
const cacheKey = 'api:pricing:tiers';

const data = await deduplicateRequest(
  cacheKey,
  async () => {
    const [tiers, items] = await Promise.all([
      supabase.from('pricing_tiers').select(),
      supabase.from('pricing_items').select(),
    ]);
    return { tiers, items };
  },
  100,
);
```

#### 7.4 Apply to Contact API
**File:** `src/app/api/contact/route.ts` (MODIFY)

```typescript
const cacheKey = `api:contact:form:${sessionId}`;

const data = await deduplicateRequest(
  cacheKey,
  async () => {
    return supabase.from('form_submissions').insert(formData);
  },
  100,
);
```

#### 7.5 Acceptance Criteria
- [ ] Request deduplication middleware applied to high-traffic routes
- [ ] Deduplication window: 100ms (coalesce requests within 100ms)
- [ ] Concurrent requests return same promise (no duplicate DB queries)
- [ ] Cache clears automatically after TTL
- [ ] Manual cache invalidation available for admins

---

## Implementation Sequence

### Phase 1: Foundation (Week 1)
1. **Rec 4 - Font Loading** - Quickest win, independent
2. **Rec 7 - Request Deduplication** - Apply to all APIs, low risk

### Phase 2: Data Optimization (Week 2)
3. **Rec 5 - Parallelize Queries** - Run with Rec 7 for max effect
4. **Rec 6 - ISG Setup** - Build on Rec 5 optimization

### Phase 3: Client-Side (Week 3)
5. **Rec 2 - Image Lazy Loading** - Coordinate with Supabase image setup
6. **Rec 3 - Form Code-Splitting** - Test with QA

### Phase 4: Verification (Week 4)
7. **Performance Testing** - Lighthouse, WebPageTest, real-world metrics
8. **Rollout** - Staged deployment with monitoring

---

## Monitoring & Metrics

### Key Metrics to Track
- **TTFB:** Target <200ms (from 1200-2000ms)
- **LCP:** Target <2.0s (from 1.7-5.4s)
- **FCP:** Target <1.2s (from 2.0s on projects)
- **API Response Times:** Target <600ms (from 1.2-2.0s)
- **Cache Hit Rate:** Target >80%

### Monitoring Tools
1. **Vercel Analytics** - Real user metrics
2. **Google Search Console** - Core Web Vitals
3. **Lighthouse CI** - Automated regression testing
4. **Custom Dashboards** - Supabase performance logs

### Rollback Plan
If metrics degrade >5%:
1. Disable Redis caching (revert `lib/redis.ts` imports)
2. Revert to sequential queries (undo `Promise.all()`)
3. Remove ISG (`export const revalidate = 3600`)
4. Disable request deduplication

---

## Dependencies & Environment Variables

### New Environment Variables
```env
# Redis / Caching
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Webhook Token for cache revalidation
REVALIDATE_TOKEN=...
```

### New npm Packages
```bash
npm install @upstash/redis   # Redis client
npm install sharp            # Image optimization
```

### Breaking Changes
None - all changes backward compatible

---

## Success Criteria

- [ ] Phase 1 complete: Fonts loaded with swap, request deduplication live
- [ ] Phase 2 complete: Queries parallelized, ISG generating pages
- [ ] Phase 3 complete: Images lazy loading, forms code-split
- [ ] Lighthouse score: 85+ (from 70-82)
- [ ] TTFB: <200ms average (from 1200-2000ms)
- [ ] LCP: <2.0s (from 1.7-5.4s)
- [ ] Core Web Vitals: All green (LCP <2.5s, FID <100ms, CLS <0.1)
- [ ] Zero performance regressions on any page

---

## References

- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Upstash Redis](https://upstash.com/docs/redis)
- [Web Vitals](https://web.dev/vitals/)
- [ISG in Next.js](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

