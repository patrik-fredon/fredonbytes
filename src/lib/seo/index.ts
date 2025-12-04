/**
 * SEO utilities barrel export
 *
 * Consolidated exports for all SEO-related functionality:
 * - Hreflang generation
 * - Metadata generators
 * - JSON-LD schema generators
 * - Image optimization utilities
 *
 * @see AGENTS.md SEO Optimization Instructions
 */

// Hreflang utilities
export {
  generateHreflangLinks,
  generateMetadataAlternates,
  generateSitemapAlternates,
} from "./hreflang";

// Metadata generators
export { getHomeMetadata, getPricingMetadata } from "./metadata";

// JSON-LD schema generators
export {
  getHomeSchemas,
  getPricingSchemas,
  generateBreadcrumbSchema,
  buildBreadcrumbItems,
  generateWebPageSchema,
  webPageSchemas,
  type BreadcrumbItem,
} from "./jsonld";

// Image SEO utilities
export {
  generateImageAlt,
  generateLocalizedImageAlt,
  generateImageFileName,
} from "./image-alt";
