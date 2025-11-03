import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

import GridBackground from "@/components/dev-ui/GridBackground";

type Props = {
  params: Promise<{ locale: string }>;
};

import ProjectsGrid from "./ProjectsGrid";
import ProjectsLoadingSkeleton from "./ProjectsLoadingSkeleton";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });

  return {
    title: `${t("title")} | FredonBytes`,
    description: t("subtitle"),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("projects");

  return (
    <main className="min-h-screen relative">
      {/* Grid Background */}
      <div className="absolute inset-0">
        <GridBackground />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 relative z-10">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 font-mono text-terminal-light">
            <span className="text-neon-cyan">//</span> {t("title")}
          </h1>
          <p className="text-xl text-terminal-light/80 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Projects Grid with Suspense */}
        <Suspense fallback={<ProjectsLoadingSkeleton />}>
          <ProjectsGrid />
        </Suspense>
      </div>
    </main>
  );
}
