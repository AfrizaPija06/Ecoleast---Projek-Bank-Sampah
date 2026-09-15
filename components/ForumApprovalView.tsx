'use client';

import React, { useState } from 'react';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Filter,
  FileCheck2,
  XCircle,
  Landmark,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText,
  UserCheck,
  ArrowRight,
  ShieldCheck,
  Plus,
  ExternalLink,
  Users,
  Coins,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { BankUnit, UnitStatus } from '@/lib/schema/types';
import { approveBankUnit, rejectBankUnit, getStoredBankUnits } from '@/lib/dbStore';
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
  initialFilter = 'all',
}: ForumApprovalViewProps) {
  const [units, setUnits] = useState<BankUnit[]>(() => getStoredBankUnits());
  const [activeTabFilter, setActiveTabFilter] = useState<'pending' | 'active' | 'all'>(
    initialFilter === 'pending' ? 'pending' : initialFilter === 'active' ? 'active' : 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<BankUnit | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Approval Form in Modal
  const [inputNomorSK, setInputNomorSK] = useState('');
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [approvedCredentials, setApprovedCredentials] = useState<{
    username: string;
    passwordDefault: string;
    unitNama: string;
  } | null>(null);

  const refreshUnits = () => {
    const updated = getStoredBankUnits();
    setUnits(updated);
    if (onUnitsUpdated) {
      onUnitsUpdated();
    }
  };

  const pendingUnitsCount = units.filter((u) => u.status === 'pending_review').length;
  const activeUnitsCount = units.filter((u) => u.status === 'active').length;
  const totalNasabahAllUnits = units.reduce((acc, u) => acc + (u.jumlahNasabah || 0), 0);
  const totalKasAllUnits = units.reduce((acc, u) => acc + (u.rekeningKas?.saldoKasUnit || 0), 0);

  // Filtered units list
  const filteredUnits = units.filter((unit) => {
    const matchSearch =
      unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.rw.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.ketuaUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.kodeUnit.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchSearch) return false;

    if (activeTabFilter === 'pending') {
      return unit.status === 'pending_review';
    }
    if (activeTabFilter === 'active') {
      return unit.status === 'active';
    }
    return true;
  });

  const handleOpenReview = (unit: BankUnit) => {
    setSelectedUnit(unit);
    setInputNomorSK(
      unit.nomorSK || `SK.KADES/CCD-${unit.kodeUnit.replace('-', '')}/${new Date().getFullYear()}`
    );
    setCatatanRevisi('');
    setIsRejectMode(false);
    setActionSuccessMsg(null);
    setApprovedCredentials(null);
    setIsDetailModalOpen(true);
  };

  const handleApprove = () => {
    if (!selectedUnit) return;
    const nomorSkFinal =
      inputNomorSK.trim() || `SK.FORUM-CCD/${selectedUnit.kodeUnit}/${new Date().getFullYear()}`;

    const res = approveBankUnit(
      selectedUnit.id,
      `H. Rahmat Hidayat (Ketua Forum Desa Cicadas) • SK: ${nomorSkFinal}`
    );

    if (res) {
      refreshUnits();
      setSelectedUnit(res);
      setActionSuccessMsg(`Bank Unit "${res.nama}" resmi disetujui & aktif!`);
      const defaultUsername = `admin.${res.rw.toLowerCase().replace(/\s+/g, '')}`;
      setApprovedCredentials({
        username: defaultUsername,
        passwordDefault: 'admin123',
        unitNama: res.nama,
      });
    }
  };

  const handleReject = () => {
    if (!selectedUnit) return;
    if (!catatanRevisi.trim()) {
      alert('Mohon masukkan catatan perbaikan atau alasan penolakan.');
      return;
    }

    const res = rejectBankUnit(selectedUnit.id, catatanRevisi.trim());
    if (res) {
      refreshUnits();
      setSelectedUnit(res);
      setActionSuccessMsg(`Pengajuan Bank Unit telah ditolak/diminta revisi.`);
      setIsRejectMode(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner Forum Desa */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Persetujuan & Manajemen Bank Unit
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
                Tingkat 1 • Induk Desa Cicadas
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Verifikasi pendaftaran unit baru, penerbitan SK Pengesahan Forum Desa, dan monitoring kinerja Bank Sampah Unit RW/RT.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onNavigateToTab && (
            <button
              type="button"
              id="btn-nav-to-peta-from-approval"
              onClick={() => onNavigateToTab('peta_sebaran')}
              className="px-3.5 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              <span>Buka Peta Sebaran</span>
            </button>
          )}
          <button
            type="button"
            id="btn-open-register-new-unit"
            onClick={() => setIsRegisterModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Daftarkan Bank Unit Baru</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Metric 1: Pending Approval */}
        <div
          onClick={() => setActiveTabFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTabFilter === 'pending'
              ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-[1.02]'
              : 'bg-amber-50/70 border-amber-200/80 hover:bg-amber-100/70 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Menunggu Verifikasi</span>
            <Clock className="w-4 h-4 opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2 flex items-center gap-2">
            <span>{pendingUnitsCount}</span>
            {pendingUnitsCount > 0 && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500 text-white font-bold animate-pulse">
                Perlu Tindakan
              </span>
            )}
          </div>
          <div className="text-[11px] opacity-80 mt-1">Unit diajukan warga</div>
        </div>

        {/* Metric 2: Unit Resmi Aktif */}
        <div
          onClick={() => setActiveTabFilter('active')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            activeTabFilter === 'active'
              ? 'bg-[#005596] text-white border-[#005596] shadow-md scale-[1.02]'
              : 'bg-sky-50/70 border-sky-200/80 hover:bg-sky-100/70 text-sky-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold">Bank Unit Resmi</span>
            <CheckCircle2 className="w-4 h-4 opacity-80" />
          </div>
          <div className="text-2xl sm:text-3xl font-black mt-2">{activeUnitsCount}</div>
          <div className="text-[11px] opacity-80 mt-1">Beroperasi dengan SK Desa</div>
        </div>

        {/* Metric 3: Total Nasabah Desa */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs text-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Warga Nasabah</span>
            <Users className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {totalNasabahAllUnits}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Tersebar di seluruh unit RW</div>
        </div>

        {/* Metric 4: Total Kas Keseluruhan */}
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-2xs text-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Kas Unit Desa</span>
            <Coins className="w-4 h-4 text-[#005596]" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#005596] mt-2">
            Rp {totalKasAllUnits.toLocaleString('id-ID')}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">Dana operasional gabungan</div>
        </div>
      </div>

      {/* 3. Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-2xs">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/80 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabFilter === 'all'
                ? 'bg-white text-gray-900 shadow-2xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Semua Unit ({units.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabFilter('pending')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTabFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-amber-800 hover:text-amber-950'
            }`}
          >
            <span>Menunggu Approval</span>
            {pendingUnitsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pendingUnitsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTabFilter('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTabFilter === 'active'
                ? 'bg-[#005596] text-white shadow-2xs'
                : 'text-sky-800 hover:text-sky-950'
            }`}
          >
            Resmi Aktif ({activeUnitsCount})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative min-w-[240px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Cari nama unit, RW, atau ketua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all"
          />
        </div>
      </div>

      {/* 4. Units Directory Grid / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUnits.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-3xl border border-gray-100">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <div className="text-sm font-bold text-gray-700">Tidak ada data Bank Unit</div>
            <p className="text-xs text-gray-400 mt-1">
              Tidak ditemukan unit dengan kriteria pencarian ini.
            </p>
          </div>
        ) : (
          filteredUnits.map((unit) => {
            const isPending = unit.status === 'pending_review';
            const isActive = unit.status === 'active';
            const isRejected = unit.status === 'rejected';

            return (
              <div
                key={unit.id}
                className={`bg-white rounded-3xl p-5 border transition-all hover:shadow-md flex flex-col justify-between space-y-4 ${
                  isPending
                    ? 'border-amber-300/90 ring-2 ring-amber-400/20'
                    : 'border-gray-100'
                }`}
              >
                {/* Card Top: Code & Status */}
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                    <span className="font-mono text-xs font-bold text-[#005596] bg-sky-50 px-2.5 py-1 rounded-lg">
                      {unit.kodeUnit}
                    </span>
                    {isPending && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        <span>Menunggu Verifikasi</span>
                      </span>
                    )}
                    {isActive && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-100 text-sky-900 text-[10px] font-bold">
                        <CheckCircle2 className="w-3 h-3 text-[#005596]" />
                        <span>Resmi Aktif</span>
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        <span>Ditolak / Revisi</span>
                      </span>
                    )}
                  </div>

                  {/* Unit Title & RW */}
                  <div className="mt-3">
                    <h3 className="font-bold text-gray-900 text-base leading-snug">
                      {unit.nama}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[11px] font-semibold">
                        {unit.rw}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">
                        {unit.rtCoverage}
                      </span>
                    </div>
                  </div>

                  {/* Metadata List */}
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Ketua Unit:</span>
                      <span className="font-semibold text-gray-800 truncate ml-2">
                        {unit.ketuaUnit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Kontak WA:</span>
                      <span className="font-medium text-gray-700">{unit.kontakHp}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Kas Unit:</span>
                      <span className="font-bold text-[#1B635A]">
                        Rp {(unit.rekeningKas?.saldoKasUnit || 0).toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">Warga Nasabah:</span>
                      <span className="font-semibold text-gray-800">
                        {unit.jumlahNasabah || 0} Nasabah
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenReview(unit)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                      isPending
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {isPending ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verifikasi & Setujui</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>Detail & Legalitas</span>
                      </>
                    )}
                  </button>

                  {isActive && onSimulateUnitLogin && (
                    <button
                      type="button"
                      onClick={() => onSimulateUnitLogin(unit)}
                      title="Simulasi Masuk sebagai Pengurus Unit Ini"
                      className="p-2 bg-sky-50 hover:bg-sky-100 text-[#005596] rounded-xl border border-sky-200/80 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. MODAL DETAIL & APPROVAL REVIEW UNIT */}
      {isDetailModalOpen && selectedUnit && (
        <div
          id="detail-unit-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setIsDetailModalOpen(false)}
        >
          <div
            id="detail-unit-modal-card"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                      {selectedUnit.nama}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#005596] bg-sky-50 px-2 py-0.5 rounded">
                      {selectedUnit.kodeUnit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Wilayah {selectedUnit.rw} • Cakupan: {selectedUnit.rtCoverage}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Success Alert */}
            {actionSuccessMsg && (
              <div className="p-3.5 bg-sky-50 border border-sky-200 text-sky-950 rounded-2xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-[#005596] shrink-0" />
                <span className="font-semibold">{actionSuccessMsg}</span>
              </div>
            )}

            {/* Auto-Generated Login Credentials for newly approved unit */}
            {approvedCredentials && (
              <div className="p-4 bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-sky-950 font-bold text-xs">
                  <Sparkles className="w-4 h-4 text-[#005596]" />
                  <span>Akun Login Pengurus Unit Telah Diterbitkan:</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-sky-100">
                  <div>
                    <span className="text-gray-400 block text-[11px]">Username:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {approvedCredentials.username}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[11px]">Password Awal:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {approvedCredentials.passwordDefault}
                    </span>
                  </div>
                </div>
                {onSimulateUnitLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      onSimulateUnitLogin(selectedUnit);
                    }}
                    className="w-full py-2 px-3 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1"
                  >
                    <span>Masuk sebagai Pengurus Unit ({selectedUnit.nama})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Detail Information Grids */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Box 1: Susunan Pengurus */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <UserCheck className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Pengurus Unit</span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Ketua Unit:</div>
                  <div className="font-semibold text-gray-900">{selectedUnit.ketuaUnit}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">No. WhatsApp / HP:</div>
                  <div className="font-medium text-gray-800 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#005596]" />
                    <span>{selectedUnit.kontakHp}</span>
                  </div>
                </div>
                {selectedUnit.email && (
                  <div className="space-y-1">
                    <div className="text-gray-500">Email:</div>
                    <div className="font-medium text-gray-800">{selectedUnit.email}</div>
                  </div>
                )}
              </div>

              {/* Box 2: Lokasi & Pos Timbangan */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <MapPin className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Pos Penimbangan & Wilayah</span>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Alamat Pos Timbangan:</div>
                  <div className="font-medium text-gray-800">{selectedUnit.alamatPos}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-gray-500">Wilayah Layanan:</div>
                  <div className="font-semibold text-gray-900">
                    {selectedUnit.rw} ({selectedUnit.rtCoverage})
                  </div>
                </div>
              </div>

              {/* Box 3: Rekening Kas Operasional */}
              <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 sm:col-span-2">
                <div className="font-bold text-gray-900 flex items-center gap-1.5 pb-1 border-b border-gray-200">
                  <CreditCard className="w-3.5 h-3.5 text-[#005596]" />
                  <span>Rekening Kas Operasional Unit</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-gray-500 block">Nama Bank:</span>
                    <span className="font-bold text-gray-800">
                      {selectedUnit.rekeningKas?.bank || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Nomor Rekening:</span>
                    <span className="font-mono font-bold text-gray-800">
                      {selectedUnit.rekeningKas?.nomorRekening || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Atas Nama:</span>
                    <span className="font-medium text-gray-800">
                      {selectedUnit.rekeningKas?.namaPemilik || '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Legalitas SK Forum Desa */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Status Legalitas Desa:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    selectedUnit.status === 'active'
                      ? 'bg-sky-100 text-sky-950'
                      : selectedUnit.status === 'pending_review'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-900'
                  }`}
                >
                  {selectedUnit.status === 'active'
                    ? 'Resmi Aktif (SK Desa Terbit)'
                    : selectedUnit.status === 'pending_review'
                    ? 'Menunggu Verifikasi Forum Desa'
                    : 'Ditolak / Revisi'}
                </span>
              </div>

              {selectedUnit.status === 'active' && (
                <div className="pt-2 border-t border-gray-200 text-gray-600 space-y-1">
                  <div>
                    Nomor SK Pengesahan: <b>{selectedUnit.nomorSK || '-'}</b>
                  </div>
                  <div>
                    Tanggal Disetujui: <b>{selectedUnit.tanggalDisetujui || '-'}</b>
                  </div>
                  <div>
                    Diverifikasi Oleh: <b>{selectedUnit.disetujuiOleh || 'Forum Desa Cicadas'}</b>
                  </div>
                </div>
              )}

              {selectedUnit.status === 'rejected' && selectedUnit.catatanVerifikasi && (
                <div className="pt-2 border-t border-gray-200 text-rose-700">
                  Catatan Revisi/Alasan Penolakan: <b>{selectedUnit.catatanVerifikasi}</b>
                </div>
              )}
            </div>

            {/* FORM APPROVAL ATAU REJECT (HANYA MUNCUL JIKA PENDING_REVIEW) */}
            {selectedUnit.status === 'pending_review' && !approvedCredentials && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Keputusan Verifikasi Forum Bank Sampah Desa Cicadas</span>
                </h4>

                {!isRejectMode ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-amber-900">
                        Nomor SK Pengesahan Forum Desa Cicadas
                      </label>
                      <input
                        type="text"
                        value={inputNomorSK}
                        onChange={(e) => setInputNomorSK(e.target.value)}
                        placeholder="Contoh: SK.KADES/CCD-U03/2024"
                        className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                      />
                      <p className="text-[10px] text-amber-700">
                        Format resmi Forum Desa Cicadas untuk pendaftaran unit baru.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        id="btn-confirm-approve-unit"
                        onClick={handleApprove}
                        className="flex-1 py-2.5 px-4 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>Setujui & Terbitkan SK Forum Desa</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsRejectMode(true)}
                        className="py-2.5 px-3 bg-white border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Tolak / Minta Revisi
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-rose-900">
                        Alasan Penolakan / Catatan Perbaikan Berkas
                      </label>
                      <textarea
                        rows={2}
                        value={catatanRevisi}
                        onChange={(e) => setCatatanRevisi(e.target.value)}
                        placeholder="Contoh: Lampirkan surat pengantar dari Ketua RW setempat atau perjelas lokasi pos timbangan."
                        className="w-full px-3 py-2 text-xs bg-white border border-rose-300 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleReject}
                        className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kirim Penolakan & Catatan
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRejectMode(false)}
                        className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PENDAFTARAN UNIT BARU */}
      <RegisterBankUnitModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSuccessRegistered={() => {
          refreshUnits();
          setActiveTabFilter('pending');
        }}
      />
    </div>
  );
}
