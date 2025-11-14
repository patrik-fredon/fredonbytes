# TODO — Implementation Tasks

This file tracks active implementation tasks. For complete implementation plans, see `plan/` directory.

## Active Plan: SEO Optimizations (feature-seo-optimizations-1)

See full plan at: `plan/feature-seo-optimizations-1.md`

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Fix `localePrefix` inconsistency: Update canonical/hreflang generation to rely on `routing.localePrefix` and ensure `cs` is prefixed when `localePrefix === 'always'`. | ✅ | 2025-11-14 |
| TASK-002 | Add missing `streetAddress` and `postalCode` to `LocalBusiness` JSON-LD and make fields configurable via env vars. | ✅ | 2025-11-14 |
| TASK-003 | Fix invalid Apple icon sizes in `src/config/metadata.ts`. | ✅ | 2025-11-14 |
| TASK-004 | Wrap up — Add `x-default` to metadata `alternates` and finalize Phase 1. | ✅ | 2025-11-14 |
| TASK-005 | Create `src/lib/jsonLd/organization.ts` to export `getOrganizationSchemas(locale)` and include in layout for all pages | ✅ | 2025-11-14 |
| TASK-006 | Centralize `LocalBusiness` schema config and reference in all pages requiring business info. | ✅ | 2025-11-14 |
| TASK-007 | Add organization schema to site-level `layout.tsx` or `generateLocalizedMetadata` to ensure availability across all pages. | ✅ | 2025-11-14 |
| TASK-008 | Add `Service` JSON-LD to `src/components/services/ServicePageTemplate.tsx`. | ✅ | 2025-11-14 |
| TASK-009 | Ensure pricing `Offer` schema uses numeric CZK prices for structured data validation. | ✅ | 2025-11-14 |
| TASK-010 | Align OpenGraph image handling with dynamic `opengraph-image.tsx` outputs and fallbacks. | ✅ | 2025-11-14 |
| TASK-015 | Ensure sitemap and robots.txt align with structured data and locale patterns. | ✅ | 2025-11-14 |
| TASK-018 | Add `scripts/validate-jsonld.js` to validate structured data schemas. | ✅ | 2025-11-14 |
| TASK-020 | Add `scripts/validate-canonical.js` to validate canonical/hreflang consistency. | ✅ | 2025-11-14 |

---

**Next Steps**: See remaining phases in `plan/feature-seo-optimizations-1.md`

## 1. Requirements & Constraints

- **REQ-001**: Next.js 15 (App Router) project — use `Metadata` APIs and `generateMetadata` server functions.
- **REQ-002**: Maintain multi-locale support: locales ["cs","en","de"] via `src/i18n/routing.ts`.
- **REQ-003**: Site must be conversion-focused: services (0.9 priority), contact, pricing pages are conversion targets.
- **REQ-004**: All pages must have consistent canonical/hreflang URLs.
- **SEC-001**: CSP and `Content-Security-Policy` must remain compatible with analytics and `dangerouslySetInnerHTML`.
- **CON-001**: Do not break ISP-critical production environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRIMARY_DOMAIN`.
- **CON-002**: Avoid user data exposure in public JSON-LD if env var is missing; but **no placeholder** values that mislead GMB or search engines.
- **GUD-001**: Use `sitemap` & `robots` route generators (here implemented) with `sitemap index` if >50k URLs.
- **PAT-001**: Use site-wide `Organization` JSON-LD in `LocaleLayout` (site-level Schema) and per-page structured data for services/pages (FAQ, Pricing/Offers).
- **REQ-005**: Implement CI validation for Lighthouse and Schema.org JSON-LD.

## 2. Implementation Steps

### Implementation Phase 1 — Critical fixes (canonical/hreflang + schema data)

- GOAL-001: Fix critical canonical, `hreflang`, LocalBusiness address gaps, and invalid icon sizes to avoid immediate SEO penalties.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Fix `localePrefix` inconsistency: Update canonical/hreflang generation to rely on `routing.localePrefix` and ensure `cs` is prefixed when `localePrefix === 'always'`. | | |
| TASK-002 | Add missing `streetAddress` and `postalCode` to `LocalBusiness` JSON-LD and make fields configurable via env vars (e.g., `NEXT_PUBLIC_BUSINESS_STREET`, `NEXT_PUBLIC_BUSINESS_POSTAL_CODE`). | Completed | 2025-11-14 |
| TASK-003 | Fix invalid Apple icon sizes in `src/config/metadata.ts`. | Completed | 2025-11-14 |
| TASK-004 | Wrap up — Add `x-default` to metadata `alternates` for canonical page fallback and finalize Phase 1. | Completed | 2025-11-14 |

Files to update:

- `src/config/metadata.ts` — function `generateLocalizedMetadata`
- `src/lib/metadata/home.ts` — function `getHomeMetadata`
- `src/app/sitemap.ts` — verify and maintain locale prefix patterns (sitemap URL structure)
- `src/app/robots.ts` — maintain consistent sitemap references
- `src/lib/jsonLd/home.ts` — LocalBusiness schema update
- `src/app/[locale]/layout.tsx` — ensure site-level Organization schema injection (or import and add script)

Precise implementation details:

- TASK-001 (Canonical/hreflang):
  - Edit `src/config/metadata.ts`:
    - Replace `const localePrefix = locale === "cs" ? "" :`/${locale}`` with:
      - `import { routing } from "@/i18n/routing";`
      - `const localePrefix =`/${locale}`; // consistent with routing.localePrefix === 'always'`
    - Use `localePrefix` when building `canonicalUrl`.
    - Update `alternates.languages` object to be deterministic using `routing.locales`.
    - Add `x-default`: `alternates.languages['x-default'] = baseUrl + '/' + routing.defaultLocale;`
  - Update all per-page functions using the `cs` no-prefix behavior (home/ pricing and services) to use `localePrefix =`/${locale}``.

