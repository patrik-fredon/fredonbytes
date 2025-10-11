# Requirements Document

## Introduction

This specification defines enhancements to the FredonBytes website to improve user experience, compliance, and engagement. The feature set includes: (1) an advanced cookie consent banner with granular controls and database tracking, (2) an enhanced contact form system with automated email templates and integrated customer survey, (3) a dynamic project gallery with database-driven content management, and (4) comprehensive i18n optimization using next-intl. These features will be implemented following Next.js 15 best practices with a focus on Server-Side Rendering (SSR), performance, and accessibility.

## Requirements

### Requirement 1: Advanced Cookie Consent Management

**User Story:** As a website visitor, I want to have granular control over cookie preferences so that I can make informed decisions about my data privacy and comply with GDPR/CCPA regulations.

#### Acceptance Criteria

1. WHEN a first-time visitor lands on any page THEN the system SHALL display a cookie consent banner with options to "Accept All", "Reject All", or "Customize"
2. WHEN a user clicks "Customize" THEN the system SHALL display categorized cookie options (Essential, Analytics, Marketing, Preferences)
3. WHEN a user selects "Accept All" THEN the system SHALL store all cookie preferences to the database with timestamp and user session information
4. WHEN a user selects specific cookie categories THEN the system SHALL store only the selected preferences to the database
5. WHEN cookie preferences are stored THEN the system SHALL include: session_id, ip_address (anonymized), user_agent, consent_timestamp, cookie_categories (JSON), and consent_version
6. WHEN a user has previously set preferences THEN the system SHALL respect those preferences on subsequent visits without showing the banner
7. WHEN a user wants to change preferences THEN the system SHALL provide a link in the footer to reopen cookie settings
8. IF the cookie policy is updated THEN the system SHALL increment the consent_version and re-prompt users for consent
9. WHEN analytics cookies are accepted THEN the system SHALL enable Google Analytics or similar tracking
10. WHEN marketing cookies are rejected THEN the system SHALL disable third-party marketing scripts

### Requirement 2: Enhanced Contact Form with Email Templates

**User Story:** As a potential customer, I want to receive immediate confirmation when I submit a contact form so that I know my inquiry was received and will be addressed promptly.

#### Acceptance Criteria

1. WHEN a user submits the contact form THEN the system SHALL send two emails: one to the customer and one to the admin
2. WHEN sending the customer email THEN the system SHALL use a professional HTML template with company branding
3. WHEN sending the customer email THEN the system SHALL include: personalized greeting, confirmation message, 24-hour response time commitment, and a hyperlink to the customer satisfaction survey
4. WHEN sending the admin email THEN the system SHALL include: customer details, inquiry message, timestamp, and customer contact information
5. WHEN generating the survey link THEN the system SHALL create a unique session_id and format the URL as `/survey/[session_id]`
6. WHEN the customer email is sent THEN the system SHALL support all three languages (EN, CS, DE) based on the user's selected locale
7. WHEN email sending fails THEN the system SHALL log the error and display a user-friendly error message
8. WHEN the form is submitted THEN the system SHALL validate all fields using Zod schema validation
9. WHEN the form includes a newsletter opt-in checkbox THEN the system SHALL store the preference in the database
10. IF the user opts in to the newsletter THEN the system SHALL add their email to the newsletter subscribers table

### Requirement 3: Customer Satisfaction Survey Integration

**User Story:** As a business owner, I want to collect feedback from customers who contact us so that I can measure satisfaction and improve our services.

#### Acceptance Criteria

1. WHEN a user clicks the survey link from the email THEN the system SHALL navigate to `/survey/[session_id]`
2. WHEN the survey page loads THEN the system SHALL fetch survey questions from the database similar to the existing `/form` implementation
3. WHEN the survey is displayed THEN the system SHALL use the same multi-step form interface as the customer satisfaction form
4. WHEN a user completes the survey THEN the system SHALL store responses in a separate `survey_responses` table
5. WHEN storing survey responses THEN the system SHALL link them to the original contact form submission via session_id
6. WHEN the survey is submitted THEN the system SHALL display a thank you message
7. WHEN an invalid or expired session_id is accessed THEN the system SHALL display a friendly error message
8. WHEN the survey questions are managed THEN the system SHALL allow admin configuration through the database
9. IF the user has already completed the survey THEN the system SHALL display a message indicating the survey was already submitted
10. WHEN the survey loads THEN the system SHALL support all three languages (EN, CS, DE)

