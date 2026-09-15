'use client';

import React, { useState, useEffect } from 'react';
import {
  UserPlus,
  X,
  CheckCircle2,
  Copy,
  Send,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  KeyRound,
  Building2,
  MapPin,
  Phone,
  User,
  Scale,
} from 'lucide-react';
import { Nasabah } from '@/lib/bankSampahData';
import { AuthSession } from '@/lib/auth';
import { getStoredBankUnits } from '@/lib/dbStore';
import { BankUnit } from '@/lib/schema/types';

interface RegisterNasabahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (newNasabah: Nasabah, openDepositNow?: boolean) => void;
  adminSession?: AuthSession | null;
  existingNasabahList: Nasabah[];
}

function generateNewNasabahId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `NSB-${randomNum}`;
}

export function RegisterNasabahModal({
  isOpen,
  onClose,
  onRegisterSuccess,
  adminSession,
  existingNasabahList,
}: RegisterNasabahModalProps) {
  const [bankUnits, setBankUnits] = useState<BankUnit[]>(() => {
    if (typeof window !== 'undefined') {
      return getStoredBankUnits();
    }
    return [];
  });

  const isForumAdmin = adminSession?.role === 'superadmin_forum';

  // Selected Bank Unit state
  const [selectedUnitId, setSelectedUnitId] = useState<string>(() => {
    return adminSession?.unitId || 'UNIT-CCD-001';
  });

  const fallbackUnit = bankUnits.find((u) => u.id === adminSession?.unitId) || bankUnits[0];
  const activeUnit = bankUnits.find((u) => u.id === selectedUnitId) || fallbackUnit || {
    id: adminSession?.unitId || 'UNIT-CCD-001',
    nama: 'Bank Sampah Mekar Jaya RW 01',
    rw: 'RW 01',
  };

  const currentUnitName = activeUnit.nama;
  const currentUnitId = activeUnit.id;

  const [idNasabah, setIdNasabah] = useState<string>(() => generateNewNasabahId());
  const [nama, setNama] = useState('');
  const [nik, setNik] = useState('');
  const [noTelepon, setNoTelepon] = useState('');
  const [rt, setRt] = useState('RT 01');
  const [rw, setRw] = useState(() => activeUnit.rw || 'RW 01');
  const [alamat, setAlamat] = useState('');
  const [targetBulananKg, setTargetBulananKg] = useState('20');
  const [pin, setPin] = useState('123456');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  // Success state
  const [createdNasabah, setCreatedNasabah] = useState<Nasabah | null>(null);

  if (!isOpen) return null;

  const handleUnitChange = (newUnitId: string) => {
    setSelectedUnitId(newUnitId);
    const u = bankUnits.find((unit) => unit.id === newUnitId);
    if (u?.rw) {
      setRw(u.rw);
    }
  };

  const handleResetForm = () => {
    setIdNasabah(generateNewNasabahId());
    setNama('');
    setNik('');
    setNoTelepon('');
    setRt('RT 03');
    setRw('RW 01');
    setAlamat('');
    setTargetBulananKg('20');
    setPin('123456');
    setErrorMsg('');
    setCreatedNasabah(null);
    setIsCopied(false);
  };

  const handleCloseModal = () => {
    handleResetForm();
    onClose();
  };

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNama = nama.trim();
    if (!cleanNama) {
      setErrorMsg('Nama lengkap nasabah wajib diisi.');
      return;
    }

    const cleanPhone = noTelepon.trim();
    if (!cleanPhone) {
      setErrorMsg('Nomor WhatsApp / HP wajib diisi untuk notifikasi & recovery akun.');
      return;
    }

    const cleanPin = pin.trim();
    if (cleanPin.length < 4) {
      setErrorMsg('PIN keamanan minimal 4-6 digit angka.');
      return;
    }

    const initials = getInitials(cleanNama);
    const dateNowStr = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const fullAlamat = alamat.trim()
      ? `${alamat.trim()}, ${rt} / ${rw}, Desa Cicadas`
      : `Kp. Cicadas ${rt} / ${rw}`;

    const newRecord: Nasabah = {
      id: idNasabah,
      nama: cleanNama,
      nik: nik.trim() || undefined,
      noTelepon: cleanPhone,
      alamat: fullAlamat,
      rt,
      rw,
      unitBankSampah: currentUnitName,
      unitId: currentUnitId,
      tanggalBergabung: dateNowStr,
      targetBulananKg: parseInt(targetBulananKg, 10) || 20,
      level: 'Pemula Hijau',
      avatarInitials: initials,
      avatarColor: 'bg-[#005596] text-white',
      saldoTarik: 0,
      pin: cleanPin,
      statusAkun: 'Aktif',
    };

    setCreatedNasabah(newRecord);
  };

  const handleCopyCredentials = () => {
    if (!createdNasabah) return;
    const text = `*KREDENSIAL AKUN BANK SAMPAH DESA CICADAS*\nUnit: ${createdNasabah.unitBankSampah}\n\n• ID / No Rekening: ${createdNasabah.id}\n• Nama Nasabah: ${createdNasabah.nama}\n• Username Login: ${createdNasabah.id}\n• PIN Masuk: ${createdNasabah.pin}\n• Alamat: ${createdNasabah.alamat}\n\nSilakan simpan informasi ini untuk mengakses buku tabungan sampah digital Anda. Terima kasih!`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendWhatsApp = () => {
    if (!createdNasabah) return;
    const cleanNumber = createdNasabah.noTelepon.replace(/[^0-9]/g, '');
    let formattedNumber = cleanNumber;
    if (formattedNumber.startsWith('0')) {
      formattedNumber = '62' + formattedNumber.slice(1);
    }

    const msg = `Halo Bapak/Ibu ${createdNasabah.nama},\n\nSelamat! Akun buku tabungan sampah Anda di *${createdNasabah.unitBankSampah}* telah berhasil didaftarkan secara resmi.\n\nBerikut informasi akun untuk login aplikasi:\n🆔 *ID Nasabah*: ${createdNasabah.id}\n👤 *Nama*: ${createdNasabah.nama}\n🔑 *PIN Masuk*: ${createdNasabah.pin}\n📍 *Wilayah*: ${createdNasabah.rt} / ${createdNasabah.rw}\n\nSetiap sampah yang Anda pilah dan setorkan ke Pos Penimbangan akan otomatis menambah saldo tabungan Anda. Terima kasih telah peduli lingkungan! 🌱`;

    const url = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(
      msg
    )}`;
    window.open(url, '_blank');
  };

  const handleFinalizeAndClose = (openDeposit = false) => {
    if (createdNasabah) {
      onRegisterSuccess(createdNasabah, openDeposit);
    }
    handleCloseModal();
  };

  return (
    <div
      id="register-nasabah-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs overflow-y-auto"
      onClick={handleCloseModal}
    >
      <div
        id="register-nasabah-modal-content"
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative my-6 animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F7FC] border-b border-[#D0E5F5] text-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-center text-[#005596]">
              <UserPlus className="w-5 h-5 text-[#005596]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#003B6D]">
                Pendaftaran Nasabah Baru
              </h3>
              <p className="text-xs text-[#1E4E79]">
                Petugas Admin Unit • {currentUnitName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {!createdNasabah ? (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Info Unit Pengampu / Database Target */}
            <div className="p-3.5 bg-sky-50 rounded-xl border border-sky-200/90 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-[#003B6D] font-bold">
                  <Building2 className="w-4 h-4 text-[#005596] shrink-0" />
                  <span>Database Bank Unit Penampung:</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[#005596] font-mono font-bold text-[11px]">
                  ID Nasabah: {idNasabah}
                </span>
              </div>

              {isForumAdmin ? (
                <div>
                  <select
                    id="select-unit-nasabah-registration"
                    value={selectedUnitId}
                    onChange={(e) => handleUnitChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-sky-300 rounded-lg text-xs font-semibold text-[#003B6D] focus:outline-none focus:ring-2 focus:ring-[#005596]/30 cursor-pointer"
                  >
                    {bankUnits.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nama} ({u.rw}) • {u.kodeUnit || u.id}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-[#1E4E79] mt-1">
                    *Sebagai Forum Desa, data nasabah ini akan dialokasikan langsung ke database Bank Unit yang dipilih di atas.
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[#003B6D] bg-white/70 px-3 py-1.5 rounded-lg border border-sky-100">
                  <span className="font-semibold">{currentUnitName}</span>
                  <span className="text-[11px] text-gray-500 font-mono">({currentUnitId})</span>
                </div>
              )}
            </div>

            {/* Field 1: Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Nama Lengkap Warga / Nasabah <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ibu Rina Marlina / Bpk. Sutrisno"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white"
                />
              </div>
            </div>

            {/* Field 2: NIK & No WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  NIK / No. KTP <span className="text-gray-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nik}
                  onChange={(e) => setNik(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="16 digit NIK Kependudukan"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    required
                    value={noTelepon}
                    onChange={(e) => setNoTelepon(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Field 3: RT / RW & Alamat Rumah */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  RT Domisili
                </label>
                <select
                  value={rt}
                  onChange={(e) => setRt(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white font-semibold"
                >
                  <option value="RT 01">RT 01</option>
                  <option value="RT 02">RT 02</option>
                  <option value="RT 03">RT 03</option>
                  <option value="RT 04">RT 04</option>
                  <option value="RT 05">RT 05</option>
                  <option value="RT 06">RT 06</option>
                  <option value="RT 07">RT 07</option>
                  <option value="RT 08">RT 08</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  RW Domisili
                </label>
                <select
                  value={rw}
                  onChange={(e) => setRw(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white font-semibold"
                >
                  <option value="RW 01">RW 01</option>
                  <option value="RW 02">RW 02</option>
                  <option value="RW 03">RW 03</option>
                  <option value="RW 04">RW 04</option>
                  <option value="RW 05">RW 05</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Target Setor/Bln
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={5}
                    max={200}
                    value={targetBulananKg}
                    onChange={(e) => setTargetBulananKg(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white font-bold pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-bold">
                    kg
                  </span>
                </div>
              </div>
            </div>

            {/* Field 4: Detail Alamat / Gang / No Rumah */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Detail Alamat / Nama Kampung / Gang
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                  placeholder="Contoh: Kp. Cicadas Hilir No. 18 / Samping Musholla"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white"
                />
              </div>
            </div>

            {/* Field 5: PIN Keamanan Login Nasabah */}
            <div className="p-3.5 bg-sky-50/70 rounded-2xl border border-sky-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#003B6D] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#005596]" />
                  <span>PIN Keamanan Nasabah (Untuk Login)</span>
                </label>
                <span className="text-[10px] text-gray-500 font-medium">
                  Bisa diubah/reset kapan saja
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="123456"
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs text-[#005596] font-mono font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
                <button
                  type="button"
                  onClick={() => setPin('123456')}
                  className="px-3 py-2 bg-white hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  Pakai Default: 123456
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <UserPlus className="w-4 h-4" />
                <span>Daftarkan & Buat Buku Tabungan</span>
              </button>
            </div>
          </form>
        ) : (
          /* ================= SUCCESS REGISTRATION STATE ================= */
          <div className="p-6 space-y-5 overflow-y-auto flex-1 animate-in fade-in zoom-in-95 duration-200">
            {/* Header Check */}
            <div className="text-center space-y-1.5">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-gray-900">
                Pendaftaran Nasabah Berhasil!
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Buku tabungan sampah digital untuk <b>{createdNasabah.nama}</b> telah aktif di database unit.
              </p>
            </div>

            {/* Official Digital Pass Card */}
            <div className="bg-gradient-to-br from-[#005596] to-[#003B6D] text-white p-5 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
                <ShieldCheck className="w-32 h-32 text-white" />
              </div>

              <div className="flex items-center justify-between pb-2.5 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center font-bold text-xs">
                    🌱
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">
                      Buku Tabungan Sampah Warga
                    </div>
                    <div className="text-[10px] text-sky-200">{createdNasabah.unitBankSampah}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono font-bold text-[11px]">
                  {createdNasabah.statusAkun || 'Aktif'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-sky-200 block">ID / No. Rekening:</span>
                  <span className="font-mono font-black text-sm tracking-wider text-amber-300">
                    {createdNasabah.id}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 block">PIN Masuk Akun:</span>
                  <span className="font-mono font-black text-sm tracking-widest text-emerald-300">
                    {createdNasabah.pin}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 block">Nama Nasabah:</span>
                  <span className="font-bold truncate block">{createdNasabah.nama}</span>
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 block">WhatsApp:</span>
                  <span className="font-medium truncate block">{createdNasabah.noTelepon}</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Share Buttons */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-gray-500">
                Bantu Kirimkan Info Kredensial ke Nasabah:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim ke WhatsApp Warga</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyCredentials}
                  className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-all border border-gray-200 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{isCopied ? 'Tersalin ke Clipboard!' : 'Salin Data Akun'}</span>
                </button>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => handleFinalizeAndClose(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Selesai & Tutup
              </button>
              <button
                type="button"
                onClick={() => handleFinalizeAndClose(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Scale className="w-4 h-4" />
                <span>Langsung Timbang & Catat Setoran Perdana</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
