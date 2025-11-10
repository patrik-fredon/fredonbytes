import type { Metadata } from "next";
import type { ComponentType } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { generateBreadcrumbSchema } from "@/lib/jsonLd/breadcrumb";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/common/Button";

export interface FeatureConfig {
  key: string;
  icon: ComponentType<{ className?: string }>;
  iconColor: string;
  hoverBorder: string;
}

export interface ServiceConfig {
  slug: string;
  namespace: string;
  keywords: string;
  icon: ComponentType<{ className?: string }>;
  iconBgClass: string;
  iconColorClass: string;
  features: FeatureConfig[];
  ctaHeadline: string;
}

export async function generateServiceMetadata(
  params: Promise<{ locale: string }>,
  config: ServiceConfig
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: config.namespace });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const localePrefix = locale === "cs" ? "" : `/${locale}`;
  const pageUrl = `${baseUrl}${localePrefix}/services/${config.slug}`;

  return {
    title: t("title"),
    description: t("description"),
    keywords: config.keywords,
    alternates: {
      canonical: pageUrl,
      languages: {
        cs: `${baseUrl}/cs/services/${config.slug}`,
        en: `${baseUrl}/en/services/${config.slug}`,
        de: `${baseUrl}/de/services/${config.slug}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: pageUrl,
      siteName: "FredonBytes",
      locale: locale === "cs" ? "cs_CZ" : locale === "de" ? "de_DE" : "en_US",
      type: "website",
      images: [
        {
          url: `${baseUrl}/fredonbytes-logo-with-background.png`,
          secureUrl: `${baseUrl}/fredonbytes-logo-with-background.png`,
          width: 1200,
          height: 630,
          alt: `FredonBytes ${t("title")}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      creator: "@FredonBytes",
      images: [`${baseUrl}/fredonbytes-logo-with-background.png`],
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

type Props = {
  params: Promise<{ locale: string }>;
  config: ServiceConfig;
};

export default async function ServicePageTemplate({ params, config }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });
  const ts = await getTranslations({ locale, namespace: config.namespace });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: t("breadcrumb.home"), url: `/${locale}` },
      { name: t("breadcrumb.services"), url: `/${locale}/services` },
      { name: ts("title"), url: `/${locale}/services/${config.slug}` },
    ],
    baseUrl
  );

  const IconComponent = config.icon;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="min-h-screen pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-lg ${config.iconBgClass} border ${config.iconColorClass.replace("text-", "border-")}/20 mb-6`}
              >
                <IconComponent className={`w-8 h-8 ${config.iconColorClass}`} />
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 font-mono">
                {ts("title")}
              </h1>

              <p className="text-xl text-terminal-light/80 mb-4 font-mono">
                {ts("subtitle")}
              </p>

              <p className="text-lg text-terminal-light/70 max-w-3xl mx-auto">
                {ts("description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {config.features.map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <div
                    key={feature.key}
                    className={`border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass ${feature.hoverBorder} transition-all`}
                  >
                    <FeatureIcon className={`w-10 h-10 ${feature.iconColor} mb-4`} />
                    <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                      {ts(`features.${feature.key}.title`)}
                    </h3>
                    <p className="text-terminal-light/70">
                      {ts(`features.${feature.key}.description`)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="text-center border-t border-slate-800/50 pt-12">
              <h2 className="text-2xl font-bold text-terminal-light mb-6 font-mono">
                {config.ctaHeadline}
              </h2>
              <Link href="/contact">
                <Button variant="gradient" size="xl" className="font-mono">
                  {ts("cta")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
