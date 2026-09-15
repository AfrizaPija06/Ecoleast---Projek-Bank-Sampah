'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  CheckCircle2,
  AlertCircle,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Send,
  ShieldCheck,
  Landmark,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { registerNewBankUnit } from '@/lib/dbStore';
import { BankUnit } from '@/lib/schema/types';

interface RegisterBankUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegistered?: (newUnit: BankUnit) => void;
  onSwitchToForumLogin?: () => void;
}

export function RegisterBankUnitModal({
  isOpen,
  onClose,
  onSuccessRegistered,
  onSwitchToForumLogin,
}: RegisterBankUnitModalProps) {
  // Form States
  const [namaUnit, setNamaUnit] = useState('');
  const [rw, setRw] = useState('RW 04');
  const [rtCoverage, setRtCoverage] = useState('RT 01, RT 02, RT 03');
  const [ketuaUnit, setKetuaUnit] = useState('');
  const [kontakHp, setKontakHp] = useState('');
  const [email, setEmail] = useState('');
  const [alamatPos, setAlamatPos] = useState('');
  const [bankNama, setBankNama] = useState('Bank BJB');
  const [bankRekening, setBankRekening] = useState('');
  const [bankAtasNama, setBankAtasNama] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [registeredUnit, setRegisteredUnit] = useState<BankUnit | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!namaUnit.trim()) {
      setErrorMsg('Mohon isi Nama Bank Sampah Unit.');
      return;
    }
    if (!ketuaUnit.trim()) {
      setErrorMsg('Mohon isi Nama Ketua / Penanggung Jawab Unit.');
      return;
    }
    if (!kontakHp.trim()) {
      setErrorMsg('Mohon isi Nomor WhatsApp / Kontak Ketua Unit.');
      return;
    }
    if (!alamatPos.trim()) {
      setErrorMsg('Mohon isi Alamat Pos Timbangan / Sekretariat Unit.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newUnit = registerNewBankUnit({
        namaUnit: namaUnit.trim(),
        rw,
        rtCoverage: rtCoverage.trim() || `Wilayah ${rw}`,
        ketuaUnit: ketuaUnit.trim(),
        kontakHp: kontakHp.trim(),
        email: email.trim() || undefined,
        alamatPos: alamatPos.trim(),
        bankNama,
        bankRekening: bankRekening.trim() || 'Dalam Proses',
        bankAtasNama: bankAtasNama.trim() || namaUnit.trim(),
      });

      setRegisteredUnit(newUnit);
      if (onSuccessRegistered) {
        onSuccessRegistered(newUnit);
      }
    } catch {
      setErrorMsg('Terjadi kesalahan saat menyimpan pendaftaran. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setRegisteredUnit(null);
    setNamaUnit('');
    setRw('RW 04');
    setRtCoverage('RT 01, RT 02, RT 03');
    setKetuaUnit('');
    setKontakHp('');
    setEmail('');
    setAlamatPos('');
    setBankRekening('');
    setBankAtasNama('');
    setErrorMsg(null);
    setIsCopied(false);
  };

  const defaultUsername = registeredUnit
    ? `admin.${registeredUnit.rw.toLowerCase().replace(/\s+/g, '')}`
    : '';

  const handleCopyCredentials = () => {
    if (!registeredUnit) return;
    const text = `Kredensial Bank Sampah Unit:\nNama: ${registeredUnit.nama}\nKode: ${registeredUnit.kodeUnit}\nUsername: ${defaultUsername}\nPassword: admin123`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      id="register-bank-unit-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="register-bank-unit-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto space-y-5 animate-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#005596] text-white flex items-center justify-center font-bold shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 text-base sm:text-lg">
                  Pendaftaran Bank Sampah Unit Baru
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                  Langsung Otomatis Aktif
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Bank Sampah Unit RW/RT langsung terdaftar dan dapat segera digunakan bertransaksi
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-close-register-unit"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JIKA SUKSES TERDAFTAR (Confirmation Ticket Card) */}
        {registeredUnit ? (
          <div className="space-y-5 py-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-emerald-900">
                  Bank Sampah Unit Berhasil Didaftarkan!
                </h4>
                <p className="text-xs text-emerald-700 mt-1 max-w-md mx-auto">
                  Unit telah <b>langsung aktif</b> dan terintegrasi ke seluruh ekosistem Desa Cicadas.
                </p>
              </div>

              {/* Ticket Details */}
              <div className="p-4 bg-white rounded-xl border border-emerald-100 text-left space-y-2.5 max-w-lg mx-auto shadow-2xs">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-[#005596] bg-sky-50 px-2 py-0.5 rounded">
                    {registeredUnit.kodeUnit}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Nama Unit:</span>
                  <span className="font-bold text-gray-900">{registeredUnit.nama}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Wilayah:</span>
                  <span className="font-semibold text-gray-800">
                    {registeredUnit.rw} ({registeredUnit.rtCoverage})
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Ketua Unit:</span>
                  <span className="font-semibold text-gray-800">{registeredUnit.ketuaUnit}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 font-medium">Kontak HP / WA:</span>
                  <span className="font-semibold text-gray-800">{registeredUnit.kontakHp}</span>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                  <span className="text-gray-500 font-medium">Status Operasional:</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aktif & Siap Beroperasi</span>
                  </span>
                </div>
              </div>

              {/* Box Kredensial Pengurus */}
              <div className="p-4 bg-white rounded-xl border border-sky-200 text-left space-y-2 max-w-lg mx-auto">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#003B6D]">Akun Login Pengurus Unit:</span>
                  <button
                    type="button"
                    onClick={handleCopyCredentials}
                    className="text-[11px] font-bold text-[#005596] hover:text-[#003B6D] flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Akun</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-gray-500 text-[10px] block">Username:</span>
                    <span className="font-mono font-bold text-gray-900">{defaultUsername}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block">Password Default:</span>
                    <span className="font-mono font-bold text-gray-900">admin123</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                Daftar Unit Lain
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Selesai & Tutup
              </button>
            </div>
          </div>
        ) : (
          /* FORM PENDAFTARAN */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Guidance banner */}
            <div className="p-3 bg-sky-50/80 rounded-2xl border border-sky-100 flex items-start gap-2.5 text-xs text-[#003B6D]">
              <ShieldCheck className="w-4 h-4 text-[#005596] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Bank Sampah Unit yang didaftarkan akan langsung terhubung dengan katalog harga desa, sistem penimbangan nasabah, dan agregasi data lingkungan Desa Cicadas.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Bagian 1: Identitas & Wilayah Unit */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-[#005596]" />
                <span>1. Identitas & Wilayah Bank Unit</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Nama Bank Sampah Unit <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bank Sampah Hijau Mandiri RW 04"
                    value={namaUnit}
                    onChange={(e) => setNamaUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Wilayah RW <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={rw}
                    onChange={(e) => setRw(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  >
                    {[...Array(12)].map((_, i) => {
                      const rwNum = String(i + 1).padStart(2, '0');
                      return (
                        <option key={rwNum} value={`RW ${rwNum}`}>
                          RW {rwNum} - Desa Cicadas
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Cakupan RT Wilayah Layanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: RT 01, RT 02, RT 03"
                    value={rtCoverage}
                    onChange={(e) => setRtCoverage(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Lokasi Pos Penimbangan / Sekretariat Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-2.5 left-3 pointer-events-none text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Balai Warga RT 02 / RW 04, Desa Cicadas"
                      value={alamatPos}
                      onChange={(e) => setAlamatPos(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 2: Kontak & Pengurus Unit */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#005596]" />
                <span>2. Pengurus & Penanggung Jawab</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Nama Ketua / Penanggung Jawab <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Bambang Sutrisno"
                    value={ketuaUnit}
                    onChange={(e) => setKetuaUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    No. WhatsApp / Kontak Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 0812-3456-7890"
                      value={kontakHp}
                      onChange={(e) => setKontakHp(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">
                    Email Resmi Unit (Opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="email"
                      placeholder="Contoh: banksampah.rw04@cicadas.desa.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian 3: Rekening Kas Unit */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#005596]" />
                <span>3. Rekening Kas Operasional Unit</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Nama Bank
                  </label>
                  <select
                    value={bankNama}
                    onChange={(e) => setBankNama(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  >
                    <option value="Bank BJB">Bank BJB (BUMDes)</option>
                    <option value="Bank BRI">Bank BRI</option>
                    <option value="Bank Mandiri">Bank Mandiri</option>
                    <option value="Bank BCA">Bank BCA</option>
                    <option value="Kas Tunai">Kas Tunai Unit</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Nomor Rekening
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 0012-9847-190"
                    value={bankRekening}
                    onChange={(e) => setBankRekening(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-gray-700">
                    Atas Nama Rekening
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Bank Sampah RW 04"
                    value={bankAtasNama}
                    onChange={(e) => setBankAtasNama(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                id="btn-cancel-register-unit"
                onClick={onClose}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                id="btn-submit-register-unit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-md shadow-[#005596]/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Mendaftarkan Unit...' : 'Daftarkan Bank Sampah Unit'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
