'use client';

import React, { useState } from 'react';
import {
  Trash2,
  Wallet,
  Cloud,
  ChevronRight,
  Sparkles,
  Search,
  Check,
  TrendingUp,
  LogOut,
  MapPin,
  Building2,
  ArrowUpRight,
  ExternalLink,
  Leaf,
  Layers,
  Award,
} from 'lucide-react';
import {
  Nasabah,
  SetoranRecord,
  formatRupiah,
} from '@/lib/bankSampahData';

interface WebsitePcDashboardProps {
  activeNasabah: Nasabah;
  nasabahList: Nasabah[];
  setoranRecords: SetoranRecord[];
  totalSaldoAktif: number;
  impact: {
    totalKg: number;
    co2eKg: number;
    totalNilaiRupiah: number;
  };
  onSelectRecord: (record: SetoranRecord) => void;
  onSelectNasabah?: (nasabah: Nasabah) => void;
  onViewAllRecords?: () => void;
  onOpenNewDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function WebsitePcDashboard({
  activeNasabah,
  nasabahList,
  setoranRecords,
  totalSaldoAktif,
  impact,
  onSelectRecord,
  onSelectNasabah,
  onViewAllRecords,
  onOpenNewDeposit,
  onOpenWithdraw,
  onNavigateToTab,
}: WebsitePcDashboardProps) {
  // Format Date for table
  const formatDateIndoShort = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Mei',
          'Jun',
          'Jul',
          'Agu',
          'Sep',
          'Okt',
          'Nov',
          'Des',
        ];
        return `${day} ${months[monthNum - 1] || ''} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Color dot helper for item categories
  const getCategoryDot = (jenisDetail: string) => {
    const lower = jenisDetail.toLowerCase();
    if (lower.includes('botol') || lower.includes('plastik kemasan') || lower.includes('pet')) {
      return 'bg-sky-500 ring-sky-200';
    }
    if (lower.includes('kertas') || lower.includes('hvs') || lower.includes('koran')) {
      return 'bg-blue-600 ring-blue-200';
    }
    if (lower.includes('campur') || lower.includes('plastik campur')) {
      return 'bg-amber-500 ring-amber-200';
    }
    if (lower.includes('kardus') || lower.includes('karton')) {
      return 'bg-orange-600 ring-orange-200';
    }
    if (lower.includes('minyak') || lower.includes('jelantah')) {
      return 'bg-amber-600 ring-amber-200';
    }
    if (lower.includes('besi') || lower.includes('logam') || lower.includes('kaleng')) {
      return 'bg-slate-600 ring-slate-200';
    }
    return 'bg-emerald-500 ring-emerald-200';
  };

  // Compute accumulated balance running totals for the table rows
  // If user has specific initial records, align with mockup values
  const sortedRecords = [...setoranRecords].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  // Take top 5 for "Riwayat Setoran Terbaru"
  const recentTableRows = React.useMemo(() => {
    const rows = sortedRecords.slice(0, 5);
    const initialBalance = totalSaldoAktif || 750000;

    return rows.map((rec, index) => {
      const previousDeductions = rows
        .slice(0, index)
        .reduce((sum, r) => sum + r.totalNilai, 0);
      const currentAcc = Math.max(0, initialBalance - previousDeductions);
      const primaryItem = rec.items[0] || {
        jenisDetail: 'Sampah Terpilah',
        berat: rec.totalBerat,
        subtotal: rec.totalNilai,
      };
      return {
        record: rec,
        tanggal: formatDateIndoShort(rec.tanggal),
        jenisSampah: primaryItem.jenisDetail,
        berat: `${rec.totalBerat} kg`,
        nilai: formatRupiah(rec.totalNilai),
        akumulasi: formatRupiah(currentAcc),
      };
    });
  }, [sortedRecords, totalSaldoAktif]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ============================================================ */}
      {/* 1. HERO SECTION: Greeting, Profile Card & Scenic Backdrop   */}
      {/* ============================================================ */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#F0F7FC] via-[#E4F1FA] to-[#D5EAF7] border border-[#BAE6FD]/80 p-6 sm:p-8 min-h-[220px] flex flex-col justify-between shadow-xs">
        {/* Scenic Background Illustration (Lake, rolling hills, water & calligraphy) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 pointer-events-none overflow-hidden select-none">
          <svg
            viewBox="0 0 540 240"
            preserveAspectRatio="xMaxYMid slice"
            className="w-full h-full opacity-95"
          >
            <defs>
              <linearGradient id="pcSky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="pcWater" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00A3E0" stopOpacity="0.95" />
              </linearGradient>
              <linearGradient id="pcHillFar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#93C5FD" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
              <linearGradient id="pcHillMid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
              <linearGradient id="pcHillNear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284C7" />
                <stop offset="100%" stopColor="#005596" />
              </linearGradient>
            </defs>

            {/* Distant Mountains */}
            <path
              d="M120 170 Q240 70 380 140 T540 100 L540 240 L120 240 Z"
              fill="url(#pcHillFar)"
              opacity="0.5"
            />

            {/* Serene Lake / River Curve */}
            <path
              d="M40 200 C180 140, 260 210, 540 160 L540 240 L40 240 Z"
              fill="url(#pcWater)"
            />

            {/* Mid hills */}
            <path
              d="M200 240 Q320 130 460 170 Q500 150 540 180 L540 240 Z"
              fill="url(#pcHillMid)"
            />

            {/* Near hill */}
            <path
              d="M360 240 Q430 140 540 165 L540 240 Z"
              fill="url(#pcHillNear)"
            />

            {/* Accents */}
            <g transform="translate(420, 120)">
              <circle cx="20" cy="40" r="16" fill="#003B6D" />
              <circle cx="15" cy="35" r="12" fill="#00294D" />
              <circle cx="45" cy="30" r="18" fill="#00294D" />
              <circle cx="40" cy="25" r="14" fill="#005596" />
              <circle cx="70" cy="45" r="22" fill="#003B6D" />
              <circle cx="65" cy="38" r="16" fill="#00A3E0" />
              <circle cx="95" cy="55" r="15" fill="#00294D" />
            </g>

            {/* Additional accents on distant bank */}
            <g transform="translate(280, 150)" opacity="0.8">
              <circle cx="10" cy="20" r="10" fill="#0284C7" />
              <circle cx="25" cy="18" r="12" fill="#003B6D" />
              <circle cx="40" cy="24" r="9" fill="#005596" />
            </g>
          </svg>

          {/* Slogan Text: "Dari Sampah Jadi Manfaat" */}
          <div className="absolute top-6 right-8 text-right select-none hidden sm:block">
            <div
              className="text-2xl md:text-3xl font-extrabold text-[#005596] tracking-tight transform -rotate-2 drop-shadow-xs"
              style={{
                fontFamily: 'cursive, "Brush Script MT", "Segoe Print", sans-serif',
              }}
            >
              Dari Sampah
            </div>
            <div
              className="text-2xl md:text-3xl font-extrabold text-[#005596] tracking-tight transform -rotate-1 mt-0.5"
              style={{
                fontFamily: 'cursive, "Brush Script MT", "Segoe Print", sans-serif',
              }}
            >
              Jadi Manfaat
            </div>
            <div className="flex items-center justify-end gap-1 mt-1 text-[#00A3E0]">
              <div className="w-8 h-0.5 bg-[#00A3E0] rounded-full" />
              <span className="text-sm">💧</span>
            </div>
          </div>
        </div>

        {/* Left Content Area: Halo greeting & Floating Profile Card */}
        <div className="relative z-10 max-w-xl space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003B6D] tracking-tight flex items-center gap-2">
              <span>Halo, {activeNasabah.nama}</span>
              <span className="text-2xl" role="img" aria-label="water">
                💧
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-[#1E4E79] mt-1 font-medium leading-relaxed max-w-lg">
              Terima kasih sudah menjadi bagian dari perubahan untuk lingkungan yang lebih bersih dan lestari.
            </p>
          </div>

          {/* Floating White Profile Card */}
          <div
            id="hero-profile-card"
            className="bg-white rounded-2xl p-4 sm:p-4.5 border border-gray-100 shadow-sm max-w-md flex items-center justify-between gap-4 transition-all hover:shadow-md"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              {/* Avatar Circle */}
              <div className="relative w-12 h-12 rounded-full bg-[#E0F2FE] text-[#005596] flex items-center justify-center shrink-0 overflow-hidden ring-2 ring-sky-100 shadow-2xs">
                {activeNasabah.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeNasabah.avatarUrl}
                    alt={activeNasabah.nama}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-8 h-8 text-[#005596] translate-y-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0H4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Name, Badge & Details */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-sm sm:text-base text-gray-900 truncate leading-tight">
                    {activeNasabah.nama}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#005596] text-white text-[10px] font-semibold tracking-wide">
                    Nasabah
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 truncate">
                  <Building2 className="w-3.5 h-3.5 text-[#00A3E0] shrink-0" />
                  <span className="truncate">{activeNasabah.unitBankSampah}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-[#00A3E0] shrink-0" />
                  <span className="truncate">{activeNasabah.alamat}</span>
                </div>
              </div>
            </div>

            {/* Link Profil > */}
            <button
              id="btn-hero-view-profile"
              onClick={() => onNavigateToTab?.('nasabah')}
              className="flex items-center gap-1 text-xs font-semibold text-[#005596] hover:text-[#003B6D] bg-sky-50 hover:bg-sky-100/70 px-3 py-1.5 rounded-xl transition-colors shrink-0 cursor-pointer"
              title="Lihat Profil"
            >
              <span>Profil</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. RINGKASAN KONTRIBUSI: 3 Metric Cards                     */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Total Setoran Sampah */}
        <div
          id="metric-card-sampah"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between gap-4 hover:border-gray-200 transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 block">
              Total Setoran Sampah
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight">
              {Math.round(impact.totalKg || 125)} kg
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#005596]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+12 kg dari bulan lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <Trash2 className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Card 2: Total Tabungan */}
        <div
          id="metric-card-tabungan"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between gap-4 hover:border-gray-200 transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 block">
              Total Tabungan
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight truncate">
              {formatRupiah(totalSaldoAktif || 750000)}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#005596]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+Rp75.000 dari bulan lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <Wallet className="w-5 h-5 stroke-[2.2]" />
          </div>
        </div>

        {/* Card 3: Kontribusi CO2 */}
        <div
          id="metric-card-co2"
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex items-center justify-between gap-4 hover:border-gray-200 transition-all group"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-gray-500 block">
              Kontribusi CO₂
            </span>
            <div className="text-2xl font-black text-gray-900 tracking-tight truncate">
              {Math.round(impact.co2eKg || 185)} kg CO₂e
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#005596]">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18 kg CO₂e dari bulan lalu</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
            <div className="relative flex items-center justify-center">
              <Cloud className="w-5 h-5 stroke-[2.2]" />
              <span className="absolute text-[7px] font-extrabold text-[#005596] -bottom-0.5">
                CO2
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. BOTTOM GRID: Riwayat Setoran Terbaru + Eco Quote Card    */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Left Column (2 Cols / 67%): Riwayat Setoran Terbaru Table */}
        <div
          id="card-riwayat-terbaru-pc"
          className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between"
        >
          <div>
            {/* Header: Title and "Lihat Semua" link */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Riwayat Setoran Terbaru
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Transaksi penimbangan dan pencatatan buku tabungan digital
                </p>
              </div>

              {onViewAllRecords && (
                <button
                  id="btn-lihat-semua-riwayat"
                  onClick={onViewAllRecords}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center gap-1"
                >
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Table layout matching mockup */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 font-semibold border-b border-gray-50">
                    <th className="py-3 px-3">Tanggal</th>
                    <th className="py-3 px-3">Jenis Sampah</th>
                    <th className="py-3 px-3">Berat</th>
                    <th className="py-3 px-3">Nilai</th>
                    <th className="py-3 px-3">Akumulasi</th>
                    <th className="py-3 px-2 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentTableRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        Belum ada riwayat setoran sampah.
                      </td>
                    </tr>
                  ) : (
                    recentTableRows.map((row) => (
                      <tr
                        key={row.record.id}
                        onClick={() => onSelectRecord(row.record)}
                        className="hover:bg-[#F8FBFA] transition-colors cursor-pointer group"
                      >
                        {/* Tanggal */}
                        <td className="py-3 px-3 font-medium text-gray-700 whitespace-nowrap">
                          {row.tanggal}
                        </td>

                        {/* Jenis Sampah with colored dot */}
                        <td className="py-3 px-3 font-semibold text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3 h-3 rounded-full ${getCategoryDot(
                                row.jenisSampah
                              )} ring-2 shrink-0`}
                            />
                            <span>{row.jenisSampah}</span>
                          </div>
                        </td>

                        {/* Berat */}
                        <td className="py-3 px-3 text-gray-600 whitespace-nowrap">
                          {row.berat}
                        </td>

                        {/* Nilai */}
                        <td className="py-3 px-3 font-bold text-gray-800 whitespace-nowrap">
                          {row.nilai}
                        </td>

                        {/* Akumulasi Saldo */}
                        <td className="py-3 px-3 font-bold text-[#005596] whitespace-nowrap">
                          {row.akumulasi}
                        </td>

                        {/* Action Chevron */}
                        <td className="py-3 px-2 text-right text-gray-300 group-hover:text-gray-600 transition-colors">
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Action Footer for New Deposit or Tarik Saldo */}
          <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Klik baris transaksi untuk melihat & mencetak struk digital resmi.</span>
            </span>

            {onOpenNewDeposit && (
              <button
                onClick={onOpenNewDeposit}
                className="hidden sm:inline-flex items-center gap-1 font-semibold text-[#005596] hover:underline"
              >
                <span>+ Setor Baru</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column (1 Col / 33%): Earth / Ocean Water Droplet Inspirational Card */}
        <div
          id="card-eco-quote-pc"
          className="bg-[#F0F7FC] rounded-2xl border border-[#BAE6FD] p-7 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xs"
        >
          {/* Background soft glow rings */}
          <div className="absolute w-48 h-48 rounded-full bg-sky-100/60 pointer-events-none -top-10 -right-10 blur-2xl" />
          <div className="absolute w-48 h-48 rounded-full bg-blue-100/50 pointer-events-none -bottom-10 -left-10 blur-2xl" />

          {/* Eco Emblem Graphic: Ocean, Water Drop & Clean Earth Motif */}
          <div className="relative mb-5 z-10">
            <div className="w-24 h-24 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center p-3">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Water droplet base */}
                <circle cx="50" cy="50" r="38" fill="#E0F2FE" />
                <path
                  d="M32 50 C32 38, 50 20, 50 20 C50 20, 68 38, 68 50 C68 62, 60 70, 50 70 C40 70, 32 62, 32 50 Z"
                  fill="#00A3E0"
                  opacity="0.9"
                />
                {/* Ripple waves */}
                <path
                  d="M38 52 Q50 46 62 52 M42 58 Q50 54 58 58"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                {/* Clean water spark */}
                <circle cx="50" cy="38" r="2.5" fill="#FFFFFF" />
              </svg>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="relative z-10 space-y-3">
            <p className="text-sm font-semibold text-[#003B6D] leading-relaxed max-w-[260px]">
              Setiap kilogram sampah yang kamu setorkan, berarti satu langkah nyata untuk kelestarian air dan lingkungan.
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[#005596]">
              <span className="text-lg">💧</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
