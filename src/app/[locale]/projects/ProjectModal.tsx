"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ExternalLink, Github, Tag, X } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getBlurDataURL } from "@/lib/image-utils";
import type { Project } from "@/lib/supabase";

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  isOpen,
  onClose,
}: ProjectModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const locale = useLocale() as "en" | "cs" | "de";
  const t = useTranslations("projects");

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!project) return null;

  // Get localized content
  const title = project.title[locale] || project.title.en;
  const description = project.description[locale] || project.description.en;

  // Format date
  const formattedDate = project.created_at
    ? new Date(project.created_at).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="fixed inset-0 bg-terminal-dark/80 backdrop-blur-md z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
                y: prefersReducedMotion ? 0 : 20,
              }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: prefersReducedMotion ? 1 : 0.95,
                y: prefersReducedMotion ? 0 : 20,
              }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="relative bg-terminal-dark border border-neon-cyan/30 rounded-2xl shadow-glow-cyan-intense max-w-4xl w-full max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-terminal-dark border-2 border-neon-cyan rounded-full flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/10 hover:scale-110 transition-all duration-[180ms] shadow-glow-cyan-intense"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
              </button>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Project Image */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-terminal-dark border-b border-neon-cyan/20">
                  {!imageError ? (
                    <Image
                      src={project.image_url}
                      alt={title}
                      fill
                      className="object-cover"
                      placeholder="blur"
                      blurDataURL={getBlurDataURL(896, 320)}
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 896px"
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-sm font-mono">
                        // Image not available
                      </span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.featured && (
                      <span className="bg-gradient-to-r from-neon-cyan to-electric-purple text-white px-3 py-1 rounded-full text-xs font-mono font-medium shadow-glow-cyan-subtle">
                        $ {t("badges.featured")}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                        project.status === "active"
                          ? "bg-code-green/20 text-code-green border-code-green/30 shadow-glow-green-subtle"
                          : project.status === "completed"
                            ? "bg-neon-cyan/20 text-neon-cyan border-neon-cyan/30 shadow-glow-cyan-subtle"
                            : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                      }`}
                    >
                      {t(`status.${project.status}` as keyof typeof t)}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 md:p-8 space-y-6 bg-terminal-dark">
                  {/* Title and Date */}
                  <div>
                    <h2
                      id="modal-title"
                      className="text-2xl md:text-3xl font-bold text-white mb-2 font-mono"
                    >
                      <span className="text-neon-cyan">//</span> {title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
                      <Calendar className="w-4 h-4 text-neon-cyan drop-shadow-[0_0_8px_currentColor]" />
                      <time dateTime={project.created_at || undefined}>
                        {formattedDate}
                      </time>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-300 leading-relaxed whitespace-pre-line font-mono">
                      {description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-neon-cyan drop-shadow-[0_0_8px_currentColor]" />
                      <h3 className="text-sm font-semibold text-neon-cyan font-mono">
                        {t("modal.technologies")}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-slate-900/80 border border-neon-cyan/30 px-3 py-1.5 rounded-md text-sm text-slate-300 font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    {project.live_demo_link && (
                      <a
                        href={project.live_demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-neon-cyan/10 border-2 border-neon-cyan text-neon-cyan rounded-lg hover:bg-neon-cyan hover:text-terminal-dark hover:scale-105 transition-all duration-[180ms] shadow-glow-cyan-intense font-mono font-medium"
                      >
                        <ExternalLink className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                        <span>$ {t("actions.viewLiveDemo")}</span>
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-electric-purple/10 border-2 border-electric-purple text-electric-purple rounded-lg hover:bg-electric-purple hover:text-white hover:scale-105 transition-all duration-[180ms] shadow-glow-purple-intense font-mono font-medium"
                      >
                        <Github className="w-5 h-5 drop-shadow-[0_0_8px_currentColor]" />
                        <span>$ {t("actions.viewOnGithub")}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
