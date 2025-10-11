# Cookie Consent System Implementation

## Completed: Task 2 - Cookie Consent System (Updated with next-intl migration)

### Overview
Implemented a complete GDPR-compliant cookie consent management system with database tracking, granular user controls, and conditional analytics loading. **Updated to use next-intl for translations.**

### Files Created/Updated

#### 1. Database Migration
**supabase/migrations/20251011120000_cookie_consent.sql**
- Created `cookie_consents` table with:
  - UUID primary key and session_id (unique)
  - Anonymized IP address (SHA-256 hash)
  - User agent tracking
  - Consent timestamp and version
  - Boolean flags for 4 cookie categories (essential, analytics, marketing, preferences)
  - Automatic timestamps (created_at, updated_at)
- Indexes for performance:
  - session_id (most common lookup)
  - consent_timestamp (for analytics)
  - consent_version (for re-prompting)
- RLS policies:
  - Public can INSERT (create new consent)
  - Public can SELECT (read own consent)
  - Public can UPDATE (modify preferences)
  - DELETE restricted to admins
- Trigger for auto-updating updated_at timestamp

#### 2. TypeScript Interfaces
**src/app/lib/supabase.ts** (updated)
- Added `CookieConsent` interface matching database schema
- Added `CookiePreferences` interface for client-side state
- Updated `Database` type to include `cookie_consents` table

#### 3. API Endpoints
**src/app/api/cookies/consent/route.ts**
- POST endpoint for storing consent:
  - Zod validation for request body
  - IP address anonymization using SHA-256
  - Upsert logic (insert or update existing)
  - Returns session_id and success status
- GET endpoint for retrieving consent:
  - Query parameter: session_id
  - UUID validation
  - Returns consent preferences (excluding sensitive data)
  - 404 if no consent found
- Error handling:
  - Zod validation errors (400)
  - Database errors (500)
  - Proper logging

#### 4. Client Components (Updated with next-intl)
**src/app/components/common/CookieConsentBanner.tsx**
- Main banner component (Client Component)
- **Updated to use `useTranslations('cookies.banner')` from next-intl**
- Features:
  - Shows on first visit or version change
  - Three action buttons: Accept All, Necessary Only (was Reject All), Customize
  - Slide-up animation from bottom
  - Close button (dismisses without saving)
  - Loading states during API calls
  - Cookie storage with 365-day expiration
  - Session ID generation (UUID v4)
  - Page reload after consent to apply changes
- Helper functions:
  - getCookie() - Read cookie from document
  - setCookie() - Write cookie with expiration
  - generateSessionId() - UUID v4 generator
  - saveConsent() - API call + cookie storage
  - applyPreferences() - Reload page if needed
- Translation keys used:
  - `cookies.banner.title`
  - `cookies.banner.description`
  - `cookies.banner.acceptAll`
  - `cookies.banner.necessaryOnly`
  - `cookies.banner.customize`

**src/app/components/common/CookieCustomizeModal.tsx**
- Modal for granular cookie selection
- **Updated to use `useTranslations('cookies.preferences')` from next-intl**
- Features:
  - Four cookie categories with toggle switches
  - Essential cookies always enabled (cannot toggle)
  - Individual descriptions for each category
  - Three action buttons: Save Preferences, Accept All, Necessary Only
  - Backdrop with blur effect
  - Scale-in animation
  - Accessible with keyboard navigation
- CookieOption sub-component:
  - Toggle switch with visual feedback
  - "Always Active" badge for essential cookies
  - Smooth transitions
- Translation keys used:
  - `cookies.preferences.title`
  - `cookies.preferences.description`
  - `cookies.preferences.necessary.title`
  - `cookies.preferences.necessary.description`
  - `cookies.preferences.analytics.title`
  - `cookies.preferences.analytics.description`
  - `cookies.preferences.marketing.title`
  - `cookies.preferences.marketing.description`
  - `cookies.preferences.preferences.title`
  - `cookies.preferences.preferences.description`

**src/app/components/common/CookieSettingsLink.tsx**
- Footer link to reopen cookie settings
- **Updated to use `useTranslations('cookies.banner')` from next-intl**
- Features:
  - Settings icon + text
  - Opens CookieCustomizeModal
  - Preserves existing session_id if available
  - Generates new session_id if needed
  - Reloads page after saving to apply changes
- Translation key used:
  - `cookies.banner.savePreferences`

**src/app/components/common/ConditionalAnalytics.tsx**
- Conditional Google Analytics loader
- Features:
  - Only loads if analytics consent is true
  - Checks cookie consent on mount
  - Listens for consent changes (custom event)
  - Uses Next.js Script component with afterInteractive strategy
  - Initializes gtag with:
    - IP anonymization (GDPR compliance)
    - Secure cookie flags (SameSite=Lax;Secure)
  - Reads GA_ID from environment variable
  - TypeScript declarations for gtag global

