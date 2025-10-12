'use client';

import dynamic from 'next/dynamic';
import { useState, useMemo } from 'react';

import type { Project } from '@/app/lib/supabase';

import ProjectCard from './ProjectCard';

// Dynamic imports for heavy components to reduce initial bundle size
const ProjectFilter = dynamic(() => import('./ProjectFilter'), {
  loading: () => (
    <div className="mb-8 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
  ),
});

const ProjectModal = dynamic(() => import('./ProjectModal'), {
  ssr: false, // Modal doesn't need SSR
});

interface ProjectsClientProps {
  projects: Project[];
}

export default function ProjectsClient({ projects }: ProjectsClientProps) {
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract unique technologies from all projects
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, [projects]);

  // Extract unique statuses
  const allStatuses: Array<'active' | 'completed' | 'archived'> = ['active', 'completed', 'archived'];

  // Filter projects based on selected filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Filter by status
      if (selectedStatus && project.status !== selectedStatus) {
        return false;
      }

      // Filter by technologies (project must have ALL selected technologies)
      if (selectedTechnologies.length > 0) {
        const hasAllTechnologies = selectedTechnologies.every((tech) =>
          project.technologies.includes(tech)
        );
        if (!hasAllTechnologies) {
          return false;
        }
      }

      return true;
    });
  }, [projects, selectedStatus, selectedTechnologies]);

  const handleOpenModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the project to allow exit animation
    setTimeout(() => setSelectedProject(null), 300);
  };

  const handleClearFilters = () => {
    setSelectedTechnologies([]);
    setSelectedStatus(null);
  };

  return (
    <>
      {/* Filter Component */}
      <ProjectFilter
        technologies={allTechnologies}
        statuses={allStatuses}
        selectedTechnologies={selectedTechnologies}
        selectedStatus={selectedStatus}
        onTechnologyChange={setSelectedTechnologies}
        onStatusChange={setSelectedStatus}
        onClearFilters={handleClearFilters}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-slate-600 dark:text-slate-400">
            No projects match your filters. Try adjusting your selection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} onOpenModal={handleOpenModal} />
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
