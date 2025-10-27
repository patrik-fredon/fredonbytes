# Implementation Plan

- [x] 1. Fix mobile navigation and responsive layout issues
  - Diagnose and fix mobile navigation hamburger menu functionality
  - Ensure all content is visible on mobile devices without horizontal scrolling
  - Implement proper touch targets (minimum 44px) for all interactive elements
  - Fix responsive breakpoints and ensure proper layout adaptation across all screen sizes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Create database schema and API endpoints for pricing system
  - Create Supabase database tables for pricing_tiers and pricing_items with JSONB multilingual support
  - Implement API endpoints at /api/pricing/tiers and /api/pricing/items
  - Add database seed data for three pricing tiers (starter, professional, enterprise) in all languages
  - Create pricing calculator items with CZK and EUR pricing
  - _Requirements: 3.2, 3.4, 3.5_

- [x] 3. Implement dedicated pricing page with database integration
  - Create new pricing page at /[locale]/pricing with full internationalization
  - Build dynamic pricing components that fetch data from Supabase
  - Implement three-tier pricing display with CZK/EUR currency switching
  - Add enhanced pricing calculator with database-driven items
  - Ensure mobile responsiveness for all pricing page components
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 4. Refactor homepage sections with CTA buttons
  - Modify AboutSection component to include prominent CTA button routing to /about page
  - Update PricingSection to show condensed three-tier preview with CTA to /pricing page
  - Refactor ProjectsSection to display featured projects with CTA to /projects page
  - Update ContactSection to show brief overview with CTA to /contact page
  - Ensure all CTA buttons work properly with next-intl routing
  - _Requirements: 2.1, 2.4, 7.1, 7.2, 7.3, 7.4_

- [x] 5. Enhance existing about page with comprehensive content
  - Expand the existing about page with more detailed company information
  - Ensure the about page content is fully responsive on mobile devices
  - Add proper meta tags and SEO optimization for the about page
  - Verify all about page content is properly translated in all three languages
  - _Requirements: 2.1, 2.2, 2.3, 2.5_

- [x] 6. Create dedicated contact page
  - Create new contact page at /[locale]/contact with existing ContactSection content
  - Move the multi-step contact form to the dedicated contact page
  - Ensure contact page is fully responsive and mobile-optimized
  - Add proper meta tags and internationalization for contact page
  - Update navigation to link to the new contact page
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [-] 7. Create enhanced projects page with gallery functionality
  - Create new projects page at /[locale]/projects with enhanced gallery interface
  - Implement project filtering by technology and category
  - Add detailed project information display with images, GitHub links, and previews
  - Create responsive gallery layout that works across all device sizes
  - Ensure all project content is properly internationalized
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 7.1 Create database schema for projects system
  - Create Supabase tables for projects, project_technologies, and technologies
  - Add seed data for existing projects with multilingual content
  - Implement API endpoints for projects data retrieval
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8. Update header navigation for new page structure
  - Update Header component navigation links to point to dedicated pages
  - Ensure mobile hamburger menu includes all new page links
  - Fix any navigation issues on mobile devices
  - Test navigation functionality across all screen sizes
  - _Requirements: 1.1, 1.2, 7.1, 7.2_

- [ ] 9. Optimize internationalization for all new features
  - Add translation keys for all new UI elements and content
  - Ensure complete Czech, English, and German translations for all new pages
  - Test language switching functionality on all new pages
  - Verify currency localization works properly for pricing
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 9.1 Create comprehensive translation files
  - Add missing translation keys to cs.json, en.json, and de.json files
  - Ensure all new page content has proper translation keys
  - Add currency formatting and localization support
  - _Requirements: 6.1, 6.2, 6.4_

- [ ] 10. Final testing and mobile optimization
  - Test all pages on various mobile devices and screen sizes
  - Verify all interactive elements work properly on touch devices
  - Ensure proper loading states and error handling on mobile
  - Validate accessibility compliance across all new features
  - Test performance and Core Web Vitals on mobile devices
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_