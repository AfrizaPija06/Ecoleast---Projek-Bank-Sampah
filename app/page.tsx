'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  INITIAL_NASABAH_LIST,
  INITIAL_SETORAN_RECORDS,
  Nasabah,
  SetoranRecord,
  calculateImpact,
  formatRupiah,
  WASTE_CATEGORIES,
} from '@/lib/bankSampahData';
import { Sidebar } from '@/components/Sidebar';
import { TopHeader } from '@/components/TopHeader';
import { RecentSetoranTable } from '@/components/RecentSetoranTable';
import { EcoQuoteCard } from '@/components/EcoQuoteCard';
import { ReceiptModal } from '@/components/ReceiptModal';
import { NewDepositModal } from '@/components/NewDepositModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { EcoImpactSection } from '@/components/EcoImpactSection';
import { CategoryBreakdown } from '@/components/CategoryBreakdown';
import { SetoranHistory } from '@/components/SetoranHistory';
import { MobileDashboardView } from '@/components/MobileDashboardView';
import { LoginScreen } from '@/components/LoginScreen';
import { NasabahPortalDesktop } from '@/components/NasabahPortalDesktop';
import { WebsitePcDashboard } from '@/components/WebsitePcDashboard';
import { OverallDashboard } from '@/components/OverallDashboard';
import { AdminEducationManager } from '@/components/AdminEducationManager';
import { KatalogHargaView } from '@/components/KatalogHargaView';
import { ForumApprovalView } from '@/components/ForumApprovalView';
import { PetaSebaranView } from '@/components/PetaSebaranView';
import { RegisterNasabahModal } from '@/components/RegisterNasabahModal';
import { NasabahManagementView } from '@/components/NasabahManagementView';
import { BankUnit } from '@/lib/schema/types';
import { getStoredBankUnits } from '@/lib/dbStore';
import { APP_LOGO_URL } from '@/lib/appConfig';
import {
  AuthSession,
  getStoredAuthSession,
  clearAuthSession,
  saveAuthSession,
  FORUM_SUPERADMIN_CREDENTIALS,
} from '@/lib/auth';
import {
  CheckCircle2,
  PlusCircle,
  ArrowDownCircle,
  Lightbulb,
  Package,
  RotateCcw,
  Sparkles,
  Building2,
  Clock,
  PhoneCall,
  ChevronRight,
  ShieldCheck,
  Award,
  Monitor,
  Smartphone,
  Wifi,
  Battery,
  Camera,
  X,
  Globe2,
  Leaf,
  Filter,
  BarChart3,
} from 'lucide-react';

