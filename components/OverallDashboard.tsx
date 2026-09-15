'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Wallet,
  Users,
  TrendingUp,
  Leaf,
  Droplets,
  Zap,
  Trees,
  PlusCircle,
  ArrowDownCircle,
  ChevronRight,
  FileText,
  Calendar,
  ShieldCheck,
  Award,
  ArrowUpRight,
  Layers,
  Scale,
  Building,
  CheckCircle2,
  PieChart as PieChartIcon,
  Sparkles,
  UserCheck,
  UserPlus,
  MapPin,
  Compass,
  Clock,
  Building2,
  ExternalLink,
  Package,
  Recycle,
} from 'lucide-react';
import { BankUnit } from '@/lib/schema/types';
import { getStoredBankUnits, getDesaAggregatedStats } from '@/lib/dbStore';
import {
  Nasabah,
  SetoranRecord,
  formatRupiah,
  formatDateIndo,
  calculateImpact,
  WASTE_CATEGORIES,
} from '@/lib/bankSampahData';

interface OverallDashboardProps {
  nasabahList: Nasabah[];
  allSetoranRecords: SetoranRecord[];
  onOpenNewDeposit: () => void;
  onOpenWithdraw: () => void;
  onSelectRecord: (record: SetoranRecord) => void;
  onViewAllRecords: () => void;
  onSelectNasabah: (nasabah: Nasabah) => void;
  onNavigateToTab: (tab: string) => void;
  onOpenRegisterNasabah?: () => void;
  unitName?: string;
  isForumView?: boolean;
}

