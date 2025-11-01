/**
 * TeamMemberCard Component
 *
 * Displays an individual team member's profile card with photo, name,
 * position, motto, and professional summary.
 *
 * Features:
 * - Dev-themed GlassCard design with terminal aesthetic
 * - Photo display with fallback placeholder
 * - Hover effects with glow animation
 * - Framer Motion transitions
 * - AAA WCAG accessibility compliance
 * - Responsive design
 *
 * @module components/about/TeamMemberCard
 */

"use client";

import { motion, type Variants } from "framer-motion";
import { User } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import GlassCard from "@/components/dev-ui/GlassCard";
import type { TeamMember } from "@/lib/types/about";

interface TeamMemberCardProps {
  member: TeamMember;
  index?: number;
}

export default function TeamMemberCard({
  member,
  index = 0,
}: TeamMemberCardProps) {
  const [imageError, setImageError] = useState(false);

  // Animation variants
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  // Alternate glow colors for visual variety
  const glowColor = index % 2 === 0 ? "cyan" : "purple";

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-label={`${member.name} - ${member.position}`}
      tabIndex={0}
      className="h-full"
    >
      <GlassCard variant="card" glowColor={glowColor} className="h-full">
        <div className="flex flex-col items-center space-y-4">
          {/* Team Member Photo */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-terminal-darker ring-2 ring-neon-cyan/30 group-hover:ring-neon-cyan/60 transition-all duration-300">
            {!imageError && member.photo ? (
              <Image
                src={member.photo}
                alt={`${member.name} - ${member.position}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
                quality={90}
                sizes="(max-width: 640px) 112px, (max-width: 1024px) 128px, 128px"
                onError={() => setImageError(true)}
              />
            ) : (
              // Placeholder fallback for missing/failed images
              <div
                className="w-full h-full bg-gradient-to-br from-terminal-dark to-terminal-darker flex items-center justify-center"
                aria-label="Team member photo placeholder"
              >
                <User
                  className="w-14 h-14 sm:w-16 sm:h-16 text-neon-cyan/50"
                  aria-hidden="true"
                />
              </div>
            )}
          </div>

          {/* Team Member Name */}
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-neon-cyan font-mono leading-tight">
              {member.name}
            </h3>

            {/* Position */}
            <p className="text-neon-purple text-sm font-medium font-mono leading-tight">
              <span className="text-slate-500">$</span> {member.position}
            </p>
          </div>

          {/* Motto (if provided) */}
          {member.motto && (
            <div className="w-full pt-3 border-t border-neon-cyan/10">
              <p className="text-slate-300 text-xs sm:text-sm italic text-center leading-relaxed font-mono">
                <span className="text-neon-cyan/50">&ldquo;</span>
                {member.motto}
                <span className="text-neon-cyan/50">&rdquo;</span>
              </p>
            </div>
          )}

          {/* Professional Summary */}
          <div className="w-full pt-3 border-t border-neon-purple/10">
            <p className="text-slate-400 text-xs sm:text-sm text-center leading-relaxed font-mono">
              {member.summary}
            </p>
          </div>

          {/* Decorative Code Element */}
          <div className="w-full pt-2">
            <code className="text-xs text-slate-500 font-mono block text-center">
              <span className="text-neon-cyan/30">{"{ "}active: true{" }"}</span>
            </code>
          </div>
        </div>
      </GlassCard>
    </motion.article>
  );
}
