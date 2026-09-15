'use client';

import React from 'react';
import { X, ShieldCheck, MapPin, Phone, Calendar, Target, Award, Building2, UserCheck } from 'lucide-react';
import { Nasabah } from '@/lib/bankSampahData';

interface ProfileModalProps {
  nasabah: Nasabah;
  totalKg: number;
  isOpen: boolean;
  onClose: () => void;
  nasabahList: Nasabah[];
  onSelectNasabah: (nasabah: Nasabah) => void;
}

export function ProfileModal({
  nasabah,
  totalKg,
  isOpen,
  onClose,
  nasabahList,
  onSelectNasabah,
}: ProfileModalProps) {
  if (!isOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round((totalKg / (nasabah.targetBulananKg * 6 || 100)) * 100)
  );

  return (
    <div
      id="profile-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div
        id="profile-modal-card"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-150"
      >
        {/* Close Button */}
        <button
          id="btn-close-profile-modal"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Avatar & Info */}
        <div className="flex items-center gap-4">
          <div className="shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-bold text-xl shadow-xs overflow-hidden">
              {nasabah.avatarUrl ? (
                <img
                  src={nasabah.avatarUrl}
                  alt={nasabah.nama}
                  className="w-full h-full object-cover"
                />
              ) : (
                nasabah.avatarInitials
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 leading-tight truncate">
                {nasabah.nama}
              </h2>
              <span className="bg-[#005596] text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0">
                Nasabah
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-mono text-[#005596] bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                <ShieldCheck className="w-3 h-3 text-[#005596]" />
                {nasabah.id}
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                <Award className="w-3 h-3 text-amber-600" />
                {nasabah.level}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Details List */}
        <div className="mt-6 space-y-3 bg-[#F4F8FA] p-4 rounded-2xl border border-gray-100/80 text-sm">
          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2 text-gray-500">
              <Building2 className="w-4 h-4 text-[#005596]" />
              Unit Bank Sampah
            </span>
            <span className="font-medium text-gray-900">{nasabah.unitBankSampah}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4 text-[#005596]" />
              Alamat
            </span>
            <span className="font-medium text-gray-900">{nasabah.alamat}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2 text-gray-500">
              <Phone className="w-4 h-4 text-[#005596]" />
              No. Kontak / WA
            </span>
            <span className="font-medium text-gray-900">{nasabah.noTelepon}</span>
          </div>

          <div className="flex items-center justify-between text-gray-600">
            <span className="flex items-center gap-2 text-gray-500">
              <Calendar className="w-4 h-4 text-[#005596]" />
              Tanggal Bergabung
            </span>
            <span className="font-medium text-gray-900">{nasabah.tanggalBergabung}</span>
          </div>
        </div>

        {/* Target Daur Ulang Bulanan */}
        <div className="mt-5 p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span className="flex items-center gap-1.5 text-gray-900">
              <Target className="w-4 h-4 text-[#005596]" />
              Target Daur Ulang Bulanan
            </span>
            <span className="text-[#005596] font-bold">
              {totalKg} / {nasabah.targetBulananKg} kg ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#005596] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Switch to Other Nasabah Account */}
        <div className="mt-6 border-t border-gray-100 pt-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Ganti Akun Nasabah Terdaftar:
          </div>
          <div className="grid grid-cols-1 gap-2">
            {nasabahList.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectNasabah(item);
                  onClose();
                }}
                className={`flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                  item.id === nasabah.id
                    ? 'bg-sky-50 text-[#005596] font-semibold border border-sky-200'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#005596] text-white flex items-center justify-center font-bold text-[10px]">
                    {item.avatarInitials}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{item.nama}</div>
                    <div className="text-gray-500">{item.alamat}</div>
                  </div>
                </div>
                {item.id === nasabah.id && (
                  <UserCheck className="w-4 h-4 text-[#005596]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
