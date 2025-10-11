# Code Style and Conventions

## TypeScript
- **Strict mode enabled** - all type checking rules enforced
- Always provide explicit types for function parameters and return values
- Use interfaces for object shapes, types for unions/intersections
- Prefer `const` over `let`, avoid `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)

## React Patterns
- **Server Components First**: Default to Server Components, use `'use client'` only when needed
- Client Components required for: hooks, event handlers, browser APIs, state management
- Use async/await in Server Components for data fetching
- Prefer composition over prop drilling
- Use TypeScript interfaces for component props

## Naming Conventions
- **Components**: PascalCase (e.g., `HeroSection.tsx`)
- **Files**: PascalCase for components, kebab-case for utilities
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Interfaces**: PascalCase with descriptive names (e.g., `FormClientProps`)
- **Types**: PascalCase (e.g., `AnswerValue`)

## File Organization
- One component per file
- Co-locate related components in subdirectories
- Keep utilities in `lib/` directory
- API routes in `api/` directory
- Group by feature when appropriate

## Styling
- Use Tailwind CSS utility classes
- Follow mobile-first approach (default styles for mobile, then `sm:`, `md:`, `lg:`)
- Use CSS custom properties from `globals.css` for design tokens
- Dark mode: use `dark:` prefix for dark mode variants
- Consistent spacing with Tailwind scale

## Imports
- Group imports: React, Next.js, third-party, local
- Use absolute imports from `@/` when configured
- Optimize package imports (e.g., `lucide-react/icons/IconName`)

## Comments
- Use JSDoc for public functions and complex logic
- Inline comments for non-obvious code
- Avoid obvious comments
- Document "why" not "what"

## Error Handling
- Always handle errors gracefully
- Provide user-friendly error messages
- Log errors for debugging
- Use try-catch for async operations
- Validate user input with Zod schemas

## Accessibility
- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast (WCAG AA)
- Test with screen readers
