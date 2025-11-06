/**
 * Central domain configuration for multi-domain support
 *
 * This configuration handles:
 * - Primary domain setup
 * - Secondary domain redirects
 * - Email configuration
 * - SEO canonical URLs
 *
 * Environment Variables:
 * - NEXT_PUBLIC_SITE_URL: Full URL with protocol (e.g., https://fredonbytes.cz)
 * - NEXT_PUBLIC_PRIMARY_DOMAIN: Primary domain only (e.g., fredonbytes.cz)
 * - NEXT_PUBLIC_SECONDARY_DOMAINS: Comma-separated list of domains to redirect
 * - NEXT_PUBLIC_SUPPORT_EMAIL: Support/contact email address
 */

export const domainConfig = {
  /**
   * Primary domain (without protocol)
   * Used for domain validation and redirects
   */
  primary: process.env.NEXT_PUBLIC_PRIMARY_DOMAIN || "fredonbytes.cz",

  /**
   * Full site URL with protocol
   * Used for canonical URLs, sitemaps, and metadata
   */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.cz",

  /**
   * Secondary domains that should redirect to primary
   * Comma-separated list from environment variable
   * Falls back to default domains if env var is not set or empty
   */
  get secondary(): string[] {
    const envDomains = (process.env.NEXT_PUBLIC_SECONDARY_DOMAINS || "")
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);

    // Use fallback if env var is not set or results in empty array
    return envDomains.length > 0
      ? envDomains
      : ["fredonbytes.cloud", "fredonbytes.com", "fredonbytes.eu", "fredonbytes.tech"];
  },

  /**
   * Support/contact email address
   * Used in email templates and contact forms
   */
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "info@fredonbytes.cz",

  /**
   * Contact form recipient email
   */
  contactEmail:
    process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@fredonbytes.cz",

  /**
   * Domain strategy: "primary" (redirect all to primary) or "multi" (serve all)
   */
  strategy: (process.env.NEXT_PUBLIC_DOMAIN_STRATEGY as "primary" | "multi") || "primary",

  /**
   * Get all domains (primary + secondary)
   */
  getAllDomains(): string[] {
    return [this.primary, ...this.secondary];
  },

  /**
   * Check if given host is the primary domain
   */
  isPrimaryDomain(host: string): boolean {
    // Remove port from host if present
    const cleanHost = host.split(":")[0];
    return cleanHost === this.primary;
  },

  /**
   * Check if given host should redirect to primary
   */
  shouldRedirect(host: string): boolean {
    const cleanHost = host.split(":")[0];
    return (
      this.strategy === "primary" &&
      !this.isPrimaryDomain(cleanHost) &&
      this.secondary.includes(cleanHost)
    );
  },

  /**
   * Get email domain from support email
   */
  getEmailDomain(): string {
    return this.supportEmail.split("@")[1] || this.primary;
  },
};
