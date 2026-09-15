'use client';

import React, { useState } from 'react';
import {
  SetoranRecord,
  formatRupiah,
  formatDateIndo,
  WASTE_CATEGORIES,
} from '@/lib/bankSampahData';
import {
  Search,
  Receipt,
  FileSpreadsheet,
  CheckCircle2,
  Calendar,
  Filter,
  ArrowUpDown,
  ChevronRight,
  Printer,
} from 'lucide-react';

interface SetoranHistoryProps {
  records: SetoranRecord[];
  selectedCategoryFilter: string | null;
  onClearCategoryFilter: () => void;
  onViewReceipt: (record: SetoranRecord) => void;
}

export const SetoranHistory: React.FC<SetoranHistoryProps> = ({
  records,
  selectedCategoryFilter,
  onClearCategoryFilter,
  onViewReceipt,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | '3months' | 'year'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Filter logic
  const filteredRecords = records.filter((rec) => {
    // 1. Time filter
    if (timeFilter === 'month') {
      // anggap bulan terbaru di sample data adalah 2024-09
      if (!rec.tanggal.startsWith('2024-09')) return false;
    } else if (timeFilter === '3months') {
      const isRecent =
        rec.tanggal.startsWith('2024-09') ||
        rec.tanggal.startsWith('2024-08') ||
        rec.tanggal.startsWith('2024-07');
      if (!isRecent) return false;
    } else if (timeFilter === 'year') {
      if (!rec.tanggal.startsWith('2024')) return false;
    }

    // 2. Category filter
    if (selectedCategoryFilter) {
      const hasCategory = rec.items.some(
        (item) => item.kategoriId === selectedCategoryFilter
      );
      if (!hasCategory) return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchId = rec.id.toLowerCase().includes(query);
      const matchDate = rec.tanggal.toLowerCase().includes(query);
      const matchPetugas = rec.petugas.toLowerCase().includes(query);
      const matchItem = rec.items.some((item) =>
        item.jenisDetail.toLowerCase().includes(query)
      );
      if (!matchId && !matchDate && !matchPetugas && !matchItem) return false;
    }

    return true;
  });

  // Sort
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (sortOrder === 'desc') {
      return b.tanggal.localeCompare(a.tanggal);
    }
    return a.tanggal.localeCompare(b.tanggal);
  });

  // CSV Export
  const exportToCSV = () => {
    const headers = [
      'No Bukti',
      'Tanggal',
      'Jam',
      'Petugas',
      'Total Berat (kg/L)',
      'Total Nilai (Rp)',
      'Status',
      'Rincian Item',
    ];
    const rows = sortedRecords.map((r) => [
      r.id,
      r.tanggal,
      r.jam,
      `"${r.petugas}"`,
      r.totalBerat,
      r.totalNilai,
      r.status,
      `"${r.items.map((i) => `${i.jenisDetail} (${i.berat}${i.satuan})`).join('; ')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rekam-jejak-setoran-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintAll = () => {
    window.print();
  };

  return (
    <div
      id="setoran-history-section"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
              Buku Tabungan
            </span>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 tracking-tight">
              Rekam Jejak Setoran Sampah
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
              {sortedRecords.length} transaksi
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Buku tabungan digital: riwayat penimbangan, rincian per kategori, dan perolehan saldo
          </p>
        </div>

        {/* Action buttons (Export CSV & Print) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            title="Unduh data dalam format CSV untuk Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#005596]" />
            <span>Unduh CSV</span>
          </button>
          <button
            type="button"
            onClick={handlePrintAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors cursor-pointer"
            title="Cetak buku tabungan ini"
          >
            <Printer className="w-3.5 h-3.5 text-gray-600" />
            <span>Cetak Rekap</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 py-4">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-setoran-input"
            type="text"
            placeholder="Cari no nota, jenis sampah (misal: botol, kardus)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
          />
        </div>

        {/* Time Filter Buttons */}
        <div className="sm:col-span-4 flex items-center bg-gray-100 p-1 rounded-xl text-xs font-medium text-gray-600">
          <button
            type="button"
            onClick={() => setTimeFilter('all')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
              timeFilter === 'all'
                ? 'bg-white text-[#005596] font-bold shadow-xs'
                : 'hover:text-gray-900'
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('month')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
              timeFilter === 'month'
                ? 'bg-white text-[#005596] font-bold shadow-xs'
                : 'hover:text-gray-900'
            }`}
          >
            Bulan Ini
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('3months')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
              timeFilter === '3months'
                ? 'bg-white text-[#005596] font-bold shadow-xs'
                : 'hover:text-gray-900'
            }`}
          >
            3 Bulan
          </button>
          <button
            type="button"
            onClick={() => setTimeFilter('year')}
            className={`flex-1 py-1.5 text-center rounded-lg transition-colors cursor-pointer ${
              timeFilter === 'year'
                ? 'bg-white text-[#005596] font-bold shadow-xs'
                : 'hover:text-gray-900'
            }`}
          >
            2024
          </button>
        </div>

        {/* Sort Order Toggle */}
        <div className="sm:col-span-2 flex justify-end">
          <button
            type="button"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-medium bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-500" />
            <span>{sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}</span>
          </button>
        </div>
      </div>

      {/* Active Category Indicator if any */}
      {selectedCategoryFilter && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-sky-50 border border-sky-100 rounded-xl text-xs text-[#003B6D]">
          <Filter className="w-3.5 h-3.5 text-[#005596]" />
          <span>
            Menampilkan transaksi dengan jenis:{' '}
            <strong>
              {WASTE_CATEGORIES[selectedCategoryFilter]?.nama || selectedCategoryFilter}
            </strong>
          </span>
          <button
            type="button"
            onClick={onClearCategoryFilter}
            className="ml-auto underline font-semibold text-[#005596] hover:text-[#003B6D] cursor-pointer"
          >
            Hapus Filter
          </button>
        </div>
      )}

      {/* Records List */}
      {sortedRecords.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50">
          <Calendar className="w-10 h-10 mx-auto text-gray-300 mb-2" />
          <p className="font-semibold text-gray-700 text-sm">Tidak ada riwayat setoran</p>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            Tidak ditemukan catatan transaksi yang cocok dengan kriteria pencarian atau filter yang dipilih.
          </p>
          {(searchQuery || selectedCategoryFilter || timeFilter !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTimeFilter('all');
                onClearCategoryFilter();
              }}
              className="mt-3 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-[#005596] hover:bg-gray-50 cursor-pointer"
            >
              Reset Semua Filter
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {sortedRecords.map((record) => (
            <div
              key={record.id}
              id={`record-row-${record.id}`}
              className="rounded-2xl border border-gray-100 hover:border-gray-200 bg-white p-5 transition-all duration-150 shadow-xs"
            >
              {/* Top Row: Tanggal, ID, Status, & Nilai */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-gray-100">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-900 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{formatDateIndo(record.tanggal)}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-gray-500 font-normal">{record.jam}</span>
                  </div>

                  <span className="font-mono text-xs text-gray-400 font-medium">
                    {record.id}
                  </span>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-[#005596] border border-sky-100">
                    <CheckCircle2 className="w-3 h-3 text-[#005596]" />
                    {record.status}
                  </span>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <div className="text-right">
                    <div className="text-base sm:text-lg font-bold text-[#005596]">
                      +{formatRupiah(record.totalNilai)}
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium">
                      Masuk Saldo Tabungan
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewReceipt(record)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors cursor-pointer"
                    title="Lihat struk resmi setoran"
                  >
                    <Receipt className="w-3.5 h-3.5 text-gray-500" />
                    <span>Struk</span>
                  </button>
                </div>
              </div>

              {/* Items Breakdown Pills */}
              <div className="pt-3">
                <div className="text-[11px] font-medium text-gray-400 mb-2">
                  Rincian Penimbangan ({record.totalBerat.toFixed(1)} kg total):
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {record.items.map((item, idx) => {
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 border border-gray-100 text-xs"
                      >
                        <div className="space-y-0.5 pr-2">
                          <div className="font-semibold text-gray-800 line-clamp-1">
                            {item.jenisDetail}
                          </div>
                          <div className="text-[11px] text-gray-400">
                            {item.berat} {item.satuan} × {formatRupiah(item.hargaPerSatuan)}/{item.satuan}
                          </div>
                        </div>
                        <div className="font-bold text-gray-900 flex-shrink-0">
                          {formatRupiah(item.subtotal)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Catatan / Petugas Info */}
                <div className="mt-2.5 flex flex-wrap items-center justify-between text-[11px] text-gray-400">
                  <span>Petugas: {record.petugas} ({record.lokasi})</span>
                  {record.catatan && (
                    <span className="italic text-gray-500">Catatan: &ldquo;{record.catatan}&rdquo;</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
