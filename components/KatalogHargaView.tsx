'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Tag,
  TrendingUp,
  Minus,
  TrendingDown,
  Info,
  Calculator,
  Plus,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Package,
  FileText,
  Cpu,
  Wine,
  Droplets,
  Zap,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Scale,
  Coins,
} from 'lucide-react';
import {
  KatalogHargaItem,
  getStoredKatalogHarga,
  saveStoredKatalogHarga,
  resetStoredKatalogHarga,
  INITIAL_KATALOG_HARGA,
} from '@/lib/katalogHargaData';
import { formatRupiah } from '@/lib/bankSampahData';

interface KatalogHargaViewProps {
  userRole?: 'admin' | 'nasabah';
  onNavigateToSetoran?: () => void;
}

export function KatalogHargaView({
  userRole = 'nasabah',
  onNavigateToSetoran,
}: KatalogHargaViewProps) {
  const [items, setItems] = useState<KatalogHargaItem[]>(() => {
    return getStoredKatalogHarga();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('semua');
  const [sortOption, setSortOption] = useState<'kategori' | 'harga-desc' | 'harga-asc' | 'nama'>('kategori');

  // Calculator State (for Nasabah / all users)
  const [calcItemId, setCalcItemId] = useState<string>('pet-bening');
  const [calcQty, setCalcQty] = useState<number>(5);

  // Admin Edit Modal State
  const [editingItem, setEditingItem] = useState<KatalogHargaItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Inline Quick Price editing map (id -> temporary value)
  const [inlinePriceMap, setInlinePriceMap] = useState<Record<string, number>>({});
  const [editingInlineId, setEditingInlineId] = useState<string | null>(null);

  // New item form state for Admin
  const [newItemData, setNewItemData] = useState<Partial<KatalogHargaItem>>({
    nama: '',
    kategoriId: 'plastik',
    kategoriNama: 'Plastik & Kemasan',
    hargaPerSatuan: 2500,
    satuan: 'kg',
    kualitas: 'Bersih, kering, siap olah',
    tips: 'Dipilah terpisah dalam wadah kering.',
    trenHarga: 'stabil',
    bisaDiterima: true,
  });

  // Listen to cross-window or local updates
  useEffect(() => {
    const handleUpdate = () => {
      setItems(getStoredKatalogHarga());
    };
    window.addEventListener('katalog_harga_updated', handleUpdate);
    return () => window.removeEventListener('katalog_harga_updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Categories definition
  const categoriesList = [
    { id: 'semua', label: 'Semua Kategori', icon: Tag },
    { id: 'plastik', label: 'Plastik & Kemasan', icon: Package, color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { id: 'kertas', label: 'Kertas & Karton', icon: FileText, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { id: 'logam', label: 'Logam & Kaleng', icon: Cpu, color: 'text-slate-700 bg-slate-100 border-slate-300' },
    { id: 'kaca', label: 'Kaca & Beling', icon: Wine, color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { id: 'minyak_jelantah', label: 'Minyak Jelantah', icon: Droplets, color: 'text-orange-700 bg-orange-50 border-orange-200' },
    { id: 'elektronik', label: 'Elektronik (E-Waste)', icon: Zap, color: 'text-violet-700 bg-violet-50 border-violet-200' },
  ];

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let list = items.filter((item) => {
      const matchCat = selectedCategory === 'semua' || item.kategoriId === selectedCategory;
      const matchQuery =
        searchQuery.trim() === '' ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kategoriNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.kualitas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tips.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.kodeReferensi && item.kodeReferensi.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });

    if (sortOption === 'harga-desc') {
      list.sort((a, b) => b.hargaPerSatuan - a.hargaPerSatuan);
    } else if (sortOption === 'harga-asc') {
      list.sort((a, b) => a.hargaPerSatuan - b.hargaPerSatuan);
    } else if (sortOption === 'nama') {
      list.sort((a, b) => a.nama.localeCompare(b.nama));
    }
    return list;
  }, [items, selectedCategory, searchQuery, sortOption]);

  // Selected item for calculator
  const selectedCalcItem = useMemo(() => {
    return items.find((i) => i.id === calcItemId) || items[0];
  }, [items, calcItemId]);

  const calcEstimatedEarnings = useMemo(() => {
    if (!selectedCalcItem) return 0;
    return Math.round(selectedCalcItem.hargaPerSatuan * (calcQty || 0));
  }, [selectedCalcItem, calcQty]);

  // ADMIN ACTION: Save item price directly
  const handleSaveInlinePrice = (id: string) => {
    const newPrice = inlinePriceMap[id];
    if (newPrice === undefined || isNaN(newPrice) || newPrice < 0) {
      setEditingInlineId(null);
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const updated = items.map((it) => {
      if (it.id === id) {
        return {
          ...it,
          hargaPerSatuan: newPrice,
          terakhirDiperbarui: today,
        };
      }
      return it;
    });
    setItems(updated);
    saveStoredKatalogHarga(updated);
    setEditingInlineId(null);
    showToast(`Harga berhasil diperbarui menjadi ${formatRupiah(newPrice)}`);
  };

  // ADMIN ACTION: Quick adjust +/-
  const handleQuickDelta = (id: string, delta: number) => {
    const today = new Date().toISOString().split('T')[0];
    const updated = items.map((it) => {
      if (it.id === id) {
        const nextPrice = Math.max(0, it.hargaPerSatuan + delta);
        return {
          ...it,
          hargaPerSatuan: nextPrice,
          terakhirDiperbarui: today,
          trenHarga: delta > 0 ? ('naik' as const) : ('turun' as const),
        };
      }
      return it;
    });
    setItems(updated);
    saveStoredKatalogHarga(updated);
    showToast(`Harga disesuaikan (${delta > 0 ? '+' : ''}${formatRupiah(delta)})`);
  };

  // ADMIN ACTION: Toggle item acceptance
  const handleToggleAcceptance = (id: string) => {
    const updated = items.map((it) => {
      if (it.id === id) {
        return { ...it, bisaDiterima: !it.bisaDiterima };
      }
      return it;
    });
    setItems(updated);
    saveStoredKatalogHarga(updated);
    const target = updated.find((i) => i.id === id);
    showToast(`Status penerimaan: ${target?.bisaDiterima ? 'Aktif Diterima' : 'Ditutup Sementara'}`);
  };

  // ADMIN ACTION: Full Edit Item
  const handleOpenEditModal = (item: KatalogHargaItem) => {
    setEditingItem({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveFullEdit = () => {
    if (!editingItem) return;
    const today = new Date().toISOString().split('T')[0];
    const updated = items.map((it) => {
      if (it.id === editingItem.id) {
        return {
          ...editingItem,
          terakhirDiperbarui: today,
        };
      }
      return it;
    });
    setItems(updated);
    saveStoredKatalogHarga(updated);
    setIsEditModalOpen(false);
    showToast(`Data komoditas "${editingItem.nama}" berhasil diperbarui.`);
  };

  // ADMIN ACTION: Add New Item
  const handleAddNewItem = () => {
    if (!newItemData.nama || !newItemData.hargaPerSatuan) {
      alert('Mohon isi nama komoditas dan nominal harga');
      return;
    }
    const catMap: Record<string, string> = {
      plastik: 'Plastik & Kemasan',
      kertas: 'Kertas & Karton',
      logam: 'Logam & Kaleng',
      kaca: 'Kaca & Beling',
      minyak_jelantah: 'Minyak Jelantah',
      elektronik: 'Elektronik & E-Waste',
    };
    const catId = (newItemData.kategoriId || 'plastik') as KatalogHargaItem['kategoriId'];
    const today = new Date().toISOString().split('T')[0];
    const createdItem: KatalogHargaItem = {
      id: `item-${Date.now()}`,
      kategoriId: catId,
      kategoriNama: catMap[catId] || 'Lainnya',
      nama: newItemData.nama.trim(),
      hargaPerSatuan: Number(newItemData.hargaPerSatuan),
      satuan: newItemData.satuan || 'kg',
      kualitas: newItemData.kualitas || 'Kering, bersih, siap timbang',
      tips: newItemData.tips || 'Disimpan di tempat terlindung air.',
      trenHarga: newItemData.trenHarga || 'stabil',
      terakhirDiperbarui: today,
      bisaDiterima: true,
      kodeReferensi: `CST-${Math.floor(Math.random() * 900) + 100}`,
    };

    const updated = [createdItem, ...items];
    setItems(updated);
    saveStoredKatalogHarga(updated);
    setIsAddModalOpen(false);
    setNewItemData({
      nama: '',
      kategoriId: 'plastik',
      kategoriNama: 'Plastik & Kemasan',
      hargaPerSatuan: 2500,
      satuan: 'kg',
      kualitas: 'Bersih, kering, siap olah',
      tips: 'Dipilah terpisah dalam wadah kering.',
      trenHarga: 'stabil',
      bisaDiterima: true,
    });
    showToast(`Komoditas baru "${createdItem.nama}" berhasil ditambahkan ke katalog!`);
  };

  // ADMIN ACTION: Reset Default
  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh harga ke patokan default awal?')) {
      const resetList = resetStoredKatalogHarga();
      setItems(resetList);
      showToast('Katalog harga berhasil dikembalikan ke standar awal.');
    }
  };

  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'plastik':
        return <Package className="w-4 h-4 text-[#005596]" />;
      case 'kertas':
        return <FileText className="w-4 h-4 text-amber-600" />;
      case 'logam':
        return <Cpu className="w-4 h-4 text-slate-600" />;
      case 'kaca':
        return <Wine className="w-4 h-4 text-sky-600" />;
      case 'minyak_jelantah':
        return <Droplets className="w-4 h-4 text-orange-600" />;
      case 'elektronik':
        return <Zap className="w-4 h-4 text-violet-600" />;
      default:
        return <Tag className="w-4 h-4 text-[#005596]" />;
    }
  };

  const getCategoryBadgeClass = (catId: string) => {
    switch (catId) {
      case 'plastik':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'kertas':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'logam':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'kaca':
        return 'bg-sky-50 text-sky-800 border-sky-200';
      case 'minyak_jelantah':
        return 'bg-orange-50 text-orange-800 border-orange-200';
      case 'elektronik':
        return 'bg-violet-50 text-violet-800 border-violet-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-12">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#003B6D] via-[#005596] to-[#00294D] rounded-3xl p-6 sm:p-8 text-white shadow-sm border border-sky-400/30">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-sky-100 border border-white/20">
            <Tag className="w-3.5 h-3.5 text-sky-300" />
            <span>
              {userRole === 'admin'
                ? 'Panel Pengaturan & Penyesuaian Harga Sampah'
                : 'Katalog Estimasi Nilai Tukar Sampah • Gambaran Nasabah'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Katalog Harga Sampah Terkini
          </h1>

          <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed">
            {userRole === 'admin'
              ? 'Kelola nilai satuan per komoditas sampah daur ulang secara fleksibel. Sesuaikan harga dengan pergerakan mitra pengepul dan pabrik daur ulang untuk menjaga keseimbangan operasional bank sampah.'
              : 'Daftar harga di bawah ini merupakan estimasi patokan nilai tabungan per kilogram atau liter. Harga aktual disesuaikan saat penimbangan fisik berdasarkan kebersihan dan kualitas pemilahan sampah Anda.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-sky-200">
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Total {items.length} Jenis Komoditas Terdaftar</span>
            </span>
            <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-xl border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-sky-300" />
              <span>Transparan & Diperbarui Berkala</span>
            </span>
          </div>
        </div>

        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-end pr-8">
          <Coins className="w-64 h-64 text-white" />
        </div>
      </div>

      {/* 2. Admin Quick Control Bar (Khusus Role Admin) */}
      {userRole === 'admin' && (
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-900">
                Mode Pengurus / Admin Aktif
              </h3>
              <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                Anda dapat mengubah harga langsung pada kartu atau tombol penyesuaian (+/- Rp 500), mengedit rincian kualitas, atau menambahkan jenis sampah baru.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tambah Jenis Sampah</span>
            </button>
            <button
              onClick={handleResetToDefault}
              title="Kembalikan semua harga ke konfigurasi awal"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-gray-100 text-gray-700 text-xs font-semibold border border-gray-200 shadow-2xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span className="hidden sm:inline">Reset Standar</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Simulasi & Kalkulator Taksiran Cepat (Untuk Nasabah sebagai gambaran) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-150 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#005596] flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">Simulasi Taksiran Nilai Tabungan Anda</h3>
              <p className="text-[11px] text-gray-500">
                Hitung estimasi rupiah yang akan diperoleh sebelum menyetor sampah ke lokasi bank sampah
              </p>
            </div>
          </div>
          {onNavigateToSetoran && (
            <button
              onClick={onNavigateToSetoran}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#005596] hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Lihat Buku Setoran</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Pick Item */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">Pilih Jenis Sampah:</label>
            <select
              value={calcItemId}
              onChange={(e) => setCalcItemId(e.target.value)}
              className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596]"
            >
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  [{item.kategoriNama}] {item.nama} - {formatRupiah(item.hargaPerSatuan)}/{item.satuan}
                </option>
              ))}
            </select>
          </div>

          {/* Input Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-700">
              Perkiraan Berat / Volume ({selectedCalcItem?.satuan || 'kg'}):
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="0.5"
                value={calcQty || ''}
                onChange={(e) => setCalcQty(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full text-xs font-bold bg-gray-50 border border-gray-200 rounded-xl pl-3 pr-14 py-2.5 text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596]"
                placeholder="Contoh: 5"
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-semibold uppercase">
                {selectedCalcItem?.satuan || 'kg'}
              </span>
            </div>
          </div>

          {/* Calculation Result */}
          <div className="bg-[#F0F7FC] border border-[#BAE6FD] rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-[#005596] font-medium block">
                Estimasi Nilai Tabungan:
              </span>
              <span className="text-lg font-black text-[#003B6D]">
                {formatRupiah(calcEstimatedEarnings)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-gray-500 block">Patokan per {selectedCalcItem?.satuan}:</span>
              <span className="text-xs font-bold text-gray-700">
                {formatRupiah(selectedCalcItem?.hargaPerSatuan || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Filter Bar & Search */}
      <div className="space-y-3">
        {/* Search & Sort Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari jenis sampah (misal: botol PET, kardus, kaleng, tembaga)..."
              className="w-full text-xs pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#005596]/30 focus:border-[#005596] shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-2xs text-xs">
              <Filter className="w-3.5 h-3.5 text-gray-400" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                aria-label="Urutkan katalog sampah"
                className="bg-transparent text-gray-700 font-medium focus:outline-none"
              >
                <option value="kategori">Urutan Kategori</option>
                <option value="harga-desc">Harga Tertinggi</option>
                <option value="harga-asc">Harga Terendah</option>
                <option value="nama">Nama A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count =
              cat.id === 'semua'
                ? items.length
                : items.filter((i) => i.kategoriId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#005596] text-white border-[#005596] shadow-xs'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Items Grid Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-2xs space-y-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-gray-800">Tidak ada jenis sampah yang cocok</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Kata kunci &quot;{searchQuery}&quot; tidak ditemukan. Coba gunakan istilah umum seperti plastik, kertas, atau logam.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('semua');
            }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-700 rounded-xl transition-colors"
          >
            Reset Filter Pencarian
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => {
            const isEditingThis = editingInlineId === item.id;
            const currentInlineVal =
              inlinePriceMap[item.id] !== undefined
                ? inlinePriceMap[item.id]
                : item.hargaPerSatuan;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-2xs flex flex-col justify-between relative group ${
                  !item.bisaDiterima
                    ? 'border-gray-200 opacity-75 bg-gray-50/50'
                    : 'border-gray-150 hover:border-[#005596]/40 hover:shadow-sm'
                }`}
              >
                {/* Card Top: Category badge & Trend status */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadgeClass(
                        item.kategoriId
                      )}`}
                    >
                      {getCategoryIcon(item.kategoriId)}
                      <span>{item.kategoriNama}</span>
                    </span>

                    {/* Trend tag */}
                    <div className="flex items-center gap-1.5">
                      {item.trenHarga === 'naik' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                          <span>Tren Naik</span>
                        </span>
                      )}
                      {item.trenHarga === 'stabil' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                          <Minus className="w-3 h-3 text-blue-500" />
                          <span>Stabil</span>
                        </span>
                      )}
                      {item.trenHarga === 'turun' && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <TrendingDown className="w-3 h-3 text-amber-600" />
                          <span>Fluktuatif</span>
                        </span>
                      )}

                      {!item.bisaDiterima && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Tutup
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Item Name & Code */}
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug">
                      {item.nama}
                    </h3>
                    {item.kodeReferensi && (
                      <span className="text-[10px] font-mono text-gray-400 shrink-0 font-medium">
                        {item.kodeReferensi}
                      </span>
                    )}
                  </div>

                  {/* Quality Note */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-[11px] text-gray-600 space-y-1">
                    <div className="flex items-start gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-gray-700 font-semibold">Syarat Mutu: </strong>
                        {item.kualitas}
                      </span>
                    </div>
                    {item.tips && (
                      <div className="flex items-start gap-1.5 text-gray-500 text-[10.5px]">
                        <Info className="w-3.5 h-3.5 text-[#005596] shrink-0 mt-0.5" />
                        <span className="italic">{item.tips}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Bottom: Price Tag & Actions */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {/* ADMIN VIEW: Editable price controls */}
                  {userRole === 'admin' ? (
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-gray-400 font-medium">
                          Harga Satuan (Admin):
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleToggleAcceptance(item.id)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-colors ${
                              item.bisaDiterima
                                ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Buka / tutup penerimaan jenis sampah ini"
                          >
                            {item.bisaDiterima ? 'Aktif' : 'Nonaktif'}
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 text-gray-400 hover:text-[#005596] hover:bg-[#E0F2FE] rounded-md transition-colors"
                            title="Edit Rincian Lengkap"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Direct input / Quick Delta buttons */}
                      {isEditingThis ? (
                        <div className="flex items-center gap-1.5">
                          <div className="relative flex-1">
                            <span className="absolute left-2.5 top-1.5 text-xs text-gray-400 font-semibold">
                              Rp
                            </span>
                            <input
                              type="number"
                              step="100"
                              value={currentInlineVal}
                              onChange={(e) =>
                                setInlinePriceMap({
                                  ...inlinePriceMap,
                                  [item.id]: parseInt(e.target.value, 10) || 0,
                                })
                              }
                              className="w-full text-xs font-bold pl-8 pr-12 py-1.5 bg-white border border-[#005596] rounded-lg focus:outline-none ring-2 ring-[#005596]/20 text-gray-900"
                              autoFocus
                            />
                            <span className="absolute right-2 top-1.5 text-[10px] text-gray-400 uppercase">
                              /{item.satuan}
                            </span>
                          </div>
                          <button
                            onClick={() => handleSaveInlinePrice(item.id)}
                            className="p-1.5 bg-[#005596] text-white rounded-lg hover:bg-[#003B6D] transition-colors shadow-2xs cursor-pointer"
                            title="Simpan Nilai Baru"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingInlineId(null)}
                            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                            title="Batal"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div
                            onClick={() => {
                              setInlinePriceMap({ ...inlinePriceMap, [item.id]: item.hargaPerSatuan });
                              setEditingInlineId(item.id);
                            }}
                            className="cursor-pointer group/price flex items-baseline gap-1"
                            title="Klik untuk ketik harga baru langsung"
                          >
                            <span className="text-lg font-black text-gray-900 group-hover/price:text-[#005596]">
                              {formatRupiah(item.hargaPerSatuan)}
                            </span>
                            <span className="text-xs text-gray-400 font-normal">
                              /{item.satuan}
                            </span>
                            <Edit3 className="w-3 h-3 text-gray-300 group-hover/price:text-[#005596] ml-1 opacity-0 group-hover/price:opacity-100 transition-opacity" />
                          </div>

                          {/* Quick Increment buttons */}
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleQuickDelta(item.id, -200)}
                              className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                              title="Kurangi Rp 200"
                            >
                              -200
                            </button>
                            <button
                              onClick={() => handleQuickDelta(item.id, +200)}
                              className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-[#E0F2FE] hover:bg-sky-100 text-[#005596] transition-colors cursor-pointer"
                              title="Tambah Rp 200"
                            >
                              +200
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* NASABAH VIEW: Pristine Read-Only price representation */
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">
                          Estimasi Nilai Tukar:
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-[#003B6D]">
                            {formatRupiah(item.hargaPerSatuan)}
                          </span>
                          <span className="text-xs font-semibold text-gray-400">
                            / {item.satuan}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setCalcItemId(item.id);
                          window.scrollTo({ top: 220, behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#E0F2FE] hover:bg-sky-100 text-[#005596] text-xs font-semibold transition-colors cursor-pointer"
                        title="Hitung taksiran berat di kalkulator"
                      >
                        <Calculator className="w-3 h-3" />
                        <span>Simulasi</span>
                      </button>
                    </div>
                  )}

                  {/* Last updated footer label */}
                  <div className="mt-2 text-[10px] text-gray-400 flex items-center justify-between">
                    <span>Diperbarui: {item.terakhirDiperbarui}</span>
                    <span className="text-[#005596] font-medium">Siap Ditimbang</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Edukasi & Standar Pemilahan Sampah Sebelum Disetor */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-2xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">
            Panduan Mutu Sampah Sebelum Dibawa ke Penimbangan
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Ikuti 4 langkah mudah ini agar sampah Anda memenuhi syarat mutu dan dihargai maksimal:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-[#F0F7FC] border border-[#BAE6FD] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#005596] flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h4 className="text-xs font-bold text-gray-900">Kering & Bersih</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Bilas wadah dari sisa minuman atau kecap, lalu tiriskan hingga kering agar tidak berbau dan mengundang lalat.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F7FC] border border-[#BAE6FD] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#005596] flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h4 className="text-xs font-bold text-gray-900">Lepaskan Label & Tutup</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Pisahkan tutup plastik dan kelupas label plastik botol PET. Tutup botol dapat dikumpulkan di kantong terpisah.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F7FC] border border-[#BAE6FD] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#005596] flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h4 className="text-xs font-bold text-gray-900">Pipihkan & Ikat Rapi</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Buka lipatan kardus dan remas botol plastik agar hemat ruang penyimpanan dan memudahkan petugas penimbangan.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F0F7FC] border border-[#BAE6FD] space-y-2">
            <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#005596] flex items-center justify-center font-bold text-xs">
              04
            </div>
            <h4 className="text-xs font-bold text-gray-900">Saring Minyak Jelantah</h4>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              Gunakan saringan teh untuk memisahkan remah makanan dan simpan dalam botol plastik atau jerigen tertutup rapat.
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: Admin Edit Full Item */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#005596]" />
                <h3 className="text-sm font-bold text-gray-900">Edit Data Komoditas Sampah</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nama Komoditas:</label>
                <input
                  type="text"
                  value={editingItem.nama}
                  onChange={(e) => setEditingItem({ ...editingItem, nama: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Harga Satuan (Rp):</label>
                  <input
                    type="number"
                    value={editingItem.hargaPerSatuan}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        hargaPerSatuan: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Satuan Ukuran:</label>
                  <select
                    value={editingItem.satuan}
                    onChange={(e) => setEditingItem({ ...editingItem, satuan: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="liter">Liter (lt)</option>
                    <option value="buah">Buah / Pcs</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tren Harga Pasar:</label>
                  <select
                    value={editingItem.trenHarga}
                    onChange={(e) => setEditingItem({ ...editingItem, trenHarga: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="stabil">Stabil</option>
                    <option value="naik">Tren Naik (Menguntungkan)</option>
                    <option value="turun">Fluktuatif / Turun</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Status Penerimaan:</label>
                  <select
                    value={editingItem.bisaDiterima ? 'true' : 'false'}
                    onChange={(e) => setEditingItem({ ...editingItem, bisaDiterima: e.target.value === 'true' })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="true">Aktif Diterima di Lokasi</option>
                    <option value="false">Ditutup Sementara</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Syarat & Mutu Fisik:</label>
                <textarea
                  rows={2}
                  value={editingItem.kualitas}
                  onChange={(e) => setEditingItem({ ...editingItem, kualitas: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Tips Pemilahan untuk Nasabah:</label>
                <input
                  type="text"
                  value={editingItem.tips}
                  onChange={(e) => setEditingItem({ ...editingItem, tips: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSaveFullEdit}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#005596] hover:bg-[#004077] text-white transition-colors shadow-xs"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Admin Add New Item */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#005596]" />
                <h3 className="text-sm font-bold text-gray-900">Tambah Komoditas Sampah Baru</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nama Komoditas:</label>
                <input
                  type="text"
                  placeholder="Contoh: Tutup Galon Air Bersih"
                  value={newItemData.nama || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, nama: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Kategori:</label>
                  <select
                    value={newItemData.kategoriId}
                    onChange={(e) => setNewItemData({ ...newItemData, kategoriId: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="plastik">Plastik & Kemasan</option>
                    <option value="kertas">Kertas & Karton</option>
                    <option value="logam">Logam & Kaleng</option>
                    <option value="kaca">Kaca & Beling</option>
                    <option value="minyak_jelantah">Minyak Jelantah</option>
                    <option value="elektronik">Elektronik (E-Waste)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Harga Satuan (Rp):</label>
                  <input
                    type="number"
                    step="100"
                    placeholder="Contoh: 3500"
                    value={newItemData.hargaPerSatuan || ''}
                    onChange={(e) =>
                      setNewItemData({
                        ...newItemData,
                        hargaPerSatuan: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Satuan Ukuran:</label>
                  <select
                    value={newItemData.satuan}
                    onChange={(e) => setNewItemData({ ...newItemData, satuan: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="liter">Liter (lt)</option>
                    <option value="buah">Buah / Pcs</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Tren Harga:</label>
                  <select
                    value={newItemData.trenHarga}
                    onChange={(e) => setNewItemData({ ...newItemData, trenHarga: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                  >
                    <option value="stabil">Stabil</option>
                    <option value="naik">Tren Naik</option>
                    <option value="turun">Fluktuatif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Syarat & Mutu Fisik:</label>
                <input
                  type="text"
                  placeholder="Contoh: Bersih, kering, tidak berjamur"
                  value={newItemData.kualitas || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, kualitas: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">Tips Pemilahan:</label>
                <input
                  type="text"
                  placeholder="Contoh: Kumpulkan dalam wadah kering tersendiri"
                  value={newItemData.tips || ''}
                  onChange={(e) => setNewItemData({ ...newItemData, tips: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#005596]/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleAddNewItem}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#005596] hover:bg-[#004077] text-white transition-colors shadow-xs"
              >
                Tambahkan ke Katalog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toastMessage && (
        <div
          id="toast-katalog"
          className="fixed bottom-6 right-6 z-50 bg-[#005596] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-200 border border-sky-400/30 text-xs font-semibold"
        >
          <CheckCircle2 className="w-4 h-4 text-sky-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
