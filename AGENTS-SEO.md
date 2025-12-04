---
applyTo: "**"
---

# SEO Optimization Instructions for AI Agents

## 🎯 Core Mission: Google Page 1 Ranking via Robots-First Optimization

This document provides AI agents with actionable SEO implementation patterns for Next.js 15+ applications targeting Czech market (primary) + English (secondary). All instructions prioritize search engine crawlers over visual design.

---

## 📋 Agent Workflow: 8-Phase Implementation

### Phase 1: Foundation Configuration (Priority: CRITICAL)

**Implementation Checklist:**

1. **Create Configuration Files**

   ```typescript
   // src/lib/config/seo.config.ts
   export const seoConfig = {
     baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
     defaultLocale: 'cs',
     locales: ['cs', 'en'],
     brandName: 'YourBrand',
     trailingSlash: false, // Choose ONE and enforce
     siteName: {
       cs: 'YourBrand - Popis',
       en: 'YourBrand - Description'
     }
   }


   // src/lib/config/business.config.ts
   export const businessConfig = {
     legalName: 'YourBrand s.r.o.',
     address: {
       street: 'Exact Street 123',
       city: 'Praha',
       postalCode: '110 00',
       country: 'CZ'
     },
     phone: '+420 777 888 555', // EXACT format everywhere
     email: 'info@example.com',
     geo: {
       latitude: 50.0755,
       longitude: 14.4378
     }
   }
   ```

2. **Configure next-intl**

   ```typescript
   // src/i18n.ts
   import {getRequestConfig} from 'next-intl/server';


   export default getRequestConfig(async ({locale}) => ({
     messages: (await import(`../messages/${locale}.json`)).default
   }));


   // middleware.ts
   import createMiddleware from 'next-intl/middleware';


   export default createMiddleware({
     locales: ['cs', 'en'],
     defaultLocale: 'cs',
     localePrefix: 'always' // CRITICAL: Never use 'as-needed'
   });
   ```

3. **Create robots.txt**

   ```typescript
   // app/robots.ts
   import { MetadataRoute } from 'next'
   import { seoConfig } from '@/lib/config/seo.config'


   export default function robots(): MetadataRoute.Robots {
     return {
       rules: {
         userAgent: '*',
         allow: '/',
         disallow: ['/api/', '/admin/', '/_next/']
       },
       sitemap: `${seoConfig.baseUrl}/sitemap.xml`
     }
   }
   ```

**Validation Steps:**

- [ ] `seoConfig` imported successfully in all metadata functions
- [ ] `businessConfig` NAP data matches exactly across all files
- [ ] Middleware redirects `/` to `/cs/`
- [ ] robots.txt accessible at `/robots.txt`

---

### Phase 2: Localization Setup (Priority: CRITICAL)

**Implementation Pattern:**

1. **Root Layout Structure**

   ```typescript
   // app/[locale]/layout.tsx
   import {NextIntlClientProvider} from 'next-intl';
   import {notFound} from 'next/navigation';


   export function generateStaticParams() {
     return [{locale: 'cs'}, {locale: 'en'}];
   }


   export default async function LocaleLayout({
     children,
     params: {locale}
   }: {
     children: React.ReactNode;
     params: {locale: string};
   }) {
     let messages;
     try {
       messages = (await import(`@/messages/${locale}.json`)).default;
     } catch (error) {
       notFound();
     }


     return (
       <html lang={locale}>
         <body>
           <NextIntlClientProvider locale={locale} messages={messages}>
             {children}
           </NextIntlClientProvider>
         </body>
       </html>
     );
   }
   ```

2. **Hreflang Implementation Helper**

   ```typescript
   // src/lib/seo/hreflang.ts
   import { seoConfig } from '@/lib/config/seo.config'


   export function generateHreflangLinks(pathname: string) {
     return seoConfig.locales.map(locale => ({
       rel: 'alternate',
       hrefLang: locale,
       href: `${seoConfig.baseUrl}/${locale}${pathname}`
     })).concat({
       rel: 'alternate',
       hrefLang: 'x-default',
       href: `${seoConfig.baseUrl}/${seoConfig.defaultLocale}${pathname}`
     })
   }
   ```

**Validation Steps:**

