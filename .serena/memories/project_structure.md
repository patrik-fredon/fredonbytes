# Project Structure

## Root Directory
```
fredonbytes/
├── .git/                    # Git repository
├── .github/                 # GitHub workflows and templates
├── .kiro/                   # Kiro IDE configuration
│   ├── hooks/              # Agent hooks
│   ├── settings/           # IDE settings
│   ├── specs/              # Feature specifications
│   └── steering/           # Development guidelines
├── .serena/                # Serena project configuration
├── .specify/               # Specification templates and scripts
├── .vscode/                # VS Code configuration
├── public/                 # Static assets
├── specs/                  # Project specifications
├── src/                    # Source code
├── supabase/               # Database configuration and migrations
└── Configuration files
```

## Source Code Structure (`src/`)
```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── about/         # About page
│   │   ├── cookie-policy/ # Cookie policy
│   │   ├── form/          # Customer satisfaction form
│   │   ├── links/         # Link tree page
│   │   ├── privacy-policy/# Privacy policy
│   │   ├── projects/      # Projects showcase
│   │   ├── survey/        # Survey system
│   │   ├── terms-of-service/ # Terms of service
│   │   ├── layout.tsx     # Locale layout
│   │   └── page.tsx       # Homepage
│   ├── api/               # API routes
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── contact/       # Contact form API
│   │   ├── cookies/       # Cookie consent API
│   │   ├── form/          # Form system API
│   │   ├── projects/      # Projects API
│   │   └── survey/        # Survey API
│   ├── components/        # React components
│   │   ├── common/        # Reusable components
│   │   ├── form/          # Form-specific components
│   │   ├── homepage/      # Homepage sections
│   │   └── linktree/      # Link tree components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Additional components
├── i18n/                  # Internationalization configuration
├── lib/                   # Shared libraries and types
├── messages/              # Translation files (cs.json, de.json, en.json)
└── middleware.ts          # Next.js middleware
```

## Key Directories Explained
- **`[locale]/`**: Internationalized routes supporting cs, en, de
- **`api/`**: Server-side API endpoints for forms, contact, analytics
- **`components/`**: Organized by feature (common, homepage, form, linktree)
- **`lib/`**: Utilities, validation, database clients, email templates
- **`messages/`**: Translation files for all supported languages
- **`supabase/`**: Database schema and migrations