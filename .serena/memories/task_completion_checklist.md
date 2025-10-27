# Task Completion Checklist

## Code Quality Verification
- [ ] Run `npm run type-check` to verify TypeScript compilation
- [ ] Run `npm run lint` to check for linting issues
- [ ] Run `npm run lint:fix` to auto-fix linting issues
- [ ] Run `biome check .` for additional code quality checks

## Build Verification
- [ ] Run `npm run build` to ensure production build succeeds
- [ ] Check build output for any warnings or errors
- [ ] Verify bundle size is reasonable (check for unexpected increases)

## Functionality Testing
- [ ] Test in development mode (`npm run dev`)
- [ ] Verify all routes work correctly
- [ ] Test internationalization (all locales: cs, en, de)
- [ ] Test responsive design on different screen sizes
- [ ] Verify form submissions work (if applicable)
- [ ] Test external links and integrations

## Performance Checks
- [ ] Run Lighthouse audit for performance metrics
- [ ] Check Core Web Vitals scores
- [ ] Verify images are optimized and loading properly
- [ ] Test page load speeds

## Accessibility Verification
- [ ] Test keyboard navigation
- [ ] Verify screen reader compatibility
- [ ] Check color contrast ratios
- [ ] Validate ARIA labels and semantic HTML

## SEO Validation
- [ ] Verify meta tags are present and correct
- [ ] Check Open Graph and Twitter Card metadata
- [ ] Validate structured data (if applicable)
- [ ] Test sitemap generation

## Security Checks
- [ ] Verify environment variables are properly configured
- [ ] Check for exposed sensitive information
- [ ] Validate CSRF protection (if applicable)
- [ ] Test cookie consent functionality

## Deployment Preparation
- [ ] Update CHANGELOG.md with changes
- [ ] Verify all environment variables are set in production
- [ ] Test deployment in staging environment (if available)
- [ ] Confirm database migrations are applied (if applicable)