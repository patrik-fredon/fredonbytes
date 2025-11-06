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

  // LocalBusiness schema for better local SEO in Brno
  const localBusinessSchema = createSchema("LocalBusiness", {
    "@id": `${baseUrl}/#localbusiness`,
    name: "Fredonbytes",
    image: `${baseUrl}/FredonBytes_GraphicLogo.png`,
    telephone: "+420799027984",
    email: "info@fredonbytes.cz",
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

  // Service definitions for mapping
  const serviceDefs: ServiceDef[] = [
    {
      serviceType: "Web Development",
      cs: {
        name: "Vývoj webových stránek",
        desc: "Tvorba moderních, rychlých a SEO optimalizovaných webových stránek a aplikací",
      },
      en: {
        name: "Web Development",
        desc: "Development of modern, fast and SEO optimized websites and applications",
      },
    },
    {
      serviceType: "Graphic Design",
      cs: {
        name: "Grafický design",
        desc: "Profesionální grafický design pro vaši značku a online prezentaci",
      },
      en: {
        name: "Graphic Design",
        desc: "Professional graphic design for your brand and online presence",
      },
    },
    {
      serviceType: "SEO Services",
      cs: {
        name: "SEO optimalizace",
        desc: "Komplexní SEO služby pro lepší viditelnost ve vyhledávačích",
      },
      en: {
        name: "SEO Optimization",
        desc: "Comprehensive SEO services for better search engine visibility",
      },
    },
    {
      serviceType: "Digital Marketing",
      cs: {
        name: "Digitální marketing",
        desc: "Marketing na sociálních sítích a online propagace",
      },
      en: {
        name: "Digital Marketing",
        desc: "Social media marketing and online promotion",
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

  // FAQ Schema for rich snippets - map over FAQ indices
  const faqCount = 6;
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
