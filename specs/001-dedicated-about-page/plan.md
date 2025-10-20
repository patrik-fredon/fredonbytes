# Implementation Plan: Dedicated About Page

**Branch**: `001-dedicated-about-page` | **Date**: 2025-10-20 | **Spec**: /mnt/git/fredonbytes/specs/001-dedicated-about-page/spec.md
**Input**: Feature specification from `/mnt/git/fredonbytes/specs/001-dedicated-about-page/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactor the About section into a dedicated page with navigation integration, featuring an emotional company story about Fredon's developer journey and the "All-in-One digital army" concept, plus complete team member profiles with photos and details. Implementation uses Next.js 15+ with App Router, TypeScript 5.9+, Tailwind CSS 4+, and Framer Motion for a light, optimized approach with next-intl for Czech/English/German translations.

## Technical Context

**Language/Version**: TypeScript 5.9+ with strict mode  
**Primary Dependencies**: Next.js 15+ with App Router, Tailwind CSS 4+, Framer Motion, next-intl  
**Storage**: Static JSON files for team member data and translations  
**Testing**: Jest/React Testing Library for component testing  
**Target Platform**: Web browsers (responsive design)  
**Project Type**: Web application (Next.js)  
**Performance Goals**: Lighthouse 95+ scores, Core Web Vitals (FCP <1.5s, LCP <2.5s, CLS <0.1), page load <3s  
**Constraints**: Light implementation without robust error handling, graceful degradation only, 6-10 team members expected  
**Scale/Scope**: Single page with company story and team profiles, static content with internationalization

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**I. Accessibility-First**: ✅ PASS - New page will implement AAA WCAG 2.1 compliance with keyboard navigation, screen reader support, and semantic HTML. Team member cards and company story content will be fully accessible.

**II. Performance-Optimized**: ✅ PASS - Implementation will maintain Lighthouse scores above 95 with Core Web Vitals targets (FCP <1.5s, LCP <2.5s, CLS <0.1). Light implementation approach ensures optimal performance.

**III. Security & Privacy**: ✅ PASS - Static content only, no user data handling. Follows existing GDPR compliance patterns with cookie consent integration where applicable.

**IV. Type-Safe Development**: ✅ PASS - All new TypeScript code will use strict mode with comprehensive type definitions for team member data and translation keys.

**V. Internationalization**: ✅ PASS - Full next-intl implementation for Czech, English, and German translations with complete translation files and proper locale routing.

*POST-DESIGN RE-EVALUATION: All constitution principles remain satisfied. Implementation approach confirmed to be compliant with light architecture requirements.*

## Project Structure

### Documentation (this feature)

```
specs/001-dedicated-about-page/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
src/
├── app/
│   ├── [locale]/
│   │   └── about/
│   │       ├── page.tsx          # Main About page component
│   │       └── layout.tsx        # Optional layout for About section
│   └── globals.css
├── components/
│   ├── about/
│   │   ├── CompanyStory.tsx      # Emotional company story component
│   │   ├── TeamSection.tsx       # Team member profiles grid
│   │   └── TeamMemberCard.tsx    # Individual team member card
│   └── common/                   # Shared components
├── lib/
│   ├── team-data.ts              # Static team member data
│   └── types/
│       └── about.ts              # TypeScript definitions
└── messages/
    ├── cs.json                   # Czech translations
    ├── en.json                   # English translations
    └── de.json                   # German translations
```

**Structure Decision**: Web application structure following Next.js App Router conventions. New About page at `/[locale]/about/page.tsx` with dedicated components in `components/about/`. Static team data in `lib/team-data.ts` and types in `lib/types/about.ts`. Translation files updated in existing `messages/` directory.

## Complexity Tracking

*No constitution violations identified - all requirements can be met with standard Next.js implementation patterns.*

