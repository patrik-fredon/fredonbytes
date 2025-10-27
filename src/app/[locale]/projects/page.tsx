import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

import ProjectsGrid from "./ProjectsGrid";
import ProjectsLoadingSkeleton from "./ProjectsLoadingSkeleton";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  
  return {
    title: `${t('title')} | FredonBytes`,
    description: t('subtitle'),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('projects');
  
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
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
