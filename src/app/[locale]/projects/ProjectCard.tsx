"use client";

import { motion, type Variants } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState, memo } from "react";

import  TerminalWindow  from "@/components/dev-ui/TerminalWindow";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { Project } from "@/lib/supabase";

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal?: (project: Project) => void;
}

// Define animation variants outside component to prevent recreation
const createCardVariants = (
  prefersReducedMotion: boolean,
  index: number
): Variants => ({
  hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReducedMotion ? 0 : 0.5,
      delay: prefersReducedMotion ? 0 : index * 0.1,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
});

const createHoverVariants = (prefersReducedMotion: boolean) =>
  prefersReducedMotion
    ? {}
    : {
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1] as const,
      },
    };

const ProjectCard = memo(
  ({ project, index, onOpenModal }: ProjectCardProps) => {
    const prefersReducedMotion = useReducedMotion();
    const { ref, isIntersecting } = useIntersectionObserver({
      threshold: 0.1,
      rootMargin: "50px",
      triggerOnce: true,
    });
    const [imageError, setImageError] = useState(false);
    const locale = useLocale() as "en" | "cs" | "de";
    const t = useTranslations('projects');

    // Get localized content
    const title = project.title[locale] || project.title.en;
    const description =
      project.short_description?.[locale] ||
      project.description[locale] ||
      project.description.en;

    // Use memoized animation variants
    const cardVariants = createCardVariants(prefersReducedMotion, index);
    const hoverVariants = createHoverVariants(prefersReducedMotion);

    const handleCardClick = (e: React.MouseEvent) => {
      // Don't open modal if clicking on links
      const target = e.target as HTMLElement;
      if (target.tagName === "A" || target.closest("a")) {
        return;
      }
      onOpenModal?.(project);
    };

    return (
      <motion.div
        ref={ref}
        variants={cardVariants}
        initial="hidden"
        animate={isIntersecting ? "visible" : "hidden"}
        whileHover={hoverVariants}
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpenModal?.(project);
          }
        }}
        aria-label={`View details for ${title}`}
        className="cursor-pointer"
      >
        <TerminalWindow title={title} className="h-full hover:shadow-glow-cyan-intense transition-shadow duration-300">
          {/* Project Image */}
          <div className="relative h-48 overflow-hidden bg-terminal-dark border-b border-neon-cyan/20">
            {!imageError ? (
              <Image
                src={project.image_url}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                loading={index < 3 ? "eager" : "lazy"}
                priority={index < 3}
                quality={80}
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-mono">
                <span className="text-sm">// Image not available</span>
              </div>
            )}

            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-neon-cyan to-electric-purple text-white px-3 py-1 rounded-full text-xs font-mono font-medium shadow-glow-cyan-subtle">
                $ {t('badges.featured')}
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${project.status === "active"
                  ? "bg-code-green/20 text-code-green border-code-green/30 shadow-glow-green-subtle"
                  : project.status === "completed"
                    ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 shadow-glow-cyan-subtle"
                    : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                  }`}
              >
                {t(`status.${project.status}` as keyof typeof t)}
              </span>
            </div>

            {/* Overlay with Links */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
              {project.live_demo_link && (
                <a
                  href={project.live_demo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-terminal-dark border-2 border-neon-cyan rounded-full flex items-center justify-center text-neon-cyan hover:scale-110 transition-transform shadow-glow-cyan-intense"
                  aria-label={t('actions.viewLiveDemo')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                </a>
              )}
              {project.github_link && (
                <a
                  href={project.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-terminal-dark border-2 border-electric-purple rounded-full flex items-center justify-center text-electric-purple hover:scale-110 transition-transform shadow-glow-purple-intense"
                  aria-label={t('actions.viewOnGithub')}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                </a>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div className="p-6 bg-terminal-dark">
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors duration-[180ms] font-mono">
              {title}
            </h3>
            <p className="text-slate-400 mb-4 text-sm leading-relaxed line-clamp-3 font-mono">
              {description}
            </p>

            {/* Technologies */}
            <div className="space-y-2">
              <p className="text-neon-cyan text-xs font-mono">// Tech:</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies.slice(0, 4).map((tech, index) => (
                  <span
                    key={index}
                    className="bg-slate-900/80 border border-neon-cyan/30 px-2 py-1 rounded-md text-xs text-slate-300 font-mono"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 4 && (
                  <span className="bg-slate-900/80 border border-neon-cyan/30 px-2 py-1 rounded-md text-xs text-slate-300 font-mono">
                    +{project.technologies.length - 4}
                  </span>
                )}
              </div>
            </div>
          </div>
        </TerminalWindow>
      </motion.div>
    );
  }
);

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
