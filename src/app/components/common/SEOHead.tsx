'use client'

import Head from 'next/head'
import { useTranslations } from '../../hooks/useTranslations'
import { locales, type Locale } from '../../lib/i18n'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  noindex?: boolean
  useCustomStructuredData?: boolean
  customStructuredData?: object
}

export default function SEOHead({
  title,
  description,
  keywords,
  ogImage = '/FredonBytes_GraphicLogo.png',
  ogUrl,
  twitterCard = 'summary_large_image',
  canonical,
  noindex = false,
  useCustomStructuredData = false,
  customStructuredData
}: SEOHeadProps) {
  const { t, locale } = useTranslations()
  
  // Use provided values or fall back to translated defaults
  const seoTitle = title || t('seo.defaultTitle')
  const seoDescription = description || t('seo.defaultDescription')
  const seoKeywords = keywords || t('seo.keywords')
  const siteName = t('seo.siteName')
  const twitterHandle = t('seo.twitterHandle')
  const twitterCreator = t('seo.twitterCreator')
  
  // Build full title with site name if not already included
  const fullTitle = seoTitle.includes(siteName) ? seoTitle : `${seoTitle} | ${siteName}`
  
  // Get current URL
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '')
  
  // Convert locale to Open Graph format
  const ogLocale = locale === 'de' ? 'de_DE' : 'en_US'
  
  // Generate hrefLang alternates for each supported locale
  const generateAlternateLinks = () => {
    if (typeof window === 'undefined') return null
    
    const baseUrl = window.location.origin
    const pathname = window.location.pathname
    const searchParams = new URLSearchParams(window.location.search)
    
    return locales.map((loc: Locale) => {
      const url = new URL(pathname, baseUrl)
      searchParams.set('lang', loc)
      url.search = searchParams.toString()
      
      return (
        <link
          key={loc}
          rel="alternate"
          hrefLang={loc}
          href={url.toString()}
        />
      )
    })
  }
  
  // Generate organization structured data from translations
  const generateOrganizationStructuredData = () => {
    if (useCustomStructuredData && customStructuredData) {
      return customStructuredData
    }
    
    return {
      "@context": "https://schema.org",
      "@type": t('jsonLd.organizationType'),
      "name": t('jsonLd.organizationName'),
      "description": t('jsonLd.organizationDescription'),
      "url": typeof window !== 'undefined' ? window.location.origin : '',
      "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}${ogImage}`,
      "foundingDate": t('jsonLd.foundingDate'),
      "founder": {
        "@type": "Person",
        "name": t('jsonLd.founder')
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": t('jsonLd.address.streetAddress'),
        "addressLocality": t('jsonLd.address.addressLocality'),
        "addressRegion": t('jsonLd.address.addressRegion'),
        "postalCode": t('jsonLd.address.postalCode'),
        "addressCountry": t('jsonLd.address.addressCountry')
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": t('jsonLd.contactPoint.telephone'),
        "contactType": t('jsonLd.contactPoint.contactType'),
        "email": t('jsonLd.contactPoint.email')
      },
      "sameAs": [
        "https://github.com/FredonBytes",
        "https://github.com/patrikfredon",
        "https://linkedin.com/company/fredonbytes",
        "https://twitter.com/fredonbytes"
      ],
      "knowsAbout": t('jsonLd.services'),
      "areaServed": {
        "@type": "Country",
        "name": "Czech Republic"
      }
    }
  }

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      
      {/* SEO Meta Tags */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Language Alternates */}
      {generateAlternateLinks()}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={ogLocale} />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content={twitterHandle} />
      <meta property="twitter:creator" content={twitterCreator} />
      
      {/* Additional Meta Tags */}
      <meta name="author" content={siteName} />
      <meta name="company" content={siteName} />
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      
      {/* Localized Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateOrganizationStructuredData())
        }}
      />
    </Head>
  )
}