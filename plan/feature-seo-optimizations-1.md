---
goal: Optimize SEO for conversion and Lighthouse/GMB compatibility across the Next.js 15 project
version: 1.0
date_created: 2025-11-14
last_updated: 2025-11-14
owner: FredonBytes / SEO & Engineering Team
status: 'In progress'
tags: [feature, seo, lighthouse, gmb, nextjs, i18n, structured-data, metadata]
---

# SEO Optimizations & Lighthouse Implementation Plan

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

This implementation plan aims to optimize SEO for conversion and ensure compatibility with Google My Business (GMB) and Google Search across the Next.js 15 project. The plan includes metadata optimization, JSON-LD structured data validation, sitemap/robots.txt configuration, and Lighthouse performance improvements to ensure consistent locale/hreflang handling and canonical URL generation.

## 1. Requirements & Constraints

- **REQ-001**: Next.js 15 (App Router) project — use `Metadata` APIs and `generateMetadata` server functions for all metadata generation
- **REQ-002**: Maintain multi-locale support: locales ["cs","en","de"] via `src/i18n/routing.ts` with consistent `localePrefix: 'always'`
- **REQ-003**: Site must be conversion-focused: services (0.9 priority), contact, pricing pages are primary conversion targets
- **REQ-004**: All pages must have consistent canonical/hreflang URLs matching sitemap entries exactly
- **REQ-005**: Implement CI validation for Lighthouse scores and Schema.org JSON-LD validation
- **SEC-001**: CSP and `Content-Security-Policy` must remain compatible with analytics and `dangerouslySetInnerHTML` for JSON-LD injection
- **CON-001**: Do not break ISP-critical production environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRIMARY_DOMAIN`
- **CON-002**: Avoid user data exposure in public JSON-LD if env var is missing; **no placeholder** values that mislead GMB or search engines
- **GUD-001**: Use `sitemap` & `robots` route generators with `sitemap index` if >50k URLs for efficient crawling
- **PAT-001**: Use site-wide `Organization` JSON-LD in `LocaleLayout` (site-level Schema) and per-page structured data for services/pages (FAQ, Pricing/Offers)

## 2. Implementation Steps

### Implementation Phase 1 — Critical fixes (canonical/hreflang + schema data)

**GOAL-001**: Fix critical canonical, `hreflang`, LocalBusiness address gaps, and invalid icon sizes to avoid immediate SEO penalties.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Fix `localePrefix` inconsistency: Update canonical/hreflang generation to rely on `routing.localePrefix` and ensure `cs` is prefixed when `localePrefix === 'always'` | ✅ | 2025-11-14 |
| TASK-002 | Add missing `streetAddress` and `postalCode` to `LocalBusiness` JSON-LD and make fields configurable via env vars (`NEXT_PUBLIC_BUSINESS_STREET`, `NEXT_PUBLIC_BUSINESS_POSTAL_CODE`) | ✅ | 2025-11-14 |
| TASK-003 | Fix invalid Apple icon sizes in `src/config/metadata.ts` — remove empty `sizes` values | ✅ | 2025-11-14 |
| TASK-004 | Add `x-default` to metadata `alternates` for canonical page fallback and finalize Phase 1 | ✅ | 2025-11-14 |

**Files affected**:

- `src/config/metadata.ts` — canonical/hreflang generation, x-default, icon fixes
- `src/lib/metadata/home.ts` — locale prefix usage
- `src/app/sitemap.ts` — locale prefix patterns validation
- `src/app/robots.ts` — sitemap references
- `src/lib/jsonLd/home.ts` — LocalBusiness schema address fields
- `src/app/[locale]/layout.tsx` — site-level schema injection

**Implementation details**:

**TASK-001** (Canonical/hreflang):

- Updated `src/config/metadata.ts`:
  - Changed `const localePrefix = locale === "cs" ? "" : \`/\${locale}\`` to `const localePrefix = \`/\${locale}\`` for consistency with `routing.localePrefix === 'always'`
  - Used `localePrefix` consistently when building `canonicalUrl`
  - Updated `alternates.languages` to use `routing.locales` deterministically
  - Added `x-default`: `alternates.languages['x-default'] = baseUrl + '/' + routing.defaultLocale`

**TASK-002** (LocalBusiness address):

