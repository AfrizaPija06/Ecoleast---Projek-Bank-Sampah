'use client';

import React from 'react';
import { formatRupiah } from '@/lib/bankSampahData';
import { Wallet, Scale, CloudRain, Sparkles, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  totalSaldoAktif: number;
  totalNilaiAkumulasi: number;
  totalKg: number;
  frekuensiSetoran: number;
  co2eKg: number;
  equivalentMotorKm: number;
  poinHijau: number;
  onOpenWithdraw: () => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalSaldoAktif,
  totalNilaiAkumulasi,
  totalKg,
  frekuensiSetoran,
  co2eKg,
  equivalentMotorKm,
  poinHijau,
  onOpenWithdraw,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* 1. Total Sampah Terkelola */}
      <div
        id="metric-total-sampah"
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Total Setoran
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#005596] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {totalKg.toLocaleString('id-ID')}{' '}
            <span className="text-lg font-normal text-gray-400">kg</span>
          </h2>
        </div>
        <div className="mt-3 flex items-center text-xs text-[#005596] font-medium">
          <span>{frekuensiSetoran} kali penimbangan tercatat</span>
        </div>
      </div>

      {/* 2. Saldo Tabungan */}
      <div
        id="metric-saldo-tabungan"
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Saldo Tabungan
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#005596] flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {formatRupiah(totalSaldoAktif)}
          </h2>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>Riwayat: {formatRupiah(totalNilaiAkumulasi)}</span>
          <button
            type="button"
            onClick={onOpenWithdraw}
            className="inline-flex items-center text-xs font-semibold text-[#005596] hover:text-[#003B6D] cursor-pointer"
          >
            Tarik <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* 3. Dampak Lingkungan (Corporate Blue Card) */}
      <div
        id="metric-reduksi-karbon"
        className="bg-[#005596] p-6 rounded-2xl shadow-sm text-white flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider">
              Dampak Lingkungan
            </span>
            <div className="w-8 h-8 rounded-lg bg-white/20 text-white flex items-center justify-center">
              <CloudRain className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {co2eKg.toLocaleString('id-ID')}{' '}
            <span className="text-lg font-normal opacity-80">kg CO₂</span>
          </h2>
        </div>
        <p className="mt-3 text-xs text-sky-100">
          Setara ~{equivalentMotorKm.toLocaleString('id-ID')} km perjalanan motor
        </p>
      </div>

      {/* 4. Poin Hijau Nasabah */}
      <div
        id="metric-poin-hijau"
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Poin Nasabah
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            {poinHijau.toLocaleString('id-ID')}{' '}
            <span className="text-lg font-normal text-gray-400">Poin</span>
          </h2>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          Dapat ditukar sembako & token PLN
        </p>
      </div>
    </div>
  );
};
