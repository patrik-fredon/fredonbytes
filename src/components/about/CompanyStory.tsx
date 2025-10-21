/**
 * CompanyStory Component
 * 
 * Displays the emotional, inspiring story about Fredon's developer journey
 * and the "All-in-One digital army" concept.
 * 
 * Features:
 * - Emotional narrative with multiple paragraphs
 * - Framer Motion entrance animations with stagger effects
 * - AAA WCAG accessibility compliance
 * - Responsive typography and spacing
 * - Dark mode support
 * 
 * @module components/about/CompanyStory
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function CompanyStory() {
  const t = useTranslations('aboutPage.companyStory');
  
  // Get content array from translations
  const contentParagraphs = [
    t('content.0'),
    t('content.1'),
    t('content.2'),
    t('content.3'),
    t('content.4'),
    t('content.5'),
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
      },
    },
  };

  const missionVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
        delay: 0.8,
      },
    },
  };

  return (
    <section 
      className="mb-20" 
      aria-labelledby="company-story-title"
      id="company-story"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2 
          id="company-story-title"
          className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {t('title')}
        </motion.h2>

        {/* Story Content with Staggered Animation */}
        <motion.div 
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {contentParagraphs.map((paragraph, index) => (
            <motion.p
              key={index}
              variants={itemVariants}
              className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
            >
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* Mission Statement with Special Emphasis */}
        <motion.div
          className="mt-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-blue-100 dark:border-slate-600"
          variants={missionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 text-center">
            Our Mission
          </h3>
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed text-center italic">
            &ldquo;{t('mission')}&rdquo;
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4 text-center">
            — {t('founder')}, Founder
          </p>
        </motion.div>
      </div>
    </section>
  );
}