- Added environment variables `NEXT_PUBLIC_BUSINESS_STREET` and `NEXT_PUBLIC_BUSINESS_POSTAL_CODE`
- Updated `src/lib/jsonLd/home.ts` to use env vars for `streetAddress` and `postalCode` with clear failure if missing

**TASK-003** (Icons):

- Removed invalid empty `sizes` value from `apple` icon configuration in `src/config/metadata.ts`

**TASK-004** (x-default):

- Added `x-default` alternate to all metadata generation functions

**Validation**:

- ✅ Sitemap URLs use `/${locale}/...` pattern consistently for all locales including `cs`
- ✅ Canonical alt languages generate `x-default` link
- ✅ LocalBusiness schema has non-empty `streetAddress` and `postalCode`

**Completion criteria**:

- ✅ All canonical/hreflang URLs and sitemap entries are consistent
- ✅ LocalBusiness address includes street + postal code from env vars
- ✅ Apple icons have valid `sizes` values
- ✅ Changes validated with schema-check script

---

### Implementation Phase 2 — Schema consolidation & site-wide improvements

**GOAL-002**: Centralize Organization/LocalBusiness schema across the site and ensure consistent inclusion on every page.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create `src/lib/jsonLd/organization.ts` to export `getOrganizationSchemas(locale)` and include in layout for all pages | ✅ | 2025-11-14 |
| TASK-006 | Centralize `LocalBusiness` schema config and reference in all pages requiring business info (Contact, Home, Projects) | ✅ | 2025-11-14 |
| TASK-007 | Add organization schema to site-level `layout.tsx` to ensure availability across all pages (not just home) | ✅ | 2025-11-14 |

**Files affected**:

- `src/lib/jsonLd/organization.ts` — NEW: centralized Organization + LocalBusiness JSON-LD
- `src/lib/jsonLd/home.ts` — remove schema duplicates
- `src/app/[locale]/layout.tsx` — inject organization schemas site-wide

**Implementation details**:

**TASK-005** (Organization schema creation):

- Created `src/lib/jsonLd/organization.ts` with `getOrganizationSchemas(locale)` function
- Returns Organization and LocalBusiness JSON-LD objects with `@id` references (`#organization`, `#localbusiness`)
- Uses `getTranslations` for localized fields (slogan, description)

**TASK-006** (Schema centralization):

- Removed duplicate Organization/LocalBusiness schemas from individual pages
- All pages now reference centralized schemas via `@id` pointers

**TASK-007** (Site-level injection):

- Updated `src/app/[locale]/layout.tsx` to import and inject organization schemas
- Added `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` for each schema

**Validation**:

- ✅ Organization & LocalBusiness JSON-LD available on all pages
- ✅ Schema validation passes on home, contact, service pages

**Completion criteria**:

- ✅ Organization JSON-LD present on all pages
- ✅ LocalBusiness address and contact details consistent across site

---

### Implementation Phase 3 — Per-page conversion schema & OpenGraph

**GOAL-003**: Add `Service` schema and `Offer` schema for money pages; ensure FAQ & breadcrumb schema present where applicable. Optimize OG image handling for dynamic routes.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Add `Service` JSON-LD to `ServicePageTemplate` (`src/components/services/ServicePageTemplate.tsx`) | ✅ | 2025-11-14 |
| TASK-009 | Ensure pricing `Offer` schema uses numeric CZK prices for structured data validation | ✅ | 2025-11-14 |
| TASK-010 | Align OpenGraph image handling with dynamic `opengraph-image.tsx` outputs and fallbacks | ✅ | 2025-11-14 |

**Files affected**:

- `src/components/services/ServicePageTemplate.tsx` — Service JSON-LD implementation
- `src/app/[locale]/pricing/page.tsx` — Offer schema validation
- `src/app/[locale]/services/*/opengraph-image.tsx` — OG image generation
- `src/app/[locale]/page.tsx` — consolidated home schemas

**Implementation details**:

**TASK-008** (Service schema):

