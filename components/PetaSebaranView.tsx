'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Building2,
  Users,
  Package,
  Wallet,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Layers,
  Compass,
  Phone,
  Mail,
  ChevronRight,
  X,
  Eye,
  Check,
  Scale,
  RefreshCw,
} from 'lucide-react';
import { BankUnit, UnitStatus } from '@/lib/schema/types';
import { getStoredBankUnits } from '@/lib/dbStore';
import { formatRupiah } from '@/lib/bankSampahData';

interface PetaSebaranViewProps {
  onSimulateUnitLogin?: (unit: BankUnit) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function PetaSebaranView({
  onSimulateUnitLogin,
  onNavigateToTab,
}: PetaSebaranViewProps) {
  const [units, setUnits] = useState<BankUnit[]>(() => getStoredBankUnits());
  const [selectedUnitId, setSelectedUnitId] = useState<string>(() => {
    const list = getStoredBankUnits();
    return list[0]?.id || 'UNIT-CCD-001';
  });
  const [mapMode, setMapMode] = useState<'wilayah' | 'skematik'>('wilayah');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'sampah' | 'nasabah' | 'saldo' | 'nama'>('sampah');
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Refresh units from storage if needed
  const handleRefresh = () => {
    const fresh = getStoredBankUnits();
    setUnits(fresh);
  };

  // Filtered and sorted units
  const filteredUnits = useMemo(() => {
    return units
      .filter((unit) => {
        const matchSearch =
          unit.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.rw.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.ketuaUnit.toLowerCase().includes(searchQuery.toLowerCase()) ||
          unit.kodeUnit.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchSearch) return false;

        if (filterStatus === 'active') return unit.status === 'active';
        if (filterStatus === 'pending') return unit.status === 'pending_review';
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'sampah') return (b.totalSampahKg || 0) - (a.totalSampahKg || 0);
        if (sortBy === 'nasabah') return (b.jumlahNasabah || 0) - (a.jumlahNasabah || 0);
        if (sortBy === 'saldo') {
          return (b.rekeningKas?.saldoKasUnit || 0) - (a.rekeningKas?.saldoKasUnit || 0);
        }
        return a.nama.localeCompare(b.nama);
      });
  }, [units, searchQuery, filterStatus, sortBy]);

  const selectedUnit = useMemo(() => {
    return units.find((u) => u.id === selectedUnitId) || units[0] || null;
  }, [units, selectedUnitId]);

  // Overall Statistics
  const totalSampahDesa = useMemo(() => {
    return units.reduce((acc, u) => acc + (u.totalSampahKg || 0), 0);
  }, [units]);

  const totalNasabahDesa = useMemo(() => {
    return units.reduce((acc, u) => acc + (u.jumlahNasabah || 0), 0);
  }, [units]);

  const totalSaldoKasDesa = useMemo(() => {
    return units.reduce((acc, u) => acc + (u.rekeningKas?.saldoKasUnit || 0), 0);
  }, [units]);

  const totalUnitAktif = useMemo(() => {
    return units.filter((u) => u.status === 'active').length;
  }, [units]);

  const handleCopyPhone = (phone: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    }
  };

  const getStatusBadge = (status: UnitStatus) => {
    switch (status) {
      case 'active':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Aktif Beroperasi
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Ditangguhkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Section */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold">
              <Compass className="w-3.5 h-3.5 text-[#005596]" />
              <span>Fitur Utama Forum Desa • Geospasial Multi-Unit</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">
              Peta & Sebaran Bank Sampah Desa
            </h1>
            <p className="text-xs md:text-sm text-gray-600 max-w-2xl leading-relaxed">
              Pantau seluruh Bank Sampah Unit tingkat RW se-Desa Cicadas dalam satu tampilan terpadu.
              Klik unit untuk memeriksa status, timbulan sampah, saldo kas, dan aktivitas terakhir tanpa perlu login satu per satu.
            </p>
          </div>

          {/* Quick Metrics Header */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              id="btn-refresh-map-data"
              onClick={handleRefresh}
              className="px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              <span>Segarkan Data</span>
            </button>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab('daftar_unit')}
                className="px-3.5 py-2 rounded-xl bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Daftar & Manajemen Unit</span>
              </button>
            )}
          </div>
        </div>

        {/* Aggregate Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
              <span>Total Unit Terdata</span>
              <Building2 className="w-4 h-4 text-[#005596]" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{units.length}</span>
              <span className="text-xs text-emerald-600 font-bold">({totalUnitAktif} Aktif)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Cakupan 4 RW se-Desa</p>
          </div>

          <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200/80">
            <div className="flex items-center justify-between text-emerald-700 text-xs font-medium">
              <span>Sampah Terkumpul</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-900">
                {totalSampahDesa.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-bold text-emerald-700">kg</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">Akumulasi seluruh RW</p>
          </div>

          <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-200/80">
            <div className="flex items-center justify-between text-sky-700 text-xs font-medium">
              <span>Total Nasabah Warga</span>
              <Users className="w-4 h-4 text-[#005596]" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-black text-sky-950">{totalNasabahDesa}</span>
              <span className="text-xs font-bold text-sky-800">warga</span>
            </div>
            <p className="text-[11px] text-sky-700 mt-1">Terdaftar aktif ber-KTP</p>
          </div>

          <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80">
            <div className="flex items-center justify-between text-amber-700 text-xs font-medium">
              <span>Total Kas Unit</span>
              <Wallet className="w-4 h-4 text-amber-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-black text-amber-950 truncate">
                {formatRupiah(totalSaldoKasDesa)}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">Saldo tersimpan di kas unit</p>
          </div>
        </div>
      </div>

      {/* 2. Map Layout Control & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            id="btn-map-mode-wilayah"
            onClick={() => setMapMode('wilayah')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'wilayah'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#005596]" />
            <span>Peta Wilayah Desa</span>
          </button>
          <button
            id="btn-map-mode-skematik"
            onClick={() => setMapMode('skematik')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              mapMode === 'skematik'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Visual Map (Nodes)</span>
          </button>
        </div>

        {/* Right: Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap flex-1 justify-end">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari unit, RW, pengurus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596]"
            />
          </div>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#005596]/30"
          >
            <option value="all">Semua Status ({units.length})</option>
            <option value="active">Aktif Beroperasi ({totalUnitAktif})</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-[#005596]/30"
          >
            <option value="sampah">Sampah Terbanyak (kg)</option>
            <option value="nasabah">Nasabah Terbanyak</option>
            <option value="saldo">Saldo Kas Tertinggi</option>
            <option value="nama">Nama Unit (A-Z)</option>
          </select>
        </div>
      </div>

      {/* 3. Main Map & Inspector Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Map Canvas (7 cols on LG) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
          <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-xs flex-1 flex flex-col">
            {/* Map Canvas Header Bar */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">
                  {mapMode === 'wilayah' ? 'Peta Geografis Desa Cicadas' : 'Diagram Sebaran Jaringan Bank Unit'}
                </span>
                <span className="text-[11px] text-gray-500">
                  • Klik sembarang pin untuk melihat kondisi
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#005596] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                {filteredUnits.length} Unit Terpantau
              </span>
            </div>

            {/* Interactive Canvas Area */}
            <div className="relative w-full h-[460px] md:h-[520px] rounded-2xl overflow-hidden border border-slate-200/90 bg-gradient-to-br from-slate-50 via-emerald-50/20 to-sky-50/30 select-none flex items-center justify-center">
              {/* Topographic & Vector Map SVG Layer */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Subtle Grid Pattern */}
                  <pattern id="villageGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="0.75"
                      strokeDasharray="2 4"
                    />
                  </pattern>
                  <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.8" />
                  </linearGradient>
                </defs>

                {/* Grid Background */}
                <rect width="100%" height="100%" fill="url(#villageGrid)" />

                {/* Territory Outlines of Cicadas Wards */}
                <g opacity="0.6">
                  {/* Dusun 1 Zone */}
                  <path
                    d="M 10 10 Q 250 30 380 90 T 300 240 Q 120 220 20 180 Z"
                    fill="#F0FDF4"
                    stroke="#86EFAC"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Dusun 2 Zone */}
                  <path
                    d="M 20 200 Q 220 210 240 380 T 100 480 Q 20 400 10 240 Z"
                    fill="#F8FAFC"
                    stroke="#CBD5E1"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Dusun 3 Zone */}
                  <path
                    d="M 380 90 Q 560 120 700 240 T 520 420 Q 320 380 300 240 Z"
                    fill="#EFF6FF"
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Dusun 4 Zone */}
                  <path
                    d="M 240 380 Q 420 380 520 420 T 360 520 Q 180 500 100 480 Z"
                    fill="#FEFCE8"
                    stroke="#FDE047"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                </g>

                {/* River Kali Cileungsi / Cicadas River Path */}
                <path
                  d="M -10 320 C 140 280, 240 340, 360 290 S 600 360, 850 300"
                  fill="none"
                  stroke="url(#riverGrad)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M -10 320 C 140 280, 240 340, 360 290 S 600 360, 850 300"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                  opacity="0.9"
                />

                {/* Main Arterial Road (Jl. Raya Wanaherang - Cicadas) */}
                <path
                  d="M 50 -10 L 350 250 L 520 540"
                  fill="none"
                  stroke="#F1F5F9"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M 50 -10 L 350 250 L 520 540"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeDasharray="8 6"
                />

                {/* Secondary Cross Village Road */}
                <path
                  d="M 0 150 Q 300 180 750 200"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 0 150 Q 300 180 750 200"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />

                {/* Central Hub: Kantor Balai Desa Cicadas (Induk Forum) */}
                <g transform="translate(350, 250)">
                  <circle r="22" fill="#005596" fillOpacity="0.12" />
                  <circle r="14" fill="#005596" stroke="#FFFFFF" strokeWidth="2.5" />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    🏛️
                  </text>
                </g>
              </svg>

              {/* Central Forum Desa Landmark Marker */}
              <div
                className="absolute z-10 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                style={{ left: '50%', top: '50%' }}
              >
                <div className="mt-7 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-[10px] font-bold shadow-md border border-white/20 whitespace-nowrap flex items-center gap-1.5 backdrop-blur-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span>Forum Balai Desa Cicadas</span>
                </div>
              </div>

              {/* Map Direction Compass Compass Rose */}
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-xs p-2 rounded-xl border border-gray-200 shadow-xs flex items-center gap-1.5 text-[11px] text-gray-700 font-bold">
                <div className="w-5 h-5 rounded-full border border-sky-700 flex items-center justify-center text-[10px] text-sky-800">
                  U
                </div>
                <span>Desa Cicadas</span>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 z-10 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200/90 shadow-sm text-[11px] space-y-1">
                <div className="font-bold text-gray-800 text-[10px] uppercase tracking-wider">
                  Keterangan Peta
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-2xs" />
                  <span>Bank Unit Aktif</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#005596] border border-white shadow-2xs" />
                  <span>Balai Desa (Forum Induk)</span>
                </div>
              </div>

              {/* Interactive Unit Nodes / Pins on the Map */}
              {filteredUnits.map((unit, index) => {
                const isSelected = unit.id === selectedUnit?.id;

                // Fallback positions if koordinatPeta is missing
                const fallbackCoords = [
                  { x: 28, y: 22 },
                  { x: 20, y: 52 },
                  { x: 74, y: 46 },
                  { x: 48, y: 78 },
                  { x: 80, y: 24 },
                  { x: 30, y: 84 },
                ];
                const pos = unit.koordinatPeta || fallbackCoords[index % fallbackCoords.length];

                return (
                  <div
                    key={unit.id}
                    id={`map-node-${unit.id}`}
                    onClick={() => setSelectedUnitId(unit.id)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className={`absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group ${
                      isSelected ? 'scale-110 z-30' : 'hover:scale-105'
                    }`}
                  >
                    {/* Connecting line to Forum center if selected in Schematic mode */}
                    {mapMode === 'skematik' && (
                      <div
                        className={`absolute w-0.5 bg-gradient-to-b from-[#005596] to-transparent pointer-events-none opacity-40 ${
                          isSelected ? 'opacity-80' : ''
                        }`}
                      />
                    )}

                    {/* Radar Pulse Beacon */}
                    {unit.status === 'active' && (
                      <span
                        className={`absolute -inset-2 rounded-full pointer-events-none animate-ping opacity-30 ${
                          isSelected ? 'bg-[#005596]' : 'bg-emerald-500'
                        }`}
                      />
                    )}

                    {/* Main Node Card Element */}
                    <div
                      className={`flex flex-col items-center p-2 rounded-2xl transition-all shadow-md backdrop-blur-md ${
                        isSelected
                          ? 'bg-slate-900 text-white ring-4 ring-[#005596]/40 shadow-xl border border-sky-400'
                          : 'bg-white text-gray-900 hover:bg-sky-50 border border-gray-200'
                      }`}
                    >
                      {/* Node Pin Header: Icon + Unit Name */}
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            unit.status === 'active'
                              ? isSelected
                                ? 'bg-[#005596] text-white'
                                : 'bg-emerald-600 text-white'
                              : 'bg-amber-500 text-white'
                          }`}
                        >
                          <Building2 className="w-3 h-3" />
                        </div>
                        <span
                          className={`text-xs font-black tracking-tight whitespace-nowrap ${
                            isSelected ? 'text-white' : 'text-gray-900'
                          }`}
                        >
                          {unit.nama.replace('Bank Sampah ', 'Unit ')}
                        </span>
                      </div>

                      {/* Waste Weight Pill (Exactly like reference diagram: e.g. "175 kg") */}
                      <div className="mt-1 flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-black tracking-wide ${
                            isSelected
                              ? 'bg-emerald-500 text-slate-950 shadow-xs'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {(unit.totalSampahKg || 0).toLocaleString('id-ID')} kg
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isSelected ? 'text-sky-300' : 'text-gray-500'
                          }`}
                        >
                          • {unit.rw}
                        </span>
                      </div>
                    </div>

                    {/* Arrow down pointer */}
                    <div
                      className={`w-2.5 h-2.5 mx-auto transform rotate-45 -translate-y-1.5 ${
                        isSelected ? 'bg-slate-900 border-r border-b border-sky-400' : 'bg-white border-r border-b border-gray-200'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Bottom Quick Bar */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 px-1">
              <span>
                💡 <b>Petunjuk Forum</b>: Klik salah satu kartu pin di atas untuk membuka detail operasional unit tanpa perlu login manual.
              </span>
            </div>
          </div>
        </div>

        {/* Right: Detailed Unit Inspector ("Klik unit -> muncul") */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
          {selectedUnit ? (
            <div
              id="unit-inspector-card"
              className="bg-white rounded-3xl p-6 border-2 border-[#005596]/30 shadow-lg flex-1 flex flex-col justify-between space-y-6 animate-in fade-in slide-in-from-right-3 duration-200"
            >
              {/* Top Banner of Selected Unit */}
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] border border-sky-200 flex items-center justify-center font-bold text-lg shadow-xs">
                      🏢
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold text-[#005596] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                          {selectedUnit.kodeUnit}
                        </span>
                        {getStatusBadge(selectedUnit.status)}
                      </div>
                      <h2 className="text-lg font-black text-gray-900 mt-1">
                        {selectedUnit.nama}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Subtitle / Territory Info */}
                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Wilayah / RT Cakupan:</span>
                    <span className="font-semibold text-gray-800">
                      {selectedUnit.rw} ({selectedUnit.rtCoverage})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Posko Operasional:</span>
                    <span className="font-semibold text-gray-800 truncate max-w-[200px]" title={selectedUnit.alamatPos}>
                      {selectedUnit.alamatPos}
                    </span>
                  </div>
                </div>

                {/* THE 6 CORE REQUIREMENTS FROM USER SPEC:
                    1. Nama unit (Shown above)
                    2. Jumlah nasabah
                    3. Sampah terkumpul
                    4. Saldo
                    5. Aktivitas terakhir
                    6. Status unit (Badge shown above)
                */}
                <div className="space-y-3 pt-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Kondisi & Indikator Utama Unit
                  </div>

                  {/* 2. JUMLAH NASABAH */}
                  <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-[#005596] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">Jumlah Nasabah</div>
                        <div className="text-base font-black text-gray-900">
                          {selectedUnit.jumlahNasabah} Warga Terdaftar
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-sky-700 bg-white px-2.5 py-1 rounded-full border border-sky-200 shadow-2xs">
                      {selectedUnit.jumlahNasabah > 0 ? 'Aktif Menabung' : 'Baru Dibuka'}
                    </span>
                  </div>

                  {/* 3. SAMPAH TERKUMPUL */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">Sampah Terkumpul</div>
                        <div className="text-base font-black text-emerald-900">
                          {(selectedUnit.totalSampahKg || 0).toLocaleString('id-ID')} kg
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      {selectedUnit.totalSampahKg >= 300 ? 'Volume Tinggi' : 'Volume Sedang'}
                    </span>
                  </div>

                  {/* 4. SALDO */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">Saldo Kas Unit</div>
                        <div className="text-base font-black text-amber-950">
                          {formatRupiah(selectedUnit.rekeningKas?.saldoKasUnit || 0)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-800 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                      {selectedUnit.rekeningKas?.bank || 'Kas RW'}
                    </span>
                  </div>

                  {/* 5. AKTIVITAS TERAKHIR */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#005596]" />
                        <span>Aktivitas Terakhir</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200">
                        Terverifikasi
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed">
                      {selectedUnit.aktivitasTerakhir ||
                        'Belum ada penimbangan baru minggu ini • Jadwal rutin penimbangan setiap Sabtu pagi.'}
                    </p>
                  </div>

                  {/* Pengurus & Kontak Ringkas */}
                  <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Ketua Pengurus:</span>
                      <span className="font-bold text-gray-800">{selectedUnit.ketuaUnit}</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-gray-400">Kontak HP / WA:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-gray-800">{selectedUnit.kontakHp}</span>
                        <button
                          onClick={() => handleCopyPhone(selectedUnit.kontakHp)}
                          className="px-2 py-0.5 text-[10px] bg-white border border-gray-200 rounded-md hover:bg-gray-100 font-semibold cursor-pointer"
                        >
                          {copiedPhone === selectedUnit.kontakHp ? 'Tersalin ✓' : 'Salin'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Forum Super Admin */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                {onSimulateUnitLogin && (
                  <button
                    id="btn-simulate-unit-from-map"
                    onClick={() => onSimulateUnitLogin(selectedUnit)}
                    className="w-full py-2.5 px-4 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Masuk Langsung ke Akun Unit Ini</span>
                  </button>
                )}

                <p className="text-center text-[10px] text-gray-400">
                  Super Admin Forum Desa memiliki akses inspeksi & supervisi penuh.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center flex-1 flex flex-col items-center justify-center text-gray-400 space-y-3">
              <MapPin className="w-10 h-10 text-gray-300" />
              <p className="text-xs">Pilih salah satu Bank Sampah Unit pada peta untuk melihat detail.</p>
            </div>
          )}
        </div>
      </div>

      {/* 4. Comprehensive Unit Status Matrix Table */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-black text-gray-900">
              Daftar Ringkasan Sebaran Kondisi Bank Unit
            </h3>
            <p className="text-xs text-gray-500">
              Perbandingan metrik kunci seluruh unit bank sampah se-Desa Cicadas dalam format tabel ringkas.
            </p>
          </div>
          <span className="text-xs font-semibold text-gray-500">
            Total {filteredUnits.length} dari {units.length} unit
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Nama Unit & Kode</th>
                <th className="pb-3">Wilayah RW</th>
                <th className="pb-3">Status Unit</th>
                <th className="pb-3 text-right">Nasabah</th>
                <th className="pb-3 text-right">Sampah Terkumpul</th>
                <th className="pb-3 text-right">Saldo Kas</th>
                <th className="pb-3 pl-4">Aktivitas Terakhir</th>
                <th className="pb-3 text-center pr-2">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {filteredUnits.map((unit) => {
                const isSelected = unit.id === selectedUnit?.id;
                return (
                  <tr
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`hover:bg-sky-50/50 transition-colors cursor-pointer ${
                      isSelected ? 'bg-sky-50/70 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 pl-2">
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        <span>{unit.nama}</span>
                        {isSelected && (
                          <span className="text-[9px] bg-[#005596] text-white px-1.5 py-0.5 rounded font-bold">
                            Terpilih
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-400">{unit.kodeUnit} • Ketua: {unit.ketuaUnit}</div>
                    </td>
                    <td className="py-3 font-semibold text-gray-800">{unit.rw}</td>
                    <td className="py-3">{getStatusBadge(unit.status)}</td>
                    <td className="py-3 text-right font-bold text-gray-900">
                      {unit.jumlahNasabah} <span className="text-gray-400 font-normal">warga</span>
                    </td>
                    <td className="py-3 text-right">
                      <span className="font-black text-emerald-700">
                        {(unit.totalSampahKg || 0).toLocaleString('id-ID')} kg
                      </span>
                    </td>
                    <td className="py-3 text-right font-black text-amber-900">
                      {formatRupiah(unit.rekeningKas?.saldoKasUnit || 0)}
                    </td>
                    <td className="py-3 pl-4 text-[11px] text-gray-600 max-w-xs truncate" title={unit.aktivitasTerakhir}>
                      {unit.aktivitasTerakhir || '-'}
                    </td>
                    <td className="py-3 text-center pr-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUnitId(unit.id);
                          }}
                          className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-semibold cursor-pointer"
                        >
                          Lihat
                        </button>
                        {onSimulateUnitLogin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSimulateUnitLogin(unit);
                            }}
                            className="px-2 py-1 rounded-lg bg-[#005596] hover:bg-[#003B6D] text-white text-[11px] font-semibold cursor-pointer"
                            title="Masuk sebagai pengurus unit ini"
                          >
                            Masuk
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
