'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { NEWS_POSTS } from '@/data/mock-data';
import { NewsPost } from '@/types';
import {
  ArrowRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';

export type NewsFilterPillId =
  | 'ALL'
  | 'THIS_MONTH'
  | 'SINH_VIEN_5_TOT'
  | 'CAP_TRUONG'
  | 'CO_SO_HOI';

const FILTER_PILLS: { id: NewsFilterPillId; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'THIS_MONTH', label: 'Tháng này' },
  { id: 'SINH_VIEN_5_TOT', label: 'Phong trào Sinh viên 5 tốt' },
  { id: 'CAP_TRUONG', label: 'Tin tức cấp trường' },
  { id: 'CO_SO_HOI', label: 'Tin cơ sở Hội' },
];

// Section tiêu điểm ngang chiếu 03 tin mới nhất từ pool (tự động chuyển mỗi 5 giây, vòng lặp vô tận)
const FEATURED_SLIDES_COUNT = 3;
const FEATURED_AUTOPLAY_MS = 5000;
// Lưới tin tức hiển thị tất cả các tin, chia mỗi trang 09 tin để tạo bố cục lưới 3x3
const GRID_ITEMS_PER_PAGE = 9;

function formatDateDot(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

function isPostInCurrentMonth(publishedAt?: string): boolean {
  if (!publishedAt) return false;
  // Đối chiếu tháng hiện hành (2026-11) hoặc tháng mới nhất trong tập dữ liệu
  return publishedAt.startsWith('2026-11') || publishedAt.startsWith('2026-10');
}

function getPostLevel(post: NewsPost): 'CAP_TRUONG' | 'CO_SO_HOI' {
  if (post.newsLevel) return post.newsLevel;
  const unit = post.authorUnit.toLowerCase();
  if (
    unit.includes('chi hội') ||
    unit.includes('clb') ||
    unit.includes('câu lạc bộ') ||
    unit.includes('cụm') ||
    unit.includes('đội')
  ) {
    return 'CO_SO_HOI';
  }
  return 'CAP_TRUONG';
}

function matchesFilterPill(post: NewsPost, pillId: NewsFilterPillId): boolean {
  switch (pillId) {
    case 'ALL':
      return true;
    case 'THIS_MONTH':
      return isPostInCurrentMonth(post.publishedAt);
    case 'SINH_VIEN_5_TOT':
      return post.category === 'SINH_VIEN_5_TOT';
    case 'CAP_TRUONG':
      return getPostLevel(post) === 'CAP_TRUONG';
    case 'CO_SO_HOI':
      return getPostLevel(post) === 'CO_SO_HOI';
    default:
      return true;
  }
}

function TinTucContent({
  initialFilter,
  initialQuery,
}: {
  initialFilter: NewsFilterPillId;
  initialQuery: string;
}) {
  const [activeFilter, setActiveFilter] = useState<NewsFilterPillId>(initialFilter);
  const [query, setQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false);

  // State cho section ngang chiếu 3 tin mới nhất
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isFeaturedPaused, setIsFeaturedPaused] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Sắp xếp toàn bộ tin tức từ mới nhất đến cũ nhất
  const sortedAllPosts = [...NEWS_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );

  // 03 tin mới nhất chiếu ở section ngang ngay dưới Hero
  const latestThreePosts = sortedAllPosts.slice(0, FEATURED_SLIDES_COUNT);
  const activeFeaturedPost =
    latestThreePosts[featuredIndex] ?? latestThreePosts[0];

  // Tự động chuyển slide cho 3 tin mới nhất mỗi 5 giây, vòng lặp vô tận (infinite loop)
  useEffect(() => {
    if (latestThreePosts.length <= 1 || isFeaturedPaused) return;
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.matches) return;
    }

    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % latestThreePosts.length);
    }, FEATURED_AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [latestThreePosts.length, isFeaturedPaused]);

  const handleFilterChange = (pillId: NewsFilterPillId) => {
    if (pillId === activeFilter) return;
    setIsFiltering(true);
    setActiveFilter(pillId);
    setCurrentPage(1);
    setTimeout(() => setIsFiltering(false), 180);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    setCurrentPage(1);
  };

  const filteredPosts = sortedAllPosts.filter((p) => {
    const matchPill = matchesFilterPill(p, activeFilter);
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.summary.toLowerCase().includes(q) ||
      p.authorUnit.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      (p.relatedDocNumber && p.relatedDocNumber.toLowerCase().includes(q));
    return matchPill && matchQ;
  });

  // Tính toán phân trang: Mỗi trang hiển thị tối đa 10 tin (gồm 3 tin tiêu điểm ngang + tối đa 7 tin trong lưới)
  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / GRID_ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * GRID_ITEMS_PER_PAGE;
  const paginatedGridPosts = filteredPosts.slice(
    startIdx,
    startIdx + GRID_ITEMS_PER_PAGE
  );

  const handlePrevFeatured = () => {
    setFeaturedIndex(
      (prev) => (prev - 1 + latestThreePosts.length) % latestThreePosts.length
    );
  };

  const handleNextFeatured = () => {
    setFeaturedIndex((prev) => (prev + 1) % latestThreePosts.length);
  };

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      {/* PHÂN VÙNG 1: HERO ĐỒNG BỘ 100% VỚI TRANG CHỦ & ĐƯỜNG DẪN "Tin tức" */}
      <SubpageBanner
        title="TIN TỨC SINH VIÊN"
        subtitle="Cập nhật tin tức chính thống về hoạt động sinh viên của Hội Sinh viên Trường Đại học Quốc tế Miền Đông, các Chi hội và các Câu lạc bộ - Đội - Nhóm đến toàn thể Sinh viên EIU"
        breadcrumbs={[{ label: 'Tin tức' }]}
      />

      {/* PHÂN VÙNG 2: SECTION NGANG CHIẾU 03 TIN MỚI NHẤT (ADAPT THEO MẪU & DESIGN SYSTEM EIU) */}
      {activeFeaturedPost && (
        <section
          aria-label="Tiêu điểm 03 tin tức mới nhất"
          onMouseEnter={() => setIsFeaturedPaused(true)}
          onMouseLeave={() => setIsFeaturedPaused(false)}
          onFocus={() => setIsFeaturedPaused(true)}
          onBlur={() => setIsFeaturedPaused(false)}
          className="bg-[#02294E] relative overflow-hidden border-b-4 border-[#A68556] text-white"
        >
          {/* Ảnh nền sự kiện / sinh viên bên phải kết hợp lớp phủ đa sắc độ chuẩn EIU */}
          {activeFeaturedPost.imageUrl &&
            !failedImages[activeFeaturedPost.id] && (
              <Image
                key={activeFeaturedPost.id}
                src={activeFeaturedPost.imageUrl}
                alt={activeFeaturedPost.title}
                fill
                priority
                sizes="100vw"
                onError={() =>
                  setFailedImages((prev) => ({
                    ...prev,
                    [activeFeaturedPost.id]: true,
                  }))
                }
                className="object-cover object-center opacity-45 scale-102 transition-all duration-700 ease-out"
              />
            )}

          {/* Lớp phủ chuyển sắc từ Xanh Navy đậm bên trái sang trong suốt bên phải để nổi bật chữ và hình ảnh */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(90deg, #02294E 0%, rgba(2, 41, 78, 0.94) 48%, rgba(19, 63, 104, 0.62) 100%), radial-gradient(circle at 85% 20%, rgba(166, 133, 86, 0.28) 0%, transparent 50%)',
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 eiu-arch-pattern opacity-35 pointer-events-none"
            aria-hidden="true"
          />

          {/* Nội dung chính của Slide Tiêu điểm Ngang */}
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 pb-8 sm:pt-14 sm:pb-11 relative z-10">
            <div className="max-w-2xl space-y-4">
              {/* Nhãn TIÊU ĐIỂM màu vàng #FCB900 chuẩn mẫu */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#FCB900] font-eiu-display">
                  TIÊU ĐIỂM
                </span>
                <span className="text-white/35" aria-hidden="true">
                  •
                </span>
                <span className="px-2.5 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                  {activeFeaturedPost.categoryLabel}
                </span>
              </div>

              {/* Tiêu đề bài viết lớn font Serif trang trọng */}
              <Link
                href={`/tin-tuc/${activeFeaturedPost.slug}`}
                className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] rounded-xs"
              >
                <h2 className="font-eiu-serif text-2xl sm:text-3xl lg:text-[36px] font-bold text-white group-hover:text-[#FCB900] transition-colors leading-[1.22] line-clamp-3 break-words">
                  {activeFeaturedPost.title}
                </h2>
              </Link>

              {/* Tóm tắt bài viết */}
              <p className="text-sm sm:text-[15px] text-white/85 leading-relaxed line-clamp-2 break-words font-sans">
                {activeFeaturedPost.summary}
              </p>

              {/* Hàng Ngày đăng • Thời lượng đọc & Nút pill trắng "Đọc bài viết →" */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-[13px] font-eiu-serif text-[#DED1BE]">
                  <span>{formatDateDot(activeFeaturedPost.publishedAt)}</span>
                  <span aria-hidden="true">•</span>
                  <span>{activeFeaturedPost.authorUnit}</span>
                  <span aria-hidden="true">•</span>
                  <span>{activeFeaturedPost.readMinutes || 4} phút đọc</span>
                </div>

                <Link
                  href={`/tin-tuc/${activeFeaturedPost.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#FCB900] text-[#02294E] text-xs font-extrabold uppercase tracking-wider font-eiu-display transition-all duration-200 shadow-md hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900] min-h-[40px]"
                >
                  <span>Đọc bài viết</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Thanh điều hướng Slide đáy (01 / 03 + vạch tiến độ + nút < >) chuẩn mẫu */}
          <div className="border-t border-white/15 bg-[#02294E]/75 backdrop-blur-xs relative z-10">
            <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Bộ đếm 01 / 03 */}
                <span className="font-eiu-serif text-xs sm:text-sm font-bold text-white tracking-wider">
                  {String(featuredIndex + 1).padStart(2, '0')} /{' '}
                  {String(latestThreePosts.length).padStart(2, '0')}
                </span>

                {/* 03 thanh ngang chỉ báo slide */}
                <div
                  className="flex items-center gap-1.5"
                  role="tablist"
                  aria-label="Chọn bài viết tiêu điểm mới nhất"
                >
                  {latestThreePosts.map((item, idx) => {
                    const isSelected = featuredIndex === idx;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        aria-label={`Tin mới ${idx + 1}: ${item.title}`}
                        onClick={() => setFeaturedIndex(idx)}
                        className="py-2 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#FCB900]"
                      >
                        <span
                          className={`block h-1 rounded-full transition-all duration-300 ${
                            isSelected
                              ? 'w-8 bg-[#FCB900]'
                              : 'w-5 bg-white/30 hover:bg-white/60'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Nút chuyển trái / phải */}
                <div className="flex items-center gap-2 pl-1">
                  <button
                    type="button"
                    onClick={handlePrevFeatured}
                    aria-label="Xem tin tiêu điểm trước"
                    className="w-9 h-9 rounded-full border border-white/30 hover:border-[#FCB900] hover:bg-white/10 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextFeatured}
                    aria-label="Xem tin tiêu điểm tiếp theo"
                    className="w-9 h-9 rounded-full border border-white/30 hover:border-[#FCB900] hover:bg-white/10 active:scale-95 text-white flex items-center justify-center transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FCB900]"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PHÂN VÙNG 3: BỘ LỌC PILL, Ô TÌM KIẾM "Tìm" & LƯỚI TIN TỨC PHÂN TRANG */}
      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9 space-y-8">
        {/* Thanh lọc chuyên mục dạng Pill theo đúng thứ tự yêu cầu + Ô tìm kiếm placeholder="Tìm" */}
        <div className="bg-white border border-slate-200/90 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
          <div
            role="tablist"
            aria-label="Lọc bài viết theo nhóm tin tức"
            className="flex flex-wrap items-center gap-2"
          >
            {FILTER_PILLS.map((pill) => {
              const active = activeFilter === pill.id;
              return (
                <button
                  key={pill.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleFilterChange(pill.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer font-eiu-display min-h-[38px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                    active
                      ? 'bg-[#C10230] text-white border border-[#C10230] shadow-xs scale-[1.02]'
                      : 'bg-[#F5F5F5] text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Tìm"
              aria-label="Tìm kiếm bài viết"
              className="w-full h-10 pl-9 pr-9 bg-white border border-slate-300 focus:border-[#133F68] focus:outline-none focus:ring-2 focus:ring-[#133F68]/20 rounded text-sm text-slate-900 placeholder:text-slate-500 transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange('')}
                aria-label="Xóa nội dung tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="bg-white border border-slate-200/90 p-10 sm:p-14 text-center max-w-lg mx-auto shadow-2xs space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#133F68]/10 text-[#133F68] flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-bold text-[#133F68] font-eiu-display">
                Không tìm thấy bài viết phù hợp
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Vui lòng thử tìm kiếm với từ khóa khác hoặc chuyển sang danh mục &ldquo;Tất cả&rdquo;.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                handleFilterChange('ALL');
                setQuery('');
              }}
              className="px-5 py-2.5 bg-[#133F68] hover:bg-[#0054A6] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer min-h-[40px] shadow-2xs font-eiu-display"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Lưới 3 Cột Góc Vuông 0px chuẩn hệ thống (Bố cục lưới 3x3 với 09 tin/trang) */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-200 ease-out motion-reduce:transition-none ${
                isFiltering
                  ? 'opacity-40 translate-y-1'
                  : 'opacity-100 translate-y-0'
              }`}
            >
              {paginatedGridPosts.map((post, idx) => {
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
                    className="bg-white border border-slate-200/90 hover:border-[#133F68] hover:-translate-y-1 hover:shadow-md transition-all duration-300 ease-out flex flex-col justify-between group motion-reduce:hover:translate-y-0"
                  >
                    {/* Header từng tin: Góc trên bên trái là Tag tin tức, Góc trên bên phải là Logo Hội Sinh viên */}
                    <Link
                      href={`/tin-tuc/${post.slug}`}
                      className={`h-38 min-h-[148px] ${palettes[idx % palettes.length]} eiu-arch-pattern text-white p-5 flex flex-col justify-between`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display shadow-2xs">
                          {post.categoryLabel}
                        </span>
                        <Image
                          src="/images/hsv-logo.png"
                          alt="Hội Sinh viên Việt Nam"
                          width={28}
                          height={28}
                          className="w-7 h-7 object-contain opacity-95 shrink-0 drop-shadow-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/90 gap-2">
                        <span className="truncate">{post.authorUnit}</span>
                        <span className="font-eiu-serif text-[11px] text-[#DED1BE] shrink-0">
                          {post.readMinutes || 3} phút đọc
                        </span>
                      </div>
                    </Link>

                    {/* Phần thân và chân thẻ: Căn chỉnh baseline typography hoàn hảo */}
                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <Link href={`/tin-tuc/${post.slug}`} className="block focus-visible:outline-none">
                          <h3 className="text-[16px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug line-clamp-2 break-words font-eiu-display min-h-[44px]">
                            {post.title}
                          </h3>
                        </Link>
                        <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-3 break-words min-h-[63px]">
                          {post.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link
                          href={`/tin-tuc/${post.slug}`}
                          className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display group/link min-h-[36px]"
                        >
                          <ChevronRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                          <span>ĐỌC BÀI VIẾT</span>
                        </Link>
                        <time
                          dateTime={post.publishedAt}
                          className="inline-flex items-center gap-1 font-eiu-serif text-[#8E6D3E] font-semibold"
                        >
                          <Calendar className="w-3 h-3" />
                          <span>{formatDateDot(post.publishedAt)}</span>
                        </time>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* THANH CHUYỂN TRANG Ở DƯỚI (PAGINATION BAR) - CĂN GIỮA, BỎ NỀN TRẮNG BAO NGOÀI & CHỈ GIỮ TRƯỚC 1 2 3 SAU */}
            {totalPages > 1 && (
              <nav
                aria-label="Phân trang danh sách tin tức"
                className="pt-6 pb-2 flex items-center justify-center gap-1.5"
              >
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => {
                    setCurrentPage((p) => Math.max(1, p - 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  aria-label="Trang trước"
                  className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Trước</span>
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => {
                    const isCurrent = pageNum === safePage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          window.scrollTo({ top: 380, behavior: 'smooth' });
                        }}
                        aria-current={isCurrent ? 'page' : undefined}
                        aria-label={`Trang ${pageNum}`}
                        className={`w-10 h-10 text-xs font-bold font-eiu-display transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] ${
                          isCurrent
                            ? 'bg-[#C10230] text-white border border-[#C10230]'
                            : 'bg-white text-[#133F68] border border-slate-300 hover:border-[#133F68] hover:bg-[#EAE3D2]/40'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  }
                )}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => {
                    setCurrentPage((p) => Math.min(totalPages, p + 1));
                    window.scrollTo({ top: 380, behavior: 'smooth' });
                  }}
                  aria-label="Trang tiếp theo"
                  className="h-10 px-4 bg-white border border-slate-300 hover:border-[#133F68] hover:text-[#133F68] disabled:opacity-35 disabled:pointer-events-none text-[#133F68] text-xs font-bold uppercase tracking-wider font-eiu-display inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68]"
                >
                  <span>Sau</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </nav>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TinTucSearchBridge() {
  const searchParams = useSearchParams();
  const rawCat = searchParams.get('category') || 'ALL';
  const validFilter: NewsFilterPillId = FILTER_PILLS.some(
    (c) => c.id === rawCat
  )
    ? (rawCat as NewsFilterPillId)
    : 'ALL';
  const initialQ = searchParams.get('q') || '';

  return (
    <TinTucContent
      key={`${validFilter}::${initialQ}`}
      initialFilter={validFilter}
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
