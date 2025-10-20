/**
 * TeamMemberCard Component
 * 
 * Displays an individual team member's profile card with photo, name,
 * position, motto, and professional summary.
 * 
 * @module components/about/TeamMemberCard
 */

'use client';

import type { TeamMember } from '@/lib/types/about';

interface TeamMemberCardProps {
  member: TeamMember;
}

export default function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <article 
      className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 text-center"
      aria-label={`${member.name} - ${member.position}`}
    >
      {/* Placeholder avatar */}
      <div 
        className="w-32 h-32 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4"
        aria-hidden="true"
      />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {member.name}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        {member.position}
      </p>
      {/* Content will be implemented in Phase 5 */}
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Biography placeholder
      </p>
    </article>
  );
}
