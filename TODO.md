# TODO - Fredonbytes

## Current Tasks

### Code Optimization & Refactoring (November 2025)
- [x] Fix duplicate service definitions in JSON-LD schema (removed 5 duplicates)
- [x] Standardize base URL fallbacks across all files (fredonbytes.cz)
- [x] Remove duplicate og_image.jpg (kept PNG only)
- [x] Remove unused icon0.svg (3.7MB dead code)
- [x] Fix sitemap.xml domain redirect issue for Google Search Console
- [ ] Optimize large images (requires manual optimization):
  - placeholder-project-fredon.png (8.1MB → target <500KB)
  - FredonBytes_GraphicLogo.png (2.8MB → target <500KB)

### SEO Optimization (Completed - November 2025)
- [x] Research Next.js 15 SEO best practices
- [x] Analyze current implementation
- [x] Enhance Czech keywords for local SEO
- [x] Add Seznam.cz specific meta tags and robot rules
- [x] Optimize JSON-LD schemas for GMB compatibility
- [x] Verify per-page metadata (all pages properly optimized)
- [x] Enhance LocalBusiness schema with GMB fields
- [x] Add geo-targeting meta tags for Czech Republic
- [x] Audit and cleanup duplicate code

### Documentation
- [x] Create General.md
- [x] Update TODO.md
- [x] Update CHANGELOG.md with refactoring changes

## Recommendations

### High Priority
1. **Optimize images**: Use tools like sharp, squoosh, or tinypng to compress:
   - `/public/placeholder-project-fredon.png` (8.1MB)
   - `/public/FredonBytes_GraphicLogo.png` (2.8MB)
2. **Add complete postal address** to LocalBusiness schema if available (currently empty for privacy/remote work)
3. **Add Google My Business Place ID** to LocalBusiness schema for better GMB integration

### Medium Priority
4. **Consolidate metadata utilities**: Create shared function for about/contact/legal pages (reduce ~50 lines duplicate code)
5. **Add individual review schema** to complement existing aggregate rating
6. **Add Google Maps embed** on contact page for better local SEO

### Low Priority
7. Consider adding holiday hours to OpeningHoursSpecification schema
8. Add service area with radius for better local search targeting
9. Consider WebP/AVIF versions of large PNG images for better performance

## Technical Debt
- Metadata duplication across similar pages (about, contact, legal pages)
- Large image files impact initial page load performance
- Missing street address in LocalBusiness schema (may impact GMB ranking)

---

*Last Updated: 2025-11-10*