export function OverallDashboard({
  nasabahList,
  allSetoranRecords,
  onOpenNewDeposit,
  onOpenWithdraw,
  onSelectRecord,
  onViewAllRecords,
  onSelectNasabah,
  onNavigateToTab,
  onOpenRegisterNasabah,
  unitName = 'Bank Sampah Unit RW 03',
  isForumView = false,
}: OverallDashboardProps) {
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'month' | 'year'>('all');
  const [forumUnits] = useState<BankUnit[]>(() => (isForumView ? getStoredBankUnits() : []));
  const [selectedForumUnitId, setSelectedForumUnitId] = useState<string>('UNIT-CCD-001');
  // Forum view filter: 'all' aggregates all bank units, or a specific unitId
  const [forumFilterUnitId, setForumFilterUnitId] = useState<string>('all');

  const desaAggregated = React.useMemo(() => {
    return getDesaAggregatedStats();
  }, []);

  const allActiveUnits = React.useMemo(() => {
    const list = forumUnits.length > 0 ? forumUnits : desaAggregated.activeUnits;
    return list.filter((u) => u.status === 'active');
  }, [forumUnits, desaAggregated]);

  const activeFilterUnit = React.useMemo(() => {
    if (forumFilterUnitId === 'all') return null;
    return allActiveUnits.find((u) => u.id === forumFilterUnitId) || null;
  }, [allActiveUnits, forumFilterUnitId]);

  const selectedForumUnit = React.useMemo(() => {
    return forumUnits.find((u) => u.id === selectedForumUnitId) || forumUnits[0] || null;
  }, [forumUnits, selectedForumUnitId]);

  // Filter records based on selected period
  const filteredRecords = React.useMemo(() => {
    if (filterPeriod === 'all') return allSetoranRecords;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    return allSetoranRecords.filter((rec) => {
      const recDate = new Date(rec.tanggal);
      if (filterPeriod === 'year') {
        return recDate.getFullYear() === currentYear;
      }
      if (filterPeriod === 'month') {
        return (
          recDate.getFullYear() === currentYear &&
          recDate.getMonth() === currentMonth
        );
      }
      return true;
    });
  }, [allSetoranRecords, filterPeriod]);

  // Aggregate stats across the entire dataset passed to this component
  const overallImpact = React.useMemo(() => {
    return calculateImpact(filteredRecords);
  }, [filteredRecords]);

  // Records used specifically for the Category Breakdown & Eco Impact cards
  const breakdownRecords = React.useMemo(() => {
    if (!isForumView || forumFilterUnitId === 'all') {
      return filteredRecords;
    }
    return filteredRecords.filter((r) => r.unitId === forumFilterUnitId);
  }, [filteredRecords, isForumView, forumFilterUnitId]);

  const breakdownImpact = React.useMemo(() => {
    return calculateImpact(breakdownRecords);
  }, [breakdownRecords]);

  // Total Berat Sampah Keseluruhan (Kg)
  const totalBeratKeseluruhan = overallImpact.totalKg;

  // Total Nilai Transaksi Sampah Keseluruhan (Rp)
  const totalNilaiGross = overallImpact.totalNilaiRupiah;

  // Total Saldo Aktif Seluruh Nasabah (Rp)
  const totalSaldoAktifSemuaNasabah = React.useMemo(() => {
    return nasabahList.reduce((sum, n) => {
      const records = allSetoranRecords.filter((r) => r.nasabahId === n.id);
      const totalEarned = records.reduce((s, r) => s + r.totalNilai, 0);
      const saldo = Math.max(0, totalEarned - (n.saldoTarik || 0));
      return sum + saldo;
    }, 0);
  }, [nasabahList, allSetoranRecords]);

  // Total Saldo yang sudah ditarik warga
  const totalDanaDitarikWarga = React.useMemo(() => {
    return nasabahList.reduce((sum, n) => sum + (n.saldoTarik || 0), 0);
  }, [nasabahList]);

  // Total Nasabah Aktif Terdaftar
  const totalNasabah = nasabahList.length;

  // Total Transaksi Penimbangan
  const totalTransaksi = filteredRecords.length;

  // Total Unit Bank Sampah (Unique from nasabahList)
  const totalUnit = React.useMemo(() => {
    return new Set(nasabahList.map((n) => n.unitBankSampah).filter(Boolean)).size;
  }, [nasabahList]);

  // Recent 6 transactions from all nasabah (sorted newest first)
  const recentOverallTransactions = React.useMemo(() => {
    return [...filteredRecords]
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 6);
  }, [filteredRecords]);

  // Top 5 Contributors (Nasabah dengan total berat setoran terbanyak)
  const topContributors = React.useMemo(() => {
    const list = nasabahList.map((n) => {
      const records = allSetoranRecords.filter((r) => r.nasabahId === n.id);
      const totalKg = records.reduce((s, r) => s + r.totalBerat, 0);
      const totalRp = records.reduce((s, r) => s + r.totalNilai, 0);
      const saldo = Math.max(0, totalRp - (n.saldoTarik || 0));
      return {
        nasabah: n,
        totalKg: Number(totalKg.toFixed(1)),
        totalRp,
        saldo,
        transactionCount: records.length,
      };
    });

    return list.sort((a, b) => b.totalKg - a.totalKg).slice(0, 5);
  }, [nasabahList, allSetoranRecords]);

  // Category breakdown list (dynamically updates when forum admin filters by unit or all units)
  const categoryStats = React.useMemo(() => {
    return Object.entries(breakdownImpact.categoryBreakdown).map(([catId, data]) => {
      const catInfo = WASTE_CATEGORIES[catId] || {
        nama: catId,
        colorBar: 'bg-[#005596]',
        colorBg: 'bg-sky-50',
        colorText: 'text-sky-800',
      };
      return {
        id: catId,
        nama: catInfo.nama,
        berat: data.berat,
        nilai: data.nilai,
        persen: data.persenBerat,
        colorBar: catInfo.colorBar,
        colorBg: catInfo.colorBg,
        colorText: catInfo.colorText,
      };
    });
  }, [breakdownImpact.categoryBreakdown]);

  // Dedicated calculations for Plastik PET (Polyethylene Terephthalate)
  const petStats = React.useMemo(() => {
    let totalKg = 0;
    let totalNilai = 0;
    let transactionCount = 0;
    const unitMap: Record<string, { unitId: string; unitName: string; rw: string; kg: number; nilai: number; txCount: number }> = {};

    // Initialize all active units
    allActiveUnits.forEach((u) => {
      unitMap[u.id] = {
        unitId: u.id,
        unitName: u.nama,
        rw: u.rw,
        kg: 0,
        nilai: 0,
        txCount: 0,
      };
    });

    // 1. Calculate across breakdownRecords for active view filter
    breakdownRecords.forEach((rec) => {
      let recHasPet = false;
      let recPetKg = 0;
      let recPetNilai = 0;

      rec.items.forEach((item) => {
        const nameLower = (item.jenisDetail || '').toLowerCase();
        const isPet =
          nameLower.includes('pet') ||
          (item.kategoriId === 'plastik' && (nameLower.includes('botol') || nameLower.includes('gelas') || nameLower.includes('pet')));

        if (isPet) {
          recHasPet = true;
          const berat = item.berat || 0;
          const nilai = item.subtotal || Math.round(berat * 4000);
          recPetKg += berat;
          recPetNilai += nilai;
        }
      });

      if (recHasPet) {
        transactionCount++;
        totalKg += recPetKg;
        totalNilai += recPetNilai;
      }
    });

    // 2. Village-wide per-unit ranking from filteredRecords
    filteredRecords.forEach((rec) => {
      const uId = rec.unitId || 'UNIT-CCD-001';
      if (!unitMap[uId]) {
        const uObj = allActiveUnits.find((u) => u.id === uId);
        unitMap[uId] = {
          unitId: uId,
          unitName: rec.unitNama || uObj?.nama || 'Bank Sampah Unit',
          rw: uObj?.rw || 'RW',
          kg: 0,
          nilai: 0,
          txCount: 0,
        };
      }

      let recHasPet = false;
      rec.items.forEach((item) => {
        const nameLower = (item.jenisDetail || '').toLowerCase();
        const isPet =
          nameLower.includes('pet') ||
          (item.kategoriId === 'plastik' && (nameLower.includes('botol') || nameLower.includes('gelas') || nameLower.includes('pet')));

        if (isPet) {
          recHasPet = true;
          const berat = item.berat || 0;
          const nilai = item.subtotal || Math.round(berat * 4000);
          unitMap[uId].kg += berat;
          unitMap[uId].nilai += nilai;
        }
      });

      if (recHasPet) {
        unitMap[uId].txCount++;
      }
    });

    const totalPlastikKg = breakdownImpact.categoryBreakdown['plastik']?.berat || 0;
    const petShareOfPlastik = totalPlastikKg > 0 ? (totalKg / totalPlastikKg) * 100 : 0;
    const petShareOfTotal = breakdownImpact.totalKg > 0 ? (totalKg / breakdownImpact.totalKg) * 100 : 0;
    const estimatedBottles = Math.round(totalKg * 45); // Estimasi ~45 botol 600ml per kg
    const co2SavedKg = Number((totalKg * 2.1).toFixed(1)); // ~2.1 kg CO2e per kg botol PET
    const energySavedKwh = Number((totalKg * 1.8).toFixed(1)); // ~1.8 kWh energi per kg PET

    const unitRanking = Object.values(unitMap).sort((a, b) => b.kg - a.kg);

    return {
      totalKg: Number(totalKg.toFixed(1)),
      totalNilai,
      transactionCount,
      estimatedBottles,
      co2SavedKg,
      energySavedKwh,
      petShareOfPlastik: Math.min(100, petShareOfPlastik),
      petShareOfTotal: Math.min(100, petShareOfTotal),
      unitRanking,
      topUnit: unitRanking[0] || null,
    };
  }, [breakdownRecords, filteredRecords, allActiveUnits, breakdownImpact]);

  // Unit performance comparison list for forum desa view
  const unitComparisons = React.useMemo(() => {
    if (!isForumView) return [];
    return allActiveUnits.map((u) => {
      const uRecs = filteredRecords.filter((r) => r.unitId === u.id);
      const uImpact = calculateImpact(uRecs);
      const percentOfTotal =
        totalBeratKeseluruhan > 0 ? (uImpact.totalKg / totalBeratKeseluruhan) * 100 : 0;
      return {
        unit: u,
        totalKg: uImpact.totalKg,
        totalNilai: uImpact.totalNilaiRupiah,
        transactionCount: uRecs.length,
        percentOfTotal,
        co2eKg: uImpact.co2eKg,
      };
    });
  }, [isForumView, allActiveUnits, filteredRecords, totalBeratKeseluruhan]);

  return (
    <div id="overall-dashboard" className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Banner Ikhtisar Keseluruhan */}
      <div
        id="overall-header-banner"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003B6D] via-[#005596] to-[#00294D] text-white p-6 sm:p-8 shadow-sm border border-sky-400/30"
      >
        {/* Scenic Decorative Background Layer */}
        <div className="absolute inset-0 pointer-events-none opacity-15 overflow-hidden">
          <svg
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
            className="w-full h-full text-white"
            fill="currentColor"
          >
            <path d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,218.7C672,224,768,192,864,181.3C960,171,1056,181,1152,197.3L1200,208L1200,300L0,300Z" />
          </svg>
        </div>

        {/* Ambient Decorative Leaves Watermark */}
        <div className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 pointer-events-none">
          <Leaf className="w-full h-full text-white" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Dashboard Bank Sampah
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
              Pemantauan terpadu akumulasi sampah terdaur ulang, dana tabungan seluruh nasabah warga,
              kontribusi ekologis nyata, dan riwayat penimbangan terverifikasi.
            </p>

            {/* Live Operational Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-[11px] text-sky-100 font-medium">
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10 font-semibold text-white">
                <span className="w-2 h-2 rounded-full bg-[#00A3E0] animate-pulse" />
                <span>{unitName}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10">
                <Scale className="w-3 h-3 text-sky-300" />
                <span>Timbangan Digital Terkalibrasi</span>
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-lg border border-white/10">
                <Calendar className="w-3 h-3 text-sky-300" />
                <span>Update Real-time</span>
              </span>
            </div>
          </div>

          {/* Quick Action Buttons on Header */}
          {!isForumView && (
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
              <button
                id="btn-overall-catat-setoran"
                onClick={onOpenNewDeposit}
                className="px-5 py-2.5 rounded-xl bg-white text-[#005596] font-bold text-xs hover:bg-sky-50 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-[#005596]" />
                <span>+ Catat Setoran Baru</span>
              </button>
              {onOpenRegisterNasabah && (
                <button
                  id="btn-overall-daftar-nasabah"
                  onClick={onOpenRegisterNasabah}
                  className="px-5 py-2.5 rounded-xl bg-[#00A3E0] hover:bg-[#008cc2] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>+ Daftar Nasabah Baru</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                <button
                  id="btn-overall-tarik-saldo"
                  onClick={onOpenWithdraw}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-1.5 backdrop-blur-xs active:scale-98 cursor-pointer"
                >
                  <ArrowDownCircle className="w-3.5 h-3.5 text-sky-200" />
                  <span>Tarik Saldo</span>
                </button>
                <button
                  id="btn-overall-pantau-akun"
                  onClick={() => onNavigateToTab('nasabah')}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all border border-white/20 flex items-center justify-center gap-1.5 backdrop-blur-xs active:scale-98 cursor-pointer"
                >
                  <Users className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pantau Akun & PIN</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Primary Executive Metric Cards */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 ${isForumView ? 'lg:grid-cols-3 xl:grid-cols-6' : 'lg:grid-cols-3 xl:grid-cols-5'} gap-4 sm:gap-5`}>
        {/* Card 1: Total Sampah Terkumpul */}
        <div
          id="kpi-total-sampah"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Sampah Terkumpul</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
              <Trash2 className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {totalBeratKeseluruhan.toLocaleString('id-ID')} <span className="text-base font-bold text-gray-500">kg</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#005596] font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Dari {totalTransaksi} transaksi penimbangan</span>
            </div>
          </div>
        </div>

        {/* Card 2: Plastik PET */}
        <div
          id="kpi-pet"
          className="bg-gradient-to-br from-emerald-50/70 via-white to-sky-50/50 rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-emerald-900">Plastik PET</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-emerald-600 text-white">
                PET
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              {petStats.totalKg.toLocaleString('id-ID')} <span className="text-base font-bold text-emerald-700">kg</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-emerald-800 font-semibold">
              <span>~{petStats.estimatedBottles.toLocaleString('id-ID')} butir botol</span>
              <span className="text-[10px] text-emerald-600 font-medium">({petStats.petShareOfPlastik.toFixed(0)}% plastik)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Tabungan Terkelola Warga */}
        <div
          id="kpi-total-tabungan"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Saldo Tabungan Terkelola</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
              <Wallet className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {formatRupiah(totalSaldoAktifSemuaNasabah)}
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <span>Dana ditarik: {formatRupiah(totalDanaDitarikWarga)}</span>
            </div>
          </div>
        </div>

        {/* Card 4: Total Nasabah Terdaftar */}
        <div
          id="kpi-total-nasabah"
          onClick={() => !isForumView && onNavigateToTab('nasabah')}
          className={`bg-white rounded-2xl p-5 border border-gray-100 shadow-xs transition-all flex flex-col justify-between ${!isForumView ? 'hover:shadow-sm cursor-pointer group' : ''}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Nasabah Terdaftar</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center group-hover:bg-sky-100 transition-colors">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-1.5">
              <span>{totalNasabah}</span>
              <span className="text-base font-bold text-gray-500">Warga</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-[#005596] font-semibold">
              <span>100% Aktif Berpartisipasi</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Card 5: Reduksi CO2e Kumulatif */}
        <div
          id="kpi-total-co2"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Reduksi Jejak Karbon</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
              <Leaf className="w-5 h-5 stroke-[2.2]" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {overallImpact.co2eKg.toLocaleString('id-ID')} <span className="text-base font-bold text-gray-500">kg</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#005596] font-semibold">
              <Trees className="w-3.5 h-3.5" />
              <span>Setara {overallImpact.treesSaved} pohon</span>
            </div>
          </div>
        </div>

        {/* Card 6: Total Unit Bank Sampah (Only on Forum View) */}
        {isForumView && (
          <div
            id="kpi-total-unit"
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-500">Total Unit Bank Sampah</span>
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
                <Building className="w-5 h-5 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight flex items-baseline gap-1.5">
                <span>{totalUnit}</span>
                <span className="text-base font-bold text-gray-500">Unit</span>
              </div>
              <div className="mt-2 flex items-center text-xs text-[#005596] font-semibold">
                <span>Aktif di Desa Cicadas</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2.5 SECTION KHUSUS: SOROTAN PLASTIK PET */}
      <div
        id="section-pet"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#004071] to-[#005596] text-white p-6 sm:p-7 shadow-sm border border-sky-400/30"
      >
        {/* Ambient Decorative Recycled Symbol */}
        <div className="absolute -right-6 -bottom-6 w-56 h-56 opacity-10 pointer-events-none text-emerald-300">
          <Recycle className="w-full h-full" />
        </div>

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/15">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>KOMODITAS BANK SAMPAH DESA CICADAS</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>Plastik PET (Polyethylene Terephthalate)</span>
                <span className="text-xs px-2.5 py-0.5 rounded-lg bg-emerald-500 text-white font-extrabold tracking-wide">
                  Grade A Daur Ulang
                </span>
              </h2>
              <p className="text-xs text-sky-100/90 max-w-3xl leading-relaxed">
                Botol plastik PET bening dan kemasan air mineral merupakan komoditas prioritas Bank Sampah se-Desa Cicadas dengan daya serap pasar industri daur ulang 100%, perputaran nilai tabungan warga tertinggi, dan kontribusi reduksi karbon nyata.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="bg-black/30 backdrop-blur-xs border border-white/15 px-4 py-2.5 rounded-2xl text-right">
                <span className="text-[10px] text-sky-200 block uppercase font-bold tracking-wider">
                  Harga Acuan Pasar
                </span>
                <span className="text-base font-black text-emerald-300">
                  Rp 4.000 - 4.500 <span className="text-xs text-white/80 font-normal">/ kg</span>
                </span>
              </div>
            </div>
          </div>

          {/* 4 Key Highlight Metric Tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-sky-200">Total PET Terkumpul</span>
                <Package className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {petStats.totalKg.toLocaleString('id-ID')} <span className="text-sm font-bold text-emerald-300">kg</span>
                </div>
                <div className="mt-1 text-[11px] text-sky-200">
                  {petStats.petShareOfPlastik.toFixed(1)}% dari seluruh plastik
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-sky-200">Estimasi Botol PET</span>
                <Recycle className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-emerald-300 tracking-tight">
                  ~{petStats.estimatedBottles.toLocaleString('id-ID')}
                </div>
                <div className="mt-1 text-[11px] text-sky-200">
                  Botol dicegah mencemari kali & TPA
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-sky-200">Perputaran Nilai Ekonomi</span>
                <Wallet className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {formatRupiah(petStats.totalNilai)}
                </div>
                <div className="mt-1 text-[11px] text-sky-200">
                  Dari {petStats.transactionCount} setoran warga
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-sky-200">Reduksi Jejak Karbon</span>
                <Leaf className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="mt-3">
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {petStats.co2SavedKg.toLocaleString('id-ID')} <span className="text-sm font-bold text-emerald-300">kg CO₂e</span>
                </div>
                <div className="mt-1 text-[11px] text-sky-200">
                  Hemat ~{petStats.energySavedKwh} kWh energi industri
                </div>
              </div>
            </div>
          </div>

          {/* Sub-grid: Ranking Unit Pengumpul PET & Panduan Kualitas PET */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-1">
            {/* Left: Ranking Unit Pengumpul PET (7 cols) */}
            <div className="lg:col-span-7 bg-black/25 backdrop-blur-xs border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Kontribusi Pengumpulan PET Antar Bank Sampah Unit</span>
                </h3>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  {isForumView ? 'Agregasi Se-Desa' : 'Unit Terdata'}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {petStats.unitRanking.map((item, idx) => {
                  const percentOfPet =
                    petStats.totalKg > 0 ? (item.kg / petStats.totalKg) * 100 : 0;
                  return (
                    <div
                      key={item.unitId}
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] shrink-0 ${
                          idx === 0 ? 'bg-amber-400 text-slate-900' : idx === 1 ? 'bg-slate-300 text-slate-900' : 'bg-white/20 text-white'
                        }`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <span className="font-bold text-white truncate block">
                            {item.unitName}
                          </span>
                          <span className="text-[10px] text-sky-200">
                            {item.rw} • {item.txCount} transaksi • {formatRupiah(item.nilai)}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-emerald-300 block">
                          {item.kg.toFixed(1)} kg
                        </span>
                        <span className="text-[10px] text-sky-200 font-medium">
                          ~{Math.round(item.kg * 45)} botol ({percentOfPet.toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Panduan Standar Mutu PET Bersih (5 cols) */}
            <div className="lg:col-span-5 bg-black/25 backdrop-blur-xs border border-white/15 rounded-2xl p-4 sm:p-5 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Kriteria Kualitas Plastik PET</span>
                </h3>
                <p className="text-[11px] text-sky-200 mt-1 leading-relaxed">
                  Untuk nilai jual optimal di pabrik rPET, seluruh unit dan warga menerapkan standar:
                </p>

                <ul className="mt-3 space-y-2 text-[11px] text-white/90">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span><strong>Bilas & Keringkan:</strong> Botol bersih dari sisa cairan manis/minyak.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span><strong>Pisahkan Tutup & Label:</strong> Tutup botol (HDPE) dan label dipisahkan.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                    <span><strong>Pipihkan Botol:</strong> Remas/injak untuk efisiensi ruang gudang unit.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200">
                <span>Mitra Daur Ulang: Industri rPET & Tekstil</span>
                <span className="font-bold text-emerald-300">100% Sirkular</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Baris Dua Kolom: Distribusi Sampah & Dampak Lingkungan Kumulatif (Tersedia untuk Bank Unit & Forum Desa) */}
      <div className="space-y-4">
        {/* Forum Multi-Unit Filter Bar: Khusus Akun Forum Bank Sampah Desa */}
        {isForumView && (
          <div
            id="forum-unit-filter-bar"
            className="bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3.5 bg-gradient-to-r from-sky-50/70 via-white to-sky-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#005596] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-900">
                    Sumber Data Analitik Komposisi
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#005596] text-white">
                    {forumFilterUnitId === 'all' ? 'Seluruh Bank Unit Desa' : activeFilterUnit?.nama || 'Unit Terpilih'}
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {forumFilterUnitId === 'all'
                    ? 'Menampilkan akumulasi data riil dari seluruh Bank Sampah Unit se-Desa Cicadas.'
                    : `Menampilkan data khusus operasional ${activeFilterUnit?.nama || ''} (${activeFilterUnit?.rw || ''}).`}
                </p>
              </div>
            </div>

            {/* Filter Toggle Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              <button
                id="btn-filter-all-units"
                onClick={() => setForumFilterUnitId('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  forumFilterUnitId === 'all'
                    ? 'bg-[#005596] text-white shadow-xs scale-102'
                    : 'bg-white text-gray-700 hover:bg-sky-50 border border-gray-200'
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Seluruh Unit ({totalBeratKeseluruhan.toLocaleString('id-ID')} kg)</span>
              </button>
              {allActiveUnits.map((u) => {
                const uRecs = filteredRecords.filter((r) => r.unitId === u.id);
                const uTotalKg = uRecs.reduce((sum, r) => sum + r.totalBerat, 0);
                const isSelected = forumFilterUnitId === u.id;
                return (
                  <button
                    key={u.id}
                    id={`btn-filter-unit-${u.id}`}
                    onClick={() => setForumFilterUnitId(u.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#005596] text-white shadow-xs scale-102'
                        : 'bg-white text-gray-700 hover:bg-sky-50 border border-gray-200'
                    }`}
                  >
                    <span>{u.nama.replace('Bank Sampah ', '')}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isSelected ? 'bg-sky-200 text-sky-900' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {uTotalKg.toFixed(0)} kg
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* The Two Main Analysis Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Kolom Kiri (7 Kolom): Komposisi Sampah Terkumpul */}
          <div
            id="card-komposisi-kategori"
            className="lg:col-span-7 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[#005596]" />
                  <span>
                    Komposisi Kategori Sampah{' '}
                    {isForumView
                      ? forumFilterUnitId === 'all'
                        ? 'Seluruh Bank Unit Desa'
                        : activeFilterUnit?.nama
                      : 'Keseluruhan'}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isForumView
                    ? forumFilterUnitId === 'all'
                      ? 'Total akumulasi sampah per kategori dari seluruh Bank Sampah Unit di Desa Cicadas'
                      : `Total akumulasi sampah per kategori yang disetorkan warga di ${activeFilterUnit?.nama || 'unit'}`
                    : 'Total akumulasi sampah per kategori yang disetorkan warga'}
                </p>
              </div>
              <span className="text-xs font-semibold text-[#005596] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 shrink-0">
                {breakdownImpact.totalKg.toLocaleString('id-ID')} kg Total {isForumView && forumFilterUnitId === 'all' ? '(Desa)' : ''}
              </span>
            </div>

            {/* Horizontal Multi-colored Segment Bar */}
            <div className="space-y-1.5">
              <div className="h-3.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                {categoryStats.map((cat) => {
                  if (cat.persen <= 0) return null;
                  return (
                    <div
                      key={cat.id}
                      style={{ width: `${Math.max(3, cat.persen)}%` }}
                      className={`${cat.colorBar} h-full transition-all duration-500`}
                      title={`${cat.nama}: ${cat.berat} kg (${cat.persen.toFixed(1)}%)`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 font-medium px-1">
                <span>Distribusi Relatif Kategori</span>
                <span>100% Tercatat</span>
              </div>
            </div>

            {/* List of Category Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {categoryStats.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-3 rounded-xl border transition-colors flex items-center justify-between ${
                    cat.id === 'plastik'
                      ? 'border-emerald-200 bg-emerald-50/40 hover:border-emerald-300'
                      : 'border-gray-100 hover:border-sky-200 bg-gray-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-3 h-3 rounded-full ${cat.colorBar} shrink-0`} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-gray-900 truncate block">
                          {cat.nama}
                        </span>
                        {cat.id === 'plastik' && (
                          <span className="px-1.5 py-0.2 rounded-sm bg-emerald-600 text-white text-[9px] font-extrabold shrink-0">
                            PET Bening
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-gray-500">
                        {formatRupiah(cat.nilai)}
                        {cat.id === 'plastik' && petStats.totalKg > 0 && (
                          <span className="text-emerald-700 font-semibold ml-1">
                            • PET: {petStats.totalKg} kg ({petStats.petShareOfPlastik.toFixed(0)}%)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-extrabold text-gray-900 block">
                      {cat.berat.toFixed(1)} kg
                    </span>
                    <span className="text-[10px] font-bold text-[#005596] bg-sky-50 px-1.5 py-0.5 rounded-sm">
                      {cat.persen.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cash Flow Highlights */}
            <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-slate-900 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-gray-600 block text-[11px]">
                  {isForumView ? 'Total Perputaran Nilai Sampah' : 'Total Perputaran Nilai Sampah'}
                </span>
                <strong className="text-sm font-black text-[#005596]">
                  {formatRupiah(breakdownImpact.totalNilaiRupiah)}
                </strong>
              </div>
              <div>
                <span className="text-gray-600 block text-[11px]">Rata-rata Nilai per Transaksi</span>
                <strong className="text-sm font-black text-[#003B6D]">
                  {breakdownRecords.length > 0
                    ? formatRupiah(Math.round(breakdownImpact.totalNilaiRupiah / breakdownRecords.length))
                    : 'Rp0'}
                </strong>
              </div>
              <div>
                <span className="text-gray-600 block text-[11px]">
                  {isForumView ? 'Volume Rata-rata per Transaksi' : 'Rata-rata Setoran per Nasabah'}
                </span>
                <strong className="text-sm font-black text-[#003B6D]">
                  {breakdownRecords.length > 0
                    ? `${(breakdownImpact.totalKg / breakdownRecords.length).toFixed(1)} kg`
                    : '0 kg'}
                </strong>
              </div>
            </div>
          </div>

          {/* Kolom Kanan (5 Kolom): Dampak Lingkungan Kumulatif */}
          <div
            id="card-dampak-lingkungan"
            className="lg:col-span-5 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Trees className="w-4 h-4 text-[#005596]" />
                    <span>
                      Dampak Lingkungan Kumulatif{' '}
                      {isForumView
                        ? forumFilterUnitId === 'all'
                          ? 'Seluruh Desa'
                          : activeFilterUnit?.nama || ''
                        : ''}
                    </span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isForumView
                      ? forumFilterUnitId === 'all'
                        ? 'Hasil nyata kontribusi daur ulang seluruh Bank Sampah Unit di Desa Cicadas'
                        : `Hasil kontribusi daur ulang warga ${activeFilterUnit?.nama || 'unit'}`
                      : 'Hasil nyata kontribusi daur ulang seluruh warga'}
                  </p>
                </div>
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              </div>

              {/* 3 Eco Impact Metric Cards: Reduksi CO2e, Pohon Terlindungi, Pencegahan Limbah ke Tanah & Air */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center gap-2 text-[#005596] text-xs font-semibold">
                    <Leaf className="w-4 h-4 text-[#005596]" />
                    <span>Reduksi CO2e</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1.5">
                    {breakdownImpact.co2eKg.toLocaleString('id-ID')}{' '}
                    <span className="text-xs font-medium">kg</span>
                  </div>
                  <p className="text-[10px] text-[#005596] mt-0.5">Mencegah efek rumah kaca</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                  <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold">
                    <Trees className="w-4 h-4 text-amber-600" />
                    <span>Pohon Terlindungi</span>
                  </div>
                  <div className="text-lg font-black text-amber-950 mt-1.5">
                    {breakdownImpact.treesSaved}{' '}
                    <span className="text-xs font-medium">Pohon</span>
                  </div>
                  <p className="text-[10px] text-amber-700 mt-0.5">Dari daur ulang kertas</p>
                </div>

                <div className="col-span-2 p-3.5 rounded-xl bg-sky-50/70 border border-sky-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#005596] text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#005596]" />
                      <span>Pencegahan Limbah ke Tanah dan Air</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-800 bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-200">
                      Bebas Pencemaran Liar
                    </span>
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1.5 flex items-baseline gap-1.5">
                    <span>{breakdownImpact.totalKg.toLocaleString('id-ID')}</span>
                    <span className="text-xs font-medium text-gray-500">kg limbah dicegah mencemari</span>
                  </div>
                  <p className="text-[10px] text-sky-800 mt-0.5">
                    Mencegah pencemaran saluran air, sungai, dan resapan air tanah dari timbunan sampah
                  </p>
                </div>
              </div>

              {/* Equivalent Visuals */}
              <div className="mt-4 space-y-2.5">
                <span className="text-xs font-bold text-gray-800 block">Ekivalensi Nyata:</span>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-base">🛵</span>
                    <span>
                      Setara menetralkan perjalanan motor{' '}
                      <strong>{breakdownImpact.equivalentMotorKm.toLocaleString('id-ID')} km</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-base">🌳</span>
                    <span>
                      Menjaga kelestarian <strong>{breakdownImpact.treesSaved} pohon dewasa</strong> dari penebangan bahan baku kertas
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="text-base">🛡️</span>
                    <span>
                      Mengalihkan <strong>{breakdownImpact.totalKg.toLocaleString('id-ID')} kg</strong> sampah & residu agar tidak meracuni ekosistem tanah dan air
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Standar IPCC & KLHK Indonesia</span>
              <button
                onClick={() => onNavigateToTab('edukasi')}
                className="font-semibold text-[#005596] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Pelajari Dampak</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Khusus Forum Desa: Tabel Komparasi Kontribusi Antar Seluruh Bank Unit se-Desa */}
        {isForumView && (
          <div
            id="forum-unit-comparison-table"
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-[#005596]" />
                  <span>Kontribusi & Performa Antar Bank Sampah Unit se-Desa Cicadas</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Rincian perolehan sampah, persentase kontribusi, nasabah aktif, dan saldo kas masing-masing unit RW
                </p>
              </div>
              <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 shrink-0 self-start sm:self-auto">
                {unitComparisons.length} Bank Unit Aktif
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                    <th className="py-2.5 px-3">Bank Sampah Unit</th>
                    <th className="py-2.5 px-3">Wilayah</th>
                    <th className="py-2.5 px-3 text-right">Total Sampah</th>
                    <th className="py-2.5 px-3">Porsi Kontribusi (% kg)</th>
                    <th className="py-2.5 px-3 text-center">Nasabah</th>
                    <th className="py-2.5 px-3 text-right">Kas Unit</th>
                    <th className="py-2.5 px-2 text-right">Aksi Filter</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {unitComparisons.map((item) => {
                    const isFiltered = forumFilterUnitId === item.unit.id;
                    return (
                      <tr
                        key={item.unit.id}
                        className={`transition-colors hover:bg-sky-50/40 ${isFiltered ? 'bg-sky-50/60 font-semibold' : ''}`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-xs shrink-0">
                              <Building className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{item.unit.nama}</div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                Ketua: {item.unit.ketuaUnit} • {item.unit.kontakHp}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-medium text-gray-700">
                          {item.unit.rw}
                        </td>
                        <td className="py-3 px-3 text-right font-black text-gray-900">
                          {item.totalKg.toFixed(1)} kg
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2 min-w-[120px]">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                style={{ width: `${Math.min(100, Math.max(5, item.percentOfTotal))}%` }}
                                className="h-full bg-[#005596] rounded-full transition-all duration-500"
                              />
                            </div>
                            <span className="text-[11px] font-bold text-gray-700 shrink-0 w-10 text-right">
                              {item.percentOfTotal.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-bold text-gray-900">{item.unit.jumlahNasabah}</span>
                          <span className="text-[10px] text-gray-400 block">warga</span>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#005596]">
                          {formatRupiah(item.unit.rekeningKas?.saldoKasUnit || 0)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={() => setForumFilterUnitId(isFiltered ? 'all' : item.unit.id)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors cursor-pointer ${
                              isFiltered
                                ? 'bg-[#005596] text-white'
                                : 'text-[#005596] hover:bg-sky-50 border border-sky-200'
                            }`}
                          >
                            {isFiltered ? 'Reset ke Semua' : 'Pilih Unit'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Baris Transaksi Terkini Seluruh Nasabah & Papan Peringkat Partisipasi Warga */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Tabel Transaksi Setoran Seluruh Nasabah (8 Kolom) - Tampil di Bank Unit */}
        {!isForumView && (
          <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#005596]" />
                  <span>Aktivitas Setoran Terbaru (Unit Ini)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Log penimbangan terkini dari pos penimbangan bank sampah
                </p>
              </div>
              <button
                id="btn-overall-lihat-semua-transaksi"
                onClick={onViewAllRecords}
                className="text-xs font-bold text-[#005596] hover:text-[#003B6D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Lihat Seluruh Riwayat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                    <th className="py-2.5 px-3">Tanggal & ID</th>
                    <th className="py-2.5 px-3">Nama Nasabah</th>
                    <th className="py-2.5 px-3">Kategori Sampah</th>
                    <th className="py-2.5 px-3 text-right">Berat</th>
                    <th className="py-2.5 px-3 text-right">Nilai Rupiah</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                    <th className="py-2.5 px-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOverallTransactions.map((rec) => {
                    const nasabah = nasabahList.find((n) => n.id === rec.nasabahId);
                    const detailItem = rec.items[0];
                    return (
                      <tr
                        key={rec.id}
                        className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
                        onClick={() => onSelectRecord(rec)}
                      >
                        <td className="py-3 px-3">
                          <div className="font-bold text-gray-900">{formatDateIndo(rec.tanggal)}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{rec.id}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-sky-100 text-[#005596] font-bold text-[10px] flex items-center justify-center shrink-0 overflow-hidden">
                              {nasabah?.avatarUrl ? (
                                <img src={nasabah.avatarUrl} alt={nasabah.nama} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                nasabah?.avatarInitials || 'NS'
                              )}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block truncate max-w-[130px]">
                                {nasabah?.nama || rec.nasabahId}
                              </span>
                              <span className="text-[10px] text-gray-400">{rec.nasabahId}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-gray-800 block">
                            {detailItem?.jenisDetail || 'Sampah Campur'}
                          </span>
                          <span className="text-[10px] text-gray-400 capitalize">
                            {detailItem?.kategoriId || 'umum'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-gray-900">
                          {rec.totalBerat} kg
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-[#005596]">
                          {formatRupiah(rec.totalNilai)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                            <CheckCircle2 className="w-3 h-3 text-[#005596]" />
                            <span>Terverifikasi</span>
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectRecord(rec);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold text-[#005596] hover:bg-sky-50 rounded-lg transition-colors cursor-pointer"
                          >
                            Struk
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Papan Peringkat Nasabah Teraktif / Top Contributors (Tampil di Bank Unit dan Forum Desa) */}
        <div className={`${isForumView ? 'lg:col-span-12' : 'lg:col-span-4'} bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between`}>
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>
                    {isForumView
                      ? 'Warga Teraktif Daur Ulang (Peringkat se-Desa Cicadas)'
                      : 'Warga Teraktif Daur Ulang'}
                  </span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isForumView
                    ? 'Penyumbang kilogram sampah terbesar diakumulasi dari seluruh unit RW'
                    : 'Penyumbang kilogram sampah terbesar di bank unit'}
                </p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                Top 5
              </span>
            </div>

            {/* Leaderboard List */}
            <div className={`divide-y divide-gray-50 mt-3 space-y-1 ${isForumView ? 'grid grid-cols-1 md:grid-cols-2 gap-3 divide-y-0' : ''}`}>
              {topContributors.map((item, idx) => {
                const rankColor =
                  idx === 0
                    ? 'bg-amber-400 text-amber-950 font-black'
                    : idx === 1
                    ? 'bg-slate-300 text-slate-800 font-bold'
                    : idx === 2
                    ? 'bg-amber-700 text-amber-50 font-bold'
                    : 'bg-gray-100 text-gray-600 font-semibold';

                return (
                  <div
                    key={item.nasabah.id}
                    onClick={() => onSelectNasabah(item.nasabah)}
                    className="py-2.5 flex items-center justify-between gap-3 hover:bg-sky-50/50 p-2.5 rounded-xl transition-colors cursor-pointer group border border-gray-50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Badge */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${rankColor}`}>
                        {idx + 1}
                      </div>

                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-sky-100 text-[#005596] font-bold text-xs flex items-center justify-center shrink-0 overflow-hidden">
                        {item.nasabah.avatarUrl ? (
                          <img src={item.nasabah.avatarUrl} alt={item.nasabah.nama} className="w-full h-full object-cover" />
                        ) : (
                          item.nasabah.avatarInitials
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="text-xs font-bold text-gray-900 truncate group-hover:text-[#005596] transition-colors">
                          {item.nasabah.nama}
                        </div>
                        <div className="text-[10px] text-gray-400 truncate flex items-center gap-1.5">
                          <span>{item.nasabah.unitBankSampah || item.nasabah.rw || 'RW 03'}</span>
                          <span>•</span>
                          <span>{item.transactionCount}x setor</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-gray-900 block">
                        {item.totalKg} kg
                      </span>
                      <span className="text-[10px] text-[#005596] font-bold">
                        {formatRupiah(item.saldo)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Card Helper */}
          {!isForumView && (
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => onNavigateToTab('nasabah')}
                className="w-full py-2.5 px-3 rounded-xl bg-gray-50 hover:bg-sky-50 text-gray-700 hover:text-[#005596] font-bold text-xs transition-colors flex items-center justify-center gap-1.5 border border-gray-100 cursor-pointer"
              >
                <span>Kelola Seluruh Direktori Nasabah</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KHUSUS FORUM BANK SAMPAH DESA: FITUR UTAMA SEBARAN BANK SAMPAH */}
      {isForumView && (
        <div className="space-y-6 pt-2">
          {/* Header Section for Sebaran Unit */}
          <div className="bg-white rounded-3xl p-6 md:p-7 border border-gray-100 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-[#005596] text-xs font-bold border border-sky-200">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Fitur Utama Forum Desa • Supervisi Multi-Unit</span>
                </div>
                <h2 className="text-xl font-black text-gray-900 mt-2">
                  Sebaran Unit Bank Sampah Desa Cicadas
                </h2>
                <p className="text-xs text-gray-500 max-w-2xl mt-1 leading-relaxed">
                  Visual map spasial kondisi seluruh unit bank sampah tingkat RW. Klik unit manapun di bawah ini untuk melihat indikator performa secara langsung tanpa perlu masuk satu per satu.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  id="btn-open-full-map"
                  onClick={() => onNavigateToTab('peta_sebaran')}
                  className="px-4 py-2.5 rounded-xl bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Buka Peta Wilayah Geospasial</span>
                </button>
                <button
                  id="btn-open-approval-from-sebaran"
                  onClick={() => onNavigateToTab('approval_unit')}
                  className="px-3.5 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-gray-500" />
                  <span>Kelola SK Unit</span>
                </button>
              </div>
            </div>

            {/* Visual Map & Detail Inspector Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 pt-6 border-t border-gray-100">
              {/* Left Column: Interactive Visual Map Diagram (7 cols) */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#005596]" />
                    Visual Map Sebaran Unit (Klik untuk detail):
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {forumUnits.length} Unit Terpantau
                  </span>
                </div>

                {/* The Visual Map Diagram Container */}
                <div className="relative min-h-[360px] md:min-h-[400px] rounded-2xl bg-gradient-to-br from-slate-50 via-sky-50/30 to-emerald-50/20 border border-slate-200 p-5 overflow-hidden select-none flex flex-col justify-between">
                  {/* Subtle Connecting Circuit / Topology Grid Lines */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <line x1="25%" y1="25%" x2="50%" y2="50%" stroke="#005596" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="75%" y1="25%" x2="50%" y2="50%" stroke="#005596" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="#005596" strokeWidth="2" strokeDasharray="4 4" />
                      <line x1="75%" y1="75%" x2="50%" y2="50%" stroke="#005596" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                  </div>

                  {/* Central Forum Desa Landmark Indicator */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-black text-xl shadow-lg ring-4 ring-white">
                      🏛️
                    </div>
                    <div className="mt-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 text-white text-[10px] font-bold shadow-xs whitespace-nowrap">
                      Forum Balai Desa
                    </div>
                  </div>

                  {/* Top Row Units: Unit Mekar Jaya (175 kg) & Unit Cicadas (420 kg) */}
                  <div className="flex items-start justify-between z-20 gap-4">
                    {/* Unit 1: Mekar Jaya */}
                    {forumUnits[0] && (
                      <div
                        id={`btn-node-${forumUnits[0].id}`}
                        onClick={() => setSelectedForumUnitId(forumUnits[0].id)}
                        className={`w-44 p-3 rounded-2xl cursor-pointer transition-all duration-200 shadow-md ${
                          selectedForumUnit?.id === forumUnits[0].id
                            ? 'bg-slate-900 text-white ring-4 ring-[#005596]/40 scale-105'
                            : 'bg-white text-gray-900 hover:bg-sky-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-xs font-black truncate">
                            {forumUnits[0].nama.replace('Bank Sampah ', 'Unit ')}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span
                            className={`text-sm font-black ${
                              selectedForumUnit?.id === forumUnits[0].id
                                ? 'text-emerald-400'
                                : 'text-emerald-700'
                            }`}
                          >
                            {(forumUnits[0].totalSampahKg || 0).toLocaleString('id-ID')} kg
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              selectedForumUnit?.id === forumUnits[0].id
                                ? 'text-sky-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {forumUnits[0].rw}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Unit 2: Cicadas */}
                    {forumUnits[1] && (
                      <div
                        id={`btn-node-${forumUnits[1].id}`}
                        onClick={() => setSelectedForumUnitId(forumUnits[1].id)}
                        className={`w-44 p-3 rounded-2xl cursor-pointer transition-all duration-200 shadow-md ${
                          selectedForumUnit?.id === forumUnits[1].id
                            ? 'bg-slate-900 text-white ring-4 ring-[#005596]/40 scale-105'
                            : 'bg-white text-gray-900 hover:bg-sky-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-xs font-black truncate">
                            {forumUnits[1].nama.replace('Bank Sampah ', 'Unit ')}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span
                            className={`text-sm font-black ${
                              selectedForumUnit?.id === forumUnits[1].id
                                ? 'text-emerald-400'
                                : 'text-emerald-700'
                            }`}
                          >
                            {(forumUnits[1].totalSampahKg || 0).toLocaleString('id-ID')} kg
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              selectedForumUnit?.id === forumUnits[1].id
                                ? 'text-sky-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {forumUnits[1].rw}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row Units: Unit Sukamaju (280 kg) & Unit RW 03 (350 kg) */}
                  <div className="flex items-end justify-between z-20 gap-4 mt-16">
                    {/* Unit 3: Sukamaju */}
                    {forumUnits[2] && (
                      <div
                        id={`btn-node-${forumUnits[2].id}`}
                        onClick={() => setSelectedForumUnitId(forumUnits[2].id)}
                        className={`w-44 p-3 rounded-2xl cursor-pointer transition-all duration-200 shadow-md ${
                          selectedForumUnit?.id === forumUnits[2].id
                            ? 'bg-slate-900 text-white ring-4 ring-[#005596]/40 scale-105'
                            : 'bg-white text-gray-900 hover:bg-sky-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-xs font-black truncate">
                            {forumUnits[2].nama.replace('Bank Sampah ', 'Unit ')}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span
                            className={`text-sm font-black ${
                              selectedForumUnit?.id === forumUnits[2].id
                                ? 'text-emerald-400'
                                : 'text-emerald-700'
                            }`}
                          >
                            {(forumUnits[2].totalSampahKg || 0).toLocaleString('id-ID')} kg
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              selectedForumUnit?.id === forumUnits[2].id
                                ? 'text-sky-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {forumUnits[2].rw}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Unit 4: RW 03 */}
                    {forumUnits[3] && (
                      <div
                        id={`btn-node-${forumUnits[3].id}`}
                        onClick={() => setSelectedForumUnitId(forumUnits[3].id)}
                        className={`w-44 p-3 rounded-2xl cursor-pointer transition-all duration-200 shadow-md ${
                          selectedForumUnit?.id === forumUnits[3].id
                            ? 'bg-slate-900 text-white ring-4 ring-[#005596]/40 scale-105'
                            : 'bg-white text-gray-900 hover:bg-sky-50 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-xs font-black truncate">
                            {forumUnits[3].nama.replace('Bank Sampah ', 'Unit ')}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-baseline justify-between">
                          <span
                            className={`text-sm font-black ${
                              selectedForumUnit?.id === forumUnits[3].id
                                ? 'text-emerald-400'
                                : 'text-emerald-700'
                            }`}
                          >
                            {(forumUnits[3].totalSampahKg || 0).toLocaleString('id-ID')} kg
                          </span>
                          <span
                            className={`text-[10px] font-bold ${
                              selectedForumUnit?.id === forumUnits[3].id
                                ? 'text-sky-300'
                                : 'text-gray-400'
                            }`}
                          >
                            {forumUnits[3].rw}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-400 px-1">
                  <span>💡 Klik salah satu kotak unit di atas untuk memuat data tanpa refresh</span>
                  <button
                    onClick={() => onNavigateToTab('peta_sebaran')}
                    className="font-bold text-[#005596] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Buka Peta Spasial Geografis</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Right Column: Detailed Unit Inspector ("Klik unit -> muncul") */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                {selectedForumUnit ? (
                  <div
                    id="forum-unit-inspector-panel"
                    className="bg-white rounded-2xl p-5 border-2 border-[#005596]/30 shadow-md flex-1 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      {/* Top Row: Unit Name & Status */}
                      <div className="flex items-start justify-between gap-2 pb-3 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-extrabold text-[#005596] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                              {selectedForumUnit.kodeUnit}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {selectedForumUnit.status === 'active' ? 'Aktif Beroperasi' : 'Menunggu SK'}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-gray-900 mt-1">
                            {selectedForumUnit.nama}
                          </h3>
                          <p className="text-[11px] text-gray-500">
                            {selectedForumUnit.rw} • Ketua: {selectedForumUnit.ketuaUnit}
                          </p>
                        </div>
                      </div>

                      {/* The 6 Core Parameters Checklist */}
                      <div className="grid grid-cols-2 gap-2.5 mt-3">
                        {/* 1. JUMLAH NASABAH */}
                        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100">
                          <span className="text-[10px] font-semibold text-gray-500 block">
                            Jumlah Nasabah
                          </span>
                          <span className="text-base font-black text-gray-900 mt-0.5 block">
                            {selectedForumUnit.jumlahNasabah} <span className="text-xs font-normal text-gray-500">Warga</span>
                          </span>
                        </div>

                        {/* 2. SAMPAH TERKUMPUL */}
                        <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                          <span className="text-[10px] font-semibold text-emerald-800 block">
                            Sampah Terkumpul
                          </span>
                          <span className="text-base font-black text-emerald-950 mt-0.5 block">
                            {(selectedForumUnit.totalSampahKg || 0).toLocaleString('id-ID')} <span className="text-xs font-normal text-emerald-800">kg</span>
                          </span>
                        </div>

                        {/* 3. SALDO KAS */}
                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-100 col-span-2">
                          <span className="text-[10px] font-semibold text-amber-800 block">
                            Saldo Kas Unit
                          </span>
                          <span className="text-base font-black text-amber-950 mt-0.5 block">
                            {formatRupiah(selectedForumUnit.rekeningKas?.saldoKasUnit || 0)}
                          </span>
                        </div>
                      </div>

                      {/* 4. AKTIVITAS TERAKHIR */}
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-500 font-bold text-[10px] uppercase tracking-wider">
                          <Clock className="w-3.5 h-3.5 text-[#005596]" />
                          <span>Aktivitas Terakhir:</span>
                        </div>
                        <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                          {selectedForumUnit.aktivitasTerakhir || 'Belum ada catatan aktivitas baru.'}
                        </p>
                      </div>

                      {/* 5. WILAYAH & KONTAK */}
                      <div className="mt-3 text-[11px] text-gray-500 space-y-1">
                        <div className="flex justify-between">
                          <span>Posko / Alamat:</span>
                          <span className="font-semibold text-gray-800 truncate max-w-[180px]">
                            {selectedForumUnit.alamatPos}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>WhatsApp Pengurus:</span>
                          <span className="font-semibold text-gray-800">{selectedForumUnit.kontakHp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action button inside inspector */}
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={() => onNavigateToTab('peta_sebaran')}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-sky-400" />
                        <span>Fokuskan ke Peta Lengkap</span>
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
