# Next-Intl Migration

## Overview
Successfully migrated the FredonBytes application from a custom i18n system to next-intl library.

## Changes Made

### 1. Client Components Migration
Updated all Client Components to use next-intl's `useTranslations` hook:
- Changed from `const { t } = useTranslations()` to `const t = useTranslations()`
- Replaced `tArray()` with `t.raw()` for array translations
- Replaced `format()` with `t()` for interpolated translations
- Updated imports from `@/app/hooks/useTranslations` to `next-intl`

### 2. LanguageSwitcher Component
Completely rewrote the LanguageSwitcher component:
- Uses `useLocale()` from next-intl to get current locale
- Uses `useRouter()` and `usePathname()` from `@/i18n/navigation` for locale switching
- Uses `useTransition()` for smooth locale transitions
- Removed dependency on custom LocaleContext

### 3. Layout Updates
Updated the root layout (`src/app/layout.tsx`):
- Made RootLayout async
- Added `NextIntlClientProvider` with messages and locale
- Removed custom `LocaleProvider`
- HTML lang attribute now set dynamically based on locale

### 4. Middleware Updates
Enhanced middleware (`src/middleware.ts`):
- Added locale detection from query parameter (`?lang=en`)
- Falls back to cookie (`NEXT_LOCALE`) if no query parameter
- Sets locale cookie for persistence
- Sets `x-next-intl-locale` header for next-intl
- Updated matcher to run on all routes (except API, _next, _vercel, and static files)

### 5. Request Configuration
Updated `src/i18n/request.ts`:
- Reads locale from multiple sources: requestLocale, header, cookie
- Falls back to default locale if none found
- Loads appropriate message file based on locale

### 6. Navigation Utilities
Created `src/i18n/navigation.ts`:
- Exports locale-aware navigation utilities: Link, redirect, usePathname, useRouter, getPathname
- Uses `createNavigation` from next-intl with routing configuration

### 7. Removed Files
Deleted custom i18n implementation:
- `src/app/lib/i18n.ts` - Custom translation utilities
- `src/app/contexts/LocaleContext.tsx` - Custom locale context provider
- `src/app/hooks/useTranslations.ts` - Custom translation hook

### 8. ClientLayoutWrapper Simplification
Simplified `src/app/components/ClientLayoutWrapper.tsx`:
- Removed locale-dependent logic
- HTML lang attribute now managed by server layout

## Locale Detection Strategy
The app uses a hybrid approach for locale detection:
1. Query parameter (`?lang=en`) - highest priority
2. Cookie (`NEXT_LOCALE`) - persisted preference
3. Default locale (`en`) - fallback

This maintains backward compatibility with the existing URL-based locale switching while leveraging next-intl's capabilities.

## Components Updated
- HeroSection
- AboutSection
- ServicesSection
- PricingSection
- ContactSection
- Header
- Footer
- CookieConsentBanner
- LanguageSwitcher
- TermsOfServicePage

## API Changes
- `useTranslations()` now returns a function directly, not an object
- Use `t.raw()` for non-string values (arrays, objects)
- Use `t()` with interpolation values for formatted messages
- `useLocale()` from next-intl returns the locale string directly

## Testing Recommendations
1. Test locale switching via query parameter
2. Verify cookie persistence across sessions
3. Test all translated components in all three locales (en, cs, de)
4. Verify array translations in PricingSection and TermsOfServicePage
5. Test LanguageSwitcher dropdown functionality
