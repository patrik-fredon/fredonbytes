# AI TODO: SEO & Performance Optimization

## Direct AI-to-AI Execution Checklist

---

## ⚡ CONTEXT

- Next.js 15 App Router
- TypeScript + Tailwind CSS + Supabase
- SEO + Performance + Loading optimization
- Stack-specific best practices only

---

## 🔴 CRITICAL section

### Metadata

- [ ] `app/layout.tsx` - Add root metadata (title template, description, robots, viewport, themeColor)
- [ ] All `app/**/page.tsx` - Add unique metadata export
- [ ] Dynamic routes - Implement `generateMetadata()` function
- [ ] Create `app/opengraph-image.tsx` or static image

### Images

- [ ] `next.config.ts` - Configure `remotePatterns` for external images
- [ ] Replace all `<img>` with `next/image` component
- [ ] Add `priority` prop to above-fold images
- [ ] Ensure all images have `width`, `height`, `alt`

### Fonts

- [ ] Create `app/fonts.ts` - Import from `next/font/google`
- [ ] `app/layout.tsx` - Apply fonts via className + CSS variables
- [ ] `tailwind.config.ts` - Set fontFamily using CSS variables
- [ ] Verify no external font CDN requests

### Sitemap & SEO

- [ ] Create `app/sitemap.ts` - Dynamic sitemap generator
- [ ] Create `app/robots.ts` - Robots configuration
- [ ] Verify `/sitemap.xml` and `/robots.txt` accessible

---

## 🟡 HIGH PRIORITY section

### Performance

- [ ] `next.config.ts` - Add security headers
- [ ] Identify & implement code splitting with `dynamic()`
- [ ] Convert unnecessary client components to Server Components
- [ ] Set caching strategy: `revalidate`, `cache`, `dynamic` on each page
- [ ] Run `ANALYZE=true npm run build` - Check bundle

### Core Web Vitals

- [ ] LCP: Add `priority` to hero image
- [ ] CLS: Define dimensions for all images, use `aspect-ratio` CSS
- [ ] INP: Reduce JS, defer non-critical loads, optimize event handlers
- [ ] Test Lighthouse - Target: Performance 90+, SEO 100

### Data Fetching

- [ ] Static pages: Use `cache: 'force-cache'`
- [ ] Semi-dynamic pages: Set `revalidate: [seconds]`
- [ ] Dynamic pages: Use `cache: 'no-store'`
- [ ] Use `Promise.all()` for parallel fetches

---

## 🟢 SECONDARY section

### Structured Data (JSON-LD)

- [ ] Create `components/JsonLd.tsx` - Reusable component
- [ ] Add Organization schema to `app/layout.tsx`
- [ ] Add Article schema to blog posts (dynamic routes)
- [ ] Add Breadcrumb schema where applicable
- [ ] Validate with Schema.org validator

### Monitoring

- [ ] Create `app/components/WebVitals.tsx` - Web Vitals tracking
- [ ] Create `app/api/analytics/route.ts` - Analytics endpoint
- [ ] Create `app/error.tsx` - Error boundary
- [ ] Create `app/global-error.tsx` - Global error boundary

### Supabase Optimization

- [ ] Enable RLS on all tables
- [ ] Use indexed columns in frequent queries
- [ ] Use `.select('needed_fields_only')`
- [ ] Implement connection pooling if needed

---

## ✅ VALIDATION section

- [ ] `npm run build` - No errors
- [ ] Check `view-source:http://localhost:3000` - Metadata in `<head>`
- [ ] Lighthouse: Performance 90+, SEO 100, Accessibility 90+
- [ ] PageSpeed Insights: Green Core Web Vitals
- [ ] Test sitemap: `http://localhost:3000/sitemap.xml`
- [ ] Test robots: `http://localhost:3000/robots.txt`
- [ ] Test Open Graph: Facebook Sharing Debugger
- [ ] Test structured data: Google Rich Results Test

---

## 🎯 TARGET METRICS

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse SEO | 100 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| INP | < 200ms |

---

## 🔗 REFERENCE FILES

- Implementation guide: `./README.md`
