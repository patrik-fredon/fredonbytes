import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ComponentType } from "react";
import { Button } from "@/components/common/Button";
import GlassCard from "@/components/dev-ui/GlassCard";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
import { Link } from "@/i18n/navigation";
import { generateBreadcrumbSchema } from "@/lib/jsonLd/breadcrumb";

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
  config: ServiceConfig,
): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: config.namespace });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.eu";
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
          url: `${baseUrl}/FredonBytes_GraphicLogo.png`,
          secureUrl: `${baseUrl}/FredonBytes_GraphicLogo.png`,
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
      images: [`${baseUrl}/FredonBytes_GraphicLogo.png`],
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
  const tcta = await getTranslations({ locale, namespace: "hero.cta" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.eu";

  const breadcrumb = generateBreadcrumbSchema(
    [
      { name: t("breadcrumb.home"), url: `/${locale}` },
      { name: t("breadcrumb.services"), url: `/${locale}/services` },
      { name: ts("title"), url: `/${locale}/services/${config.slug}` },
    ],
    baseUrl,
  );

  const IconComponent = config.icon;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <div className="min-h-screen pt-8 pb-14 relative z-10">
        <TerminalWindow
          title={ts("title")}
          className="w-full mx-auto items-center justify-center max-w-4xl  bg-terminal-darker"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <div className="flex justify-center items-center w-full max-w-3xl  mx-auto m-4 ">
                  <div
                    className={`flex mx-4 items-center justify-center w-20 h-20 rounded-sm ${config.iconBgClass} border ${config.iconColorClass.replace("text-", "border-")}/20 px-2`}
                  >
                    <IconComponent
                      className={`w-18 h-18 ${config.iconColorClass}`}
                    /></div>
                  <div className="flex px-12 text-center  md:text-start  mx-auto">
                    <h1 className="text-2xl sm:text-4xl font-bold text-terminal-light  font-mono">
                      {ts("title")}
                    </h1></div>
                </div>
                <div className="text-center border-t border-neon-purple/20 pt-8 rounded-t-xl"></div>


                <p className="text-xl text-terminal-light/80 mb-4 font-mono">
                  <span className=" text-neon-purple">{'>> '}</span>{ts("subtitle")}
                </p>

                <p className="text-md text-terminal-light/70 max-w-3xl mx-auto">
                  {ts("description")}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-12">

                {config.features.map((feature) => {
                  const FeatureIcon = feature.icon;
                  return (

                    <div
                      key={feature.key}
                      className={`${feature.hoverBorder} transition-all`}
                    >
                      <GlassCard className="p-2 md:p-4 h-full " glowColor="normal">
                        <FeatureIcon
                          className={`w-10 h-10 ${feature.iconColor} mb-4 `}
                        />
                        <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                          {ts(`features.${feature.key}.title`)}
                        </h3>
                        <p className="text-terminal-light/70">
                          {ts(`features.${feature.key}.description`)}
                        </p>

                      </GlassCard>
                    </div>
                  );
                })}

              </div>


              <div className="text-center border-b border-neon-purple/20 pb-8 rounded-b-xl ">
                <h2 className="text-2xl font-bold text-terminal-light mb-6 font-mono">
                  {ts("cta")}
                </h2>
                <Link href="/contact">
                  <Button variant="gradient" size="xl" className="font-mono">
                    {tcta("startProject")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </>
  );
}
