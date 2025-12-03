import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

/**
 * Service-Specific Open Graph Image Generator
 *
 * Creates customized OG images for each service page with:
 * ✓ Service-specific titles and descriptions
 * ✓ Localized content
 * ✓ Enhanced visual hierarchy
 * ✓ Service icons/indicators
 */

export const alt = "FredonBytes - Professional Digital Services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Service configurations with localized content
const serviceConfig = {
  development: {
    cs: {
      title: "Vývoj webových aplikací",
      subtitle: "Moderní technologie pro váš byznys",
      icon: "💻",
    },
    en: {
      title: "Web Development",
      subtitle: "Modern technology for your business",
      icon: "💻",
    },
    de: {
      title: "Webentwicklung",
      subtitle: "Moderne Technologie für Ihr Unternehmen",
      icon: "💻",
    },
  },
  seo: {
    cs: {
      title: "SEO Optimalizace",
      subtitle: "Buďte vidět na prvních místech",
      icon: "📈",
    },
    en: {
      title: "SEO Optimization",
      subtitle: "Rank higher in search results",
      icon: "📈",
    },
    de: {
      title: "SEO-Optimierung",
      subtitle: "Höher in Suchergebnissen ranken",
      icon: "📈",
    },
  },
  design: {
    cs: {
      title: "UX/UI Design",
      subtitle: "Krásný design, který prodává",
      icon: "🎨",
    },
    en: {
      title: "UX/UI Design",
      subtitle: "Beautiful design that converts",
      icon: "🎨",
    },
    de: {
      title: "UX/UI Design",
      subtitle: "Schönes Design, das konvertiert",
      icon: "🎨",
    },
  },
  hosting: {
    cs: {
      title: "Web Hosting",
      subtitle: "Rychlý a spolehlivý hosting",
      icon: "☁️",
    },
    en: {
      title: "Web Hosting",
      subtitle: "Fast and reliable hosting",
      icon: "☁️",
    },
    de: {
      title: "Web-Hosting",
      subtitle: "Schnelles und zuverlässiges Hosting",
      icon: "☁️",
    },
  },
  branding: {
    cs: {
      title: "Branding & Identity",
      subtitle: "Vytvořte silnou značku",
      icon: "🎯",
    },
    en: {
      title: "Branding & Identity",
      subtitle: "Build a strong brand",
      icon: "🎯",
    },
    de: {
      title: "Branding & Identität",
      subtitle: "Bauen Sie eine starke Marke auf",
      icon: "🎯",
    },
  },
  consulting: {
    cs: {
      title: "IT Konzultace",
      subtitle: "Expertní poradenství pro váš projekt",
      icon: "💡",
    },
    en: {
      title: "IT Consulting",
      subtitle: "Expert guidance for your project",
      icon: "💡",
    },
    de: {
      title: "IT-Beratung",
      subtitle: "Expertenberatung für Ihr Projekt",
      icon: "💡",
    },
  },
  "social-media": {
    cs: {
      title: "Social Media Marketing",
      subtitle: "Rostěte na sociálních sítích",
      icon: "📱",
    },
    en: {
      title: "Social Media Marketing",
      subtitle: "Grow your social presence",
      icon: "📱",
    },
    de: {
      title: "Social Media Marketing",
      subtitle: "Wachsen Sie in sozialen Medien",
      icon: "📱",
    },
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service } = await params;
  const serviceData =
    serviceConfig[service as keyof typeof serviceConfig]?.[
      locale as keyof (typeof serviceConfig)[keyof typeof serviceConfig]
    ] || serviceConfig.development.en;

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0E27",
        backgroundImage:
          "linear-gradient(135deg, #0A0E27 0%, #1a1f3a 50%, #0A0E27 100%)",
        position: "relative",
      }}
    >
      {/* Gradient orbs */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-5%",
          width: "40%",
          height: "40%",
          background:
            "radial-gradient(circle, rgba(0, 217, 255, 0.2) 0%, transparent 70%)",
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
            "radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
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
        {/* Service Icon */}
        <div
          style={{
            fontSize: "120px",
            marginBottom: "30px",
          }}
        >
          {serviceData.icon}
        </div>

        {/* Service Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: "20px",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          {serviceData.title}
        </div>

        {/* Service Subtitle */}
        <div
          style={{
            fontSize: "36px",
            fontWeight: "600",
            background: "linear-gradient(90deg, #00D9FF 0%, #FFFFFF 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          {serviceData.subtitle}
        </div>

        {/* Brand */}
        <div
          style={{
            fontSize: "32px",
            color: "#94A3B8",
            textAlign: "center",
          }}
        >
          FredonBytes
        </div>
      </div>

      {/* Accent bar */}
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
    </div>,
    {
      ...size,
    },
  );
}
