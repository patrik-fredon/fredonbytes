# MDX Pages ISR/SSR Implementation Plan
**Project**: Fredonbytes Legal Documentation Optimization  
**Date**: January 1, 2025  
**Target**: Next.js 15 with MDX, ISR, and SSR

---

## 📋 Executive Summary

Optimize `/terms`, `/cookies`, `/policies`, and create `/gdpr` pages using:
- **MDX** for content management (Markdown + JSX)
- **SSR** for SEO and fast initial loads (Server Components)
- **ISR** for performance with background revalidation

**Current Status**: Planning Complete ✅  
**Implementation Status**: Ready to begin

---

## 🎯 Goals

1. ✅ **Performance**: ISR caching with smart revalidation intervals
2. ✅ **SEO**: Pre-rendered HTML with proper metadata
3. ✅ **Maintainability**: Content separated from code in MDX files
4. ✅ **Consistency**: Unified styling via MDXComponents
5. ✅ **i18n**: Support for CS (Czech), EN, DE locales

---

## 📊 Current State Analysis

### Existing Infrastructure
- ✅ MDX configured in `next.config.ts`
- ✅ `pageExtensions` includes md, mdx
- ✅ `MDXComponents.tsx` has comprehensive styling
- ⚠️ `mdx-components.tsx` empty - needs fix

### Pages Status
| Page | Current | Target |
|------|---------|--------|
| `/terms` | MDX + wrapper | ✅ Optimize ISR |
| `/cookies` | Hardcoded TSX | 🔄 Migrate to MDX |
| `/policies` | Hardcoded TSX | 🔄 Migrate to MDX |
| `/gdpr` | ❌ Missing | ➕ Create new |

---

## 🏗️ Architecture Pattern

### Chosen Approach: Hybrid MDX
**Pattern**: `page.tsx` wrapper + dynamic MDX imports

```
/terms/
  ├── page.tsx          (ISR config, metadata, wrapper)
  ├── page.cs.mdx       (Czech content)
  ├── page.en.mdx       (English content)
  └── page.de.mdx       (German content)
```

### Why This Pattern?
- ✅ Full metadata control for SEO
- ✅ ISR configuration at route level
- ✅ Type-safe TypeScript
- ✅ Server Component by default
- ✅ Dynamic locale loading

---

## ⏱️ ISR Strategy

| Route | Revalidate | Interval | Rationale |
|-------|-----------|----------|-----------|
| `/terms` | 604800s | 7 days | Legal documents rarely change |
| `/gdpr` | 604800s | 7 days | Regulatory content, stable |
| `/cookies` | 86400s | 1 day | May update as services added |
| `/policies` | 604800s | 7 days | Privacy rarely changes |

**How ISR Works**:
1. Static HTML generated at build
2. Served from cache instantly
3. After revalidate period, background regeneration
4. Fresh content for next request
5. No downtime during updates

---

## 📝 Implementation Checklist

### Phase 1: Foundation (Priority: HIGH)
- [ ] **Task 1**: Fix `src/mdx-components.tsx`
  - Add `useMDXComponents` export
  - Connect to `MDXComponents`
  - Required for App Router

### Phase 2: Terms Optimization (Priority: HIGH)
- [ ] **Task 2**: Update `/terms/page.tsx`
  - Add `export const revalidate = 604800`
  - Implement dynamic MDX import
  - Verify existing MDX files work

### Phase 3: Cookies Migration (Priority: MEDIUM)
- [ ] **Task 3**: Create MDX files
  - Extract content from TSX
  - Convert to Markdown (3 locales)
  - Preserve tables, emojis, links
- [ ] **Task 4**: Replace `page.tsx` wrapper
  - ISR config: 86400s
  - Dynamic MDX loading

### Phase 4: Policies Migration (Priority: MEDIUM)
- [ ] **Task 5**: Create MDX files
  - Extract content from TSX
  - Convert to Markdown (3 locales)
  - Maintain legal structure
- [ ] **Task 6**: Replace `page.tsx` wrapper
  - ISR config: 604800s

### Phase 5: GDPR Creation (Priority: LOW)
- [ ] **Task 7**: Create MDX content
  - Base EN on `docs/gdpr.md`
  - Translate CS, DE
  - GDPR compliance sections
- [ ] **Task 8**: Create `page.tsx` wrapper
  - ISR config: 604800s
  - Full metadata

### Phase 6: Validation & Docs (Priority: HIGH)
- [ ] **Task 9**: Testing
  - All locales render
  - ISR headers present
  - SEO metadata correct
  - Dark mode works
  - Mobile responsive
  - Links functional
