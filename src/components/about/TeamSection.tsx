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
  {
    name: 'Chloe',
    position: 'UI/UX Designer',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/ui-ux-designer-fredonbytes-chloe.avif',
    motto: 'Design is not just what it looks like, design is how it works',
    summary: 'Expert UI/UX designer crafting intuitive and beautiful user experiences that delight customers and drive engagement.',
  },
  {
    name: 'Petra',
    position: 'Technical Support Specialist',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-support-specialist-fredonbytes-petra.avif',
    motto: 'Every problem has a solution, you just need to find it',
    summary: 'Dedicated technical support specialist ensuring clients receive exceptional service and swift resolution to any technical challenges.',
  },
  {
    name: 'Levi',
    position: 'Technical Lead',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-lead-fredonbytes-levi.avif',
    motto: 'Leadership is about empowering others to achieve greatness',
    summary: 'Experienced technical lead guiding development teams to deliver high-quality solutions through best practices and mentorship.',
  },
  {
    name: 'David',
    position: 'Technical Director',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/technical-director-fredonbytes-david.avif',
    motto: 'Innovation distinguishes between a leader and a follower',
    summary: 'Visionary technical director steering FredonBytes toward cutting-edge technologies and innovative solutions that exceed client expectations.',
  },
  {
    name: 'Petr',
    position: 'Systems Engineer',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/systems-engineer-fredonbytes-petr.avif',
    motto: 'Building robust systems that stand the test of time',
    summary: 'Skilled systems engineer architecting reliable infrastructure and maintaining optimal performance across all FredonBytes platforms.',
  },
  {
    name: 'Thomas',
    position: 'Systems Analyst',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/systems-analyst-fredonbytes-thomas.avif',
    motto: 'Understanding systems is the key to improving them',
    summary: 'Detail-oriented systems analyst optimizing workflows and identifying opportunities for efficiency gains across the organization.',
  },
  {
    name: 'Andrea',
    position: 'Site Reliability Engineer',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/site-reliability-engineer-fredonbytes-andrea.avif',
    motto: 'Reliability is not just a feature, it\'s a promise',
    summary: 'Expert SRE ensuring maximum uptime and reliability for all client applications through proactive monitoring and incident response.',
  },
  {
    name: 'Jess',
    position: 'Scrum Master',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/scrum-master-fredonbytes-jess.avif',
    motto: 'Great teams are built on trust and collaboration',
    summary: 'Experienced Scrum Master facilitating agile practices and fostering team collaboration to deliver value continuously.',
  },
  {
    name: 'Matthew',
    position: 'QA Tester',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/qa-tester-fredonbytes-matthew.avif',
    motto: 'Quality is never an accident; it is always the result of effort',
    summary: 'Meticulous QA tester ensuring every release meets the highest standards of quality and reliability before reaching production.',
  },
  {
    name: 'Michal',
    position: 'IT Project Manager',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/it-project-manager-fredonbytes-michal.avif',
    motto: 'Success is the result of clear vision and precise execution',
    summary: 'Strategic project manager orchestrating complex IT initiatives and ensuring seamless delivery aligned with business objectives.',
  },
  {
    name: 'Ella',
    position: 'Infrastructure Engineer',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/infrastructure-engineer-fredonbytes-ella.avif',
    motto: 'Strong foundations build powerful solutions',
    summary: 'Infrastructure engineer designing and maintaining scalable, secure infrastructure that powers FredonBytes\' digital solutions.',
  },
  {
    name: 'Olive',
    position: 'HR & Client Acquisition',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/hr-client-acquisition-fredonbytes-olive.avif',
    motto: 'People are the heart of every great company',
    summary: 'HR specialist and client acquisition expert building relationships and attracting top talent to grow FredonBytes\' impact.',
  },
  {
    name: 'Emily',
    position: 'Embedded Systems Engineer',
    photo: 'https://ihvltxbaodpqgbnwfxdd.supabase.co/storage/v1/object/public/fredonbytes/embedded-systems-engineer-fredonbytes-emily.avif',
    motto: 'Hardware and software unite to create magic',
    summary: 'Embedded systems engineer developing innovative IoT solutions and bridging the gap between hardware and software.',
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
