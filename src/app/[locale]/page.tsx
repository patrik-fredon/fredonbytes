import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FAQSection from "../../components/homepage/FAQSection";
import {
  AboutSectionSkeleton,
  PricingSectionSkeleton,
  ServicesSectionSkeleton,
} from "../../components/homepage/HomepageSkeletons";

// Hero section - client-only for optimal animation performance
const HeroSection = dynamic(
  () => import("../../components/homepage/HeroSection"),
  {
    loading: () => (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </section>
    ),
  },
);

// Dynamic imports for below-the-fold sections with Suspense
const AboutSection = dynamic(
  () => import("../../components/homepage/AboutSection"),
  {
    ssr: true,
    loading: () => <AboutSectionSkeleton />,
  },
);

const ServicesSection = dynamic(
  () => import("../../components/homepage/ServicesSection"),
  {
    ssr: true,
    loading: () => <ServicesSectionSkeleton />,
  },
);

const PricingSection = dynamic(
  () => import("../../components/homepage/PricingSection"),
  {
    ssr: true,
    loading: () => <PricingSectionSkeleton />,
  },
);

type Props = {
  params: Promise<{ locale: string }>;
};

// Enhanced metadata for homepage with Czech market optimization
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  const seoT = await getTranslations({ locale, namespace: "seo" });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const canonicalUrl = `${baseUrl}${localePrefix}`;

  // Enhanced keywords with Czech market focus
  const enhancedKeywords =
    locale === "cs"
      ? "tvorba webových stránek Brno, vývoj webů Brno, IT firma Brno, vývoj software Brno, digitální marketing ČR, SEO optimalizace Brno, grafický design Brno, tvorba e-shopů, webové aplikace Brno, IT řešení pro firmy, vývoj mobilních aplikací ČR, WordPress Brno, Next.js vývoj, React vývoj Brno"
      : t("keywords");

  return {
    title: t("title"),
    description: seoT("defaultDescription"),
    keywords: enhancedKeywords,
    authors: [{ name: "Fredonbytes", url: baseUrl }],
    creator: "Fredonbytes",
    publisher: "Fredonbytes",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        cs: baseUrl,
        en: `${baseUrl}/en`,
        de: `${baseUrl}/de`,
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      url: canonicalUrl,
      siteName: t("siteName"),
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [
        {
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          width: 1200,
          height: 630,
          alt: t("logoAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@Fredonbytes",
      creator: "@FredonBytes",
      title: t("title"),
      description: seoT("defaultDescription"),
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
    },
  };
}

// ISR configuration for homepage - revalidate every 24 hours
export const revalidate = 86400; // 24 hours

export default async function Home({ params }: Props) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  // Comprehensive JSON-LD structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${baseUrl}/#organization`,
    name: "Fredonbytes",
    legalName: "Fredonbytes s.r.o.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
      width: 1200,
      height: 630,
    },
    description: jsonLdT("organizationDescription"),
    foundingDate: "2023",
    founders: [
      {
        "@type": "Person",
        name: "Patrik Fredon",
        jobTitle: "CEO & Founder",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brno",
      addressRegion: "Jihomoravský kraj",
      addressCountry: "CZ",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+420799027984",
        contactType: "customer service",
        email: "info@fredonbytes.com",
        availableLanguage: ["Czech", "English", "German"],
        areaServed: "CZ",
      },
    ],
    sameAs: [
      "https://github.com/FredonBytes",
      "https://github.com/patrik-fredon",
      "https://linkedin.com/company/fredonbytes",
      "https://twitter.com/Fredonbytes",
    ],
  };

  // LocalBusiness schema for better local SEO in Brno
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/#localbusiness`,
    name: "Fredonbytes",
    image: `${baseUrl}/FredonBytes_GraphicLogo.png`,
    telephone: "+420799027984",
    email: "info@fredonbytes.cloud",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brno",
      addressRegion: "Jihomoravský kraj",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 49.1951,
      longitude: 16.6068,
    },
    url: baseUrl,
    priceRange: "$$",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
  };

  // WebSite schema with sitelinks searchbox
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${baseUrl}/#website`,
    url: baseUrl,
    name: "Fredonbytes",
    description: jsonLdT("organizationDescription"),
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  // Service schema for main services
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "Service",
        name: locale === "cs" ? "Vývoj webových stránek" : "Web Development",
        description:
          locale === "cs"
            ? "Tvorba moderních, rychlých a SEO optimalizovaných webových stránek a aplikací"
            : "Development of modern, fast and SEO optimized websites and applications",
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: "CZ",
        serviceType: "Web Development",
      },
      {
        "@type": "Service",
        name: locale === "cs" ? "Grafický design" : "Graphic Design",
        description:
          locale === "cs"
            ? "Profesionální grafický design pro vaši značku a online prezentaci"
            : "Professional graphic design for your brand and online presence",
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: "CZ",
        serviceType: "Graphic Design",
      },
      {
        "@type": "Service",
        name: locale === "cs" ? "SEO optimalizace" : "SEO Optimization",
        description:
          locale === "cs"
            ? "Komplexní SEO služby pro lepší viditelnost ve vyhledávačích"
            : "Comprehensive SEO services for better search engine visibility",
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: "CZ",
        serviceType: "SEO Services",
      },
      {
        "@type": "Service",
        name: locale === "cs" ? "Digitální marketing" : "Digital Marketing",
        description:
          locale === "cs"
            ? "Marketing na sociálních sítích a online propagace"
            : "Social media marketing and online promotion",
        provider: {
          "@id": `${baseUrl}/#organization`,
        },
        areaServed: "CZ",
        serviceType: "Digital Marketing",
      },
    ],
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  // FAQ Schema for rich snippets
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: faqT("items.0.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.0.answer"),
        },
      },
      {
        "@type": "Question",
        name: faqT("items.1.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.1.answer"),
        },
      },
      {
        "@type": "Question",
        name: faqT("items.2.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.2.answer"),
        },
      },
      {
        "@type": "Question",
        name: faqT("items.3.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.3.answer"),
        },
      },
      {
        "@type": "Question",
        name: faqT("items.4.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.4.answer"),
        },
      },
      {
        "@type": "Question",
        name: faqT("items.5.question"),
        acceptedAnswer: {
          "@type": "Answer",
          text: faqT("items.5.answer"),
        },
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      <div className="min-h-screen relative z-10">
        <HeroSection />
        <ServicesSection />
        <AboutSection showTeam={false} />
        <FAQSection locale={locale} />
        <PricingSection />
      </div>
    </>
  );
}
