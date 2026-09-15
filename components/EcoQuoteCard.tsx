'use client';

import React from 'react';

export function EcoQuoteCard() {
  return (
    <div
      id="eco-quote-card"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col items-center justify-center text-center relative overflow-hidden"
    >
      {/* Decorative subtle background circle */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#E0F2FE] rounded-full blur-xl pointer-events-none opacity-70" />

      {/* Eco Vector Illustration (Water / Ocean + Clean Earth Motif) */}
      <div className="relative w-32 h-32 mb-4 flex items-center justify-center">
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Circular soft backdrop */}
          <circle cx="60" cy="60" r="52" fill="#F0F7FC" />

          {/* Ocean globe element in corporate blue */}
          <circle cx="68" cy="58" r="28" fill="#38BDF8" opacity="0.85" />
          <path
            d="M50 56 C54 48, 64 46, 74 50 C80 54, 84 62, 80 70 C72 78, 56 74, 50 66 Z"
            fill="#005596"
            opacity="0.9"
          />

          {/* Ocean waves pattern */}
          <path
            d="M56 64 Q64 60 72 65 M60 72 Q68 68 76 72"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Stylized small playful fish */}
          <path
            d="M72 54 C76 52, 82 54, 84 57 C82 60, 76 60, 72 58 Z"
            fill="#FFFFFF"
          />
          <polygon points="84,57 88,54 88,60" fill="#FFFFFF" />

          {/* Clean flowing waves hugging the globe */}
          <path
            d="M32 82 C38 52, 54 36, 68 30 C66 42, 58 54, 48 64 C42 70, 36 76, 32 82 Z"
            fill="#003B6D"
          />
          <path
            d="M48 64 C56 50, 72 44, 82 42 C78 52, 70 60, 58 66 Z"
            fill="#005596"
          />
          <path
            d="M34 82 C42 86, 52 86, 60 82 C56 76, 46 76, 38 78 Z"
            fill="#00A3E0"
          />

          {/* Base flourish */}
          <path
            d="M28 86 Q46 84 64 88"
            stroke="#00294D"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Motivational Quote Text */}
      <p
        id="eco-quote-text"
        className="text-gray-700 text-sm md:text-base leading-relaxed font-medium max-w-xs"
      >
        Setiap kilogram sampah yang kamu setorkan, berarti satu langkah nyata
        untuk kelestarian air dan lingkungan sekitar.
      </p>

      {/* Water droplet symbol */}
      <div className="mt-3 text-[#005596] text-lg" role="img" aria-label="water">
        💧
      </div>
    </div>
  );
}
