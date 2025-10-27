'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useReducedMotion } from '@/app/hooks/useReducedMotion';
import type { Project } from '@/app/lib/supabase';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const [imageError, setImageError] = useState(false);
  const locale = useLocale() as 'en' | 'cs' | 'de';
  const t = useTranslations('projects');

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  // Get localized content
  const title = project.title[locale] || project.title.en;
  const description = project.description[locale] || project.description.en;

  // Format date
  const formattedDate = project.created_at 
    ? new Date(project.created_at).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
    : 'N/A';

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, y: prefersReducedMotion ? 0 : 20 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-slate-900/90 rounded-full flex items-center justify-center text-slate-900 dark:text-white hover:bg-white dark:hover:bg-slate-900 transition-colors shadow-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Project Image */}
                <div className="relative h-64 md:h-80 overflow-hidden bg-slate-200 dark:bg-slate-700">
                  {!imageError ? (
                    <Image
                      src={project.image_url}
                      alt={title}
                      fill
                      className="object-cover"
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 896px"
                      onError={() => setImageError(true)}
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="text-sm">Image not available</span>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {project.featured && (
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        {t('badges.featured')}
                      </span>
                    )}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'active'
                          ? 'bg-green-500 text-white'
                          : project.status === 'completed'
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}
                    >
                      {t(`status.${project.status}` as any)}
                    </span>
                  </div>
                </div>

                {/* Project Details */}
                <div className="p-6 md:p-8 space-y-6">
                  {/* Title and Date */}
                  <div>
                    <h2
                      id="modal-title"
                      className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2"
                    >
                      {title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={project.created_at || undefined}>{formattedDate}</time>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                      {description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {t('modal.technologies')}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-md text-sm text-slate-700 dark:text-slate-300"
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
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg font-medium"
                      >
                        <ExternalLink className="w-5 h-5" />
                        <span>{t('actions.viewLiveDemo')}</span>
                      </a>
                    )}
                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors shadow-md hover:shadow-lg font-medium"
                      >
                        <Github className="w-5 h-5" />
                        <span>{t('actions.viewOnGithub')}</span>
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
