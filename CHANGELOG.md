# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Added

- **Docker & Coolify Deployment Support**: Added production-ready Docker configuration for Coolify deployment. Created multi-stage Dockerfile with Alpine Linux base (deps → builder → runner) for optimized Next.js standalone builds. Created docker-compose.yml with Redis 7-alpine caching layer (256MB memory limit, LRU eviction), health checks for both services, named volumes for Redis persistence, internal networking, and Coolify-compatible container naming. Added /api/health endpoint for container health monitoring. Updated next.config.ts with output: 'standalone'. Updated .env.example with REDIS_URL configuration. ([Dockerfile](Dockerfile) | [docker-compose.yml](docker-compose.yml) | [.dockerignore](.dockerignore) | [next.config.ts](next.config.ts) | [.env.example](.env.example) | [src/app/api/health/route.ts](src/app/api/health/route.ts))

### Changed

- **Complete Framer Motion Migration to CSS Animations**: Migrated entire project from Framer Motion (~40KB) to pure CSS animations for better mobile performance, reduced bundle size, and improved reliability. Added comprehensive animation utility classes to `globals.css` including hover effects (`hover-lift`, `hover-scale`), modal animations (`modal-backdrop`, `modal-content`), slide transitions (`slide-in-left/right/bottom`), fade effects (`fade-in-scale`), and stagger support. All animations are GPU-accelerated (transform + opacity only) and respect `prefers-reduced-motion`. Migration patterns documented in `FRAMER_MOTION_MIGRATION.md`. Removed `framer-motion` dependency from `package.json`. ([globals.css](src/app/globals.css) +205 lines animation utilities | All 22 component files | [FRAMER_MOTION_MIGRATION.md](FRAMER_MOTION_MIGRATION.md))

### Fixed

- **Homepage Sections Not Loading on Mobile Devices**: Replaced Framer Motion scroll animations with pure CSS `@keyframes` animations for guaranteed mobile visibility and better performance. Added mobile-optimized `fadeInUp` and `fadeInStagger` animations to `globals.css` with GPU acceleration (transform + opacity only). Animations run immediately on load with <500ms duration on mobile per 2025 best practices. Includes `prefers-reduced-motion` support and fallback to visible state. Removed Framer Motion from sections entirely, reducing bundle size and eliminating Intersection Observer timing issues on mobile. Maintains stagger effect via CSS `animation-delay`. ([globals.css](src/app/globals.css) | [AboutSection.tsx](src/components/homepage/AboutSection.tsx) | [ServicesSection.tsx](src/components/homepage/ServicesSection.tsx) | [PricingSection.tsx](src/components/homepage/PricingSection.tsx))
- **Mobile Menu Layout, Z-Index, and Language Switcher UX**: Fixed mobile nav rendering only within header container - moved to sibling of header for full-screen display. Fixed z-index utilities not generating from @theme - added explicit @layer utilities for z-1035/z-1036/z-1040. Fixed desktop nav links using absolute positioning. Refactored LanguageSwitcher with desktop/mobile variants - mobile shows horizontal flag buttons (rounded first/last) with active state highlighting, desktop keeps dropdown. Optimized menu toggle INP from 360ms to target <200ms via React 19 useTransition, 150ms debouncing, decoupled body classList to useEffect, and simplified animations (0.4s→0.25s). ([globals.css](src/app/globals.css) line 233-245, 444-471, 778-783 | [Header.tsx](src/components/common/Header.tsx) line 6, 20-21, 27-66, 161, 227-293 | [LanguageSwitcher.tsx](src/components/common/LanguageSwitcher.tsx) - full refactor with variant prop)

### Performance

- **Bundle Size Reduction**: Removed Framer Motion dependency (~40KB gzipped), replacing with pure CSS animations. Reduces JavaScript execution time and improves mobile battery life. All animations now run on GPU compositor thread for better performance.
- **HeroSection Mobile Terminal Optimization**: Optimized mobile terminal typing animation for faster initial load. Added lazy initialization with visibility detection (100ms delay). Reduced code snippets length for faster typing cycles. Improved typing speeds (80ms type, 30ms delete) with smoother transitions. Added skeleton loader during initialization. Made terminal responsive with text-xs on mobile, text-sm on larger screens. Continuous typing loop with automatic restart after deletion. ([HeroSection.tsx](src/components/homepage/HeroSection.tsx) line 24-26, 72-96, 325-347 | [page.tsx](src/app/[locale]/page.tsx) - HeroSection now dynamic import)
- **Form Navigation - Previous Button Validation Error**: Fixed stale validation error persisting when navigating backward in form. `handlePrevious()` now clears `validationError` state to prevent stale error messages from displaying on the destination question. ([FormClient.tsx](src/app/[locale]/form/[session_id]/FormClient.tsx) line 289-300)
- **Hydration Mismatch in AnimatedBackground**: Fixed React hydration warnings by replacing `useMemo` with `useState` + `useEffect` for responsive icon rendering. Server now always renders 3 icons, client updates after hydration based on viewport width. ([AnimatedBackground.tsx](src/components/common/AnimatedBackground.tsx) line 92-108)

### Removed

- **Framer Motion Library**: Removed `framer-motion` package (v12.16.0) and `src/lib/animation-variants.ts` file as all animations now use pure CSS. Run `npm install` to update dependencies.

### Known Issues

- 404 resource loading may appear after hot reload during development (Next.js cache-related, does not affect production)

---

## Previous Releases

[Previous changelog entries would continue here...]
