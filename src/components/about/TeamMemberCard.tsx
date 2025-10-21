/**
 * TeamMemberCard Component
 * 
 * Displays an individual team member's profile card with photo, name,
 * position, motto, and professional summary.
 * 
 * Features:
 * - Photo display with fallback placeholder
 * - Hover effects with scale animation
 * - Framer Motion transitions
 * - AAA WCAG accessibility compliance
 * - Responsive design
 * - Dark mode support
 * 
 * @module components/about/TeamMemberCard
 */

'use client';

import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import type { TeamMember } from '@/lib/types/about';

interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
}

export default function TeamMemberCard({ member, index = 0 }: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.article 
      className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-label={`${member.name} - ${member.position}`}
      tabIndex={0}
    >
      {/* Team Member Photo */}
      <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
        {!imageError && member.photo ? (
          <Image
            src={member.photo}
            alt={`${member.name} - ${member.position}`}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            quality={85}
            sizes="128px"
            onError={() => setImageError(true)}
          />
        ) : (
          // Placeholder fallback for missing/failed images
          <div 
            className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center"
            aria-label="Team member photo placeholder"
          >
            <User className="w-16 h-16 text-slate-400 dark:text-slate-500" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Team Member Name */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">
        {member.name}
      </h3>

      {/* Position */}
      <p className="text-blue-600 dark:text-blue-400 text-sm font-medium text-center mb-3">
        {member.position}
      </p>

      {/* Motto (if provided) */}
      {member.motto && (
        <p className="text-slate-600 dark:text-slate-400 text-sm italic text-center mb-4 min-h-[2.5rem]">
          &ldquo;{member.motto}&rdquo;
        </p>
      )}

      {/* Professional Summary */}
      <p className="text-slate-700 dark:text-slate-300 text-sm text-center leading-relaxed">
        {member.summary}
      </p>
    </motion.article>
  );
}
