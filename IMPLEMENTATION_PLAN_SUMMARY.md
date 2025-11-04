# Implementation Plan Summary

**Performance Optimization - Recommendations 2-7**  
**Status:** Planning Complete  
**Date:** November 4, 2025  
**Duration:** 4 weeks (phased implementation)

---

## Quick Reference

### 7 Recommendations → 7 TODO Items

| # | Recommendation | Impact | Effort | Priority |
|---|---|---|---|---|
| 2 | Image lazy loading + blur placeholders | FCP: 2048ms → 1200ms | Medium | High |
| 3 | Code-split form components | LCP /contact: 5328ms → 2500ms | Low | High |
| 4 | Font loading optimization | FCP +50-100ms | Low | High |
| 5 | Parallelize Supabase queries | TTFB: 1200-2000ms → 500-600ms | Low | Medium |
| 6 | Per-locale static generation (ISG) | First TTFB: 1982ms → 100ms | Medium | Medium |
| 7 | Request deduplication middleware | Reduce concurrent queries | Medium | Low |

### Overall Target
- **TTFB:** 1200-2000ms → <200ms (83-90% improvement)
- **LCP:** 1.7-5.4s → <2.0s (60-63% improvement)
- **FCP:** 2048ms → <1200ms (41% improvement)
- **Lighthouse:** 70-82 → 85+ score

---

## Phased Rollout

### Week 1: Foundation
**Items:** Rec 4, Rec 7
- Add font-display: swap to all fonts
- Implement request deduplication cache
- Low risk, quick wins

### Week 2: Data Layer
**Items:** Rec 5, Rec 6
- Parallelize database queries with Promise.all()
- Setup ISG for projects page
- Supabase query optimization

### Week 3: Client-Side
**Items:** Rec 2, Rec 3
- Implement Next.js Image component with lazy loading
- Code-split form steps with dynamic imports
- Coordinate with Supabase image optimization

### Week 4: Verification
- Lighthouse CI testing
- Real-world metrics validation
- Staged rollout with monitoring

---

## File Reference

### Generated Files
- **`PERFORMANCE_OPTIMIZATION_PLAN.md`** - Complete 700-line implementation guide
  - Detailed why/what/how for each recommendation
  - Step-by-step code changes with before/after
  - Acceptance criteria per item
  - New files to create (7 new files)
  - Files to modify (8 existing files)

### TODO List
See `manage_todo_list` output - 7 items with:
- Specific file paths
- Code samples
- Expected impact metrics
- Acceptance criteria

### Memory
- **`performance-optimization-plan-recommendations-2-7`** - Serena memory file
  - High-level summary
  - Environment variables needed
  - New npm packages
  - Phase breakdown
  - Next steps for implementation

---

## Environment Variables

Add to `.env.local`:
```bash
# Redis caching (Upstash)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Webhook security token
REVALIDATE_TOKEN=<random-secure-token>
```

## New Dependencies

```bash
npm install @upstash/redis
# sharp already installed
```

---

## Key Files to Create

1. `src/lib/image-utils.ts` - Image optimization constants
2. `src/lib/supabase-image-optimization.ts` - Blur placeholder generation
3. `src/lib/request-cache.ts` - Request deduplication middleware
4. `src/components/form/FormSkeleton.tsx` - Form loading skeleton
5. `src/app/api/projects/revalidate/route.ts` - ISG revalidation webhook
6. `supabase/migrations/XX_add_performance_indexes.sql` - DB indexes
7. `.env.example` - Environment variables template (update)

---

## Key Files to Modify

1. `src/app/globals.css` - Add font-display: swap
2. `src/app/[locale]/layout.tsx` - Add font preload links
3. `src/app/[locale]/projects/page.tsx` - Enable ISG, update generateStaticParams
4. `src/app/api/projects/route.ts` - Parallelize queries + deduplication
5. `src/app/api/pricing/tiers/route.ts` - Parallelize queries + deduplication
6. `src/app/api/contact/route.ts` - Add request deduplication
7. `src/app/[locale]/form/[session_id]/FormClient.tsx` - Dynamic imports
8. `src/app/[locale]/contact/page.tsx` - Lazy load ContactForm

---

## Success Metrics

### Before Optimization
- TTFB: 1200-2000ms (poor)
- LCP: 1.7-5.4s (varies by locale)
- FCP: 2048ms (projects), 5328ms (contact) - needs improvement
- Lighthouse: 70-82/100
- Projects page load time: 3-4 seconds
- Contact form LCP: 5+ seconds

### After Optimization
- TTFB: <200ms (83-90% improvement)
- LCP: <2.0s consistent across locales
- FCP: <1200ms consistently
- Lighthouse: 85+/100
- Projects page load time: <1.2 seconds
- Contact form LCP: <2.5 seconds

---

## Rollback Strategy

If performance degrades >5% after deployment:

1. **Disable Redis** - Remove Redis calls, queries hit DB directly
2. **Revert Query Parallelization** - Back to sequential awaits
3. **Remove ISG** - Set `revalidate = undefined`
4. **Disable Deduplication** - Remove deduplicateRequest() calls

All changes designed to be **non-breaking and reversible**.

---

## Testing Checklist

- [ ] All API routes still functional (no 500 errors)
- [ ] Form still submits correctly (Step 1 → 2 → 3)
- [ ] Images load in correct order (hero → cards → below-fold)
- [ ] No layout shifts when images load (CLS < 0.05)
- [ ] Font text appears immediately (no text flash)
- [ ] Projects page generates at build time
- [ ] ISG revalidation triggers on data changes
- [ ] Request deduplication coalesces concurrent requests
- [ ] Lighthouse score ≥85 on all key pages
- [ ] Real user metrics improve (from analytics)

---

## Next Actions

1. ✅ **Planning complete** - This document
2. **→ Week 1** - Implement Rec 4 & 7 (fonts + request dedup)
3. **→ Week 2** - Implement Rec 5 & 6 (queries + ISG)
4. **→ Week 3** - Implement Rec 2 & 3 (images + forms)
5. **→ Week 4** - Test, measure, deploy

---

## Questions & Clarifications

**Q: Should all 7 recommendations be done at once?**  
A: No - use phased approach (4 weeks, 2 items/week) to reduce risk and allow testing.

**Q: Can recommendations be done independently?**  
A: Yes - most are independent, except Rec 6 depends on Rec 5 for max benefit.

**Q: What if Upstash Redis has latency?**  
A: Use local Redis for dev, Upstash for production. Deduplication works with both.

**Q: Do we need to change database schema?**  
A: Only add indexes (new migration). No table schema changes.

**Q: Will this affect SEO?**  
A: No - actually improves SEO (faster load times, better Core Web Vitals).

---

## Documentation Links

- Full implementation: `PERFORMANCE_OPTIMIZATION_PLAN.md`
- Audit results: Previous debug log (past chat)
- Project standards: `GENERAL.md`, `CHANGELOG.md`
- Copilot rules: `.github/copilot-instructions.md`

