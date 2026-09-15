'use client';

import React from 'react';
import { X, Calendar, Clock, User, Tag, Eye, Share2, BookmarkCheck, CheckCircle2 } from 'lucide-react';
import { EducationArticle } from '@/lib/articlesData';
import { formatDateIndo } from '@/lib/bankSampahData';

interface ArticleReaderModalProps {
  article: EducationArticle | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

export function ArticleReaderModal({
  article,
  isOpen,
  onClose,
  isAdmin = false,
}: ArticleReaderModalProps) {
  if (!isOpen || !article) return null;

  // Simple renderer for markdown-like text (headings, bullet points, bold)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-2" />;
          }
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-base sm:text-lg font-bold text-gray-900 mt-5 mb-2 flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[#005596]" />
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-lg sm:text-xl font-bold text-[#005596] mt-6 mb-2">
                {trimmed.replace('## ', '')}
              </h2>
            );
          }
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const itemText = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2.5 pl-2 my-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#005596] shrink-0 mt-1" />
                <span>{itemText}</span>
              </div>
            );
          }
          if (/^\d+\.\s/.test(trimmed)) {
            const numMatch = trimmed.match(/^(\d+)\.\s(.*)$/);
            if (numMatch) {
              return (
                <div key={idx} className="flex items-start gap-2.5 pl-2 my-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-[#005596] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {numMatch[1]}
                  </span>
                  <div>{numMatch[2]}</div>
                </div>
              );
            }
          }
          return <p key={idx}>{trimmed}</p>;
        })}
      </div>
    );
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Panduan':
        return 'bg-sky-100 text-[#005596] border-sky-200';
      case 'Pengumuman':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Tips Daur Ulang':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Inspirasi':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div
      id="modal-article-reader-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-article-reader"
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-150 relative"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white/95 backdrop-blur-xs sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getCategoryBadgeClass(article.category)}`}>
              {article.category}
            </span>
            {isAdmin && (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${article.isPublished ? 'bg-sky-50 text-[#005596]' : 'bg-amber-50 text-amber-700'}`}>
                {article.isPublished ? 'Terbit untuk Nasabah' : 'Draf (Admin Saja)'}
              </span>
            )}
          </div>

          <button
            id="btn-close-article-reader"
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Tutup Bacaan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6 space-y-6">
          {/* Cover Banner */}
          {article.coverImage && (
            <div className="w-full h-52 sm:h-64 rounded-2xl overflow-hidden shadow-sm relative group bg-gray-100">
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          )}

          {/* Title & Metadata */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-gray-500 pt-1 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-1.5 font-medium text-gray-700">
                <User className="w-3.5 h-3.5 text-[#005596]" />
                <span>{article.author} ({article.authorRole})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>{formatDateIndo(article.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>~{article.readTimeMinutes} menit baca</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-gray-400" />
                <span>{article.viewsCount} kali dibaca</span>
              </div>
            </div>
          </div>

          {/* Lead / Summary Box */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-[#003B6D] text-sm font-medium leading-relaxed">
            {article.summary}
          </div>

          {/* Main Formatted Content */}
          <div className="article-body">
            {renderFormattedContent(article.content)}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-5 border-t border-gray-100 space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Topik Terkait:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {article.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-[#005596] font-semibold">
            <BookmarkCheck className="w-4 h-4" />
            <span>Bank Sampah Unit</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#005596] hover:bg-[#003B6D] text-white font-semibold rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
          >
            Selesai Membaca
          </button>
        </div>
      </div>
    </div>
  );
}
