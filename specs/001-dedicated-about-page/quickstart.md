# Quickstart Guide

**Feature**: Dedicated About Page
**Date**: 2025-10-20
**Status**: Ready for Implementation

## Overview

This guide provides quick validation steps for the Dedicated About Page feature. The implementation is designed for light deployment with static content and internationalization.

## Prerequisites

- Next.js 15+ project with App Router
- TypeScript 5.9+ with strict mode
- Tailwind CSS 4+ configured
- Framer Motion installed
- next-intl configured for Czech/English/German

## Quick Validation Steps

### 1. Route Accessibility
```bash
# Test navigation to About page
curl -I http://localhost:3000/en/about
curl -I http://localhost:3000/cs/about
curl -I http://localhost:3000/de/about
```
**Expected**: 200 OK responses for all locale routes

### 2. Component Rendering
```bash
# Start development server
npm run dev

# Manual testing checklist:
- [ ] Navigate to /en/about
- [ ] Verify company story displays
- [ ] Verify team member grid renders
- [ ] Check responsive design on mobile
- [ ] Test language switching
```

### 3. Performance Validation
```bash
# Run Lighthouse audit
npx lighthouse http://localhost:3000/en/about --output=json --output-path=./lighthouse-report.json

# Check Core Web Vitals in report
cat lighthouse-report.json | jq '.categories.performance.score'
```
**Expected**: Performance score > 0.95

### 4. Accessibility Testing
```bash
# Run axe accessibility tests
npx axe http://localhost:3000/en/about

# Manual accessibility checks:
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Color contrast is sufficient
- [ ] Focus indicators are visible
```

## Automated Testing

### Component Tests
```typescript
// components/about/CompanyStory.test.tsx
import { render, screen } from '@testing-library/react';
import { CompanyStory } from './CompanyStory';

test('renders company story with emotional content', () => {
  render(<CompanyStory />);
  expect(screen.getByRole('heading')).toBeInTheDocument();
  expect(screen.getByText(/digital army/i)).toBeInTheDocument();
});
```

### Integration Tests
```typescript
// app/[locale]/about/page.test.tsx
import { render, screen } from '@testing-library/react';
import AboutPage from './page';

test('renders about page with all sections', () => {
  render(<AboutPage />);
  expect(screen.getByText(/our story/i)).toBeInTheDocument();
  expect(screen.getByText(/meet our team/i)).toBeInTheDocument();
});
```

## Data Validation

### Team Member Data
```typescript
// lib/team-data.test.ts
import { teamMembers } from './team-data';

test('team members have required fields', () => {
  teamMembers.forEach(member => {
    expect(member.name).toBeTruthy();
    expect(member.position).toBeTruthy();
    expect(member.photo).toBeTruthy();
    expect(member.summary).toBeTruthy();
  });
});

test('team size within expected range', () => {
  expect(teamMembers.length).toBeGreaterThanOrEqual(6);
  expect(teamMembers.length).toBeLessThanOrEqual(10);
});
```

### Translation Validation
```typescript
// messages validation
test('all locales have about translations', () => {
  const locales = ['en', 'cs', 'de'];
  locales.forEach(locale => {
    const translations = require(`../messages/${locale}.json`);
    expect(translations.about).toBeDefined();
    expect(translations.about.companyStory).toBeDefined();
    expect(translations.about.team).toBeDefined();
  });
});
```

## Build Validation

### TypeScript Compilation
```bash
# Validate no type errors
npx tsc --noEmit
```
**Expected**: No errors or warnings

### Build Process
```bash
# Test production build
npm run build
```
**Expected**: Build completes successfully

### Linting
```bash
# Run ESLint
npm run lint
```
**Expected**: No warnings or errors

## Performance Benchmarks

### Core Web Vitals Targets
- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse Scores
- **Performance**: > 95
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

## Deployment Checklist

- [ ] All TypeScript types compile without errors
- [ ] ESLint passes with zero warnings
- [ ] Production build completes successfully
- [ ] Lighthouse scores meet targets
- [ ] All locale routes respond correctly
- [ ] Images load with proper fallbacks
- [ ] Keyboard navigation works throughout
- [ ] Screen reader compatibility verified

## Troubleshooting

### Common Issues

**Route not found**: Check that `[locale]/about/page.tsx` exists and exports default component

**Translations missing**: Verify all locale files have `about` section with required keys

**Images not loading**: Ensure image paths are correct and files exist in `/public/images/team/`

**Performance issues**: Check for large bundle sizes or unoptimized images

**Accessibility failures**: Run axe-core and fix reported violations

### Debug Commands

```bash
# Check route structure
find src/app -name "*about*" -type f

# Validate translation files
find src/messages -name "*.json" -exec jq '.about' {} \;

# Check image assets
ls -la public/images/team/

# Run performance audit
npx lighthouse http://localhost:3000/en/about
```

## Success Criteria Verification

Run this final validation script:

```bash
#!/bin/bash
echo "=== About Page Validation ==="

# Route checks
echo "Checking routes..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/en/about | grep -q "200" && echo "✅ EN route OK" || echo "❌ EN route failed"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cs/about | grep -q "200" && echo "✅ CS route OK" || echo "❌ CS route failed"
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/de/about | grep -q "200" && echo "✅ DE route OK" || echo "❌ DE route failed"

# Build check
echo "Checking build..."
npm run build > /dev/null 2>&1 && echo "✅ Build OK" || echo "❌ Build failed"

# Type check
echo "Checking types..."
npx tsc --noEmit > /dev/null 2>&1 && echo "✅ Types OK" || echo "❌ Types failed"

echo "=== Validation Complete ==="
```</content>
<parameter name="path">/mnt/git/fredonbytes/specs/001-dedicated-about-page/quickstart.md