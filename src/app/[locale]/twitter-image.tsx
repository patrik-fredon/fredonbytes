import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

/**
 * Dynamic Twitter Card Image Generator for Next.js 15
 *
 * Best Practices Implemented:
 * ✓ Edge Runtime for optimal performance
 * ✓ Twitter Card size (1200x630) - summary_large_image
 * ✓ Localized content per language
 * ✓ Brand-consistent design
 * ✓ Optimized for Twitter's card validator
 * ✓ Static optimization at build time
 *
 * Twitter Card Specifications:
 * - Type: summary_large_image
 * - Size: 1200x630px (2:1 aspect ratio)
 * - Format: PNG
 * - Max file size: <5MB (Next.js optimizes automatically)
 * - Cache: Static generation at build time
 *
 * @see https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

// Image metadata configuration
export const alt = "FredonBytes - Web Development & Digital Marketing Solutions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Use Edge Runtime for optimal performance
export const runtime = "edge";

// Localized content for each language
const localizedContent = {
  cs: {
    title: "FredonBytes",
    subtitle: "Webový vývoj & Digitální marketing",
    description: "Profesionální digitální řešení",
  },
  en: {
    title: "FredonBytes",
    subtitle: "Web Development & Digital Marketing",
    description: "Professional digital solutions",
  },
  de: {
    title: "FredonBytes",
    subtitle: "Webentwicklung & Digitales Marketing",
    description: "Professionelle digitale Lösungen",
  },
};

/**
 * Generate static params for all supported locales
 * Enables Next.js to prerender Twitter images for each locale at build time
 */
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }));
}

/**
 * Generate Twitter Card Image
 *
 * This function creates a dynamic Twitter card image using JSX and CSS.
 * The ImageResponse API converts this to a PNG image.
 *
 * Design Considerations:
 * - Twitter displays images at various sizes across devices
 * - Text should be large and readable even when cropped
 * - High contrast for better visibility in feeds
 * - Consistent branding with OG image but optimized for Twitter
 *
 * Performance:
 * - Generated at build time (static)
 * - Cached indefinitely
 * - Served via Edge Network
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content =
    localizedContent[locale as keyof typeof localizedContent] ||
    localizedContent.en;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0E27", // Brand dark background
          backgroundImage:
            "linear-gradient(135deg, #0A0E27 0%, #1a1f3a 50%, #0A0E27 100%)",
          position: "relative",
        }}
      >
        {/* Decorative gradient orbs for visual depth */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: "40%",
            height: "40%",
            background:
              "radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10%",
            right: "-5%",
            width: "40%",
            height: "40%",
            background:
              "radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "80px",
            zIndex: 1,
          }}
        >
          {/* Logo/Brand mark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            {/* Stylized logo */}
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "20px",
                background:
                  "linear-gradient(135deg, #00D9FF 0%, #0099CC 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "60px",
                fontWeight: "bold",
                color: "#0A0E27",
                boxShadow: "0 20px 60px rgba(0, 217, 255, 0.3)",
              }}
            >
              FB
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: "bold",
              color: "#FFFFFF",
              marginBottom: "20px",
              textAlign: "center",
              letterSpacing: "-0.02em",
            }}
          >
            {content.title}
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: "40px",
              fontWeight: "600",
              background:
                "linear-gradient(90deg, #00D9FF 0%, #FFFFFF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              marginBottom: "30px",
              textAlign: "center",
            }}
          >
            {content.subtitle}
          </div>

          {/* Description */}
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              textAlign: "center",
              maxWidth: "800px",
            }}
          >
            {content.description}
          </div>
        </div>

        {/* Twitter accent - bottom gradient bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: "linear-gradient(90deg, #00D9FF 0%, #0099CC 100%)",
          }}
        />

        {/* Social proof badge (optional) */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(0, 217, 255, 0.1)",
            borderRadius: "12px",
            padding: "12px 24px",
            border: "2px solid rgba(0, 217, 255, 0.3)",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: "#00D9FF",
              fontWeight: "600",
            }}
          >
            @FredonBytes
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
