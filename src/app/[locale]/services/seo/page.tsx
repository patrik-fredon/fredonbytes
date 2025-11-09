import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Search, TrendingUp, MapPin, BarChart3 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/common/Button";
import { generateBreadcrumbSchema } from "@/lib/jsonLd/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.seo" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: "seo optimalizace brno praha, seo služby, google ranking, seznam.cz optimalizace, lokální seo, link building",
  };
}

export default async function SEOPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const breadcrumb = generateBreadcrumbSchema([
    { name: t("breadcrumb.home"), url: `/${locale}` },
    { name: t("breadcrumb.services"), url: `/${locale}/services` },
    { name: "SEO", url: `/${locale}/services/seo` },
  ], baseUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="min-h-screen pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
                <Search className="w-8 h-8 text-neon-cyan" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 font-mono">{t("seo.title")}</h1>
              <p className="text-xl text-terminal-light/80 mb-4 font-mono">{t("seo.subtitle")}</p>
              <p className="text-lg text-terminal-light/70 max-w-3xl mx-auto">{t("seo.description")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <TrendingUp className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("seo.features.technical.title")}</h3>
                <p className="text-terminal-light/70">{t("seo.features.technical.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <Search className="w-10 h-10 text-neon-purple mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("seo.features.content.title")}</h3>
                <p className="text-terminal-light/70">{t("seo.features.content.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <MapPin className="w-10 h-10 text-neon-cyan mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("seo.features.local.title")}</h3>
                <p className="text-terminal-light/70">{t("seo.features.local.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <BarChart3 className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("seo.features.reporting.title")}</h3>
                <p className="text-terminal-light/70">{t("seo.features.reporting.description")}</p>
              </div>
            </div>
            <div className="text-center border-t border-slate-800/50 pt-12">
              <h2 className="text-2xl font-bold text-terminal-light mb-6 font-mono">Připraveni na TOP rankings?</h2>
              <Link href="/contact"><Button variant="gradient" size="xl" className="font-mono">{t("seo.cta")}</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
