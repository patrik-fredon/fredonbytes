# Internationalization (i18n) Workflow

This document outlines the complete workflow for managing translations in the Fredonbytes project.

## Overview

The project supports three languages:

- **English (en)** - Primary/reference language
- **Czech (cs)** - Local market language
- **German (de)** - European market expansion

## Directory Structure

```
src/app/
├── locales/
│   ├── en/common.json    # English translations (reference)
│   ├── cs/common.json    # Czech translations
│   └── de/common.json    # German translations
├── lib/
│   └── i18n.ts          # Translation utilities
├── hooks/
│   └── useTranslations.ts # Translation hook
└── contexts/
    └── LocaleContext.tsx  # Locale context provider
```

## Translation File Structure

All translation files follow a nested JSON structure:

```json
{
  "navigation": {
    "about": "About",
    "services": "Services"
  },
  "pages": {
    "home": {
      "title": "Page title for SEO",
      "description": "Page description for SEO",
      "keywords": "Page keywords for SEO"
    }
  },
  "seo": {
    "defaultTitle": "Default site title",
    "defaultDescription": "Default site description"
  },
  "jsonLd": {
    "organizationName": "Organization name for structured data"
  }
}
```

## Key Translation Sections

### 1. Navigation (`navigation.*`)

UI navigation elements like menu items and buttons.

### 2. Content Sections

- `hero.*` - Homepage hero section
- `about.*` - About page content
- `services.*` - Services page content
- `contact.*` - Contact page content
- `pricing.*` - Pricing page content
- `projects.*` - Projects/portfolio content

### 3. SEO & Metadata (`seo.*`, `pages.*`, `jsonLd.*`)

- Page-specific titles, descriptions, keywords
- Open Graph metadata
- JSON-LD structured data
- Default fallback SEO content

### 4. Common Elements (`common.*`)

- Buttons, labels, status messages
- Reusable UI text across components

## Adding New Translations

### 1. Add to English (Reference)

Always start by adding new keys to `en/common.json`:

```json
{
  "newSection": {
    "title": "New Feature Title",
    "description": "Description of the new feature"
  }
}
```

### 2. Run Translation Manager

Execute the translation management script to sync keys:

```bash
node scripts/translation-manager.js
```

This will:

- Add missing keys to other locales with TODO placeholders
- Generate a translation analysis report
- Validate JSON structure

### 3. Translate TODO Items

Replace TODO placeholders in `cs/common.json` and `de/common.json`:

```json
{
  "newSection": {
    "title": "Název nové funkce", // Czech
    "description": "Popis nové funkce"
  }
}
```

## Using Translations in Components

### Basic Translation

```tsx
import { useTranslations } from "../hooks/useTranslations";

export default function MyComponent() {
  const { t } = useTranslations();

  return <h1>{t("navigation.about")}</h1>;
}
```

### Translation with Variables

```tsx
const { format } = useTranslations();

return (
  <p>
    {format("about.subtitle", {
      year: "2023",
      company: "Fredonbytes",
    })}
  </p>
);
```

### Page-Specific SEO

```tsx
import SEOHead from "../components/common/SEOHead";

export default function AboutPage() {
  return (
    <>
      <SEOHead page="about" />
      {/* Page content */}
    </>
  );
}
```

## SEO & Metadata Best Practices

### 1. Page-Specific Metadata

Each page should have its own SEO metadata in the `pages.*` section:

```json
{
  "pages": {
    "about": {
      "title": "About Fredonbytes - Your Digital Partner",
      "description": "Learn about our team and mission...",
      "keywords": "about, team, mission, fredonbytes"
    }
  }
}
```

### 2. Using SEOHead Component

```tsx
<SEOHead
  page="about" // Uses pages.about.* translations
  title="Custom Title" // Override if needed
  description="Custom description" // Override if needed
  canonical="https://example.com/about"
/>
```

### 3. Structured Data

JSON-LD structured data is automatically generated from `jsonLd.*` translations and applied to all pages.

## Translation Management Scripts

### Translation Manager (`scripts/translation-manager.js`)

```bash
node scripts/translation-manager.js
```

Features:

- Analyzes translation completeness across all locales
- Adds missing keys with TODO placeholders
- Validates JSON structure and removes duplicates
- Generates detailed analysis reports

### Manual Validation

```bash
# Check translation file syntax
node -c src/app/locales/en/common.json
node -c src/app/locales/cs/common.json
node -c src/app/locales/de/common.json
```

## URL Language Switching

The application uses query parameters for language switching:

- `?lang=en` - English
- `?lang=cs` - Czech
- `?lang=de` - German

### Implementing Language Switcher

```tsx
import { useTranslations } from "../hooks/useTranslations";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useTranslations();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as Locale)}
    >
      <option value="en">English</option>
      <option value="cs">Čeština</option>
      <option value="de">Deutsch</option>
    </select>
  );
}
```

## Best Practices

### 1. Key Naming

- Use camelCase for keys: `buttonText`, `errorMessage`
- Use nested structure for organization: `contact.form.submit`
- Keep keys descriptive and specific

### 2. Variable Interpolation

Use consistent variable naming in templates:

```json
{
  "welcome": "Welcome, {username}!",
  "itemCount": "You have {count} items"
}
```

### 3. Pluralization

Include count in pluralization:

```json
{
  "items": {
    "singular": "You have {count} item",
    "plural": "You have {count} items"
  }
}
```

### 4. TODO Management

- Always resolve TODO items before production
- Use descriptive TODO messages: `"TODO: Translate user dashboard title"`
- Track TODO count in translation reports

## Testing Translations

### 1. Visual Testing

- Test all UI elements in each language
- Verify text doesn't overflow containers
- Check right-to-left layout if needed

### 2. SEO Testing

- Verify meta tags are properly translated
- Check hreflang attributes
- Validate structured data

### 3. Automated Testing

```bash
# Run translation completeness check
npm run test:translations

# Validate JSON syntax
npm run validate:locales
```

## Deployment Considerations

### 1. Pre-deployment Checklist

- [ ] All TODO items resolved
- [ ] Translation completeness at 100%
- [ ] SEO metadata translated for all pages
- [ ] JSON files validated
- [ ] Hreflang attributes configured

### 2. Performance

- Translations are cached for performance
- Only active locale is loaded client-side
- Server-side rendering supports all locales

## Troubleshooting

### Common Issues

1. **Missing Translation Key**

   - Error: Returns key instead of translation
   - Solution: Add key to translation files

2. **Variable Interpolation Failure**

   - Error: Variables not replaced in text
   - Solution: Check variable names match exactly

3. **JSON Syntax Error**

   - Error: Translation file fails to load
   - Solution: Validate JSON syntax

4. **SEO Metadata Not Applied**
   - Error: Meta tags not updated
   - Solution: Ensure SEOHead component is used correctly

### Debug Mode

Enable translation debugging:

```tsx
const { t, hasTranslation } = useTranslations();

if (!hasTranslation("some.key")) {
  console.warn("Missing translation:", "some.key");
}
```

## Contributing

When adding new features that require translations:

1. Add English text first
2. Run translation manager script
3. Create PR with TODO items
4. Request translations from native speakers
5. Update PR with completed translations
6. Test in all supported languages

## Resources

- [React Intl Documentation](https://formatjs.io/docs/react-intl/)
- [Next.js Internationalization](https://nextjs.org/docs/advanced-features/i18n)
- [Google SEO Multi-language Guidelines](https://developers.google.com/search/docs/advanced/crawling/managing-multi-regional-sites)
