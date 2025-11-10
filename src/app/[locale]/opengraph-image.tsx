import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

/**
 * Dynamic Open Graph Image Generator for Next.js 15
 *
 * Best Practices Implemented:
 * ✓ Standard OG image size (1200x630)
 * ✓ Localized content per language
 * ✓ Brand colors and typography
 * ✓ Responsive design principles
 * ✓ Static optimization at build time
 *
 * Image Specifications:
 * - Size: 1200x630px (Facebook/LinkedIn optimal)
 * - Format: PNG
 * - File size: Optimized automatically
 * - Cache: Static generation at build time
 * - Runtime: Next.js default (no Edge runtime in metadata files)
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
 */

// Image metadata configuration
export const alt = "FredonBytes - Web Development & Digital Marketing";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Localized content for each language
const localizedContent = {
  cs: {
    title: "FredonBytes",
    subtitle: "Webový vývoj & Digitální marketing",
    tagline: "Profesionální řešení pro váš online úspěch",
  },
  en: {
    title: "FredonBytes",
    subtitle: "Web Development & Digital Marketing",
    tagline: "Professional solutions for your online success",
  },
  de: {
    title: "FredonBytes",
    subtitle: "Webentwicklung & Digitales Marketing",
    tagline: "Professionelle Lösungen für Ihren Online-Erfolg",
  },
};

/**
 * Generate Open Graph Image
 *
 * This function creates a dynamic OG image using JSX and CSS.
 * The ImageResponse API converts this to a PNG image.
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
        {/* Decorative gradient orbs for visual interest */}
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
            {/* Stylized logo placeholder */}
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

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "#94A3B8",
              textAlign: "center",
              maxWidth: "800px",
              lineHeight: 1.4,
            }}
          >
            {content.tagline}
          </div>
        </div>

        {/* Bottom accent line */}
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
      </div>
    ),
    {
      ...size,
    }
  );
}
