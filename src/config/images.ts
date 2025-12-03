/**
 * Centralized Image Configuration for FredonBytes
 *
 * This file contains all image paths, dimensions, and optimization settings
 * Used throughout the application to ensure consistency and prevent CLS
 */

export const IMAGES = {
  // Main Logo (optimized for mobile and desktop)
  logo: {
    webp: "/FredonBytes_GraphicLogo.webp",
    fallback: "/FredonBytes_GraphicLogo.png",
    width: 800,
    height: 400,
    alt: "FredonBytes Logo",
    sizes: {
      header: {
        mobile: 32,
        desktop: 40,
      },
      hero: {
        mobile: 256,
        desktop: 480,
      },
    },
  },

  // Logo with background
  logoWithBackground: {
    webp: "/fredonbytes-logo-with-background.webp",
    fallback: "/fredonbytes-logo-with-background.png",
    width: 1000,
    height: 1000,
    alt: "FredonBytes Logo with Background",
  },

  // Placeholder project image
  placeholderProject: {
    webp: "/placeholder-project-fredon.webp",
    fallback: "/placeholder-project-fredon.png",
    width: 1200,
    height: 800,
    alt: "FredonBytes Project Placeholder",
  },

  // Open Graph / Social Media
  ogImage: {
    webp: "/og-image.webp",
    fallback: "/og-image.png",
    width: 1200,
    height: 630,
    alt: "FredonBytes - Your All-in-One IT Powerhouse",
  },

  // Screenshots
  screenshots: {
    desktop: {
      webp: "/screenshot-desktop.webp",
      fallback: "/screenshot-desktop.png",
      width: 1920,
      height: 1080,
      alt: "FredonBytes Desktop Screenshot",
    },
    mobile: {
      webp: "/screenshot-mobile.webp",
      fallback: "/screenshot-mobile.png",
      width: 768,
      height: 1024,
      alt: "FredonBytes Mobile Screenshot",
    },
  },

  // PWA Icons (optimized)
  pwaIcons: {
    icon64: {
      webp: "/pwa-64x64.webp",
      fallback: "/pwa-64x64.png",
      width: 64,
      height: 64,
      alt: "FredonBytes PWA Icon 64x64",
    },
    icon128: {
      webp: "/pwa-128x128.webp",
      fallback: "/pwa-128x128.png",
      width: 128,
      height: 128,
      alt: "FredonBytes PWA Icon 128x128",
    },
    icon256: {
      webp: "/pwa-256x256.webp",
      fallback: "/pwa-256x256.png",
      width: 256,
      height: 256,
      alt: "FredonBytes PWA Icon 256x256",
    },
    icon384: {
      webp: "/web-app-manifest-384x384.webp",
      fallback: "/web-app-manifest-384x384.png",
      width: 384,
      height: 384,
      alt: "FredonBytes PWA Icon 384x384",
    },
    icon512: {
      webp: "/web-app-manifest-512x512.webp",
      fallback: "/web-app-manifest-512x512.png",
      width: 512,
      height: 512,
      alt: "FredonBytes PWA Icon 512x512",
    },
  },
} as const;

/**
 * Image optimization quality settings
 */
export const IMAGE_QUALITY = {
  logo: 90, // High quality for brand consistency
  hero: 90, // High quality for above-the-fold
  content: 85, // Good quality for content images
  thumbnail: 80, // Acceptable for small previews
  placeholder: 75, // Lower quality for placeholders
  ogImage: 80, // Social media previews
} as const;

/**
 * Responsive image sizes for different breakpoints
 */
export const IMAGE_SIZES = {
  // Logo sizes
  logoHeader: "(max-width: 1024px) 32px, 40px",
  logoHero: "(max-width: 640px) 256px, (max-width: 1024px) 400px, 480px",

  // Content images
  fullWidth: "100vw",
  contentWidth: "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px",

  // Thumbnails and cards
  thumbnailSmall: "(max-width: 768px) 50vw, 33vw",
  thumbnailMedium: "(max-width: 768px) 100vw, 50vw",

  // Screenshots
  screenshotDesktop: "(max-width: 1920px) 100vw, 1920px",
  screenshotMobile: "(max-width: 768px) 100vw, 768px",
} as const;

/**
 * Helper function to get logo configuration for specific use case
 */
export function getLogoConfig(context: "header" | "hero" | "footer") {
  const base = IMAGES.logo;

  switch (context) {
    case "header":
      return {
        src: base.webp,
        fallback: base.fallback,
        width: base.sizes.header.desktop,
        height: base.sizes.header.desktop / 2, // 2:1 aspect ratio
        alt: base.alt,
        sizes: IMAGE_SIZES.logoHeader,
        quality: IMAGE_QUALITY.logo,
      };

    case "hero":
      return {
        src: base.webp,
        fallback: base.fallback,
        width: base.sizes.hero.desktop,
        height: base.sizes.hero.desktop / 2, // 2:1 aspect ratio
        alt: base.alt,
        sizes: IMAGE_SIZES.logoHero,
        quality: IMAGE_QUALITY.hero,
      };

    case "footer":
      return {
        src: base.webp,
        fallback: base.fallback,
        width: 100,
        height: 50,
        alt: base.alt,
        sizes: "100px",
        quality: IMAGE_QUALITY.content,
      };
  }
}

/**
 * Helper function to check if WebP is available (for fallback)
 */
export function supportsWebP(): boolean {
  if (typeof window === "undefined") return true; // SSR assumes support

  const elem = document.createElement("canvas");
  if (elem.getContext?.("2d")) {
    return elem.toDataURL("image/webp").indexOf("data:image/webp") === 0;
  }
  return false;
}

/**
 * Helper to get image source with fallback
 */
export function getImageSrc(webp: string, fallback: string): string {
  // In SSR or if WebP is supported, use WebP
  if (typeof window === "undefined" || supportsWebP()) {
    return webp;
  }
  return fallback;
}

export type ImageConfig = typeof IMAGES;
export type ImageKey = keyof typeof IMAGES;
