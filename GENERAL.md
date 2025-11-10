# Fredonbytes - Technical Documentation

## Project Overview

**Fredonbytes** is a comprehensive business website and IT services platform showcasing modern web development capabilities. The project demonstrates professional Next.js development, advanced UI/UX design, and production-ready performance optimization.

**Tagline:** "Code. Create. Conquer." | "One Team. Zero Limits."

---

## Tech Stack

### Core Framework

- **Next.js:** 15.5.4 (App Router, React 19)
- **TypeScript:** 5.9.3 (strict mode)
- **React:** 19.0.0

### Styling & Design

- **Tailwind CSS:** 4.1.14 (utility-first, custom design tokens)
- **Framer Motion:** 12.16.0 (performant animations)
- **Fonts:**
  - Inter (UI text, variable font)
  - JetBrains Mono (code/dev elements, monospace)

### Content & Data

- **MDX:** @next/mdx 3.1.1 (Markdown + JSX)
- **Remark/Rehype:** Plugins for enhanced Markdown processing
  - remark-gfm, remark-breaks, remark-frontmatter
  - rehype-slug, rehype-autolink-headings, rehype-highlight
- **Supabase:** PostgreSQL database for forms, projects, pricing data
- **Validation:** Zod 3.25.51 (schema validation)

### Forms & Interactions

- **React Hook Form:** 7.57.0 (performant form handling)
- **Zod:** Type-safe validation schemas
- **Email:** Nodemailer 7.0.9

### Internationalization

- **next-intl:** 4.3.12
- **Supported Languages:** Czech (cs), German (de), English (en)
- **Routing:** localePrefix: "always" (`/cs/`, `/de/`, `/en/`)

### Development Tools

- **Linting:** Biome 2.2.0 (fast, modern linter + formatter)
- **Bundle Analysis:** @next/bundle-analyzer 15.5.6
- **Performance:** Lighthouse (target: 95+ score)

---

## Project Structure

```
fredonbytes/
├── src/
│   ├── app/
│   │   ├── [locale]/          # Localized routes
│   │   │   ├── layout.tsx     # Root layout with i18n
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── about/
│   │   │   ├── contact/
│   │   │   ├── pricing/
│   │   │   ├── projects/
│   │   │   ├── form/          # Customer satisfaction forms
│   │   │   ├── survey/
│   │   │   ├── links/         # Link tree
│   │   │   ├── policies/
│   │   │   ├── terms/
│   │   │   └── cookies/
│   │   ├── api/               # API routes
│   │   │   ├── contact/
│   │   │   ├── form/
│   │   │   ├── survey/
│   │   │   ├── projects/
│   │   │   ├── pricing/
│   │   │   ├── analytics/
│   │   │   ├── cookies/
│   │   │   └── csrf/
│   │   ├── globals.css        # Global styles + CSS variables
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── common/            # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── ...
│   │   ├── dev-ui/            # Developer-themed components (NEW)
│   │   │   ├── TerminalWindow.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── GlassCard.tsx
│   │   │   └── ...
│   │   ├── homepage/          # Homepage sections
│   │   ├── form/              # Form components
│   │   ├── about/
│   │   └── linktree/
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   ├── supabase.ts        # Database client
│   │   ├── email.ts           # Email utilities
│   │   ├── form-validation.ts
│   │   ├── animation-variants.ts  # Framer Motion variants (NEW)
│   │   └── types/
│   ├── hooks/
│   │   ├── useCsrfToken.ts
│   │   ├── useIntersectionObserver.ts
│   │   └── useReducedMotion.ts
│   ├── i18n/
│   │   ├── navigation.ts
│   │   ├── request.ts
│   │   └── routing.ts
│   ├── messages/
│   │   ├── cs.json
│   │   ├── de.json
│   │   └── en.json
│   ├── middleware.ts          # Next.js middleware (i18n, CSRF)
│   └── mdx-components.tsx
├── public/                    # Static assets
├── supabase/
│   ├── config.toml
│   └── migrations/            # Database schema migrations
├── scripts/
│   └── generate-icons.js
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
├── biome.json
├── package.json
├── TODO.md                    # Current implementation tasks
├── CHANGELOG.md               # Project history
└── GENERAL.md                 # This file
```

---

## Design System (Dev-Themed)

### Color Palette

**Primary Colors (60-30-10 Rule):**

