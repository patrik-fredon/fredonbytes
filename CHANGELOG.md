# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Fixed
- **Homepage Sections Not Loading on Mobile Devices**: Replaced Framer Motion scroll animations with pure CSS `@keyframes` animations for guaranteed mobile visibility and better performance. Added mobile-optimized `fadeInUp` and `fadeInStagger` animations to `globals.css` with GPU acceleration (transform + opacity only). Animations run immediately on load with <500ms duration on mobile per 2025 best practices. Includes `prefers-reduced-motion` support and fallback to visible state. Removed Framer Motion from sections entirely, reducing bundle size and eliminating Intersection Observer timing issues on mobile. Maintains stagger effect via CSS `animation-delay`. ([globals.css](src/app/globals.css) | [AboutSection.tsx](src/components/homepage/AboutSection.tsx) | [ServicesSection.tsx](src/components/homepage/ServicesSection.tsx) | [PricingSection.tsx](src/components/homepage/PricingSection.tsx))
- **Mobile Menu Layout, Z-Index, and Language Switcher UX**: Fixed mobile nav rendering only within header container - moved to sibling of header for full-screen display. Fixed z-index utilities not generating from @theme - added explicit @layer utilities for z-1035/z-1036/z-1040. Fixed desktop nav links using absolute positioning. Refactored LanguageSwitcher with desktop/mobile variants - mobile shows horizontal flag buttons (rounded first/last) with active state highlighting, desktop keeps dropdown. Optimized menu toggle INP from 360ms to target <200ms via React 19 useTransition, 150ms debouncing, decoupled body classList to useEffect, and simplified animations (0.4s→0.25s). ([globals.css](src/app/globals.css) line 233-245, 444-471, 778-783 | [Header.tsx](src/components/common/Header.tsx) line 6, 20-21, 27-66, 161, 227-293 | [LanguageSwitcher.tsx](src/components/common/LanguageSwitcher.tsx) - full refactor with variant prop)

### Performance
- **HeroSection Mobile Terminal Optimization**: Optimized mobile terminal typing animation for faster initial load. Added lazy initialization with visibility detection (100ms delay). Reduced code snippets length for faster typing cycles. Improved typing speeds (80ms type, 30ms delete) with smoother transitions. Added skeleton loader during initialization. Made terminal responsive with text-xs on mobile, text-sm on larger screens. Continuous typing loop with automatic restart after deletion. ([HeroSection.tsx](src/components/homepage/HeroSection.tsx) line 24-26, 72-96, 325-347 | [page.tsx](src/app/[locale]/page.tsx) - HeroSection now dynamic import)
- **Form Navigation - Previous Button Validation Error**: Fixed stale validation error persisting when navigating backward in form. `handlePrevious()` now clears `validationError` state to prevent stale error messages from displaying on the destination question. ([FormClient.tsx](src/app/[locale]/form/[session_id]/FormClient.tsx) line 289-300)
- **Hydration Mismatch in AnimatedBackground**: Fixed React hydration warnings by replacing `useMemo` with `useState` + `useEffect` for responsive icon rendering. Server now always renders 3 icons, client updates after hydration based on viewport width. ([AnimatedBackground.tsx](src/components/common/AnimatedBackground.tsx) line 92-108)

### Known Issues
- 404 resource loading may appear after hot reload during development (Next.js cache-related, does not affect production)

---

## Previous Releases

[Previous changelog entries would continue here...]
