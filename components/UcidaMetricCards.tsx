'use client';

import React from 'react';
import { Trash2, Wallet, Cloud, ArrowUp } from 'lucide-react';
import { formatRupiah } from '@/lib/bankSampahData';

interface UcidaMetricCardsProps {
  totalBeratKg: number;
  totalTabunganRupiah: number;
  co2eKg: number;
}

export function UcidaMetricCards({
  totalBeratKg,
  totalTabunganRupiah,
  co2eKg,
}: UcidaMetricCardsProps) {
  // Format values
  const displayBerat = `${Math.round(totalBeratKg)} kg`;
  const displayTabungan = formatRupiah(totalTabunganRupiah);
  const displayCo2 = `${Math.round(co2eKg)} kg CO2e`;

  return (
    <div
      id="metric-cards-container"
      className="grid grid-cols-1 md:grid-cols-3 gap-5"
    >
      {/* Card 1: Total Setoran Sampah */}
      <div
        id="card-metric-total-setoran"
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm"
      >
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0">
          <Trash2 className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div>
          <span className="text-xs font-medium text-gray-500 block">
            Total Setoran Sampah
          </span>
          <div
            id="metric-val-setoran"
            className="text-2xl font-black text-gray-900 tracking-tight mt-0.5"
          >
            {displayBerat}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#005596] mt-1">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>+12 kg dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Card 2: Total Tabungan */}
      <div
        id="card-metric-total-tabungan"
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm"
      >
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0">
          <Wallet className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div>
          <span className="text-xs font-medium text-gray-500 block">
            Total Tabungan
          </span>
          <div
            id="metric-val-tabungan"
            className="text-2xl font-black text-gray-900 tracking-tight mt-0.5"
          >
            {displayTabungan}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#005596] mt-1">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>+Rp75.000 dari bulan lalu</span>
          </div>
        </div>
      </div>

      {/* Card 3: Kontribusi CO2 */}
      <div
        id="card-metric-kontribusi-co2"
        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center gap-4 transition-all hover:shadow-sm"
      >
        {/* Icon Circle */}
        <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0">
          <Cloud className="w-5 h-5 stroke-[2.2]" />
        </div>

        {/* Content */}
        <div>
          <span className="text-xs font-medium text-gray-500 block">
            Kontribusi CO₂
          </span>
          <div
            id="metric-val-co2"
            className="text-2xl font-black text-gray-900 tracking-tight mt-0.5"
          >
            {displayCo2}
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-[#005596] mt-1">
            <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            <span>+18 kg CO₂e dari bulan lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
}
