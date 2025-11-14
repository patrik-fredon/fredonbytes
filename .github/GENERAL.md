# Fredonbytes - Technical Documentation

## Project Overview

A Next.js 15 + TypeScript business website and link tree ecosystem with strong SEO, accessibility, and Supabase-backed data persistence. The project focuses on performance, server-side rendering, and an optimized developer DX with a minimal and maintainable stack.

## Tech Stack

- Framework: Next.js 15 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS (Tailwind v4)
- State & Forms: React Hook Form + Zod
- Database: Supabase (PostgreSQL) with Row Level Security
- Cache/Session: Redis
- Email: SMTP (Nodemailer)
- Internationalization: next-intl with `src/messages` JSON files
- Linter/Formatter: Biome (biome.json)

## Required Environment Variables (high-level)

Include the most important environment variables in `.env.local` copied from `.env.example`:

- NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_PRIMARY_DOMAIN
- NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- REDIS_URL
- CSRF_SECRET
- NEXT_PUBLIC_CONTACT_EMAIL, NEXT_PUBLIC_SUPPORT_EMAIL

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # Shared and feature components
├── lib/                 # Utilities and services (redis, supabase, etc.)
├── hooks/               # Reusable React hooks
├── messages/            # i18n JSON files (en, cs, de)
└── supabase/            # DB migrations
```

## Local Development / Common Commands

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Format: `npm run format`
- Type check: `npm run type-check`
- Generate icons: `npm run generate-icons`

## Internationalization

- Default locale: `cs`
- Supported locales: `cs`, `en`, `de`
- Implementation: `next-intl` with messages under `src/messages`.

## Deployment

- Recommended: Docker Compose (Coolify) or Vercel
- Configure environment variables in the deployment platform
- `docker-compose.yml` includes a production-ready setup for a container deployment

## Maintenance & Conventions

- Keep PRs small and scoped to a single logical change
- Rebase or use `git pull --rebase` before pushing
- Enforce Biome formatting for consistency: `npm run format`
- Minimal error handling: prefer clear failure modes; do not hide errors silently

---

**Last Updated**: 2025-11-14
**Maintained By**: Fredonbytes (<https://fredonbytes.eu/contact/>)
