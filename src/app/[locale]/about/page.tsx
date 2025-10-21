import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

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
        <section 
          className="mb-20" 
          aria-labelledby="company-story-heading"
          id="company-story"
        >
          <div className="max-w-4xl mx-auto">
            <h2 
              id="company-story-heading"
              className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center"
            >
              Our Story: The Birth of the Digital Army
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                In the ever-evolving landscape of technology, one developer saw a pattern: 
                businesses were drowning in vendor fragmentation, jumping between agencies for 
                development, design, marketing, and support. Each handoff meant lost context, 
                delayed timelines, and diluted vision.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                What started as Fredon's personal mission to eliminate this chaos became 
                FredonBytes—a unified force where code, creativity, and strategy converge. 
                We're not just another agency; we're your all-in-one digital army, engineered 
                to deliver seamless, high-impact results without the complexity.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section 
          className="mb-20" 
          aria-labelledby="team-heading"
          id="team"
        >
          <div className="text-center mb-12">
            <h2 
              id="team-heading"
              className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Meet Our Team
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              The digital army behind your success
            </p>
          </div>
          
          {/* Team grid - Will be populated with TeamMemberCard components in Phase 5 */}
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
            role="list"
          >
            <div 
              className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 text-center"
              role="listitem"
            >
              <div 
                className="w-32 h-32 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Team Member
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-4">Position</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Biography placeholder
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
