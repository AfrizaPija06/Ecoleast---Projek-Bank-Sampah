'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, Check, Building2 } from 'lucide-react';
import { Nasabah } from '@/lib/bankSampahData';
import { AuthSession } from '@/lib/auth';

interface TopHeaderProps {
  nasabahList?: Nasabah[];
  activeNasabah: Nasabah;
  onSelectNasabah?: (nasabah: Nasabah) => void;
  onOpenNewDeposit?: () => void;
  onOpenWithdraw?: () => void;
  onOpenMobileMenu: () => void;
  onToggleMobilePreview?: () => void;
  userRole?: 'admin' | 'nasabah';
  adminSession?: AuthSession | null;
  onLogout?: () => void;
  onOpenChangeAdminPhoto?: () => void;
}

export function TopHeader({
  nasabahList = [],
  activeNasabah,
  onSelectNasabah,
  onOpenMobileMenu,
  userRole = 'admin',
  adminSession,
}: TopHeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Filter nasabah by search query
  const filteredNasabah = searchQuery.trim()
    ? nasabahList.filter(
        (n) =>
          n.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.alamat.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.unitBankSampah.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : nasabahList;

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      id="top-header-bar"
      className="sticky top-0 z-30 bg-[#F0F7FC]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between gap-4 border-b border-[#D8E8F5]"
    >
      {/* Left: Mobile hamburger & (Admin Only) Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl mx-auto sm:mx-0">
        <button
          id="btn-open-mobile-menu"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-white transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar or Unit Name for admin_unit */}
        {userRole === 'admin' ? (
          adminSession?.role === 'admin_unit' ? (
            <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-[#D0E4F5] rounded-full shadow-xs">
              <Building2 className="w-4 h-4 text-[#005596] shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-[#003B6D] truncate">
                {adminSession.unitBankSampah}
              </span>
            </div>
          ) : (
            <div ref={searchRef} className="relative flex-1">
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  id="input-search-nasabah"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => setIsSearchDropdownOpen(true)}
                  placeholder="Cari nama nasabah..."
                  className="w-full pl-11 pr-4 py-2 bg-white border border-[#D0E4F5] rounded-full text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/20 focus:border-[#005596] transition-all shadow-xs"
                />
              </div>

              {/* Quick Search Suggestions Dropdown */}
              {isSearchDropdownOpen && (
                <div
                  id="search-nasabah-dropdown"
                  className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="px-3 py-1.5 text-xs font-semibold uppercase text-gray-400">
                    Pilih Nasabah
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {filteredNasabah.map((nasabah) => {
                      const isSelected = nasabah.id === activeNasabah.id;
                      return (
                        <button
                          key={nasabah.id}
                          id={`search-nasabah-item-${nasabah.id}`}
                          onClick={() => {
                            if (onSelectNasabah) onSelectNasabah(nasabah);
                            setIsSearchDropdownOpen(false);
                            setSearchQuery('');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-sky-50 text-[#005596] font-medium'
                              : 'hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-xs">
                              {nasabah.avatarInitials}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 leading-tight">
                                {nasabah.nama}
                              </div>
                              <div className="text-xs text-gray-500">
                                {nasabah.unitBankSampah} • {nasabah.alamat}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-[#005596]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-semibold text-[#003B6D]">
              Buku Tabungan Nasabah
            </span>
          </div>
        )}
      </div>

    </header>
  );
}
