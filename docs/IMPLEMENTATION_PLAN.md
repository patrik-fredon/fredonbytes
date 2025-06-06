# PLAN-001: Multilingual Support & Build Optimization Implementation Plan

---

## 1. Context & Goals

- **Tech Stack:** Next.js (TypeScript), custom i18n (JSON, hooks, scripts), automated translation validation, SEO integration.
- **Goals:**
  - Robust, maintainable multilingual support (EN/CS/DE)
  - Automated translation completeness/quality
  - Efficient, scalable Next.js builds (bundle size, static assets, performance)
  - Clear documentation and changelog updates

---

## 2. System Overview

### 2.1 Context Diagram

```
[User]
   |
   v
[Next.js App]
   |         \
[i18n Layer]  [Build Pipeline]
   |             |
[Locales JSON] [Static Assets, Images]
   |             |
[Translation Scripts] [next.config.ts]
```

### 2.2 Key Components

- `src/app/locales/` — Translation files (en/cs/de)
- `src/app/hooks/useTranslations.ts` — Translation hook
- `src/app/components/common/LanguageSwitcher.tsx` — Language switcher UI
- `scripts/translation-manager.js` — Translation sync/validation
- `next.config.ts` — Build and i18n config

---

## 3. Implementation Steps

### 3.1 Multilingual Support

**A. Audit & Improve i18n Workflow**

- Review all UI for hardcoded strings; replace with translation keys.
- Ensure all translation keys exist in all locales (use `translation-manager.js`).
- Validate fallback logic in `useTranslations.ts` and context provider.
- Audit `LanguageSwitcher.tsx` for UX (dropdown, accessibility, URL sync).

**B. Expand Translation Coverage & Automate Validation**

- Run `node scripts/translation-manager.js` to sync and report missing keys.
- Use `npm run test:translations` and `npm run validate:locales` for automated checks.
- Add CI step for translation validation (fail build if incomplete).
- Document translation workflow in [`docs/I18N_WORKFLOW.md`](docs/I18N_WORKFLOW.md).

**C. Enhance Language Switching**

- Ensure URL-based language switching is robust (`?lang=xx`).
- Add locale detection (browser/Accept-Language) fallback.
- Improve LanguageSwitcher accessibility (ARIA, keyboard nav).

**D. Improve Fallback Logic**

- Ensure missing keys fall back to English or display a clear placeholder.
- Log missing translations in dev mode for rapid feedback.

---

### 3.2 Build Optimization

**A. Analyze Bundle**

- Use `next build` and `next analyze` (add `@next/bundle-analyzer` if not present).
- Identify large dependencies and opportunities for code splitting.

**B. Enable Code Splitting**

- Use dynamic imports for large/rarely-used components.
- Refactor shared code into smaller modules where possible.

**C. Optimize Images & Static Assets**

- Use Next.js `<Image />` for all images.
- Audit `public/` for unused or oversized assets.
- Enable image optimization in `next.config.ts` (domains, formats, sizes).

**D. Tune next.config.ts**

- Enable/verify i18n config (if not already present).
- Enable SWC minification, React 18 features, and experimental optimizations as appropriate.
- Set up static asset caching headers.

**E. Validate & Document**

- Run Lighthouse and Next.js build reports.
- Document optimization steps and results in `docs/IMPLEMENTATION_PLAN.md` and update `CHANGELOG.md`.

---

## 4. Tooling & Configuration Recommendations

- **Translation Management:**
  - Use `scripts/translation-manager.js` for syncing and reporting.
  - Add pre-commit or CI hook for translation validation.
- **Bundle Analysis:**
  - Add `@next/bundle-analyzer` to devDependencies.
  - Use `ANALYZE=true next build` for bundle inspection.
- **Image Optimization:**
  - Use Next.js `<Image />` everywhere.
  - Configure `images` in `next.config.ts`.
- **Code Quality:**
  - Enforce ESLint rules for no hardcoded strings.
  - Add tests for language switching and fallback.

---

## 5. Quality Criteria

- **Maintainability:**
  - All translations managed via scripts, no manual JSON editing.
  - Automated validation in CI.
- **Scalability:**
  - Easy to add new languages (single source of truth, automated sync).
  - Build optimizations support growth in assets/pages.
- **Performance:**
  - Minimal bundle size, optimized images, code splitting.
- **Documentation:**
  - All changes and workflows documented in Markdown and CHANGELOG.

---

## 6. Task Breakdown for Code Mode

1. **i18n Audit:**
   - Search for hardcoded strings, replace with translation keys.
   - Run translation sync/validation scripts.
2. **Language Switcher:**
   - Refactor for accessibility and robust URL handling.
3. **Fallback Logic:**
   - Update translation hooks/context for better fallback and logging.
4. **Translation Validation:**
   - Add/verify CI step for translation completeness.
5. **Bundle Optimization:**
   - Add bundle analyzer, refactor for code splitting.
   - Audit and optimize images/assets.
   - Update `next.config.ts` for best practices.
6. **Documentation:**
   - Update `docs/I18N_WORKFLOW.md` and `CHANGELOG.md` with all changes.

---

## 7. Documentation & Changelog

- Record all implementation steps, rationale, and results in:
  - [`docs/IMPLEMENTATION_PLAN.md`](docs/IMPLEMENTATION_PLAN.md)
  - [`CHANGELOG.md`](CHANGELOG.md)
- Ensure documentation covers workflow, validation, and optimization steps.

---

**This plan is ready for implementation.**
