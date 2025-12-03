/**
 * TeamSection Component
 *
 * Displays the team member profiles in a responsive grid layout.
 * All team member data comes from translation files.
 *
 * Features:
 * - Responsive grid (1 col mobile, 2 tablet, 3 desktop)
 * - CSS staggered animations (zero JS, better performance)
 * - Integration with TeamMemberCard components
 * - Full internationalization support
 * - AAA WCAG accessibility
 *
 * @module components/about/TeamSection
 */

import { getTranslations } from "next-intl/server";

import TeamMemberCard from "./TeamMemberCard";

interface TeamSectionProps {
  locale: string;
}

// Photo URLs mapping (static assets)
const TEAM_PHOTOS: Record<string, string> = {
  patrik:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/fullstack-developer-fredon-ceo-co-founder-fredonbytes.avif",
  jana: "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/devsecops-engineer-fredonbytes-zoe.avif",
  lucie:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/agile-coach-fredonbytes-violet.avif",
  tomas:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/database-architect-fredonbytes-tony.avif",
  chloe:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/ui-ux-designer-fredonbytes-chloe.avif",
  petra:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/technical-support-specialist-fredonbytes-petra.avif",
  levi: "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/technical-lead-fredonbytes-levi.avif",
  david:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/technical-director-fredonbytes-david.avif",
  petr: "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/systems-engineer-fredonbytes-petr.avif",
  thomas:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/systems-analyst-fredonbytes-thomas.avif",
  andrea:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/site-reliability-engineer-fredonbytes-andrea.avif",
  jess: "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/software-architect-fredonbytes-mia.avif",
  matthew:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/qa-tester-fredonbytes-matthew.avif",
  michal:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/it-project-manager-fredonbytes-michal.avif",
  ella: "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/infrastructure-engineer-fredonbytes-ella.avif",
  olive:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/hr-client-acquisition-fredonbytes-olive.avif",
  emily:
    "https://db.fredonbytes.eu/storage/v1/object/public/fredonbytes/about/team/it-consultant-fredonbytes-simona.avif",
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

export default async function TeamSection({ locale }: TeamSectionProps) {
  const t = await getTranslations({ locale });

  // Build team members from translations
  const teamMembers = TEAM_MEMBER_IDS.map((id) => ({
    name: t(`about.team.members.${id}.name`),
    position: t(`about.team.members.${id}.role`),
    photo: TEAM_PHOTOS[id],
    motto: t(`about.team.members.${id}.quote`),
    summary: t(`about.team.members.${id}.expertise`),
  }));

  return (
    <section
      className="mb-16 sm:mb-20 "
      aria-labelledby="team-heading"
      id="team"
    >
      {/* Section Header */}
      <div className="text-center mb-8 sm:mb-12 px-4 sm:px-0">
        <h2
          id="team-heading"
          className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight font-mono animate-fade-in-down"
        >
          <span className="text-neon-cyan">{"<"}</span>
          {t("aboutPage.team.title")}
          <span className="text-neon-cyan">{" />"}</span>
        </h2>
        <p
          className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-mono animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          <span className="text-neon-purple/50">// </span>
          {t("aboutPage.team.subtitle")}
        </p>
      </div>

      {/* Team Grid - CSS stagger with nth-child */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4 sm:px-0 "
        role="list"
        aria-label="Team members"
      >
        {teamMembers.map((member, index) => (
          <div
            key={TEAM_MEMBER_IDS[index]}
            role="listitem"
            className="animate-fade-in-up"
            style={{
              animationDelay: `${index * 100 + 200}ms`,
            }}
          >
            <TeamMemberCard member={member} locale={locale} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}
