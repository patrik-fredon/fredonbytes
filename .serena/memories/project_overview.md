# FredonBytes Project Overview

## Purpose
FredonBytes is a corporate website for a cloud services company. The site includes:
- Homepage with hero, services, projects, pricing, about, and contact sections
- Linktree-style page for social media links
- Legal pages (privacy policy, cookie policy, terms of service)
- Multi-language support (English, Czech, German)
- Contact form with email integration
- Customer satisfaction survey system (in development)

## Tech Stack
- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5 (strict mode)
- **UI**: React 19, Tailwind CSS 4, Framer Motion 12
- **Forms**: React Hook Form 7, Zod validation
- **Icons**: Lucide React
- **Components**: Radix UI primitives, class-variance-authority
- **Email**: Resend API
- **Database**: Supabase (PostgreSQL) - being integrated
- **i18n**: Custom system with JSON translation files (en, cs, de)
- **Deployment**: Vercel

## Project Structure
```
src/app/
├── api/              # API routes (contact, form endpoints)
├── components/       # React components
│   ├── common/      # Shared components (Header, Footer, Button, etc.)
│   ├── homepage/    # Homepage sections
│   └── linktree/    # Linktree page components
├── contexts/        # React contexts (LocaleContext)
├── hooks/           # Custom hooks (useTranslations)
├── lib/             # Utilities (i18n, utils)
├── locales/         # Translation JSON files (en, cs, de)
└── [pages]/         # Route pages (cookie-policy, privacy-policy, etc.)

.kiro/specs/         # Feature specifications
docs/                # Documentation
scripts/             # Build and utility scripts
public/              # Static assets
```

## Key Features
- Server Components by default (Client Components only when needed)
- Mobile-first responsive design
- Dark mode support
- Accessibility compliance (WCAG 2.1 Level AA)
- Performance optimized (Lighthouse 90+)
- Custom i18n with URL-based language switching
