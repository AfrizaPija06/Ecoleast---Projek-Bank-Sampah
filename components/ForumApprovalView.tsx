'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  Search,
  Landmark,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  UserCheck,
  ArrowRight,
  Plus,
  Users,
  Coins,
  ChevronRight,
  ShieldCheck,
  Package,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { BankUnit } from '@/lib/schema/types';
import { getStoredBankUnits } from '@/lib/dbStore';
import { RegisterBankUnitModal } from './RegisterBankUnitModal';

interface ForumApprovalViewProps {
  onSimulateUnitLogin?: (unit: BankUnit) => void;
  onUnitsUpdated?: () => void;
  onNavigateToTab?: (tab: string) => void;
  initialFilter?: 'all' | 'pending' | 'active';
}

export function ForumApprovalView({
  onSimulateUnitLogin,
  onUnitsUpdated,
  onNavigateToTab,
}: ForumApprovalViewProps) {
  const [units, setUnits] = useState<BankUnit[]>(() => getStoredBankUnits());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRwFilter, setSelectedRwFilter] = useState<string>('all');
  const [selectedUnit, setSelectedUnit] = useState<BankUnit | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const refreshUnits = () => {
    const updated = getStoredBankUnits();
    setUnits(updated);
    if (onUnitsUpdated) {
      onUnitsUpdated();
    }
  };

  const totalUnitsCount = units.length;
  const totalNasabahAllUnits = units.reduce((acc, u) => acc + (u.jumlahNasabah || 0), 0);
  const totalSampahAllUnits = units.reduce((acc, u) => acc + (u.totalSampahKg || 0), 0);
  const totalKasAllUnits = units.reduce((acc, u) => acc + (u.rekeningKas?.saldoKasUnit || 0), 0);

  // Available RWs
  const availableRws = Array.from(new Set(units.map((u) => u.rw))).sort();

  // Filtered units list
  const filteredUnits = units.filter((unit) => {
    const matchSearch =
      unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.rw.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.ketuaUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.kodeUnit.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (selectedRwFilter !== 'all' && unit.rw !== selectedRwFilter) {
      return false;
    }

    return true;
  });

  const handleOpenDetail = (unit: BankUnit) => {
    setSelectedUnit(unit);
    setIsDetailModalOpen(true);
    setIsCopied(false);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner Forum Desa */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Direktori & Manajemen Bank Sampah Unit
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-[#003B6D] text-xs font-bold">
                Tingkat 1 • Induk Forum Desa Cicadas
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Daftar seluruh Bank Sampah Unit RW/RT yang aktif terdaftar, monitoring kinerja, dan simulasi akses operasional unit.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onNavigateToTab && (
            <button
              type="button"
              id="btn-nav-to-peta-from-direktori"
              onClick={() => onNavigateToTab('peta_sebaran')}
              className="px-3.5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold border border-gray-200 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-[#005596]" />
              <span>Peta Wilayah Sebaran</span>
            </button>
          )}

          <button
            type="button"
            id="btn-open-register-modal"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-md shadow-[#005596]/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Bank Unit Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards (Agregasi Seluruh Unit) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Unit Terdaftar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Bank Unit Terdaftar</span>
            <Building2 className="w-4 h-4 text-[#005596]" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">
            {totalUnitsCount}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Aktif Beroperasi</span>
          </div>
        </div>

        {/* Total Nasabah se-Desa */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Nasabah se-Desa</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-gray-900">
            {totalNasabahAllUnits}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Warga terdaftar di seluruh RW
          </div>
        </div>

        {/* Total Sampah Terkelola */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Sampah Terkumpul</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-800">
            {totalSampahAllUnits.toLocaleString('id-ID')} <span className="text-sm font-semibold">kg</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Volume agregasi se-Desa Cicadas
          </div>
        </div>

        {/* Total Kas Operasional Unit */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>Total Kas Terkelola Unit</span>
            <Coins className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-xl sm:text-2xl font-black text-amber-900 truncate" title={formatRupiah(totalKasAllUnits)}>
            {formatRupiah(totalKasAllUnits)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            Akumulasi saldo kas bank unit
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="input-search-bank-unit"
            placeholder="Cari nama unit, wilayah RW, ketua unit, atau kode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-gray-500 whitespace-nowrap">Filter RW:</span>
          <select
            value={selectedRwFilter}
            onChange={(e) => setSelectedRwFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
          >
            <option value="all">Semua RW ({units.length} Unit)</option>
            {availableRws.map((rw) => (
              <option key={rw} value={rw}>
                {rw}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. Grid Cards of Bank Units */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.length > 0 ? (
          filteredUnits.map((unit) => {
            const unitUsername = `admin.${unit.rw.toLowerCase().replace(/\s+/g, '')}`;

            return (
              <div
                key={unit.id}
                id={`card-unit-${unit.id}`}
                className="bg-white rounded-3xl p-5 border border-gray-100 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between space-y-4"
              >
                {/* Header Card */}
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 text-[#005596] flex items-center justify-center font-bold text-sm shrink-0">
                        🏢
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-mono font-bold text-[#005596] bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                            {unit.kodeUnit}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Aktif
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm mt-1 line-clamp-1">
                          {unit.nama}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Wilayah / Cakupan:</span>
                      <span className="font-semibold text-gray-800">
                        {unit.rw} ({unit.rtCoverage})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Ketua Unit:</span>
                      <span className="font-semibold text-gray-800">{unit.ketuaUnit}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Kontak HP / WA:</span>
                      <span className="font-mono text-gray-700">{unit.kontakHp}</span>
                    </div>
                    <div className="flex items-start justify-between text-gray-600 gap-2">
                      <span className="text-gray-400 shrink-0">Pos Timbangan:</span>
                      <span className="font-medium text-gray-700 text-right truncate" title={unit.alamatPos}>
                        {unit.alamatPos}
                      </span>
                    </div>
                  </div>

                  {/* Highlight Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50/80 rounded-2xl border border-slate-100 mt-4 text-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Nasabah</span>
                      <span className="text-xs font-bold text-gray-900">{unit.jumlahNasabah}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Sampah</span>
                      <span className="text-xs font-bold text-emerald-700">{unit.totalSampahKg} kg</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Kas Unit</span>
                      <span className="text-[11px] font-bold text-amber-900 truncate block">
                        {formatRupiah(unit.rekeningKas?.saldoKasUnit || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(unit)}
                    className="flex-1 py-2 px-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-semibold border border-gray-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Profil & Akun</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {onSimulateUnitLogin && (
                    <button
                      type="button"
                      onClick={() => onSimulateUnitLogin(unit)}
                      title={`Masuk sebagai pengurus ${unit.nama}`}
                      className="py-2 px-3 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Buka Unit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="font-bold text-gray-700 text-sm">Tidak ada Bank Unit yang sesuai filter</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Silakan coba kata kunci pencarian lain atau daftarkan Bank Sampah Unit baru.
            </p>
            <button
              type="button"
              onClick={() => setIsRegisterModalOpen(true)}
              className="mt-2 px-4 py-2 bg-[#005596] text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Daftarkan Bank Unit Sekarang</span>
            </button>
          </div>
        )}
      </div>

      {/* 5. MODAL DETAIL UNIT & KREDENSIAL */}
      {isDetailModalOpen && selectedUnit && (
        <div
          id="modal-unit-detail-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            id="modal-unit-detail-card"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200"
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  🏢
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#005596] bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {selectedUnit.kodeUnit}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Aktif Beroperasi
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg mt-0.5">
                    {selectedUnit.nama}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Susunan Detail Box */}
            <div className="space-y-4 text-xs">
              {/* Box 1: Pengurus & Kontak */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <UserCheck className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Pengurus & Penanggung Jawab Unit</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Ketua Unit:</span>
                    <span className="font-semibold text-gray-900">{selectedUnit.ketuaUnit}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Kontak WhatsApp:</span>
                    <span className="font-medium text-gray-800 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#005596]" />
                      <span>{selectedUnit.kontakHp}</span>
                    </span>
                  </div>
                  {selectedUnit.email && (
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[11px]">Email Resmi:</span>
                      <span className="font-medium text-gray-800">{selectedUnit.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Box 2: Pos Penimbangan & Wilayah */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Pos Penimbangan & Cakupan Wilayah</span>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wilayah Pelayanan:</span>
                    <span className="font-semibold text-gray-900">{selectedUnit.rw} ({selectedUnit.rtCoverage})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Lokasi Pos Timbangan:</span>
                    <span className="font-medium text-gray-800 text-right">{selectedUnit.alamatPos}</span>
                  </div>
                </div>
              </div>

              {/* Box 3: Rekening Kas Unit */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2.5">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <CreditCard className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Rekening Kas Operasional Unit</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Bank:</span>
                    <span className="font-semibold text-gray-800">{selectedUnit.rekeningKas?.bank || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">No. Rekening:</span>
                    <span className="font-mono font-bold text-gray-900">{selectedUnit.rekeningKas?.nomorRekening || '-'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Saldo Kas:</span>
                    <span className="font-bold text-amber-900">{formatRupiah(selectedUnit.rekeningKas?.saldoKasUnit || 0)}</span>
                  </div>
                </div>
              </div>

              {/* Box 4: Kredensial Akses Pengurus */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#003B6D] flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#005596]" />
                    <span>Akun Pengurus Unit</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const uname = `admin.${selectedUnit.rw.toLowerCase().replace(/\s+/g, '')}`;
                      const text = `Akun Unit ${selectedUnit.nama}:\nUsername: ${uname}\nPassword: admin123`;
                      navigator.clipboard.writeText(text);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="text-[11px] font-bold text-[#005596] hover:text-[#003B6D] flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin Akun</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-sky-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">Username:</span>
                    <span className="font-mono font-bold text-gray-900">
                      admin.{selectedUnit.rw.toLowerCase().replace(/\s+/g, '')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">Password:</span>
                    <span className="font-mono font-bold text-gray-900">admin123</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>

              {onSimulateUnitLogin && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    onSimulateUnitLogin(selectedUnit);
                  }}
                  className="px-5 py-2 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Masuk sebagai Unit Ini</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL PENDAFTARAN UNIT BARU */}
      <RegisterBankUnitModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccessRegistered={() => {
          refreshUnits();
        }}
      />
    </div>
  );
}
