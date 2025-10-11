# Next-Intl Form and Survey Fixes

## Issue
After restructuring to use `app/[locale]` directory structure, the `/form` and `/survey` routes were broken because they were using absolute redirects without locale awareness.

## Root Cause
1. Redirect pages (`/form/page.tsx` and `/survey/page.tsx`) were using `redirect()` from `next/navigation` instead of locale-aware `redirect()` from `@/i18n/navigation`
2. Pages were not accepting `locale` parameter from route params
3. Pages were not calling `setRequestLocale(locale)` for static rendering
4. Dynamic session pages (`/form/[session_id]` and `/survey/[session_id]`) were missing locale parameter

## Fixes Applied

### 1. Form Redirect Page (`src/app/[locale]/form/page.tsx`)
- Added `locale` parameter to Props type
- Imported `redirect` from `@/i18n/navigation` instead of `next/navigation`
- Added `setRequestLocale(locale)` call
- Updated redirect call to pass locale: `redirect({ href: `/form/${sessionId}`, locale })`

### 2. Survey Redirect Page (`src/app/[locale]/survey/page.tsx`)
- Same changes as form redirect page
- Ensures survey sessions are created with proper locale context

### 3. Form Session Page (`src/app/[locale]/form/[session_id]/page.tsx`)
- Added `locale` to params interface
- Imported `setRequestLocale` from `next-intl/server`
- Imported `redirect` from `@/i18n/navigation`
- Added `setRequestLocale(locale)` call in component

### 4. Survey Session Page (`src/app/[locale]/survey/[session_id]/page.tsx`)
- Added `locale` to params interface
- Imported `setRequestLocale` from `next-intl/server`
- Added `setRequestLocale(locale)` call in component

### 5. Other Pages Fixed
Also updated these pages to accept locale parameter and call `setRequestLocale`:
- `src/app/[locale]/projects/page.tsx`
- `src/app/[locale]/links/page.tsx`
- `src/app/[locale]/cookie-policy/page.tsx`
- `src/app/[locale]/privacy-policy/page.tsx`

## How It Works Now

### Form Flow
1. User visits `/cs/form` (or `/en/form`, `/de/form`)
2. Server generates UUID and redirects to `/cs/form/{uuid}` with locale preserved
3. FormClient component loads with proper locale context
4. All translations work correctly

### Survey Flow
1. User receives email with survey link: `/cs/survey/{uuid}`
2. Page validates UUID and loads SurveyClient
3. Survey questions load in correct locale
4. Submissions include locale information

## Key Patterns

### Locale-Aware Redirect
```typescript
import { redirect } from '@/i18n/navigation';

redirect({ href: `/path/${id}`, locale });
```

### Page with Locale Parameter
```typescript
type Props = {
  params: Promise<{ locale: string; /* other params */ }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  // ... rest of component
}
```

## Testing
- ✅ `/cs/form` redirects to `/cs/form/{uuid}`
- ✅ `/en/form` redirects to `/en/form/{uuid}`
- ✅ `/de/form` redirects to `/de/form/{uuid}`
- ✅ Same for survey routes
- ✅ All pages accept locale parameter
- ✅ No TypeScript errors
- ✅ Static rendering enabled with `setRequestLocale()`

## Benefits
- Proper locale preservation across redirects
- Static rendering optimization
- Type-safe locale handling
- Consistent pattern across all pages
