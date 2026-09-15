'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  Package,
  Leaf,
  Calendar,
  Phone,
  MapPin,
  LogOut,
  Clock,
  CheckCircle2,
  FileText,
  ChevronRight,
  Sparkles,
  Info,
  Building2,
  ArrowDownRight,
  TrendingUp,
  Tag,
  BookOpen,
  Search,
  Eye,
  Pin,
  Newspaper,
} from 'lucide-react';
import {
  Nasabah,
  SetoranRecord,
  formatRupiah,
  formatDateIndo,
  WASTE_CATEGORIES,
  calculateImpact,
} from '@/lib/bankSampahData';
import { AuthSession } from '@/lib/auth';
import {
  EducationArticle,
  getStoredArticles,
  ARTICLE_CATEGORIES,
} from '@/lib/articlesData';
import { ArticleReaderModal } from '@/components/ArticleReaderModal';

interface NasabahPortalDesktopProps {
  session: AuthSession;
  activeNasabah: Nasabah;
  nasabahRecords: SetoranRecord[];
  totalSaldoAktif: number;
  onSelectRecord: (record: SetoranRecord) => void;
  onLogout: () => void;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  hideHeader?: boolean;
}

export function NasabahPortalDesktop({
  session,
  activeNasabah,
  nasabahRecords,
  totalSaldoAktif,
  onSelectRecord,
  onLogout,
  activeTab: propActiveTab,
  onSelectTab,
  hideHeader = false,
}: NasabahPortalDesktopProps) {
  const [internalActiveTab, setInternalActiveTab] = useState<'ringkasan' | 'riwayat' | 'edukasi' | 'katalog' | 'jadwal' | 'profil'>('ringkasan');
  const activeTab = (propActiveTab as any) || internalActiveTab;
  const setActiveTab = (tab: any) => {
    if (onSelectTab) onSelectTab(tab);
    setInternalActiveTab(tab);
  };

  const [articles, setArticles] = useState<EducationArticle[]>(() => getStoredArticles());
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(null);
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [articleCategoryFilter, setArticleCategoryFilter] = useState('Semua');

  const impact = calculateImpact(nasabahRecords);

  const totalKgAll = nasabahRecords.reduce((sum, r) => sum + r.totalBerat, 0);
  const totalRupiahEarned = nasabahRecords.reduce((sum, r) => sum + r.totalNilai, 0);

  // Published articles for nasabah
  const publishedArticles = articles.filter((a) => a.isPublished);
  const pinnedArticle = publishedArticles.find((a) => a.isPinned);

  const filteredArticles = publishedArticles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(articleSearchQuery.toLowerCase())));
    const matchCat = articleCategoryFilter === 'Semua' || art.category === articleCategoryFilter;
    return matchSearch && matchCat;
  });

  const content = (
    <>
      {/* ================= TAB 1: RINGKASAN & BUKU TABUNGAN ================= */}
        {activeTab === 'ringkasan' && (
          <div className="space-y-6">
            {/* Welcome Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#005596] via-[#004780] to-[#0070BA] text-white p-7 shadow-lg shadow-[#005596]/15">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Selamat Datang di Portal Warga</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                    Halo, {activeNasabah.nama} 👋
                  </h1>
                  <p className="text-xs text-sky-100 leading-relaxed">
                    Terima kasih telah aktif memilah sampah dari rumah tangga. Setiap kilogram sampah yang Anda setorkan langsung menjadi saldo tabungan dan mengurangi beban emisi karbon lingkungan.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-sky-100">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-sky-200" />
                      {activeNasabah.unitBankSampah}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-sky-200" />
                      {activeNasabah.alamat}
                    </span>
                  </div>
                </div>

                {/* Profile Avatar Card in Banner */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white text-[#005596] flex items-center justify-center font-black text-xl shadow-md overflow-hidden">
                    {activeNasabah.avatarUrl ? (
                      <img
                        src={activeNasabah.avatarUrl}
                        alt={activeNasabah.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      activeNasabah.avatarInitials
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-sky-200 uppercase tracking-wider font-semibold">
                      Tingkat Keaktifan
                    </div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
                      <span>{activeNasabah.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eco Leaves background decoration */}
              <div className="pointer-events-none absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                <Leaf className="w-full h-full text-white" />
              </div>
            </div>

            {/* 3 Core Financial & Environmental Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Saldo Aktif */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-3 relative overflow-hidden group hover:border-[#005596]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Saldo Tabungan Saya
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">
                    {formatRupiah(totalSaldoAktif)}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Total tabungan yang telah dihasilkan: {formatRupiah(totalRupiahEarned)}
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Pernah dicairkan:</span>
                  <span className="font-semibold text-gray-800">{formatRupiah(activeNasabah.saldoTarik)}</span>
                </div>
              </div>

              {/* Card 2: Total Sampah */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-3 relative overflow-hidden group hover:border-[#005596]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Total Sampah Terpilah
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#005596] flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">
                    {totalKgAll.toFixed(1)} <span className="text-base font-bold text-gray-500">kg</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Dari akumulasi {nasabahRecords.length} kali penyerahan setoran
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Target Bulanan:</span>
                  <span className="font-semibold text-gray-800">{activeNasabah.targetBulananKg} kg</span>
                </div>
              </div>

              {/* Card 3: Reduksi Emisi CO2 */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-3 relative overflow-hidden group hover:border-[#005596]/30 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Reduksi Karbon (CO₂e)
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#00A3E0] flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-gray-900 tracking-tight">
                    {impact.co2eKg} <span className="text-base font-bold text-gray-500">kg CO₂e</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Setara mencegah emisi motor bensin sejauh {impact.equivalentMotorKm} km
                  </p>
                </div>
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Pohon terselamatkan:</span>
                  <span className="font-semibold text-[#005596]">~{impact.treesSaved} pohon</span>
                </div>
              </div>
            </div>

            {/* Recent 3 Deposits & Digital Passbook Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Transaksi Terkini */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Setoran Sampah Terakhir Saya
                    </h3>
                    <p className="text-xs text-gray-500">
                      Klik salah satu setoran untuk melihat atau mencetak Struk Digital resmi.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('riwayat')}
                    className="text-xs text-[#005596] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Semua</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {nasabahRecords.slice(0, 4).map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => onSelectRecord(rec)}
                      className="p-4 rounded-xl border border-gray-100 hover:border-[#005596]/40 bg-gray-50/50 hover:bg-sky-50/20 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 text-[#005596] flex items-center justify-center font-bold shadow-2xs group-hover:bg-[#005596] group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-900">
                              {rec.id}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-[#005596] font-semibold">
                              {rec.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                            <span>{formatDateIndo(rec.tanggal)}</span>
                            <span>•</span>
                            <span>{rec.jam}</span>
                            <span>•</span>
                            <span className="text-gray-700 font-medium">Petugas: {rec.petugas}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-bold text-[#005596]">
                          +{formatRupiah(rec.totalNilai)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {rec.totalBerat} kg
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Info & Panduan Warga */}
              <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Info className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Cara Menyetor Sampah ke Pos
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#005596] shrink-0 mt-0.5" />
                      <span>Pastikan sampah plastik bersih dari sisa cairan & kering.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#005596] shrink-0 mt-0.5" />
                      <span>Kardus dan kertas diikat rapi agar mudah ditimbang.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#005596] shrink-0 mt-0.5" />
                      <span>Bawa buku tabungan atau sebutkan ID Nasabah Anda: <strong>{activeNasabah.id}</strong>.</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-100 text-xs text-[#003B6D] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#005596]" />
                    <span>Jadwal Penimbangan Berikutnya:</span>
                  </div>
                  <p className="text-[11px] text-[#005596]">
                    Setiap hari Minggu, Pukul 08:00 - 11:30 WIB di Pos Balai Warga RW 05.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RIWAYAT SETORAN LENGKAP ================= */}
        {activeTab === 'riwayat' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Daftar Transaksi Setoran ({activeNasabah.nama})
                </h2>
                <p className="text-xs text-gray-500">
                  Seluruh catatan penimbangan sampah terpilah yang telah diverifikasi oleh petugas bank sampah.
                </p>
              </div>
              <div className="text-xs font-medium text-gray-500 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                Total Riwayat: <strong className="text-gray-900">{nasabahRecords.length} Transaksi</strong>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50/80 text-gray-500 font-bold border-b border-gray-100">
                    <th className="py-3 px-4 rounded-l-xl">No. Transaksi</th>
                    <th className="py-3 px-4">Waktu</th>
                    <th className="py-3 px-4">Rincian Sampah</th>
                    <th className="py-3 px-4">Berat (kg)</th>
                    <th className="py-3 px-4">Nilai Rupiah</th>
                    <th className="py-3 px-4">Petugas</th>
                    <th className="py-3 px-4 text-center rounded-r-xl">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {nasabahRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-900">
                        {rec.id}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600">
                        <div>{formatDateIndo(rec.tanggal)}</div>
                        <div className="text-[10px] text-gray-400">{rec.jam}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {rec.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="inline-block px-2 py-0.5 rounded-md bg-sky-50 text-[#005596] font-medium text-[11px] border border-sky-100"
                            >
                              {item.jenisDetail} ({item.berat} {item.satuan})
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-800">
                        {rec.totalBerat} kg
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#005596]">
                        {formatRupiah(rec.totalNilai)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {rec.petugas}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => onSelectRecord(rec)}
                          className="px-3 py-1.5 bg-[#005596] hover:bg-[#003B6D] text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Lihat Struk</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: EDUKASI & INFO WARGA ================= */}
        {activeTab === 'edukasi' && (
          <div className="space-y-6">
            {/* Header / Filter Toolbar */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#005596]" />
                    <span>Pusat Edukasi & Kabar Warga</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Informasi resmi, tips pemilahan sampah, dan pengumuman kegiatan yang diterbitkan oleh Pengurus Bank Sampah.
                  </p>
                </div>

                {/* Search box */}
                <div className="relative w-full md:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari artikel / tips..."
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-[#005596] transition-all"
                  />
                </div>
              </div>

              {/* Category pills */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-50">
                <span className="text-xs text-gray-400 font-semibold mr-1">Kategori:</span>
                {['Semua', ...ARTICLE_CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setArticleCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      articleCategoryFilter === cat
                        ? 'bg-[#005596] text-white shadow-2xs'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Pinned Featured Article Banner if available and not searching */}
            {pinnedArticle && !articleSearchQuery && articleCategoryFilter === 'Semua' && (
              <div
                onClick={() => setSelectedArticle(pinnedArticle)}
                className="bg-gradient-to-br from-[#005596] via-[#004780] to-[#003B6D] text-white rounded-3xl p-6 sm:p-7 shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden group"
              >
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-gray-950 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-current" />
                        Pengumuman Utama
                      </span>
                      <span className="text-xs text-sky-200 font-medium">
                        {pinnedArticle.category} • {pinnedArticle.publishedAt}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white group-hover:text-sky-200 transition-colors">
                      {pinnedArticle.title}
                    </h3>
                    <p className="text-xs text-sky-100/90 line-clamp-2 leading-relaxed">
                      {pinnedArticle.summary}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-[#005596] rounded-xl text-xs font-bold shadow-xs">
                        <span>Baca Selengkapnya</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-[11px] text-sky-200/80">
                        {pinnedArticle.readTimeMinutes} menit baca • Oleh {pinnedArticle.author}
                      </span>
                    </div>
                  </div>

                  {pinnedArticle.coverImage && (
                    <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-white/10">
                      <img
                        src={pinnedArticle.coverImage}
                        alt={pinnedArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Articles Grid */}
            {filteredArticles.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs space-y-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-base">Tidak ada artikel ditemukan</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Coba ubah kata kunci pencarian atau pilih kategori lain.
                </p>
                <button
                  onClick={() => {
                    setArticleSearchQuery('');
                    setArticleCategoryFilter('Semua');
                  }}
                  className="px-4 py-2 bg-[#005596] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => setSelectedArticle(art)}
                    className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md hover:border-[#005596]/30 transition-all flex flex-col cursor-pointer group"
                  >
                    {/* Cover Thumbnail */}
                    <div className="h-44 bg-gray-100 relative overflow-hidden">
                      {art.coverImage ? (
                        <img
                          src={art.coverImage}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#005596]/10 to-[#005596]/30 flex items-center justify-center text-[#005596]">
                          <BookOpen className="w-10 h-10 stroke-1" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[10px] font-bold">
                          {art.category}
                        </span>
                        {art.isPinned && (
                          <span className="p-1 rounded-lg bg-amber-500 text-white" title="Disematkan">
                            <Pin className="w-3 h-3 fill-current" />
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white text-[10px]">
                        {art.readTimeMinutes} menit baca
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        <div className="text-[11px] text-gray-400">
                          {art.publishedAt} • Oleh {art.author}
                        </div>
                        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-[#005596] transition-colors">
                          {art.title}
                        </h3>
                        <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>

                      {/* Footer tags / button */}
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="flex flex-wrap gap-1">
                          {art.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-[#005596] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          <span>Baca</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 4: KATALOG HARGA SAMPAH ================= */}
        {activeTab === 'katalog' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-5">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Katalog Harga Sampah Terpilah (Harga Beli Warga)
              </h2>
              <p className="text-xs text-gray-500">
                Daftar harga komoditas sampah yang diterima Bank Sampah. Harga dapat diperbarui sewaktu-waktu mengikuti pasar daur ulang.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(WASTE_CATEGORIES).map((cat) => (
                <div
                  key={cat.id}
                  className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-[#005596]/30 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                      {cat.nama}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#005596]">
                      Aktif Diterima
                    </span>
                  </div>
                  <div>
                    <div className="text-xl font-black text-[#005596]">
                      {formatRupiah(cat.hargaPerSatuan)}
                      <span className="text-xs font-semibold text-gray-400"> / {cat.satuan}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {cat.deskripsi}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
                    <span>Faktor Pengurang Emisi:</span>
                    <strong className="text-[#005596]">{cat.co2Factor} kg CO₂ / {cat.satuan}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: JADWAL & PANDUAN SETOR ================= */}
        {activeTab === 'jadwal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Jadwal Operasional Pos Penimbangan
              </h2>
              <div className="space-y-3 text-xs text-gray-600">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="font-bold text-gray-900 text-sm">Pos Penimbangan RW 05 (Utama)</div>
                  <p>Hari: Setiap Minggu Pagi (Pukul 08:00 - 11:30 WIB)</p>
                  <p className="text-gray-500">Lokasi: Balai Warga RW 05, Citeureup</p>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                  <div className="font-bold text-gray-900 text-sm">Pos Penimbangan RW 03 (Keliling)</div>
                  <p>Hari: Sabtu Ke-2 & Ke-4 (Pukul 09:00 - 12:00 WIB)</p>
                  <p className="text-gray-500">Lokasi: Lapangan Voli RT 02</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-gray-900">
                Panduan Pemilahan 3R dari Rumah
              </h2>
              <ul className="text-xs text-gray-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span><strong>Pisahkan Kering & Basah:</strong> Jangan mencampur sisa makanan organik dengan sampah anorganik yang bernilai jual.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span><strong>Cuci & Keringkan:</strong> Bilas botol plastik, kaleng susu, atau wadah sirup agar tidak menimbulkan bau atau semut.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-[#005596] flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span><strong>Minyak Jelantah:</strong> Kumpulkan minyak goreng bekas dalam jeriken atau botol bersih tanpa endapan sisa penggorengan.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* ================= TAB 6: PROFIL SAYA ================= */}
        {activeTab === 'profil' && (
          <div className="max-w-2xl mx-auto bg-white rounded-3xl p-7 border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
              <div className="shrink-0">
                <div className="w-20 h-20 rounded-full bg-[#EBF5FB] text-[#005596] flex items-center justify-center overflow-hidden ring-4 ring-sky-50 shadow-md font-bold text-2xl">
                  {activeNasabah.avatarUrl ? (
                    <img
                      src={activeNasabah.avatarUrl}
                      alt={activeNasabah.nama}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    activeNasabah.avatarInitials
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xl font-bold text-gray-900">{activeNasabah.nama}</div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span className="font-mono font-bold text-[#005596]">{activeNasabah.id}</span>
                  <span>•</span>
                  <span>{activeNasabah.unitBankSampah}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Nomor Telepon / WA</span>
                <p className="font-bold text-gray-900">{activeNasabah.noTelepon}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Tanggal Bergabung</span>
                <p className="font-bold text-gray-900">{activeNasabah.tanggalBergabung}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 space-y-1 sm:col-span-2">
                <span className="text-gray-400 text-[10px] uppercase font-bold">Alamat Domisili</span>
                <p className="font-bold text-gray-900">{activeNasabah.alamat}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Data profil & buku tabungan terverifikasi oleh pengurus {activeNasabah.unitBankSampah}</span>
              <span className="font-semibold text-[#005596]">Aktif</span>
            </div>
          </div>
        )}
    </>
  );

  if (hideHeader) {
    return (
      <div id="nasabah-content-wrapper" className="space-y-6 animate-in fade-in duration-200">
        {content}

        {/* Article Reader Modal */}
        <ArticleReaderModal
          article={selectedArticle}
          isOpen={!!selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      </div>
    );
  }

  return (
    <div id="nasabah-desktop-portal" className="min-h-screen bg-[#F4F8FA] text-gray-800 font-sans antialiased flex flex-col">
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {content}
      </main>

      {/* Article Reader Modal */}
      <ArticleReaderModal
        article={selectedArticle}
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </div>
  );
}
