# Changelog - Fredonbytes

All notable changes to this project will be documented here.

## [Unreleased] - 2025-11-10

### Added - Comprehensive SEO Optimization

#### Keywords & Metadata Expansion
- **Expanded to 70+ targeted keywords** covering ALL Fredonbytes services
- **Czech keywords (cs.json)**: 70+ keywords including web development, software development, mobile apps, full-stack, React, Next.js, API integration, cloud solutions, e-commerce, graphic design, UX/UI, branding, logo design, SEO, PPC, Google Ads, SEM, social media management, Instagram/Facebook/LinkedIn marketing, copywriting, IT consulting, cybersecurity, NIS2 compliance, GDPR, digital transformation, webhosting, 24/7 support, AI integration, automation, data analytics
- **English keywords (en.json)**: 70+ comprehensive IT services keywords
- **German keywords (de.json)**: 70+ keywords für alle IT-Dienstleistungen
- Updated metadata titles to include complete service spectrum
- Enhanced meta descriptions with CTAs and full service portfolio

#### Search Engine Support
- Added Seznam.cz crawler support in robots.ts with crawl delay
- Added Seznam verification meta tag support (NEXT_PUBLIC_SEZNAM_VERIFICATION)
- Enhanced robots.txt with SeznamBot specific rules

#### Local SEO Enhancements
- Added geo-targeting meta tags: coverage, distribution, target
- Enhanced LocalBusiness JSON-LD schema with:
  - alternateName, description, logo fields
  - currenciesAccepted, paymentAccepted fields
  - areaServed with City, AdministrativeArea, and Country
  - hasMap property for Google Maps integration
  - Full address structure for GMB compatibility

#### JSON-LD Schema Enhancement
- Expanded service definitions from 4 to 8 comprehensive services:
  * Software Development (web, mobile, full-stack, API, cloud)
  * Graphic Design & UX/UI (webdesign, branding, prototyping)
  * SEO & Digital Marketing (SEO, PPC, Google Ads, SEM, content)
  * Social Media Management (Instagram, Facebook, LinkedIn)
  * Copywriting & Content (SEO copywriting, content strategy)
  * IT Consulting & Cybersecurity (security audit, NIS2, GDPR)
  * Hosting & Technical Support (webhosting, 24/7 support)
  * AI Integration & Automation (AI, automation, data analytics)

#### Documentation
- Created TODO.md for task tracking
- Created CHANGELOG.md for version history
- Updated GENERAL.md with SEO features section

### Technical Details
- All changes follow Next.js 15 best practices
- Maintained lightweight, modern codebase principles
- All files remain under 250 lines (optimized structure)
- Full compatibility with GMB (Google My Business)
- Keywords reflect 2025 IT trends: AI, NIS2 compliance, automation

---

*Following semantic versioning principles*
