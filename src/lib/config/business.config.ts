/**
 * Central business configuration for FredonBytes
 *
 * Single source of truth for NAP (Name, Address, Phone) data
 * Used across:
 * - Footer contact info
 * - JSON-LD schemas (Organization, LocalBusiness)
 * - Contact page
 * - Legal documents
 *
 * @see AGENTS.md Phase 1: Foundation Configuration
 */

export const businessConfig = {
  /**
   * Company information
   */
  company: {
    /**
     * Legal entity name (for schemas and legal docs)
     */
    legalName: "Fredonbytes s.r.o.",

    /**
     * Display name / brand name
     */
    displayName: "FredonBytes",

    /**
     * Founding year
     */
    foundingDate: "2023",

    /**
     * Company slogan by locale
     */
    slogan: {
      cs: "Všechny IT služby pod jednou střechou",
      en: "All IT services under one roof",
      de: "Alle IT-Dienste unter einem Dach",
    } as const,
  },

  /**
   * Founder information
   */
  founder: {
    name: "Patrik Fredon",
    jobTitle: "CEO & Founder",
  },

  /**
   * Physical address (NAP - Address component)
   * IMPORTANT: Must be consistent across all uses
   */
  address: {
    streetAddress: "", // Not publicly disclosed
    city: "Brno",
    region: "Jihomoravský kraj",
    postalCode: "", // Not publicly disclosed
    country: "CZ",
    countryName: {
      cs: "Česká republika",
      en: "Czech Republic",
      de: "Tschechische Republik",
    } as const,
  },

  /**
   * Geographic coordinates for LocalBusiness schema
   * Brno city center
   */
  geo: {
    latitude: 49.1951,
    longitude: 16.6068,
  },

  /**
   * Contact information (NAP - Phone component)
   * IMPORTANT: Single source of truth for all phone/email references
   */
  contact: {
    /**
     * Primary phone number (display format with spaces)
     */
    phone: "+420 799 027 984",

    /**
     * Phone number for tel: links (no spaces)
     */
    phoneRaw: "+420799027984",

    /**
     * Primary email address
     */
    email: "info@fredonbytes.com",

    /**
     * Support email (same as primary for now)
     */
    supportEmail: "info@fredonbytes.com",
  },

  /**
   * Business hours
   */
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const,
    opens: "09:00",
    closes: "17:00",
  },

  /**
   * Available languages for customer service
   */
  availableLanguages: ["Czech", "English", "German"] as const,

  /**
   * Service area
   */
  serviceArea: {
    primary: [
      { type: "City", name: "Brno" },
      { type: "City", name: "Praha" },
      { type: "City", name: "Ostrava" },
    ] as const,
    region: {
      type: "AdministrativeArea",
      name: "Jihomoravský kraj",
    },
    country: {
      type: "Country",
      name: "Česká republika",
    },
  },

  /**
   * Pricing and payment information
   */
  payment: {
    priceRange: "$$",
    currenciesAccepted: ["CZK", "EUR", "USD"] as const,
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"] as const,
  },

  /**
   * Social media links
   */
  socialLinks: {
    github: "https://github.com/FredonBytes",
    githubPersonal: "https://github.com/patrik-fredon",
    linkedin: "https://linkedin.com/company/fredonbytes",
    twitter: "https://twitter.com/Fredonbytes",
  },

  /**
   * Maps link
   */
  mapsUrl: "https://maps.google.com/?q=49.1951,16.6068",
} as const;

/**
 * Helper to get localized slogan
 */
export function getSlogan(locale: string): string {
  return (
    businessConfig.company.slogan[locale as keyof typeof businessConfig.company.slogan] ||
    businessConfig.company.slogan.cs
  );
}

/**
 * Helper to get localized country name
 */
export function getCountryName(locale: string): string {
  return (
    businessConfig.address.countryName[locale as keyof typeof businessConfig.address.countryName] ||
    businessConfig.address.countryName.cs
  );
}

/**
 * Helper to build PostalAddress schema
 */
export function buildPostalAddressSchema(locale?: string) {
  return {
    "@type": "PostalAddress" as const,
    streetAddress: businessConfig.address.streetAddress || undefined,
    addressLocality: businessConfig.address.city,
    addressRegion: businessConfig.address.region,
    postalCode: businessConfig.address.postalCode || undefined,
    addressCountry: businessConfig.address.country,
  };
}

/**
 * Helper to build GeoCoordinates schema
 */
export function buildGeoCoordinatesSchema() {
  return {
    "@type": "GeoCoordinates" as const,
    latitude: businessConfig.geo.latitude,
    longitude: businessConfig.geo.longitude,
  };
}

/**
 * Helper to build ContactPoint schema
 */
export function buildContactPointSchema() {
  return {
    "@type": "ContactPoint" as const,
    telephone: businessConfig.contact.phoneRaw,
    contactType: "customer service",
    email: businessConfig.contact.email,
    availableLanguage: [...businessConfig.availableLanguages],
    areaServed: businessConfig.address.country,
  };
}

/**
 * Helper to build OpeningHoursSpecification schema
 */
export function buildOpeningHoursSchema() {
  return {
    "@type": "OpeningHoursSpecification" as const,
    dayOfWeek: [...businessConfig.openingHours.days],
    opens: businessConfig.openingHours.opens,
    closes: businessConfig.openingHours.closes,
  };
}

/**
 * Helper to build sameAs array for schemas
 */
export function buildSameAsArray(): string[] {
  return Object.values(businessConfig.socialLinks);
}
