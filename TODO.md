# TODO

> All tasks completed - MDX + ISR implementation finished

## Completed Work

### ✅ MDX + ISR Implementation (2025-01-06)

All legal documentation pages optimized with MDX content management and ISR caching:

- **Terms Page**: ISR optimized with 7-day revalidation
- **Cookies Page**: Converted to MDX (3 locales) with 1-day revalidation
- **Policies Page**: Converted to MDX (3 locales) with 7-day revalidation
- **GDPR Page**: Created new page with MDX (3 locales) and 7-day revalidation

**Files Modified/Created:**
- Fixed `src/mdx-components.tsx` configuration
- Created 12 MDX content files (4 pages × 3 locales)
- Updated 4 page.tsx wrappers with ISR configuration

**Documentation:**
- Created `mdx-isr-implementation` memory
- Updated `CHANGELOG.md` with detailed changes
- Cleared `TODO.md` of completed tasks

See `CHANGELOG.md` for full details.

---

## Active Tasks

No active tasks at this time.

---

## Future Considerations

When new pages or features are added:
- Follow established MDX + ISR pattern for content pages
- Use appropriate revalidation intervals based on update frequency
- Maintain consistent styling through MDXComponents system
- Ensure proper i18n support for all 3 locales (cs, en, de)
