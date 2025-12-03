"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { CreateUploadSessionResponse } from "@/app/api/upload/route";
import { Button } from "@/components/common/Button";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
import { useRouter } from "@/i18n/navigation";
import type { LocalizedString, Project } from "@/lib/supabase";

interface ProjectOption {
  id: string;
  title: string;
}

export default function UploadLanding() {
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "cs";
  const t = useTranslations("upload");

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects?status=active");
        const data = await response.json();

        if (data.projects) {
          const projectOptions: ProjectOption[] = data.projects.map(
            (p: Project) => ({
              id: p.id,
              title:
                typeof p.title === "object"
                  ? (p.title as LocalizedString)[
                      locale as keyof LocalizedString
                    ] ||
                    (p.title as LocalizedString).en ||
                    "Project"
                  : String(p.title),
            }),
          );
          setProjects(projectOptions);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError(t("errors.loadProjectsFailed"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [locale, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !password) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: selectedProject,
          password,
          locale,
        }),
      });

      const data: CreateUploadSessionResponse = await response.json();

      if (!response.ok || !data.success || !data.session_id) {
        if (response.status === 401) {
          throw new Error(t("errors.wrongPassword"));
        }
        if (response.status === 403) {
          throw new Error(t("errors.uploadsDisabled"));
        }
        if (response.status === 429) {
          throw new Error(t("errors.tooManyAttempts"));
        }
        throw new Error(data.error || t("errors.sessionFailed"));
      }

      // Store CSRF token
      if (data.csrf_token) {
        localStorage.setItem(`upload_csrf_${data.session_id}`, data.csrf_token);
      }

      // Store project info for upload page
      if (data.project_title) {
        sessionStorage.setItem(
          `upload_project_${data.session_id}`,
          data.project_title,
        );
      }

      router.push(`/upload/${data.session_id}`);
    } catch (err) {
      console.error("Error creating upload session:", err);
      setError(err instanceof Error ? err.message : t("errors.sessionFailed"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center relative">
        <TerminalWindow className="relative z-10 w-full max-w-2xl rounded-xl shadow-2xl">
          <div className="p-8 lg:p-12">
            {/* Logo */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <Image
                src="/FredonBytes_GraphicLogo.webp"
                alt="FredonBytes Logo"
                width={128}
                height={128}
                className="object-contain w-full h-full"
                priority
                quality={90}
                sizes="128px"
              />
            </div>

            {/* Title */}
            <div className="space-y-4 text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-neon-purple dark:text-neon-cyan">
                {t("title")}
              </h1>
              <p className="text-lg text-white dark:text-white max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Project Selection */}
              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  {t("projectLabel")} *
                </label>
                <select
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  disabled={isLoading || isSubmitting}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50"
                  required
                >
                  <option value="">{t("projectPlaceholder")}</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Input */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  {t("passwordLabel")} *
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder={t("passwordPlaceholder")}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder:text-white/40 focus:ring-2 focus:ring-neon-cyan focus:border-transparent disabled:opacity-50"
                  required
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={isSubmitting}
                disabled={
                  isSubmitting || !selectedProject || !password || isLoading
                }
                className="w-full min-h-[44px] flex items-center justify-center"
              >
                {isSubmitting ? t("submitting") : t("submitButton")}
              </Button>
            </form>

            {/* Info Note */}
            <p className="text-xs text-white/50 text-center mt-6">
              {t("infoNote")}
            </p>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
