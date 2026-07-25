'use client';

import React, { useRef, useState } from 'react';
import { ImagePlus, UploadCloud } from 'lucide-react';

interface PhotoUploaderProps {
  onFilesSelected: (files: FileList | File[]) => void;
  isUploading: boolean;
  selectedCount: number;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  onFilesSelected,
  isUploading,
  selectedCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(e.dataTransfer.files);
    }
  };

  const triggerSelect = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/jpeg,image/png,image/heic,image/heif,image/webp,image/*"
        className="hidden"
        disabled={isUploading}
      />

      <div
        onClick={triggerSelect}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group cursor-pointer transition-all duration-300 rounded-xl p-3 sm:p-4 text-center border-2 border-dashed
          ${
            isDragOver
              ? 'border-[#B76E79] bg-[#F9EFEF] scale-[1.01]'
              : 'border-[#EEDDD8] bg-white hover:border-[#B76E79] hover:bg-white shadow-sm'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          {/* Animated Icon Circle with Dusty Rose Accent */}
          <div className="w-10 h-10 rounded-full bg-[#F9EFEF] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
            {selectedCount > 0 ? (
              <ImagePlus className="w-5 h-5 text-[#B76E79]" />
            ) : (
              <UploadCloud className="w-5 h-5 text-[#B76E79]" />
            )}
          </div>

          {/* Action Button & Subtitle */}
          <div className="space-y-0.5">
            <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#B76E79] hover:bg-[#9E5862] text-white font-sans font-medium text-sm shadow-sm transition-colors group-active:scale-95">
              {selectedCount > 0 ? 'Fotoğraf Ekle / Galeriyi Aç' : 'Fotoğrafları Seç'}
            </span>
            <p className="text-[11px] text-[#756A70] font-sans pt-1">
              Galerinizden bir veya daha fazla fotoğraf seçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
