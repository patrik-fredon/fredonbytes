'use client';

import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { useReducedMotion } from '@/app/hooks/useReducedMotion';

interface ProjectFilterProps {
  technologies: string[];
  categories: string[];
  statuses: Array<'active' | 'completed' | 'archived'>;
  selectedTechnologies: string[];
  selectedCategory: string | null;
  selectedStatus: string | null;
  onTechnologyChange: (technologies: string[]) => void;
  onCategoryChange: (category: string | null) => void;
  onStatusChange: (status: string | null) => void;
  onClearFilters: () => void;
}

export default function ProjectFilter({
  technologies,
  categories,
  statuses,
  selectedTechnologies,
  selectedCategory,
  selectedStatus,
  onTechnologyChange,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
}: ProjectFilterProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('projects');

  const hasActiveFilters = selectedTechnologies.length > 0 || selectedStatus !== null || selectedCategory !== null;

  const toggleTechnology = (tech: string) => {
    if (selectedTechnologies.includes(tech)) {
      onTechnologyChange(selectedTechnologies.filter((t) => t !== tech));
    } else {
      onTechnologyChange([...selectedTechnologies, tech]);
    }
  };

  const handleStatusChange = (status: string) => {
    onStatusChange(selectedStatus === status ? null : status);
  };

  const handleCategoryChange = (category: string) => {
    onCategoryChange(selectedCategory === category ? null : category);
  };

  return (
    <div className="mb-8">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          aria-expanded={isOpen}
          aria-controls="filter-panel"
        >
          <Filter className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          <span className="text-slate-900 dark:text-white font-medium">
            {t('filters.title')}
          </span>
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
              {selectedTechnologies.length + (selectedStatus ? 1 : 0) + (selectedCategory ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label="Clear all filters"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">{t('filters.clearAll')}</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      <motion.div
        id="filter-panel"
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: prefersReducedMotion ? 0 : 0.3,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="overflow-hidden"
      >
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6">
          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('filters.category')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedCategory === category}
                >
                  {t(`categories.${category}` as keyof typeof t)}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('filters.status')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedStatus === status}
                >
                  {t(`status.${status}` as keyof typeof t)}
                </button>
              ))}
            </div>
          </div>

          {/* Technology Filter */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">
              {t('filters.technologies')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => toggleTechnology(tech)}
                  className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                    selectedTechnologies.includes(tech)
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                  aria-pressed={selectedTechnologies.includes(tech)}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
