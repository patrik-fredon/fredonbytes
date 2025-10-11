# Implementation Plan

- [-] 1. Set up next-intl and migrate i18n system
  - Install next-intl package and configure Next.js plugin
  - Create i18n configuration files (request.ts, routing.ts)
  - Restructure translation files into namespaced JSON files (common, contact, survey, cookies, projects)
  - Update Next.js config to integrate next-intl plugin
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 1.1 Migrate existing components to use next-intl
  - Update Server Components to use `getTranslations` from next-intl/server
  - Update Client Components to use `useTranslations` hook from next-intl
  - Remove custom i18n utilities (lib/i18n.ts, contexts/LocaleContext.tsx, hooks/useTranslations.ts)
  - Update LanguageSwitcher component to use next-intl's locale switching
  - _Requirements: 4.3, 4.4, 4.5_

- [ ]* 1.2 Validate translation completeness
  - Create script to validate all translation keys exist in all locales
  - Test language switching functionality
  - Verify fallback to English for missing translations
  - _Requirements: 4.6, 4.7_

- [x] 2. Create database schema for cookie consent system
  - Create `cookie_consents` table with RLS policies
  - Add indexes for performance optimization
  - Create TypeScript interfaces for cookie consent data
  - Update Supabase client configuration
  - _Requirements: 1.5, 1.13_

- [x] 2.1 Implement cookie consent API endpoints
  - Create POST /api/cookies/consent endpoint for storing preferences
  - Create GET /api/cookies/consent endpoint for retrieving preferences
  - Implement Zod validation schemas for cookie preferences
  - Add IP address anonymization (SHA-256 hashing)
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 2.2 Build cookie consent banner components
  - Create CookieConsentBanner Client Component with Accept/Reject/Customize buttons
  - Create CookieCustomizeModal Client Component for granular selection
  - Create CookieSettingsLink component for footer
  - Implement cookie storage using next/headers cookies API
  - Add translations for all cookie-related text
  - _Requirements: 1.1, 1.2, 1.7, 1.8_

- [x] 2.3 Integrate cookie consent with analytics
  - Create conditional Script component for Google Analytics
  - Implement middleware to check cookie consent
  - Add logic to enable/disable analytics based on consent
  - Add logic to enable/disable marketing scripts based on consent
  - _Requirements: 1.9, 1.10_

- [ ]* 2.4 Test cookie consent flow
  - Test Accept All, Reject All, and Customize flows
  - Verify database storage of preferences
  - Test consent persistence across sessions
  - Test consent version updates and re-prompting
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 1.8_

- [ ] 3. Enhance contact form database schema
  - Create `contact_submissions` table with all required fields
  - Create `newsletter_subscribers` table
  - Add RLS policies for both tables
  - Create TypeScript interfaces for contact and newsletter data
  - _Requirements: 2.10_

- [ ] 3.1 Create multilingual email template system
  - Create email template utilities with next-intl integration
  - Implement customerConfirmationTemplate with survey link
  - Implement adminNotificationTemplate with contact details
  - Add HTML and plain text versions for all templates
  - Create email translation files (en, cs, de)
  - _Requirements: 2.2, 2.3, 2.4, 2.6_

- [ ] 3.2 Update contact form API endpoint
  - Update POST /api/contact/submit to use new schema
  - Add session_id generation for survey linking
  - Integrate email template system
  - Add newsletter subscription logic
  - Implement error handling and logging
  - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.7, 2.8, 2.9, 2.10_

- [ ] 3.3 Update contact form component
  - Add newsletter opt-in checkbox to form
  - Update form validation schema with Zod
  - Add loading states and error handling
  - Ensure form works as Server Component with Client Component inputs
  - _Requirements: 2.8, 2.9_

- [ ]* 3.4 Test contact form email flow
  - Test email sending to customer and admin
  - Verify email templates render correctly in all languages
  - Test newsletter subscription flow
  - Verify survey link generation
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.6, 2.10_

- [ ] 4. Create survey system database schema
  - Create `survey_questions` table with multilingual support
  - Create `survey_question_options` table
  - Create `survey_sessions` table
  - Create `survey_responses` table
  - Add RLS policies and indexes
  - Create TypeScript interfaces for survey data
  - _Requirements: 3.2, 3.5, 3.10_

- [ ] 4.1 Implement survey API endpoints
  - Create GET /api/survey/questions endpoint with session validation
  - Create POST /api/survey/submit endpoint
  - Add logic to link survey to contact submission
  - Implement session expiration and duplicate submission checks
  - Add multilingual question fetching
  - _Requirements: 3.2, 3.3, 3.4, 3.5, 3.7, 3.8, 3.10_

- [ ] 4.2 Create survey page and routing
  - Create /survey/[session_id]/page.tsx with dynamic routing
  - Implement session validation on page load
  - Add error handling for invalid/expired sessions
  - Create SurveyWrapper Server Component
  - _Requirements: 3.1, 3.2, 3.7_

- [ ] 4.3 Build survey form components
  - Reuse form components from existing /form implementation
  - Create SurveyClient component with multi-step logic
  - Implement SurveyNavigation with progress indicator
  - Create SurveyQuestionStep for rendering questions
  - Create SurveyThankYou completion screen
  - Add translations for all survey text
  - _Requirements: 3.3, 3.6, 3.9, 3.10_

- [ ] 4.4 Integrate survey with contact form
  - Update contact submission to create survey session
  - Add survey_sent and survey_completed flags to contact_submissions
  - Update email template to include survey link
  - _Requirements: 3.5_

