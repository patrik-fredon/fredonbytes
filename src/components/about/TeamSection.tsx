/**
 * TeamSection Component
 *
 * Displays the team member profiles in a responsive grid layout.
 * All team member data comes from translation files.
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 tablet, 3 desktop)
 * - Staggered animations using Framer Motion
 * - Integration with TeamMemberCard components
 * - Full internationalization support
 * - AAA WCAG accessibility
 *
 * @module components/about/TeamSection
 */

"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

import TeamMemberCard from "./TeamMemberCard";

// Photo URLs mapping (static assets)
const TEAM_PHOTOS: Record<string, string> = {
  patrik:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/fullstack-developer-fredon-ceo-co-founder-fredonbytes.avif",
  jana: "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/devsecops-engineer-fredonbytes-zoe.avif",
  lucie:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/agile-coach-fredonbytes-violet.avif",
  tomas:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/database-architect-fredonbytes-tony.avif",
  chloe:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/ui-ux-designer-fredonbytes-chloe.avif",
  petra:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-support-specialist-fredonbytes-petra.avif",
  levi: "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-lead-fredonbytes-levi.avif",
  david:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-director-fredonbytes-david.avif",
  petr: "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/systems-engineer-fredonbytes-petr.avif",
  thomas:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/systems-analyst-fredonbytes-thomas.avif",
  andrea:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/site-reliability-engineer-fredonbytes-andrea.avif",
  jess: "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/software-architect-fredonbytes-mia.avif",
  matthew:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/qa-tester-fredonbytes-matthew.avif",
  michal:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/it-project-manager-fredonbytes-michal.avif",
  ella: "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/infrastructure-engineer-fredonbytes-ella.avif",
  olive:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/hr-client-acquisition-fredonbytes-olive.avif",
  emily:
    "https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/it-consultant-fredonbytes-simona.avif",
};

// Team member IDs in display order
const TEAM_MEMBER_IDS = [
  "patrik",
  "jana",
  "lucie",
  "tomas",
  "petra",
  "david",
  "petr",
  "thomas",
  "levi",
  "jess",
  "ella",
  "matthew",
  "michal",
  "olive",
  "emily",
];

export default function TeamSection() {
  const t = useTranslations();

  // Build team members from translations
  const teamMembers = TEAM_MEMBER_IDS.map((id) => ({
    name: t(`about.team.members.${id}.name`),
    position: t(`about.team.members.${id}.role`),
    photo: TEAM_PHOTOS[id],
    motto: t(`about.team.members.${id}.quote`),
    summary: t(`about.team.members.${id}.expertise`),
  }));

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
    <section className="mb-16 sm:mb-20" aria-labelledby="team-heading" id="team">
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
        <motion.h2
          id="team-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 leading-tight"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          {t("aboutPage.team.title")}
        </motion.h2>
        <motion.p
          className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("aboutPage.team.subtitle")}
        </motion.p>
      </div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        role="list"
        aria-label="Team members"
      >
        {teamMembers.map((member, index) => (
          <div key={TEAM_MEMBER_IDS[index]} role="listitem">
            <TeamMemberCard member={member} index={index} />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