- [ ] All URLs include locale prefix: `/cs/page` or `/en/page`
- [ ] Hreflang tags are bidirectional (if A links to B, B links to A)
- [ ] x-default points to default locale
- [ ] HTML `lang` attribute matches locale

---

### Phase 3: Metadata Generation System (Priority: CRITICAL)

**Implementation Pattern:**

1. **Create Metadata Helper**

   ```typescript
   // src/lib/seo/metadata.ts
   import { Metadata } from 'next'
   import { seoConfig } from '@/lib/config/seo.config'
   import { generateHreflangLinks } from './hreflang'


   export interface PageMetadataProps {
     locale: string
     title: string
     description: string
     keywords?: string
     pathname: string
     ogImage?: string
     noindex?: boolean
   }


   export function generatePageMetadata({
     locale,
     title,
     description,
     keywords,
     pathname,
     ogImage = '/og-default.jpg',
     noindex = false
   }: PageMetadataProps): Metadata {
     const canonicalUrl = `${seoConfig.baseUrl}/${locale}${pathname}`
     const fullTitle = `${title} | ${seoConfig.brandName}`


     return {
       title: fullTitle,
       description,
       keywords,
       ...(noindex && { robots: 'noindex,nofollow' }),
       alternates: {
         canonical: canonicalUrl,
         languages: Object.fromEntries(
           seoConfig.locales.map(loc => [
             loc,
             `${seoConfig.baseUrl}/${loc}${pathname}`
           ])
         )
       },
       openGraph: {
         title: fullTitle,
         description,
         url: canonicalUrl,
         siteName: seoConfig.siteName[locale as keyof typeof seoConfig.siteName],
         locale: locale === 'cs' ? 'cs_CZ' : 'en_US',
         type: 'website',
         images: [{
           url: `${seoConfig.baseUrl}${ogImage}`,
           width: 1200,
           height: 630,
           alt: title
         }]
       },
       twitter: {
         card: 'summary_large_image',
         title: fullTitle,
         description,
         images: [`${seoConfig.baseUrl}${ogImage}`]
       }
     }
   }
   ```

2. **Usage in Pages**

   ```typescript
   // app/[locale]/products/page.tsx
   import { generatePageMetadata } from '@/lib/seo/metadata'
   import { useTranslations } from 'next-intl'


   export async function generateMetadata({
     params: { locale }
   }: {
     params: { locale: string }
   }) {
     // Load translations server-side
     const t = await getTranslations({locale, namespace: 'products'})


     return generatePageMetadata({
       locale,
       title: t('meta.title'),
       description: t('meta.description'),
       keywords: t('meta.keywords'),
       pathname: '/products',
       ogImage: '/og-products.jpg'
     })
   }
   ```

**Validation Steps:**

- [ ] Every page has unique title (50-60 chars)
- [ ] Every page has unique description (150-160 chars)
- [ ] Canonical URLs are self-referencing
- [ ] OG images are 1200x630px
- [ ] Twitter cards display correctly

---

### Phase 4: JSON-LD Schema Implementation (Priority: CRITICAL)

**Implementation Pattern:**