- TASK-002 (LocalBusiness address):
  - Add two env variables: `NEXT_PUBLIC_BUSINESS_STREET` and `NEXT_PUBLIC_BUSINESS_POSTAL_CODE` (preferred) in your environment.
  - Replace empty strings in `src/lib/jsonLd/home.ts` for `streetAddress` and `postalCode` with:
    - `streetAddress: process.env.NEXT_PUBLIC_BUSINESS_STREET || 'Hybešova 10', // or remove if unknown` — but require no placeholders; so require the env var. If not set, log error in the server side (clear failure).
  - Or centralize: import `domainConfig` to include business address or create `domainConfig.businessAddress`.

- TASK-003 (Icons):
  - Edit `src/config/metadata.ts`:
    - Replace `apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { url: '/apple-icon.png', sizes: '' }]` with valid entries or remove the invalid one. Example:
      - `apple: [ { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { url: '/mstile-150x150.png', sizes: '150x150', type: 'image/png' } ]`.
  - Validate by running `next start` and checking page head for `apple-touch-icon` entries.

- TASK-004 (x-default):
  - Add `x-default` to:
    - `src/config/metadata.ts` (generateLocalizedMetadata)
    - `src/lib/metadata/home.ts` (getHomeMetadata)
    - `generateServiceMetadata` in `src/components/services/ServicePageTemplate.tsx`.

Validation:

- Confirm sitemap urls use `/${locale}/...` repetition for `cs`.
- Confirm canonical alt languages generate `x-default` link.
- Confirm `LocalBusiness` schema has non-empty `streetAddress` and `postalCode`.

Completion criteria for Phase 1:

- All canonical/hreflang URLs and sitemap entries must be consistent across code (i.e., canonical URL equals sitemap entry for given locale).
- LocalBusiness address includes street + postal code from env var or centralized data.
- `apple` icons do not contain empty `sizes` values.
- Changes validated with schema-check script and by using `grep` to ensure `x-default` presence.

### Implementation Phase 2 — Schema consolidation & site-wide improvements

- GOAL-002: Centralize Organization/LocalBusiness schema across the site and ensure consistent inclusion on every page.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-005 | Create `src/lib/jsonLd/organization.ts` to export `getOrganizationSchemas(locale)` and include in layout for all pages | | |
| TASK-006 | Centralize `LocalBusiness` schema config and reference in all pages requiring business info (Contact, Home, Projects). | | |
| TASK-007 | Add organization schema to site-level `layout.tsx` or `generateLocalizedMetadata` to ensure availability across all pages (not just home). | | |

