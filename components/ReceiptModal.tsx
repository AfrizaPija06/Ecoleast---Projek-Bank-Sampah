'use client';

import React from 'react';
import {
  SetoranRecord,
  Nasabah,
  formatRupiah,
  formatDateIndo,
  WASTE_CATEGORIES,
} from '@/lib/bankSampahData';
import { Printer, X, CheckCircle, Recycle, MapPin } from 'lucide-react';

interface ReceiptModalProps {
  record: SetoranRecord | null;
  nasabah: Nasabah;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  record,
  nasabah,
  onClose,
}) => {
  if (!record) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      id="receipt-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="receipt-modal-content"
        className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative animate-scaleUp my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Action Header (not printed in physical print) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#F0F7FC] border-b border-[#D0E5F5] print:hidden">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#005596] uppercase tracking-wider">
              Bukti Setoran Sampah Digital
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#005596] hover:bg-[#004275] text-white transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Slip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Authentic Receipt Body */}
        <div className="p-6 sm:p-8 font-sans text-gray-900 space-y-4">
          {/* Slip Header */}
          <div className="text-center pb-4 border-b-2 border-dashed border-gray-200">
            <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 border border-sky-200 text-[#005596] flex items-center justify-center mb-2">
              <Recycle className="w-6 h-6 text-[#005596]" />
            </div>
            <h4 className="text-lg font-bold tracking-tight text-gray-900">
              Bank Sampah Unit Desa Cicadas
            </h4>
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-0.5 font-medium">
              <MapPin className="w-3 h-3 text-[#00A3E0]" />
              {nasabah.unitBankSampah || 'Unit Sukamaju • RT 03 / RW 05'}
            </p>
          </div>

          {/* Transaction & Nasabah Info */}
          <div className="text-xs space-y-1.5 py-1 text-gray-600">
            <div className="flex justify-between">
              <span className="text-gray-400">No. Transaksi:</span>
              <span className="font-mono font-bold text-gray-900">{record.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tanggal / Waktu:</span>
              <span className="font-medium text-gray-900">
                {formatDateIndo(record.tanggal)}, {record.jam}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">ID Nasabah:</span>
              <span className="font-mono font-semibold text-gray-900">{nasabah.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Nama Nasabah:</span>
              <span className="font-bold text-gray-900">{nasabah.nama}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Petugas Timbang:</span>
              <span className="text-gray-900">{record.petugas}</span>
            </div>
          </div>

          {/* Table Items */}
          <div className="pt-2">
            <div className="text-xs font-semibold text-gray-400 pb-1.5 border-b border-gray-100 flex justify-between uppercase tracking-wider">
              <span>Rincian Barang</span>
              <span>Jumlah</span>
            </div>

            <div className="divide-y divide-gray-100 py-1 text-xs">
              {record.items.map((item, idx) => (
                <div key={idx} className="py-2 flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{item.jenisDetail}</div>
                    <div className="text-[11px] text-gray-400">
                      {item.berat} {item.satuan} × {formatRupiah(item.hargaPerSatuan)}/{item.satuan}
                    </div>
                  </div>
                  <div className="font-bold text-gray-900">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="pt-3 border-t-2 border-dashed border-gray-200 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Total Bobot Sampah:</span>
              <span className="font-bold text-gray-900">{record.totalBerat.toFixed(1)} kg/liter</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-100">
              <span>Total Masuk Saldo:</span>
              <span className="text-[#005596]">{formatRupiah(record.totalNilai)}</span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-400">
              <span>Metode:</span>
              <span className="font-medium text-gray-600">Masuk Buku Tabungan Nasabah</span>
            </div>
          </div>

          {/* Stamp & Verification */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            <div className="text-center">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-8">
                Nasabah
              </div>
              <div className="text-xs font-semibold text-gray-800 border-t border-gray-200 pt-1 px-2">
                {nasabah.nama}
              </div>
            </div>

            {/* Verification Stamp Badge */}
            <div className="border border-[#005596] rounded-xl px-3 py-1.5 text-center transform -rotate-2 bg-sky-50/80">
              <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-[#005596] tracking-wider uppercase">
                <CheckCircle className="w-3 h-3 text-[#005596]" />
                LUNAS & VALID
              </div>
              <div className="text-[9px] text-[#005596] font-mono">
                {record.tanggal}
              </div>
            </div>

            <div className="text-center">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-8">
                Petugas Pos Timbang
              </div>
              <div className="text-xs font-semibold text-gray-800 border-t border-gray-200 pt-1 px-2">
                {record.petugas.split(' ')[0]}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-2 text-[11px] text-gray-400">
            Terima kasih telah berkontribusi menjaga kelestarian lingkungan!
            <br />
            Simpan slip ini sebagai bukti sah transaksi Bank Sampah.
          </div>
        </div>
      </div>
    </div>
  );
};