- [ ] **Task 10**: Documentation
  - Update `CHANGELOG.md`
  - Update memories
  - Clear `TODO.md`

---

## 🛠️ Technical Implementation

### Page Template (Standard Pattern)

```typescript
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'Page Title - Fredonbytes',
  description: 'Page description for SEO',
  robots: 'index, follow',
};

// ISR Configuration
export const revalidate = 604800; // Adjust per page

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  // Dynamic MDX import based on locale
  const Content = (await import(`./page.${locale}.mdx`)).default;
  
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <Content />
          </div>
        </div>
      </div>
    </div>
  );
}
```

### mdx-components.tsx Fix

```typescript
import type { MDXComponents } from 'mdx/types';
import { mdxComponents } from '@/components/MDXComponents';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...mdxComponents,
    ...components,
  };
}
```

---

## 🎨 Styling Integration

All MDX content automatically styled via `MDXComponents`:
- **Headings**: h1-h4 with hierarchy
- **Typography**: p, strong, em
- **Lists**: ul, ol, li with spacing
- **Code**: pre, code with syntax
- **Tables**: Bordered, responsive
- **Links**: Styled, hover effects
- **Dark Mode**: Full support

No additional styling needed in MDX files!

---

## 📦 File Changes Summary

### Create (10 files)
```
src/app/[locale]/cookies/page.{cs,en,de}.mdx    (3 files)
src/app/[locale]/policies/page.{cs,en,de}.mdx   (3 files)
src/app/[locale]/gdpr/page.tsx                   (1 file)
src/app/[locale]/gdpr/page.{cs,en,de}.mdx       (3 files)
```

### Update (4 files)
```
src/mdx-components.tsx                           (add useMDXComponents)
src/app/[locale]/terms/page.tsx                  (add ISR)
src/app/[locale]/cookies/page.tsx                (replace with wrapper)
src/app/[locale]/policies/page.tsx               (replace with wrapper)
```

### Keep As-Is
```
next.config.ts                                   (MDX already configured)
src/components/MDXComponents.tsx                 (styling complete)
src/app/[locale]/terms/page.{cs,en,de}.mdx      (existing content good)
```

---

## 🚀 Performance Benefits

### SSR (Server-Side Rendering)
- Pre-rendered HTML on server
- Fast first contentful paint
- SEO-friendly content
- No client JS required for content

### ISR (Incremental Static Regeneration)
- Pages cached and served instantly
- Background revalidation keeps content fresh
- Reduced server load
- Optimal for rarely-changing legal docs

### Measurements
- **TTFB**: < 100ms (cached)
- **FCP**: < 1s (pre-rendered)
- **SEO Score**: 100 (proper metadata)

---

## ✅ Success Criteria

### Functional
- [ ] All pages render in all locales (cs, en, de)
- [ ] ISR headers present (`Cache-Control`, `X-Next-Cache`)
- [ ] Metadata correct per page
- [ ] Links and navigation work

### Performance
- [ ] Pages load < 1s (cached)
- [ ] ISR revalidation works
- [ ] No hydration errors
- [ ] Build succeeds

### Quality
- [ ] Dark mode functional
- [ ] Mobile responsive
- [ ] Accessibility validated (WCAG 2.1)
- [ ] SEO optimized (meta tags, structure)

---

## 📚 Resources

### Documentation Used
- [Next.js 15 MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [Next.js ISR Documentation](https://nextjs.org/docs/pages/guides/incremental-static-regeneration)
- Microsoft Azure Next.js Hybrid Rendering Guide
- MDX Official Documentation

### Key Learnings
1. `mdx-components.tsx` required for App Router
2. ISR via `export const revalidate`
3. Server Components default (SSR)
4. Dynamic imports for locale-based content
5. Prose classes for automatic styling

---

## 🎯 Next Steps

1. **Review this plan** with team/stakeholders
2. **Begin Phase 1**: Fix mdx-components.tsx
3. **Test incrementally**: One page at a time
4. **Validate**: Check ISR headers, metadata
5. **Document**: Update CHANGELOG as you go

---

## 📞 Questions or Issues?

- Check `TODO.md` for detailed task breakdown
- Review memory: `mdx_pages_isr_implementation_plan`
- Consult Next.js 15 documentation
- Test locally before deploying

---

**Status**: 📝 Planning Complete - Ready for Implementation  
**Estimated Effort**: 4-6 hours  
**Risk Level**: Low (incremental changes, fallback possible)
