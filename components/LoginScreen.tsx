'use client';

import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Lock,
  ArrowRight,
  Leaf,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  X,
  Wifi,
  Battery,
  Signal,
  HelpCircle,
  Landmark,
  Building2,
} from 'lucide-react';
import { Nasabah } from '@/lib/bankSampahData';
import {
  AuthSession,
  ADMIN_CREDENTIALS,
  FORUM_SUPERADMIN_CREDENTIALS,
  UNIT_02_CREDENTIALS,
  saveAuthSession,
} from '@/lib/auth';
import { getStoredBankUnits } from '@/lib/dbStore';
import { APP_LOGO_URL } from '@/lib/appConfig';
import { RegisterBankUnitModal } from '@/components/RegisterBankUnitModal';
import { BankUnit } from '@/lib/schema/types';

const WELCOME_QUOTES = [
  'Setiap sampah yang kamu pilah adalah kebaikan kecil yang menyelamatkan bumi. 🌱',
  'Langkah kecil kita hari ini adalah warisan udara bersih untuk anak cucu esok hari. 🌍',
  'Ubah sampah jadi berkah, rawat lingkungan jadi kebiasaan indah. 💚',
  'Bumi tidak butuh segelintir orang yang sempurna, melainkan jutaan orang yang peduli. 🌿',
  'Terima kasih sudah melangkah bersama menjaga kebersihan dan kelestarian alam. ✨',
  'Memilah sampah bukan sekadar menabung rupiah, melainkan menabung masa depan. 🍃',
  'Satu pilahan sampah di rumah, ribuan kebaikan bagi kelestarian dunia. 🌏',
  'Kebaikan yang kamu tabung hari ini mengalir menjadi senyuman alam esok hari. 🌸',
  'Bumi hijau bermula dari tangan yang peduli dan hati yang tulus memilah. 🌾',
];

interface LoginScreenProps {
  nasabahList: Nasabah[];
  onLoginSuccess: (session: AuthSession) => void;
}

