# Suggested Commands

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run type-check
```

## Code Quality Commands
```bash
# Run linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code (via Biome)
biome format --write .

# Check code (via Biome)
biome check .
```

## System Commands (Linux)
```bash
# File operations
ls -la                    # List files with details
find . -name "*.tsx"      # Find TypeScript React files
grep -r "searchterm" .    # Search in files
cat filename.txt          # View file content

# Git operations
git status               # Check git status
git add .               # Stage all changes
git commit -m "message" # Commit changes
git push                # Push to remote

# Process management
ps aux                  # List running processes
kill -9 PID            # Force kill process
```

## Database Commands (Supabase)
```bash
# Local Supabase development
npx supabase start      # Start local Supabase
npx supabase stop       # Stop local Supabase
npx supabase status     # Check status
npx supabase db reset   # Reset database
```

## Deployment Commands
```bash
# Vercel deployment
vercel                  # Deploy to Vercel
vercel --prod          # Deploy to production
vercel env ls          # List environment variables
```

## Internationalization Commands
```bash
# Extract translation keys (if using extraction tools)
npm run translations:extract

# Validate translation files
npm run translations:validate
```

## Performance Analysis
```bash
# Bundle analysis
npm run analyze        # Analyze bundle size
lighthouse http://localhost:3000  # Performance audit
```