- [ ]* 4.5 Test survey end-to-end flow
  - Test survey access from email link
  - Verify multi-step form functionality
  - Test response submission and storage
  - Verify duplicate submission prevention
  - Test invalid session handling
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.9_

- [ ] 5. Create project gallery database schema
  - Create `projects` table with multilingual fields
  - Add RLS policies for public read access
  - Add indexes for performance
  - Create TypeScript interfaces for project data
  - _Requirements: 6.2, 6.13_

- [ ] 5.1 Seed project gallery with initial data
  - Create SQL script to insert sample projects
  - Add project images to public folder or CDN
  - Populate translations for all projects (en, cs, de)
  - _Requirements: 6.2, 6.12_

- [ ] 5.2 Implement project gallery API endpoint
  - Create GET /api/projects endpoint
  - Add filtering by status and featured flag
  - Implement ordering by display_order
  - Add multilingual content fetching
  - _Requirements: 6.1, 6.9, 6.12_

- [ ] 5.3 Build project gallery Server Components
  - Create ProjectsGalleryPage as Server Component
  - Implement ProjectsGrid with data fetching
  - Add Suspense boundary with skeleton loading
  - Implement error handling
  - _Requirements: 6.1, 6.4, 6.10, 6.14, 6.15_

- [ ] 5.4 Create project card Client Components
  - Create ProjectCard component with hover animations
  - Implement ProjectFilter for technology/status filtering
  - Create ProjectModal for detailed view
  - Add responsive grid layout with Tailwind
  - _Requirements: 6.3, 6.4, 6.7, 6.8_

- [ ] 5.5 Implement animations with Framer Motion
  - Add entrance animations for project cards
  - Implement hover effects with scale and overlay
  - Add stagger animations for grid items
  - Respect prefers-reduced-motion preference
  - _Requirements: 6.5, 6.6_

- [ ] 5.6 Optimize project gallery performance
  - Implement lazy loading for images with Next.js Image
  - Add intersection observer for animation triggers
  - Optimize bundle size with dynamic imports
  - Test performance on mobile devices
  - _Requirements: 6.4, 6.5, 6.11_

- [ ]* 5.7 Test project gallery functionality
  - Test responsive layout on multiple devices
  - Verify animations work smoothly
  - Test filtering and sorting
  - Verify multilingual content display
  - Test accessibility with keyboard navigation
  - _Requirements: 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.12_

- [ ] 6. Optimize application for SSR
  - Audit all components and identify Client Component usage
  - Convert components to Server Components where possible
  - Move client-only logic to leaf components
  - _Requirements: 5.1, 5.2_

- [ ] 6.1 Implement Suspense boundaries
  - Add Suspense boundaries around async Server Components
  - Create skeleton loading components for each boundary
  - Implement streaming SSR for improved TTFB
  - _Requirements: 5.4, 5.5_

- [ ] 6.2 Optimize data fetching
  - Implement fetch caching with revalidate strategies
  - Use no-store for dynamic data
  - Add parallel data fetching where possible
  - _Requirements: 5.3, 5.7_

- [ ] 6.3 Implement dynamic imports for client components
  - Use next/dynamic for heavy Client Components
  - Add ssr: false for client-only components
  - Implement loading states for dynamic imports
  - _Requirements: 5.10_

- [ ] 6.4 Optimize third-party scripts
  - Use next/script with appropriate loading strategies
  - Implement conditional script loading based on cookie consent
  - Add defer/async attributes where appropriate
  - _Requirements: 5.8_

- [ ] 6.5 Optimize images and fonts
  - Ensure all images use Next.js Image component
  - Implement responsive image sizes
  - Use next/font for font optimization
  - _Requirements: 5.9_

- [ ] 6.6 Performance testing and optimization
  - Run Lighthouse audits on all pages
  - Measure Core Web Vitals (LCP, FID, CLS)
  - Analyze bundle size with webpack-bundle-analyzer
  - Optimize based on findings
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10_

- [ ] 7. Security hardening
  - Implement rate limiting on API routes
  - Add CSRF protection for form submissions
  - Configure Content Security Policy headers
  - Audit and update RLS policies
  - _Requirements: 1.5, 2.7, 3.5, 4.2, 5.2, 6.13_

- [ ] 7.1 Add input sanitization
  - Ensure all user inputs are validated with Zod
  - Implement XSS prevention in email templates
  - Add SQL injection prevention checks
  - _Requirements: 2.8, 3.4, 4.4_

- [ ]* 7.2 Security testing
  - Test rate limiting on API endpoints
  - Verify CSRF protection
  - Test RLS policies with different user roles
  - Run security audit with npm audit
  - _Requirements: All security-related requirements_

- [ ] 8. Final integration and testing
  - Test complete user flows end-to-end
  - Verify all translations are complete and accurate
  - Test responsive design on multiple devices
  - Verify accessibility compliance (WCAG 2.1 AA)
  - _Requirements: All requirements_

- [ ] 8.1 Create documentation
  - Document API endpoints with examples
  - Create admin guide for managing projects and surveys
  - Document environment variables and configuration
  - Create deployment checklist
  - _Requirements: All requirements_

- [ ]* 8.2 Pre-deployment testing
  - Run full test suite (unit, integration, E2E)
  - Perform load testing on API endpoints
  - Test email delivery in production environment
  - Verify database migrations and RLS policies
  - Run final Lighthouse audit
  - _Requirements: All requirements_

- [ ] 8.3 Deploy to production
  - Set up environment variables in Vercel
  - Run database migrations on production Supabase
  - Deploy application to Vercel
  - Verify all features work in production
  - Monitor error logs and performance metrics
  - _Requirements: All requirements_
