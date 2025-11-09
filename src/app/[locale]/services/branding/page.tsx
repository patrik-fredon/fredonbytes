import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Palette, CheckCircle2, BookOpen, FileText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/common/Button";
import { generateBreadcrumbSchema } from "@/lib/jsonLd/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.branding" });

  return {
    title: t("title"),
    description: t("description"),
    keywords: "branding brno praha, firemní identita, grafický design, tvorba loga, brand manual, marketing materiály",
  };
}

export default async function BrandingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";

  const breadcrumb = generateBreadcrumbSchema([
    { name: t("breadcrumb.home"), url: `/${locale}` },
    { name: t("breadcrumb.services"), url: `/${locale}/services` },
    { name: "Branding", url: `/${locale}/services/branding` },
  ], baseUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="min-h-screen pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">

            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
                <Palette className="w-8 h-8 text-neon-cyan" />
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 font-mono">
                {t("branding.title")}
              </h1>

              <p className="text-xl text-terminal-light/80 mb-4 font-mono">
                {t("branding.subtitle")}
              </p>

              <p className="text-lg text-terminal-light/70 max-w-3xl mx-auto">
                {t("branding.description")}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <CheckCircle2 className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                  {t("branding.features.logo.title")}
                </h3>
                <p className="text-terminal-light/70">
                  {t("branding.features.logo.description")}
                </p>
              </div>

              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <Palette className="w-10 h-10 text-neon-purple mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                  {t("branding.features.identity.title")}
                </h3>
                <p className="text-terminal-light/70">
                  {t("branding.features.identity.description")}
                </p>
              </div>

              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <BookOpen className="w-10 h-10 text-neon-cyan mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                  {t("branding.features.guidelines.title")}
                </h3>
                <p className="text-terminal-light/70">
                  {t("branding.features.guidelines.description")}
                </p>
              </div>

              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <FileText className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">
                  {t("branding.features.materials.title")}
                </h3>
                <p className="text-terminal-light/70">
                  {t("branding.features.materials.description")}
                </p>
              </div>
            </div>

            <div className="text-center border-t border-slate-800/50 pt-12">
              <h2 className="text-2xl font-bold text-terminal-light mb-6 font-mono">
                Vytvořme vaši unikátní značku
              </h2>
              <Link href="/contact">
                <Button variant="gradient" size="xl" className="font-mono">
                  {t("branding.cta")}
                </Button>
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
