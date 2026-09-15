'use client';

import React from 'react';
import { Nasabah } from '@/lib/bankSampahData';
import { Award, Calendar, MapPin, Phone, ShieldCheck, Target } from 'lucide-react';

interface NasabahProfileCardProps {
  nasabah: Nasabah;
  totalKgThisMonth: number;
}

export const NasabahProfileCard: React.FC<NasabahProfileCardProps> = ({
  nasabah,
  totalKgThisMonth,
}) => {
  const progressPercent = Math.min(
    100,
    Math.round((totalKgThisMonth / nasabah.targetBulananKg) * 100)
  );

  return (
    <div
      id={`profile-card-${nasabah.id}`}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Avatar & Info */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="shrink-0">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-lg sm:text-xl shadow-xs overflow-hidden ${nasabah.avatarColor}`}
            >
              {nasabah.avatarUrl ? (
                <img
                  src={nasabah.avatarUrl}
                  alt={nasabah.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                nasabah.avatarInitials
              )}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                {nasabah.nama}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#005596] border border-sky-100">
                <ShieldCheck className="w-3.5 h-3.5 text-[#005596]" />
                {nasabah.id}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                {nasabah.level}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                <span>{nasabah.alamat}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                <span>{nasabah.noTelepon}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>Anggota sejak {nasabah.tanggalBergabung}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 font-medium pt-0.5">
              Unit Layanan: <span className="text-gray-700 font-semibold">{nasabah.unitBankSampah}</span>
            </p>
          </div>
        </div>

        {/* Right: Target Capaian Bulan Ini */}
        <div className="lg:w-80 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-700 mb-2">
            <span className="flex items-center gap-1 text-gray-500 font-medium">
              <Target className="w-3.5 h-3.5 text-[#005596]" />
              Target Setor Bulan Ini
            </span>
            <span className="text-[#005596] font-bold">
              {totalKgThisMonth.toFixed(1)} / {nasabah.targetBulananKg} kg
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-[#005596] h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between items-center mt-2 text-[11px] text-gray-500">
            <span>{progressPercent}% tercapai</span>
            <span>
              {progressPercent >= 100
                ? 'Target tercapai!'
                : `Kurang ${(nasabah.targetBulananKg - totalKgThisMonth).toFixed(1)} kg`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
