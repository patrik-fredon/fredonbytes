# Implementation Plan

- [x] 1. Setup Performance Tooling and Dependencies
  - Install autoprefixer, cssnano, bundle analyzer, and Lighthouse CI
  - Configure PostCSS with autoprefixer for cross-browser CSS compatibility
  - Setup bundle analyzer for webpack analysis
  - Configure Lighthouse CI for automated performance testing
  - Add browserslist configuration to package.json
  - _Requirements: 3.1-3.9, 8.1-8.8, 9.1-9.8_

- [-] 2. Code Cleanup - Remove Unused Code
  - [-] 2.1 Audit and remove unused imports across all TypeScript/React files
    - Scan all files in src/ directory for unused imports
    - Remove unused imports from components, pages, and utilities
    - _Requirements: 1.2_

  - [ ] 2.2 Identify and remove unused dependencies from package.json
    - Run dependency audit (depcheck)
    - Remove unused packages (appwrite, next-intl if not used)
    - Update package-lock.json
    - _Requirements: 1.3_

  - [ ] 2.3 Detect and remove unused React components
    - Analyze component usage across the codebase
    - Remove components that are never imported or used
    - _Requirements: 1.4_

  - [ ] 2.4 Identify and consolidate duplicate utility functions
    - Scan lib/ directory for duplicate functions
    - Consolidate duplicate code into single implementations
    - Update imports to use consolidated functions
    - _Requirements: 1.1, 1.5_

  - [ ] 2.5 Remove unused TypeScript interfaces and types
    - Scan for unused type definitions
    - Remove unused interfaces and types
    - _Requirements: 1.7_

- [ ] 3. Modernize Code Syntax
  - [ ] 3.1 Convert to modern async/await patterns
    - Replace Promise chains with async/await
    - Ensure consistent error handling with try/catch
    - _Requirements: 2.1_

  - [ ] 3.2 Apply modern JavaScript features
    - Use optional chaining (?.) where appropriate
    - Use nullish coalescing (??) for default values
    - Use object destructuring and spread operators
    - Convert appropriate functions to arrow functions
    - _Requirements: 2.3, 2.4, 2.5, 2.6_

  - [ ] 3.3 Ensure React 19 best practices
    - Verify all hooks follow React 19 patterns
    - Ensure Server Components are used by default
    - Use 'use client' directive only when necessary
    - _Requirements: 2.7_

- [ ] 4. CSS Cross-Browser Compatibility
  - [ ] 4.1 Configure autoprefixer in PostCSS
    - Update postcss.config.mjs with autoprefixer
    - Configure browserslist for target browsers
    - Add cssnano for CSS minification
    - _Requirements: 3.1-3.9, 7.3_

  - [ ] 4.2 Add vendor prefixes to globals.css
    - Add -webkit- prefixes for flexbox properties
    - Add -webkit- prefixes for transform properties
    - Add -webkit-keyframes for animations
    - Add -webkit-backdrop-filter for backdrop effects
    - Add -webkit-user-select and -moz-user-select
    - Add -webkit-appearance and -moz-appearance
    - Add -webkit-overflow-scrolling for smooth scrolling
    - _Requirements: 3.1-3.9_

  - [ ] 4.3 Optimize animation performance with GPU acceleration
    - Add transform: translateZ(0) to animation classes
    - Add backface-visibility: hidden to prevent flickering
    - Add will-change hints for transform and opacity
    - _Requirements: 3.4, 7.1_

  - [ ] 4.4 Add CSS feature detection fallbacks
    - Add @supports rules for backdrop-filter
    - Add fallback styles for unsupported features
    - _Requirements: 3.9, 9.8_