1. **Create Schema Generators**

   ```typescript
   // src/lib/seo/jsonld.ts
   import { businessConfig } from '@/lib/config/business.config'
   import { seoConfig } from '@/lib/config/seo.config'


   // Organization Schema (EVERY page)
   export function generateOrganizationSchema() {
     return {
       '@context': 'https://schema.org',
       '@type': 'Organization',
       '@id': `${seoConfig.baseUrl}/#organization`,
       name: businessConfig.legalName,
       url: seoConfig.baseUrl,
       logo: `${seoConfig.baseUrl}/logo.png`,
       contactPoint: {
         '@type': 'ContactPoint',
         telephone: businessConfig.phone,
         contactType: 'customer service',
         areaServed: 'CZ',
         availableLanguage: ['Czech', 'English']
       },
       sameAs: [
         'https://www.facebook.com/yourpage',
         'https://www.instagram.com/youraccount'
       ]
     }
   }


   // LocalBusiness Schema (EVERY page for trust)
   export function generateLocalBusinessSchema() {
     return {
       '@context': 'https://schema.org',
       '@type': 'LocalBusiness',
       '@id': `${seoConfig.baseUrl}/#localbusiness`,
       name: businessConfig.legalName,
       image: `${seoConfig.baseUrl}/storefront.jpg`,
       address: {
         '@type': 'PostalAddress',
         streetAddress: businessConfig.address.street,
         addressLocality: businessConfig.address.city,
         postalCode: businessConfig.address.postalCode,
         addressCountry: businessConfig.address.country
       },
       geo: {
         '@type': 'GeoCoordinates',
         latitude: businessConfig.geo.latitude,
         longitude: businessConfig.geo.longitude
       },
       telephone: businessConfig.phone,
       priceRange: '$$'
     }
   }


   // WebPage Schema (EVERY page)
   export function generateWebPageSchema(locale: string, pathname: string) {
     return {
       '@context': 'https://schema.org',
       '@type': 'WebPage',
       '@id': `${seoConfig.baseUrl}/${locale}${pathname}#webpage`,
       url: `${seoConfig.baseUrl}/${locale}${pathname}`,
       inLanguage: locale,
       isPartOf: {
         '@id': `${seoConfig.baseUrl}/#website`
       }
     }
   }


   // BreadcrumbList Schema
   export function generateBreadcrumbSchema(
     items: Array<{ name: string; url: string }>
   ) {
     return {
       '@context': 'https://schema.org',
       '@type': 'BreadcrumbList',
       itemListElement: items.map((item, index) => ({
         '@type': 'ListItem',
         position: index + 1,
         name: item.name,
         item: item.url
       }))
     }
   }


   // Product Schema
   export function generateProductSchema({
     name,
     description,
     image,
     price,
     currency = 'CZK',
     availability = 'InStock',
     sku,
     brand = businessConfig.legalName
   }: {
     name: string
     description: string
     image: string
     price: number
     currency?: string
     availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
     sku: string
     brand?: string
   }) {
     return {
       '@context': 'https://schema.org',
       '@type': 'Product',
       name,
       description,
       image,
       sku,
       brand: {
         '@type': 'Brand',
         name: brand
       },
       offers: {
         '@type': 'Offer',
         price,
         priceCurrency: currency,
         availability: `https://schema.org/${availability}`,
         url: seoConfig.baseUrl
       }
     }
   }


   // FAQPage Schema
   export function generateFAQSchema(
     faqs: Array<{ question: string; answer: string }>
   ) {
     return {
       '@context': 'https://schema.org',
       '@type': 'FAQPage',
       mainEntity: faqs.map(faq => ({
         '@type': 'Question',
         name: faq.question,
         acceptedAnswer: {
           '@type': 'Answer',
           text: faq.answer
         }
       }))
     }
   }
   ```

2. **Schema Component**

   ```typescript
   // src/components/seo/JsonLd.tsx
   export function JsonLd({ data }: { data: object }) {
     return (
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
       />
     )
   }
   ```

3. **Usage in Layout/Pages**

   ```typescript
   // app/[locale]/layout.tsx
   import { JsonLd } from '@/components/seo/JsonLd'
   import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo/jsonld'


   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html>
         <head>
           <JsonLd data={generateOrganizationSchema()} />
           <JsonLd data={generateLocalBusinessSchema()} />
         </head>
         <body>{children}</body>
       </html>
     )
   }


   // app/[locale]/products/[slug]/page.tsx
   import { JsonLd } from '@/components/seo/JsonLd'
   import { generateProductSchema, generateBreadcrumbSchema } from '@/lib/seo/jsonld'


   export default function ProductPage({ product }: { product: Product }) {
     const breadcrumbs = [
       { name: 'Home', url: `${seoConfig.baseUrl}/cs/` },
       { name: 'Products', url: `${seoConfig.baseUrl}/cs/products` },
       { name: product.name, url: `${seoConfig.baseUrl}/cs/products/${product.slug}` }
     ]


     return (
       <>
         <JsonLd data={generateProductSchema({
           name: product.name,
           description: product.description,
           image: product.image,
           price: product.price,
           sku: product.sku
         })} />
         <JsonLd data={generateBreadcrumbSchema(breadcrumbs)} />
         {/* Page content */}
       </>
     )
   }
   ```

**Validation Steps:**

- [ ] Test all schemas with Google Rich Results Test
- [ ] Organization schema on every page
- [ ] LocalBusiness schema on every page
- [ ] Product schema validates with price + availability
- [ ] BreadcrumbList matches visual breadcrumbs exactly
- [ ] FAQPage has minimum 5 Q&A pairs

---

### Phase 5: Dynamic Sitemap Generation (Priority: HIGH)

**Implementation Pattern:**

```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { seoConfig } from '@/lib/config/seo.config'


