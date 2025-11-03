'use client'

import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';

import {
  validateImageFile,
  getFormattedSize,
  MAX_FILE_SIZE,
  getRemainingSize
} from '@/lib/form-image-utils';
import { getTotalImageSize, updateTotalImageSize } from '@/lib/form-storage';

interface ImageUploadInputProps {
  value: string[] | null;
  onChange: (value: string[] | null) => void;
  required: boolean;
  error?: string;
  questionId: string;
  sessionId: string;
  csrfToken: string;
}

interface UploadingFile {
  name: string;
  progress: number;
  error?: string;
}

export default function ImageUploadInput({
  value,
  onChange,
  required,
  error,
  questionId,
  sessionId,
  csrfToken,
}: ImageUploadInputProps) {
  const t = useTranslations('form.image');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentSessionSize = getTotalImageSize(sessionId);
  const remaining = getRemainingSize(currentSessionSize);

  const uploadedImages = value || [];
  const hasImages = uploadedImages.length > 0;

  const handleFileSelect = async (files: FileList) => {
    setUploadError(null);
    const fileArray = Array.from(files);
    
    // Initialize uploading state for all files
    setUploadingFiles(fileArray.map(f => ({ name: f.name, progress: 0 })));
    setUploading(true);

    const newUrls: string[] = [];
    let currentRemaining = remaining;

    // Upload files sequentially
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      
      // Validate file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, error: validation.error || 'Invalid file' } : f
        ));
        continue;
      }

      // Check remaining space
      if (file.size > currentRemaining) {
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            error: `Limit exceeded. ${getFormattedSize(currentRemaining)} remaining` 
          } : f
        ));
        break; // Stop uploading more files
      }

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('session_id', sessionId);
        formData.append('question_id', questionId);

        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 50 } : f
        ));

        const response = await fetch('/api/form/upload', {
          method: 'POST',
          headers: {
            'x-csrf-token': csrfToken,
          },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Upload failed');
        }

        // Update progress
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 100 } : f
        ));

        updateTotalImageSize(sessionId, file.size);
        newUrls.push(data.image_url);
        currentRemaining -= file.size;
      } catch (err) {
        setUploadingFiles(prev => prev.map((f, idx) => 
          idx === i ? { 
            ...f, 
            error: err instanceof Error ? err.message : 'Upload failed' 
          } : f
        ));
      }
    }

    // Update answer with all uploaded URLs
    if (newUrls.length > 0) {
      const updatedUrls = [...uploadedImages, ...newUrls];
      onChange(updatedUrls);
    }

    // Clear uploading state after short delay to show completion
    setTimeout(() => {
      setUploading(false);
      setUploadingFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleRemove = (urlToRemove: string) => {
    const updatedUrls = uploadedImages.filter(url => url !== urlToRemove);
    onChange(updatedUrls.length > 0 ? updatedUrls : null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />

      {/* Upload button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={uploading}
        className={`w-full px-6 py-8 rounded-lg border-2 border-dashed transition-all duration-200
                   bg-glass-bg backdrop-blur-glass
                   hover:bg-glass-bg/80 hover:border-neon-cyan
                   focus:outline-none focus:ring-2 focus:ring-neon-cyan/50
                   disabled:opacity-50 disabled:cursor-not-allowed
                   ${error ? 'border-error-red' : 'border-neon-cyan/40'}`}
      >
        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-neon-cyan" />
          <div className="text-center">
            <p className="text-terminal-light font-mono font-semibold">
              {uploading ? t('uploading') : t('label')}
            </p>
            <p className="text-sm text-terminal-light/70 mt-1">
              {t('sizeWarning')}
            </p>
            <p className="text-xs text-terminal-light/50 mt-1">
              {t('remaining', { size: getFormattedSize(remaining) })}
            </p>
          </div>
        </div>
      </button>

      {/* Uploaded images gallery */}
      {hasImages && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uploadedImages.map((imageUrl, index) => (
            <div
              key={imageUrl}
              className="relative rounded-lg border-2 border-neon-cyan/40 bg-glass-bg backdrop-blur-glass p-2 group"
            >
              <div className="aspect-square rounded overflow-hidden bg-terminal-dark/50">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(imageUrl)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-error-red text-white 
                         hover:bg-error-red/80 transition-colors shadow-lg
                         opacity-0 group-hover:opacity-100"
                aria-label={`Remove image ${index + 1}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploading progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((file, index) => (
            <div key={`${file.name}-${index}`} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-terminal-light/70 truncate font-mono">
                  {file.name}
                </span>
                {file.error ? (
                  <span className="text-error-red flex-shrink-0 ml-2">
                    {file.error}
                  </span>
                ) : (
                  <span className="text-neon-cyan flex-shrink-0 ml-2">
                    {file.progress}%
                  </span>
                )}
              </div>
              {!file.error && (
                <div className="h-1.5 bg-glass-bg rounded-full overflow-hidden border border-neon-cyan/40">
                  <div
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-300"
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadError && (
        <p className="text-sm text-error-red font-mono">
          {uploadError}
        </p>
      )}
    </div>
  );
}
