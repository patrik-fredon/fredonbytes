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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.eu";

  // Organization schema
  const organizationSchema = createSchema("Organization", {
    "@id": `${baseUrl}/#organization`,
    name: "Fredonbytes",
    legalName: "Fredonbytes s.r.o.",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/og-image.png`,
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
        email: "info@fredonbytes.eu",
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
    slogan: locale === "cs" ? "Všechny IT služby pod jednou střechou" : "All IT services under one roof",
    image: `${baseUrl}/og-image.png`,
    logo: `${baseUrl}/icon1.png`,
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
    areaServed: [
      { "@type": "City", name: "Brno" },
      { "@type": "City", name: "Praha" },
      { "@type": "City", name: "Ostrava" },
      { "@type": "Country", name: "Česká republika" },
      {
        "@type": "AdministrativeArea",
        name: "Jihomoravský kraj",
      },
      {
        "@type": "Country",
        name: "Česká republika",
      },
    ],
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
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5.0",
      reviewCount: 15,
      bestRating: "5",
      worstRating: "1"
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: locale === "cs" ? "Měsíční IT balíčky a služby" : "Monthly IT packages and services",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: locale === "cs" ? "Vývoj & Hosting" : "Development & Hosting",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Webhosting" : "Web Hosting" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Vývoj webu" : "Web Development" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          name: locale === "cs" ? "Design & Branding" : "Design & Branding",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Branding a identita" : "Branding & Identity" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "UX/UI Design" : "UX/UI Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Grafický design" : "Graphic Design" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          name: locale === "cs" ? "Marketing & SEO" : "Marketing & SEO",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "SEO optimalizace" : "SEO Optimization" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Správa sociálních sítí" : "Social Media Management" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Copywriting" : "Copywriting" } }
          ]
        },
        {
          "@type": "OfferCatalog",
          name: locale === "cs" ? "Konzultace & Podpora" : "Consulting & Support",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "IT poradenství" : "IT Consulting" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Technická podpora 24/7" : "Technical Support 24/7" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: locale === "cs" ? "Analýza potřeb" : "Needs Analysis" } }
          ]
        }
      ]
    },
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

  // Expanded service definitions - ALL IT services under one roof
  const serviceDefs: ServiceDef[] = [
    {
      serviceType: "Web Hosting",
      cs: { name: "Hosting a webhosting", desc: "Spolehlivý webhosting s 99.9% dostupností a technickou podporou 24/7" },
      en: { name: "Web Hosting", desc: "Reliable web hosting with 99.9% uptime and 24/7 technical support" },
    },
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
    {
      serviceType: "Graphic Design",
      cs: { name: "Grafický design a UX/UI", desc: "Profesionální grafický design, wireframy, prototypy a uživatelské rozhraní" },
      en: { name: "Graphic Design & UX/UI", desc: "Professional graphic design, wireframes, prototypes and user interfaces" },
    },
    {
      serviceType: "Branding",
      cs: { name: "Branding a firemní identita", desc: "Komplexní tvorba značky, loga, firemních barev a jednotného vizuálního stylu" },
      en: { name: "Branding & Corporate Identity", desc: "Complete brand creation, logo, corporate colors and unified visual style" },
    },
    {
      serviceType: "Copywriting",
      cs: { name: "Copywriting a tvorba obsahu", desc: "SEO texty, obsahové strategie, blogy a marketingové materiály" },
      en: { name: "Copywriting & Content Creation", desc: "SEO texts, content strategies, blogs and marketing materials" },
    },
    {
      serviceType: "SEO Services",
      cs: { name: "SEO optimalizace", desc: "Optimalizace pro Google, Seznam.cz, lokální SEO a analýza konkurence" },
      en: { name: "SEO Optimization", desc: "Optimization for Google, Seznam.cz, local SEO and competitor analysis" },
    },
    {
      serviceType: "Social Media Management",
      cs: { name: "Správa sociálních sítí", desc: "Kompletní management Instagramu, Facebooku, LinkedIn s tvorbou obsahu" },
      en: { name: "Social Media Management", desc: "Complete management of Instagram, Facebook, LinkedIn with content creation" },
    },
    {
      serviceType: "Digital Marketing",
      cs: { name: "Digitální marketing", desc: "PPC kampaně, remarketing, e-mail marketing a měření výkonnosti" },
      en: { name: "Digital Marketing", desc: "PPC campaigns, remarketing, email marketing and performance measurement" },
    },
    {
      serviceType: "IT Consulting",
      cs: { name: "IT poradenství", desc: "Konzultace infrastruktury, výběr technologií a digitální transformace" },
      en: { name: "IT Consulting", desc: "Infrastructure consulting, technology selection and digital transformation" },
    },
    {
      serviceType: "Cybersecurity",
      cs: { name: "Kybernetická bezpečnost", desc: "Bezpečnostní audity, penetrační testy a GDPR compliance" },
      en: { name: "Cybersecurity", desc: "Security audits, penetration tests and GDPR compliance" },
    },
    {
      serviceType: "Technical Support",
      cs: { name: "Technická podpora 24/7", desc: "Nepřetržitá podpora, monitoring, aktualizace a zálohy" },
      en: { name: "24/7 Technical Support", desc: "Continuous support, monitoring, updates and backups" },
    },
    {
      serviceType: "Monthly Service Packages",
      cs: { name: "Měsíční balíčky služeb", desc: "Flexibilní měsíční balíčky s kombinací služeb od 5.990 Kč" },
      en: { name: "Monthly Service Packages", desc: "Flexible monthly packages with service combinations from 5,990 CZK" },
    },
    {
      serviceType: "Cloud Solutions",
      cs: { name: "Cloudová řešení", desc: "Migrace do cloudu, AWS, Azure, správa cloudové infrastruktury" },
      en: { name: "Cloud Solutions", desc: "Cloud migration, AWS, Azure, cloud infrastructure management" },
    },
    {
      serviceType: "E-commerce",
      cs: { name: "E-commerce a e-shopy", desc: "Kompletní e-shopy na míru s WooCommerce, Shopify nebo custom řešení" },
      en: { name: "E-commerce Solutions", desc: "Complete custom e-shops with WooCommerce, Shopify or custom solutions" },
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

  // FAQ Schema for rich snippets
  // Build FAQ list with safe error handling
  const faqSchema = (() => {
    try {
      const faqQuestions = [];
      // Try to build FAQ items - stop when translation key doesn't exist
      for (let i = 0; i < 20; i++) { // Max 20 FAQs
        try {
          const question = faqT(`items.${i}.question`);
          const answer = faqT(`items.${i}.answer`);

          faqQuestions.push(
            createSchema("Question", {
              name: question,
              acceptedAnswer: createSchema("Answer", {
                text: answer,
              }),
            })
          );
        } catch {
          // No more FAQ items exist
          break;
        }
      }

      return createSchema("FAQPage", {
        mainEntity: faqQuestions,
      });
    } catch (error) {
      // Fallback: return minimal FAQ schema if something goes wrong
      console.error("Error building FAQ schema:", error);
      return createSchema("FAQPage", {
        mainEntity: [],
      });
    }
  })();

  return [
    organizationSchema,
    localBusinessSchema,
    websiteSchema,
    servicesSchema,
    breadcrumbSchema,
    faqSchema,
  ];
}
