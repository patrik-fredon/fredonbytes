"use client";

import { motion, type Variants } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { useState, memo } from "react";

import { useIntersectionObserver } from "@/app/hooks/useIntersectionObserver";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import type { Project } from "@/app/lib/supabase";

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

const ProjectCard = memo(function ProjectCard({
  project,
  index,
  onOpenModal,
}: ProjectCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { ref, isIntersecting } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: "50px",
    triggerOnce: true,
  });
  const [imageError, setImageError] = useState(false);

  // Get current locale from URL or default to 'en'
  const locale = (
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("lang") || "en"
      : "en"
  ) as "en" | "cs" | "de";

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
      className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpenModal?.(project);
        }
      }}
      aria-label={`View details for ${title}`}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden bg-slate-200 dark:bg-slate-700">
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
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-sm">Image not available</span>
          </div>
        )}

        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Featured
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === "active"
                ? "bg-green-500 text-white"
                : project.status === "completed"
                ? "bg-blue-500 text-white"
                : "bg-slate-500 text-white"
            }`}
          >
            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
          </span>
        </div>

        {/* Overlay with Links */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          {project.live_demo_link && (
            <a
              href={project.live_demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
              aria-label="View live demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
          {project.github_link && (
            <a
              href={project.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 hover:scale-110 transition-transform"
              aria-label="View on GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="bg-white dark:bg-slate-700 px-2 py-1 rounded-md text-xs text-slate-700 dark:text-slate-300"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="bg-white dark:bg-slate-700 px-2 py-1 rounded-md text-xs text-slate-700 dark:text-slate-300">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
});

ProjectCard.displayName = "ProjectCard";

export default ProjectCard;
