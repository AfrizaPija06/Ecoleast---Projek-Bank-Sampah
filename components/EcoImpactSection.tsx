'use client';

import React, { useState } from 'react';
import { Trees, Leaf, ShieldCheck, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface EcoImpactSectionProps {
  treesSaved: number;
  energyKwh?: number;
  waterSavedLiter?: number;
  totalKg: number;
  equivalentLedHours?: number;
  equivalentHouseholdWaterDays?: number;
  co2eKg?: number;
  equivalentMotorKm?: number;
}

export const EcoImpactSection: React.FC<EcoImpactSectionProps> = ({
  treesSaved,
  totalKg,
  co2eKg,
  equivalentMotorKm,
}) => {
  const [showEducation, setShowEducation] = useState(false);
  const displayCo2 = co2eKg !== undefined ? co2eKg : Number((totalKg * 0.85).toFixed(1));
  const displayMotorKm = equivalentMotorKm !== undefined ? equivalentMotorKm : Math.round(displayCo2 * 4.6);

  return (
    <section
      id="eco-impact-section"
      className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Dampak Ekologis Nyata
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Kontribusi Lingkungan Anda
          </h2>
          <p className="text-sm text-gray-500 mt-1 max-w-2xl">
            Setiap kilogram sampah yang Anda pilah dan setorkan ke Bank Sampah membawa perubahan nyata bagi bumi dan lingkungan sekitar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEducation(!showEducation)}
          className="self-start md:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200 transition-colors"
        >
          <Info className="w-4 h-4 text-gray-500" />
          <span>Cara Perhitungan</span>
          {showEducation ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          )}
        </button>
      </div>

      {/* 3 Tangible Impact Cards: Pohon Terlindungi, Reduksi CO2e, Pencegahan Limbah ke Tanah & Air */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 1. Pohon Terselamatkan */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-amber-200 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Trees className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Pohon Terselamatkan</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">
              {treesSaved > 0 ? treesSaved.toLocaleString('id-ID') : '0.4'}{' '}
              <span className="text-sm font-normal text-gray-400">Pohon</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
            Terhindar dari penebangan berkat setoran kardus, karton, dan kertas Anda.
          </p>
        </div>

        {/* 2. Reduksi Emisi CO2e */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-sky-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-[#005596] flex items-center justify-center mb-3">
              <Leaf className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Reduksi Emisi CO2e</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">
              {displayCo2.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-normal text-gray-400">kg</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
            Setara menetralkan perjalanan motor sejauh{' '}
            <strong className="text-gray-700 font-semibold">{displayMotorKm.toLocaleString('id-ID')} km</strong>.
          </p>
        </div>

        {/* 3. Pencegahan Limbah ke Tanah dan Air */}
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex flex-col justify-between hover:border-emerald-300 transition-all">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-gray-500">Pencegahan Limbah ke Tanah & Air</span>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 tracking-tight">
              {totalKg.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-normal text-gray-400">kg</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
            Mencegah pencemaran saluran air, sungai, dan resapan air tanah dari timbunan sampah liar.
          </p>
        </div>
      </div>

      {/* Accordion / Penjelasan Edukatif yang Sederhana & Ramah */}
      {showEducation && (
        <div className="mt-5 p-5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-[#003B6D] space-y-2.5">
          <h3 className="font-semibold text-[#003B6D] flex items-center gap-2 text-sm">
            <Info className="w-4 h-4 text-[#005596]" />
            Bagaimana angka dampak lingkungan ini dihitung?
          </h3>
          <ul className="list-disc pl-5 space-y-1.5 text-[#1E4E79] text-xs">
            <li>
              <strong>Pohon Terselamatkan:</strong> Berdasarkan standar daur ulang kertas (KLHK & USEPA), mendaur ulang 1 ton kertas menghemat sekitar 17 pohon dewasa dari penebangan liar.
            </li>
            <li>
              <strong>Reduksi Emisi CO₂e:</strong> Mengurangi potensi gas rumah kaca metana (CH₄) akibat pembusukan anaerobik di TPA atau pembakaran terbuka sampah anorganik.
            </li>
            <li>
              <strong>Pencegahan Limbah ke Tanah dan Air:</strong> Mengalihkan sampah padat plastik, kaca, logam, dan minyak jelantah agar tidak menyumbat saluran drainase, mencemari biota sungai, atau meracuni air tanah permukiman.
            </li>
          </ul>
        </div>
      )}
    </section>
  );
};
