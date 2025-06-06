# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Complete Czech translation implementation with all 30 SEO-specific TODO items resolved
- Complete German translation implementation with all 30 remaining SEO-specific TODO items resolved
- Comprehensive internationalization (i18n) system with support for English, Czech, and German
- Advanced SEO metadata management with page-specific and multilingual support
- Translation management and validation scripts for maintaining translation quality
- Enhanced mobile responsiveness with modern CSS features and optimizations
- Accessibility improvements following WCAG guidelines
- Comprehensive ESLint configuration with TypeScript, React, and accessibility rules
- Design system with CSS custom properties for consistent theming
- Print styles and reduced motion support for better user experience
- Safe area support for modern mobile devices
- Loading states and animation utilities
- Complete cookie consent banner with multilingual support
- Missing translation keys for contact form and user interface elements
- Enhanced mobile navigation with hamburger menu animations
- Touch-friendly interface elements with proper sizing for mobile devices
- Advanced mobile optimizations including text size adjustment and form improvements
- Translation keys for Terms of Service, Privacy Policy, and Cookie Policy pages
- Updated PricingSection component with translation support for calculator title and description
- Comprehensive translation content for all legal pages in English, Czech, and German

### In Progress

- Complete replacement of hardcoded text with translation keys in legal pages
- TypeScript compatibility improvements for array-based translations
- Service options translation integration in pricing calculator

### Known Issues

- Some TypeScript errors in Terms of Service page due to array translation handling
- Complex array translations need type casting improvements
- Service options in pricing calculator still use hardcoded values

### Removed

- **Codebase Cleanup & Optimization**
  - Removed unused legacy banner images: `public/banner-big-fredonbytes.png`, `public/banner-smaller.png`, `public/banner-you-can-fredonbytes.png`
  - Removed duplicate logo files: `public/logo_bigger.png`, `public/logo_bigger.svg`
  - Removed redundant documentation from `public/docs/` directory (content duplicated in main `/docs` folder)
  - Cleaned up obsolete assets while preserving all actively used files and components
  - Reduced project size and eliminated potential confusion from unused assets

### Enhanced

- **Translation System**

  - Complete translation files for all supported languages (en, cs, de)
  - Structured JSON format with nested organization
  - Page-specific SEO metadata for all major pages
  - JSON-LD structured data for better search engine understanding
  - Variable interpolation support for dynamic content
  - Fallback mechanisms for missing translations

- **SEO & Metadata**

  - Dynamic meta tag management using client-side updates
  - Automatic hreflang generation for multilingual SEO
  - Open Graph and Twitter Card metadata
  - Canonical URL support
  - JSON-LD structured data with organization information
  - Page-specific title, description, and keywords

- **Developer Experience**

  - TypeScript configuration improvements
  - ESLint rules for code quality and accessibility
  - npm scripts for translation management and validation
  - Comprehensive documentation for i18n workflow
  - Automated translation completeness checking

- **Mobile & Accessibility**

  - Mobile-first responsive design approach
  - Touch-friendly interactive elements (48px minimum touch targets)
  - Screen reader support with skip links and ARIA labels
  - High contrast mode support
  - Reduced motion preferences respect
  - Focus management for keyboard navigation
  - Enhanced mobile navigation with animated hamburger menu
  - Improved mobile typography and spacing
  - Better mobile form inputs (16px font size to prevent zoom on iOS)
  - Mobile grid layouts and card optimizations

- **Performance & UX**
  - Translation caching for improved performance
  - Loading state animations and placeholders
  - Smooth scroll behavior and CSS animations
  - Error boundary styling
  - Form validation enhancements
  - Cookie consent banner with granular privacy controls
  - Multi-step contact form with progress indication
  - Animated mobile navigation with smooth transitions

### Technical Improvements

#### Translation Infrastructure

- **Translation Files**: Complete restructuring of locale files with comprehensive content
- **Translation Hook**: Enhanced `useTranslations` hook with additional utility methods
- **SEO Integration**: Seamless integration between translations and SEO metadata
- **Validation System**: Automated validation for translation completeness and syntax

#### Code Quality

- **ESLint Configuration**: Enhanced rules for TypeScript, React, accessibility, and performance
- **TypeScript Setup**: Improved configuration with better module resolution
- **File Organization**: Clear separation of concerns with dedicated directories

#### CSS & Styling

- **Design System**: CSS custom properties for consistent theming across the application
- **Responsive Design**: Mobile-first approach with comprehensive breakpoint management
- **Accessibility**: WCAG-compliant focus management and screen reader support
- **Performance**: Optimized animations with respect for user preferences

### Scripts & Automation

- **Translation Manager** (`scripts/translation-manager.js`): Automated translation file management
- **Translation Validator** (`scripts/validate-translations.js`): Comprehensive validation system
- **npm Scripts**: Added scripts for development workflow automation

### Documentation

- **I18n Workflow** (`docs/I18N_WORKFLOW.md`): Complete guide for translation management
- **Enhanced README**: Updated with new features and development guidelines

## Translation Status

### Supported Languages

- **English (en)**: ✅ Complete (412 keys, 100% translated)
- **Czech (cs)**: ✅ Complete (412 keys, 100% translated, 0 TODO items)
- **German (de)**: ✅ Complete (412 keys, 100% translated, 0 TODO items)

### Translation Coverage

- Navigation and UI elements: ✅ Complete for all languages
- Content sections (hero, about, services, etc.): ✅ Complete for all languages
- SEO metadata: ✅ Complete for all languages (EN/CS/DE)
- Error messages and forms: ✅ Complete for all languages
- JSON-LD structured data: ✅ Complete for all languages

## Features by Category

### 🌐 Internationalization

- Multi-language support (EN/CS/DE)
- URL-based language switching
- Automatic locale detection
- Translation caching and performance optimization
- Variable interpolation in translations
- Pluralization support

### 🔍 SEO & Metadata

- Page-specific metadata management
- Multilingual hreflang attributes
- JSON-LD structured data
- Open Graph and Twitter Card support
- Canonical URL management
- Dynamic meta tag updates

### 📱 Mobile & Responsive

- Mobile-first responsive design
- Touch-friendly interface elements
- Safe area support for modern devices
- Viewport optimization
- Progressive enhancement

### ♿ Accessibility

- WCAG 2.1 compliance features
- Screen reader optimization
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences
- Focus management

### 🛠️ Developer Tools

- Translation management automation
- Code quality enforcement
- Type safety improvements
- Development workflow scripts
- Comprehensive documentation

## Breaking Changes

None in this release.

## Migration Guide

No migration required for existing implementations.

## Dependencies

- Next.js 15.3.3
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 4.x
- ESLint 9.x

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with modern CSS support

## Performance Metrics

- Translation files are cached for optimal performance
- CSS custom properties reduce style recalculation
- Mobile-optimized responsive breakpoints
- Efficient animation with hardware acceleration

## Security Considerations

- XSS prevention in translation interpolation
- Secure meta tag injection
- Sanitized user input in forms
- CSRF protection ready

## Future Roadmap

- [x] Complete Czech translations
- [x] Complete German translations
- TBA

---

**Note**: This changelog will be updated with each release. For detailed commit history, please refer to the Git repository.
