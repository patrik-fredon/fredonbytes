# Fredonbytes Project Overview

## Purpose
Comprehensive business website and IT services platform for Fredonbytes - "Code. Create. Conquer."

## Tech Stack
- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS 4.1.14
- **Animations:** Framer Motion 12.16.0
- **Content:** MDX support (@next/mdx, remark/rehype plugins)
- **Database:** Supabase (PostgreSQL)
- **Email:** Nodemailer 7.0.9
- **Forms:** React Hook Form + Zod validation
- **i18n:** next-intl 4.3.12 (Czech, German, English)
- **Icons:** Lucide React
- **Linting:** Biome 2.2.0

## Project Structure
- `/src/app/[locale]/` - Localized pages with App Router
- `/src/components/` - Reusable components (common, homepage, form, about, linktree)
- `/src/lib/` - Utilities, types, validation, email templates
- `/src/hooks/` - Custom React hooks
- `/src/i18n/` - Internationalization config
- `/src/messages/` - Translation files (cs.json, de.json, en.json)
- `/public/` - Static assets
- `/supabase/` - Database migrations

## Key Features
- Multi-language support (cs, de, en) with localePrefix: "always"
- SSR/ISR rendering for performance
- Dark mode support
- GDPR compliance (cookie consent, privacy policy)
- Customer satisfaction form/survey system
- Projects portfolio with filtering
- Pricing calculator
- Contact forms with email integration
- Link tree page
- Full accessibility (WCAG AA)

## Development Commands
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Biome check
- `npm run format` - Biome format
- `npm run type-check` - TypeScript validation
- `npm run analyze` - Bundle analysis
- `npm run generate-icons` - Icon generation script
