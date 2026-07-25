'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Camera, Check } from 'lucide-react';

interface ThankYouScreenProps {
  onReset: () => void;
  uploadedCount: number;
}

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onReset, uploadedCount }) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B76E79', '#D6A6A1', '#EEDDD8', '#2B2430', '#FFFFFF'],
      });
    } catch (e) {
      // Fallback
    }
  }, []);

  return (
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-10 border border-[#EEDDD8] shadow-glass text-center space-y-6 animate-scale-up">
      {/* Decorative Icon Badge */}
      <div className="mx-auto w-20 h-20 rounded-full bg-[#F9EFEF] border border-[#EEDDD8] flex items-center justify-center shadow-inner relative">
        <Heart className="w-10 h-10 text-[#B76E79] fill-[#B76E79] animate-pulse" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
          <Check className="w-4 h-4 stroke-[3]" />
        </div>
      </div>

      {/* Main Messages */}
      <div className="space-y-2">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#2B2430] tracking-tight">
          Teşekkürler <span className="text-[#B76E79]">🤍</span>
        </h2>
        <p className="text-lg text-[#2B2430] font-serif leading-snug max-w-sm mx-auto">
          Bu güzel anıyı bizimle paylaştığınız için teşekkür ederiz.
        </p>
      </div>

      <div className="py-2 px-4 inline-block bg-[#F9EFEF] rounded-full border border-[#EEDDD8] text-xs font-sans text-[#2B2430]">
        ✨ {uploadedCount} adet fotoğraf başarıyla iletildi.
      </div>

      {/* Action Button to send more */}
      <div className="pt-4">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B76E79] hover:bg-[#9E5862] text-white font-sans font-medium text-sm shadow-md transition-all hover:scale-[1.02] active:scale-95"
        >
          <Camera className="w-4 h-4" />
          <span>Başka Fotoğraflar Paylaş</span>
        </button>
      </div>
    </div>
  );
};
