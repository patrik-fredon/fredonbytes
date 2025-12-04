/**
 * SEO-optimized Internal Link component
 *
 * Features:
 * - Keyword-rich anchor text support
 * - Automatic locale prefixing via next-intl
 * - SEO-friendly attributes
 * - Analytics event support
 *
 * @see AGENTS.md Phase 5: Internal Linking Strategy
 */

import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type NextIntlLinkProps = ComponentProps<typeof Link>;

interface InternalLinkProps extends Omit<NextIntlLinkProps, "children"> {
  /**
   * Link content - can be text or elements
   */
  children: ReactNode;

  /**
   * Primary keyword for the link (used as title if not provided)
   */
  keyword?: string;

  /**
   * Additional keywords to include in title attribute
   */
  keywords?: string[];

  /**
   * Custom title attribute (overrides auto-generated)
   */
  title?: string;

  /**
   * Whether link opens in new tab (adds rel="noopener")
   */
  newTab?: boolean;

  /**
   * Track click event name for analytics
   */
  trackEvent?: string;
}

/**
 * Generate SEO-optimized title from keywords
 */
function generateTitle(keyword?: string, keywords?: string[]): string | undefined {
  if (!keyword && !keywords?.length) return undefined;

  const allKeywords = [keyword, ...(keywords || [])].filter(Boolean);
  return allKeywords.join(" - ");
}

/**
 * SEO-optimized internal link component
 *
 * @example
 * // Basic usage
 * <InternalLink href="/pricing">
 *   View Pricing
 * </InternalLink>
 *
 * @example
 * // With keywords for SEO
 * <InternalLink
 *   href="/services/web-development"
 *   keyword="Web Development"
 *   keywords={["React", "Next.js"]}
 * >
 *   Learn about our web development services
 * </InternalLink>
 *
 * @example
 * // With analytics tracking
 * <InternalLink
 *   href="/contact"
 *   trackEvent="cta_click"
 *   className="btn-primary"
 * >
 *   Contact Us
 * </InternalLink>
 */
export function InternalLink({
  children,
  keyword,
  keywords,
  title,
  newTab = false,
  trackEvent,
  ...props
}: InternalLinkProps) {
  const generatedTitle = title || generateTitle(keyword, keywords);

  return (
    <Link
      {...props}
      {...(generatedTitle && { title: generatedTitle })}
      {...(newTab && {
        target: "_blank",
        rel: "noopener",
      })}
      {...(trackEvent && {
        "data-track": trackEvent,
      })}
    >
      {children}
    </Link>
  );
}

/**
 * Common internal link configurations for reuse
 */
export const internalLinks = {
  /**
   * CTA link to pricing page
   */
  pricing: (locale: string) => ({
    href: "/pricing" as const,
    keyword: locale === "cs" ? "Ceník" : locale === "de" ? "Preise" : "Pricing",
  }),

  /**
   * CTA link to contact page
   */
  contact: (locale: string) => ({
    href: "/contact" as const,
    keyword: locale === "cs" ? "Kontakt" : locale === "de" ? "Kontakt" : "Contact",
  }),

  /**
   * Link to projects/portfolio page
   */
  projects: (locale: string) => ({
    href: "/projects" as const,
    keyword: locale === "cs" ? "Portfolio" : locale === "de" ? "Projekte" : "Projects",
  }),

  /**
   * Link to about page
   */
  about: (locale: string) => ({
    href: "/about" as const,
    keyword: locale === "cs" ? "O nás" : locale === "de" ? "Über uns" : "About Us",
  }),
};

export default InternalLink;
