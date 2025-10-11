# Third-Party Script Loading Guidelines

## Current Status

✅ **No external third-party scripts currently loaded**

The application uses only:
- Next.js built-in optimizations
- Google Fonts (Inter) via Next.js font optimization (automatically async)
- Self-hosted assets and components

## Best Practices for Adding Third-Party Scripts

If you need to add external scripts in the future, follow these guidelines:

### 1. Use Next.js Script Component

Always use the `next/script` component instead of raw `<script>` tags:

```tsx
import Script from 'next/script';

export default function MyComponent() {
  return (
    <>
      {/* Analytics example */}
      <Script
        src="https://example.com/analytics.js"
        strategy="afterInteractive" // or "lazyOnload" for non-critical
        onLoad={() => console.log('Script loaded')}
      />
    </>
  );
}
```

### 2. Loading Strategies

Choose the appropriate strategy based on script priority:

#### `beforeInteractive` (Highest Priority)
- For critical scripts that must load before page becomes interactive
- Loaded in document `<head>`
- Use sparingly - blocks page rendering
- Example: Polyfills, critical feature detection

```tsx
<Script
  src="https://example.com/critical.js"
  strategy="beforeInteractive"
/>
```

#### `afterInteractive` (Default)
- For important but not critical scripts
- Loaded after page becomes interactive
- Good for: Analytics, tag managers, chat widgets
- Does not block page rendering

```tsx
<Script
  src="https://example.com/analytics.js"
  strategy="afterInteractive"
/>
```

#### `lazyOnload` (Lowest Priority)
- For non-essential scripts
- Loaded during browser idle time
- Good for: Social media widgets, ads, non-critical tracking
- Best for performance

```tsx
<Script
  src="https://example.com/social-widget.js"
  strategy="lazyOnload"
/>
```

#### `worker` (Experimental)
- Loads script in a web worker
- For scripts that don't need DOM access
- Best performance but limited browser support

### 3. Inline Scripts

For small inline scripts, use the Script component with strategy:

```tsx
<Script id="inline-script" strategy="afterInteractive">
  {`
    console.log('Inline script');
  `}
</Script>
```

### 4. Minimize External Requests

Before adding a third-party script, consider:

1. **Do you really need it?** - Can you implement the functionality yourself?
2. **Can you self-host it?** - Download and serve from your own domain
3. **Can you lazy load it?** - Only load when needed (e.g., on user interaction)
4. **Is there a lighter alternative?** - Look for smaller libraries

### 5. Performance Checklist

When adding any third-party script:

- [ ] Use `next/script` component
- [ ] Choose appropriate loading strategy
- [ ] Add `onLoad` handler for tracking
- [ ] Test impact on Lighthouse score (should stay ≥95)
- [ ] Verify Core Web Vitals are not negatively impacted
- [ ] Check bundle size with `npm run build:analyze`
- [ ] Test on slow 3G network
- [ ] Ensure script has proper error handling

### 6. Common Third-Party Scripts

#### Analytics (Google Analytics, Plausible, etc.)

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        {process.env.NODE_ENV === 'production' && (
          <Script
            src="https://analytics.example.com/script.js"
            strategy="afterInteractive"
            data-domain="fredonbytes.cloud"
          />
        )}
      </body>
    </html>
  );
}
```

#### Chat Widgets

```tsx
// Load only when user scrolls or after delay
'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function ChatWidget() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Load after 5 seconds or on scroll
    const timer = setTimeout(() => setShouldLoad(true), 5000);
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShouldLoad(true);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!shouldLoad) return null;

  return (
    <Script
      src="https://chat.example.com/widget.js"
      strategy="lazyOnload"
    />
  );
}
```

#### Social Media Embeds

```tsx
// Load on user interaction
'use client';

import Script from 'next/script';
import { useState } from 'react';

export function SocialEmbed() {
  const [loaded, setLoaded] = useState(false);

  return (
    <div>
      {!loaded ? (
        <button onClick={() => setLoaded(true)}>
          Load Social Media Content
        </button>
      ) : (
        <>
          <Script
            src="https://platform.twitter.com/widgets.js"
            strategy="lazyOnload"
          />
          {/* Social media content */}
        </>
      )}
    </div>
  );
}
```

### 7. Testing Third-Party Scripts

After adding any script:

```bash
# 1. Build and analyze bundle
npm run build:analyze

# 2. Run Lighthouse audit
npm run lighthouse

# 3. Test compression
npm run test:compression

# 4. Check Web Vitals in production
# Monitor /api/analytics endpoint
```

### 8. Security Considerations

- Always use HTTPS for external scripts
- Implement Content Security Policy (CSP) headers
- Use Subresource Integrity (SRI) when possible:

```tsx
<Script
  src="https://cdn.example.com/library.js"
  integrity="sha384-..."
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### 9. Current Configuration

The application already has optimized headers in `next.config.ts`:

- DNS prefetch enabled
- Proper CSP headers
- CORS configuration for API routes
- Long-term caching for static assets

## Resources

- [Next.js Script Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)
- [Web.dev: Efficiently load third-party JavaScript](https://web.dev/efficiently-load-third-party-javascript/)
- [Core Web Vitals](https://web.dev/vitals/)

## Monitoring

Use the Web Vitals component (`src/app/components/WebVitals.tsx`) to monitor impact:

```bash
# View Web Vitals in development
npm run dev
# Check browser console for metrics

# View Web Vitals in production
# Check /api/analytics endpoint logs
```
