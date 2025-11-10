import { getTranslations } from "next-intl/server";

type Schema = Record<string, unknown>;
type SchemaProps = Record<string, unknown>;

// Schema.org context constant
const SCHEMA_CONTEXT = "https://schema.org";

/**
 * Helper to create a schema object with @context and @type
 */
function createSchema<T extends string>(
  type: T,
  props: Omit<SchemaProps, "@context" | "@type">
): Record<"@context" | "@type", string> & SchemaProps {
  return { "@context": SCHEMA_CONTEXT, "@type": type, ...props };
}

/**
 * Service definition for mapping
 */
interface ServiceDef {
  serviceType: string;
  cs: { name: string; desc: string };
  en: { name: string; desc: string };
}

/**
 * Generate all JSON-LD schemas for the home page
 * Returns an array of schema objects for consolidated rendering
 */
export async function getHomeSchemas(locale: string): Promise<Schema[]> {
  const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });
  const faqT = await getTranslations({ locale, namespace: "faq" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  // Organization schema
  const organizationSchema = createSchema("Organization", {
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
        email: "info@fredonbytes.cz",
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
  });

  // LocalBusiness schema for better local SEO in Brno and GMB compatibility
  const localBusinessSchema = createSchema("LocalBusiness", {
    "@id": `${baseUrl}/#localbusiness`,
    name: "Fredonbytes",
    alternateName: "FredonBytes s.r.o.",
    description: jsonLdT("organizationDescription"),
    image: `${baseUrl}/FredonBytes_GraphicLogo.png`,
    logo: `${baseUrl}/FredonBytes_GraphicLogo.png`,
    telephone: "+420799027984",
    email: "info@fredonbytes.cz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "",
      addressLocality: "Brno",
      addressRegion: "Jihomoravský kraj",
      postalCode: "",
      addressCountry: "CZ",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 49.1951,
      longitude: 16.6068,
    },
    url: baseUrl,
    priceRange: "$$",
    currenciesAccepted: "CZK, EUR, USD",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "17:00",
    },
    areaServed: [
      {
        "@type": "City",
        name: "Brno",
      },
      {
        "@type": "AdministrativeArea",
        name: "Jihomoravský kraj",
      },
      {
        "@type": "Country",
        name: "Česká republika",
      },
    ],
    hasMap: "https://maps.google.com/?q=49.1951,16.6068",
  });

  // WebSite schema with sitelinks searchbox
  const websiteSchema = createSchema("WebSite", {
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
  });

  // Service definitions for mapping - comprehensive IT services
  const serviceDefs: ServiceDef[] = [
    {
      serviceType: "Software Development",
      cs: {
        name: "Vývoj software a aplikací",
        desc: "Full-stack vývoj webových a mobilních aplikací, API integrace, cloudová řešení",
      },
      en: {
        name: "Software & App Development",
        desc: "Full-stack web and mobile app development, API integration, cloud solutions",
      },
    },
    {
      serviceType: "Graphic Design & UX/UI",
      cs: {
        name: "Grafický design a UX/UI",
        desc: "Webdesign, branding, firemní identita, prototypování a vizuální komunikace",
      },
      en: {
        name: "Graphic Design & UX/UI",
        desc: "Web design, branding, corporate identity, prototyping and visual communication",
      },
    },
    {
      serviceType: "SEO & Digital Marketing",
      cs: {
        name: "SEO a digitální marketing",
        desc: "SEO optimalizace, PPC kampaně, Google Ads, SEM služby, obsahový marketing",
      },
      en: {
        name: "SEO & Digital Marketing",
        desc: "SEO optimization, PPC campaigns, Google Ads, SEM services, content marketing",
      },
    },
    {
      serviceType: "Social Media Management",
      cs: {
        name: "Správa sociálních sítí",
        desc: "Instagram, Facebook, LinkedIn marketing, tvorba obsahu, community management",
      },
      en: {
        name: "Social Media Management",
        desc: "Instagram, Facebook, LinkedIn marketing, content creation, community management",
      },
    },
    {
      serviceType: "Copywriting & Content",
      cs: {
        name: "Copywriting a tvorba obsahu",
        desc: "SEO copywriting, marketing texty, obsahová strategie pro web a sociální sítě",
      },
      en: {
        name: "Copywriting & Content",
        desc: "SEO copywriting, marketing texts, content strategy for web and social media",
      },
    },
    {
      serviceType: "IT Consulting & Cybersecurity",
      cs: {
        name: "IT poradenství a kybernetická bezpečnost",
        desc: "IT konzultace, bezpečnostní audit, NIS2 compliance, GDPR poradenství, digitální transformace",
      },
      en: {
        name: "IT Consulting & Cybersecurity",
        desc: "IT consulting, security audit, NIS2 compliance, GDPR consulting, digital transformation",
      },
    },
    {
      serviceType: "Hosting & Technical Support",
      cs: {
        name: "Webhosting a technická podpora",
        desc: "Webhosting, správa serverů, 24/7 IT podpora, monitoring výkonu",
      },
      en: {
        name: "Hosting & Technical Support",
        desc: "Web hosting, server management, 24/7 IT support, performance monitoring",
      },
    },
    {
      serviceType: "AI Integration & Automation",
      cs: {
        name: "AI integrace a automatizace",
        desc: "Integrace umělé inteligence, automatizace procesů, datová analytika",
      },
      en: {
        name: "AI Integration & Automation",
        desc: "Artificial intelligence integration, process automation, data analytics",
      },
    },
  ];

  // Service schema for main services
  const servicesSchema = createSchema("ItemList", {
    itemListElement: serviceDefs.map(({ serviceType, cs, en }) =>
      createSchema("Service", {
        name: locale === "cs" ? cs.name : en.name,
        description: locale === "cs" ? cs.desc : en.desc,
        provider: { "@id": `${baseUrl}/#organization` },
        areaServed: "CZ",
        serviceType,
      })
    ),
  });

  // Breadcrumb schema
  const breadcrumbSchema = createSchema("BreadcrumbList", {
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  });

  // FAQ Schema for rich snippets - derive count from translations
  const faqItems = faqT('items') as unknown;
  const faqCount = Array.isArray(faqItems)
    ? faqItems.length
    : (faqItems && typeof faqItems === 'object' ? Object.keys(faqItems).length : 0);

  const faqSchema = createSchema("FAQPage", {
    mainEntity: Array.from({ length: faqCount }, (_, i) =>
      createSchema("Question", {
        name: faqT(`items.${i}.question`),
        acceptedAnswer: createSchema("Answer", {
          text: faqT(`items.${i}.answer`),
        }),
      })
    ),
  });

  return [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    servicesSchema,
    breadcrumbSchema,
    faqSchema,
  ];
}
