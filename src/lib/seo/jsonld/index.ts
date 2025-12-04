/**
 * JSON-LD schema generators barrel export
 */

export { getHomeSchemas } from "./home";
export { getPricingSchemas } from "./pricing";
export {
  generateBreadcrumbSchema,
  buildBreadcrumbItems,
  type BreadcrumbItem,
} from "./breadcrumb";
export { generateWebPageSchema, webPageSchemas } from "./webpage";
