'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Nasabah,
  SetoranRecord,
  SetoranDetailItem,
  WASTE_CATEGORIES,
  formatRupiah,
} from '@/lib/bankSampahData';
import { getStoredKatalogHarga } from '@/lib/katalogHargaData';
import { AuthSession } from '@/lib/auth';
import {
  Plus,
  Trash2,
  X,
  Scale,
  Sparkles,
  Check,
  AlertCircle,
  Search,
  UserCheck,
  Building2,
  Wallet,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface NewDepositModalProps {
  isOpen: boolean;
  nasabah: Nasabah;
  nasabahList?: Nasabah[];
  adminSession?: AuthSession | null;
  onClose: () => void;
  onSaveDeposit: (record: SetoranRecord, targetNasabahId?: string) => void;
}

interface DraftItem {
  kategoriId: string;
  jenisDetail: string;
  berat: number;
}

const DEFAULT_SUGGESTIONS: Record<string, string[]> = {
  plastik: [
    'Botol PET Bening Bersih',
    'Gelas Plastik Air Mineral (PP)',
    'Botol HDPE (Shampoo / Sabun)',
    'Kantong Kresek Bening / Campur',
    'Tutup Botol Plastik',
  ],
  kertas: [
    'Kardus Cokelat Tebal',
    'Kertas HVS Putih & Arsip',
    'Koran & Majalah Bekas',
    'Buku Tulis / Kertas Campur',
    'Duplex / Kotak Kemasan',
  ],
  logam: [
    'Kaleng Minuman Aluminium',
    'Kaleng Susu & Biskuit (Besi)',
    'Seng & Pipa Bekas',
    'Tembaga & Kawat',
  ],
  kaca: [
    'Botol Sirup / Kecap Kaca Utuh',
    'Botol Kaca Bir / Kecil',
    'Pecahan Kaca Bersih',
  ],
  minyak_jelantah: [
    'Minyak Goreng Bekas Disaring',
    'Minyak Dapur Jerigen 5 Liter',
  ],
  elektronik: [
    'Kabel Rusak & Charger HP',
    'Motherboard / Komponen PC',
    'Baterai Bekas & Aki Kering',
    'Ponsel / Handphone Mati',
  ],
};

export const NewDepositModal: React.FC<NewDepositModalProps> = ({
  isOpen,
  nasabah,
  nasabahList = [],
  adminSession,
  onClose,
  onSaveDeposit,
}) => {
  const [selectedNasabahId, setSelectedNasabahId] = useState<string>(nasabah.id);
  const [prevNasabahPropId, setPrevNasabahPropId] = useState<string>(nasabah.id);
  const [nasabahSearch, setNasabahSearch] = useState('');
  const [isNasabahDropdownOpen, setIsNasabahDropdownOpen] = useState(false);

  // Sync selected nasabah if incoming prop changes
  if (nasabah.id !== prevNasabahPropId) {
    setPrevNasabahPropId(nasabah.id);
    setSelectedNasabahId(nasabah.id);
  }

  const activeTargetNasabah = useMemo(() => {
    return nasabahList.find((n) => n.id === selectedNasabahId) || nasabah;
  }, [nasabahList, selectedNasabahId, nasabah]);

  // Filter list for dropdown search
  const filteredNasabahOptions = useMemo(() => {
    if (!nasabahSearch) return nasabahList;
    const q = nasabahSearch.toLowerCase();
    return nasabahList.filter(
      (n) =>
        n.nama.toLowerCase().includes(q) ||
        n.id.toLowerCase().includes(q) ||
        n.noTelepon.toLowerCase().includes(q) ||
        (n.rt && n.rt.toLowerCase().includes(q))
    );
  }, [nasabahList, nasabahSearch]);

  const defaultDateStr = new Date().toISOString().split('T')[0];
  const [tanggal, setTanggal] = useState(defaultDateStr);
  const [jam, setJam] = useState('09:15 WIB');
  
  const defaultPetugas = adminSession?.name
    ? `${adminSession.name} (${adminSession.role === 'admin_unit' ? 'Admin Unit' : 'Petugas'})`
    : 'Petugas Timbang Pos RW';
  const [petugas, setPetugas] = useState(defaultPetugas);

  const defaultLokasi = adminSession?.unitBankSampah
    ? `Pos ${adminSession.unitBankSampah}`
    : 'Pos Penimbangan Bank Sampah RW 01';
  const [lokasi, setLokasi] = useState(defaultLokasi);

  const [catatan, setCatatan] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [items, setItems] = useState<DraftItem[]>([
    { kategoriId: 'plastik', jenisDetail: 'Botol PET Bening Bersih', berat: 3.5 },
  ]);

  const preparedItems: SetoranDetailItem[] = useMemo(() => {
    const liveKatalog = getStoredKatalogHarga();
    return items.map((item) => {
      const cat = WASTE_CATEGORIES[item.kategoriId] || WASTE_CATEGORIES['plastik'];
      const matchedKatalogItem = liveKatalog.find(
        (k) =>
          k.nama.toLowerCase() === (item.jenisDetail || '').toLowerCase() ||
          k.kategoriId === item.kategoriId
      );
      const effectiveHarga =
        liveKatalog.find((k) => k.nama.toLowerCase() === (item.jenisDetail || '').toLowerCase())
          ?.hargaPerSatuan ??
        matchedKatalogItem?.hargaPerSatuan ??
        cat.hargaPerSatuan;

      const subtotal = Math.round(item.berat * effectiveHarga);
      return {
        kategoriId: item.kategoriId,
        jenisDetail: item.jenisDetail || cat.nama,
        berat: Number(item.berat.toFixed(2)),
        satuan: cat.satuan,
        hargaPerSatuan: effectiveHarga,
        subtotal,
      };
    });
  }, [items]);

  const calculatedTotalBerat = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.berat || 0), 0);
  }, [items]);

  const calculatedTotalNilai = useMemo(() => {
    return preparedItems.reduce((acc, item) => acc + item.subtotal, 0);
  }, [preparedItems]);

  const estimatedCo2e = useMemo(() => {
    return items.reduce((acc, item) => {
      const cat = WASTE_CATEGORIES[item.kategoriId] || WASTE_CATEGORIES['plastik'];
      return acc + (item.berat || 0) * cat.co2Factor;
    }, 0);
  }, [items]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { kategoriId: 'kertas', jenisDetail: 'Kardus Cokelat Tebal', berat: 2.0 },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof DraftItem, value: any) => {
    const updated = [...items];
    if (field === 'kategoriId') {
      updated[index].kategoriId = value;
      const suggestions = DEFAULT_SUGGESTIONS[value];
      if (suggestions && suggestions.length > 0) {
        updated[index].jenisDetail = suggestions[0];
      }
    } else if (field === 'berat') {
      const num = parseFloat(value);
      updated[index].berat = isNaN(num) ? 0 : Math.max(0, num);
    } else {
      (updated[index] as any)[field] = value;
    }
    setItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (calculatedTotalBerat <= 0) {
      setErrorMsg('Mohon masukkan bobot sampah minimal lebih dari 0 kg.');
      return;
    }

    const unitId = activeTargetNasabah.unitId || adminSession?.unitId || 'UNIT-CCD-001';
    const unitNama = activeTargetNasabah.unitBankSampah || adminSession?.unitBankSampah || 'Bank Sampah Mekar Jaya RW 01';

    const uniqueId = `TRX-${tanggal.replace(/-/g, '').slice(2)}-${Date.now().toString().slice(-4)}`;
    const newRecord: SetoranRecord = {
      id: uniqueId,
      nasabahId: activeTargetNasabah.id,
      tanggal,
      jam,
      petugas,
      lokasi,
      status: 'Terverifikasi',
      metodePembayaran: 'Masuk Saldo',
      totalBerat: Number(calculatedTotalBerat.toFixed(2)),
      totalNilai: calculatedTotalNilai,
      catatan: catatan.trim() || undefined,
      items: preparedItems,
      unitId,
      unitNama,
    };

    onSaveDeposit(newRecord, activeTargetNasabah.id);
    onClose();
  };

  return (
    <div
      id="new-deposit-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="new-deposit-modal-content"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative my-6 animate-scaleUp max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F7FC] border-b border-[#D0E5F5] text-gray-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-center text-[#005596]">
              <Scale className="w-5 h-5 text-[#005596]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#003B6D]">
                Penimbangan & Setoran Sampah
              </h3>
              <p className="text-xs text-[#1E4E79]">
                Pencatatan Resmi Admin Bank Unit • Masuk ke Rekening Nasabah
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* TARGET NASABAH SELECTOR (Searchable)                         */}
          {/* ============================================================ */}
          <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#003B6D] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#005596]" />
                <span>Pilih Nasabah yang Menyetor Sampah:</span>
              </label>
              <span className="text-[10px] text-sky-800 font-medium">
                Pilih dari {nasabahList.length} nasabah unit
              </span>
            </div>

            {/* Selected Nasabah Banner Card */}
            <div className="bg-white p-3.5 rounded-xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#005596] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {activeTargetNasabah.avatarInitials || 'NS'}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900 truncate">
                      {activeTargetNasabah.nama}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-[#005596] border border-sky-200 text-[10px] font-mono font-bold">
                      {activeTargetNasabah.id}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {activeTargetNasabah.alamat} • {activeTargetNasabah.noTelepon}
                  </p>
                </div>
              </div>

              {/* Selector Trigger Button */}
              {nasabahList.length > 1 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsNasabahDropdownOpen(!isNasabahDropdownOpen)}
                    className="w-full sm:w-auto px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#005596] border border-sky-200 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    Ganti Nasabah
                  </button>

                  {/* Dropdown popup */}
                  {isNasabahDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-gray-200 p-2 z-50 animate-scaleUp">
                      <div className="p-1.5 mb-1.5">
                        <div className="relative">
                          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                          <input
                            type="text"
                            value={nasabahSearch}
                            onChange={(e) => setNasabahSearch(e.target.value)}
                            placeholder="Cari nama / ID..."
                            className="w-full pl-7 pr-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#005596]"
                            autoFocus
                          />
                        </div>
                      </div>

                      <div className="max-h-52 overflow-y-auto space-y-1">
                        {filteredNasabahOptions.map((n) => (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => {
                              setSelectedNasabahId(n.id);
                              setIsNasabahDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                              n.id === activeTargetNasabah.id
                                ? 'bg-sky-50 text-[#005596] font-bold'
                                : 'hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            <div className="truncate">
                              <div className="font-semibold truncate">{n.nama}</div>
                              <div className="text-[10px] text-gray-400 truncate">{n.alamat}</div>
                            </div>
                            <span className="font-mono text-[10px] text-gray-400 shrink-0">
                              {n.id}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Meta Information Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Tanggal Penimbangan
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Jam Setor
              </label>
              <input
                type="text"
                value={jam}
                onChange={(e) => setJam(e.target.value)}
                placeholder="misal: 09:30 WIB"
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Items Penimbangan List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-bold text-gray-900 text-xs sm:text-sm">
                Rincian Barang & Timbangan Sampah
              </label>
              <span className="text-[11px] text-gray-500 font-medium">
                Tarif terverifikasi otomatis
              </span>
            </div>

            <div className="space-y-2.5">
              {items.map((item, index) => {
                const cat = WASTE_CATEGORIES[item.kategoriId] || WASTE_CATEGORIES['plastik'];
                const subtotal = Math.round(item.berat * (cat?.hargaPerSatuan || 0));

                return (
                  <div
                    key={index}
                    className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2 relative"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                      {/* Kategori Selector */}
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                          Kategori Sampah
                        </label>
                        <select
                          value={item.kategoriId}
                          onChange={(e) =>
                            handleItemChange(index, 'kategoriId', e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:outline-none"
                        >
                          {Object.values(WASTE_CATEGORIES).map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nama} ({formatRupiah(c.hargaPerSatuan)}/{c.satuan})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Detail Deskripsi / Nama Jenis */}
                      <div className="sm:col-span-5">
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                          Keterangan / Jenis Spesifik
                        </label>
                        <input
                          type="text"
                          value={item.jenisDetail}
                          onChange={(e) =>
                            handleItemChange(index, 'jenisDetail', e.target.value)
                          }
                          placeholder="misal: Botol Mineral Bersih"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:outline-none"
                        />
                      </div>

                      {/* Input Bobot */}
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-gray-500 mb-1">
                          Bobot ({cat?.satuan || 'kg'})
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={item.berat === 0 ? '' : item.berat}
                          onChange={(e) =>
                            handleItemChange(index, 'berat', e.target.value)
                          }
                          placeholder="0.0"
                          className="w-full px-2.5 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:outline-none"
                        />
                      </div>

                      {/* Delete item button */}
                      <div className="sm:col-span-1 flex justify-end items-center">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
                            title="Hapus baris ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Subtotal preview for this row */}
                    <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                      <span>
                        Harga acuan: {formatRupiah(cat.hargaPerSatuan)} / {cat.satuan}
                      </span>
                      <span className="font-bold text-[#005596]">
                        Subtotal: {formatRupiah(subtotal)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#005596] bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Jenis Sampah Lain</span>
            </button>
          </div>

          {/* Real-time Summary Card with Live Impact */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/50 to-white border border-sky-100 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#003B6D]">
              <Sparkles className="w-4 h-4 text-[#005596]" />
              <span>Kalkulasi Setoran & Saldo yang Masuk:</span>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] text-gray-400 font-medium">Total Berat</div>
                <div className="text-base font-black text-gray-900">
                  {calculatedTotalBerat.toFixed(1)} kg
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] text-gray-400 font-medium">Saldo Masuk</div>
                <div className="text-base font-black text-[#005596]">
                  +{formatRupiah(calculatedTotalNilai)}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-sky-100 shadow-2xs">
                <div className="text-[10px] text-gray-400 font-medium">Cegah CO₂</div>
                <div className="text-base font-black text-emerald-600">
                  +{estimatedCo2e.toFixed(1)} kg
                </div>
              </div>
            </div>
          </div>

          {/* Lokasi & Petugas Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Petugas Penimbang
              </label>
              <input
                type="text"
                value={petugas}
                onChange={(e) => setPetugas(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Pos Penimbangan / Lokasi
              </label>
              <input
                type="text"
                value={lokasi}
                onChange={(e) => setLokasi(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Catatan Field */}
          <div className="text-xs">
            <label className="block font-medium text-gray-700 mb-1">
              Catatan Penimbangan (Opsional)
            </label>
            <input
              type="text"
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              placeholder="misal: Sampah sudah dipilah bersih dari rumah"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-xs focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#005596] hover:bg-[#003B6D] text-white shadow-xs transition-colors cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Simpan & Masukkan ke Buku Nasabah</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
