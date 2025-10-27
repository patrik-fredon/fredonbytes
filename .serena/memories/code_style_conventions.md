# Code Style and Conventions

## File Structure
- **App Router**: Uses Next.js 15 App Router pattern
- **Locale Structure**: `src/app/[locale]/` for internationalized routes
- **Component Organization**: 
  - `src/app/components/common/` - Reusable components
  - `src/app/components/homepage/` - Homepage-specific sections
  - `src/app/components/form/` - Form-related components
  - `src/app/components/linktree/` - Link tree components

## Import Conventions
```typescript
// Cross-boundary imports via path aliases
import { Header } from "@/components";
import { calculatePricing } from "@/lib/pricing";

// Same-directory imports are relative
import { helperFunction } from "./utils";
```

## TypeScript Standards
- **Strict Mode**: Enabled with noEmit type checking
- **Type Definitions**: Comprehensive typing for all components
- **Interface Naming**: PascalCase with descriptive names
- **Props Types**: Defined as `type Props = { ... }`

## Component Patterns
- **Functional Components**: React functional components with hooks
- **Dynamic Imports**: Used for performance optimization
- **Suspense Boundaries**: Implemented for below-the-fold content
- **Client Components**: Marked with "use client" when needed

## Styling Conventions
- **Tailwind CSS**: Utility-first approach
- **CSS Variables**: Used for theme customization
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Supported via CSS variables

## Naming Conventions
- **Files**: PascalCase for components, kebab-case for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **CSS Classes**: Tailwind utility classes

## Performance Patterns
- **Dynamic Imports**: For heavy components
- **Image Optimization**: Next.js Image component with proper sizing
- **Font Loading**: Inter font with display: swap
- **Bundle Splitting**: Automatic via Next.js

## Accessibility Standards
- **WCAG 2.1 Level AA**: Full compliance
- **Semantic HTML**: Proper use of semantic elements
- **ARIA Labels**: Comprehensive labeling
- **Keyboard Navigation**: Full keyboard support