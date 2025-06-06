# Fredonbytes Codebase Cleanup & Optimization Plan

## 1. Contextual Analysis

- **Recent changes:** Major translation, SEO, mobile, and accessibility improvements. New scripts for translation management and validation. No breaking changes.
- **Tech stack:** Next.js, React, TypeScript, Tailwind CSS, ESLint.
- **Goal:** Remove unused, duplicate, or obsolete code/assets/scripts without affecting business logic or required features.

---

## 2. Audit Summary

### A. [`src/`](src/)

- **Components:** All components and hooks appear to be in use, mapped to pages or common UI. No obvious duplicates or obsolete files.
- **Utilities:** All utility functions are generic and likely used across the app.
- **Locales:** All translation files are complete and referenced.
- **No unused/duplicate code detected** via exports.

### B. [`public/`](public/)

- **Assets:** Multiple images and icons. Some (e.g., `banner-*`, `logo_bigger.*`, `placeholder-project-fredon.png`) may be legacy or unused.
- **Docs:** Markdown files in `public/docs/` may be redundant if duplicated in `/docs`.

### C. [`scripts/`](scripts/)

- **Scripts:** All scripts are referenced in the changelog and relate to translation management/validation. No obsolete scripts detected.

### D. [`package.json`](package.json), [`tsconfig.json`](tsconfig.json)

- **Dependencies/config:** No evidence of unused dependencies/config entries from the audit scope.

---

## 3. Candidates for Removal

| File/Asset                                                                                                    | Reason for Removal                 | Justification                                             |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------- |
| `public/banner-big-fredonbytes.png`<br>`public/banner-smaller.png`<br>`public/banner-you-can-fredonbytes.png` | Potentially unused legacy banners  | If not referenced in code or UI, these are safe to remove |
| `public/logo_bigger.png`<br>`public/logo_bigger.svg`                                                          | Possible duplicates of main logo   | If not referenced, can be removed                         |
| `public/placeholder-project-fredon.png`                                                                       | Placeholder asset, may be obsolete | Remove if not used in any UI/component                    |
| `public/docs/about-fredonbytes.md`<br>`public/docs/fredonbytes-short-description.md`                          | Docs in `public/` may be redundant | If `/docs` contains the same info, remove from `public/`  |

**Note:** Actual usage must be confirmed by searching for references in the codebase before removal.

---

## 4. Step-by-Step Cleanup Plan

1. **Reference Check:**
   Search the codebase for references to each candidate file/asset.

   - If referenced, retain.
   - If not referenced, mark for removal.

2. **Remove Unused Assets:**
   Delete files/assets confirmed as unused.

3. **Test Application:**
   Run the app and verify all UI, images, and translations work as expected.

4. **Code Review:**
   Ensure no business logic or required features are affected.

5. **Document Changes:**
   Update `CHANGELOG.md` and internal docs to reflect the cleanup.

---

## 5. Recommendations for Ongoing Maintenance

- **Regularly audit assets and components** after major feature changes.
- **Automate unused asset detection** (e.g., with custom scripts or tools).
- **Keep documentation centralized** (avoid duplicating docs in `public/` and `/docs`).
- **Enforce code reviews** for all removals to prevent accidental deletion of required files.

---

**This plan ensures a safe, justified, and maintainable codebase cleanup.**
