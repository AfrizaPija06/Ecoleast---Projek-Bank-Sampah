'use client';

import React from 'react';
import { formatRupiah, WasteCategory } from '@/lib/bankSampahData';
import { Package, FileText, Cpu, Wine, Droplets, Zap, Filter, Check } from 'lucide-react';

interface CategoryBreakdownProps {
  breakdown: Record<
    string,
    {
      kategori: WasteCategory;
      berat: number;
      nilai: number;
      persenBerat: number;
    }
  >;
  selectedCategoryFilter: string | null;
  onSelectCategoryFilter: (categoryId: string | null) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  breakdown,
  selectedCategoryFilter,
  onSelectCategoryFilter,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Package':
        return <Package className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'Cpu':
        return <Cpu className="w-4 h-4" />;
      case 'Wine':
        return <Wine className="w-4 h-4" />;
      case 'Droplets':
        return <Droplets className="w-4 h-4" />;
      case 'Zap':
        return <Zap className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const categories = Object.values(breakdown);
  const totalWeight = categories.reduce((sum, item) => sum + item.berat, 0);

  return (
    <div
      id="category-breakdown-card"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">
            Komposisi Sampah
          </span>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">
            Distribusi Jenis Sampah Disetor
          </h3>
          <p className="text-xs text-gray-500">
            Pilah dan ketahui proporsi sampah yang telah Anda kumpulkan
          </p>
        </div>

        {selectedCategoryFilter && (
          <button
            type="button"
            onClick={() => onSelectCategoryFilter(null)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#005596] hover:bg-sky-100 border border-sky-200 transition-colors cursor-pointer"
          >
            <Filter className="w-3 h-3" />
            <span>Hapus Filter ({selectedCategoryFilter})</span>
          </button>
        )}
      </div>

      {/* Multi-segmented visual bar (Clean minimal 1.5 height) */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex mb-6">
        {categories.map((catItem) => {
          if (catItem.berat <= 0) return null;
          return (
            <div
              key={catItem.kategori.id}
              className={`${catItem.kategori.colorBar} transition-all duration-300 relative group`}
              style={{ width: `${Math.max(1, catItem.persenBerat)}%` }}
              title={`${catItem.kategori.nama}: ${catItem.berat.toFixed(1)} ${catItem.kategori.satuan} (${catItem.persenBerat.toFixed(1)}%)`}
            />
          );
        })}
      </div>

      {/* Cards Grid per Kategori */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((item) => {
          const isSelected = selectedCategoryFilter === item.kategori.id;
          return (
            <button
              key={item.kategori.id}
              type="button"
              onClick={() => {
                if (isSelected) {
                  onSelectCategoryFilter(null);
                } else {
                  onSelectCategoryFilter(item.kategori.id);
                }
              }}
              className={`p-3.5 rounded-2xl text-left border transition-all relative cursor-pointer ${
                isSelected
                  ? 'border-[#005596] ring-2 ring-sky-400/20 bg-sky-50/60'
                  : 'border-gray-100 hover:border-gray-200 bg-white hover:bg-gray-50/60 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${item.kategori.colorBg} ${item.kategori.colorText}`}
                >
                  {getIcon(item.kategori.iconName)}
                </div>
                {isSelected && (
                  <span className="w-4 h-4 rounded-full bg-[#005596] text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>

              <div className="font-semibold text-xs text-gray-800 line-clamp-1">
                {item.kategori.nama}
              </div>

              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-gray-900">
                  {item.berat.toFixed(1)}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  {item.kategori.satuan}
                </span>
              </div>

              <div className="flex items-center justify-between mt-1 text-[11px] text-gray-400">
                <span>{item.persenBerat.toFixed(0)}%</span>
                <span className="font-medium text-[#005596]">
                  {formatRupiah(item.nilai)}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-gray-400 mt-4 text-right">
        *Klik salah satu jenis sampah di atas untuk memfilter riwayat setoran di bawah
      </p>
    </div>
  );
};
