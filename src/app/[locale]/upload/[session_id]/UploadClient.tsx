"use client";

import {
  AlertCircle,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/common/Button";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
import {
  ALLOWED_FILE_TYPES,
  formatFileSize,
  isImageFile,
  MAX_FILE_SIZE,
  MAX_FILES_PER_SESSION,
} from "@/lib/upload-file-utils";

interface UploadClientProps {
  sessionId: string;
  locale: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: "uploading" | "success" | "error";
  progress: number;
  error?: string;
  url?: string;
}

export default function UploadClient({ sessionId, locale }: UploadClientProps) {
  const t = useTranslations("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [projectTitle, setProjectTitle] = useState<string>("");
  const [sessionExpired, setSessionExpired] = useState(false);

  // Load project title from sessionStorage
  useEffect(() => {
    const storedTitle = sessionStorage.getItem(`upload_project_${sessionId}`);
    if (storedTitle) {
      setProjectTitle(storedTitle);
    }
  }, [sessionId]);

  const getCsrfToken = (): string | null => {
    return localStorage.getItem(`upload_csrf_${sessionId}`);
  };

  const uploadFile = async (file: File): Promise<void> => {
    const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add file to list with uploading status
    const newFile: UploadedFile = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    };
    setFiles((prev) => [...prev, newFile]);

    try {
      const csrfToken = getCsrfToken();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", sessionId);

      const response = await fetch("/api/upload/files", {
        method: "POST",
        headers: csrfToken ? { "x-csrf-token": csrfToken } : {},
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 410) {
          setSessionExpired(true);
        }
        throw new Error(data.error || t("errors.uploadFailed"));
      }

      // Update file status to success
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "success" as const,
                progress: 100,
                url: data.file_url,
              }
            : f,
        ),
      );
    } catch (err) {
      // Update file status to error
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "error" as const,
                error:
                  err instanceof Error ? err.message : t("errors.uploadFailed"),
              }
            : f,
        ),
      );
    }
  };

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const filesToUpload = Array.from(fileList);
      const successCount = files.filter((f) => f.status === "success").length;
      const remaining = MAX_FILES_PER_SESSION - successCount;

      if (remaining <= 0) {
        alert(t("errors.maxFilesReached"));
        return;
      }

      const validFiles = filesToUpload.slice(0, remaining).filter((file) => {
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          console.warn(`Invalid file type: ${file.type}`);
          return false;
        }
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`File too large: ${file.name}`);
          return false;
        }
        return true;
      });

      validFiles.forEach(uploadFile);
    },
    [files, t],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = ""; // Reset input
      }
    },
    [handleFiles],
  );

  const removeFile = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const successCount = files.filter((f) => f.status === "success").length;
  const canUploadMore = successCount < MAX_FILES_PER_SESSION && !sessionExpired;

  if (sessionExpired) {
    return (
      <div className="container mx-auto px-4 py-12 lg:py-20">
        <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
          <TerminalWindow className="w-full max-w-2xl rounded-xl shadow-2xl">
            <div className="p-8 lg:p-12 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h2 className="text-2xl font-bold text-white mb-2">
                {t("sessionExpired")}
              </h2>
              <p className="text-white/60">{t("sessionExpiredMessage")}</p>
            </div>
          </TerminalWindow>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20">
      <div className="min-h-[calc(100vh-20rem)] flex items-center justify-center">
        <TerminalWindow className="w-full max-w-3xl rounded-xl shadow-2xl">
          <div className="p-8 lg:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-neon-purple dark:text-neon-cyan mb-2">
                {t("uploadTitle")}
              </h1>
              {projectTitle && (
                <p className="text-lg text-white/80">{projectTitle}</p>
              )}
              <p className="text-sm text-white/50 mt-2">
                {t("filesUploaded", {
                  count: successCount,
                  max: MAX_FILES_PER_SESSION,
                })}
              </p>
            </div>

            {/* Drop Zone */}
            {canUploadMore && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
                  transition-all duration-200
                  ${
                    isDragging
                      ? "border-neon-cyan bg-neon-cyan/10"
                      : "border-slate-600 hover:border-slate-500 hover:bg-slate-800/30"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ALLOWED_FILE_TYPES.join(",")}
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-12 h-12 mx-auto mb-4 text-white/50" />
                <p className="text-lg text-white/80 mb-2">{t("dropZone")}</p>
                <p className="text-sm text-white/50">{t("orClickToBrowse")}</p>
                <p className="text-xs text-white/40 mt-4">
                  {t("fileTypesInfo")} •{" "}
                  {t("maxSizeInfo", { size: formatFileSize(MAX_FILE_SIZE) })}
                </p>
              </div>
            )}

            {/* File List */}
            {files.length > 0 && (
              <div className="mt-8 space-y-3">
                <h3 className="text-sm font-medium text-white/80 mb-4">
                  {t("uploadedFiles")}
                </h3>
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg"
                  >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                      {isImageFile(file.type) ? (
                        <ImageIcon className="w-8 h-8 text-blue-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-orange-400" />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{file.name}</p>
                      <p className="text-xs text-white/50">
                        {formatFileSize(file.size)}
                      </p>
                      {file.status === "error" && (
                        <p className="text-xs text-red-400 mt-1">
                          {file.error}
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex-shrink-0">
                      {file.status === "uploading" && (
                        <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                      )}
                      {file.status === "success" && (
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      )}
                      {file.status === "error" && (
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-1 hover:bg-red-900/30 rounded"
                        >
                          <X className="w-5 h-5 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Done Message */}
            {successCount > 0 && (
              <div className="mt-8 p-4 bg-green-900/20 border border-green-800 rounded-lg text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                <p className="text-green-400">
                  {t("uploadSuccess", { count: successCount })}
                </p>
              </div>
            )}
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
}
