
import { getTranslations } from 'next-intl/server';

import { supabase, type Project } from '@/app/lib/supabase';

import ProjectsClient from './ProjectsClient';

// Fetch projects from database with caching
async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return (data || []) as Project[];
  } catch (error) {
    console.error('Unexpected error fetching projects:', error);
    return [];
  }
}

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function ProjectsGrid() {
  const projects = await getProjects();
  const t = await getTranslations('projects');

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-slate-600 dark:text-slate-400">
          {t('empty.noProjects')}
        </p>
      </div>
    );
  }

  return <ProjectsClient projects={projects} />;
}
