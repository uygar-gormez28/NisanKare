'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { SelectedFile } from '@/lib/types';
import { formatFileSize } from '@/lib/imageUtils';

interface PhotoPreviewProps {
  files: SelectedFile[];
  onRemove: (id: string) => void;
  isUploading: boolean;
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({
  files,
  onRemove,
  isUploading,
}) => {
  const [failedPreviews, setFailedPreviews] = useState<Record<string, boolean>>({});

  if (files.length === 0) return null;

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  const handleImageError = (id: string) => {
    setFailedPreviews((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between px-1">
        <h3 className="font-serif text-lg font-semibold text-[#2B2430] flex items-center gap-2">
          <span>Seçilen Fotoğraflar</span>
          <span className="text-xs font-sans font-normal px-2 py-0.5 rounded-full bg-[#F9EFEF] text-[#2B2430]">
            {files.length} Adet ({formatFileSize(totalSize)})
          </span>
        </h3>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {files.map((item) => {
          const hasFailed = failedPreviews[item.id];

          return (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden bg-gray-100 border border-[#EEDDD8] shadow-sm aspect-square flex flex-col justify-between"
            >
              {/* Image Preview */}
              <div className="relative w-full h-full">
                {item.previewUrl && !hasFailed ? (
                  <img
                    src={item.previewUrl}
                    alt={item.name}
                    onError={() => handleImageError(item.id)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#F9EFEF]/60 text-xs text-[#756A70] p-2 text-center">
                    <ImageIcon className="w-8 h-8 text-[#B76E79] mb-1 opacity-70" />
                    <span className="text-[10px] font-medium truncate max-w-full">
                      {item.heicConverted ? 'Dönüştürüldü' : 'Fotoğraf'}
                    </span>
                  </div>
                )}

                {/* Status overlays */}
                {item.status === 'completed' && (
                  <div className="absolute inset-0 bg-[#2B2430]/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                    <span className="text-xs font-medium mt-1">Yüklendi</span>
                  </div>
                )}

                {item.status === 'uploading' && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2">
                    <Loader2 className="w-6 h-6 text-[#B76E79] animate-spin" />
                    <span className="text-xs font-medium mt-1">%{item.progress}</span>
                    <div className="w-4/5 bg-white/30 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-[#B76E79] h-full transition-all duration-200"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {item.status === 'error' && (
                  <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center text-white p-2 text-center">
                    <AlertCircle className="w-6 h-6 text-rose-400" />
                    <span className="text-xs font-medium mt-1 text-rose-200">Hata Oluştu</span>
                  </div>
                )}

                {/* Remove Button */}
                {!isUploading && item.status !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => onRemove(item.id)}
                    className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors shadow-md backdrop-blur-sm z-10"
                    title="Fotoğrafı Kaldır"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Footer label on thumbnail */}
              <div className="absolute bottom-0 inset-x-0 p-1.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white text-[11px] truncate flex justify-between items-center pointer-events-none z-10">
                <span className="truncate max-w-[70%]">{item.name}</span>
                <span className="text-[10px] opacity-80">{formatFileSize(item.size)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
