# Performance Tooling Setup

## Overview
Completed setup of performance optimization tooling and dependencies for the FredonBytes project as part of the performance optimization spec.

## Dependencies Installed

### NPM Packages (devDependencies)
- `autoprefixer@10.4.21` - Adds vendor prefixes to CSS for cross-browser compatibility
- `cssnano@7.1.1` - CSS minification for production builds
- `@next/bundle-analyzer@15.5.4` - Webpack bundle analysis tool
- `lighthouse@13.0.0` - Performance auditing tool
- `@lhci/cli@0.15.1` - Lighthouse CI for automated testing

## Configuration Files

### 1. PostCSS Configuration (`postcss.config.mjs`)
Updated to include:
- **autoprefixer**: Configured with browserslist targeting last 2 versions of major browsers (Chrome, Firefox, Safari, Edge) and mobile platforms (iOS 14+, Android 10+)
- **cssnano**: Enabled only in production with optimizations for:
  - Comment removal
  - Whitespace normalization
  - Font value minification
  - Selector minification

### 2. Next.js Configuration (`next.config.ts`)
Added bundle analyzer integration:
- Wraps Next.js config with `withBundleAnalyzer`
- Enabled via `ANALYZE=true` environment variable
- Can be run with: `ANALYZE=true npm run build` or `npm run build:analyze`

### 3. Lighthouse CI Configuration (`.lighthouserc.json`)
Created comprehensive Lighthouse CI configuration:
- **Test URLs**: Homepage, /links, /form
- **Number of runs**: 3 (for averaging)
- **Performance thresholds**:
  - Performance score: ≥ 95
  - Accessibility score: ≥ 95
  - Best practices score: ≥ 95
  - SEO score: ≥ 95
- **Core Web Vitals thresholds**:
  - FCP: < 1500ms
  - LCP: < 2000ms
  - CLS: < 0.1
  - TBT: < 150ms

### 4. Package.json Updates
- Added `browserslist` configuration targeting modern browsers
- Added `lighthouse` script: `npm run lighthouse` (runs `lhci autorun`)

## Browserslist Configuration
Targets:
- Last 2 Chrome versions
- Last 2 Firefox versions
- Last 2 Safari versions
- Last 2 Edge versions
- iOS >= 14
- Android >= 10
- Excludes dead browsers and Opera Mini

## Usage

### Bundle Analysis
```bash
npm run build:analyze
# or
ANALYZE=true npm run build
```

### Lighthouse CI
```bash
npm run lighthouse
```

### Production Build with Optimizations
```bash
NODE_ENV=production npm run build
```

## Notes
- The PostCSS configuration automatically applies vendor prefixes during build
- cssnano only runs in production to keep development builds fast
- Bundle analyzer opens in browser automatically when enabled
- Lighthouse CI requires the app to be running on localhost:3000

## Pre-existing Issues
Note: There are pre-existing TypeScript errors related to Framer Motion type definitions that prevent the build from completing. These are unrelated to the performance tooling setup and should be addressed separately.
