/**
 * CompanyStory Component
 * 
 * Displays the emotional, inspiring story about Fredon's developer journey
 * and the "All-in-One digital army" concept.
 * 
 * @module components/about/CompanyStory
 */

'use client';

import { useTranslations } from 'next-intl';

export default function CompanyStory() {
  const t = useTranslations('aboutPage.companyStory');

  return (
    <section className="mb-20" aria-labelledby="company-story-title">
      <div className="max-w-4xl mx-auto">
        <h2 
          id="company-story-title"
          className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center"
        >
          {t('title')}
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {/* Content will be implemented in Phase 4 */}
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            Placeholder for company story content...
          </p>
        </div>
      </div>
    </section>
  );
}