- [ ] 5. Enhanced JavaScript Bundle Optimization
  - [ ] 5.1 Enhance webpack code splitting configuration
    - Add framework chunk for React/Next.js
    - Add radix-ui chunk for UI components
    - Optimize chunk priorities and sizes
    - Update next.config.ts with enhanced splitChunks
    - _Requirements: 6.1, 6.3_

  - [ ] 5.2 Expand optimizePackageImports list
    - Add all @radix-ui packages to optimization list
    - Add date-fns to optimization list
    - Ensure lucide-react and framer-motion are optimized
    - _Requirements: 6.5, 6.8_

  - [ ] 5.3 Implement dynamic imports for heavy components
    - Convert AnimatedBackground to dynamic import
    - Convert CookieConsentBanner to dynamic import
    - Convert below-the-fold sections to dynamic imports (ContactSection, ProjectsSection, PricingSection)
    - Add loading fallbacks for each dynamic component
    - _Requirements: 6.2, 6.4, 6.7_

- [ ] 6. Image Optimization Audit
  - [ ] 6.1 Audit all image usage in components
    - Verify all images use Next.js Image component
    - Replace any <img> tags with <Image> component
    - _Requirements: 5.1_

  - [ ] 6.2 Optimize image loading strategies
    - Add priority prop to above-the-fold images
    - Ensure lazy loading for below-the-fold images
    - Configure appropriate quality settings (75-85)
    - Add responsive sizes prop for each image
    - _Requirements: 5.2-5.6_

  - [ ] 6.3 Verify image format configuration
    - Confirm WebP and AVIF formats are enabled
    - Verify deviceSizes and imageSizes configuration
    - Ensure minimumCacheTTL is set appropriately
    - _Requirements: 5.2, 5.3, 5.8_

- [ ] 7. Font Loading Optimization
  - [ ] 7.1 Implement Next.js font optimization
    - Import and configure Inter font from next/font/google
    - Add font-display: swap to prevent FOIT
    - Configure font subsets (latin, latin-ext for Czech)
    - Add font preloading
    - _Requirements: 5.7_

  - [ ] 7.2 Update layout.tsx with optimized font
    - Apply font variable to html element
    - Configure font fallbacks (system-ui, arial)
    - Update globals.css with font-family configuration
    - _Requirements: 5.7_

- [ ] 8. CSS Optimization and Purging
  - [ ] 8.1 Create Tailwind configuration file
    - Create tailwind.config.ts with content paths
    - Configure safelist for dynamic classes
    - Ensure Tailwind 4 purging is active
    - _Requirements: 7.2, 7.5_

  - [ ] 8.2 Audit and remove unused CSS classes
    - Scan globals.css for unused custom classes
    - Remove duplicate style definitions
    - Consolidate similar CSS rules
    - _Requirements: 1.6, 7.2_

  - [ ] 8.3 Optimize CSS delivery
    - Verify Critters is working for critical CSS
    - Ensure optimizeCss is enabled in next.config.ts
    - Configure cssnano for production minification
    - _Requirements: 7.1, 7.3, 7.4, 7.6, 7.7_

- [ ] 9. Performance Monitoring Implementation
  - [ ] 9.1 Create Web Vitals tracking component
    - Create WebVitals.tsx component with useReportWebVitals
    - Add console logging for development
    - Implement analytics endpoint for production
    - _Requirements: 8.1-8.8_

  - [ ] 9.2 Add WebVitals component to root layout
    - Import and render WebVitals in layout.tsx
    - Ensure it only runs on client side
    - _Requirements: 8.1-8.8_

  - [ ] 9.3 Create analytics API endpoint
    - Create /api/analytics/route.ts
    - Implement endpoint to receive Web Vitals data
    - Add logging or storage for metrics
    - _Requirements: 8.1-8.8_

  - [ ] 9.4 Setup Lighthouse CI configuration
    - Create .lighthouserc.json configuration file
    - Configure performance thresholds (95+ score)
    - Set up assertions for Core Web Vitals
    - Add Lighthouse CI to CI/CD pipeline
    - _Requirements: 8.1-8.8_

