import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import CompanyStory from '@/components/about/CompanyStory';
import TeamSection from '@/components/about/TeamSection';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aboutPage.meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        {/* Page Header */}
        <header className="text-center mb-16" role="banner">
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6">
            About{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FredonBytes
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Discover the story behind FredonBytes and meet the team building your digital future.
          </p>
        </header>

        {/* Company Story Section */}
        <CompanyStory />

        {/* Team Section */}
        <TeamSection />
      </div>
    </main>
  );
}