export function LoginScreen({ nasabahList, onLoginSuccess }: LoginScreenProps) {
  // Navigation & Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isRegisterUnitModalOpen, setIsRegisterUnitModalOpen] = useState(false);

  // Logo URL (diambil dari link lib/appConfig.ts / localStorage)
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_custom_logo_url');
      if (stored) return stored;
    }
    return APP_LOGO_URL;
  });
  const [logoError, setLogoError] = useState(false);

  // Sinkronisasi logo secara realtime
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

  // Role & Form States (3 Tingkatan Hierarki)
  const [selectedRole, setSelectedRole] = useState<'nasabah' | 'admin_unit' | 'forum_desa'>('nasabah');
  const [selectedNasabahId, setSelectedNasabahId] = useState<string>(
    nasabahList[0]?.id || 'NSB-0419'
  );
  const [nasabahPin, setNasabahPin] = useState('123456');
  const [showPin, setShowPin] = useState(false);

  // Tingkat 2: Admin Bank Unit
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [selectedAdminUnitId, setSelectedAdminUnitId] = useState<string>('UNIT-CCD-001');

  // Tingkat 1: Forum Desa Cicadas
  const [forumUsername, setForumUsername] = useState('forum');
  const [forumPassword, setForumPassword] = useState('cicadas123');
  const [showForumPassword, setShowForumPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load bank units dynamically from localStorage database
  const [storedUnits, setStoredUnits] = useState<BankUnit[]>(() => {
    return getStoredBankUnits();
  });

  useEffect(() => {
    const handleUnitStorage = () => {
      const units = getStoredBankUnits();
      setStoredUnits(units);
    };
    window.addEventListener('storage', handleUnitStorage);
    return () => window.removeEventListener('storage', handleUnitStorage);
  }, []);

  // Quotes yang berubah setiap kali masuk / dibuka
  const [quoteIndex, setQuoteIndex] = useState(() =>
    Math.floor(Math.random() * WELCOME_QUOTES.length)
  );

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % WELCOME_QUOTES.length);
  };

  // Rotasi otomatis kutipan secara berkala
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % WELCOME_QUOTES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  // Helper login functions (3-Tier)
  const performLoginNasabah = (nasabah: Nasabah) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const session: AuthSession = {
        id: nasabah.id,
        role: 'nasabah',
        tierLevel: 3,
        username: nasabah.id,
        name: nasabah.nama,
        title: 'Nasabah Terdaftar',
        nasabahId: nasabah.id,
        unitBankSampah: nasabah.unitBankSampah,
        avatarInitials: nasabah.avatarInitials,
        avatarUrl: nasabah.avatarUrl,
        phone: nasabah.noTelepon,
        loginTime: new Date().toISOString(),
      };
      saveAuthSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
    }, 250);
  };

  const performLoginAdmin = (unitParam?: BankUnit | string | boolean) => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      let targetUnit: BankUnit | undefined;
      const currentStoredUnits = getStoredBankUnits();

      if (typeof unitParam === 'object' && unitParam !== null) {
        targetUnit = unitParam;
      } else if (typeof unitParam === 'string') {
        targetUnit = currentStoredUnits.find(
          (u) => u.id === unitParam || u.kodeUnit === unitParam || u.nama.toLowerCase().includes(unitParam.toLowerCase())
        );
      } else if (unitParam === true) {
        targetUnit = currentStoredUnits.find((u) => u.id === 'UNIT-CCD-002') || currentStoredUnits[1];
      }

      if (!targetUnit) {
        targetUnit = currentStoredUnits.find((u) => u.id === selectedAdminUnitId) || currentStoredUnits[0] || {
          id: 'UNIT-CCD-001',
          kodeUnit: 'CCD-U01',
          nama: 'Bank Sampah Mekar Jaya RW 01',
          rw: 'RW 01',
        };
      }

      const session: AuthSession = {
        id: `USR-${targetUnit.id}`,
        role: 'admin_unit',
        tierLevel: 2,
        username: `admin.${targetUnit.rw.toLowerCase().replace(/\s+/g, '')}`,
        name: `Pengurus ${targetUnit.nama}`,
        title: `Pengurus ${targetUnit.nama}`,
        unitId: targetUnit.id,
        unitKode: targetUnit.kodeUnit,
        unitBankSampah: targetUnit.nama,
        avatarInitials: targetUnit.rw.replace('RW ', '') || '01',
        avatarUrl: undefined,
        phone: targetUnit.kontakHp || '0812-3456-7890',
        email: targetUnit.email,
        loginTime: new Date().toISOString(),
      };
      saveAuthSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
    }, 250);
  };

  const performLoginForum = () => {
    setIsLoading(true);
    setErrorMessage(null);
    setTimeout(() => {
      const session: AuthSession = {
        id: FORUM_SUPERADMIN_CREDENTIALS.id,
        role: 'superadmin_forum',
        tierLevel: 1,
        username: FORUM_SUPERADMIN_CREDENTIALS.username,
        name: FORUM_SUPERADMIN_CREDENTIALS.name,
        title: FORUM_SUPERADMIN_CREDENTIALS.title,
        unitBankSampah: FORUM_SUPERADMIN_CREDENTIALS.unitBankSampah,
        avatarInitials: FORUM_SUPERADMIN_CREDENTIALS.avatarInitials,
        avatarUrl: undefined,
        phone: FORUM_SUPERADMIN_CREDENTIALS.phone,
        email: FORUM_SUPERADMIN_CREDENTIALS.email,
        loginTime: new Date().toISOString(),
      };
      saveAuthSession(session);
      onLoginSuccess(session);
      setIsLoading(false);
    }, 250);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (selectedRole === 'nasabah') {
      const nasabah = nasabahList.find((n) => n.id === selectedNasabahId) || nasabahList[0];
      if (!nasabah) {
        setErrorMessage('Pilih akun nasabah Anda terlebih dahulu.');
        return;
      }
      performLoginNasabah(nasabah);
    } else if (selectedRole === 'admin_unit') {
      const user = adminUsername.trim().toLowerCase();
      const currentStoredUnits = getStoredBankUnits();

      const matchedUnit = currentStoredUnits.find((u) => {
        const uRw = u.rw.toLowerCase().replace(/\s+/g, '');
        const uKode = (u.kodeUnit || '').toLowerCase();
        const uId = u.id.toLowerCase();
        const uName = u.nama.toLowerCase();
        return (
          user === `admin.${uRw}` ||
          user === uRw ||
          user === uKode ||
          user === uId ||
          (user === 'admin' && (u.id === 'UNIT-CCD-001' || u.id === selectedAdminUnitId)) ||
          (user === 'admin.mekarjaya' && u.id === 'UNIT-CCD-001') ||
          (user === 'petugas' && (u.id === 'UNIT-CCD-001' || u.id === selectedAdminUnitId)) ||
          (user === 'admin.berkah' && u.id === 'UNIT-CCD-002') ||
          (user === 'berkah' && u.id === 'UNIT-CCD-002') ||
          uName.includes(user)
        );
      });

      const chosenUnit = matchedUnit || currentStoredUnits.find((u) => u.id === selectedAdminUnitId) || currentStoredUnits[0];

      if (
        (adminPassword === 'admin123' || adminPassword === 'admin' || adminPassword === '123456' || adminPassword === 'berkah123') ||
        user.length > 0
      ) {
        performLoginAdmin(chosenUnit);
      } else {
        setErrorMessage('Username atau kata sandi pengurus unit salah. Gunakan default: admin / admin123');
      }
    } else if (selectedRole === 'forum_desa') {
      const user = forumUsername.trim().toLowerCase();
      if (
        (user === 'forum' || user === 'forum.cicadas' || user === 'kades') &&
        (forumPassword === 'cicadas123' || forumPassword === 'forum123' || forumPassword === 'admin123')
      ) {
        performLoginForum();
      } else {
        setErrorMessage('Username atau kata sandi Forum Desa salah. Gunakan default: forum / cicadas123');
      }
    }
  };

  const currentNasabah = nasabahList.find((n) => n.id === selectedNasabahId) || nasabahList[0];

  return (
    <div
      id="login-screen-container"
      className="min-h-screen bg-[#F0F7FC] flex flex-col items-center justify-center p-3 sm:p-6 text-gray-800 font-sans antialiased selection:bg-[#BAE6FD]"
    >
      {/* Container Frame matching the reference design */}
      <div className="w-full max-w-sm mx-auto">
        {/* Main Phone-style Screen Card */}
        <div
          id="welcome-phone-card"
          className="relative w-full bg-white rounded-[40px] shadow-xl shadow-[#005596]/10 border border-[#D0E5F5] overflow-hidden flex flex-col items-center px-6 pt-3 pb-7 transition-all"
        >
          {/* Subtle Mobile Status Bar Header */}
          <div className="w-full flex items-center justify-between text-gray-800 px-3 py-1 mb-2 text-xs font-semibold select-none">
            <span className="tracking-tight text-[11px] font-bold">9:41</span>
            <div className="flex items-center gap-1.5 opacity-80">
              <Signal className="w-3 h-3 text-[#005596]" />
              <Wifi className="w-3 h-3 text-[#005596]" />
              <Battery className="w-3.5 h-3.5 text-[#005596]" />
            </div>
          </div>

          {/* 1. Logo */}
          <div className="mt-1 mb-2 flex flex-col items-center">
            <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              {logoUrl && !logoError ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoUrl}
                  alt="Logo Aplikasi"
                  className="w-full h-full object-contain drop-shadow-xs"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-sky-50 border-2 border-[#005596] flex items-center justify-center text-[#005596]">
                  <Leaf className="w-12 h-12 text-[#005596]" />
                </div>
              )}
            </div>
          </div>

          {/* 2. Headline: Setor Sampah Raih Manfaat */}
          <div className="text-center space-y-0.5 mb-1.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-tight tracking-tight">
              Setor Sampah
            </h1>
            <div className="inline-flex items-center justify-center gap-1.5">
              <span className="text-xl sm:text-2xl font-extrabold text-[#005596] tracking-tight">
                Raih Manfaat
              </span>
              <Leaf className="w-4 h-4 text-[#00A3E0] fill-[#00A3E0]/20" />
            </div>
            <p className="text-xs text-gray-500 max-w-[250px] mx-auto pt-0.5 font-medium leading-relaxed">
              Sistem Informasi Pengelolaan Sampah Mandiri & Tabungan Lingkungan.
            </p>
          </div>

          {/* 3. Inspiring Quotes Card */}
          <div className="w-full max-w-[320px] my-2">
            <button
              type="button"
              onClick={handleNextQuote}
              title="Klik untuk mengganti kutipan"
              className="w-full px-3.5 py-2.5 bg-[#F0F7FC] hover:bg-sky-100/70 border border-[#BAE6FD] rounded-2xl text-left text-xs text-[#005596] font-medium transition-all flex items-center gap-2 group cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00A3E0] shrink-0 group-hover:rotate-12 transition-transform" />
              <p className="italic leading-snug flex-1 truncate font-medium">
                &ldquo;{WELCOME_QUOTES[quoteIndex]}&rdquo;
              </p>
              <RefreshCw className="w-3 h-3 text-[#00A3E0] opacity-60 group-hover:opacity-100 group-hover:rotate-180 transition-all shrink-0" />
            </button>
          </div>

          {/* 4. Primary Action Button: "Masuk" */}
          <div className="w-full space-y-3 mt-3">
            <button
              id="btn-main-welcome-masuk"
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setIsLoginModalOpen(true);
              }}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#005596] to-[#003B6D] hover:from-[#004880] hover:to-[#002E55] active:scale-[0.98] text-white font-bold text-sm sm:text-base rounded-full shadow-md shadow-[#005596]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Masuk</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* 6. Footer Link: "Belum punya akun? Daftar" */}
            <div className="text-center text-xs text-gray-500 font-medium">
              <span>Belum punya akun? </span>
              <button
                type="button"
                id="link-register-trigger"
                onClick={() => setIsRegisterModalOpen(true)}
                className="text-[#005596] hover:text-[#003B6D] font-bold hover:underline transition-colors cursor-pointer"
              >
                Daftar
              </button>
            </div>

            {/* Quick 3-Tier Selector for instant testing */}
            <div className="pt-2 border-t border-sky-900/10">
              <div className="text-[10px] text-center text-gray-400 font-medium mb-1.5">
                Akses Langsung Akun Contoh (3 Tingkat):
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  type="button"
                  id="welcome-quick-forum"
                  onClick={performLoginForum}
                  className="py-1.5 px-1 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold rounded-lg border border-amber-200 transition-all flex flex-col items-center justify-center leading-tight"
                >
                  <Landmark className="w-3 h-3 text-amber-700 mb-0.5" />
                  <span>Forum Desa</span>
                </button>
                <button
                  type="button"
                  id="welcome-quick-unit"
                  onClick={() => performLoginAdmin(false)}
                  className="py-1.5 px-1 bg-sky-50 hover:bg-sky-100 text-[#005596] text-[10px] font-bold rounded-lg border border-sky-200 transition-all flex flex-col items-center justify-center leading-tight"
                >
                  <Building2 className="w-3 h-3 text-[#005596] mb-0.5" />
                  <span>Bank Unit RW</span>
                </button>
                <button
                  type="button"
                  id="welcome-quick-nasabah"
                  onClick={() => performLoginNasabah(nasabahList[0])}
                  className="py-1.5 px-1 bg-blue-50 hover:bg-blue-100 text-[#003B6D] text-[10px] font-bold rounded-lg border border-blue-200 transition-all flex flex-col items-center justify-center leading-tight"
                >
                  <User className="w-3 h-3 text-[#005596] mb-0.5" />
                  <span>Nasabah</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-label under mockup */}
        <div className="text-center mt-3 text-[11px] text-[#005596]/70 font-semibold select-none flex items-center justify-center gap-1.5">
          <span>💧 Bank Sampah Desa Cicadas</span>
          <span>•</span>
          <span>Sistem Informasi 3 Tingkat</span>
        </div>
      </div>

      {/* ================= MODAL LOGIN SHEET ================= */}
      {isLoginModalOpen && (
        <div
          id="login-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsLoginModalOpen(false)}
        >
          <div
            id="login-modal-sheet"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-7 shadow-2xl border border-gray-100 space-y-5 animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-1 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B635A] flex items-center justify-center font-bold">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Masuk ke Akun</h3>
                  <p className="text-[11px] text-gray-400">Pilih jenis akun Anda untuk melanjutkan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 3-Tier Role Switcher */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F0F7FC] border border-[#D0E5F5] rounded-2xl text-[11px]">
              <button
                type="button"
                id="tab-login-nasabah"
                onClick={() => {
                  setSelectedRole('nasabah');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedRole === 'nasabah'
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'text-[#1E4E79] hover:text-[#005596]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>3. Nasabah</span>
              </button>

              <button
                type="button"
                id="tab-login-admin-unit"
                onClick={() => {
                  setSelectedRole('admin_unit');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedRole === 'admin_unit'
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'text-[#1E4E79] hover:text-[#005596]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>2. Bank Unit</span>
              </button>

              <button
                type="button"
                id="tab-login-forum-desa"
                onClick={() => {
                  setSelectedRole('forum_desa');
                  setErrorMessage(null);
                }}
                className={`py-2 px-1.5 rounded-xl font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                  selectedRole === 'forum_desa'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-[#1E4E79] hover:text-[#005596]'
                }`}
              >
                <Landmark className="w-3.5 h-3.5" />
                <span>1. Forum Desa</span>
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedRole === 'nasabah' && (
                <>
                  <div className="p-2.5 bg-sky-50/70 rounded-xl border border-sky-200 text-[11px] text-[#003B6D]">
                    <span className="font-bold">Tingkat 3 (Nasabah / Warga):</span> Akses buku tabungan sampah digital, riwayat setoran per unit, dan penarikan saldo.
                  </div>

                  {/* Select Nasabah */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Pilih Akun Nasabah
                    </label>
                    <select
                      id="select-nasabah-login"
                      value={selectedNasabahId}
                      onChange={(e) => setSelectedNasabahId(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all"
                    >
                      {nasabahList.map((nasabah) => (
                        <option key={nasabah.id} value={nasabah.id}>
                          {nasabah.nama} ({nasabah.id}) • {nasabah.unitBankSampah}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Selected Nasabah Preview Pill */}
                  {currentNasabah && (
                    <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#005596] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {currentNasabah.avatarInitials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-[#003B6D] truncate">
                          {currentNasabah.nama}
                        </div>
                        <div className="text-[11px] text-[#005596]">
                          {currentNasabah.unitBankSampah}
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-[#00A3E0] shrink-0 mr-1" />
                    </div>
                  )}

                  {/* PIN Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-700">
                        PIN Keamanan
                      </label>
                      <span className="text-[11px] text-gray-400">Default: 123456</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPin ? 'text' : 'password'}
                        id="input-nasabah-pin"
                        placeholder="123456"
                        value={nasabahPin}
                        onChange={(e) => setNasabahPin(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    id="btn-submit-nasabah-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#005596] hover:bg-[#004275] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>{isLoading ? 'Memuat...' : 'Masuk sebagai Nasabah'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-center pt-1">
                    <p className="text-[11px] text-gray-500">
                      Lupa ID Akun atau PIN? Silakan tanyakan ke <b>Admin Bank Unit</b> Anda di pos penimbangan untuk dibantu reset kata sandi & pemulihan data akun.
                    </p>
                  </div>
                </>
              )}

              {selectedRole === 'admin_unit' && (
                <>
                  <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-[11px] text-[#003B6D]">
                    <span className="font-bold">Tingkat 2 (Bank Sampah Unit):</span> Kelola setoran warga, buku kas unit, dan penyesuaian harga sampah lokal unit RW.
                  </div>

                  {/* Bank Unit Database Selector */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Pilih Database Bank Unit RW
                    </label>
                    <select
                      id="select-bank-unit-login"
                      value={selectedAdminUnitId}
                      onChange={(e) => {
                        const uid = e.target.value;
                        setSelectedAdminUnitId(uid);
                        const u = storedUnits.find((unit) => unit.id === uid);
                        if (u) {
                          setAdminUsername(`admin.${u.rw.toLowerCase().replace(/\s+/g, '')}`);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all cursor-pointer"
                    >
                      {storedUnits.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.nama} ({u.rw}) • {u.kodeUnit || u.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Admin Unit Username */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Username Pengurus Unit
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="input-admin-username"
                        placeholder="admin (RW 01) atau admin.berkah (RW 02)"
                        value={adminUsername}
                        onChange={(e) => setAdminUsername(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all"
                      />
                    </div>
                    <div className="text-[11px] text-gray-500 flex justify-between">
                      <span>Default: <b>admin</b> (RW 01)</span>
                      <span>Atau: <b>admin.berkah</b> (RW 02)</span>
                    </div>
                  </div>

                  {/* Admin Unit Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-700">
                        Kata Sandi
                      </label>
                      <span className="text-[11px] text-gray-400">Default: admin123</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showAdminPassword ? 'text' : 'password'}
                        id="input-admin-password"
                        placeholder="admin123"
                        value={adminPassword}
                        onChange={(e) => setAdminPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminPassword(!showAdminPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showAdminPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Admin Button */}
                  <button
                    id="btn-submit-admin-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-[#005596] hover:bg-[#004275] text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Pengurus Unit'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {selectedRole === 'forum_desa' && (
                <>
                  <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200 text-[11px] text-amber-950">
                    <span className="font-bold">Tingkat 1 (Forum Desa Cicadas - Induk):</span> Super Admin desa untuk agregasi seluruh bank unit, katalog rujukan harga desa, serta verifikasi & persetujuan unit baru.
                  </div>

                  {/* Forum Username */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Username Super Admin Desa
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        id="input-forum-username"
                        placeholder="forum atau forum.cicadas"
                        value={forumUsername}
                        onChange={(e) => setForumUsername(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all"
                      />
                    </div>
                    <span className="text-[11px] text-gray-500">Default: <b>forum</b> (H. Rahmat Hidayat)</span>
                  </div>

                  {/* Forum Password */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-gray-700">
                        Kata Sandi Forum
                      </label>
                      <span className="text-[11px] text-gray-400">Default: cicadas123</span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showForumPassword ? 'text' : 'password'}
                        id="input-forum-password"
                        placeholder="cicadas123"
                        value={forumPassword}
                        onChange={(e) => setForumPassword(e.target.value)}
                        className="w-full pl-9 pr-9 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-600 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowForumPassword(!showForumPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showForumPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Forum Button */}
                  <button
                    id="btn-submit-forum-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                  >
                    <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Forum Desa Cicadas'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </form>

            {/* Quick 1-Click Access for easy testing (3 Tiers) */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="text-[11px] text-center text-gray-400 font-medium">
                Pilih cepat akun contoh (3 Tingkatan):
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  id="btn-quick-forum-simple"
                  onClick={performLoginForum}
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 text-[11px] font-semibold rounded-xl border border-amber-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-700" />
                  <span className="leading-tight">Forum Desa<br/><span className="text-[9px] text-amber-700 font-normal">(Tk. 1 Induk)</span></span>
                </button>

                <button
                  type="button"
                  id="btn-quick-admin-simple"
                  onClick={() => performLoginAdmin(false)}
                  className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-900 text-[11px] font-semibold rounded-xl border border-blue-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-700" />
                  <span className="leading-tight">Bank Unit RW 01<br/><span className="text-[9px] text-blue-700 font-normal">(Tk. 2 Unit)</span></span>
                </button>

                <button
                  type="button"
                  id="btn-quick-nasabah-simple"
                  onClick={() => performLoginNasabah(nasabahList[0])}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-[11px] font-semibold rounded-xl border border-emerald-200 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer text-center"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="leading-tight">Warga Nasabah<br/><span className="text-[9px] text-emerald-700 font-normal">(Tk. 3 Warga)</span></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DAFTAR BARU ================= */}
      {isRegisterModalOpen && (
        <div
          id="register-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsRegisterModalOpen(false)}
        >
          <div
            id="register-modal-card"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#1B635A] flex items-center justify-center">
                  <HelpCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Alur Pendaftaran Bank Sampah</h3>
                  <p className="text-[10px] text-gray-400">Hierarki Desa Cicadas (3 Tingkat)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Jalur 1: Pendaftaran Warga Nasabah */}
            <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                <User className="w-4 h-4 text-emerald-700" />
                <span>1. Pendaftaran Warga / Nasabah (Tingkat 3)</span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Warga masyarakat dapat mendaftar langsung di <b>Bank Sampah Unit RT/RW setempat</b> saat jadwal penimbangan berkala. Pengurus unit akan membuatkan nomor rekening tabungan digital.
              </p>
            </div>

            {/* Jalur 2: Pendaftaran Bank Sampah Unit Baru */}
            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                <Building2 className="w-4 h-4 text-amber-700" />
                <span>2. Pendaftaran Bank Sampah Unit Baru (Tingkat 2)</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Bagi pengurus RT/RW atau kelompok masyarakat yang ingin mendirikan unit bank sampah baru, permohonan diajukan secara resmi kepada <b>Forum Bank Sampah Desa Cicadas</b> untuk verifikasi berkas dan penerbitan SK pengesahan desa.
              </p>
              <button
                type="button"
                id="btn-open-register-bank-unit-flow"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  setIsRegisterUnitModalOpen(true);
                }}
                className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Buka Formulir Pendaftaran Bank Unit</span>
              </button>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsRegisterModalOpen(false)}
                className="flex-1 py-2.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsRegisterModalOpen(false);
                  performLoginNasabah(nasabahList[0]);
                }}
                className="flex-1 py-2.5 px-3 bg-[#1B635A] hover:bg-[#15524a] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Coba Akun Warga
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULIR PENDAFTARAN BANK UNIT BARU (FASE 2) */}
      <RegisterBankUnitModal
        isOpen={isRegisterUnitModalOpen}
        onClose={() => setIsRegisterUnitModalOpen(false)}
        onSwitchToForumLogin={performLoginForum}
      />
    </div>
  );
}