### Requirement 4: Next-Intl Translation Optimization

**User Story:** As a multilingual user, I want all website content to be properly translated and optimized so that I can have a seamless experience in my preferred language.

#### Acceptance Criteria

1. WHEN implementing i18n THEN the system SHALL migrate from the custom i18n system to next-intl library
2. WHEN translations are defined THEN the system SHALL organize messages in structured JSON files for EN, CS, and DE locales
3. WHEN a component needs translation THEN the system SHALL use next-intl's `useTranslations` hook for Client Components
4. WHEN a Server Component needs translation THEN the system SHALL use next-intl's `getTranslations` function
5. WHEN the locale changes THEN the system SHALL update all translated content without page reload where possible
6. WHEN translations are missing THEN the system SHALL fall back to English and log a warning
7. WHEN new translation keys are added THEN the system SHALL validate that all three locales have corresponding translations
8. WHEN the cookie banner is displayed THEN the system SHALL show translated content based on the user's locale
9. WHEN email templates are generated THEN the system SHALL use the appropriate locale for the recipient
10. WHEN the project gallery is displayed THEN the system SHALL translate project descriptions and metadata

### Requirement 5: SSR Optimization with Next.js 15 Best Practices

**User Story:** As a website visitor, I want pages to load quickly with content visible immediately so that I have a fast and responsive browsing experience.

#### Acceptance Criteria

1. WHEN implementing components THEN the system SHALL default to Server Components unless client interactivity is required
2. WHEN client interactivity is needed THEN the system SHALL use the `'use client'` directive only for specific components
3. WHEN data fetching is required THEN the system SHALL use async Server Components with native fetch and caching
4. WHEN loading states are needed THEN the system SHALL implement React Suspense boundaries with fallback UI
5. WHEN streaming is beneficial THEN the system SHALL use streaming SSR for improved Time to First Byte (TTFB)
6. WHEN static content is rendered THEN the system SHALL leverage Next.js 15's automatic static optimization
7. WHEN dynamic content is required THEN the system SHALL use appropriate caching strategies (revalidate, no-store)
8. WHEN third-party scripts are loaded THEN the system SHALL use Next.js Script component with appropriate loading strategies
9. WHEN images are displayed THEN the system SHALL use Next.js Image component with proper optimization
10. IF a component requires client-side only rendering THEN the system SHALL use dynamic imports with `ssr: false`

### Requirement 6: Dynamic Project Gallery with Database Integration

**User Story:** As a website administrator, I want to manage project portfolio items through a database so that I can easily add, update, or remove projects without code changes.

#### Acceptance Criteria

1. WHEN the project gallery loads THEN the system SHALL fetch all projects from the Supabase database
2. WHEN projects are stored THEN the system SHALL include: title, description, image_url, github_link, live_demo_link, technologies (array), status, display_order, created_at, updated_at
3. WHEN the gallery is displayed THEN the system SHALL render projects in a responsive grid layout
4. WHEN the gallery renders THEN the system SHALL support multiple device sizes (mobile, tablet, desktop)
5. WHEN projects are displayed THEN the system SHALL include smooth animations using Framer Motion
6. WHEN animations are implemented THEN the system SHALL respect user's reduced motion preferences
7. WHEN a project card is hovered THEN the system SHALL display an animated overlay with project details
8. WHEN a user clicks a project THEN the system SHALL provide links to GitHub repository and live demo
9. WHEN projects are fetched THEN the system SHALL order them by display_order field
10. WHEN the gallery loads THEN the system SHALL implement skeleton loading states for better perceived performance
11. WHEN images are loaded THEN the system SHALL use lazy loading and Next.js Image optimization
12. WHEN project descriptions are displayed THEN the system SHALL support translations in all three languages (EN, CS, DE)
13. WHEN the database is queried THEN the system SHALL implement proper Row Level Security (RLS) policies
14. WHEN the gallery is rendered THEN the system SHALL be implemented as a Server Component with client components only for interactive elements
15. IF no projects are available THEN the system SHALL display an appropriate empty state message
