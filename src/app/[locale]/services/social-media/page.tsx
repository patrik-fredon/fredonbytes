import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Share2, MessageCircle, TrendingUp, PieChart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/common/Button";
import { generateBreadcrumbSchema } from "@/lib/jsonLd/breadcrumb";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.socialMedia" });
  return {
    title: t("title"),
    description: t("description"),
    keywords: "social media management brno, správa sociálních sítí, instagram facebook linkedin, social media marketing, tvorba obsahu",
  };
}

export default async function SocialMediaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "services" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://fredonbytes.cz";
  const breadcrumb = generateBreadcrumbSchema([
    { name: t("breadcrumb.home"), url: `/${locale}` },
    { name: t("breadcrumb.services"), url: `/${locale}/services` },
    { name: "Social Media", url: `/${locale}/services/social-media` },
  ], baseUrl);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <div className="min-h-screen pt-24 pb-16 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-lg bg-neon-purple/10 border border-neon-purple/20 mb-6">
                <Share2 className="w-8 h-8 text-neon-purple" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-terminal-light mb-6 font-mono">{t("socialMedia.title")}</h1>
              <p className="text-xl text-terminal-light/80 mb-4 font-mono">{t("socialMedia.subtitle")}</p>
              <p className="text-lg text-terminal-light/70 max-w-3xl mx-auto">{t("socialMedia.description")}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <Share2 className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("socialMedia.features.content.title")}</h3>
                <p className="text-terminal-light/70">{t("socialMedia.features.content.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <MessageCircle className="w-10 h-10 text-neon-purple mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("socialMedia.features.management.title")}</h3>
                <p className="text-terminal-light/70">{t("socialMedia.features.management.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-cyan/40 transition-all">
                <TrendingUp className="w-10 h-10 text-neon-cyan mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("socialMedia.features.ads.title")}</h3>
                <p className="text-terminal-light/70">{t("socialMedia.features.ads.description")}</p>
              </div>
              <div className="border border-slate-800/50 rounded-lg p-6 bg-glass-bg backdrop-blur-glass hover:border-neon-purple/40 transition-all">
                <PieChart className="w-10 h-10 text-code-green mb-4" />
                <h3 className="text-xl font-bold text-terminal-light mb-2 font-mono">{t("socialMedia.features.analytics.title")}</h3>
                <p className="text-terminal-light/70">{t("socialMedia.features.analytics.description")}</p>
              </div>
            </div>
            <div className="text-center border-t border-slate-800/50 pt-12">
              <h2 className="text-2xl font-bold text-terminal-light mb-6 font-mono">Zvyšte svou online přítomnost</h2>
              <Link href="/contact"><Button variant="gradient" size="xl" className="font-mono">{t("socialMedia.cta")}</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