Files:

- New file: `src/lib/jsonLd/organization.ts` (create with Organization + LocalBusiness JSON-LD)
- Update: `src/lib/jsonLd/home.ts` (remove duplicates)
- Update: `src/app/[locale]/layout.tsx` to add `getOrganizationSchemas(locale)` to the final DOM (server HTML) using `dangerouslySetInnerHTML`.

Implementation details:

- `src/lib/jsonLd/organization.ts`:
  - Export `export async function getOrganizationSchemas(locale: string) { ... }` which returns the Organization and LocalBusiness JSON-LD objects (with `@id` pointing to `#organization` and `#localbusiness`).
  - Use `getTranslations` for localized fields like `slogan`, `description`, etc.
- `src/app/[locale]/layout.tsx`:
  - Import `getOrganizationSchemas` and, on the server render (layout), add:
    - `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />` for each element.

Validation:

- Any page accessed will include the Organization & LocalBusiness JSON-LD script tags.
- `StructureValidator` can validate JSON-LD; test on home, contact, service pages.

Completion criteria:

- Organization JSON-LD available on all pages.
- LocalBusiness address and contact details are consistent and included on each page.

### Implementation Phase 3 — Per-page conversion schema & OpenGraph

- GOAL-003: Add `Service` schema and `Offer` schema for money pages; ensure FAQ & breadcrumb schema present where applicable. Optimize OG image handling for dynamic routes.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-008 | Add `Service` JSON-LD to `ServicePageTemplate` (`src/components/services/ServicePageTemplate.tsx`) | | |
| TASK-009 | Add `Offer` schema for pricing (done), check `pricing` page includes `ItemList` / `Offer` and validate currency / price properties. | | |
| TASK-010 | Ensure OG images use the `opengraph-image.tsx` dynamic route and `metadataBase` properly. Add fallback resolution if dynamic image fails. | | |

Files:

- `src/components/services/ServicePageTemplate.tsx`: implement `Service` JSON-LD
- `src/app/[locale]/services/*/opengraph-image.tsx`: confirm dynamic OG generation
- `src/app/[locale]/pricing/page.tsx`: check offers meta already present
- `src/app/[locale]/page.tsx`: home page `getHomeSchemas` -> ensure consolidated schemas

Implementation details:

- In `ServicePageTemplate` in `generateServiceMetadata` or markup, add:
  - A new JSON-LD script:
    {
      "@context": "<https://schema.org>",
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
        "price": "0", // if free, else configure
        "url": `${pageUrl}#contact`,
      }
    }
- Only add `FAQ` JSON-LD when `faq` items exist in localized translations; use `getTranslations` namespace for `services.faq` if present.

Validation:

- Run `schema-validator` for service pages to verify `Service` shows up as valid markup.

Completion criteria:

- All services pages contain `Service` JSON-LD when they are money pages.
- Pricing page has valid `Offer/Product` schema.

### Implementation Phase 4 — Performance & Lighthouse optimizations

- GOAL-004: Improve Lighthouse SEO, Performance & Accessibility scores by optimizing fonts, images, and script loading.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-011 | Evaluate and migrate to `next/font` for JetBrains Mono to improve LCP/CLS (replace `@fontsource` with `next/font/local` or `next/font/google`) | | |
| TASK-012 | Add `preconnect`/`preload` for fonts & critical resources (images, analytics endpoints). Add `rel="preload"` for hero images / LCP images. | | |
| TASK-013 | Ensure `next/image` is used for critical images with width/height, `priority={true}` if above-the-fold. | | |
| TASK-014 | Defer non-critical third-party scripts and move analytics behind consent; ensure `ConditionalAnalytics` loads only after consent. | | |

Files:

- `src/app/[locale]/layout.tsx` — font & analytics head
- `src/components/homepage/HeroSection.tsx` (or DesktopHero) — ensure LCP image is `priority`
- `src/components/*` — ensure `next/image` usage with width/height props

Implementation details:

- Replace `@fontsource` imports with `import localFont from 'next/font/local'` in `layout.tsx` and add `className={jetbrains.className}` to the root or CSS.
- Update `HeroSection` `Image` usage:
  - `<Image priority width={1600} height={900} src="/hero.jpg" alt="..." />`
