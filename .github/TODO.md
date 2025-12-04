# TODO - FredonBytes

## 🔴 Critical Issues

### C2: 500 Internal Server Errors on Projects Page

- **Location**: [src/app/[locale]/projects/page.tsx](../src/app/%5Blocale%5D/projects/page.tsx)
- **Issue**: Multiple 500 errors when loading projects page; TTFB: 2028ms (poor)
- **Fix**: Check Supabase connection and optimize database queries
- **Priority**: Critical

## 🟠 High Priority Issues

### H1: Language Switcher Shows Wrong Locale

- **Location**: [src/components/LanguageSwitcher.tsx](../src/components/LanguageSwitcher.tsx)
- **Issue**: On `/de/` page, switcher displays "🇺🇸 English" instead of "🇩🇪 Deutsch" during SSR
- **Fix**: Use locale-aware rendering or neutral placeholder during hydration
- **Priority**: High

### H2: vendor.css MIME Type Error

- **Location**: Browser/Build configuration
- **Issue**: Console error: "Refused to execute script from vendor.css because MIME type ('text/css') is not executable"
- **Fix**: Check [next.config.ts](../next.config.ts) CSS handling or CDN/proxy MIME type configuration
- **Priority**: High

### H3: Upload API Slow Response

- **Location**: [src/app/api/upload/route.ts](../src/app/api/upload/route.ts)
- **Issue**: Access code validation takes 5-8 seconds
- **Fix**: Review rate limiting, Redis connection, and Supabase query performance
- **Priority**: High

## 🟡 Medium Priority Issues

### M1: Missing Autocomplete Attribute

- **Location**: [src/app/[locale]/upload/page.tsx](../src/app/%5Blocale%5D/upload/page.tsx)
- **Issue**: Password/access code input missing autocomplete attribute
- **Fix**: Add `autoComplete="new-password"` to access code input
- **Priority**: Medium

### M2: Google Analytics Placeholder

- **Location**: Environment configuration
- **Issue**: Using placeholder `your_google_analytics_id` in network requests
- **Fix**: Set `NEXT_PUBLIC_GA_ID` in production `.env`
- **Priority**: Medium

### M3: FCP Needs Improvement on Projects Page

- **Location**: [src/app/[locale]/projects/page.tsx](../src/app/%5Blocale%5D/projects/page.tsx)
- **Issue**: FCP is 2100ms (needs improvement)
- **Fix**: Optimize initial render, consider skeleton loading
- **Priority**: Medium

## 🟢 Low Priority / Informational

### L1: Mobile LCP Optimization

- **Location**: Homepage
- **Issue**: LCP is 3400ms on mobile (375px viewport)
- **Fix**: Optimize hero images, defer non-critical resources
- **Priority**: Low

---

## ✅ Completed / Verified

### SEO Phase 3: Image Optimization (2025-12-04)

- ✅ Created `src/lib/seo/image-alt.ts` with alt text generation utilities
- ✅ Created `src/components/common/OptimizedImage.tsx` wrapper component
- ✅ Features: automatic priority for above-fold, lazy loading, responsive sizes
- ✅ Alt text helpers: `generateImageAlt()`, `generateLocalizedImageAlt()`
- ✅ File naming helper: `generateImageFileName()` with keyword pattern

### SEO Phase 2: Directory Reorganization (2025-12-04)

- ✅ Created `src/lib/seo/` unified SEO directory structure
- ✅ Created `src/lib/seo/hreflang.ts` with hreflang generation helpers
- ✅ Moved metadata generators to `src/lib/seo/metadata/`
- ✅ Moved JSON-LD generators to `src/lib/seo/jsonld/`
- ✅ Created barrel exports for clean imports (`import { ... } from "@/lib/seo"`)
- ✅ Updated all imports across codebase
- ✅ Removed old `src/lib/metadata/` and `src/lib/jsonLd/` directories

### SEO Phase 1: Foundation Configuration (2025-12-04)

- ✅ Created centralized `src/lib/config/seo.config.ts` with SEO settings
- ✅ Created `src/lib/config/business.config.ts` with NAP data (single source of truth)
- ✅ Updated Footer.tsx to use businessConfig for phone/email hrefs
- ✅ Updated jsonLd/home.ts to use centralized config
- ✅ Phone number now consistent everywhere: `+420 799 027 984` (display) / `+420799027984` (tel:)
- ✅ C1 issue resolved: NAP data centralized

### Upload Feature (2025-12-03)

- ✅ Project dropdown loads from API
- ✅ Form validation works correctly
- ✅ Access code validation returns proper 401 for invalid codes
- ✅ All three locales have complete translations (en/cs/de)
- ✅ UI renders correctly on desktop and mobile