1. **Deep Terminal Dark** `#0A0E27` (60%) - Backgrounds, foundation
2. **Neon Cyan** `#00D9FF` (30%) - Interactive elements, CTAs
3. **Electric Purple** `#A855F7` (10%) - Highlights, accents

**Supporting Colors:**

- Code Green: `#10B981` (success)
- Warning Amber: `#F59E0B` (warnings)
- Error Red: `#EF4444` (errors)
- Neutral Grays: slate-800 through slate-100

**Glow Effects:**

- Cyan Glow: `0 0 20px rgba(0, 217, 255, 0.5)`
- Purple Glow: `0 0 20px rgba(168, 85, 247, 0.5)`

### Typography

**Fonts:**

- **Inter** (variable) - UI text, body content
- **JetBrains Mono** - Code, dev elements, technical terms

**Type Scale:**

- Hero: 4.5rem / 72px
- H1: 3rem / 48px
- H2: 2.25rem / 36px
- H3: 1.875rem / 30px
- Body: 1rem / 16px
- Code: 0.9375rem / 15px

### Animation System

**Timing:**

- Instant: 100ms
- Fast: 180ms (micro-interactions)
- Normal: 300ms (transitions)
- Slow: 500ms (page loads)

**Easing:**

- Default: `cubic-bezier(0.2, 0.8, 0.2, 1)`
- Enter: `cubic-bezier(0.05, 0.8, 0.2, 1)`
- Exit: `cubic-bezier(0.4, 0, 0.2, 1)`

**Rules:**

- ONLY animate `transform` and `opacity`
- Use `will-change` sparingly
- Always respect `prefers-reduced-motion`
- No layout shift animations

### UI Components

**Dev-Themed Components:**

- **TerminalWindow** - Window chrome with 3-dot controls
- **CodeBlock** - Syntax highlighted code
- **GlassCard** - Glassmorphic cards
- **CommandButton** - Terminal-style buttons
- **GridBackground** - Animated grid patterns

**Common Components:**

- Button (variants: primary, secondary, ghost, outline, terminal)
- Header (glassmorphic, scrollable)
- Footer (code comment style)
- Form inputs (terminal aesthetic)
- Cards (window chrome)

---

## Development Guidelines

### Code Style

**TypeScript:**

- Strict mode enabled
- Explicit return types for functions
- No `any` types (use `unknown` if needed)
- Interface for object types, Type for unions/intersections

**React:**

- Functional components with hooks
- Server Components by default
- Client components ONLY when needed:
  - Animations
  - Form interactions
  - Event handlers
  - Browser APIs
- Props interfaces exported
- React.memo for expensive components

**Styling:**

- Tailwind utility classes (preferred)
- CSS modules for complex styling
- CSS variables for theming
- No inline styles (except dynamic values)

**Naming Conventions:**

- Components: PascalCase (e.g., `TerminalWindow.tsx`)
- Utilities: camelCase (e.g., `formatCurrency`)
- Constants: UPPER_SNAKE_CASE (e.g., `DEFAULT_LOCALE`)
- CSS classes: kebab-case (e.g., `terminal-window`)

### Performance Best Practices

**SSR/ISR:**

- Default to Server Components
- Use ISR for dynamic content (revalidate)
- Minimize client-side JavaScript
- Lazy-load animations

**Images:**

- Next.js Image component everywhere
- WebP with fallback
- Proper sizing and srcset
- Priority for above-fold images

**Fonts:**

- Self-hosted fonts
- `font-display: swap`
- Preload critical fonts
- Subset fonts

**Animations:**

- Transform/opacity only
- Intersection Observer for scroll animations
- Lazy-load Framer Motion
- Profile with React DevTools

**Targets:**

- Lighthouse Score: ≥ 95
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

### Accessibility Standards

- WCAG AAA compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast ratios met
- Focus states visible (cyan ring + glow)
- Touch targets ≥ 44x44px
- Alt text for images
- ARIA labels where needed
- Semantic HTML
- Form error announcements

### Testing Checklist

- [ ] TypeScript type checks pass
- [ ] Biome lint passes
- [ ] Lighthouse score ≥ 95
- [ ] Works on Chrome, Firefox, Safari, Edge
- [ ] Responsive on mobile, tablet, desktop
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Reduced motion respected
- [ ] No console errors/warnings

---

## Commands

### Development

