/**
 * Image alt text generation utilities
 *
 * @see AGENTS.md Phase 6: Image Optimization System
 */

import { seoConfig } from "@/lib/config/seo.config";

interface GenerateImageAltOptions {
  /**
   * Primary description of the image
   */
  description: string;

  /**
   * Optional keywords to include in alt text
   */
  keywords?: string[];

  /**
   * Product or service name if applicable
   */
  productName?: string;

  /**
   * Feature or variant being shown
   */
  feature?: string;

  /**
   * Whether to include brand name
   * @default true
   */
  includeBrand?: boolean;
}

/**
 * Generate SEO-optimized alt text for images
 *
 * @example
 * generateImageAlt({ description: "Homepage hero" })
 * // Returns: "Homepage hero - FredonBytes"
 *
 * @example
 * generateImageAlt({
 *   productName: "Web Development",
 *   feature: "React & Next.js",
 *   keywords: ["modern", "fast"]
 * })
 * // Returns: "Web Development - React & Next.js - modern - fast - FredonBytes"
 */
export function generateImageAlt({
  description,
  keywords = [],
  productName,
  feature,
  includeBrand = true,
}: GenerateImageAltOptions): string {
  const parts: string[] = [];

  // Add product name first if provided
  if (productName) {
    parts.push(productName);
  }

  // Add feature/variant
  if (feature) {
    parts.push(feature);
  }

  // Add description if no product name
  if (!productName && description) {
    parts.push(description);
  }

  // Add keywords
  parts.push(...keywords);

  // Add brand name at the end
  if (includeBrand) {
    parts.push(seoConfig.brandName);
  }

  return parts.join(" - ");
}

/**
 * Generate localized alt text
 */
export function generateLocalizedImageAlt(
  locale: string,
  options: GenerateImageAltOptions & {
    localizedDescription?: Record<string, string>;
  },
): string {
  const description =
    options.localizedDescription?.[locale] || options.description;

  return generateImageAlt({
    ...options,
    description,
  });
}

/**
 * File naming convention helper
 * Pattern: {keyword}-{product}-{variant}.{ext}
 */
export function generateImageFileName(options: {
  keyword: string;
  product?: string;
  variant?: string;
  extension?: string;
}): string {
  const { keyword, product, variant, extension = "webp" } = options;

  const parts = [keyword];
  if (product) parts.push(product);
  if (variant) parts.push(variant);

  // Normalize: lowercase, replace spaces with hyphens
  const fileName = parts
    .map((p) => p.toLowerCase().replace(/\s+/g, "-"))
    .join("-");

  return `${fileName}.${extension}`;
}
