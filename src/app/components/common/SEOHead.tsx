'use client'

import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  ogImage?: string
  ogUrl?: string
  twitterCard?: 'summary' | 'summary_large_image'
  canonical?: string
  noindex?: boolean
  structuredData?: object
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
  structuredData
}: SEOHeadProps) {
  const fullTitle = title.includes('Fredonbytes') ? title : `${title} | Fredonbytes`
  const currentUrl = ogUrl || (typeof window !== 'undefined' ? window.location.href : '')

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* SEO Meta Tags */}
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {!noindex && <meta name="robots" content="index,follow" />}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Fredonbytes" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@Fredonbytes" />
      <meta property="twitter:creator" content="@FredonBytes" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="Fredonbytes" />
      <meta name="company" content="Fredonbytes" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
    </Head>
  )
}