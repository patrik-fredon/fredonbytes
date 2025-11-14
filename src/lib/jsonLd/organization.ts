import { getTranslations } from "next-intl/server";

type Schema = Record<string, unknown>;
type SchemaProps = Record<string, unknown>;

const SCHEMA_CONTEXT = "https://schema.org";
const DEFAULT_BASE_URL = "https://fredonbytes.eu";

function createSchema<T extends string>(
    type: T,
    props: Omit<SchemaProps, "@context" | "@type">
): Record<"@context" | "@type", string> & SchemaProps {
    return { "@context": SCHEMA_CONTEXT, "@type": type, ...props };
}

function resolveBusinessAddress() {
    const street = process.env.NEXT_PUBLIC_BUSINESS_STREET;
    const postalCode = process.env.NEXT_PUBLIC_BUSINESS_POSTAL_CODE;

    if (!street || !postalCode) {
        throw new Error(
            "Missing NEXT_PUBLIC_BUSINESS_STREET or NEXT_PUBLIC_BUSINESS_POSTAL_CODE environment variables",
        );
    }

    return { street, postalCode };
}

function getBaseUrl() {
    const baseUrlEnv = process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_BASE_URL;
    return baseUrlEnv.replace(/\/$/, "");
}

export async function getOrganizationSchemas(locale: string): Promise<Schema[]> {
    const jsonLdT = await getTranslations({ locale, namespace: "jsonLd" });
    const baseUrl = getBaseUrl();
    const { street, postalCode } = resolveBusinessAddress();

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
    });

    const localBusinessSchema = createSchema("LocalBusiness", {
        "@id": `${baseUrl}/#localbusiness`,
        name: "Fredonbytes",
        alternateName: "FredonBytes s.r.o.",
        description: jsonLdT("organizationDescription"),
        slogan:
            locale === "cs"
                ? "Všechny IT služby pod jednou střechou"
                : "All IT services under one roof",
        image: `${baseUrl}/og-image.png`,
        logo: `${baseUrl}/icon1.png`,
        telephone: "+420799027984",
        email: "info@fredonbytes.com",
        address: {
            "@type": "PostalAddress",
            streetAddress: street,
            addressLocality: "Brno",
            addressRegion: "Jihomoravský kraj",
            postalCode,
            addressCountry: "CZ",
        },
        areaServed: [
            { "@type": "City", name: "Brno" },
            { "@type": "City", name: "Praha" },
            { "@type": "City", name: "Ostrava" },
            { "@type": "Country", name: "Česká republika" },
            { "@type": "AdministrativeArea", name: "Jihomoravský kraj" },
            { "@type": "Country", name: "Česká republika" },
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
        hasOfferCatalog: {
            "@type": "OfferCatalog",
            name:
                locale === "cs"
                    ? "Měsíční IT balíčky a služby"
                    : "Monthly IT packages and services",
            itemListElement: [
                {
                    "@type": "OfferCatalog",
                    name: locale === "cs" ? "Vývoj & Hosting" : "Development & Hosting",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "Webhosting" : "Web Hosting",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "Vývoj webu" : "Web Development",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: locale === "cs" ? "Design & Branding" : "Design & Branding",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name:
                                    locale === "cs" ? "Branding a identita" : "Branding & Identity",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "UX/UI Design" : "UX/UI Design",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "Grafický design" : "Graphic Design",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: locale === "cs" ? "Marketing & SEO" : "Marketing & SEO",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "SEO optimalizace" : "SEO Optimization",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name:
                                    locale === "cs"
                                        ? "Správa sociálních sítí"
                                        : "Social Media Management",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "Copywriting" : "Copywriting",
                            },
                        },
                    ],
                },
                {
                    "@type": "OfferCatalog",
                    name: locale === "cs" ? "Konzultace & Podpora" : "Consulting & Support",
                    itemListElement: [
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "IT poradenství" : "IT Consulting",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name:
                                    locale === "cs"
                                        ? "Technická podpora 24/7"
                                        : "Technical Support 24/7",
                            },
                        },
                        {
                            "@type": "Offer",
                            itemOffered: {
                                "@type": "Service",
                                name: locale === "cs" ? "Analýza potřeb" : "Needs Analysis",
                            },
                        },
                    ],
                },
            ],
        },
        hasMap: "https://maps.google.com/?q=49.1951,16.6068",
    });

    return [organizationSchema, localBusinessSchema];
}
