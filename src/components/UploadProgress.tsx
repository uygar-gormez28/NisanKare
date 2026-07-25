'use client';

import React from 'react';
import { Loader2, CloudUpload } from 'lucide-react';

interface UploadProgressProps {
  currentFileIndex: number;
  totalFiles: number;
  overallProgress: number; // 0 - 100
  currentFileName: string;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({
  currentFileIndex,
  totalFiles,
  overallProgress,
  currentFileName,
}) => {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-[#EEDDD8] shadow-glass space-y-4 text-center animate-fade-in">
      <div className="flex items-center justify-center gap-3 text-[#B76E79]">
        <Loader2 className="w-6 h-6 animate-spin text-[#B76E79]" />
        <h3 className="font-serif text-xl font-bold text-[#2B2430]">
          Fotoğraflarınız Anılara Dönüşüyor...
        </h3>
      </div>

      <div className="space-y-2">
        {/* Progress Bar Container */}
        <div className="relative w-full h-3 bg-[#F9EFEF] rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-[#B76E79] transition-all duration-300 rounded-full shadow"
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs font-sans text-[#756A70] px-1">
          <span className="font-medium text-[#2B2430]">
            {currentFileIndex} / {totalFiles} Fotoğraf
          </span>
          <span className="font-bold text-[#2B2430] text-sm">%{overallProgress}</span>
        </div>
      </div>

      <p className="text-xs text-[#756A70] truncate font-sans max-w-xs mx-auto">
        <CloudUpload className="w-3.5 h-3.5 inline mr-1 text-[#B76E79]" />
        Yükleniyor: <span className="font-mono text-[#2B2430]">{currentFileName}</span>
      </p>

      <p className="text-[11px] text-[#756A70] italic opacity-80">
        Lütfen bu esnada sayfayı kapatmayın...
      </p>
    </div>
  );
};