export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${seoConfig.baseUrl}/sitemap-cs-pages.xml`,
      lastModified: new Date()
    },
    {
      url: `${seoConfig.baseUrl}/sitemap-en-pages.xml`,
      lastModified: new Date()
    },
    {
      url: `${seoConfig.baseUrl}/sitemap-cs-products.xml`,
      lastModified: new Date()
    },
    {
      url: `${seoConfig.baseUrl}/sitemap-en-products.xml`,
      lastModified: new Date()
    }
  ]
}


// app/sitemap-cs-pages.xml/route.ts
export async function GET() {
  const baseUrl = seoConfig.baseUrl
  const locale = 'cs'


  const staticPages = [
    { url: '/', priority: 1.0, changeFreq: 'daily' },
    { url: '/products', priority: 0.9, changeFreq: 'daily' },
    { url: '/about', priority: 0.7, changeFreq: 'monthly' },
    { url: '/contact', priority: 0.8, changeFreq: 'monthly' }
  ]


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}/${locale}${page.url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.changeFreq}</changefreq>
    <priority>${page.priority}</priority>
    <xhtml:link rel="alternate" hreflang="cs" href="${baseUrl}/cs${page.url}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en${page.url}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/cs${page.url}"/>
  </url>`).join('\n')}
</urlset>`


  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}


// app/sitemap-cs-products.xml/route.ts
export async function GET() {
  const baseUrl = seoConfig.baseUrl
  const locale = 'cs'


  // Fetch products from database
  const products = await fetchProducts(locale)


  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${products.map(product => `  <url>
    <loc>${baseUrl}/${locale}/products/${product.slug}</loc>
    <lastmod>${product.updatedAt}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="cs" href="${baseUrl}/cs/products/${product.slug}"/>
    <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/products/${product.slug}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/cs/products/${product.slug}"/>
    <image:image>
      <image:loc>${baseUrl}${product.image}</image:loc>
      <image:caption>${product.name}</image:caption>
    </image:image>
  </url>`).join('\n')}
</urlset>`


  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml'
    }
  })
}
```

**Validation Steps:**

- [ ] `/sitemap.xml` returns index of all sitemaps
- [ ] Each locale has separate sitemap files
- [ ] All public pages included (max 50,000 per sitemap)
- [ ] Hreflang included in every URL entry
- [ ] Images included for product sitemaps
- [ ] Submit to Google Search Console

---

### Phase 6: Image Optimization System (Priority: HIGH)

**Implementation Pattern:**

1. **Image Component Wrapper**

   ```typescript
   // src/components/ui/OptimizedImage.tsx
   import Image, { ImageProps } from 'next/image'


   interface OptimizedImageProps extends Omit<ImageProps, 'alt'> {
     alt: string  // Make alt required
     priority?: boolean
   }


   export function OptimizedImage({
     alt,
     priority = false,
     loading,
     quality = 85,
     ...props
   }: OptimizedImageProps) {
     return (
       <Image
         {...props}
         alt={alt}
         priority={priority}
         loading={priority ? 'eager' : 'lazy'}
         quality={quality}
         sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
       />
     )
   }
   ```

2. **Image Alt Text Generator**

   ```typescript
   // src/lib/seo/image-alt.ts
   import { seoConfig } from '@/lib/config/seo.config'


   export function generateImageAlt({
     productName,
     feature,
     variant
   }: {
     productName: string
     feature?: string
     variant?: string
   }): string {
     const parts = [productName]
     if (feature) parts.push(feature)
     if (variant) parts.push(variant)
     parts.push(seoConfig.brandName)


     return parts.join(' - ')
   }


   // Usage:
   // generateImageAlt({
   //   productName: 'Spalovač tuků pro ženy',
   //   feature: 'Kapsle s L-karnitinem'
   // })
   // Returns: "Spalovač tuků pro ženy - Kapsle s L-karnitinem - YourBrand"
   ```

3. **next.config.js Image Configuration**

   ```javascript
   // next.config.js
   module.exports = {
     images: {
       formats: ['image/avif', 'image/webp'],
       deviceSizes: [640, 750, 828, 1080, 1200, 1920],
       imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
       minimumCacheTTL: 60,
       remotePatterns: [
         {
           protocol: 'https',
           hostname: 'your-cdn.com'
         }
       ]
     }
   }
   ```

**File Naming Convention:**

- Pattern: `{keyword}-{product}-{variant}.{ext}`
- Example: `spalovac-tuku-zeny-capsules.jpg`
- NEVER: `IMG_1234.jpg`, `image1.jpg`

**Validation Steps:**

- [ ] All images use `next/image` component
- [ ] All images have descriptive alt text
- [ ] Above-fold images have `priority={true}`
- [ ] Below-fold images have `loading="lazy"`
- [ ] Images served in WebP/AVIF format
- [ ] File names include keywords

---

### Phase 7: Performance Optimization (Priority: HIGH)

**Implementation Checklist:**

1. **Configure Rendering Strategy**

   ```typescript
   // Static pages (SSG)
   // app/[locale]/about/page.tsx
   export default function AboutPage() {
     // No data fetching = pure SSG
     return <div>Static content</div>
   }


   // Dynamic pages with ISR
   // app/[locale]/products/page.tsx
   export const revalidate = 3600 // 1 hour


   export default async function ProductsPage() {
     const products = await fetchProducts()
     return <ProductGrid products={products} />
   }


   // User-specific pages (SSR)
   // app/[locale]/dashboard/page.tsx
   export const dynamic = 'force-dynamic'


   export default async function DashboardPage() {
     const user = await getCurrentUser()
     return <Dashboard user={user} />
   }
   ```

2. **Font Optimization**

   ```typescript
   // app/[locale]/layout.tsx
   import { Inter } from 'next/font/google'


   const inter = Inter({
     subsets: ['latin', 'latin-ext'], // Czech characters
     display: 'swap',
     preload: true,
     variable: '--font-inter'
   })


   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html className={inter.variable}>
         <body>{children}</body>
       </html>
     )
   }
   ```

3. **Bundle Optimization**

   ```typescript
   // Dynamic imports for heavy components
   import dynamic from 'next/dynamic'


   const HeavyComponent = dynamic(() => import('@/components/HeavyComponent'), {
     loading: () => <div>Loading...</div>,
     ssr: false // If component doesn't need SSR
   })
   ```

4. **Core Web Vitals Monitoring**

   ```typescript
   // app/[locale]/layout.tsx
   import { SpeedInsights } from '@vercel/speed-insights/next'
   import { Analytics } from '@vercel/analytics/react'


   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html>
         <body>
           {children}
           <SpeedInsights />
           <Analytics />
         </body>
       </html>
     )
   }
   ```

**Validation Steps:**

- [ ] LCP < 2.5s (PageSpeed Insights)
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Total JS < 200KB (gzipped)
- [ ] Fonts use `display: swap`
- [ ] Heavy components use dynamic imports

---

### Phase 8: Content & On-Page SEO (Priority: MEDIUM)

**Implementation Pattern:**

1. **Semantic HTML Structure**

   ```typescript
   // app/[locale]/products/page.tsx
   export default function ProductsPage() {
     return (
       <main>
         <header>
           <h1>Spalovače Tuků Pro Ženy - Kompletní Průvodce 2025</h1>
         </header>


         <nav aria-label="Breadcrumb">
           <ol>
             <li><a href="/cs/">Domů</a></li>
             <li aria-current="page">Produkty</li>
           </ol>
         </nav>


         <article>
           <section>
             <h2>Jak Fungují Spalovače Tuků?</h2>
             <p>Content with primary keyword in first 100 words...</p>
           </section>


           <section>
             <h2>Top 10 Spalovačů Tuků Pro Ženy</h2>
             <div>Product grid...</div>
           </section>
         </article>


         <aside>
           <h2>Související Produkty</h2>
         </aside>
       </main>
     )
   }
   ```

2. **FAQ Component with Schema**

   ```typescript
   // src/components/features/FAQ.tsx
   import { JsonLd } from '@/components/seo/JsonLd'
   import { generateFAQSchema } from '@/lib/seo/jsonld'


   interface FAQItem {
     question: string
     answer: string
   }


   export function FAQ({ items }: { items: FAQItem[] }) {
     return (
       <>
         <JsonLd data={generateFAQSchema(items)} />
         <section className="faq">
           <h2>Často Kladené Otázky</h2>
           {items.map((item, index) => (
             <div key={index} className="faq-item">
               <h3 className="faq-question">{item.question}</h3>
               <div className="faq-answer">
                 <p>{item.answer}</p>
               </div>
             </div>
           ))}
         </section>
       </>
     )
   }
   ```

3. **Internal Linking Component**

   ```typescript
   // src/components/seo/InternalLink.tsx
   import Link from 'next/link'


   interface InternalLinkProps {
     href: string
     children: React.ReactNode
     locale: string
   }


   export function InternalLink({ href, children, locale }: InternalLinkProps) {
     // Ensure locale prefix
     const localizedHref = href.startsWith('/') ? `/${locale}${href}` : href


     return (
       <Link href={localizedHref}>
         {children}
       </Link>
     )
   }


   // Usage with keyword-rich anchor text
   <InternalLink href="/products/fat-burners" locale="cs">
     nejlepší spalovače tuků pro ženy
   </InternalLink>
   ```

**Content Requirements Checklist:**

- [ ] Homepage: 800-1000 words
- [ ] Category pages: 1000-1500 words
- [ ] Product pages: 800-1200 words
- [ ] Primary keyword in H1
- [ ] Primary keyword in first 100 words
- [ ] Primary keyword in at least one H2
- [ ] Keyword density: 1-2%
- [ ] 3-5 internal links per 1000 words
- [ ] Minimum 5 FAQ items per page with FAQ

**Validation Steps:**

- [ ] Single H1 per page
- [ ] Heading hierarchy correct (no skipped levels)
- [ ] Breadcrumbs match schema exactly
- [ ] Internal links use keyword anchor text
- [ ] FAQ schema validates in Rich Results Test

---

## 🔍 Agent Decision Trees

### Decision: When to Use SSG vs ISR vs SSR?

```
Is content user-specific?
├─ YES → Use SSR (force-dynamic)
└─ NO → Does content change?
    ├─ NEVER → Use SSG (default)
    └─ SOMETIMES → Use ISR (revalidate: X)
        ├─ Products → revalidate: 3600
        ├─ Blog → revalidate: 86400
        └─ Homepage → revalidate: 1800