- Add `link rel="preconnect"` to Google domains for fonts, pre-load critical images as `<link rel="preload" href="/og-image.png" as="image">`.

Validation:

- Lighthouse checks: Performance LCP should decrease; CLS reduce.
- Run `npx lighthouse --output=json` or add CI check.

Completion criteria:

- LCP lowered as expected on hero pages.
- No blocking fonts that cause layout shifts.
- `next/image` used in all hero images and `priority` set.

### Implementation Phase 5 — Sitemaps, Robots, and indexing optimizations

- GOAL-005: Ensure sitemaps, robots, and meta allow efficient crawl and GMB and Google Search indexing.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-015 | Split the sitemap if necessary and build a sitemap index with references to sub-sitemaps (services, projects, pages). | | |
| TASK-016 | Ensure robots.txt `sitemap` matches the sitemaps output (both dynamic & static). | | |
| TASK-017 | Add secure canonical & hreflang for pages with `x-default` and `alternates` consistent across `generateMetadata` output and sitemap. | | |

Files:

- `src/app/sitemap.ts` — split into `sitemap-index.ts` + sub-sitemaps.
- `src/app/robots.ts` — ensure `sitemap` references match.
- `src/app/[locale]/layout.tsx` & metadata generation — ensure alternates/hreflang.

Implementation details:

- Implement `sitemapIndex` route returning the `<sitemapindex>` referencing `sitemap-main.xml`, `sitemap-services.xml`, etc.
- Update `robots.ts` to reference `sitemap` index.

Validation:

- Use `https://www.xml-sitemaps.com/` or `Google Search Console` to test sitemaps.
- `sitemap.xml` must list language alternates and pages with proper `lastmod`.

Completion criteria:

- `sitemap.xml` indexed successfully in GSC and `sitemapIndex` references are correct.
- `robots.txt` includes sitemap indexes and allows or disallows expected paths.

### Implementation Phase 6 — Monitoring & CI validations

- GOAL-006: Add CI validations for structured data and Lighthouse checks.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-018 | Add `scripts/validate-jsonld.js` to traverse pages and call Schema.org validator. | | |
| TASK-019 | Add `.github/workflows/seo-lighthouse.yml` to run headless Lighthouse checks and structured-data validation on PRs & scheduled runs. | | |
| TASK-020 | Add `scripts/validate-canonical.js` to ensure canonical/hreflang x-default presence. | | |

Files:

- New: `scripts/validate-jsonld.js`, `scripts/validate-canonical.js`
- New: `.github/workflows/seo-lighthouse.yml`, `.github/workflows/jsonld-validation.yml`

Implementation details:

- `validate-jsonld.js`:
  - Fetch a list of pages from `sitemap.ts` (or generate list from `routing.locales` + `routeConfig`).
  - For each page, fetch HTML and parse `<script type='application/ld+json'>` content, parse and call Schema validator (e.g., `https://validator.schema.org/#url` or use `@schemastore/` polyfill).
- `seo-lighthouse.yml`:
  - Use `actions/checkout`, `setup-node`, `install dependencies`.
  - Run `npx lighthouse` or `lighthouse-ci`.
  - Fail if performance or SEO scores drop below threshold (e.g., SEO >= 90, performance >= 70).

Validation:

- CI step must pass; if not, PR fails.

Completion criteria:

- CI runs for PRs detect and fail if score thresholds are not met.
- Schema validator returns no critical errors for schema types.

## 3. Alternatives

- ALT-001: Keep Organization JSON-LD only on home vs. include site-wide in layout; chosen: include site-wide (preferred).
- ALT-002: Hardcode business address in JSON-LD vs. use env vars; chosen: use env vars (secure & dynamic).
- ALT-003: Keep font imports via `@fontsource` vs `next/font`: chosen `next/font` for LCP & CLS improvements; if not possible, use `font-display: swap` and `preload`.

## 4. Dependencies

