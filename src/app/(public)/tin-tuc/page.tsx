'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { NEWS_POSTS } from '@/data/mock-data';
import { NewsPost } from '@/types';
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Search,
} from 'lucide-react';

type CategoryFilter = 'ALL' | NewsPost['category'];

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: 'ALL', label: 'Tất cả chuyên mục' },
  { id: 'SINH_VIEN_5_TOT', label: 'Phong trào Sinh viên 5 Tốt' },
  { id: 'TIN_HOAT_DONG', label: 'Tổ chức – Hoạt động Hội' },
  { id: 'TUYEN_TRUYEN', label: 'Tuyên giáo – Bền vững (SDGs)' },
  { id: 'THONG_BAO', label: 'Văn bản – Chỉ đạo' },
];

function TinTucContent({
  initialCategory,
  initialQuery,
}: {
  initialCategory: CategoryFilter;
  initialQuery: string;
}) {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>(initialCategory);
  const [query, setQuery] = useState(initialQuery);

  const filteredPosts = NEWS_POSTS.filter((p) => {
    const matchCat = activeCategory === 'ALL' || p.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.authorUnit.toLowerCase().includes(q) ||
      (p.relatedDocNumber && p.relatedDocNumber.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const leadPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker="BAN TUYÊN GIÁO - PHONG TRÀO HSV EIU"
        title="Tin tức, Điểm tin Phong trào & Thông báo Chính thức"
        subtitle="Cập nhật hoạt động Hội Sinh viên trường, hướng dẫn Sinh viên 5 Tốt, Sự kiện Xanh UN SDGs và các văn bản chỉ đạo Khóa II"
        breadcrumbs={[{ label: 'Tin tức & Điểm tin' }]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8">
        {/* Thanh lọc chuyên mục dạng Pill + Ô tìm kiếm chuẩn post-5065.css */}
        <div className="bg-white border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div
            role="tablist"
            aria-label="Lọc bài viết theo chuyên mục"
            className="flex flex-wrap items-center gap-2"
          >
            {CATEGORY_TABS.map((tab) => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer font-eiu-display ${
                    active
                      ? 'bg-[#C10230] text-white border border-[#C10230]'
                      : 'bg-[#F5F5F5] text-[#133F68] border border-slate-300 hover:border-[#133F68]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm tiêu đề, số văn bản, đơn vị..."
              aria-label="Tìm kiếm bài viết"
              className="w-full h-9 pl-9 pr-3 bg-white border border-slate-300 rounded text-sm text-slate-900"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 p-12 text-center space-y-3">
            <p className="text-base font-bold text-[#133F68] font-eiu-display">
              Không tìm thấy bài viết phù hợp với bộ lọc hiện tại
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('ALL');
                setQuery('');
              }}
              className="px-5 py-2 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Xem tất cả {NEWS_POSTS.length} bài viết
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bài viết Tiêu điểm 50/50 */}
            {leadPost && (
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200 shadow-2xs">
                <Link
                  href={`/tin-tuc/${leadPost.slug}`}
                  className="lg:col-span-5 bg-[#133F68] eiu-arch-pattern text-white p-7 flex flex-col justify-between gap-6 min-h-60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-1 bg-[#00BCFF] text-[#02294E] text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                      {leadPost.categoryLabel}
                    </span>
                    {leadPost.relatedDocNumber && (
                      <span className="px-2 py-0.5 bg-white/15 font-mono text-xs font-bold text-[#FCB900]">
                        {leadPost.relatedDocNumber}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase tracking-widest text-[#DED1BE]">
                      BÀI VIẾT TIÊU ĐIỂM
                    </div>
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/eiu-logo-shorten-white.png"
                        alt="EIU"
                        className="h-8 w-auto object-contain"
                      />
                      <span className="h-6 w-px bg-white/30" aria-hidden="true" />
                      <img
                        src="/images/hsv-logo.png"
                        alt="HSV"
                        className="h-9 w-9 object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#DED1BE] pt-3 border-t border-white/15">
                    <span>{leadPost.authorUnit}</span>
                    <span className="font-mono text-[#FCB900]">
                      {leadPost.publishedAt}
                    </span>
                  </div>
                </Link>

                <div className="lg:col-span-7 p-7 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <Link href={`/tin-tuc/${leadPost.slug}`} className="group block">
                      <h2 className="text-xl sm:text-[22px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug font-eiu-display">
                        {leadPost.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {leadPost.summary}
                    </p>
                    {leadPost.leadQuote && (
                      <blockquote className="border-l-3 border-[#A68556] pl-4 text-[13.5px] italic text-slate-600">
                        &ldquo;{leadPost.leadQuote}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <Link
                      href={`/tin-tuc/${leadPost.slug}`}
                      className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                    >
                      <span>ĐỌC CHI TIẾT BÀI VIẾT</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <div className="flex items-center gap-4 text-slate-500 font-mono">
                      <span className="inline-flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {leadPost.viewCount.toLocaleString('vi-VN')}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {leadPost.readMinutes || 4} phút
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Lưới 3 Cột Góc Vuông 0px chuẩn Tin Tuyển Sinh EIU (post-5065.css) */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridPosts.map((post, idx) => {
                  const palettes = [
                    'bg-[#144069]',
                    'bg-[#0054A6]',
                    'bg-[#51803A]',
                    'bg-[#B44625]',
                    'bg-[#02294E]',
                  ];
                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-slate-200 hover:border-[#133F68] transition-colors flex flex-col justify-between group"
                    >
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        className={`h-38 ${palettes[idx % palettes.length]} eiu-arch-pattern text-white p-5 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                            {post.categoryLabel}
                          </span>
                          {post.relatedDocNumber ? (
                            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#FCB900]">
                              <FileText className="w-3 h-3" />
                              {post.relatedDocNumber}
                            </span>
                          ) : (
                            <img
                              src="/images/hsv-logo.png"
                              alt=""
                              className="w-7 h-7 object-contain opacity-90"
                            />
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/90">
                          <span className="truncate">{post.authorUnit}</span>
                          <span className="font-mono text-[11px] text-[#DED1BE] shrink-0">
                            {post.readMinutes || 3} phút đọc
                          </span>
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <Link href={`/tin-tuc/${post.slug}`}>
                            <h3 className="text-[16px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug line-clamp-2 font-eiu-display">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-3">
                            {post.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <Link
                            href={`/tin-tuc/${post.slug}`}
                            className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>ĐỌC BÀI VIẾT</span>
                          </Link>
                          <span className="inline-flex items-center gap-1 font-mono text-[#A68556] font-semibold">
                            <Calendar className="w-3 h-3" />
                            {post.publishedAt}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TinTucSearchBridge() {
  const searchParams = useSearchParams();
  const rawCat = (searchParams.get('category') as CategoryFilter) || 'ALL';
  const validCat: CategoryFilter = CATEGORY_TABS.some((c) => c.id === rawCat)
    ? rawCat
    : 'ALL';
  const initialQ = searchParams.get('q') || '';

  return (
    <TinTucContent
      key={`${validCat}::${initialQ}`}
      initialCategory={validCat}
      initialQuery={initialQ}
    />
  );
}

export default function TinTucPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải chuyên trang Tin tức HSV EIU...
        </div>
      }
    >
      <TinTucSearchBridge />
    </Suspense>
  );
}
