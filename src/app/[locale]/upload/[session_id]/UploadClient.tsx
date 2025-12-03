"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, X, FileText, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";

import { Button } from "@/components/common/Button";
import TerminalWindow from "@/components/dev-ui/TerminalWindow";
import { 
  ALLOWED_FILE_TYPES, 
  MAX_FILE_SIZE, 
  MAX_FILES_PER_SESSION,
  formatFileSize,
  isImageFile,
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
    setFiles(prev => [...prev, newFile]);


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
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: "success" as const, progress: 100, url: data.file_url }
          : f
      ));
    } catch (err) {
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: "error" as const, error: err instanceof Error ? err.message : t("errors.uploadFailed") }
          : f
      ));
    }
  };
