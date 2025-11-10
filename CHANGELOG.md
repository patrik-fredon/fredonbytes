# Changelog - Fredonbytes

All notable changes to this project will be documented here.

## [Unreleased] - 2025-11-10

### Added - SEO Optimization

#### Keywords & Metadata
- Enhanced Czech keywords for local SEO targeting Brno and Jihomoravský kraj
- Added 22+ targeted Czech keywords in cs.json including: responzivní web, tvorba e-commerce, programování aplikací, webdesign, správa sociálních sítí, Google Ads, etc.
- Updated metadata titles to include location-based keywords
- Improved meta descriptions with call-to-action and benefits

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

#### Documentation
- Created TODO.md for task tracking
- Created CHANGELOG.md for version history
- Updated GENERAL.md with SEO features section

### Technical Details
- All changes follow Next.js 15 best practices
- Maintained lightweight, modern codebase principles
- No increase in file complexity (all under 200 lines)
- Full compatibility with GMB (Google My Business)

---

*Following semantic versioning principles*