export default function BankSampahDashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [nasabahActiveTab, setNasabahActiveTab] = useState<string>('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPreviewPhoneActive, setIsPreviewPhoneActive] = useState(false);

  const [nasabahList, setNasabahList] = useState<Nasabah[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bank_sampah_nasabah_v2');
        if (saved) {
          const parsed: Nasabah[] = JSON.parse(saved);
          const existingIds = new Set(parsed.map((n) => n.id));
          const missing = INITIAL_NASABAH_LIST.filter((n) => !existingIds.has(n.id));
          return missing.length > 0 ? [...parsed, ...missing] : parsed;
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_NASABAH_LIST;
  });

  const [activeNasabahId, setActiveNasabahId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bank_sampah_active_id_v2');
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return INITIAL_NASABAH_LIST[0].id;
  });

  const [setoranRecords, setSetoranRecords] = useState<SetoranRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bank_sampah_records_v2');
        if (saved) {
          const parsed: SetoranRecord[] = JSON.parse(saved);
          const existingIds = new Set(parsed.map((r) => r.id));
          const missing = INITIAL_SETORAN_RECORDS.filter((r) => !existingIds.has(r.id));
          return missing.length > 0 ? [...parsed, ...missing] : parsed;
        }
      } catch {
        // ignore
      }
    }
    return INITIAL_SETORAN_RECORDS;
  });

  // Auth Session State
  const [authSession, setAuthSession] = useState<AuthSession | null>(() => {
    return getStoredAuthSession();
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLoginSuccess = (session: AuthSession) => {
    setAuthSession(session);
    if (session.role === 'nasabah' && session.nasabahId) {
      setActiveNasabahId(session.nasabahId);
    } else if (session.role === 'superadmin_forum') {
      setActiveTab('beranda');
    }
    showToast(`Selamat datang, ${session.name}!`);
  };

  const handleLogout = () => {
    clearAuthSession();
    setAuthSession(null);
    showToast('Anda telah berhasil keluar dari sistem.');
  };

  // Filters & Modals
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [isNewDepositOpen, setIsNewDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isRegisterNasabahModalOpen, setIsRegisterNasabahModalOpen] = useState(false);
  const [isChangeAdminPhotoOpen, setIsChangeAdminPhotoOpen] = useState(false);
  const [adminPhotoUrlInput, setAdminPhotoUrlInput] = useState('');
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_custom_logo_url');
      if (stored) return stored;
    }
    return APP_LOGO_URL;
  });
  const [logoInputUrl, setLogoInputUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_custom_logo_url');
      if (stored) return stored;
    }
    return APP_LOGO_URL;
  });
  const [activeReceiptRecord, setActiveReceiptRecord] = useState<SetoranRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSaveAppLogo = () => {
    const trimmed = logoInputUrl.trim();
    if (trimmed) {
      localStorage.setItem('app_custom_logo_url', trimmed);
      setCurrentLogoUrl(trimmed);
      window.dispatchEvent(new Event('app_logo_updated'));
      showToast('Logo aplikasi berhasil diperbarui di seluruh sidebar & login screen!');
    } else {
      localStorage.removeItem('app_custom_logo_url');
      setCurrentLogoUrl(APP_LOGO_URL);
      setLogoInputUrl(APP_LOGO_URL);
      window.dispatchEvent(new Event('app_logo_updated'));
      showToast('Logo aplikasi dikembalikan ke default APP_LOGO_URL!');
    }
  };

  const handleResetAppLogo = () => {
    localStorage.removeItem('app_custom_logo_url');
    setCurrentLogoUrl(APP_LOGO_URL);
    setLogoInputUrl(APP_LOGO_URL);
    window.dispatchEvent(new Event('app_logo_updated'));
    showToast('Logo aplikasi dikembalikan ke default APP_LOGO_URL!');
  };

  const handleSaveAdminPhoto = () => {
    if (!authSession) return;
    const updated = { ...authSession, avatarUrl: adminPhotoUrlInput.trim() || undefined };
    setAuthSession(updated);
    saveAuthSession(updated);
    setIsChangeAdminPhotoOpen(false);
    showToast('Foto profil admin/unit berhasil diperbarui! 📸');
  };

  // Save to localStorage
  const saveState = (updatedNasabah: Nasabah[], updatedRecords: SetoranRecord[]) => {
    try {
      localStorage.setItem('bank_sampah_nasabah_v2', JSON.stringify(updatedNasabah));
      localStorage.setItem('bank_sampah_records_v2', JSON.stringify(updatedRecords));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const activeNasabah =
    nasabahList.find((n) => n.id === activeNasabahId) || nasabahList[0];

  const handleSelectNasabah = (nasabah: Nasabah) => {
    setActiveNasabahId(nasabah.id);
    setSelectedCategoryFilter(null);
    try {
      localStorage.setItem('bank_sampah_active_id_v2', nasabah.id);
    } catch {
      // ignore
    }
    showToast(`Beralih ke akun nasabah: ${nasabah.nama}`);
  };

  const handleRegisterNasabahSuccess = (newNasabah: Nasabah, openDepositNow?: boolean) => {
    const updated = [newNasabah, ...nasabahList];
    setNasabahList(updated);
    saveState(updated, setoranRecords);
    showToast(`Nasabah baru ${newNasabah.nama} (${newNasabah.id}) berhasil didaftarkan!`);

    if (openDepositNow) {
      setActiveNasabahId(newNasabah.id);
      setIsNewDepositOpen(true);
    }
  };

  const handleUpdateNasabahPin = (nasabahId: string, newPin: string) => {
    const updated = nasabahList.map((n) =>
      n.id === nasabahId ? { ...n, pin: newPin } : n
    );
    setNasabahList(updated);
    saveState(updated, setoranRecords);
    const member = updated.find((n) => n.id === nasabahId);
    showToast(`PIN nasabah ${member?.nama || nasabahId} berhasil diperbarui.`);
  };

  const handleSimulateUnitLogin = (unit: BankUnit) => {
    const session: AuthSession = {
      id: `USR-${unit.id}`,
      username: `admin.${unit.rw.toLowerCase().replace(/\s+/g, '')}`,
      name: `Pengurus ${unit.nama}`,
      title: `Pengurus ${unit.nama}`,
      role: 'admin_unit',
      tierLevel: 2,
      unitId: unit.id,
      unitKode: unit.kodeUnit,
      unitBankSampah: unit.nama,
      avatarInitials: unit.rw.replace('RW ', ''),
      loginTime: new Date().toISOString(),
    };
    saveAuthSession(session);
    setAuthSession(session);
    setActiveTab('beranda');
    showToast(`Beralih ke sesi Bank Sampah Unit: ${unit.nama}`);
  };

  const handleSwitchToForum = () => {
    const session: AuthSession = {
      id: FORUM_SUPERADMIN_CREDENTIALS.id,
      username: FORUM_SUPERADMIN_CREDENTIALS.username,
      name: FORUM_SUPERADMIN_CREDENTIALS.name,
      title: FORUM_SUPERADMIN_CREDENTIALS.title,
      role: 'superadmin_forum',
      tierLevel: 1,
      unitBankSampah: FORUM_SUPERADMIN_CREDENTIALS.unitBankSampah,
      avatarInitials: FORUM_SUPERADMIN_CREDENTIALS.avatarInitials,
      phone: FORUM_SUPERADMIN_CREDENTIALS.phone,
      email: FORUM_SUPERADMIN_CREDENTIALS.email,
      loginTime: new Date().toISOString(),
    };
    saveAuthSession(session);
    setAuthSession(session);
    setActiveTab('approval_unit');
    showToast('Beralih ke akun Forum Bank Sampah Desa Cicadas (Tingkat 1)');
  };

  // Filtered records and nasabah based on current logged in role
  const displayNasabahList = useMemo(() => {
    if (authSession?.role === 'superadmin_forum') {
      return nasabahList;
    }
    const currentUnitId = authSession?.unitId || 'UNIT-CCD-001';
    return nasabahList.filter((n) => !n.unitId || n.unitId === currentUnitId);
  }, [nasabahList, authSession]);

  const displaySetoranRecords = useMemo(() => {
    if (authSession?.role === 'superadmin_forum') {
      return setoranRecords;
    }
    const currentUnitId = authSession?.unitId || 'UNIT-CCD-001';
    return setoranRecords.filter((r) => !r.unitId || r.unitId === currentUnitId);
  }, [setoranRecords, authSession]);

  // Filter records for active nasabah
  const nasabahRecords = setoranRecords.filter(
    (rec) => rec.nasabahId === activeNasabah.id
  );

  // Calculate overall metrics
  const impact = calculateImpact(nasabahRecords);

  const totalSaldoAktif = Math.max(
    0,
    impact.totalNilaiRupiah - (activeNasabah.saldoTarik || 0)
  );

  // Forum Desa: Filter Bank Unit untuk Tab Dampak Lingkungan
  const [forumDampakUnitFilter, setForumDampakUnitFilter] = useState<string>('all');

  // Dampak kumulatif database Forum Desa dari SELURUH nasabah & SELURUH bank unit
  const forumOverallImpact = useMemo(() => {
    return calculateImpact(setoranRecords);
  }, [setoranRecords]);

  // Dampak kumulatif unit admin (seluruh nasabah di unit bank sampah tersebut)
  const unitOverallImpact = useMemo(() => {
    return calculateImpact(displaySetoranRecords);
  }, [displaySetoranRecords]);

  // Records yang menjadi basis kalkulasi tab Dampak Lingkungan
  const activeDampakRecords = useMemo(() => {
    if (authSession?.role === 'superadmin_forum') {
      if (forumDampakUnitFilter === 'all') {
        return setoranRecords; // Database keseluruhan seluruh nasabah & seluruh bank unit
      }
      return setoranRecords.filter((r) => r.unitId === forumDampakUnitFilter);
    }
    if (authSession?.role === 'admin_unit') {
      return displaySetoranRecords; // Semua setoran unit
    }
    return nasabahRecords;
  }, [authSession, forumDampakUnitFilter, setoranRecords, displaySetoranRecords, nasabahRecords]);

  // Dampak aktif yang ditampilkan pada tab Dampak Lingkungan
  const activeDampakImpact = useMemo(() => {
    return calculateImpact(activeDampakRecords);
  }, [activeDampakRecords]);

  // Rekapitulasi kontribusi masing-masing Bank Unit RW untuk Forum Desa
  const unitsImpactBreakdown = useMemo(() => {
    if (authSession?.role !== 'superadmin_forum') return [];
    const storedUnits = getStoredBankUnits();

    return storedUnits.map((unit) => {
      const unitRecs = setoranRecords.filter(
        (r) => r.unitId === unit.id || r.unitNama === unit.nama
      );
      const uImpact = calculateImpact(unitRecs);
      const unitNasabahCount = nasabahList.filter((n) => n.unitId === unit.id).length;
      const villageTotalKg = forumOverallImpact.totalKg || 1;
      const percentOfVillage = Math.round((uImpact.totalKg / villageTotalKg) * 100);

      return {
        unit,
        recordsCount: unitRecs.length,
        impact: uImpact,
        nasabahCount: unitNasabahCount,
        percentOfVillage,
      };
    });
  }, [authSession, setoranRecords, nasabahList, forumOverallImpact]);

  // Handle new deposit submission (Admin only, can specify targetNasabahId)
  const handleSaveDeposit = (newRecord: SetoranRecord, targetNasabahId?: string) => {
    const effId = targetNasabahId || newRecord.nasabahId || activeNasabah.id;
    const updatedRecords = [newRecord, ...setoranRecords];
    setSetoranRecords(updatedRecords);

    // Calculate updated metrics for target member
    const memberRecords = updatedRecords.filter((r) => r.nasabahId === effId);
    const totalMemberKg = memberRecords.reduce((s, r) => s + r.totalBerat, 0);

    const updatedNasabahList = nasabahList.map((n) => {
      if (n.id === effId) {
        let level = n.level;
        if (totalMemberKg >= 80) level = 'Bintang Daur Ulang';
        else if (totalMemberKg >= 40) level = 'Pahlawan Lingkungan';
        else if (totalMemberKg >= 20) level = 'Penyelamat Bumi';
        return { ...n, level };
      }
      return n;
    });

    setNasabahList(updatedNasabahList);
    saveState(updatedNasabahList, updatedRecords);
    const targetMember = updatedNasabahList.find((n) => n.id === effId);
    showToast(`Setoran baru ${newRecord.totalBerat} kg berhasil dicatat untuk ${targetMember?.nama || 'nasabah'}!`);
  };

  // Handle balance withdrawal
  const handleConfirmWithdraw = (amount: number, _method: string) => {
    const updatedNasabahList = nasabahList.map((n) => {
      if (n.id === activeNasabah.id) {
        return {
          ...n,
          saldoTarik: (n.saldoTarik || 0) + amount,
        };
      }
      return n;
    });

    setNasabahList(updatedNasabahList);
    saveState(updatedNasabahList, setoranRecords);
    showToast(`Penarikan saldo sebesar Rp ${amount.toLocaleString('id-ID')} berhasil diproses.`);
  };

  // Reset demo data to defaults
  const handleResetData = () => {
    if (confirm('Kembalikan data ke contoh awal UCIDA LESTARI?')) {
      setNasabahList(INITIAL_NASABAH_LIST);
      setSetoranRecords(INITIAL_SETORAN_RECORDS);
      setActiveNasabahId(INITIAL_NASABAH_LIST[0].id);
      setSelectedCategoryFilter(null);
      try {
        localStorage.removeItem('bank_sampah_nasabah_v2');
        localStorage.removeItem('bank_sampah_records_v2');
        localStorage.removeItem('bank_sampah_active_id_v2');
      } catch {
        // ignore
      }
      showToast('Data berhasil dikembalikan ke kondisi awal.');
    }
  };

  // 1. Loading state during hydration
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#F0F5FA] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-[#005596] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-gray-500">Memuat Bank Sampah UCIDA LESTARI...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Show Login Gate
  if (!authSession) {
    return (
      <>
        <LoginScreen
          nasabahList={nasabahList}
          onLoginSuccess={handleLoginSuccess}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            id="app-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#005596] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-sky-400/30"
          >
            <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  // 3. Authenticated Role: NASABAH (Website / Dashboard PC Layout matching reference mockup)
  if (authSession.role === 'nasabah') {
    if (isPreviewPhoneActive) {
      return (
        <div className="min-h-screen bg-[#EBF3FA] text-gray-800 font-sans antialiased flex flex-col items-center justify-start sm:py-6 sm:px-4">
          {/* Top Switcher Bar */}
          <div className="w-full max-w-[390px] mb-2 px-3 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500 tracking-wide">
              Mobile App
            </span>
            <button
              onClick={() => setIsPreviewPhoneActive(false)}
              className="text-xs font-semibold text-[#005596] hover:underline flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-2xs border border-sky-100"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Kembali ke Versi Website/PC</span>
            </button>
          </div>

          {/* Sleek Mobile Phone Frame */}
          <div className="w-full sm:max-w-[390px] bg-[#F8FAFC] sm:rounded-[44px] sm:shadow-2xl sm:shadow-sky-950/20 sm:border-[7px] sm:border-gray-800 overflow-hidden flex flex-col min-h-screen sm:min-h-[820px] relative">
              <MobileDashboardView
                activeNasabah={activeNasabah}
                nasabahList={nasabahList}
                setoranRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                impact={impact}
                onSelectNasabah={handleSelectNasabah}
                onOpenNewDeposit={() => setIsNewDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                userRole="nasabah"
                onLogout={handleLogout}
                isFramed={true}
              />
          </div>

          {/* Shared Modals for Nasabah */}
          {activeReceiptRecord && (
            <ReceiptModal
              record={activeReceiptRecord}
              nasabah={activeNasabah}
              onClose={() => setActiveReceiptRecord(null)}
            />
          )}

          {toastMessage && (
            <div
              id="app-toast-notification"
              className="fixed bottom-6 right-6 z-50 bg-[#005596] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-sky-400/30"
            >
              <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
              <span className="text-xs font-semibold">{toastMessage}</span>
            </div>
          )}
        </div>
      );
    }

    // Default: Dedicated Website or Dashboard PC Layout!
    return (
      <div className="flex min-h-screen bg-[#F0F5FA] text-gray-800 font-sans antialiased">
        {/* 1. Left Sidebar Navigation */}
        <Sidebar
          activeTab={nasabahActiveTab}
          onSelectTab={(tab) => setNasabahActiveTab(tab)}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
          userRole="nasabah"
          adminSession={authSession}
          onLogout={handleLogout}
        />

        {/* 2. Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Top Header Bar */}
          <TopHeader
            nasabahList={nasabahList}
            activeNasabah={activeNasabah}
            onSelectNasabah={handleSelectNasabah}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            userRole="nasabah"
            adminSession={authSession}
            onLogout={handleLogout}
          />

          {/* Main Dashboard / Website PC Content */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
            {/* Sub-header title info */}
            <div className="flex items-center justify-between pb-1">
              <div className="text-xs text-slate-500 font-medium">
                Dashboard Nasabah Bank Sampah • Unit {activeNasabah.unitBankSampah}
              </div>
            </div>

            {/* TAB 1: BERANDA (Website PC Dashboard matching reference mockup) */}
            {nasabahActiveTab === 'beranda' && (
              <WebsitePcDashboard
                activeNasabah={activeNasabah}
                nasabahList={nasabahList}
                setoranRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                impact={impact}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                onSelectNasabah={handleSelectNasabah}
                onViewAllRecords={() => setNasabahActiveTab('setoran')}
                onOpenNewDeposit={() => setIsNewDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
                onNavigateToTab={(tab) => setNasabahActiveTab(tab)}
              />
            )}

            {/* TAB 2: NASABAH (Profile & Community) */}
            {nasabahActiveTab === 'nasabah' && (
              <NasabahPortalDesktop
                session={authSession}
                activeNasabah={activeNasabah}
                nasabahRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                onLogout={handleLogout}
                activeTab="profil"
                hideHeader={true}
              />
            )}

            {/* TAB 3: SETORAN SAMPAH */}
            {nasabahActiveTab === 'setoran' && (
              <NasabahPortalDesktop
                session={authSession}
                activeNasabah={activeNasabah}
                nasabahRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                onLogout={handleLogout}
                activeTab="riwayat"
                hideHeader={true}
              />
            )}

            {/* TAB: KATALOG HARGA (Gambaran Estimasi Nilai Sampah bagi Nasabah) */}
            {nasabahActiveTab === 'katalog' && (
              <KatalogHargaView
                userRole="nasabah"
                onNavigateToSetoran={() => setNasabahActiveTab('setoran')}
              />
            )}

            {/* TAB 5: DAMPAK LINGKUNGAN */}
            {nasabahActiveTab === 'dampak' && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs">
                  <h2 className="text-xl font-black text-gray-900 mb-1">Dampak Positif Lingkungan</h2>
                  <p className="text-xs text-gray-500">Kontribusi nyata dari setiap kilogram sampah yang Anda setorkan ke bank sampah.</p>
                </div>
                <EcoImpactSection
                  treesSaved={impact.treesSaved}
                  totalKg={impact.totalKg}
                  co2eKg={impact.co2eKg}
                  equivalentMotorKm={impact.equivalentMotorKm}
                />
                <CategoryBreakdown
                  breakdown={impact.categoryBreakdown}
                  selectedCategoryFilter={selectedCategoryFilter}
                  onSelectCategoryFilter={setSelectedCategoryFilter}
                />
              </div>
            )}

            {/* TAB 6: EDUKASI */}
            {nasabahActiveTab === 'edukasi' && (
              <NasabahPortalDesktop
                session={authSession}
                activeNasabah={activeNasabah}
                nasabahRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                onLogout={handleLogout}
                activeTab="edukasi"
                hideHeader={true}
              />
            )}

            {/* TAB 7: PENGATURAN */}
            {nasabahActiveTab === 'pengaturan' && (
              <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-xs max-w-xl mx-auto space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#005596] bg-sky-50 flex items-center justify-center font-bold text-xl text-[#005596] shadow-xs">
                    {activeNasabah.avatarUrl ? (
                      <img src={activeNasabah.avatarUrl} alt={activeNasabah.nama} className="w-full h-full object-cover" />
                    ) : (
                      activeNasabah.avatarInitials
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{activeNasabah.nama}</h3>
                    <p className="text-xs text-gray-500">ID: {activeNasabah.id} • {activeNasabah.unitBankSampah}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3.5 text-xs text-gray-600">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Nomor Telepon</span>
                    <span className="font-semibold text-gray-800">{activeNasabah.noTelepon}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Alamat Domisili</span>
                    <span className="font-semibold text-gray-800">{activeNasabah.alamat}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-400">Tingkat Keaktifan</span>
                    <span className="font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                      {activeNasabah.level}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[11px] text-gray-400">Akun Nasabah Terdaftar</span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-semibold text-xs hover:bg-rose-100 transition-colors cursor-pointer"
                  >
                    Keluar dari Akun
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        {activeReceiptRecord && (
          <ReceiptModal
            record={activeReceiptRecord}
            nasabah={activeNasabah}
            onClose={() => setActiveReceiptRecord(null)}
          />
        )}

        <NewDepositModal
          isOpen={isNewDepositOpen}
          onClose={() => setIsNewDepositOpen(false)}
          nasabah={activeNasabah}
          onSaveDeposit={handleSaveDeposit}
        />

        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          nasabah={activeNasabah}
          availableBalance={totalSaldoAktif}
          onConfirmWithdraw={handleConfirmWithdraw}
        />

        {/* Global Toast Notification */}
        {toastMessage && (
          <div
            id="app-toast-notification"
            className="fixed bottom-6 right-6 z-50 bg-[#005596] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-sky-400/30"
          >
            <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
            <span className="text-xs font-semibold">{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // 4. Authenticated Role: ADMIN (Operational Management Console)
  return (
    <>
      {/* 0. Dedicated Simulated Mobile Frame Preview (If toggled by admin on desktop) */}
      {isPreviewPhoneActive ? (
        <div className="min-h-screen bg-slate-900/90 backdrop-blur-md text-white py-8 px-4 flex flex-col items-center justify-center font-sans antialiased">
          {/* Top Control Bar for Simulator */}
          <div className="max-w-md w-full mb-4 flex items-center justify-between px-2 text-xs">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" />
              <span>Pratinjau Layar Mobile App (Admin)</span>
            </span>
            <button
              id="btn-exit-mobile-preview"
              onClick={() => setIsPreviewPhoneActive(false)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full border border-white/20 font-medium transition-colors flex items-center gap-1.5"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Kembali ke Web Desktop</span>
            </button>
          </div>

          <div className="text-slate-400 text-sm font-medium mb-3 tracking-wide">Mobile App</div>

          {/* Smartphone Hardware Frame Shell */}
          <div className="relative w-full max-w-[380px] bg-black rounded-[50px] p-3.5 shadow-2xl ring-1 ring-white/10 border-4 border-slate-700/80">
            {/* Camera / Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#121212] ring-1 ring-white/10 mr-4" />
              <div className="w-12 h-1 bg-[#1a1a1a] rounded-full" />
            </div>

            {/* Inner Phone Screen */}
            <div className="relative w-full bg-[#F7FAF9] text-gray-800 rounded-[38px] overflow-hidden min-h-[720px] max-h-[82vh] overflow-y-auto">
              {/* Phone Status Bar (9:41, wifi, battery) matching mockup */}
              <div className="sticky top-0 z-40 bg-[#F7FAF9] px-6 pt-2 pb-1 flex items-center justify-between text-xs text-gray-800 font-semibold select-none">
                <span className="text-[13px] font-bold">9:41</span>
                <div className="flex items-center gap-1.5 text-gray-700">
                  {/* Signal bars */}
                  <div className="flex items-end gap-0.5 h-3">
                    <div className="w-0.5 h-1 bg-gray-800 rounded-xs" />
                    <div className="w-0.5 h-1.5 bg-gray-800 rounded-xs" />
                    <div className="w-0.5 h-2 bg-gray-800 rounded-xs" />
                    <div className="w-0.5 h-2.5 bg-gray-800 rounded-xs" />
                  </div>
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Mobile Dashboard View inside frame */}
              <MobileDashboardView
                activeNasabah={activeNasabah}
                nasabahList={nasabahList}
                setoranRecords={nasabahRecords}
                totalSaldoAktif={totalSaldoAktif}
                impact={impact}
                onSelectNasabah={handleSelectNasabah}
                onOpenNewDeposit={() => setIsNewDepositOpen(true)}
                onOpenWithdraw={() => setIsWithdrawOpen(true)}
                onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                userRole="admin"
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-screen bg-[#F4F7F6] text-gray-800 font-sans antialiased">
          {/* 1. Left Sidebar Navigation */}
          <Sidebar
            activeTab={activeTab}
            onSelectTab={(tab) => setActiveTab(tab)}
            isMobileOpen={isMobileMenuOpen}
            onCloseMobile={() => setIsMobileMenuOpen(false)}
            adminSession={authSession}
            onLogout={handleLogout}
            userRole="admin"
          />

          {/* 2. Main Content Wrapper */}
          <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
            {/* Top Header Bar */}
            <TopHeader
              nasabahList={authSession?.role === 'superadmin_forum' ? [] : nasabahList}
              activeNasabah={activeNasabah}
              onSelectNasabah={handleSelectNasabah}
              onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
              userRole="admin"
              adminSession={authSession}
              onLogout={handleLogout}
              onOpenChangeAdminPhoto={() => {
                setAdminPhotoUrlInput(authSession?.avatarUrl || '');
                setIsChangeAdminPhotoOpen(true);
              }}
            />

            {/* Dynamic Page Views */}
            <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto space-y-6">
              {/* Forum Desa Induk Status Banner */}
              {authSession?.role === 'superadmin_forum' && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 flex items-center gap-3 text-amber-950">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    🏛️
                  </div>
                  <h2 className="text-base font-bold text-amber-950">
                    Forum Bank Sampah Desa Cicadas
                  </h2>
                </div>
              )}

              {/* Admin Unit (Tingkat 2) Info Banner with fast switch to Forum */}
              {authSession?.role === 'admin_unit' && (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-3 text-slate-950">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#005596] text-white flex items-center justify-center font-bold text-xs">
                      🏢
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#005596]">
                        {authSession.unitBankSampah} (Tingkat 2 - Unit RW)
                      </span>
                      <p className="text-[11px] text-sky-800">
                        Admin: {authSession.name} • Melayani tabungan warga/nasabah RT & RW setempat
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSwitchToForum}
                    className="px-2.5 py-1 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0"
                  >
                    Ke Forum Desa
                  </button>
                </div>
              )}
                {/* TAB 1: BERANDA (Dashboard Data Secara Keseluruhan) */}
                {activeTab === 'beranda' && (
                  <OverallDashboard
                    nasabahList={displayNasabahList}
                    allSetoranRecords={displaySetoranRecords}
                    unitName={authSession?.unitBankSampah || activeNasabah.unitBankSampah || 'Unit Bank Sampah RW 03'}
                    onOpenNewDeposit={() => setIsNewDepositOpen(true)}
                    onOpenWithdraw={() => setIsWithdrawOpen(true)}
                    onOpenRegisterNasabah={() => setIsRegisterNasabahModalOpen(true)}
                    onSelectRecord={(rec) => setActiveReceiptRecord(rec)}
                    onViewAllRecords={() => setActiveTab('setoran')}
                    onSelectNasabah={(n) => {
                      setActiveNasabahId(n.id);
                      setActiveTab('nasabah');
                    }}
                    onNavigateToTab={(tab) => setActiveTab(tab as any)}
                    isForumView={authSession?.role === 'superadmin_forum'}
                  />
                )}

          {/* TAB 2: NASABAH (Manajemen & Pemantauan Nasabah Terpadu) */}
          {activeTab === 'nasabah' && authSession?.role !== 'superadmin_forum' && (
            <NasabahManagementView
              nasabahList={nasabahList}
              allSetoranRecords={setoranRecords}
              activeNasabah={activeNasabah}
              adminSession={authSession}
              onSelectNasabah={handleSelectNasabah}
              onOpenRegisterModal={() => setIsRegisterNasabahModalOpen(true)}
              onOpenNewDepositForNasabah={(targetNasabah) => {
                setActiveNasabahId(targetNasabah.id);
                setIsNewDepositOpen(true);
              }}
              onUpdateNasabahPin={handleUpdateNasabahPin}
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
            />
          )}

          {/* TAB 3: SETORAN SAMPAH (Full deposit records & filter) */}
          {activeTab === 'setoran' && authSession?.role !== 'superadmin_forum' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Buku Setoran Sampah</h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Semua riwayat timbang dan akumulasi tabungan sampah {activeNasabah.nama}
                  </p>
                </div>
                <button
                  onClick={() => setIsNewDepositOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Catat Setoran Baru</span>
                </button>
              </div>

              {/* Category Breakdown Filters */}
              <CategoryBreakdown
                breakdown={impact.categoryBreakdown}
                selectedCategoryFilter={selectedCategoryFilter}
                onSelectCategoryFilter={(catId) => setSelectedCategoryFilter(catId)}
              />

              {/* Full Setoran Ledger Table */}
              <SetoranHistory
                records={nasabahRecords}
                selectedCategoryFilter={selectedCategoryFilter}
                onClearCategoryFilter={() => setSelectedCategoryFilter(null)}
                onViewReceipt={(rec) => setActiveReceiptRecord(rec)}
              />
            </div>
          )}

          {/* TAB: KATALOG HARGA (Admin: Pengaturan & Penyesuaian Harga Sampah - Hanya untuk Admin Unit & Nasabah) */}
          {activeTab === 'katalog' && authSession?.role !== 'superadmin_forum' && (
            <KatalogHargaView
              userRole="admin"
              onNavigateToSetoran={() => setActiveTab('setoran')}
            />
          )}

          {/* TAB 4: DAMPAK LINGKUNGAN (Database agregat seluruh nasabah/bank unit untuk Forum Desa) */}
          {activeTab === 'dampak' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Header Dampak Lingkungan */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                {authSession?.role === 'superadmin_forum' ? (
                  <>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[11px] font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            🏛️ Database Forum Desa
                          </span>
                          <span className="text-[11px] font-medium text-gray-500">
                            Agregasi Seluruh Nasabah & Bank Unit
                          </span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900">
                          Dampak Lingkungan Kumulatif Seluruh Desa
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                          Kalkulasi nyata pencegahan emisi karbon dan pelestarian bumi dari database keseluruhan seluruh nasabah ({nasabahList.length} nasabah aktif) di seluruh Bank Sampah Unit RW se-Desa Cicadas.
                        </p>
                      </div>

                      {/* Filter Unit Selector for Forum Desa */}
                      <div className="flex items-center gap-2 self-start lg:self-auto bg-gray-50 p-1.5 rounded-2xl border border-gray-200 shrink-0">
                        <Filter className="w-4 h-4 text-gray-500 ml-2" />
                        <select
                          value={forumDampakUnitFilter}
                          onChange={(e) => setForumDampakUnitFilter(e.target.value)}
                          className="bg-transparent text-xs font-semibold text-gray-700 py-1.5 pr-3 pl-1 focus:outline-none cursor-pointer"
                        >
                          <option value="all">🌐 Seluruh Unit RW (Total Akumulasi Desa)</option>
                          {getStoredBankUnits().map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              🏢 {unit.nama} ({unit.rw})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Quick Metric Badges */}
                    <div className="pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="bg-sky-50/60 rounded-xl p-3 border border-sky-100">
                        <p className="text-[11px] text-sky-800 font-medium">Total Sampah Terkelola</p>
                        <p className="text-base sm:text-lg font-bold text-[#005596]">
                          {activeDampakImpact.totalKg.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
                        </p>
                      </div>
                      <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100">
                        <p className="text-[11px] text-emerald-800 font-medium">CO₂e Dicegah</p>
                        <p className="text-base sm:text-lg font-bold text-emerald-700">
                          {activeDampakImpact.co2eKg.toLocaleString('id-ID')} <span className="text-xs font-normal">kg</span>
                        </p>
                      </div>
                      <div className="bg-teal-50/60 rounded-xl p-3 border border-teal-100">
                        <p className="text-[11px] text-teal-800 font-medium">Pohon Terselamatkan</p>
                        <p className="text-base sm:text-lg font-bold text-teal-700">
                          {activeDampakImpact.treesSaved} <span className="text-xs font-normal">pohon</span>
                        </p>
                      </div>
                      <div className="bg-amber-50/60 rounded-xl p-3 border border-amber-100">
                        <p className="text-[11px] text-amber-800 font-medium">Nasabah Berkontribusi</p>
                        <p className="text-base sm:text-lg font-bold text-amber-800">
                          {forumDampakUnitFilter === 'all'
                            ? nasabahList.length
                            : nasabahList.filter((n) => n.unitId === forumDampakUnitFilter).length}{' '}
                          <span className="text-xs font-normal">warga</span>
                        </p>
                      </div>
                    </div>
                  </>
                ) : authSession?.role === 'admin_unit' ? (
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-[11px] font-bold">
                        🏢 {authSession.unitBankSampah || 'Bank Sampah Unit'}
                      </span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-900">
                      Dampak Lingkungan Kumulatif Unit
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Kalkulasi nyata dampak lingkungan gabungan dari seluruh nasabah yang menabung sampah di {authSession.unitBankSampah || 'unit ini'} ({activeDampakImpact.totalKg.toLocaleString('id-ID')} kg sampah terkelola).
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">Kontribusi Dampak Lingkungan</h1>
                    <p className="text-xs text-gray-500 mt-1">
                      Kalkulasi nyata pencegahan emisi karbon dan pelestarian bumi dari {activeDampakImpact.totalKg} kg sampah yang telah disetor oleh {activeNasabah.nama}.
                    </p>
                  </div>
                )}
              </div>

              {/* Eco Impact Visual Cards */}
              <EcoImpactSection
                treesSaved={activeDampakImpact.treesSaved}
                totalKg={activeDampakImpact.totalKg}
                co2eKg={activeDampakImpact.co2eKg}
                equivalentMotorKm={activeDampakImpact.equivalentMotorKm}
              />

              {/* Rekapitulasi Kontribusi per Bank Unit RW (Tampilan Khusus Forum Desa) */}
              {authSession?.role === 'superadmin_forum' && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#005596]" />
                        <span>Rekapitulasi Kontribusi Dampak per Bank Unit RW</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Kontribusi ekologis masing-masing bank unit terhadap total capaian Desa Cicadas
                      </p>
                    </div>
                    {forumDampakUnitFilter !== 'all' && (
                      <button
                        onClick={() => setForumDampakUnitFilter('all')}
                        className="text-xs font-semibold text-[#005596] hover:underline self-start sm:self-auto cursor-pointer"
                      >
                        Reset ke Seluruh Desa
                      </button>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-500 font-semibold bg-gray-50/60">
                          <th className="py-2.5 px-3 rounded-l-xl">Bank Unit</th>
                          <th className="py-2.5 px-3">Wilayah</th>
                          <th className="py-2.5 px-3 text-right">Nasabah</th>
                          <th className="py-2.5 px-3 text-right">Transaksi</th>
                          <th className="py-2.5 px-3 text-right">Total Sampah</th>
                          <th className="py-2.5 px-3 text-right">Kontribusi</th>
                          <th className="py-2.5 px-3 text-right">CO₂e Tercegah</th>
                          <th className="py-2.5 px-3 text-right">Pohon</th>
                          <th className="py-2.5 px-3 text-center rounded-r-xl">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {unitsImpactBreakdown.map((item) => {
                          const isSelected = forumDampakUnitFilter === item.unit.id;
                          return (
                            <tr
                              key={item.unit.id}
                              className={`hover:bg-sky-50/40 transition-colors ${
                                isSelected ? 'bg-sky-50/80 font-medium' : ''
                              }`}
                            >
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-xs shrink-0">
                                    <Building2 className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <p className="font-bold text-gray-900">{item.unit.nama}</p>
                                    <p className="text-[10px] text-gray-400 font-mono">{item.unit.kodeUnit}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-gray-600">{item.unit.rw}</td>
                              <td className="py-3 px-3 text-right text-gray-700 font-medium">
                                {item.nasabahCount} warga
                              </td>
                              <td className="py-3 px-3 text-right text-gray-600">
                                {item.recordsCount}x
                              </td>
                              <td className="py-3 px-3 text-right font-bold text-gray-900">
                                {item.impact.totalKg.toLocaleString('id-ID')} kg
                              </td>
                              <td className="py-3 px-3 text-right">
                                <span className="inline-block px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                                  {item.percentOfVillage}%
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-emerald-700 font-semibold">
                                {item.impact.co2eKg.toLocaleString('id-ID')} kg
                              </td>
                              <td className="py-3 px-3 text-right text-teal-700 font-semibold">
                                {item.impact.treesSaved}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setForumDampakUnitFilter(
                                      isSelected ? 'all' : item.unit.id
                                    )
                                  }
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#005596] text-white shadow-2xs'
                                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                                  }`}
                                >
                                  {isSelected ? 'Terpilih' : 'Filter'}
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

              {/* Category Breakdown (Distribusi Kategori Sampah yang Telah Disetor) */}
              <CategoryBreakdown
                breakdown={activeDampakImpact.categoryBreakdown}
                selectedCategoryFilter={selectedCategoryFilter}
                onSelectCategoryFilter={(catId) => setSelectedCategoryFilter(catId)}
              />

              {/* Eco Quote & Education Insight */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EcoQuoteCard />

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-center space-y-3">
                  <h3 className="font-bold text-base text-gray-900">Mengapa Pemilahan Itu Penting?</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Sampah anorganik yang tercampur di Tempat Pemrosesan Akhir (TPA) membusuk secara anaerobik dan menghasilkan gas metana yang 28 kali lebih kuat daripada CO₂. Dengan memilah plastik, kertas, dan minyak jelantah melalui Bank Sampah di Desa Cicadas, sampah langsung masuk ke rantai daur ulang sirkular.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('edukasi')}
                      className="text-xs font-semibold text-[#005596] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Kelola & Terbitkan Artikel Edukasi Warga</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: EDUKASI (Admin CMS: Kelola Artikel & Pengumuman Warga) */}
          {activeTab === 'edukasi' && (
            <AdminEducationManager />
          )}

          {/* TAB 6: PENGATURAN (Settings & unit info) */}
          {activeTab === 'pengaturan' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
                <h1 className="text-xl font-bold text-gray-900">Pengaturan Sistem & Unit</h1>
                <p className="text-xs text-gray-500 mt-1">
                  Informasi operasional Bank Sampah UCIDA LESTARI
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* App Logo Management (Sidebar & Login Screen) */}
                <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#005596]" />
                        <span>Logo Aplikasi (Sidebar & Halaman Login)</span>
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Ganti tautan logo resmi aplikasi yang tampil di seluruh Sidebar (Admin & Warga) serta Halaman Login.
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-[#005596] bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100 self-start sm:self-auto">
                      Sinkron Realtime
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-2xl bg-sky-50/50 border border-sky-100">
                    <div className="w-28 h-28 rounded-2xl bg-white p-2 border border-sky-200 shadow-xs flex items-center justify-center shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={currentLogoUrl}
                        alt="Logo Bank Sampah"
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = '/eco_least_logo.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 w-full space-y-2.5">
                      <label className="block text-xs font-semibold text-gray-700">
                        Placeholder Link / URL Logo:
                      </label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={logoInputUrl}
                          onChange={(e) => setLogoInputUrl(e.target.value)}
                          placeholder="https://res.cloudinary.com/wyvqhb2n/image/upload/v1788945377/Aplikasi_Bank_Sampah_-_TIV_Citeureup_2026.png"
                          className="flex-1 px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleSaveAppLogo}
                            className="px-4 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer whitespace-nowrap"
                          >
                            Simpan Logo
                          </button>
                          <button
                            type="button"
                            onClick={handleResetAppLogo}
                            className="px-3.5 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        💡 <em>Tips:</em> Anda juga dapat mengganti tautan langsung di file <code className="bg-sky-100/60 text-sky-900 px-1.5 py-0.5 rounded font-mono text-[10px]">lib/appConfig.ts</code> pada variabel <code className="bg-sky-100/60 text-sky-900 px-1.5 py-0.5 rounded font-mono text-[10px]">APP_LOGO_URL</code>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Photo & Identity Management */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#005596]" />
                    <span>Foto Profil Pengguna Aplikasi</span>
                  </h3>

                  <div className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-sky-50 text-[#005596] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-xs shrink-0">
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
                          className="w-8 h-8 text-[#005596] translate-y-0.5"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2a5 5 0 100 10 5 5 0 000-10zM4 20a8 8 0 0116 0H4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-sm text-gray-900 truncate">
                        {activeNasabah.nama}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activeNasabah.avatarUrl ? 'Foto kustom aktif' : 'Siluet standar'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit Details */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#005596]" />
                    <span>Informasi Unit Bank Sampah</span>
                  </h3>

                  <div className="space-y-3 text-xs text-gray-600">
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Nama Unit</span>
                      <span className="font-semibold text-gray-900">{activeNasabah.unitBankSampah}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Wilayah / Posko</span>
                      <span className="font-semibold text-gray-900">Citeureup, Kab. Bogor, Jawa Barat</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Jadwal Penimbangan</span>
                      <span className="font-semibold text-gray-900">Senin - Sabtu, 08:00 - 15:00 WIB</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-50">
                      <span className="text-gray-400">Kontak Pengurus</span>
                      <span className="font-semibold text-gray-900">0812-8821-4920</span>
                    </div>
                  </div>
                </div>

                {/* Demo Data Reset */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Reset Data Peraga</span>
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Kembalikan seluruh data transaksi dan saldo nasabah ke nilai default tampilan mockup (Siti Rahma - 125 kg & Rp750.000).
                  </p>
                  <button
                    onClick={handleResetData}
                    className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold rounded-xl border border-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset ke Data Awal Mockup</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PETA & SEBARAN BANK UNIT (Khusus Forum Desa Cicadas - Tingkat 1) */}
          {activeTab === 'peta_sebaran' && (
            <PetaSebaranView
              onSimulateUnitLogin={handleSimulateUnitLogin}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB: PERSETUJUAN BANK UNIT (Khusus Forum Desa Cicadas - Tingkat 1) */}
          {activeTab === 'approval_unit' && (
            <ForumApprovalView
              initialFilter="pending"
              onSimulateUnitLogin={handleSimulateUnitLogin}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {/* TAB: DAFTAR BANK UNIT DESA (Khusus Forum Desa Cicadas - Tingkat 1) */}
          {activeTab === 'daftar_unit' && (
            <ForumApprovalView
              initialFilter="all"
              onSimulateUnitLogin={handleSimulateUnitLogin}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}
        </main>
      </div>
    </div>
  )}

      {/* MODAL 1: Digital Struk / Receipt */}
      {activeReceiptRecord && (
        <ReceiptModal
          record={activeReceiptRecord}
          nasabah={activeNasabah}
          onClose={() => setActiveReceiptRecord(null)}
        />
      )}

      {/* MODAL 2: Setor Sampah Baru */}
      {isNewDepositOpen && (
        <NewDepositModal
          nasabah={activeNasabah}
          nasabahList={nasabahList}
          adminSession={authSession}
          isOpen={isNewDepositOpen}
          onClose={() => setIsNewDepositOpen(false)}
          onSaveDeposit={handleSaveDeposit}
        />
      )}

      {/* MODAL: Daftarkan Nasabah Baru (Admin Bank Unit) */}
      {isRegisterNasabahModalOpen && (
        <RegisterNasabahModal
          isOpen={isRegisterNasabahModalOpen}
          adminSession={authSession}
          existingNasabahList={nasabahList}
          onClose={() => setIsRegisterNasabahModalOpen(false)}
          onRegisterSuccess={handleRegisterNasabahSuccess}
        />
      )}

      {/* MODAL 3: Tarik Saldo */}
      {isWithdrawOpen && (
        <WithdrawModal
          nasabah={activeNasabah}
          availableBalance={totalSaldoAktif}
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          onConfirmWithdraw={handleConfirmWithdraw}
        />
      )}

      {/* MODAL: Ganti Foto Admin / Unit */}
      {isChangeAdminPhotoOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150 border border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#005596]" />
                <span>Ganti Foto Profil / Unit</span>
              </h3>
              <button
                onClick={() => setIsChangeAdminPhotoOpen(false)}
                className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  URL Foto / Avatar Baru
                </label>
                <input
                  type="url"
                  value={adminPhotoUrlInput}
                  onChange={(e) => setAdminPhotoUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Masukkan tautan gambar (URL) atau kosongkan untuk menggunakan inisial huruf standar.
                </p>
              </div>

              {adminPhotoUrlInput.trim() && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-sky-50 border border-sky-100">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white ring-2 ring-sky-200 shrink-0">
                    <img
                      src={adminPhotoUrlInput}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="text-xs text-sky-900 font-medium">
                    Pratinjau Foto Profil Baru
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsChangeAdminPhotoOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveAdminPhoto}
                className="px-4 py-2 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#005596] text-white text-xs sm:text-sm px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-sky-400/40 animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle2 className="w-4 h-4 text-sky-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}
