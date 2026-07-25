'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PhotoUploader } from '@/components/PhotoUploader';
import { PhotoPreview } from '@/components/PhotoPreview';
import { UploadProgress } from '@/components/UploadProgress';
import { ThankYouScreen } from '@/components/ThankYouScreen';
import { ErrorModal } from '@/components/ErrorModal';
import { SelectedFile, UploadSessionResponse } from '@/lib/types';
import { convertHeicIfNeeded, uploadFileDirectToDrive } from '@/lib/imageUtils';
import { Send, Heart } from 'lucide-react';

export default function Home() {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedCount, setUploadedCount] = useState(0);

  // Handle file selection from gallery/file picker
  const handleFilesSelected = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Limit maximum files per batch (e.g., max 20 photos at once)
    if (selectedFiles.length + fileArray.length > 25) {
      setErrorMessage('Tek seferde en fazla 25 fotoğraf seçebilirsiniz.');
      return;
    }

    const newSelectedFiles: SelectedFile[] = fileArray.map((file) => ({
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type || 'image/jpeg',
      previewUrl: URL.createObjectURL(file),
      status: 'idle',
      progress: 0,
    }));

    setSelectedFiles((prev) => [...prev, ...newSelectedFiles]);

    // Process HEIC conversion in background if needed
    for (const item of newSelectedFiles) {
      const processedItem = await convertHeicIfNeeded(item);
      if (processedItem.heicConverted) {
        setSelectedFiles((prev) =>
          prev.map((f) => (f.id === processedItem.id ? processedItem : f))
        );
      }
    }
  };

  // Remove a single file from preview
  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Main Upload Handler (Resumable Upload Direct to Google Drive)
  const handleStartUpload = async () => {
    if (selectedFiles.length === 0 || isUploading) return;

    setIsUploading(true);
    setOverallProgress(0);
    setErrorMessage(null);

    const totalFiles = selectedFiles.length;
    let completedCount = 0;

    for (let i = 0; i < totalFiles; i++) {
      const currentItem = selectedFiles[i];
      setCurrentFileIndex(i + 1);
      setCurrentFileName(currentItem.name);

      // Update individual file status to uploading
      setSelectedFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: 'uploading' } : f))
      );

      try {
        // Step 1: Request Direct Resumable Upload Session URL from Next.js server
        const sessionRes = await fetch('/api/upload-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: currentItem.name,
            mimeType: currentItem.type,
            fileSize: currentItem.size,
          }),
        });

        const sessionData: UploadSessionResponse = await sessionRes.json();

        if (!sessionRes.ok || !sessionData.success || !sessionData.uploadUrl) {
          throw new Error(sessionData.error || 'Yükleme oturumu başlatılamadı.');
        }

        // Step 2: Stream binary file directly from browser to Google Drive uploadUrl
        await uploadFileDirectToDrive(
          currentItem.file,
          sessionData.uploadUrl,
          (filePercent) => {
            // Update file specific progress
            setSelectedFiles((prev) =>
              prev.map((f, idx) =>
                idx === i ? { ...f, progress: filePercent } : f
              )
            );

            // Calculate aggregate progress
            const calculatedOverall = Math.round(
              ((completedCount + filePercent / 100) / totalFiles) * 100
            );
            setOverallProgress(calculatedOverall);
          }
        );

        // Mark item completed
        completedCount++;
        setSelectedFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: 'completed', progress: 100 } : f
          )
        );
      } catch (err: unknown) {
        console.error(`Error uploading ${currentItem.name}:`, err);
        const errorText =
          err instanceof Error
            ? err.message
            : 'Yükleme sırasında beklenmeyen bir hata oluştu.';

        setSelectedFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? { ...f, status: 'error', errorMessage: errorText }
              : f
          )
        );

        setIsUploading(false);
        setErrorMessage(
          `"${currentItem.name}" yüklenirken bir sorun oluştu: ${errorText}`
        );
        return;
      }
    }

    // All uploads succeeded!
    setIsUploading(false);
    setUploadedCount(totalFiles);
    setIsCompleted(true);
  };

  // Reset screen for uploading more photos
  const handleReset = () => {
    selectedFiles.forEach((f) => {
      if (f.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(f.previewUrl);
      }
    });
    setSelectedFiles([]);
    setIsUploading(false);
    setIsCompleted(false);
    setOverallProgress(0);
    setCurrentFileIndex(0);
    setErrorMessage(null);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-between space-y-6 w-full">
      {/* Header */}
      <Header />

      {/* Main Interactive Content */}
      <div className="flex-1 flex flex-col justify-center space-y-6 w-full">
        {isCompleted ? (
          <ThankYouScreen onReset={handleReset} uploadedCount={uploadedCount} />
        ) : (
          <div className="space-y-4 bg-glass p-4 md:p-6 rounded-3xl border border-[#EEDDD8] shadow-glass">
            {/* Uploader Dropzone / Button */}
            <PhotoUploader
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
              selectedCount={selectedFiles.length}
            />

            {/* Photo Previews */}
            <PhotoPreview
              files={selectedFiles}
              onRemove={handleRemoveFile}
              isUploading={isUploading}
            />

            {/* Active Upload Progress indicator */}
            {isUploading && (
              <UploadProgress
                currentFileIndex={currentFileIndex}
                totalFiles={selectedFiles.length}
                overallProgress={overallProgress}
                currentFileName={currentFileName}
              />
            )}

            {/* Action Button: Fotoğrafları Gönder */}
            {selectedFiles.length > 0 && !isUploading && (
              <div className="pt-2 animate-fade-in">
                <button
                  type="button"
                  onClick={handleStartUpload}
                  className="w-full py-3.5 px-6 rounded-full bg-[#B76E79] hover:bg-[#9E5862] text-white font-sans font-semibold text-base shadow-md hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  <Send className="w-5 h-5 text-white" />
                  <span>Fotoğrafları Gönder ({selectedFiles.length})</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Alert Modal */}
      <ErrorModal
        message={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