```

### Decision: Which Schemas to Include?

```
Page Type:
├─ ALL PAGES
│   ├─ Organization (in root layout)
│   ├─ LocalBusiness (in root layout)
│   └─ WebPage (in page component)
├─ Homepage ONLY
│   └─ WebSite (with SearchAction)
├─ Product Page
│   ├─ Product
│   └─ BreadcrumbList
├─ Category Page
│   └─ BreadcrumbList
└─ FAQ Page (if 5+ Q&A)
    └─ FAQPage
```

### Decision: Image Loading Strategy?

```
Image Position:
├─ Above fold (visible on load)
│   ├─ priority={true}
│   └─ loading="eager"
└─ Below fold
    ├─ priority={false}
    └─ loading="lazy"
```

---

## 🛠️ Agent Tool Integration

### Using TodoWrite for SEO Tasks

```typescript
// Example todo structure for Phase 1
{
  todos: [
    {
      content: "Create seo.config.ts with base URL, locales, brand name",
      status: "in_progress",
      activeForm: "Creating SEO configuration"
    },
    {
      content: "Create business.config.ts with exact NAP data",
      status: "pending",
      activeForm: "Creating business configuration"
    },
    {
      content: "Verify NAP consistency across footer, contact, schema",
      status: "pending",
      activeForm: "Verifying NAP consistency"
    }
  ]
}
```

### Using Task Tool for Validation

```typescript
// Launch validation agent after implementation
Task({
  subagent_type: "Explore",
  prompt: "Verify all pages have unique metadata, canonical URLs, and appropriate JSON-LD schemas. Check for: 1) Title tag uniqueness 2) Meta description presence 3) Canonical URL correctness 4) Schema validation 5) Hreflang bidirectionality",
  description: "Validate SEO implementation"
})
```

### Using WebSearch for Current Best Practices

```typescript
// Research current schema.org requirements
WebSearch({
  query: "schema.org Product schema requirements 2025 Google rich results"
})
```

---

## ⚠️ Common Agent Mistakes to Avoid

### ❌ NEVER Do

1. Create multiple H1 tags per page
2. Skip canonical URLs
3. Use relative URLs in schemas
4. Hardcode locale in URLs (`/cs/products` hardcoded = BAD)
5. Create inconsistent NAP data across files
6. Use generic image alt text ("image", "photo")
7. Skip hreflang x-default tag
8. Use client-side rendering for SEO-critical pages
9. Create shallow content (<500 words on important pages)
10. Use query parameters for navigation URLs

### ✅ ALWAYS Do

1. Verify schemas with Google Rich Results Test
2. Use absolute URLs in all schemas
3. Include locale dynamically from params
4. Maintain NAP consistency via shared config
5. Generate descriptive image alt text with keywords
6. Include bidirectional hreflang links
7. Default to SSG/ISR for SEO pages
8. Meet minimum content length requirements
9. Use semantic HTML hierarchy
10. Test Core Web Vitals before claiming completion

---

## 📊 Validation Checklist: Before Marking Complete

**Technical Foundation:**

- [ ] `seoConfig` and `businessConfig` created and imported
- [ ] `next-intl` configured with `localePrefix: "always"`
- [ ] robots.txt allows public pages, blocks admin/api
- [ ] Sitemaps generate correctly (test in browser)

**Metadata:**

- [ ] Every page has unique title + description
- [ ] All canonical URLs are absolute and self-referencing
- [ ] Hreflang tags bidirectional with x-default
- [ ] OG images 1200x630px, under 1MB

**Structured Data:**

- [ ] Organization schema on every page
- [ ] LocalBusiness schema on every page
- [ ] Product schema on product pages (validated)
- [ ] BreadcrumbList on all non-homepage pages
- [ ] FAQPage on pages with 5+ Q&A pairs
- [ ] All schemas pass Google Rich Results Test

**Images:**

- [ ] All images use `next/image` component
- [ ] All images have keyword-rich alt text
- [ ] Above-fold images: `priority={true}`
- [ ] File names follow `keyword-product-variant.ext` pattern
- [ ] Images served in WebP/AVIF format

**Performance:**

- [ ] LCP < 2.5s (PageSpeed Insights)
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] JavaScript bundle < 200KB gzipped
- [ ] Fonts use `display: swap`

**Content:**

- [ ] Primary keyword in H1, first 100 words, one H2
- [ ] Content meets minimum word counts
- [ ] Heading hierarchy correct (single H1, no skipped levels)
- [ ] 3-5 internal links per 1000 words
- [ ] Internal links use keyword anchor text

**Localization:**

- [ ] All URLs include locale prefix
- [ ] Translations complete in `messages/{locale}.json`
- [ ] HTML `lang` attribute matches locale
- [ ] Date/currency formats localized

**Final Validation:**

- [ ] Run `npm run build` successfully
- [ ] Test all pages in browser
- [ ] Submit sitemap to Google Search Console
- [ ] Monitor Search Console for errors

---

## 🎯 Success Metrics (Post-Deployment)

**Week 1-2:**

- Pages indexed in Google (check Search Console)
- No critical errors in Search Console
- Core Web Vitals in "Good" range

**Week 3-4:**

- Rich results appear in search (test with site:example.com)
- Target keywords enter top 100

**Month 2-3:**

- Organic traffic increases 20%+
- Target keywords enter top 10
- CTR from search improves

---

## 📚 Reference Tools for Agents

**Validation:**

- Google Rich Results Test: <https://search.google.com/test/rich-results>
- PageSpeed Insights: <https://pagespeed.web.dev/>
- Schema Validator: <https://validator.schema.org/>

**Documentation:**

- Next.js Metadata: <https://nextjs.org/docs/app/building-your-application/optimizing/metadata>
- next-intl: <https://next-intl-docs.vercel.app/>
- Schema.org: <https://schema.org/>

**Monitoring:**

- Google Search Console: <https://search.google.com/search-console>
- Google Analytics 4: <https://analytics.google.com/>

---

*Agent Instructions Version: 1.0*
*Framework: Next.js 15+ SEO Implementation*
*Target: Google Page 1 Rankings*
*Market: Czech (cs) + English (en)*

---

## 🤖 FredonBytes AI Implementation Signature

*Crafted by FredonBytes AI Development*
*Following Direct Implementation Doctrine*
