'use client';

import React, { useState, useEffect } from 'react';
import {
  PlusCircle,
  Search,
  BookOpen,
  Edit3,
  Trash2,
  Eye,
  CheckCircle2,
  Calendar,
  Tag,
  Pin,
  FileText,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Upload,
} from 'lucide-react';
import {
  EducationArticle,
  ARTICLE_CATEGORIES,
  getStoredArticles,
  saveStoredArticles,
} from '@/lib/articlesData';
import { formatDateIndo } from '@/lib/bankSampahData';
import { ArticleReaderModal } from '@/components/ArticleReaderModal';

const PRESET_COVERS = [
  {
    name: 'Pilah Botol Plastik',
    url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Minyak Jelantah & Dapur',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Timbangan & Warga',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Lingkungan Hijau Asri',
    url: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Daur Ulang Kardus & Kertas',
    url: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Emas & Tabungan Berkah',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
  },
];

export function AdminEducationManager() {
  const [articles, setArticles] = useState<EducationArticle[]>(() => getStoredArticles());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Terbit' | 'Draf'>('Semua');

  // Modal states
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<EducationArticle | null>(null);
  const [previewArticle, setPreviewArticle] = useState<EducationArticle | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states for editor
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EducationArticle['category']>('Panduan');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCoverImage, setFormCoverImage] = useState(PRESET_COVERS[0].url);
  const [formAuthor, setFormAuthor] = useState('Admin Bank Sampah UCIDA');
  const [formAuthorRole, setFormAuthorRole] = useState('Pengelola Unit');
  const [formTags, setFormTags] = useState('Sampah, Pemilahan');
  const [formIsPublished, setFormIsPublished] = useState(true);
  const [formIsPinned, setFormIsPinned] = useState(false);
  const [formReadTime, setFormReadTime] = useState(3);

  const persistArticles = (updated: EducationArticle[]) => {
    setArticles(updated);
    saveStoredArticles(updated);
  };

  // Open editor for new article
  const handleOpenNewArticle = () => {
    setEditingArticle(null);
    setFormTitle('');
    setFormCategory('Panduan');
    setFormSummary('');
    setFormContent('');
    setFormCoverImage(PRESET_COVERS[0].url);
    setFormAuthor('Admin Bank Sampah UCIDA');
    setFormAuthorRole('Pengelola Unit');
    setFormTags('Sampah, Pemilahan, Tabungan');
    setFormIsPublished(true);
    setFormIsPinned(false);
    setFormReadTime(3);
    setIsEditorOpen(true);
  };

  // Open editor to edit existing article
  const handleOpenEdit = (art: EducationArticle) => {
    setEditingArticle(art);
    setFormTitle(art.title);
    setFormCategory(art.category);
    setFormSummary(art.summary);
    setFormContent(art.content);
    setFormCoverImage(art.coverImage || PRESET_COVERS[0].url);
    setFormAuthor(art.author);
    setFormAuthorRole(art.authorRole);
    setFormTags(art.tags ? art.tags.join(', ') : '');
    setFormIsPublished(art.isPublished);
    setFormIsPinned(art.isPinned || false);
    setFormReadTime(art.readTimeMinutes || 3);
    setIsEditorOpen(true);
  };

  // Save handler
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const parsedTags = formTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const todayStr = new Date().toISOString().split('T')[0];

    if (editingArticle) {
      // Update
      const updated = articles.map((art) => {
        if (art.id === editingArticle.id) {
          return {
            ...art,
            title: formTitle.trim(),
            category: formCategory,
            summary: formSummary.trim() || formTitle.trim(),
            content: formContent.trim(),
            coverImage: formCoverImage,
            author: formAuthor.trim() || 'Admin Bank Sampah UCIDA',
            authorRole: formAuthorRole.trim() || 'Pengelola Unit',
            tags: parsedTags,
            isPublished: formIsPublished,
            isPinned: formIsPinned,
            readTimeMinutes: Number(formReadTime) || 3,
          };
        }
        return art;
      });
      persistArticles(updated);
    } else {
      // Create new
      const newArticle: EducationArticle = {
        id: `ART-${String(Date.now()).slice(-4)}`,
        title: formTitle.trim(),
        category: formCategory,
        summary: formSummary.trim() || formTitle.trim(),
        content: formContent.trim(),
        coverImage: formCoverImage,
        author: formAuthor.trim() || 'Admin Bank Sampah UCIDA',
        authorRole: formAuthorRole.trim() || 'Pengelola Unit',
        publishedAt: todayStr,
        isPublished: formIsPublished,
        tags: parsedTags,
        readTimeMinutes: Number(formReadTime) || 3,
        viewsCount: 0,
        isPinned: formIsPinned,
      };
      persistArticles([newArticle, ...articles]);
    }

    setIsEditorOpen(false);
  };

  // Delete article
  const handleDeleteArticle = (id: string) => {
    const updated = articles.filter((a) => a.id !== id);
    persistArticles(updated);
    setDeleteConfirmId(null);
  };

  // Toggle publish
  const handleTogglePublish = (id: string) => {
    const updated = articles.map((a) => {
      if (a.id === id) {
        return { ...a, isPublished: !a.isPublished };
      }
      return a;
    });
    persistArticles(updated);
  };

  // Toggle pin
  const handleTogglePin = (id: string) => {
    const updated = articles.map((a) => {
      if (a.id === id) {
        return { ...a, isPinned: !a.isPinned };
      }
      return a;
    });
    persistArticles(updated);
  };

  // Filter articles
  const filteredArticles = articles.filter((art) => {
    const matchSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchCat = selectedCategory === 'Semua' || art.category === selectedCategory;

    const matchStatus =
      statusFilter === 'Semua' ||
      (statusFilter === 'Terbit' && art.isPublished) ||
      (statusFilter === 'Draf' && !art.isPublished);

    return matchSearch && matchCat && matchStatus;
  });

  const publishedCount = articles.filter((a) => a.isPublished).length;
  const draftCount = articles.filter((a) => !a.isPublished).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                Pusat Edukasi & Pengumuman Nasabah
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Kelola, tulis, dan terbitkan artikel edukasi daur ulang, panduan pemilahan, dan pengumuman resmi untuk nasabah.
              </p>
            </div>
          </div>
        </div>

        <button
          id="btn-admin-add-article"
          onClick={handleOpenNewArticle}
          className="px-4 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white font-semibold rounded-2xl text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tulis Artikel / Info Baru</span>
        </button>
      </div>

      {/* Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Tulisan</span>
          <div className="text-2xl font-black text-gray-900 mt-1">{articles.length}</div>
          <span className="text-[11px] text-gray-500">Artikel & Pengumuman</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold text-sky-600 uppercase tracking-wider">Diterbitkan</span>
          <div className="text-2xl font-black text-[#005596] mt-1">{publishedCount}</div>
          <span className="text-[11px] text-[#005596] font-medium">Bisa diakses nasabah</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Draf / Konsep</span>
          <div className="text-2xl font-black text-amber-700 mt-1">{draftCount}</div>
          <span className="text-[11px] text-gray-400">Belum dipublikasi</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Total Pembaca</span>
          <div className="text-2xl font-black text-blue-700 mt-1">
            {articles.reduce((acc, curr) => acc + (curr.viewsCount || 0), 0)}
          </div>
          <span className="text-[11px] text-gray-500">Akumulasi tayangan</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul artikel, topik, atau kata kunci..."
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200/80 rounded-xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:bg-white transition-all"
            />
          </div>

          {/* Status Tab Pill */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl text-xs font-semibold self-start sm:self-auto">
            {(['Semua', 'Terbit', 'Draf'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-[#005596] shadow-xs font-bold'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100">
          <span className="text-xs font-semibold text-gray-400 mr-1">Kategori:</span>
          <button
            onClick={() => setSelectedCategory('Semua')}
            className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'Semua'
                ? 'bg-[#005596] text-white shadow-xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua ({articles.length})
          </button>
          {ARTICLE_CATEGORIES.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#005596] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-gray-800 text-base">Tidak Ada Artikel yang Ditemukan</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Silakan sesuaikan kata kunci pencarian atau buat tulisan edukasi baru untuk para nasabah.
          </p>
          <button
            onClick={handleOpenNewArticle}
            className="mt-2 px-4 py-2 bg-[#005596] hover:bg-[#003B6D] text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Artikel Pertama</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className={`bg-white rounded-3xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
                art.isPinned ? 'border-amber-300 ring-1 ring-amber-200' : 'border-gray-100'
              }`}
            >
              {/* Cover Image & Category Pill */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden group">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Badges on Cover */}
                <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-white/95 text-gray-800 shadow-xs backdrop-blur-xs">
                    {art.category}
                  </span>
                  {art.isPinned && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded-full bg-amber-400 text-amber-950 flex items-center gap-1 shadow-xs">
                      <Pin className="w-3 h-3 fill-current" />
                      <span>Sematkan</span>
                    </span>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => handleTogglePublish(art.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer ${
                      art.isPublished
                        ? 'bg-[#005596] text-white hover:bg-[#003B6D]'
                        : 'bg-amber-500 text-white hover:bg-amber-600'
                    }`}
                    title="Klik untuk mengubah status terbit"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{art.isPublished ? 'Terbit' : 'Draf'}</span>
                  </button>
                </div>

                {/* Bottom of Cover: Read time & Date */}
                <div className="absolute bottom-3 left-3 right-3 text-white text-[11px] flex items-center justify-between font-medium">
                  <span>{formatDateIndo(art.publishedAt)}</span>
                  <span>~{art.readTimeMinutes} mnt baca</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-gray-900 text-base leading-snug line-clamp-2 hover:text-[#005596] transition-colors cursor-pointer"
                    onClick={() => setPreviewArticle(art)}
                  >
                    {art.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                    {art.summary}
                  </p>
                </div>

                {/* Tags */}
                {art.tags && art.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {art.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Bar Footer */}
              <div className="px-5 py-3.5 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewArticle(art)}
                  className="font-semibold text-[#005596] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Tampilan</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTogglePin(art.id)}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      art.isPinned
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-white text-gray-400 hover:text-gray-700 border-gray-200'
                    }`}
                    title={art.isPinned ? 'Lepas Sematan' : 'Sematkan ke Atas'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(art)}
                    className="p-1.5 rounded-lg bg-white hover:bg-sky-50 text-gray-600 hover:text-[#005596] border border-gray-200 transition-colors cursor-pointer"
                    title="Edit Artikel"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(art.id)}
                    className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-gray-400 hover:text-rose-600 border border-gray-200 transition-colors cursor-pointer"
                    title="Hapus Artikel"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL: Editor Tulis / Edit Artikel */}
      {isEditorOpen && (
        <div
          id="modal-article-editor-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
        >
          <div
            id="modal-article-editor"
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-[#005596] flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                    {editingArticle ? 'Edit Artikel / Informasi Edukasi' : 'Tulis Artikel / Panduan Warga Baru'}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Informasi ini akan langsung tampil di menu Edukasi portal seluruh nasabah
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSaveArticle} className="overflow-y-auto flex-1 p-6 space-y-5 text-xs sm:text-sm">
              {/* Judul Artikel */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Judul Tulisan / Pengumuman <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] font-normal text-gray-400">Jelas & menarik perhatian warga</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Penimbangan Rutin RW 05 atau Cara Memilah Botol Plastik"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-gray-900 font-medium"
                />
              </div>

              {/* Kategori & Status Terbit Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Kategori Artikel</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-gray-900 font-medium cursor-pointer"
                  >
                    {ARTICLE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Perkiraan Waktu Baca (Menit)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-gray-900"
                  />
                </div>
              </div>

              {/* Preset Cover Image Selector */}
              <div className="space-y-2">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Pilih Gambar Sampul / Banner</span>
                  <span className="text-[11px] font-normal text-gray-400">Pilih dari galeri foto bertema</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PRESET_COVERS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormCoverImage(preset.url)}
                      className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all group cursor-pointer ${
                        formCoverImage === preset.url
                          ? 'border-[#005596] ring-2 ring-[#005596]/30 scale-102'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      {formCoverImage === preset.url && (
                        <div className="absolute inset-0 bg-[#005596]/40 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Custom Image URL fallback */}
                <div className="pt-1">
                  <input
                    type="url"
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="Atau masukkan tautan URL gambar sampul sendiri (https://...)"
                    className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              {/* Ringkasan Singkat (Summary) */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Ringkasan Singkat (Lead Paragraph)</span>
                  <span className="text-[11px] font-normal text-gray-400">Tampil di kartu depan</span>
                </label>
                <textarea
                  rows={2}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Deskripsikan inti pesan artikel dalam 1-2 kalimat ringkas..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-gray-900"
                />
              </div>

              {/* Isi Lengkap Artikel */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-800 flex items-center justify-between">
                  <span>Isi Lengkap Artikel / Pengumuman <span className="text-rose-500">*</span></span>
                  <span className="text-[11px] font-normal text-gray-400">
                    Mendukung sub-judul (###), poin (-), dan penomoran (1.)
                  </span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={`Tuliskan instruksi atau informasi lengkap di sini...

### 1. Langkah Pertama
Tulis penjelasan langkah pertama secara rinci.

- Poin penting A
- Poin penting B

### 2. Tips Tambahan
Informasi jadwal atau nomor kontak pengurus.`}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/30 focus:outline-none text-gray-900 font-mono text-xs leading-relaxed"
                />
              </div>

              {/* Penulis & Tag */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Nama Penulis / Instansi</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    placeholder="Contoh: Admin Bank Sampah UCIDA"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-gray-800">Tag / Topik (Pisahkan dengan koma)</label>
                  <input
                    type="text"
                    value={formTags}
                    onChange={(e) => setFormTags(e.target.value)}
                    placeholder="Contoh: Plastik, Jadwal, Minyak Jelantah"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                </div>
              </div>

              {/* Status Publikasi & Pinned Checkbox */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPublished}
                    onChange={(e) => setFormIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-[#005596] focus:ring-[#005596]"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-xs">Langsung Terbitkan untuk Nasabah</div>
                    <div className="text-[11px] text-gray-500">Jika tidak dicentang, akan disimpan sebagai Draf admin</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-xs">Sematkan di Bagian Teratas (Pinned)</div>
                    <div className="text-[11px] text-gray-500">Menyorot pengumuman penting</div>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#005596] hover:bg-[#003B6D] text-white font-bold rounded-xl text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingArticle ? 'Simpan Perubahan' : 'Terbitkan Tulisan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reader / Preview Modal */}
      {previewArticle && (
        <ArticleReaderModal
          article={previewArticle}
          isOpen={!!previewArticle}
          onClose={() => setPreviewArticle(null)}
          isAdmin={true}
        />
      )}

      {/* Delete Confirmation Alert Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-bold text-gray-900 text-base">Hapus Artikel Edukasi?</h4>
              <p className="text-xs text-gray-500">
                Artikel ini tidak akan dapat diakses lagi oleh nasabah. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteArticle(deleteConfirmId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
