'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Eye,
  EyeOff,
  RotateCcw,
  Send,
  Scale,
  Copy,
  CheckCircle2,
  Phone,
  Building2,
  MapPin,
  Sparkles,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { Nasabah, SetoranRecord, formatRupiah, calculateImpact } from '@/lib/bankSampahData';
import { AuthSession } from '@/lib/auth';

interface NasabahManagementViewProps {
  nasabahList: Nasabah[];
  allSetoranRecords: SetoranRecord[];
  activeNasabah: Nasabah;
  adminSession?: AuthSession | null;
  onSelectNasabah: (nasabah: Nasabah) => void;
  onOpenRegisterModal: () => void;
  onOpenNewDepositForNasabah: (nasabah: Nasabah) => void;
  onUpdateNasabahPin: (nasabahId: string, newPin: string) => void;
  onNavigateToTab?: (tab: string) => void;
}

export function NasabahManagementView({
  nasabahList,
  allSetoranRecords,
  activeNasabah,
  adminSession,
  onSelectNasabah,
  onOpenRegisterModal,
  onOpenNewDepositForNasabah,
  onUpdateNasabahPin,
}: NasabahManagementViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRt, setSelectedRt] = useState('all');
  const [visiblePins, setVisiblePins] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Reset PIN modal state
  const [resetModalNasabah, setResetModalNasabah] = useState<Nasabah | null>(null);
  const [newPinInput, setNewPinInput] = useState('123456');
  const [pinResetSuccess, setPinResetSuccess] = useState(false);

  // Toggle PIN visibility
  const togglePinVisibility = (id: string) => {
    setVisiblePins((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // WhatsApp Sender for Credentials Recovery / Helpdesk
  const handleSendCredentialsWA = (nasabah: Nasabah) => {
    const cleanNumber = nasabah.noTelepon.replace(/[^0-9]/g, '');
    let formatted = cleanNumber;
    if (formatted.startsWith('0')) {
      formatted = '62' + formatted.slice(1);
    }
    const currentPin = nasabah.pin || '123456';
    const msg = `Halo Bpk/Ibu *${nasabah.nama}*,\n\nBerikut adalah informasi akun resmi Buku Tabungan Bank Sampah Anda di *${nasabah.unitBankSampah}*:\n\n🆔 *ID / No. Rekening*: ${nasabah.id}\n👤 *Nama Terdaftar*: ${nasabah.nama}\n🔑 *PIN Masuk Aplikasi*: ${currentPin}\n📍 *Alamat*: ${nasabah.alamat}\n\nJika Anda lupa password atau memerlukan bantuan setoran sampah, jangan ragu menghubungi pengurus Admin Bank Unit kami. Terima kasih! 🌿`;

    const url = `https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // Open reset PIN modal
  const handleOpenResetPin = (nasabah: Nasabah) => {
    setResetModalNasabah(nasabah);
    setNewPinInput('123456');
    setPinResetSuccess(false);
  };

  // Submit reset PIN
  const handleConfirmResetPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalNasabah) return;
    const cleanPin = newPinInput.trim();
    if (cleanPin.length < 4) return;

    onUpdateNasabahPin(resetModalNasabah.id, cleanPin);
    setPinResetSuccess(true);
    setTimeout(() => {
      setPinResetSuccess(false);
      setResetModalNasabah(null);
    }, 1800);
  };

  // Filtered nasabah list
  const filteredList = useMemo(() => {
    return nasabahList.filter((item) => {
      const q = searchTerm.toLowerCase();
      const matchSearch =
        !q ||
        item.nama.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.noTelepon.toLowerCase().includes(q) ||
        (item.nik && item.nik.includes(q)) ||
        item.alamat.toLowerCase().includes(q);

      const matchRt =
        selectedRt === 'all' ||
        (item.rt && item.rt === selectedRt) ||
        item.alamat.toLowerCase().includes(selectedRt.toLowerCase());

      return matchSearch && matchRt;
    });
  }, [nasabahList, searchTerm, selectedRt]);

  // Aggregate metrics
  const totalUnitSaldo = useMemo(() => {
    return nasabahList.reduce((acc, item) => {
      const records = allSetoranRecords.filter((r) => r.nasabahId === item.id);
      const impact = calculateImpact(records);
      const saldo = Math.max(0, impact.totalNilaiRupiah - (item.saldoTarik || 0));
      return acc + saldo;
    }, 0);
  }, [nasabahList, allSetoranRecords]);

  const totalUnitKg = useMemo(() => {
    return allSetoranRecords.reduce((acc, r) => acc + (r.totalBerat || 0), 0);
  }, [allSetoranRecords]);

  const currentUnitTitle =
    adminSession?.unitBankSampah || activeNasabah.unitBankSampah || 'Bank Sampah Mekar Jaya RW 01';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ============================================================ */}
      {/* 1. TOP HEADER & METRIC SUMMARY CARDS                         */}
      {/* ============================================================ */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-[#005596] text-[11px] font-bold">
              Manajemen Nasabah & Akun
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs font-semibold text-gray-600">{currentUnitTitle}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            Data Nasabah & Pemantauan Akun
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Kelola buku tabungan, serta bantu nasabah yang lupa PIN/Password login.
          </p>
        </div>

        {adminSession?.role !== 'superadmin_forum' && (
          <button
            id="btn-tambah-nasabah-baru"
            onClick={onOpenRegisterModal}
            className="px-5 py-3 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Daftarkan Nasabah Baru</span>
          </button>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Nasabah Terdaftar</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">{nasabahList.length} Warga</div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Semua Akun Terverifikasi</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Saldo Simpanan Warga</span>
            <div className="text-2xl font-black text-[#005596] mt-0.5 truncate">
              {formatRupiah(totalUnitSaldo)}
            </div>
            <span className="text-[11px] text-sky-700 font-medium mt-0.5 block">
              Dana Tabungan di Kas Unit
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
            <CreditCard className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Total Sampah Terkumpul</span>
            <div className="text-2xl font-black text-gray-900 mt-0.5">
              {Math.round(totalUnitKg)} kg
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Akumulasi dari Pos Timbang</span>
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. SEARCH & FILTER TOOLBAR                                   */}
      {/* ============================================================ */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, ID (NSB-...), No HP, NIK..."
            className="w-full pl-9 pr-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-500 font-medium shrink-0">Filter RT:</span>
          <select
            value={selectedRt}
            onChange={(e) => setSelectedRt(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
          >
            <option value="all">Semua Wilayah RT</option>
            <option value="RT 01">RT 01</option>
            <option value="RT 02">RT 02</option>
            <option value="RT 03">RT 03</option>
            <option value="RT 04">RT 04</option>
            <option value="RT 05">RT 05</option>
          </select>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. NASABAH LIST CARDS WITH CREDENTIALS & HELPDESK CONTROLS   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.length === 0 ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
            <Users className="w-10 h-10 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700">Nasabah Tidak Ditemukan</h4>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              Tidak ada nasabah yang cocok dengan kata kunci pencarian atau filter RT terpilih.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedRt('all');
              }}
              className="px-3.5 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          filteredList.map((item) => {
            const isCurrent = item.id === activeNasabah.id;
            const itemRecords = allSetoranRecords.filter((r) => r.nasabahId === item.id);
            const itemImpact = calculateImpact(itemRecords);
            const itemSaldo = Math.max(0, itemImpact.totalNilaiRupiah - (item.saldoTarik || 0));
            const isPinVisible = !!visiblePins[item.id];
            const displayPin = item.pin || '123456';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-[#005596] ring-2 ring-[#005596]/15 shadow-sm'
                    : 'border-gray-100 hover:border-sky-200 shadow-xs'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Row: Avatar, Name & Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#005596] flex items-center justify-center font-bold text-base overflow-hidden ring-2 ring-sky-100/60 shadow-2xs">
                          {item.avatarUrl ? (
                            <img
                              src={item.avatarUrl}
                              alt={item.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            item.avatarInitials
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-gray-900 truncate">
                            {item.nama}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5 truncate">
                          <MapPin className="w-3 h-3 text-[#00A3E0] shrink-0" />
                          <span className="truncate">{item.alamat}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="font-mono">{item.noTelepon}</span>
                        </div>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#005596] border border-sky-200 text-[10px] font-mono font-bold shrink-0">
                      {item.id}
                    </span>
                  </div>

                  {/* Financial & Environmental Stats */}
                  <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase tracking-wider font-semibold">
                        Saldo Tabungan
                      </span>
                      <span className="font-black text-sm text-[#005596]">
                        {formatRupiah(itemSaldo)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-[10px] block uppercase tracking-wider font-semibold">
                        Total Setor
                      </span>
                      <span className="font-bold text-xs text-gray-800">
                        {Math.round(itemImpact.totalKg)} kg ({itemRecords.length}x)
                      </span>
                    </div>
                  </div>

                  {/* HELPDESK & CREDENTIAL RECOVERY BOX */}
                  <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#003B6D] flex items-center gap-1">
                        <KeyRound className="w-3 h-3 text-[#005596]" />
                        <span>Info Login & PIN:</span>
                      </span>
                      <button
                        onClick={() => handleOpenResetPin(item)}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset PIN</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-sky-200/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-[11px]">PIN:</span>
                        <span className="font-mono font-bold tracking-widest text-[#005596]">
                          {isPinVisible ? displayPin : '••••••'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => togglePinVisibility(item.id)}
                          className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                          title={isPinVisible ? 'Sembunyikan PIN' : 'Lihat PIN'}
                        >
                          {isPinVisible ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleCopy(
                              `ID: ${item.id} | PIN: ${displayPin}`,
                              item.id
                            )
                          }
                          className="p-1 text-gray-400 hover:text-gray-700 transition-colors"
                          title="Salin ID & PIN"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {copiedId === item.id && (
                      <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Kredensial tersalin ke clipboard!</span>
                      </div>
                    )}

                    {/* Quick WhatsApp helper button */}
                    <button
                      type="button"
                      onClick={() => handleSendCredentialsWA(item)}
                      className="w-full py-1.5 px-2.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Kirim Info Akun via WhatsApp</span>
                    </button>
                  </div>
                </div>

                {/* Bottom Action: Catat Setoran & Switch Account */}
                <div className={`mt-4 pt-3 border-t border-gray-100 grid ${adminSession?.role === 'superadmin_forum' ? 'grid-cols-1' : 'grid-cols-2'} gap-2`}>
                  {adminSession?.role !== 'superadmin_forum' && (
                    <button
                      type="button"
                      onClick={() => onOpenNewDepositForNasabah(item)}
                      className="py-2 px-2.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Catat Setoran</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectNasabah(item)}
                    disabled={isCurrent}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-sky-50 hover:bg-sky-100 text-[#005596] border border-sky-200'
                    }`}
                  >
                    {isCurrent ? 'Akun Aktif' : 'Buku Tabungan'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL RESET PIN / PASSWORD HELPDESK                       */}
      {/* ============================================================ */}
      {resetModalNasabah && (
        <div
          id="reset-pin-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs"
          onClick={() => setResetModalNasabah(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-gray-900">
                  Reset PIN Nasabah
                </h3>
                <p className="text-xs text-gray-500">
                  Untuk <b>{resetModalNasabah.nama}</b> ({resetModalNasabah.id})
                </p>
              </div>
            </div>

            {pinResetSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5 font-bold animate-in fade-in duration-150">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>PIN berhasil diperbarui! Mengalihkan...</span>
              </div>
            ) : (
              <form onSubmit={handleConfirmResetPin} className="space-y-4">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nasabah lupa kata sandi? Buat PIN baru 4-6 digit angka atau atur ulang ke default <b>123456</b>.
                </p>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    PIN Baru Nasabah
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={newPinInput}
                      onChange={(e) =>
                        setNewPinInput(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      placeholder="123456"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-[#005596] tracking-widest focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setNewPinInput('123456')}
                      className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold"
                    >
                      Set 123456
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResetModalNasabah(null)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#005596] hover:bg-[#003B6D] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan PIN Baru</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
