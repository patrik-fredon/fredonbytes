import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Suspense } from "react";

type Props = {
  params: Promise<{ locale: string }>;
};

import ProjectsGrid from "./ProjectsGrid";
import ProjectsLoadingSkeleton from "./ProjectsLoadingSkeleton";

export const metadata: Metadata = {
  title: "Projects | FredonBytes",
  description:
    "Explore our portfolio of successful projects across web development, mobile applications, and cloud infrastructure.",
};

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Page Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Explore our portfolio of successful projects. From enterprise
            applications to innovative startups, we deliver solutions that drive
            results.
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
