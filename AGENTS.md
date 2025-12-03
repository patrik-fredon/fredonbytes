---
applyTo: "**"
---

# Workflow

**Always use the ask_user tool before completing any task to confirm with the user that the request was fulfilled correctly.**
**Minimal, correct, production-usable code** — no over-engineering, no abstraction, no fallback.

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15+ | App Router |
| Language | TypeScript 5.9+ | Explicit types |
| Styling | Tailwind CSS 4 | Utility only |
| i18n | next-intl | `localePrefix: "always"` |
| Database | Supabase | PostgreSQL |
| Validation | Biome | Lint + format |
| State | React Context | Minimal |
| Auth | next-auth 5 | Beta |

## ⚙️ Absolute Constraints

**NO:**
- Tests unless explicitly requested
- Defensive coding, fallback systems, robustness patterns
- Unnecessary abstractions, wrappers, complex providers
- Overengineering, extraneous features, code, or files
- Robust error handling — only critical error logging
- Repetition, hardcoded values, multi-layer indirection
- Additional documentation files beyond `.github/`

**ALWAYS:**
- Implement `todos` and requirements exactly as specified
- Prefer direct, explicit code over indirection
- Fail clearly — never suppress or hide errors
- Follow official docs: Next.js, Tailwind, TypeScript, Supabase, next-intl
- Keep architecture lean, DRY, deterministic, verifiable
- Comment only critical logic and integration points
- Ask for clarification if requirements are unclear

## 📁 File Rules

| Rule | Value |
|------|-------|
| Max Lines | ≤200 — split if exceeding |
| Structure | Permanent only — no temp/mock/sandbox |
| Canonical | One implementation per module/function |
| Large Libs | Single dynamic file (icons, fonts, repetitive elements) |
| Docs | `.github/GENERAL.md`, `.github/TODO.md`, `.github/CHANGELOG.md` only |

## 💻 Coding Standards

- **Direct access** — avoid multi-layer indirection
- **Dynamic only** — data-driven, no hardcoded values
- **Pure logic** — no adjectives, commentary, or fluff
- **TypeScript** — explicit types throughout
- **Tailwind** — utility classes only, no CSS files except `globals.css`
- **Functional** — React components with hooks, no classes
- **Imports** — Absolute from `@/`, organized at top
- **Each line serves a purpose** — unnecessary code = debt

## 🎨 Rendering Strategy

| Priority | Method | Use Case |
|----------|--------|----------|
| 1 | SSG | Static, marketing pages |
| 2 | ISR | Products, content with revalidation |
| 3 | SSR | User-specific, SEO-critical |
| 4 | CSR | Dynamic user interactions only |

## 🔍 SEO & Performance

- SSR/ISR preferred for search visibility
- Metadata + Open Graph on all pages
- GMB tracking for local search
- Core Web Vitals priority
- Next.js Image optimization
- Lazy loading below-fold content
- Bundle splitting per route
- MDX for user content (blog, about, FAQ)

## 🌐 Internationalization

- **Default**: Czech (`cs`) | **Supported**: English (`en`)
- **Routing**: `src/app/[locale]/` with `localePrefix: "always"`
- **Messages**: `messages/{locale}.json`
- **Content**: Locale-specific files (`content-cs.tsx`, `content-en.tsx`)

## 📂 Structure

```
src/
├── app/[locale]/     # Locale routes
├── components/       # Reusable UI
├── lib/              # Utilities, context, services
├── types/            # TypeScript definitions
└── i18n/             # next-intl config
messages/             # Translation JSON
supabase/migrations/  # Database
.github/              # GENERAL.md, TODO.md, CHANGELOG.md
```

## 🛠️ MCP Tools Workflow

**Planning Phase:**
- Use `sequentialthinking` for step-by-step planning
- Use `serena` to search/crawl project files
- Use `context7` and `nextjs` tools for knowledge
- Use `websearch` for up-to-date best practices
- **NEVER** use file editing tools during planning

**Coding Phase:**
- Update `serena` memory after each change
- Implement directly — no changing plans mid-task
- **NEVER** change todos unless explicitly requested

**Debugging Phase:**
- Use `playwright` or browser devtools for frontend issues
- Use `serena` for code analysis

**Always:**
- Update memory after mandated changes
- Address all `todos` and TODO.md items directly
- Never implement unrequested features
- Never claim "production-ready" without successful build

## ✅ Verification

- **Manual only** — no automated tests
- **Working code** — justify changes through execution
- **Build success** required before claiming production-ready

## 🚀 Commands

```bash
npm run dev          # Development
npm run build        # Production build
npm run lint:fix     # Biome fix
npm run type-check   # TypeScript check
```

## 📋 Documentation

| File | Purpose |
|------|---------|
| `.github/GENERAL.md` | Project info, tech stack, structure |
| `.github/TODO.md` | Active tasks — continuously updated |
| `.github/CHANGELOG.md` | All changes made |

---

> **NEVER START WITHOUT FULLY UNDERSTANDING THESE RULES.**

**Focus**: One-shot, direct, deterministic. Simplest working version — nothing more, nothing less.
