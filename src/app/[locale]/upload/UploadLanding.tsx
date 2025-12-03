"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import type { CreateUploadSessionResponse } from "@/app/api/upload/route";
import { Button } from "@/components/common/Button";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
import { useRouter } from "@/i18n/navigation";
import type { Project, LocalizedString } from "@/lib/supabase";

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
  const [isStarting, setIsStarting] = useState(false);
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
                    ] || (p.title as LocalizedString).en
                  : p.title,
            })
          );
          setProjects(projectOptions);
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(t("errors.loadProjects"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [locale, t]);

  const handleStart = async () => {
    if (!selectedProject) {
      setError(t("errors.selectProject"));
      return;
    }
    if (!password) {
      setError(t("errors.enterPassword"));
      return;
    }

    setIsStarting(true);
    setError(null);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
        if (response.status === 429) {
          throw new Error(t("errors.tooManyAttempts"));
        }
        throw new Error(data.error || t("errors.createSession"));
      }

      // Store CSRF token
      if (data.csrf_token) {
        localStorage.setItem(
          `upload_csrf_${data.session_id}`,
          data.csrf_token
        );
      }

      // Store project title for display
      if (data.project_title) {
        sessionStorage.setItem(
          `upload_project_${data.session_id}`,
          data.project_title
        );
      }

      router.push(`/upload/${data.session_id}`);
    } catch (err) {
      console.error("Error starting upload:", err);
      setError(err instanceof Error ? err.message : t("errors.createSession"));
      setIsStarting(false);
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
            <div className="space-y-4 text-center">
              <h1 className="text-3xl lg:text-4xl font-bold text-neon-purple dark:text-neon-cyan">
                {t("title")}
              </h1>
              <p className="text-lg text-white dark:text-white max-w-2xl mx-auto leading-relaxed">
                {t("subtitle")}
              </p>
            </div>
