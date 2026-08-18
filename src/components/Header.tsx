'use client';

import React from 'react';
import { Heart } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full flex flex-col items-center justify-center text-center py-3 px-2 space-y-3">
      {/* 1. Main Title - Centered */}
      <h1 className="w-full text-center text-3xl sm:text-4xl font-serif text-[#2B2430] tracking-tight">
        <span className="font-normal">Nişan</span>
        <span className="font-bold italic bg-gradient-to-r from-[#9E5862] via-[#B76E79] to-[#D6A6A1] bg-clip-text text-transparent">
          Kare
        </span>
      </h1>

      {/* 2. 20 Ağustos Badge - Centered right under title */}
      <div className="flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-[#F9EFEF] text-[#2B2430] text-xs font-medium tracking-wide">
        <span>20 Ağustos Nişan Anıları</span>
        <Heart className="w-3.5 h-3.5 text-[#B76E79] fill-[#B76E79] animate-heartbeat origin-center" />
      </div>

      {/* 3. Couple Photo Showcase - Centered */}
      <div className="flex items-center justify-center w-full my-2">
        <div className="relative w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden border-4 border-white shadow-xl ring-1 ring-[#EEDDD8]">
          <img
            src="/WhatsApp Image 2026-08-19 at 02.02.49.jpeg"
            alt="Nişan Anısı"
            className="w-full h-full object-cover"
          />
          {/* Heart icon inside image corner */}
          <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-[#B76E79] text-white flex items-center justify-center shadow-md border-2 border-white">
            <Heart className="w-3.5 h-3.5 fill-white" />
          </div>
        </div>
      </div>

      {/* 4. Subtitles - Centered */}
      <div className="w-full max-w-sm mx-auto text-center space-y-1">
        <p className="text-base sm:text-lg font-serif text-[#2B2430] font-medium leading-snug">
          &ldquo;Bu güzel geceden bir kare de siz bırakın.&rdquo;
        </p>
        <p className="text-xs text-[#756A70] font-sans leading-relaxed">
          Galerinizden çektiğiniz fotoğrafları seçin ve bizimle paylaşın.
        </p>
      </div>
    </header>
  );
};
