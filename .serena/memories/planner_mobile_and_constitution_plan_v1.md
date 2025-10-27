Summary of plan to fix mobile hidden sections, optimize navigation, enforce DB-driven Projects/Pricing, enable SMTP contact flow, update constitution and spec templates.

High-level goals:
- Reveal sections hidden on mobile and provide optimized mobile navigation.
- Remove Team cards, Projects and Contact from homepage; keep them on dedicated pages.
- Ensure Projects and Pricing pages load content strictly from DB via server API routes.
- Enable SMTP for contact form; persist submissions to DB; use email templates for customer thank-you and admin notification.
- Perform performance optimizations and cross-browser testing.
- Update `.specify` templates and draft constitution changes per speckit prompt.

Key file targets (found in repo):
- Frontend: `src/app/page.tsx`, `src/app/[locale]/page.tsx`, `src/app/[locale]/projects/ProjectsClient.tsx`, `src/app/[locale]/projects/ProjectsGrid.tsx`, `src/app/[locale]/projects/ProjectsLoadingSkeleton.tsx`, `src/app/[locale]/pricing/PricingClient.tsx`, `src/app/[locale]/contact/ContactClient.tsx`, `src/app/components/ClientLayoutWrapper.tsx`, `src/app/components/common/*`.
- API: `src/app/api/contact/route.ts`, `src/app/api/projects/route.ts`, `src/app/api/pricing/items/route.ts`, `src/app/api/pricing/tiers/route.ts`.
- Lib: `src/lib/supabase.ts`, `src/lib/email.ts`, `src/lib/email-templates.ts`, `src/lib/form-storage.ts`.
- Templates & constitution: `.specify/memory/constitution.md`, `.specify/templates/plan-template.md`, `.specify/templates/spec-template.md`, `.specify/templates/tasks-template.md`.
- DB migrations: `supabase/migrations/*`.

Next steps (sync with TODOs):
- Perform a targeted audit (TODO #1) and produce exact code edits for breakpoints/classes.
- Implement changes in small increments with tests for DB and email flows.

Notes:
- This is a planning memory only. The plan includes a TODO to draft the finished constitution content but not to overwrite files until reviewed and approved.
- Environment variables required (examples): SUPABASE_URL, SUPABASE_SERVICE_KEY (or server role key), SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL.

Created: 2025-10-27
