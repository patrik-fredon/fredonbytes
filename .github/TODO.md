# TODO - FredonBytes

## 🔴 Critical Issues

### C1: Phone Number Mismatch in Footer

- **Location**: [src/components/Footer.tsx](../src/components/Footer.tsx)
- **Issue**: Footer displays `+420 733 517 625` but `tel:` href links to `+420799027984`
- **Fix**: Update tel: href to match displayed number or update displayed number to match href
- **Priority**: Critical

### C2: 500 Internal Server Errors on Projects Page

- **Location**: [src/app/[locale]/projects/page.tsx](../src/app/%5Blocale%5D/projects/page.tsx)
- **Issue**: Multiple 500 errors when loading projects page; TTFB: 2028ms (poor)
- **Fix**: Check Supabase connection and optimize database queries
- **Priority**: Critical

## 🟠 High Priority Issues

### H1: Language Switcher Shows Wrong Locale

- **Location**: [src/components/LanguageSwitcher.tsx](../src/components/LanguageSwitcher.tsx)
- **Issue**: On `/de/` page, switcher displays "🇺🇸 English" instead of "🇩🇪 Deutsch" during SSR
- **Fix**: Use locale-aware rendering or neutral placeholder during hydration
- **Priority**: High

### H2: vendor.css MIME Type Error

- **Location**: Browser/Build configuration
- **Issue**: Console error: "Refused to execute script from vendor.css because MIME type ('text/css') is not executable"
- **Fix**: Check [next.config.ts](../next.config.ts) CSS handling or CDN/proxy MIME type configuration
- **Priority**: High

### H3: Upload API Slow Response

- **Location**: [src/app/api/upload/route.ts](../src/app/api/upload/route.ts)
- **Issue**: Access code validation takes 5-8 seconds
- **Fix**: Review rate limiting, Redis connection, and Supabase query performance
- **Priority**: High

## 🟡 Medium Priority Issues

### M1: Missing Autocomplete Attribute

- **Location**: [src/app/[locale]/upload/page.tsx](../src/app/%5Blocale%5D/upload/page.tsx)
- **Issue**: Password/access code input missing autocomplete attribute
- **Fix**: Add `autoComplete="new-password"` to access code input
- **Priority**: Medium

### M2: Google Analytics Placeholder

- **Location**: Environment configuration
- **Issue**: Using placeholder `your_google_analytics_id` in network requests
- **Fix**: Set `NEXT_PUBLIC_GA_ID` in production `.env`
- **Priority**: Medium

### M3: FCP Needs Improvement on Projects Page

- **Location**: [src/app/[locale]/projects/page.tsx](../src/app/%5Blocale%5D/projects/page.tsx)
- **Issue**: FCP is 2100ms (needs improvement)
- **Fix**: Optimize initial render, consider skeleton loading
- **Priority**: Medium

## 🟢 Low Priority / Informational

### L1: Mobile LCP Optimization

- **Location**: Homepage
- **Issue**: LCP is 3400ms on mobile (375px viewport)
- **Fix**: Optimize hero images, defer non-critical resources
- **Priority**: Low

---

## ✅ Completed / Verified

### Upload Feature (2025-12-03)

- ✅ Project dropdown loads from API
- ✅ Form validation works correctly
- ✅ Access code validation returns proper 401 for invalid codes
- ✅ All three locales have complete translations (en/cs/de)
- ✅ UI renders correctly on desktop and mobile
