# Suggested Commands for FredonBytes Project

## Development
```bash
npm run dev                    # Start dev server (localhost:3000)
npm run build                  # Production build
npm run start                  # Start production server
npm run clean                  # Remove .next directory
```

## Code Quality
```bash
npm run lint                   # Run ESLint
npm run lint:fix              # Auto-fix ESLint issues
npm run type-check            # TypeScript type checking
npm run format                # Format with Prettier
npm run format:check          # Check formatting
```

## Translation Management
```bash
npm run translations:manage    # Sync translation keys
npm run translations:validate # Validate translations
npm run validate:locales      # Validate JSON syntax
```

## Pre-deployment
```bash
npm run pre-commit            # Lint + type-check + validate translations
npm run pre-deploy            # Full validation + build
npm run vercel-build          # Vercel build command
```

## Testing
```bash
npm run test                  # Run tests (currently placeholder)
npm run test:translations     # Validate translations
```

## Utilities
```bash
npm run build:analyze         # Analyze bundle size
npm run optimize              # Run optimization scripts
```

## System Commands (Linux)
```bash
ls -la                        # List files with details
rm -rf <dir>                  # Remove directory recursively
cp -r <src> <dest>           # Copy directory
mkdir -p <dir>               # Create directory with parents
cat <file>                   # View file content
grep -r "pattern" <path>     # Search in files
```

## When Task is Completed
1. Run `npm run lint:fix` to fix linting issues
2. Run `npm run type-check` to verify TypeScript
3. Run `npm run translations:validate` if translations were modified
4. Test the feature manually in browser
5. Commit changes with descriptive message
