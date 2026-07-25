'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorModalProps {
  message: string | null;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-rose-100 space-y-4 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h4 className="font-serif text-lg font-bold text-gray-900">
            Bir Hata Oluştu
          </h4>
          <p className="text-sm font-sans text-gray-600 leading-relaxed">
            {message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-rose-600 text-white font-sans text-sm font-medium hover:bg-rose-700 transition-colors shadow-sm"
        >
          Tamam, Anladım
        </button>
      </div>
    </div>
  );
};
