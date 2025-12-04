/**
 * Breadcrumb Schema Generator
 *
 * @see AGENTS.md Phase 4: JSON-LD Schema Implementation
 */

import { seoConfig } from "@/lib/config/seo.config";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generate BreadcrumbList JSON-LD schema
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string = seoConfig.baseUrl,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
    })),
  };
}

/**
 * Generate breadcrumb items for a page
 * Automatically includes home and constructs path
 */
export function buildBreadcrumbItems(
  locale: string,
  path: { name: string; slug: string }[],
  homeLabel: string = "Home",
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    {
      name: homeLabel,
      url: `${seoConfig.baseUrl}/${locale}`,
    },
  ];

  let currentPath = `/${locale}`;
  for (const segment of path) {
    currentPath += `/${segment.slug}`;
    items.push({
      name: segment.name,
      url: `${seoConfig.baseUrl}${currentPath}`,
    });
  }

  return items;
}
