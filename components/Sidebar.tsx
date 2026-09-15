'use client';

import React, { useState, useEffect } from 'react';
import {
  Home,
  Users,
  Package,
  Globe2,
  GraduationCap,
  Settings,
  X,
  Shield,
  LogOut,
  Wallet,
  Tag,
  Calendar,
  Leaf,
  User,
  Building2,
  FileCheck2,
  MapPin,
} from 'lucide-react';
import { AuthSession } from '@/lib/auth';
import { getStoredBankUnits } from '@/lib/dbStore';
import { APP_LOGO_URL } from '@/lib/appConfig';

// Placeholder & konstanta logo utama aplikasi (dapat diubah di lib/appConfig.ts)
export const APP_LOGO_MANUAL_URL: string = APP_LOGO_URL;

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  userRole?: 'admin' | 'nasabah';
  adminSession?: AuthSession | null;
  onLogout?: () => void;
}

export function Sidebar({
  activeTab,
  onSelectTab,
  isMobileOpen = false,
  onCloseMobile,
  userRole = 'admin',
  adminSession,
  onLogout,
}: SidebarProps) {
  const [manualLogoUrl, setManualLogoUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('app_custom_logo_url');
      if (stored) return stored;
    }
    return APP_LOGO_URL;
  });
  const [imgError, setImgError] = useState(false);

  // Sinkronisasi realtime saat URL logo diubah
  useEffect(() => {
    const handleLogoUpdate = () => {
      const custom = localStorage.getItem('app_custom_logo_url');
      if (custom) {
        setManualLogoUrl(custom);
      } else {
        setManualLogoUrl(APP_LOGO_URL);
      }
      setImgError(false);
    };

    window.addEventListener('storage', handleLogoUpdate);
    window.addEventListener('app_logo_updated', handleLogoUpdate);
    return () => {
      window.removeEventListener('storage', handleLogoUpdate);
      window.removeEventListener('app_logo_updated', handleLogoUpdate);
    };
  }, []);

  // Check pending units count for badge
  const pendingUnitsCount = (() => {
    try {
      const units = getStoredBankUnits();
      return units.filter((u) => u.status === 'pending_review').length;
    } catch {
      return 0;
    }
  })();

  const isForumDesa = adminSession?.role === 'superadmin_forum';
  const isAdminUnit = adminSession?.role === 'admin_unit';

  interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }

  const navItems: NavItem[] = isForumDesa
    ? [
        { id: 'beranda', label: 'Beranda Desa', icon: Home },
        {
          id: 'peta_sebaran',
          label: 'Peta Sebaran Unit',
          icon: MapPin,
          badge: 'Utama',
          badgeColor: 'bg-[#005596] text-white',
        },
        {
          id: 'approval_unit',
          label: 'Persetujuan Unit',
          icon: FileCheck2,
          badge: pendingUnitsCount > 0 ? pendingUnitsCount : undefined,
          badgeColor: 'bg-amber-500 text-white animate-pulse',
        },
        { id: 'daftar_unit', label: 'Daftar Bank Unit', icon: Building2 },
        { id: 'dampak', label: 'Dampak Lingkungan', icon: Globe2 },
        { id: 'edukasi', label: 'Edukasi', icon: GraduationCap },
      ]
    : isAdminUnit
    ? [
        { id: 'beranda', label: 'Beranda Unit', icon: Home },
        { id: 'nasabah', label: 'Nasabah Unit', icon: Users },
        { id: 'setoran', label: 'Setoran Sampah', icon: Package },
        { id: 'katalog', label: 'Katalog Harga Unit', icon: Tag },
        { id: 'dampak', label: 'Dampak Lingkungan', icon: Globe2 },
        { id: 'edukasi', label: 'Edukasi', icon: GraduationCap },
      ]
    : [
        { id: 'beranda', label: 'Tabungan Saya', icon: Home },
        { id: 'setoran', label: 'Riwayat Setoran', icon: Package },
        { id: 'katalog', label: 'Katalog Harga Jual', icon: Tag },
        { id: 'dampak', label: 'Dampak Lingkungan', icon: Globe2 },
        { id: 'edukasi', label: 'Edukasi', icon: GraduationCap },
      ];

  const effectiveLogoUrl = manualLogoUrl || APP_LOGO_MANUAL_URL;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          id="sidebar-mobile-backdrop"
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        id="main-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#F0F7FC] border-r border-[#D0E5F5] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Logo & Brand */}
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div
              id="sidebar-brand"
              onClick={() => onSelectTab('beranda')}
              className="flex flex-col items-center mx-auto group cursor-pointer"
            >
              {/* Logo from link */}
              <div className="w-32 h-32 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                {effectiveLogoUrl && !imgError ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={effectiveLogoUrl}
                    alt="Logo Bank Sampah"
                    className="w-full h-full object-contain drop-shadow-xs"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className="w-26 h-206rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#005596]">
                    <Leaf className="w-10 h-10 text-[#005596]" />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile close button */}
            <button
              id="sidebar-close-mobile-btn"
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Tutup Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav id="sidebar-navigation" className="mt-5 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#005596] text-white shadow-sm font-semibold shadow-[#005596]/20'
                      : 'text-[#1E4E79] hover:bg-white/80 hover:text-[#005596]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-[#3B7BBF] group-hover:text-[#005596]'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                        item.badgeColor || 'bg-amber-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Settings & Decorative Pure Water Waves */}
        <div className="relative overflow-hidden p-5 pt-0">
          {/* Settings / Profile Link */}
          <div className="relative z-10 border-t border-[#D0E5F5] pt-3 space-y-1">
            <button
              id="nav-link-pengaturan"
              onClick={() => {
                onSelectTab('pengaturan');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'pengaturan'
                  ? 'bg-[#005596] text-white shadow-sm font-semibold shadow-[#005596]/20'
                  : 'text-[#1E4E79] hover:bg-white/80 hover:text-[#005596]'
              }`}
            >
              <Settings className="w-4 h-4 text-[#3B7BBF]" />
              <span>Pengaturan</span>
            </button>

            {onLogout && userRole !== 'nasabah' && (
              <button
                id="sidebar-btn-logout"
                onClick={onLogout}
                className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50/80 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Keluar</span>
              </button>
            )}
          </div>

          {/* Decorative Corner Water Wave (Bottom Left) */}
          <div className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 opacity-40">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M0 200 C40 160, 80 140, 140 170 C170 185, 190 200, 200 200 Z"
                fill="#BAE6FD"
              />
              <path
                d="M0 200 C30 130, 90 120, 120 150 C140 170, 150 200, 150 200 Z"
                fill="#00A3E0"
                opacity="0.6"
              />
              <path
                d="M0 200 C20 110, 60 90, 90 120 C110 140, 120 200, 120 200 Z"
                fill="#005596"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
}
