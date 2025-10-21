/**
 * TeamSection Component
 * 
 * Displays the team member profiles in a responsive grid layout.
 * 
 * Features:
 * - Responsive grid (1 col mobile, 2 tablet, 3 desktop)
 * - Staggered animations using Framer Motion
 * - Integration with TeamMemberCard components
 * - Translation support for section headers
 * - AAA WCAG accessibility
 * 
 * @module components/about/TeamSection
 */

'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import TeamMemberCard from './TeamMemberCard';

// Import team member data
// Note: In production, this data comes from translations
// For now, we'll use a hardcoded structure that matches the translation pattern
const getTeamMembers = (t: ReturnType<typeof useTranslations>) => [
  {
    name: t('about.team.members.patrik.name'),
    position: t('about.team.members.patrik.role'),
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/fullstack-developer-fredon-ceo-co-founder-fredonbytes.avif',
    motto: t('about.team.members.patrik.quote'),
    summary: t('about.team.members.patrik.expertise'),
  },
  {
    name: t('about.team.members.jana.name'),
    position: t('about.team.members.jana.role'),
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/devsecops-engineer-fredonbytes-zoe.avif',
    motto: t('about.team.members.jana.quote'),
    summary: t('about.team.members.jana.expertise'),
  },
  {
    name: t('about.team.members.lucie.name'),
    position: t('about.team.members.lucie.role'),
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/agile-coach-fredonbytes-violet.avif',
    motto: t('about.team.members.lucie.quote'),
    summary: t('about.team.members.lucie.expertise'),
  },
  {
    name: t('about.team.members.tomas.name'),
    position: t('about.team.members.tomas.role'),
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/database-architect-fredonbytes-tony.avif',
    motto: t('about.team.members.tomas.quote'),
    summary: t('about.team.members.tomas.expertise'),
  },
];

export default function TeamSection() {
  const t = useTranslations();
  const teamMembers = getTeamMembers(t);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <section 
      className="mb-20" 
      aria-labelledby="team-heading"
      id="team"
    >
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.h2 
          id="team-heading"
          className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {t('aboutPage.team.title')}
        </motion.h2>
        <motion.p 
          className="text-xl text-slate-600 dark:text-slate-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t('aboutPage.team.subtitle')}
        </motion.p>
      </div>
      
      {/* Team Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        role="list"
        aria-label="Team members"
      >
        {teamMembers.map((member, index) => (
          <div key={index} role="listitem">
            <TeamMemberCard member={member} index={index} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
