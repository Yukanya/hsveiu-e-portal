'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  EVENT_ITEMS,
  NEWS_POSTS,
} from '@/data/mock-data';
import {
  ChevronRight,
  Leaf,
  MapPin,
} from 'lucide-react';

export default function HomePage() {
  const [newsTab, setNewsTab] = useState<'NEWS' | 'EVENTS'>('NEWS');

  const featuredNews = NEWS_POSTS[0];
  const secondaryNews = NEWS_POSTS.slice(1, 4);

  return (
    <div className="bg-[#F5F5F5]">
      {/* =====================================================================
          PHÂN VÙNG 1: BANNER TĨNH HSV EIU KHÓA II (2026 – 2028)
         ===================================================================== */}
      <section
        aria-label="Tiêu điểm Cổng thông tin HSV EIU"
        className="bg-[#02294E] relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage:
              'radial-gradient(circle at 78% 35%, #A68556 0%, transparent 52%), linear-gradient(125deg, #02294E 0%, #133F68 58%, #0054A6 100%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 eiu-arch-pattern" aria-hidden="true" />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-11 lg:py-15 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Cột Trái (7/12): Khối đa giác nghiêng #C10230 chuẩn EIU */}
          <div className="lg:col-span-7">
            <div
              className="bg-[#C10230]/95 text-white p-7 sm:p-9 shadow-lg"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 91% 100%, 0% 100%)',
              }}
            >
              <h1 className="text-2xl sm:text-[29px] font-extrabold tracking-tight leading-snug font-eiu-display pr-6">
                HỘI SINH VIÊN VIỆT NAM TRƯỜNG ĐẠI HỌC QUỐC TẾ MIỀN ĐÔNG
              </h1>
              <p className="text-sm text-white/95 mt-3 pr-8 leading-relaxed">
                Cổng thông tin Điện tử của Ban Chấp hành Hội Sinh viên trường Đại học Quốc tế Miền Đông.
              </p>
            </div>
          </div>

          {/* Cột Phải (5/12): Khối Biểu trưng EIU × Đại hội II + Khẩu hiệu in nghiêng màu #A68556 căn giữa */}
          <div className="lg:col-span-5">
            <div className="bg-white border-t-4 border-[#A68556] shadow-xl">
              <div className="p-6 sm:p-7 flex items-center justify-center gap-6">
                <Image
                  src="/images/eiu-logo-full.png"
                  alt="Trường Đại học Quốc tế Miền Đông"
                  width={240}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain"
                />
                <div className="h-20 w-px bg-slate-200" aria-hidden="true" />
                <Image
                  src="/images/hsv-bch-dh2.png"
                  alt="Biểu trưng Đại hội II Hội Sinh viên EIU (2026 - 2028)"
                  width={140}
                  height={100}
                  priority
                  className="h-22 sm:h-25 w-auto object-contain"
                />
              </div>
              <div className="bg-[#133F68] text-white px-6 py-3.5 flex items-center justify-center border-t border-slate-100 text-center">
                <span className="text-xs sm:text-sm font-eiu-serif font-extrabold italic text-[#A68556]">
                  Trí sáng - Đồng tâm - Vươn tầm - Cất cánh
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          PHÂN VÙNG 2: TIN TỨC & SỰ KIỆN TRỌNG ĐIỂM
         ===================================================================== */}
      <section aria-labelledby="news-events-heading" className="py-13 bg-[#F5F5F5]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-7">
          <div className="text-center space-y-3">
            <h2
              id="news-events-heading"
              className="text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
            >
              TIN TỨC PHONG TRÀO VÀ LỊCH SỰ KIỆN SINH VIÊN
            </h2>

            {/* Cặp nút Pill Đỏ #C10230 / Trắng viền #133F68 chuẩn eiu.edu.vn */}
            <div
              role="tablist"
              aria-label="Chuyển đổi Tin tức và Sự kiện"
              className="flex items-center justify-center gap-3 pt-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={newsTab === 'NEWS'}
                onClick={() => setNewsTab('NEWS')}
                className={`min-w-36 py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                  newsTab === 'NEWS'
                    ? 'bg-[#C10230] text-white border border-[#C10230]'
                    : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-[#EAE3D2]/30'
                }`}
              >
                TIN TỨC ({NEWS_POSTS.length})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={newsTab === 'EVENTS'}
                onClick={() => setNewsTab('EVENTS')}
                className={`min-w-36 py-2 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C10230] focus-visible:ring-offset-2 ${
                  newsTab === 'EVENTS'
                    ? 'bg-[#C10230] text-white border border-[#C10230]'
                    : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-[#EAE3D2]/30'
                }`}
              >
                SỰ KIỆN ({EVENT_ITEMS.length})
              </button>
            </div>
          </div>

          {newsTab === 'NEWS' ? (
            <div className="space-y-5">
              {/* Bài viết Tiêu điểm 50/50 chuẩn Bento Editorial của eiu.edu.vn */}
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-slate-200/90 shadow-2xs">
                <div className="lg:col-span-5 bg-[#133F68] eiu-arch-pattern text-white p-7 flex flex-col justify-between gap-6 relative">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-[#00BCFF] text-[#02294E] text-[11px] font-bold uppercase tracking-wider font-eiu-display">
                      {featuredNews.categoryLabel}
                    </span>
                    {featuredNews.relatedDocNumber && (
                      <span className="font-eiu-serif text-xs font-bold text-[#FCB900]">
                        {featuredNews.relatedDocNumber}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-eiu-serif uppercase tracking-widest text-[#DED1BE]">
                      TIÊU ĐIỂM NHIỆM KỲ KHÓA II
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold font-eiu-serif text-white">
                      GPA ≥ 3.00 / 4.00
                    </div>
                    <p className="text-xs text-[#DED1BE]">
                      Xét duyệt 3 cấp • Tự động lấy MAX(GPA năm học, GPA tích lũy)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-white/80 pt-3 border-t border-white/15">
                    <span>{featuredNews.authorUnit}</span>
                    <span className="font-eiu-serif text-[#FCB900]">
                      {featuredNews.publishedAt}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 p-7 flex flex-col justify-between gap-5">
                  <div className="space-y-3">
                    <Link
                      href={`/tin-tuc/${featuredNews.slug}`}
                      className="block group"
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug font-eiu-display">
                        {featuredNews.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {featuredNews.summary}
                    </p>
                    {featuredNews.leadQuote && (
                      <blockquote className="border-l-3 border-[#A68556] pl-3.5 text-[13px] italic text-slate-700">
                        &ldquo;{featuredNews.leadQuote}&rdquo;
                      </blockquote>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <Link
                      href={`/tin-tuc/${featuredNews.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0054A6] hover:text-[#C10230] font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0054A6] rounded-xs"
                    >
                      <ChevronRight className="w-4 h-4" />
                      <span>ĐỌC TOÀN VĂN BÀI VIẾT</span>
                    </Link>
                    <span className="text-xs text-slate-500 font-eiu-serif">
                      {featuredNews.viewCount.toLocaleString('vi-VN')} lượt xem •{' '}
                      {featuredNews.readMinutes || 4} phút đọc
                    </span>
                  </div>
                </div>
              </article>

              {/* Lưới 3 Thẻ Tin tức tiếp theo chuẩn post-5065.css (Không lặp tiêu đề!) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {secondaryNews.map((post, idx) => {
                  const headerColors = [
                    'bg-[#144069]',
                    'bg-[#0054A6]',
                    'bg-[#51803A]',
                  ];
                  return (
                    <article
                      key={post.id}
                      className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-colors flex flex-col justify-between group"
                    >
                      {/* Architectural Graphic Header — KHÔNG lặp lại tiêu đề bài viết */}
                      <Link
                        href={`/tin-tuc/${post.slug}`}
                        className={`h-36 ${headerColors[idx % headerColors.length]} eiu-arch-pattern text-white p-5 flex flex-col justify-between`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 bg-[#00BCFF] text-[#02294E] text-[10.5px] font-bold uppercase tracking-wider font-eiu-display">
                            {post.categoryLabel}
                          </span>
                          <Image
                            src="/images/hsv-logo.png"
                            alt=""
                            width={28}
                            height={28}
                            className="w-7 h-7 object-contain opacity-90"
                          />
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-xs text-white/90 font-medium">
                            {post.authorUnit}
                          </span>
                          {post.relatedDocNumber && (
                            <span className="font-eiu-serif text-xs font-bold text-[#FCB900]">
                              {post.relatedDocNumber}
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                        <div className="space-y-2">
                          <Link href={`/tin-tuc/${post.slug}`}>
                            <h3 className="text-[15.5px] font-bold text-[#133F68] group-hover:text-[#C10230] transition-colors leading-snug line-clamp-2 font-eiu-display">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-[13.5px] text-slate-600 leading-relaxed line-clamp-2">
                            {post.summary}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <Link
                            href={`/tin-tuc/${post.slug}`}
                            className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                            <span>XEM CHI TIẾT</span>
                          </Link>
                          <span className="font-eiu-serif text-[#8E6D3E] font-semibold">
                            {post.publishedAt}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Lưới 3 Sự kiện với Trạng thái Vòng đời QĐ 28 chính xác */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {EVENT_ITEMS.slice(0, 3).map((ev) => {
                const startDate = new Date(ev.startTime);
                const dayStr = String(startDate.getDate()).padStart(2, '0');
                const monthStr = `TH${startDate.getMonth() + 1}`;
                const fillPct = Math.min(
                  100,
                  Math.round((ev.registeredCount / ev.maxParticipants) * 100)
                );
                const isOpen = ev.certWorkflowStatus === 'upcoming';

                return (
                  <article
                    key={ev.id}
                    className="bg-white border border-slate-200/90 hover:border-[#133F68] transition-colors flex flex-col justify-between"
                  >
                    <div className="h-38 bg-[#02294E] eiu-arch-pattern text-white p-5 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div className="bg-white text-[#133F68] px-2.5 py-1 text-center leading-tight shrink-0">
                          <div className="text-base font-extrabold font-eiu-serif">
                            {dayStr}
                          </div>
                          <div className="text-[10px] font-bold uppercase text-[#C10230]">
                            {monthStr}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="font-eiu-serif text-xs font-bold px-2 py-0.5 bg-[#FCB900] text-[#02294E]">
                            +{ev.baseVolunteerDays.toFixed(1)} NGÀY TN
                          </span>
                          {ev.isGreenEvent && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 bg-[#51803A] text-white">
                              <Leaf className="w-3 h-3" />
                              <span>Sự kiện Xanh SDGs</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#00BCFF] font-semibold">
                          Tiêu chuẩn: {ev.sv5tCriterion}
                        </span>
                        <span className="text-[#DED1BE] font-eiu-serif text-[11px]">
                          {isOpen ? 'ĐANG MỞ ĐK' : ev.decisionNumber || 'SLA 07 NGÀY'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-[15.5px] font-bold text-[#133F68] leading-snug line-clamp-2 font-eiu-display">
                          {ev.title}
                        </h3>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#A68556] shrink-0" />
                          <span className="line-clamp-1">{ev.location}</span>
                        </p>
                        <div className="space-y-1 pt-1">
                          <div className="flex justify-between text-[11px] text-slate-600 font-eiu-serif">
                            <span>Đăng ký: {ev.registeredCount}/{ev.maxParticipants}</span>
                            <span>{fillPct}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                fillPct >= 100
                                  ? 'bg-[#51803A]'
                                  : fillPct >= 85
                                  ? 'bg-[#EEB31D]'
                                  : 'bg-[#0054A6]'
                              }`}
                              style={{ width: `${fillPct}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <Link
                          href={`/su-kien?event=${encodeURIComponent(ev.id)}`}
                          className="inline-flex items-center gap-1 font-bold uppercase text-[#0054A6] hover:text-[#C10230] font-eiu-display"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                          <span>{isOpen ? 'ĐĂNG KÝ 1-CHẠM' : 'XEM TIẾN ĐỘ GCN'}</span>
                        </Link>
                        <span className="text-slate-500 text-[11px] truncate max-w-[130px]">
                          {ev.organizerCode}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href={newsTab === 'NEWS' ? '/tin-tuc' : '/su-kien'}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133F68] focus-visible:ring-offset-2 rounded-xs"
            >
              <ChevronRight className="w-4 h-4" />
              <span>XEM THÊM</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
