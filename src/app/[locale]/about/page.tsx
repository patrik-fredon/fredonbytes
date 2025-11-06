import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import CompanyStory from "@/components/about/CompanyStory";
import TeamSection from "@/components/about/TeamSection";
import GridBackground from "@/components/dev-ui/GridBackground";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage.meta" });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://fredonbytes.cz";
  const pageUrl = `${siteUrl}/${locale}/about`;

  return {
    title: t("title"),
    description: t("description"),
    keywords:
      "about fredonbytes, digital transformation, IT company, software development team, Brno tech, Czech Republic technology, full-stack development, digital agency",
    authors: [{ name: "FredonBytes Team" }],
    creator: "FredonBytes",
    publisher: "FredonBytes",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${siteUrl}/cs/about`,
        en: `${siteUrl}/en/about`,
        de: `${siteUrl}/de/about`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: "FredonBytes",
      locale,
      type: "website",
      images: [
        {
          url: `${siteUrl}/fredonbytes-logo-with-background.png`,
          width: 1200,
          height: 630,
          alt: "FredonBytes - Your All-in-One Digital Army",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@FredonBytes",
      images: [`${siteUrl}/fredonbytes-logo-with-background.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// ISR configuration - revalidate every 7 days
export const revalidate = 604800; // 7 days in seconds

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const metaT = await getTranslations({ locale, namespace: "aboutPage.meta" });
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Organization",
      name: "FredonBytes",
      url: "https://fredonbytes.cz",
      logo: "https://fredonbytes.cz/fredonbytes-logo-with-background.png",
      description: metaT("description"),
      foundingDate: "2023",
      founder: {
        "@type": "Person",
        name: "Patrik Fredon",
        jobTitle: "CEO & Founder",
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Brno",
        addressCountry: "CZ",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+420799027984",
        contactType: "customer service",
        email: "info@fredonbytes.cz",
      },
      sameAs: [
        "https://github.com/FredonBytes",
        "https://github.com/patrik-fredon",
        "https://linkedin.com/company/fredonbytes",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="min-h-screen  relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
          {/* Page Header */}
          <div className="text-center mb-12 sm:mb-16 lg:mb-20" role="banner">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight font-mono text-terminal-light">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed px-4 font-mono">
              {metaT("description")}
            </p>
          </div>

          {/* Company Story Section */}
          <CompanyStory locale={locale} />

          {/* Team Section */}
          <TeamSection locale={locale} />
        </div>
      </section>
    </>
  );
}
