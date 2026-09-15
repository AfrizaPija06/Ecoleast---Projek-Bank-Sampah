'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Trash2,
  Wallet,
  Cloud,
  ChevronRight,
  Home,
  Clock,
  User,
  Check,
  PlusCircle,
  ArrowDownCircle,
  FileText,
  Calendar,
  Building2,
  MapPin,
  Phone,
  Target,
  Award,
  ShieldCheck,
  LogOut,
  Info,
  Tag,
  Wifi,
  Battery,
  X,
} from 'lucide-react';
import {
  Nasabah,
  SetoranRecord,
  formatRupiah,
} from '@/lib/bankSampahData';
import { APP_LOGO_URL } from '@/lib/appConfig';

interface MobileDashboardViewProps {
  activeNasabah: Nasabah;
  nasabahList: Nasabah[];
  setoranRecords: SetoranRecord[];
  totalSaldoAktif: number;
  impact: {
    totalKg: number;
    co2eKg: number;
    totalNilaiRupiah: number;
  };
  onSelectNasabah: (nasabah: Nasabah) => void;
  onOpenNewDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onSelectRecord: (record: SetoranRecord) => void;
  userRole?: 'admin' | 'nasabah';
  onLogout?: () => void;
  isFramed?: boolean;
}

export function MobileDashboardView({
  activeNasabah,
  nasabahList,
  setoranRecords,
  totalSaldoAktif,
  impact,
  onSelectNasabah,
  onOpenNewDeposit,
  onOpenWithdraw,
  onSelectRecord,
  userRole = 'admin',
  onLogout,
  isFramed = false,
}: MobileDashboardViewProps) {
  const [mobileTab, setMobileTab] = useState<'beranda' | 'riwayat' | 'profil'>('beranda');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Logo URL from link / custom storage
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_custom_logo_url');
      if (stored) return stored;
    }
    return APP_LOGO_URL;
  });

  useEffect(() => {
    const handleLogoUpdate = () => {
      const custom = localStorage.getItem('app_custom_logo_url');
      if (custom) {
        setLogoUrl(custom);
      } else {
        setLogoUrl(APP_LOGO_URL);
      }
      setLogoError(false);
    };
    window.addEventListener('storage', handleLogoUpdate);
    window.addEventListener('app_logo_updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('storage', handleLogoUpdate);
      window.removeEventListener('app_logo_updated', handleLogoUpdate);
    };
  }, []);

  // Close search on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter nasabah for search
  const filteredNasabah = searchQuery.trim()
    ? nasabahList.filter(
        (n) =>
          n.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.unitBankSampah.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nasabahList;

  // Format date for mobile
  const formatDateShort = (dateStr: string) => {
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

  const getCategoryColor = (jenisDetail: string) => {
    const lower = jenisDetail.toLowerCase();
    if (lower.includes('botol plastik') || lower.includes('plastik')) return 'bg-sky-500';
    if (lower.includes('kertas')) return 'bg-blue-600';
    if (lower.includes('campur')) return 'bg-amber-500';
    if (lower.includes('kardus')) return 'bg-orange-600';
    return 'bg-emerald-600';
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-between bg-[#F7FAF9] text-gray-800 font-sans select-none antialiased min-h-[680px]">
      {/* 1. Mobile Status Bar (9:41, Icons) */}
      <div className="pt-3 px-6 flex items-center justify-between text-[11px] font-semibold text-gray-800 select-none">
        <span>9:41</span>
        <div className="flex items-center gap-1.5 text-gray-800">
          {/* Signal 4 bars */}
          <div className="flex items-end gap-0.5 h-2.5">
            <div className="w-0.5 h-1 bg-gray-800 rounded-2xs" />
            <div className="w-0.5 h-1.5 bg-gray-800 rounded-2xs" />
            <div className="w-0.5 h-2 bg-gray-800 rounded-2xs" />
            <div className="w-0.5 h-2.5 bg-gray-800 rounded-2xs" />
          </div>
          {/* Wifi */}
          <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
          {/* Battery */}
          <div className="flex items-center">
            <div className="w-5 h-2.5 border border-gray-800 rounded-xs p-0.5 flex items-center">
              <div className="w-full h-full bg-gray-800 rounded-3xs" />
            </div>
            <div className="w-0.5 h-1 bg-gray-800 rounded-r-3xs -ml-px" />
          </div>
        </div>
      </div>

      {/* 2. Mobile App Top Bar */}
      <header className="sticky top-0 z-30 bg-[#F7FAF9]/95 backdrop-blur-md px-5 pt-3 pb-2 flex items-center justify-between">
        {/* Logo using link, proportional & clean without awkward boxes */}
        <div className="flex items-center">
          {!logoError ? (
            <img
              src={logoUrl}
              alt="Logo Bank Sampah"
              className="h-8 max-w-[135px] object-contain"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#166258] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                BS
              </div>
              <span className="font-bold text-sm text-[#166258] tracking-tight">
                Bank Sampah
              </span>
            </div>
          )}
        </div>

        {/* Bell Notification matching mockup */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setHasNotification(false);
            }}
            className="relative p-2 rounded-full text-gray-700 hover:bg-white transition-colors"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5 stroke-[1.8]" />
            {hasNotification && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-600 rounded-full ring-2 ring-[#F7FAF9]" />
            )}
          </button>

          {/* Notification dropdown card */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <span className="text-xs font-bold text-gray-900">Pemberitahuan</span>
                <button
                  onClick={() => setIsNotificationOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-0.5 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 bg-emerald-50 rounded-xl text-[#1B635A]">
                  <div className="font-semibold text-[11px]">Jadwal Penimbangan Warga</div>
                  <p className="text-[10px] text-emerald-800 mt-0.5 leading-snug">
                    Minggu ini di Pos RW 05 pk 08:00 - 11:30 WIB. Jangan lupa bawa buku tabungan!
                  </p>
                </div>

                <div className="p-2 bg-sky-50 rounded-xl text-sky-900">
                  <div className="font-semibold text-[11px]">Tabungan Aman Terverifikasi</div>
                  <p className="text-[10px] text-sky-800 mt-0.5 leading-snug">
                    Saldo tabungan Anda saat ini: {formatRupiah(totalSaldoAktif || 750000)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Body based on tab */}
      <div className="flex-1 overflow-y-auto">
        {/* VIEW 1: BERANDA (Matching exact Mobile Mockup) */}
        {mobileTab === 'beranda' && (
          <div className="px-5 space-y-3.5 pt-1 pb-6 animate-in fade-in duration-200">
            {/* Greeting Section with Scenic Background Illustration matching mockup */}
            <div className="relative pt-2 pb-1 overflow-hidden min-h-[95px] flex items-center">
              {/* Background rolling hills & river illustration placeholder */}
              <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none opacity-85 overflow-hidden">
                <svg
                  viewBox="0 0 300 160"
                  preserveAspectRatio="xMaxYMid slice"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="mHill1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C4E7DC" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#9BD1C3" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="mRiver" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#80D6FF" stopOpacity="0.85" />
                      <stop offset="100%" stopColor="#4FC3F7" stopOpacity="0.95" />
                    </linearGradient>
                  </defs>
                  {/* Soft sky / hill curve */}
                  <path d="M30 100 Q140 30 300 65 L300 160 L30 160 Z" fill="url(#mHill1)" />
                  {/* River curve */}
                  <path
                    d="M0 130 C100 105, 175 138, 300 110 L300 160 L0 160 Z"
                    fill="url(#mRiver)"
                  />
                  {/* Leaf sprout on hill */}
                  <path
                    d="M240 68 C246 54, 260 50, 266 54 C262 62, 252 66, 240 68 Z"
                    fill="#2D6A4F"
                  />
                  <path
                    d="M245 68 C252 58, 264 60, 270 66 C262 70, 252 70, 245 68 Z"
                    fill="#52B788"
                  />
                  <path
                    d="M236 76 Q242 68 248 62"
                    stroke="#1B4332"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Greeting text */}
              <div className="relative z-10 max-w-[210px]">
                <span className="text-sm font-semibold text-gray-600 block">Halo,</span>
                <h1 className="text-xl font-extrabold text-[#003B6D] tracking-tight flex items-center gap-1.5 mt-0.5">
                  <span>{activeNasabah.nama}</span>
                  <span className="text-lg" role="img" aria-label="ombak">
                    💧
                  </span>
                </h1>
                <p className="text-[11px] text-gray-500 font-normal leading-relaxed mt-1">
                  Terima kasih sudah menjadi bagian dari lingkungan yang lebih baik.
                </p>
              </div>
            </div>

            {/* Search Bar matching mockup: "Cari nama nasabah..." (Admin only) */}
            {userRole === 'admin' && (
              <div ref={searchRef} className="relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    id="mobile-input-search-nasabah"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchOpen(true);
                    }}
                    onFocus={() => setIsSearchOpen(true)}
                    placeholder="Cari nama nasabah..."
                    className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs text-gray-700 placeholder-gray-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596] transition-all"
                  />
                </div>

                {/* Quick Suggestions Popup */}
                {isSearchOpen && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase text-gray-400">
                      Nasabah Terdaftar
                    </div>
                    <div className="max-h-48 overflow-y-auto space-y-1">
                      {filteredNasabah.map((n) => {
                        const isSelected = n.id === activeNasabah.id;
                        return (
                          <button
                            key={n.id}
                            onClick={() => {
                              onSelectNasabah(n);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                              isSelected
                                ? 'bg-[#005596]/10 text-[#005596] font-semibold'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#005596] text-white flex items-center justify-center font-bold text-[10px]">
                                {n.avatarInitials}
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">{n.nama}</div>
                                <div className="text-[10px] text-gray-500">{n.unitBankSampah}</div>
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#005596]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profil Nasabah Card matching mockup */}
            <div
              onClick={() => setMobileTab('profil')}
              className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 cursor-pointer hover:shadow-sm transition-all group"
            >
              {/* Header: "Profil Nasabah" and chevron right */}
              <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                <span className="text-xs font-bold text-gray-900">Profil Nasabah</span>
                <ChevronRight className="w-4 h-4 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
              </div>

              {/* Profile Content */}
              <div className="flex items-center gap-3.5 pt-3">
                {/* Silhouette or Custom Photo Avatar in Soft Blue/Cyan Circle */}
                <div className="w-12 h-12 rounded-full bg-[#E2F1ED] text-[#1B635A] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs ring-2 ring-emerald-100/50">
                  {activeNasabah.avatarUrl ? (
                    <img
                      src={activeNasabah.avatarUrl}
                      alt={activeNasabah.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-7 h-7 text-[#2B7D71] translate-y-0.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0H4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>

                {/* Name & Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-gray-900 leading-tight truncate">
                    {activeNasabah.nama}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {activeNasabah.unitBankSampah}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {activeNasabah.alamat}
                  </p>
                </div>
              </div>
            </div>

            {/* Ringkasan Kontribusi Section matching mockup */}
            <div className="space-y-2 pt-0.5">
              <h2 className="text-xs font-bold text-[#193F3A]">Ringkasan Kontribusi</h2>

              {/* 3 Metric Cards in 1 Row */}
              <div className="grid grid-cols-3 gap-2.5">
                {/* 1. Total Sampah */}
                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col items-center text-center justify-between min-h-[96px]">
                  <div className="w-9 h-9 rounded-full bg-[#E3F4F0] text-[#1B635A] flex items-center justify-center shrink-0 mb-1">
                    <Trash2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 leading-tight">
                    Total Sampah
                  </span>
                  <span className="text-xs font-black text-gray-900 tracking-tight mt-0.5">
                    {Math.round(impact.totalKg || 125)} kg
                  </span>
                </div>

                {/* 2. Tabungan */}
                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col items-center text-center justify-between min-h-[96px]">
                  <div className="w-9 h-9 rounded-full bg-[#E3F4F0] text-[#1B635A] flex items-center justify-center shrink-0 mb-1">
                    <Wallet className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 leading-tight">
                    Tabungan
                  </span>
                  <span className="text-xs font-black text-gray-900 tracking-tight mt-0.5 truncate max-w-full">
                    {formatRupiah(totalSaldoAktif || 750000)}
                  </span>
                </div>

                {/* 3. Kontribusi CO2 */}
                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col items-center text-center justify-between min-h-[96px]">
                  <div className="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#005596] flex items-center justify-center shrink-0 mb-1">
                    <div className="relative flex items-center justify-center">
                      <Cloud className="w-4 h-4 stroke-[2.2]" />
                      <span className="absolute text-[6px] font-bold text-[#005596] -bottom-0.5">
                        CO2
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 leading-tight">
                    Kontribusi CO₂
                  </span>
                  <span className="text-xs font-black text-gray-900 tracking-tight mt-0.5 truncate max-w-full">
                    {Math.round(impact.co2eKg || 185)} kg CO₂e
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Card matching mockup: "Bersama Menjaga Lingkungan" */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#F0F7FC] via-[#E4F1FA] to-[#D5EAF7] border border-[#BAE6FD]/80 p-4 shadow-xs">
              {/* Background scenic foliage and river illustration */}
              <div className="absolute right-0 top-0 bottom-0 w-3/5 pointer-events-none overflow-hidden opacity-90">
                <svg
                  viewBox="0 0 240 120"
                  preserveAspectRatio="xMaxYMid slice"
                  className="w-full h-full"
                >
                  <defs>
                    <linearGradient id="bannerWater" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="bannerSky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#BAE6FD" />
                      <stop offset="100%" stopColor="#005596" />
                    </linearGradient>
                  </defs>
                  {/* Water wave */}
                  <path
                    d="M0 80 C60 65, 120 90, 240 70 L240 120 L0 120 Z"
                    fill="url(#bannerWater)"
                  />
                  {/* Hill curve */}
                  <path d="M120 120 Q170 80 240 85 L240 120 Z" fill="url(#bannerSky)" />
                </svg>
              </div>

              {/* Banner Text */}
              <div className="relative z-10 max-w-[170px] py-1">
                <h3 className="text-sm font-bold text-[#003B6D] leading-tight tracking-tight">
                  Bersama Menjaga Lingkungan
                </h3>
                <p className="text-[11px] text-[#005596] mt-1 font-medium leading-relaxed">
                  Setiap sampah yang kamu pilah adalah berkah.
                </p>
              </div>
            </div>

            {/* Quick Actions (Admin only or subtle helper for nasabah) */}
            {userRole === 'admin' && (
              <div className="pt-1 flex items-center gap-2.5">
                {onOpenNewDeposit && (
                  <button
                    id="btn-mobile-new-deposit"
                    onClick={onOpenNewDeposit}
                    className="flex-1 py-2.5 px-3 bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Setor Sampah</span>
                  </button>
                )}
                {onOpenWithdraw && (
                  <button
                    id="btn-mobile-withdraw"
                    onClick={onOpenWithdraw}
                    className="flex-1 py-2.5 px-3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ArrowDownCircle className="w-3.5 h-3.5 text-[#005596]" />
                    <span>Tarik Saldo</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: RIWAYAT (Transaction history list for mobile) */}
        {mobileTab === 'riwayat' && (
          <div className="px-5 space-y-3.5 pt-2 pb-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h1 className="text-sm font-bold text-gray-900">Riwayat Setoran</h1>
                <p className="text-[11px] text-gray-500">
                  Semua transaksi penimbangan nasabah {activeNasabah.nama}
                </p>
              </div>
              {userRole === 'admin' && onOpenNewDeposit && (
                <button
                  id="btn-mobile-tambah-riwayat"
                  onClick={onOpenNewDeposit}
                  className="px-2.5 py-1.5 bg-[#1B635A] text-white text-xs font-medium rounded-lg flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              )}
            </div>

            <div className="space-y-2">
              {setoranRecords.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-gray-500 border border-gray-100">
                  Belum ada riwayat setoran sampah.
                </div>
              ) : (
                setoranRecords.map((rec) => {
                  const primaryItem = rec.items[0] || {
                    jenisDetail: 'Sampah Terpilah',
                    berat: rec.totalBerat,
                    subtotal: rec.totalNilai,
                  };
                  const dotColor = getCategoryColor(primaryItem.jenisDetail);

                  return (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecord(rec)}
                      className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-xs flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-3.5 h-3.5 rounded-full ${dotColor} shrink-0 ring-2 ring-white shadow-2xs`}
                        />
                        <div>
                          <div className="font-bold text-xs text-gray-900">
                            {primaryItem.jenisDetail}
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            {formatDateShort(rec.tanggal)} • {rec.totalBerat} kg
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <div className="font-bold text-xs text-[#1B635A]">
                            {formatRupiah(rec.totalNilai)}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-medium">
                            Terverifikasi
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PROFIL (Nasabah details for mobile) */}
        {mobileTab === 'profil' && (
          <div className="px-5 space-y-3.5 pt-2 pb-6 animate-in fade-in duration-200">
            {/* User Profile Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs text-center space-y-3">
              <div className="w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full bg-[#E2F1ED] text-[#1B635A] flex items-center justify-center overflow-hidden ring-4 ring-emerald-50 shadow-sm">
                  {activeNasabah.avatarUrl ? (
                    <img
                      src={activeNasabah.avatarUrl}
                      alt={activeNasabah.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-11 h-11 text-[#2B7D71] translate-y-1"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0H4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-base font-bold text-gray-900">{activeNasabah.nama}</h2>
                <p className="text-xs text-gray-500 mt-0.5">{activeNasabah.unitBankSampah}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-100">
                    {activeNasabah.id}
                  </span>
                  <span className="bg-amber-50 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-100">
                    {activeNasabah.level}
                  </span>
                </div>
              </div>
            </div>

            {/* Details list */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Wilayah / Alamat</span>
                <span className="font-semibold text-gray-800">{activeNasabah.alamat}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Nomor Telepon / WA</span>
                <span className="font-semibold text-gray-800">{activeNasabah.noTelepon}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Tanggal Bergabung</span>
                <span className="font-semibold text-gray-800">
                  {activeNasabah.tanggalBergabung}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-400">Target Bulanan</span>
                <span className="font-semibold text-emerald-700">
                  {activeNasabah.targetBulananKg} kg
                </span>
              </div>
            </div>

            {/* Account Status Card for Nasabah */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-900 space-y-1.5">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1B635A]" />
                <span>Akun Nasabah Terverifikasi</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Akun Anda terdaftar resmi di {activeNasabah.unitBankSampah}. Setiap kilogram sampah
                yang Anda setorkan tercatat transparan di buku tabungan digital ini.
              </p>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <div className="pt-1">
                <button
                  id="btn-mobile-logout"
                  onClick={onLogout}
                  className="w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-2xl border border-rose-200/80 transition-colors flex items-center justify-center gap-2 shadow-2xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun Nasabah</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Bottom Navigation Bar matching mockup */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-gray-100/90 pt-2 pb-3 px-8 shadow-md">
        <nav id="mobile-bottom-nav" className="flex items-center justify-around">
          {/* 1. Beranda */}
          <button
            onClick={() => setMobileTab('beranda')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'beranda'
                ? 'text-[#1B635A] font-bold'
                : 'text-gray-400 hover:text-gray-600 font-normal'
            }`}
          >
            <Home
              className={`w-5 h-5 ${
                mobileTab === 'beranda' ? 'stroke-[2.5]' : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] tracking-tight">Beranda</span>
          </button>

          {/* 2. Riwayat */}
          <button
            onClick={() => setMobileTab('riwayat')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'riwayat'
                ? 'text-[#1B635A] font-bold'
                : 'text-gray-400 hover:text-gray-600 font-normal'
            }`}
          >
            <Clock
              className={`w-5 h-5 ${
                mobileTab === 'riwayat' ? 'stroke-[2.5]' : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] tracking-tight">Riwayat</span>
          </button>

          {/* 3. Profil */}
          <button
            onClick={() => setMobileTab('profil')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              mobileTab === 'profil'
                ? 'text-[#1B635A] font-bold'
                : 'text-gray-400 hover:text-gray-600 font-normal'
            }`}
          >
            <User
              className={`w-5 h-5 ${
                mobileTab === 'profil' ? 'stroke-[2.5]' : 'stroke-[1.8]'
              }`}
            />
            <span className="text-[10px] tracking-tight">Profil</span>
          </button>
        </nav>

        {/* iPhone home indicator bar */}
        <div className="w-28 h-1 bg-gray-900/30 rounded-full mx-auto mt-2.5" />
      </div>
    </div>
  );
}