```bash
npm run dev               # Start dev server (localhost:3000)
npm run build             # Production build
npm run start             # Production server
npm run type-check        # TypeScript validation
npm run lint              # Biome check
npm run format            # Biome format --write
npm run analyze           # Bundle analyzer
npm run generate-icons    # Icon generation script
```

### Quality Checks

```bash
npm run lint              # Check code style
npm run format            # Auto-format code
npm run type-check        # Validate TypeScript
```

---

## Environment Variables

Create `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-password

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://fredonbytes.cloud
```

---

## Key Features

### SEO Optimization (November 2025)

- **Multi-Engine Support**: Optimized for Google, Bing, and Seznam.cz
- **Local SEO**: Enhanced for Czech market with geo-targeting (Brno, Jihomoravský kraj)
- **Rich Snippets**: Comprehensive JSON-LD schemas (Organization, LocalBusiness, FAQ, BreadcrumbList)
- **GMB Compatible**: Full Google My Business integration with LocalBusiness schema
- **Keywords**: Targeted Czech keywords for local search optimization
- **Verification**: Support for Google, Bing, and Seznam verification meta tags
- **Robots.txt**: Optimized with SeznamBot support and proper crawl delays

### Internationalization

- 3 languages: Czech (default), German, English
- URL-based routing with locale prefix
- Translation management via JSON files
- Automatic locale detection
- Manual language switcher

### Forms & Surveys

- Session-based form system
- Multi-step navigation
- Progress persistence (localStorage)
- Real-time validation
- Email notifications
- Supabase storage

### Projects Portfolio

- Filterable project grid
- Technology tags
- Modal details
- GitHub integration
- Responsive grid layout

### Pricing System

- Multiple tiers
- Interactive calculator
- Currency toggle (CZK, EUR, USD)
- Feature comparisons

### Analytics & Tracking

- Cookie consent management
- GDPR compliance
- Conditional analytics loading
- Privacy-first approach

---

## Browser Support

**Supported:**

- Chrome/Edge: last 2 versions
- Firefox: last 2 versions  
- Safari: last 2 versions
- iOS: ≥ 14
- Android: ≥ 10

**Graceful Degradation:**

- Older browsers get functional UI
- CSS fallbacks for modern features
- No JavaScript requirement for core content

---

## Deployment

### Recommended Platform

- Vercel (optimal for Next.js)
- Automatic deployments from git
- Edge network delivery
- Environment variable management

### Build Output

```bash
npm run build
# Output: .next/ directory
# Static exports: out/ (if configured)
```

### Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Build succeeds without errors
- [ ] Type check passes
- [ ] Lint passes
- [ ] Performance audit complete
- [ ] SEO meta tags verified
- [ ] Sitemap/robots.txt configured

### Production SMTP Configuration

**Issue:** Default SMTP port 587 may not work on all hosting providers.

**Solution for Forpsi Hosting:**

- SMTP Server: `smtp.forpsi.com`
- Port: **465** (SSL/TLS) or **587** (STARTTLS)
- Authentication: Required
- Documentation: <https://support.forpsi.com/kb/a3147/konfigurace-smtp-serveru.aspx>

**Environment Variables for Production:**

```env
SMTP_HOST=smtp.forpsi.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@fredonbytes.cloud
SMTP_PASSWORD=your-password
```

**Note:** Ensure your email provider supports the SMTP configuration. Test email sending before going live.

---

## Maintenance & Updates

### Regular Tasks

- Monitor Core Web Vitals
- Review accessibility
- Update dependencies monthly
- Check browser compatibility
- Backup database
- Review analytics

### When Adding Features

1. Update TypeScript types
2. Add translations (cs, de, en)
3. Write accessible markup
4. Test performance impact
5. Update documentation
6. Add to CHANGELOG.md

---

## Resources & Documentation

- **Next.js:** <https://nextjs.org/docs>
- **Tailwind CSS:** <https://tailwindcss.com/docs>
- **Framer Motion:** <https://www.framer.com/motion/>
- **Supabase:** <https://supabase.com/docs>
- **next-intl:** <https://next-intl-docs.vercel.app/>

---

## Contact & Support

- **Website:** <https://fredonbytes.cloud>
- **Email:** <info@fredonbytes.cloud>
- **Phone:** +420 799 027 984
- **Location:** Brno, Czech Republic

---

*Last Updated: November 2025*
*Version: 1.0 (Dev-Themed Refactor)*