**src/app/components/common/Footer.tsx** (updated)
- Added import for CookieSettingsLink
- Added CookieSettingsLink to the legal links section
- Allows users to manage cookie preferences from footer

#### 5. Styling
**src/app/globals.css** (updated)
- Added CSS animations:
  - @keyframes slide-up (banner entrance)
  - @keyframes fade-in (modal backdrop)
  - @keyframes scale-in (modal content)
- Animation classes:
  - .animate-slide-up
  - .animate-fade-in
  - .animate-scale-in

#### 6. Layout Integration
**src/app/layout.tsx** (updated)
- Added dynamic imports:
  - CookieConsentBanner (already existed)
  - ConditionalAnalytics (new, ssr: false)
- Placed components at end of body:
  - CookieConsentBanner
  - ConditionalAnalytics
  - WebVitals

#### 7. Translations (Updated)
**src/messages/en.json, cs.json, de.json** (updated)
- Added `cookies.preferences.description` field to all three language files
- Existing translations structure:
  - `cookies.banner.*` - Banner text and buttons
  - `cookies.preferences.*` - Modal title, description, and cookie categories
- English description: "Customize your cookie preferences below. You can enable or disable different types of cookies according to your preferences."
- Czech description: "Přizpůsobte si níže své preference cookies. Můžete povolit nebo zakázat různé typy cookies podle svých preferencí."
- German description: "Passen Sie unten Ihre Cookie-Einstellungen an. Sie können verschiedene Arten von Cookies nach Ihren Präferenzen aktivieren oder deaktivieren."

### Key Features

#### GDPR Compliance
- Explicit consent required before loading analytics
- Granular control over cookie categories
- IP address anonymization (SHA-256)
- Consent versioning for policy updates
- Right to modify preferences anytime
- Secure cookie storage (SameSite=Lax)

#### User Experience
- Non-intrusive banner at bottom
- Smooth animations (respects prefers-reduced-motion)
- Clear categorization of cookies
- Easy-to-understand descriptions
- One-click accept/reject options
- Persistent preferences across sessions
- Multilingual support (EN, CS, DE) via next-intl

#### Technical Implementation
- Server-side API for consent storage
- Client-side cookie for quick access (using document.cookie API, appropriate for Client Components)
- Conditional script loading based on consent
- Type-safe with TypeScript
- Zod validation for API requests
- Error handling and logging
- Performance optimized with dynamic imports
- **Integrated with next-intl for translations**

### Cookie Categories

1. **Essential Cookies** (Necessary Cookies)
   - Always enabled (cannot be disabled)
   - Required for basic website functionality
   - Includes: cookie consent preferences, session management

2. **Analytics Cookies**
   - Optional (user can enable/disable)
   - Google Analytics tracking
   - IP anonymization enabled
   - Helps understand user behavior

3. **Marketing Cookies**
   - Optional (user can enable/disable)
   - Third-party advertising
   - Conversion tracking
   - Retargeting campaigns

4. **Preference Cookies**
   - Optional (user can enable/disable)
   - Language preferences
   - Theme settings (dark/light mode)
   - Personalization features

### Environment Variables Required

```env
# Optional - Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Database Setup

To apply the migration:
1. Open Supabase SQL Editor
2. Run the migration file: `supabase/migrations/20251011120000_cookie_consent.sql`
3. Verify tables, indexes, and RLS policies are created

### Testing Checklist

- [x] Banner appears on first visit
- [x] Accept All enables all cookies
- [x] Necessary Only disables optional cookies
- [x] Customize opens modal with correct state
- [x] Modal toggles work (except essential)
- [x] Preferences persist across sessions
- [x] API stores consent to database
- [x] Analytics only loads with consent
- [x] Settings link in footer works
- [x] Consent version change re-prompts user
- [x] IP address is anonymized
- [x] Translations work in all languages (EN, CS, DE)
- [x] Components use next-intl for translations

### Migration to next-intl

The cookie consent components were successfully migrated from the custom i18n system to next-intl:
- Changed import from `@/app/hooks/useTranslations` to `next-intl`
- Updated translation key structure to match next-intl conventions
- Changed from `const { t } = useTranslations()` to `const t = useTranslations('namespace')`
- All translation keys verified and working in all three languages

### Next Steps

Task 2.2 is complete. The cookie consent banner components are fully functional, integrated with the application, and using next-intl for translations. The next tasks in the spec are:
- Task 3: Enhanced contact form with email templates
- Task 4: Customer satisfaction survey system
- Task 5: Dynamic project gallery
- Task 6: SSR optimization

### Notes

- The system uses a simple UUID-based session tracking (no user accounts required)
- IP addresses are hashed before storage for privacy
- The consent version can be incremented to re-prompt users after policy changes
- Analytics scripts only load after user consent (GDPR compliant)
- The implementation follows Next.js 15 best practices with Server/Client Component separation
- Cookie storage uses `document.cookie` API (appropriate for Client Components, not `next/headers` which is for Server Components only)
- Footer now includes CookieSettingsLink for easy access to cookie preferences
