import { getTranslations } from "next-intl/server";

import { type Project, supabase } from "@/lib/supabase";

import ProjectsClient from "./ProjectsClient";

// Fetch projects from database with caching
async function getProjects(): Promise<Project[]> {
  try {
    const startTime = Date.now();
    console.log("[ProjectsGrid] Fetching projects from Supabase...");

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("visible", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("[ProjectsGrid] Supabase error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        duration: `${Date.now() - startTime}ms`,
      });
      return [];
    }

    console.log(
      `[ProjectsGrid] Successfully fetched ${data?.length || 0} projects in ${Date.now() - startTime}ms`,
    );
    return (data || []) as Project[];
  } catch (error) {
    console.error(
      "[ProjectsGrid] Unexpected error fetching projects:",
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

// Enable revalidation every 1 hour (3600 seconds)
export const revalidate = 3600;

export default async function ProjectsGrid() {
  const projects = await getProjects();
  const t = await getTranslations("projects");

  // Empty state
  if (projects.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-slate-600 dark:text-slate-400">
          {t("empty.noProjects")}
        </p>
      </div>
    );
  }

  return <ProjectsClient projects={projects} />;
}
