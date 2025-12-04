/**
 * SEO-optimized Image component wrapper
 *
 * Provides:
 * - Required alt text with SEO helpers
 * - Automatic priority for above-fold images
 * - Lazy loading for below-fold images
 * - Responsive sizes configuration
 * - WebP/AVIF format support (via Next.js)
 *
 * @see AGENTS.md Phase 6: Image Optimization System
 */

import Image, { type ImageProps } from "next/image";
import { generateImageAlt } from "@/lib/seo/image-alt";

interface OptimizedImageProps extends Omit<ImageProps, "alt"> {
  /**
   * Alt text is required for SEO
   */
  alt: string;

  /**
   * Whether image is above the fold (sets priority)
   * @default false
   */
  aboveFold?: boolean;

  /**
   * Optional keywords to enhance alt text
   */
  keywords?: string[];

  /**
   * Whether to include brand in alt text
   * @default false (to avoid repetition)
   */
  includeBrand?: boolean;

  /**
   * Image quality (1-100)
   * @default 85
   */
  quality?: number;

  /**
   * Responsive sizes attribute
   * @default "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
   */
  sizes?: string;
}

/**
 * SEO-optimized Image component
 *
 * @example
 * // Above-fold hero image
 * <OptimizedImage
 *   src="/hero.jpg"
 *   alt="FredonBytes homepage hero"
 *   width={1920}
 *   height={1080}
 *   aboveFold
 * />
 *
 * @example
 * // Below-fold image with keywords
 * <OptimizedImage
 *   src="/services/web-dev.jpg"
 *   alt="Web Development Services"
 *   width={800}
 *   height={600}
 *   keywords={["React", "Next.js"]}
 * />
 */
export function OptimizedImage({
  alt,
  aboveFold = false,
  keywords,
  includeBrand = false,
  quality = 85,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: OptimizedImageProps) {
  // Generate enhanced alt text if keywords provided
  const enhancedAlt = keywords?.length
    ? generateImageAlt({
        description: alt,
        keywords,
        includeBrand,
      })
    : alt;

  return (
    <Image
      {...props}
      alt={enhancedAlt}
      priority={aboveFold}
      loading={aboveFold ? "eager" : "lazy"}
      quality={quality}
      sizes={sizes}
    />
  );
}

export default OptimizedImage;
