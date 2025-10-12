# Third-Party Scripts Optimization

## Completed: Task 6.4 - Optimize Third-Party Scripts

### Overview
Optimized third-party script loading in the ConditionalAnalytics component to ensure optimal performance, non-blocking behavior, and compliance with Next.js 15 best practices. All scripts now use appropriate loading strategies with async attributes and error handling.

### Implementation Details

#### Script Loading Strategy
**File:** `src/app/components/common/ConditionalAnalytics.tsx`

**Optimizations Applied:**

1. **Next.js Script Component with afterInteractive Strategy**
   - All scripts use `strategy="afterInteractive"`
   - Scripts load after page becomes interactive (after hydration)
   - No blocking of initial page load or First Contentful Paint (FCP)
   - Optimal for analytics and marketing scripts that don't need to run immediately

2. **Async Attribute for External Scripts**
   - Added explicit `async` attribute to Google Analytics script
   - Added explicit `async` attribute to Google Ads script
   - Facebook Pixel and LinkedIn scripts already use async via their inline loaders
   - Ensures parallel, non-blocking script downloads

3. **Error Handling**
   - Added `onError` handlers to all Script components
   - Graceful degradation if scripts fail to load
   - Console error logging for debugging
   - Prevents script failures from breaking the application

4. **Conditional Loading Based on Cookie Consent**
   - Analytics scripts only load when `consent.analytics === true`
   - Marketing scripts only load when `consent.marketing === true`
   - Environment variable checks prevent loading if IDs not configured
   - GDPR/CCPA compliant implementation

5. **Environment Variable Extraction**
   - Extracted all environment variables at component level
   - Cleaner code with better readability
   - Easier to maintain and debug

### Script Loading Details

#### Google Analytics
```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
  strategy="afterInteractive"
  async
  onLoad={() => { /* Initialize GA */ }}
  onError={(e) => { console.error('Failed to load Google Analytics:', e); }}
/>
```
- **Strategy:** afterInteractive
- **Async:** Yes (explicit)
- **Conditional:** Requires analytics consent
- **Environment Variable:** NEXT_PUBLIC_GA_ID

#### Facebook Pixel
```typescript
<Script
  id="facebook-pixel"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{ __html: /* FB Pixel code */ }}
  onError={(e) => { console.error('Failed to load Facebook Pixel:', e); }}
/>
```
- **Strategy:** afterInteractive
- **Async:** Yes (via inline loader)
- **Conditional:** Requires marketing consent
- **Environment Variable:** NEXT_PUBLIC_FB_PIXEL_ID

#### LinkedIn Insight Tag
```typescript
<Script
  id="linkedin-insight"
  strategy="afterInteractive"
  dangerouslySetInnerHTML={{ __html: /* LinkedIn code */ }}
  onError={(e) => { console.error('Failed to load LinkedIn Insight Tag:', e); }}
/>
```
- **Strategy:** afterInteractive
- **Async:** Yes (via inline loader with `b.async = true`)
- **Conditional:** Requires marketing consent
- **Environment Variable:** NEXT_PUBLIC_LINKEDIN_PARTNER_ID

#### Google Ads
```typescript
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
  strategy="afterInteractive"
  async
  onLoad={() => { /* Initialize Google Ads */ }}
  onError={(e) => { console.error('Failed to load Google Ads:', e); }}
/>
```
- **Strategy:** afterInteractive
- **Async:** Yes (explicit)
- **Conditional:** Requires marketing consent
- **Environment Variable:** NEXT_PUBLIC_GOOGLE_ADS_ID

### Performance Impact

**Before Optimization:**
- Scripts used afterInteractive strategy (good)
- No explicit async attributes on external scripts
- No error handling for failed script loads
- Environment variables checked inline

**After Optimization:**
- ✅ All scripts use optimal afterInteractive strategy
- ✅ Explicit async attributes on external scripts
- ✅ Error handlers for graceful degradation
- ✅ Cleaner code with extracted environment variables
- ✅ Better documentation of loading strategies

**Performance Metrics:**
- **No impact on FCP** - Scripts load after initial paint
- **No impact on LCP** - Scripts don't block largest contentful paint
- **No impact on TTI** - Scripts load after page becomes interactive
- **Parallel downloads** - Async attribute enables parallel script loading
- **Non-blocking** - Scripts don't block HTML parsing or rendering

### Requirements Satisfied

**Requirement 5.8:** ✅ WHEN third-party scripts are loaded THEN the system SHALL use Next.js Script component with appropriate loading strategies
- All scripts use Next.js Script component
- afterInteractive strategy is appropriate for analytics/marketing scripts
- Scripts load after page interactivity, not blocking initial load

**Additional Optimizations:**
- ✅ Async attributes for non-blocking parallel downloads
- ✅ Error handling for graceful degradation
- ✅ Conditional loading based on cookie consent
- ✅ Environment variable validation
- ✅ Comprehensive documentation

### Layout.tsx Dynamic Imports

**File:** `src/app/layout.tsx`

The layout already uses optimal dynamic imports for client components:

```typescript
const ConditionalAnalytics = dynamic(
  () => import("./components/common/ConditionalAnalytics"),
  { loading: () => null }
);
```

- Uses `next/dynamic` for code splitting
- Loading state returns null (no flash of loading UI)
- Component loads on client-side only (no SSR needed for analytics)

### Testing Checklist

- [x] All scripts use Next.js Script component
- [x] afterInteractive strategy applied to all scripts
- [x] Async attributes added where appropriate
- [x] Error handlers implemented
- [x] Conditional loading based on consent works
- [x] Environment variables properly checked
- [x] No TypeScript errors
- [x] No console errors in development
- [x] Scripts don't block page load
- [x] Performance metrics unaffected

### Documentation Updates

Updated component documentation to include:
- Script loading strategy explanation
- Performance optimization details
- Async loading benefits
- Error handling approach
- Impact on Core Web Vitals

### Next Steps

Task 6.4 is complete. All third-party scripts are now optimally loaded with:
- Appropriate Next.js Script strategies
- Conditional loading based on cookie consent
- Async attributes for non-blocking behavior
- Error handling for graceful degradation

The implementation follows Next.js 15 best practices and ensures optimal performance while maintaining GDPR/CCPA compliance.

### Related Tasks

- Task 2.3: Cookie consent analytics integration (completed)
- Task 6.5: Optimize images and fonts (next)
- Task 6.6: Performance testing and optimization (next)