- Added `Service` JSON-LD to `ServicePageTemplate`:

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": t("title"),
  "description": t("description"),
  "provider": { "@id": `${baseUrl}/#organization` },
  "serviceType": config.slug,
  "url": pageUrl,
  "areaServed": "CZ",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "CZK",
    "price": "0",
    "url": `${pageUrl}#contact`
  }
}
```

- FAQ JSON-LD added conditionally when FAQ items exist in translations

**TASK-009** (Pricing offers):

- Updated `src/lib/jsonLd/pricing.ts` to use numeric prices (`priceCZK: 15000`) instead of string values
- Validated `ItemList` with `Offer` type and proper currency/price properties

**TASK-010** (OpenGraph images):

- Verified `opengraph-image.tsx` dynamic route implementation
- Ensured `metadataBase` properly configured for OG image URLs
- Added fallback to static images when dynamic generation fails

**Validation**:

- ✅ Schema validator confirms `Service` markup on service pages
- ✅ Pricing page has valid `Offer/Product` schema with numeric prices

**Completion criteria**:

- ✅ All services pages contain `Service` JSON-LD
- ✅ Pricing page has valid offers with correct currency and numeric prices

---

### Implementation Phase 4 — Performance & Lighthouse optimizations

**GOAL-004**: Improve Lighthouse SEO, Performance & Accessibility scores by optimizing fonts, images, and script loading.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Evaluate and migrate to `next/font` for JetBrains Mono to improve LCP/CLS (replace `@fontsource` with `next/font/local` or `next/font/google`) | | |
| TASK-012 | Add `preconnect`/`preload` for fonts & critical resources (images, analytics endpoints). Add `rel="preload"` for hero images / LCP images | | |
| TASK-013 | Ensure `next/image` is used for critical images with width/height, `priority={true}` if above-the-fold | | |
| TASK-014 | Defer non-critical third-party scripts and move analytics behind consent; ensure `ConditionalAnalytics` loads only after consent | | |

**Files to update**:

- `src/app/[locale]/layout.tsx` — font optimization & analytics head
- `src/components/homepage/hero/DesktopHeroSection.tsx` — LCP image priority
- `src/components/homepage/hero/MobileHeroSection.tsx` — LCP image priority
- `src/components/*` — ensure `next/image` usage with proper dimensions

**Implementation details**:

**TASK-011** (Font optimization):

- Replace `@fontsource/jetbrains-mono` imports with `next/font/local` in `layout.tsx`
- Add `className={jetbrains.className}` to root element or CSS variable
- Configure `font-display: swap` for optimal performance

**TASK-012** (Resource preloading):

- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` if using Google Fonts
- Add `<link rel="preconnect" href="https://ihvltxbaodpqgbnwfxdd.supabase.co">` for Supabase images
- Preload critical hero images: `<link rel="preload" href="/hero-image.avif" as="image">`
- Preload critical fonts: `<link rel="preload" href="/fonts/jetbrains-mono.woff2" as="font" type="font/woff2" crossorigin>`

**TASK-013** (Image optimization):

- Update `DesktopHeroSection` and `MobileHeroSection`:
  - Add `priority={true}` prop to hero images
  - Add explicit `width` and `height` props
  - Use modern formats (AVIF, WebP) with fallbacks
- Audit all above-the-fold images for `priority` prop

**TASK-014** (Script optimization):

- Ensure analytics scripts load only after user consent
- Use `<Script strategy="lazyOnload">` for non-critical scripts
- Move analytics behind `ConditionalAnalytics` component with consent check

**Validation**:

- Run `npx lighthouse --output=json --output-path=./lighthouse-report.json http://localhost:3000`
- Target scores: SEO >= 95, Performance >= 70, Accessibility >= 90

**Completion criteria**:

- LCP reduced to < 2.5s on hero pages
- CLS reduced to < 0.1
- No blocking fonts causing layout shifts
- `next/image` used for all critical images with `priority` set

---

### Implementation Phase 5 — Sitemaps, Robots, and indexing optimizations

**GOAL-005**: Ensure sitemaps, robots, and meta tags allow efficient crawl and GMB and Google Search indexing.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Ensure sitemap and robots.txt align with structured data and locale patterns | ✅ | 2025-11-14 |
| TASK-016 | Ensure robots.txt `sitemap` matches the sitemaps output (both dynamic & static) | | |
| TASK-017 | Add secure canonical & hreflang for pages with `x-default` and `alternates` consistent across `generateMetadata` output and sitemap | | |

**Files to update**:

- `src/app/sitemap.ts` — split into sitemap index + sub-sitemaps if needed
- `src/app/robots.ts` — ensure sitemap references match
- `src/app/[locale]/layout.tsx` & metadata generation — ensure alternates/hreflang

**Implementation details**:

**TASK-015** (Sitemap validation):

- ✅ Verified sitemap uses consistent locale prefixes (`/${locale}/path`)
- ✅ All locales (cs, en, de) included in alternates
- ✅ Priority values set correctly (services: 0.9, home: 1.0, legal: 0.4)

**TASK-016** (Robots.txt alignment):

- Verify `robots.ts` sitemap URL matches actual sitemap location
- If implementing sitemap index, update robots to reference index: `Sitemap: https://fredonbytes.eu/sitemap-index.xml`
- Ensure all sub-sitemaps listed in index

**TASK-017** (Canonical consistency):

- Audit all `generateMetadata` functions for canonical URL consistency
- Ensure `x-default` alternate present on all pages
- Validate hreflang URLs match sitemap entries exactly

**Validation**:

- Test sitemap with Google Search Console sitemap tester
- Validate with `https://www.xml-sitemaps.com/validate`
- Confirm `robots.txt` accessible at root

**Completion criteria**:

- Sitemap indexed successfully in GSC
- Sitemap index references correct if using multiple sitemaps
- Robots.txt includes correct sitemap references
- All canonical URLs match sitemap entries

---

### Implementation Phase 6 — Monitoring & CI validations

**GOAL-006**: Add CI validations for structured data and Lighthouse checks.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Add `scripts/validate-jsonld.js` to traverse pages and call Schema.org validator | ✅ | 2025-11-14 |
| TASK-019 | Add `.github/workflows/seo-lighthouse.yml` to run headless Lighthouse checks and structured-data validation on PRs & scheduled runs | | |
| TASK-020 | Add `scripts/validate-canonical.js` to ensure canonical/hreflang x-default presence | ✅ | 2025-11-14 |

**Files to create**:

- `scripts/validate-jsonld.js` — ✅ JSON-LD schema validation
- `scripts/validate-canonical.js` — ✅ canonical/hreflang validation
- `.github/workflows/seo-lighthouse.yml` — NEW: Lighthouse CI workflow
- `.github/workflows/jsonld-validation.yml` — NEW: JSON-LD validation workflow

**Implementation details**:

**TASK-018** (JSON-LD validation):

- ✅ Created `scripts/validate-jsonld.js`
- Validates presence of required schema types per page type
- Checks Organization, LocalBusiness, Service, Offer, FAQ schemas
- Validates schema properties (name, url, address, telephone, etc.)

**TASK-019** (CI Lighthouse workflow):
Create `.github/workflows/seo-lighthouse.yml`:

```yaml
name: SEO & Lighthouse CI

on:
  pull_request:
    branches: [main, master]
  schedule:
    - cron: '0 0 * * 0' # Weekly on Sunday

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Next.js
        run: npm run build
      
      - name: Start server
        run: npm start &
        env:
          NODE_ENV: production
      
      - name: Wait for server
        run: npx wait-on http://localhost:3000 -t 60000
      
      - name: Run Lighthouse
        run: |
          npm install -g @lhci/cli
          lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
      
      - name: Validate JSON-LD
        run: node scripts/validate-jsonld.js
      
      - name: Validate Canonical URLs
        run: node scripts/validate-canonical.js
```

Create `lighthouserc.json`:

```json
{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3000/cs",
        "http://localhost:3000/en",
        "http://localhost:3000/cs/services/development",
        "http://localhost:3000/cs/pricing",
        "http://localhost:3000/cs/contact"
      ],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:seo": ["error", {"minScore": 0.95}],
        "categories:performance": ["warn", {"minScore": 0.70}],
        "categories:accessibility": ["warn", {"minScore": 0.90}]
      }
    }
  }
}
```

**TASK-020** (Canonical validation):

- ✅ Created `scripts/validate-canonical.js`
- Validates canonical URL presence
- Checks hreflang alternates for all locales
- Ensures `x-default` alternate present

**Validation**:

- CI workflow runs successfully on PR
- Lighthouse scores meet thresholds (SEO >= 95, Performance >= 70)
- JSON-LD validation passes without errors
- Canonical validation passes without errors

**Completion criteria**:

- CI runs for PRs and detects score drops
- Schema validator returns no critical errors
- Automated validation prevents SEO regressions

---

## 3. Alternatives

- **ALT-001**: Keep Organization JSON-LD only on home vs. include site-wide in layout
  - **Chosen**: Include site-wide (preferred for consistent schema across all pages and better SEO)
  - **Rationale**: Ensures every page has organization context, better for Google Knowledge Graph
  
- **ALT-002**: Hardcode business address in JSON-LD vs. use env vars
  - **Chosen**: Use env vars (secure & dynamic)
  - **Rationale**: Allows easy updates without code changes, better for multi-environment deployments
  
- **ALT-003**: Keep font imports via `@fontsource` vs migrate to `next/font`
  - **Chosen**: Migrate to `next/font` for LCP & CLS improvements
  - **Fallback**: If migration blocked, use `font-display: swap` and `preload`
  - **Rationale**: `next/font` provides automatic optimization, self-hosting, and reduces layout shift

- **ALT-004**: Single sitemap vs. sitemap index with sub-sitemaps
  - **Chosen**: Single sitemap (current URL count < 1000)
  - **Future**: Implement sitemap index if URLs exceed 50k
  - **Rationale**: Simpler maintenance, faster crawling for current site size

## 4. Dependencies

- **DEP-001**: Environment variables
  - `NEXT_PUBLIC_SITE_URL` — Base URL for canonical links
  - `NEXT_PUBLIC_PRIMARY_DOMAIN` — Primary domain for SEO
  - `NEXT_PUBLIC_BUSINESS_STREET` — Business street address for LocalBusiness schema
  - `NEXT_PUBLIC_BUSINESS_POSTAL_CODE` — Postal code for LocalBusiness schema
  - `NEXT_PUBLIC_BUSINESS_PHONE` — Contact phone number
  - `NEXT_PUBLIC_GOOGLE_VERIFICATION` — Google Search Console verification

- **DEP-002**: Google Search Console & GMB
  - Admin access to Google Search Console required
  - Google My Business listing configured and verified
  - Sitemap submitted to GSC

- **DEP-003**: Supabase configuration
  - Remote image patterns configured in `next.config.ts`
  - CDN URLs whitelisted for `next/image`

- **DEP-004**: CI/CD infrastructure
  - CI runner capable of headless Lighthouse (Ubuntu Linux images)
  - Node.js 20+ installed
  - Sufficient resources for production builds

- **DEP-005**: npm packages (existing)
  - `next` ^15.5.4
  - `next-intl` ^4.3.12
  - `@next/mdx` ^15.5.5
  - `lucide-react` ^0.546.0
  - `framer-motion` ^12.23.24
  - `lighthouse` (dev)

## 5. Files

- **FILE-001**: `src/config/metadata.ts` — ✅ Canonical/hreflang generation, x-default, icon fixes
- **FILE-002**: `src/lib/metadata/home.ts` — ✅ Locale prefix usage, metadataBase
- **FILE-003**: `src/app/[locale]/layout.tsx` — ✅ Site-level Organization JSON-LD, fonts (⏳ optimization pending)
- **FILE-004**: `src/lib/jsonLd/home.ts` — ✅ Address env vars, schema extraction
- **FILE-005**: `src/lib/jsonLd/organization.ts` — ✅ NEW: Centralized Organization + LocalBusiness JSON-LD
- **FILE-006**: `src/components/services/ServicePageTemplate.tsx` — ✅ Service JSON-LD
- **FILE-007**: `src/app/sitemap.ts` — ✅ Consistent locale prefix
- **FILE-008**: `src/app/robots.ts` — ⏳ Sitemap reference validation pending
- **FILE-009**: `scripts/validate-jsonld.js` — ✅ JSON-LD validation script
- **FILE-010**: `scripts/validate-canonical.js` — ✅ Canonical/hreflang validation script
- **FILE-011**: `.github/workflows/seo-lighthouse.yml` — ⏳ NEW: Lighthouse CI workflow (pending)
- **FILE-012**: `.github/workflows/jsonld-validation.yml` — ⏳ NEW: JSON-LD CI workflow (pending)
- **FILE-013**: `lighthouserc.json` — ⏳ NEW: Lighthouse CI configuration (pending)

**Legend**: ✅ Complete | ⏳ Pending | ❌ Blocked

## 6. Testing

- **TEST-001**: Schema Validation
  - **Tool**: `scripts/validate-jsonld.js`
  - **Coverage**: Organization, LocalBusiness, Service, Offer, FAQ, Breadcrumb, WebSite
  - **Status**: ✅ Script created and functional
  - **Validation**: Schema types present and properties validated

- **TEST-002**: Canonical/Hreflang Consistency
  - **Tool**: `scripts/validate-canonical.js`
  - **Coverage**: All pages (cs, en, de locales)
  - **Status**: ✅ Script created and functional
  - **Validation**: Canonical matches sitemap, `x-default` present, hreflang for all locales

- **TEST-003**: Lighthouse Automation
  - **Tool**: `lighthouse-ci` with `lighthouserc.json`
  - **Thresholds**: SEO >= 95, Performance >= 70, Accessibility >= 90
  - **Status**: ⏳ Workflow pending creation
  - **Validation**: Scores meet thresholds on PR and scheduled runs

- **TEST-004**: Sitemap & Robots
  - **Tool**: CI job + Google Search Console
  - **Coverage**: Sitemap structure, robots.txt rules
  - **Status**: ⏳ CI validation pending
  - **Validation**: Sitemap contains expected routes, robots.txt references correct sitemap

- **TEST-005**: OpenGraph Image Metadata
  - **Tool**: Manual verification + automated OG scraper
  - **Coverage**: All pages with dynamic OG images
  - **Status**: ✅ Verified during Phase 3
  - **Validation**: `og:image` meta tags present, sizes correct, matches `metadataBase`

- **TEST-006**: LocalBusiness JSON-LD Properties
  - **Tool**: `scripts/validate-jsonld.js` + Schema.org validator
  - **Coverage**: `streetAddress`, `postalCode`, `telephone`
  - **Status**: ✅ Validation passing
  - **Validation**: All required properties defined and non-empty

## 7. Risks & Assumptions

- **RISK-001**: Missing or inaccurate business address env vars
  - **Impact**: False GMB info or site errors, poor local SEO
  - **Mitigation**: Require env var presence in staging/production with CI check, clear error logging
  - **Severity**: HIGH
  
- **RISK-002**: Inconsistent `cs` prefix behavior
  - **Impact**: Broken links or redirects, poor user experience
  - **Mitigation**: Ensure alignment of `routing.localePrefix` with canonical URL generation, implement redirects
  - **Severity**: MEDIUM
  
- **RISK-003**: CI Lighthouse check instability
  - **Impact**: False failures, blocked PRs
  - **Mitigation**: Set reasonable thresholds, allow re-runs, use median of 3 runs
  - **Severity**: LOW
  
- **RISK-004**: Font migration breaking visual design
  - **Impact**: Layout shifts, poor CLS score
  - **Mitigation**: Thorough visual QA, fallback to `font-display: swap` if needed
  - **Severity**: MEDIUM

- **ASSUMPTION-001**: Project owner has admin access to Google Search Console & GMB
  - **Validation**: Required for sitemap submission and business listing verification
  
- **ASSUMPTION-002**: `@fontsource` to `next/font` migration is allowed
  - **Validation**: No design requirements blocking font optimization
  
- **ASSUMPTION-003**: Current URL count remains < 50k
  - **Validation**: Single sitemap sufficient, no need for sitemap index yet

## 8. Related Specifications / Further Reading

### Next.js Documentation

- [Metadata & App Router](https://nextjs.org/docs/app/api-reference/functions/generate-metadata) — Official metadata API reference
- [Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images) — `next/image` component guide
- [Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) — `next/font` usage and benefits

### SEO & Structured Data

- [Schema.org](https://schema.org/) — Structured data vocabulary and examples
- [Google Rich Results](https://developers.google.com/search/docs/appearance/structured-data) — LocalBusiness and structured data requirements
- [Google Structured Data Testing Tool](https://developers.google.com/search/docs/appearance/structured-data)

### Sitemaps & Crawling

- [Sitemap Best Practices](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview) — Google's sitemap guidelines
- [Robots.txt Specification](https://developers.google.com/search/docs/crawling-indexing/robots/intro) — Robots.txt format and usage

### Performance & Monitoring

- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — Automated Lighthouse testing
- [Web Vitals](https://web.dev/vitals/) — Core Web Vitals metrics and optimization
- [PageSpeed Insights](https://pagespeed.web.dev/) — Performance analysis tool

### Internationalization

- [Hreflang Implementation](https://developers.google.com/search/docs/specialty/international/localized-versions) — Google's hreflang guide
- [next-intl Documentation](https://next-intl-docs.vercel.app/) — Internationalization for Next.js

---

**Generated**: 2025-11-14  
**Last Updated**: 2025-11-14  
**Version**: 1.0  
**Status**: In progress (Phases 1-3 complete, Phases 4-6 pending)
