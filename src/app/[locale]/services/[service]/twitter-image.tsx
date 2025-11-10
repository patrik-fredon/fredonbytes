import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

/**
 * Service-Specific Twitter Card Image Generator
 *
 * Creates customized Twitter card images for each service page
 */

export const alt = "FredonBytes - Professional Digital Services";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const runtime = "edge";

// Service configurations with localized content
const serviceConfig = {
  development: {
    cs: {
      title: "Vývoj webových aplikací",
      subtitle: "Moderní technologie",
      icon: "💻",
    },
    en: {
      title: "Web Development",
      subtitle: "Modern technology",
      icon: "💻",
    },
    de: {
      title: "Webentwicklung",
      subtitle: "Moderne Technologie",
      icon: "💻",
    },
  },
  seo: {
    cs: {
      title: "SEO Optimalizace",
      subtitle: "Prvních místech vyhledávání",
      icon: "📈",
    },
    en: {
      title: "SEO Optimization",
      subtitle: "Rank higher in search",
      icon: "📈",
    },
    de: {
      title: "SEO-Optimierung",
      subtitle: "Höher in der Suche",
      icon: "📈",
    },
  },
  design: {
    cs: {
      title: "UX/UI Design",
      subtitle: "Design, který prodává",
      icon: "🎨",
    },
    en: {
      title: "UX/UI Design",
      subtitle: "Design that converts",
      icon: "🎨",
    },
    de: {
      title: "UX/UI Design",
      subtitle: "Design, das konvertiert",
      icon: "🎨",
    },
  },
  hosting: {
    cs: {
      title: "Web Hosting",
      subtitle: "Rychlý & spolehlivý",
      icon: "☁️",
    },
    en: {
      title: "Web Hosting",
      subtitle: "Fast & reliable",
      icon: "☁️",
    },
    de: {
      title: "Web-Hosting",
      subtitle: "Schnell & zuverlässig",
      icon: "☁️",
    },
  },
  branding: {
    cs: {
      title: "Branding & Identity",
      subtitle: "Silná značka",
      icon: "🎯",
    },
    en: {
      title: "Branding & Identity",
      subtitle: "Strong brand",
      icon: "🎯",
    },
    de: {
      title: "Branding & Identität",
      subtitle: "Starke Marke",
      icon: "🎯",
    },
  },
  consulting: {
    cs: {
      title: "IT Konzultace",
      subtitle: "Expertní poradenství",
      icon: "💡",
    },
    en: {
      title: "IT Consulting",
      subtitle: "Expert guidance",
      icon: "💡",
    },
    de: {
      title: "IT-Beratung",
      subtitle: "Expertenberatung",
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
      subtitle: "Soziale Präsenz aufbauen",
      icon: "📱",
    },
  },
};

export async function generateStaticParams() {
  const services = Object.keys(serviceConfig);
  const params = [];

  for (const locale of routing.locales) {
    for (const service of services) {
      params.push({ locale, service });
    }
  }

  return params;
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; service: string }>;
}) {
  const { locale, service } = await params;
  const serviceData =
    serviceConfig[service as keyof typeof serviceConfig]?.[
      locale as keyof (typeof serviceConfig)[keyof typeof serviceConfig]
    ] ||
    serviceConfig.development.en;

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
          {/* Icon */}
          <div
            style={{
              fontSize: "120px",
              marginBottom: "30px",
            }}
          >
            {serviceData.icon}
          </div>

          {/* Title */}
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

          {/* Subtitle */}
          <div
            style={{
              fontSize: "36px",
              fontWeight: "600",
              background:
                "linear-gradient(90deg, #00D9FF 0%, #FFFFFF 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textAlign: "center",
            }}
          >
            {serviceData.subtitle}
          </div>
        </div>

        {/* Brand badge */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            right: "40px",
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
      </div>
    ),
    {
      ...size,
    }
  );
}
