# Changelog

All notable changes to this project are documented here.

## [Unreleased]

### Fixed
- **Form Navigation - Previous Button Validation Error**: Fixed stale validation error persisting when navigating backward in form. `handlePrevious()` now clears `validationError` state to prevent stale error messages from displaying on the destination question. ([FormClient.tsx](src/app/[locale]/form/[session_id]/FormClient.tsx) line 289-300)
- **Hydration Mismatch in AnimatedBackground**: Fixed React hydration warnings by replacing `useMemo` with `useState` + `useEffect` for responsive icon rendering. Server now always renders 3 icons, client updates after hydration based on viewport width. ([AnimatedBackground.tsx](src/components/common/AnimatedBackground.tsx) line 92-108)

### Known Issues
- 404 resource loading may appear after hot reload during development (Next.js cache-related, does not affect production)

---

## Previous Releases

[Previous changelog entries would continue here...]
