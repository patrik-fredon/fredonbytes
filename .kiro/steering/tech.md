# Tech Stack

## Framework & Language

- **Next.js 15.3.3** with App Router
- **TypeScript 5** with strict mode enabled
- **React 19** with React DOM 19

## Styling & UI

- **Tailwind CSS 4** with PostCSS
- **CSS Custom Properties** for design system tokens
- **Framer Motion 12** for animations
- **class-variance-authority** for component variants
- **Radix UI** components for accessible primitives
- **Lucide React** for icons

## Forms & Validation

- **React Hook Form 7** for form management
- **Zod 3** for schema validation
- **@hookform/resolvers** for integration

## Internationalization

- **Custom i18n system** with JSON translation files
- Three locales: `en` (English), `cs` (Czech), `de` (German)
- URL-based language switching via query parameters
- Translation utilities in `src/app/lib/i18n.ts`

## Email & API

- **Nodemailer with SMTP** for email handling
- API routes in `src/app/api/` directory

## Development Tools

- **ESLint 9** with Next.js, TypeScript, and accessibility rules
- **TypeScript compiler** for type checking
- **npm** as package manager

## Build & Deployment

- **Vercel** (recommended platform)
- **Standalone output** mode for optimized builds
- **Image optimization** with WebP and AVIF formats
- **Critters** for critical CSS inlining

## Common Commands

```bash
# Development
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Production build
npm run start                  # Start production server

# Code Quality
npm run lint                   # Run ESLint
npm run lint:fix              # Auto-fix ESLint issues
npm run type-check            # TypeScript type checking
npm run format                # Format with Prettier
npm run format:check          # Check formatting

# Translation Management
npm run translations:manage    # Sync translation keys
npm run translations:validate # Validate translations
npm run validate:locales      # Validate JSON syntax

# Pre-deployment
npm run pre-commit            # Lint + type-check + validate translations
npm run pre-deploy            # Full validation + build
npm run vercel-build          # Vercel build command

# Utilities
npm run clean                 # Remove .next directory
npm run build:analyze         # Analyze bundle size
npm run optimize              # Run optimization scripts
```

## Environment Variables

Required environment variables:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_here
SMTP_REJECT_UNAUTHORIZED=true

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
```

## Performance Optimizations

- Package imports optimized for `lucide-react` and `framer-motion`
- CSS optimization enabled
- Image formats: WebP, AVIF with responsive sizes
- Static optimization with standalone output
- 7-day cache TTL for images
