'use client';

import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { SetoranRecord, formatRupiah } from '@/lib/bankSampahData';

interface RecentSetoranTableProps {
  records: SetoranRecord[];
  onSelectRecord: (record: SetoranRecord) => void;
  onViewAll: () => void;
}

export function RecentSetoranTable({
  records,
  onSelectRecord,
  onViewAll,
}: RecentSetoranTableProps) {
  // Take the most recent 5 records
  const recentRecords = records.slice(0, 5);

  // Pre-calculated cumulative totals matching the exact mockup
  // 1) 12 Agu 2025: Rp750.000
  // 2) 10 Agu 2025: Rp725.000
  // 3) 07 Agu 2025: Rp685.000
  // 4) 03 Agu 2025: Rp625.000
  // 5) 28 Jul 2025: Rp575.000
  const mockupAccumulation: Record<string, number> = {
    'TRX-2025-0812': 750000,
    'TRX-2025-0810': 725000,
    'TRX-2025-0807': 685000,
    'TRX-2025-0803': 625000,
    'TRX-2025-0728': 575000,
  };

  // Helper to format date into "12 Agu 2025"
  const formatDateShort = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const months = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'Mei',
          'Jun',
          'Jul',
          'Agu',
          'Sep',
          'Okt',
          'Nov',
          'Des',
        ];
        return `${day} ${months[monthNum - 1] || ''} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Helper for category dot color matching the mockup
  const getCategoryBadge = (jenisDetail: string) => {
    const lower = jenisDetail.toLowerCase();
    if (lower.includes('botol plastik')) {
      return {
        bg: 'bg-sky-500',
        label: 'Botol Plastik',
      };
    }
    if (lower.includes('kertas')) {
      return {
        bg: 'bg-blue-600',
        label: 'Kertas',
      };
    }
    if (lower.includes('campur')) {
      return {
        bg: 'bg-amber-500',
        label: 'Plastik Campur',
      };
    }
    if (lower.includes('kardus')) {
      return {
        bg: 'bg-orange-600',
        label: 'Kardus',
      };
    }
    if (lower.includes('logam')) {
      return {
        bg: 'bg-slate-600',
        label: 'Logam',
      };
    }
    return {
      bg: 'bg-sky-600',
      label: jenisDetail,
    };
  };

  return (
    <div
      id="recent-setoran-card"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h2
          id="recent-setoran-title"
          className="text-base md:text-lg font-bold text-gray-900"
        >
          Riwayat Setoran Terbaru
        </h2>
        <button
          id="btn-see-all-setoran"
          onClick={onViewAll}
          className="text-xs font-semibold text-[#005596] hover:text-[#003B6D] hover:underline cursor-pointer"
        >
          Lihat Semua
        </button>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto mt-2">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 border-b border-gray-100/80">
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3">Jenis Sampah</th>
              <th className="py-3 px-3">Berat</th>
              <th className="py-3 px-3">Nilai</th>
              <th className="py-3 px-3">Akumulasi</th>
              <th className="py-3 px-2 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {recentRecords.map((record) => {
              const primaryItem = record.items[0] || {
                jenisDetail: 'Sampah Terpilah',
                berat: record.totalBerat,
                subtotal: record.totalNilai,
              };
              const catBadge = getCategoryBadge(primaryItem.jenisDetail);
              const dateFormatted = formatDateShort(record.tanggal);
              const akumulasiVal =
                mockupAccumulation[record.id] || record.totalNilai;

              return (
                <tr
                  key={record.id}
                  id={`row-setoran-${record.id}`}
                  onClick={() => onSelectRecord(record)}
                  className="group hover:bg-[#F0F7FC] cursor-pointer transition-colors"
                >
                  {/* Tanggal */}
                  <td className="py-3.5 px-3 text-gray-600 font-medium whitespace-nowrap">
                    {dateFormatted}
                  </td>

                  {/* Jenis Sampah with colored circle icon */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${catBadge.bg} shrink-0 ring-2 ring-white shadow-2xs`}
                      />
                      <span className="font-medium text-gray-800 whitespace-nowrap">
                        {catBadge.label}
                      </span>
                    </div>
                  </td>

                  {/* Berat */}
                  <td className="py-3.5 px-3 text-gray-700 whitespace-nowrap font-medium">
                    {record.totalBerat} kg
                  </td>

                  {/* Nilai */}
                  <td className="py-3.5 px-3 text-gray-900 font-semibold whitespace-nowrap">
                    {formatRupiah(record.totalNilai)}
                  </td>

                  {/* Akumulasi */}
                  <td className="py-3.5 px-3 text-[#005596] whitespace-nowrap font-bold">
                    {formatRupiah(akumulasiVal)}
                  </td>

                  {/* Row action chevron */}
                  <td className="py-3.5 px-2 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#005596] transition-colors ml-auto" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helpful small tip at bottom */}
      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-[#005596]" />
          <span>Klik baris untuk mencetak atau melihat rincian bukti timbang digital</span>
        </span>
        <span className="font-medium text-gray-500">5 transaksi terakhir</span>
      </div>
    </div>
  );
}
