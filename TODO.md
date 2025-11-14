# TODO — SEO Optimizations

This file summarizes task statuses for the SEO optimizations plan `feature-seo-optimizations-1`.

| Task | Description | Completed | Date |
|------|-------------|-----------|------|
| TASK-001 | Fix `localePrefix` inconsistency: Update canonical/hreflang generation to rely on `routing.localePrefix` and ensure `cs` is prefixed when `localePrefix === 'always'`. | ✅ | 2025-11-14 |
| TASK-002 | Add missing `streetAddress` and `postalCode` to `LocalBusiness` JSON-LD and make fields configurable via env vars. | ✅ | 2025-11-14 |
| TASK-003 | Fix invalid Apple icon sizes in `src/config/metadata.ts`. | ✅ | 2025-11-14 |
| TASK-004 | Wrap up — Add `x-default` to metadata `alternates` and finalize Phase 1. | ✅ | 2025-11-14 |
| TASK-005 | Create `src/lib/jsonLd/organization.ts` to export `getOrganizationSchemas(locale)` and include in layout for all pages | | |
| TASK-006 | Centralize `LocalBusiness` schema config and reference in all pages requiring business info. | | |
| TASK-007 | Add organization schema to site-level `layout.tsx` or `generateLocalizedMetadata` to ensure availability across all pages. | | |

> Note: The full implementation plan is saved in memory at `.serena/memories/feature-seo-optimizations-1.md` for traceability. A `/plan` file couldn't be created due to tooling constraints; the plan is saved to the workspace memory instead.

Description: Finalizing initial plan save and TODO creation.