- [ ] 10. Caching Headers Optimization
  - [ ] 10.1 Verify static asset caching headers
    - Confirm long-term caching for images, fonts, icons
    - Verify cache-control headers in next.config.ts
    - _Requirements: 10.1, 10.5, 10.6, 10.7_

  - [ ] 10.2 Optimize API response caching
    - Add appropriate cache headers to API routes
    - Implement stale-while-revalidate where appropriate
    - _Requirements: 10.3_

- [ ] 11. Network Optimization
  - [ ] 11.1 Verify compression is enabled
    - Confirm Vercel enables gzip/brotli compression
    - Test compression on deployed site
    - _Requirements: 11.2_

  - [ ] 11.2 Optimize third-party script loading
    - Ensure all external scripts use async or defer
    - Minimize number of external requests
    - _Requirements: 11.3, 11.4_

  - [ ] 11.3 Implement font preloading
    - Add preload links for critical fonts
    - Verify font loading strategy
    - _Requirements: 11.5_

- [ ] 12. Accessibility Performance
  - [ ] 12.1 Verify reduced motion support
    - Ensure prefers-reduced-motion is respected
    - Test animation disabling with reduced motion
    - _Requirements: 12.3_

  - [ ] 12.2 Optimize keyboard navigation performance
    - Verify focus indicators are instant
    - Test keyboard navigation performance
    - _Requirements: 12.2_

  - [ ] 12.3 Verify semantic HTML structure
    - Ensure proper heading hierarchy
    - Verify ARIA labels where needed
    - Test with screen reader for performance
    - _Requirements: 12.1, 12.6_

- [ ] 13. Browser Compatibility Testing
  - [ ] 13.1 Manual testing in target browsers
    - Test in Chrome (latest 2 versions)
    - Test in Firefox (latest 2 versions)
    - Test in Safari (latest 2 versions)
    - Test in Edge (latest 2 versions)
    - Test in mobile Safari (iOS 14+)
    - Test in Chrome Mobile (Android 10+)
    - _Requirements: 9.1-9.6_

  - [ ] 13.2 Test responsive design on all breakpoints
    - Test mobile layout (320px-767px)
    - Test tablet layout (768px-1023px)
    - Test desktop layout (1024px+)
    - Test orientation changes
    - _Requirements: 4.1-4.8_

  - [ ] 13.3 Verify touch-friendly interactions
    - Ensure interactive elements are min 44x44px
    - Test touch interactions on mobile devices
    - _Requirements: 4.6_

- [ ] 14. Performance Testing and Validation
  - [ ] 14.1 Run Lighthouse audits
    - Run Lighthouse on homepage
    - Run Lighthouse on /links page
    - Run Lighthouse on /form page
    - Verify all scores are 95+
    - _Requirements: 8.1_

  - [ ] 14.2 Measure Core Web Vitals
    - Verify FCP < 1.5s
    - Verify LCP < 2.0s
    - Verify TTI < 3.0s
    - Verify CLS < 0.1
    - Verify TBT < 150ms
    - _Requirements: 8.2-8.6_

  - [ ] 14.3 Analyze bundle sizes
    - Run bundle analyzer (ANALYZE=true npm run build)
    - Verify total bundle < 200KB
    - Identify any large dependencies
    - _Requirements: 6.6_

  - [ ] 14.4 Test on slow network conditions
    - Test on Fast 3G
    - Test on Slow 3G
    - Verify critical content loads first
    - _Requirements: 11.6, 11.7_

- [ ] 15. Documentation and Deployment
  - [ ] 15.1 Update documentation
    - Document all performance optimizations made
    - Update README with performance metrics
    - Add performance testing instructions
    - _Requirements: All_

  - [ ] 15.2 Create performance monitoring dashboard
    - Document how to view Web Vitals data
    - Create guide for running Lighthouse CI
    - Add performance budget guidelines
    - _Requirements: 8.1-8.8_

  - [ ] 15.3 Deploy and verify in production
    - Deploy optimized version to Vercel
    - Run production Lighthouse audits
    - Verify all optimizations are working
    - Monitor Web Vitals in production
    - _Requirements: All_
