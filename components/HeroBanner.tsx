'use client';

import React from 'react';
import { MapPin, Building2, ChevronRight } from 'lucide-react';
import { Nasabah } from '@/lib/bankSampahData';

interface HeroBannerProps {
  nasabah: Nasabah;
  onOpenProfile: () => void;
}

export function HeroBanner({ nasabah, onOpenProfile }: HeroBannerProps) {
  return (
    <div
      id="hero-banner-container"
      className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-r from-[#F0F7FC] via-[#E4F1FA] to-[#D5EAF7] border border-[#BAE6FD]/80 p-6 md:p-8 shadow-xs"
    >
      {/* Background Scenic Landscape Illustration Placeholder */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 lg:w-1/2 pointer-events-none overflow-hidden opacity-95">
        <svg
          viewBox="0 0 600 320"
          preserveAspectRatio="xMaxYMid slice"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#00A3E0" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="hillMid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>
            <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#005596" />
            </linearGradient>
          </defs>

          {/* Soft background sky */}
          <rect width="600" height="320" fill="url(#skyGrad)" />

          {/* Distant mountains/hills */}
          <path
            d="M0 180 Q120 120 240 160 T480 140 T600 150 L600 320 L0 320 Z"
            fill="url(#hillFar)"
            opacity="0.6"
          />

          {/* Midground rolling hills */}
          <path
            d="M100 200 Q220 140 360 180 T600 170 L600 320 L100 320 Z"
            fill="url(#hillMid)"
            opacity="0.75"
          />

          {/* River / lake basin */}
          <path
            d="M0 240 C140 210, 260 260, 420 220 C500 200, 560 210, 600 215 L600 320 L0 320 Z"
            fill="url(#waterGrad)"
          />

          {/* Water reflection ripples */}
          <path
            d="M80 250 Q160 245 220 252 M280 240 Q340 236 380 242 M140 270 Q240 265 310 272"
            stroke="#FFFFFF"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />

          {/* Foreground hills (right edge) */}
          <path
            d="M340 320 Q420 200 600 210 L600 320 Z"
            fill="url(#hillNear)"
          />

          {/* Stylized accents on the hills */}
          <circle cx="510" cy="210" r="18" fill="#003B6D" />
          <circle cx="535" cy="205" r="22" fill="#00294D" />
          <circle cx="560" cy="220" r="16" fill="#005596" />
          <circle cx="475" cy="225" r="14" fill="#003B6D" />

          <circle cx="420" cy="255" r="10" fill="#003B6D" />
          <circle cx="435" cy="250" r="12" fill="#00294D" />

          {/* Decorative soft clouds */}
          <path
            d="M240 70 Q255 55 275 60 Q295 50 315 65 Q330 65 335 80 L235 80 Z"
            fill="#FFFFFF"
            opacity="0.8"
          />
          <path
            d="M390 90 Q405 75 425 80 Q445 70 465 85 L385 85 Z"
            fill="#FFFFFF"
            opacity="0.65"
          />
        </svg>

        {/* Playful Handwritten Script Slogan matching mockup */}
        <div className="absolute top-6 right-8 md:right-12 text-right pointer-events-none select-none">
          <div className="text-xl md:text-2xl font-bold tracking-tight text-[#005596] font-serif italic drop-shadow-xs flex items-center justify-end gap-1.5">
            <span>Dari Sampah</span>
          </div>
          <div className="text-xl md:text-2xl font-bold tracking-tight text-[#005596] font-serif italic drop-shadow-xs -mt-1 flex items-center justify-end gap-1.5">
            <span>Jadi Manfaat</span>
          </div>
          {/* Subtle curved underline flourish */}
          <svg
            viewBox="0 0 120 20"
            className="w-24 h-4 ml-auto -mt-1 text-[#00A3E0]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M10 10 Q60 18 110 8" />
          </svg>
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-xl">
        {/* Main Greeting */}
        <h1
          id="hero-greeting-title"
          className="text-2xl md:text-3xl font-extrabold text-[#003B6D] tracking-tight flex items-center gap-2"
        >
          <span>Halo, {nasabah.nama}</span>
          <span className="text-2xl" role="img" aria-label="ombak">
            💧
          </span>
        </h1>
        <p
          id="hero-greeting-subtitle"
          className="mt-1 text-sm md:text-base text-[#1E4E79] font-normal"
        >
          Terima kasih sudah menjadi bagian dari perubahan untuk lingkungan yang
          lebih bersih dan lestari.
        </p>

        {/* Floating Nasabah Profile Card */}
        <div
          id="floating-nasabah-card"
          className="mt-6 inline-flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 md:px-5 md:py-4 shadow-sm border border-white/80 max-w-md w-full transition-all hover:shadow-md"
        >
          <div className="flex items-center gap-3.5">
            {/* User Avatar Circle with photo or silhouette */}
            <div className="shrink-0">
              <div className="w-12 h-12 rounded-full bg-[#E0F2FE] text-[#005596] flex items-center justify-center overflow-hidden ring-2 ring-sky-100 shadow-xs">
                {nasabah.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={nasabah.avatarUrl}
                    alt={nasabah.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7 text-[#005596] translate-y-0.5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>

            {/* Name & Details */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  id="nasabah-profile-name"
                  className="font-bold text-base text-gray-900 leading-tight"
                >
                  {nasabah.nama}
                </span>
                <span
                  id="nasabah-pill-badge"
                  className="bg-[#005596] text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                >
                  Nasabah
                </span>
              </div>

              <div className="mt-1 flex flex-col gap-0.5 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-[#00A3E0] shrink-0" />
                  <span>{nasabah.unitBankSampah}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-[#00A3E0] shrink-0" />
                  <span>{nasabah.alamat}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Profil > Link Button */}
          <button
            id="btn-view-profile"
            onClick={onOpenProfile}
            className="self-end sm:self-center flex items-center gap-1 text-xs font-semibold text-[#005596] hover:text-[#003B6D] px-2.5 py-1.5 rounded-lg hover:bg-[#F0F7FC] transition-colors cursor-pointer"
          >
            <span>Profil</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