- DEP-001: Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_PRIMARY_DOMAIN`, `NEXT_PUBLIC_BUSINESS_STREET`, `NEXT_PUBLIC_BUSINESS_POSTAL_CODE`, `NEXT_PUBLIC_BUSINESS_PHONE`, `NEXT_PUBLIC_GOOGLE_VERIFICATION` etc.
- DEP-002: Google Search Console & GMB configured (owner/token).
- DEP-003: Supabase remote image access (configured in `next.config.ts` remotePatterns).
- DEP-004: CI runner capable of performing headless Lighthouse (Linux Ubuntu images).
- DEP-005: `next`, `next-intl`, `@next/mdx`, `lucide-react` and associated libs (already present).

## 5. Files

- FILE-001: `src/config/metadata.ts` — fix canonical/hreflang, x-default, icons.
- FILE-002: `src/lib/metadata/home.ts` — fix localePrefix usage, metadataBase.
- FILE-003: `src/app/[locale]/layout.tsx` — add site-level Organization JSON-LD, update fonts & preconnect.
- FILE-004: `src/lib/jsonLd/home.ts` — extract Organization/LocalBusiness to `organization.ts`, add address env vars.
- FILE-005: New: `src/lib/jsonLd/organization.ts` — Organization + LocalBusiness JSON-LD.
- FILE-006: `src/components/services/ServicePageTemplate.tsx` — Add Service JSON-LD.
- FILE-007: `src/app/sitemap.ts` — ensure consistent locale prefix; optional split into sub-sitemaps.
- FILE-008: `src/app/robots.ts` — confirm disallow/allow rules & sitemap reference.
- FILE-009: New: `scripts/validate-jsonld.js`, `scripts/validate-canonical.js`.
- FILE-010: `.github/workflows/seo-lighthouse.yml`, `.github/workflows/jsonld-validation.yml`.

## 6. Testing

- TEST-001: Schema Validation - `scripts/validate-jsonld.js` script verifies that expected JSON-LD types (Organization, LocalBusiness, Service, Offer, FAQ, Breadcrumb, WebSite) are present and schema types are valid.
- TEST-002: Canonical/Hreflang consistency - `scripts/validate-canonical.js` ensures canonical matches sitemap entry, and that `alternates` includes `x-default` and `hreflang` for each locale (cs/en/de).
- TEST-003: Lighthouse Automation - `seo-lighthouse.yml` uses `npx lighthouse` or `lighthouse-ci` and fails if thresholds are not met (e.g., SEO >= 95).
- TEST-004: Sitemap & Robots - CI job confirms `sitemap.xml` contains expected number of core routes and references, and `robots.txt` references `sitemap.xml`.
- TEST-005: Visual check & image metadata: validate OG images' sizes and `og:image` meta tags are present and match `metadataBase`.
- TEST-006: JSON-LD parsing for `LocalBusiness`: `streetAddress`, `postalCode`, and `telephone` defined and non-empty.

## 7. Risks & Assumptions

- **RISK-001**: Missing or inaccurate business address env vars may create false GMB info or site errors; mitigated by requiring env var presence in staging/production with CI check.
- **RISK-002**: Changing `cs` prefix behavior may cause broken links or redirects if `next-intl` `localePrefix` is used inconsistently. Mitigation: ensure alignment of `routing`'s `localePrefix` with canonical URL generation and provide redirects where necessary.
- **ASSUMPTION-001**: Project owner has admin access to Google Search Console & GMB to validate sitemaps and local business listing.
- **RISK-003**: CI Lighthouse checks can fail due to transient network or environment variations; set thresholds and possibly re-run to test stability.
- **ASSUMPTION-002**: `@fontsource` to `next/font` migration is allowed and will not break any visual design requirements (fonts available locally).

## 8. Related Specifications / Further Reading

- Next.js Metadata & App Router docs: <https://nextjs.org/docs/app/api-reference/functions/generate-metadata>
- Next.js image optimization docs: <https://nextjs.org/docs/app/building-your-application/images>
- Schema.org usage and examples: <https://schema.org/>
- Google Rich Results & LocalBusiness docs: <https://developers.google.com/search/docs/appearance/structured-data>
- Sitemap best practices: <https://developers.google.com/search/docs/advanced/sitemaps/overview>
- Lighthouse CI: <https://github.com/GoogleChrome/lighthouse-ci>

---

Generated: 2025-11-14
