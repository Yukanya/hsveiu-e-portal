'use client';

import React, { Suspense, use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { NEWS_POSTS } from '@/data/mock-data';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
} from 'lucide-react';

function formatDateDot(dateStr?: string | null): string {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const datePart = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}.${parts[1]}.${parts[0]}`;
  }
  return dateStr;
}

function TinTucDetailInner({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [coverFailed, setCoverFailed] = useState(false);
  const [failedThumbIds, setFailedThumbIds] = useState<Record<string, boolean>>({});
  const article = NEWS_POSTS.find((p) => p.slug === slug);

  if (!article) {
    return (
      <div className="bg-[#F5F5F5] min-h-screen py-16">
        <div className="max-w-[1140px] mx-auto px-4 text-center space-y-4">
          <h1 className="text-2xl font-bold text-[#133F68] font-eiu-display">
            Không tìm thấy bài viết
          </h1>
          <p className="text-sm text-slate-600">
            Đường dẫn bài viết không tồn tại hoặc đã được lưu trữ.
          </p>
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Chuyên trang Tin tức</span>
          </Link>
        </div>
      </div>
    );
  }

  const targetCategoryFilter =
    article.category === 'SINH_VIEN_5_TOT'
      ? 'SINH_VIEN_5_TOT'
      : article.newsLevel === 'CO_SO_HOI'
      ? 'CO_SO_HOI'
      : 'CAP_TRUONG';

  const relatedPosts = NEWS_POSTS.filter((p) => p.id !== article.id).slice(0, 4);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        title={article.title}
        breadcrumbs={[
          { label: 'Tin tức', href: '/tin-tuc' },
          {
            label: article.categoryLabel,
            href: `/tin-tuc?category=${encodeURIComponent(targetCategoryFilter)}`,
          },
          { label: article.title },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (8/12): Khung Đọc Bài Chuẩn Học Thuật EIU */}
          <article className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-9 space-y-6">
            {/* Ảnh bìa bài viết (nếu có) dùng object-top bảo toàn chân dung */}
            {article.imageUrl && !coverFailed && (
              <div className="relative w-full h-56 sm:h-72 bg-[#02294E] border border-slate-200 overflow-hidden">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 760px"
                  onError={() => setCoverFailed(true)}
                  className="object-cover object-top"
                />
              </div>
            )}

            {/* Thanh Metadata bài viết */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-1 bg-[#00BCFF] text-[#02294E] font-bold uppercase tracking-wider font-eiu-display">
                  {article.categoryLabel}
                </span>
                <span className="font-semibold text-[#133F68]">
                  {article.authorUnit}
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-600 font-eiu-serif">
                <time
                  dateTime={article.publishedAt}
                  className="inline-flex items-center gap-1 text-[#8E6D3E] font-semibold"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDateDot(article.publishedAt)}</span>
                </time>
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {article.viewCount.toLocaleString('vi-VN')}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readMinutes || 4} phút đọc
                </span>
              </div>
            </div>

            {/* Sapo / Tóm tắt mở đầu */}
            <p className="text-[15.5px] font-semibold text-slate-900 leading-relaxed max-w-prose">
              {article.summary}
            </p>

            {article.leadQuote && (
              <blockquote className="bg-[#FFFBF5] border border-slate-200 border-t-2 border-t-[#A68556] p-4 sm:p-5 text-[14.5px] italic text-[#133F68] leading-relaxed">
                &ldquo;{article.leadQuote}&rdquo;
              </blockquote>
            )}

            {/* Nội dung chi tiết chia theo các đề mục rõ ràng */}
            <div className="space-y-6 text-[14.5px] text-slate-800 leading-[1.75]">
              {(article.sections || []).map((sec) => (
                <section key={sec.heading} className="space-y-3">
                  <h2 className="text-lg font-bold text-[#133F68] font-eiu-display pt-1">
                    {sec.heading}
                  </h2>
                  {sec.paragraphs.map((para, i) => (
                    <p key={i} className="max-w-prose">
                      {para}
                    </p>
                  ))}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="bg-[#F8FAFC] border border-slate-200 p-4 sm:p-5 space-y-2.5">
                      {sec.bullets.map((b) => (
                        <li
                          key={b}
                          className="flex items-start gap-2.5 text-[13.5px] text-slate-800"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#0054A6] shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Chân bài viết */}
            <div className="pt-6 border-t border-slate-200 flex items-center">
              <Link
                href="/tin-tuc"
                className="min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>QUAY LẠI DANH SÁCH TIN TỨC</span>
              </Link>
            </div>
          </article>

          {/* CỘT PHẢI (4/12): Tin tức và Thông báo Khác */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                Tin tức và Thông báo Khác
              </div>
              <div className="divide-y divide-slate-200">
                {relatedPosts.map((rp) => {
                  const thumbAvailable =
                    Boolean(rp.imageUrl) && !failedThumbIds[rp.id];
                  return (
                    <Link
                      key={rp.id}
                      href={`/tin-tuc/${rp.slug}`}
                      className="block p-4 hover:bg-[#F5F5F5] transition-colors group space-y-2.5"
                    >
                      <div className="relative w-full h-28 bg-[#02294E] overflow-hidden border border-slate-200/80">
                        {thumbAvailable ? (
                          <Image
                            src={rp.imageUrl as string}
                            alt={rp.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 340px"
                            className="object-cover object-top transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
                            onError={() =>
                              setFailedThumbIds((prev) => ({
                                ...prev,
                                [rp.id]: true,
                              }))
                            }
                          />
                        ) : (
                          <div className="w-full h-full eiu-arch-pattern bg-[#02294E] flex items-center justify-center">
                            <Image
                              src="/images/hsv-logo.png"
                              alt={rp.title}
                              width={44}
                              height={44}
                              style={{ width: 'auto' }}
                              className="h-10 w-auto object-contain opacity-90"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[#0054A6]">
                            {rp.categoryLabel}
                          </span>
                          <time
                            dateTime={rp.publishedAt}
                            className="font-eiu-serif text-[#8E6D3E] font-medium"
                          >
                            {formatDateDot(rp.publishedAt)}
                          </time>
                        </div>
                        <div className="text-[13.5px] font-bold text-[#133F68] group-hover:text-[#C10230] leading-snug line-clamp-2">
                          {rp.title}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default function TinTucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1140px] mx-auto px-4 py-16 text-center text-sm text-slate-500">
          Đang tải chi tiết bài viết...
        </div>
      }
    >
      <TinTucDetailInner params={params} />
    </Suspense>
  );
}
