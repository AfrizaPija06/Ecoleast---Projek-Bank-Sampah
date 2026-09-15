'use client';

import React from 'react';
import { Nasabah } from '@/lib/bankSampahData';
import { Recycle, PlusCircle, Wallet, Users, RotateCcw } from 'lucide-react';

interface NavbarProps {
  nasabahList: Nasabah[];
  activeNasabah: Nasabah;
  onSelectNasabah: (nasabah: Nasabah) => void;
  onOpenNewDeposit: () => void;
  onOpenWithdraw: () => void;
  onResetData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  nasabahList,
  activeNasabah,
  onSelectNasabah,
  onOpenNewDeposit,
  onOpenWithdraw,
  onResetData,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-[#005596]">
              <Recycle className="w-5 h-5 sm:w-6 sm:h-6 text-[#005596]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-bold text-[#005596] tracking-tight">
                  Bank Sampah<span className="font-light text-gray-400">.</span>
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-[#005596] border border-sky-200">
                  Portal Nasabah
                </span>
              </div>
              <p className="text-xs text-gray-500 hidden sm:block">
                Rekam Jejak Setoran & Dampak Lingkungan
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Switch Nasabah Profile Dropdown */}
            <div className="relative">
              <label htmlFor="nasabah-select" className="sr-only">
                Pilih Nasabah
              </label>
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2">
                <Users className="w-4 h-4 text-gray-400 hidden sm:block" />
                <span className="text-xs font-medium text-gray-500 hidden md:inline">Akun:</span>
                <select
                  id="nasabah-select"
                  value={activeNasabah.id}
                  onChange={(e) => {
                    const selected = nasabahList.find((n) => n.id === e.target.value);
                    if (selected) onSelectNasabah(selected);
                  }}
                  className="bg-transparent text-gray-800 text-xs sm:text-sm font-medium focus:outline-none focus:ring-0 cursor-pointer pr-1"
                >
                  {nasabahList.map((n) => (
                    <option key={n.id} value={n.id} className="bg-white text-gray-800">
                      {n.nama} ({n.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Button: Tarik Saldo */}
            <button
              id="btn-tarik-saldo-nav"
              type="button"
              onClick={onOpenWithdraw}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 transition-colors shadow-xs cursor-pointer"
              title="Tarik atau tukar saldo tabungan"
            >
              <Wallet className="w-4 h-4 text-[#005596]" />
              <span className="hidden sm:inline">Tarik Saldo</span>
            </button>

            {/* Quick Button: Catat Setoran Baru */}
            <button
              id="btn-catat-setoran-nav"
              type="button"
              onClick={onOpenNewDeposit}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#005596] hover:bg-[#003B6D] text-white shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-sky-100" />
              <span>Setor Sampah</span>
            </button>

            {/* Reset Data Button */}
            <button
              type="button"
              onClick={onResetData}
              title="Reset data simulasi ke awal"
              className="p-1.5 sm:p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
