'use client';

import React, { Suspense, use } from 'react';
import Link from 'next/link';
import { SubpageBanner } from '@/components/public/subpage-banner';
import { NEWS_POSTS, OFFICIAL_DOCUMENTS } from '@/data/mock-data';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  FileCheck2,
  QrCode,
} from 'lucide-react';

function TinTucDetailInner({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
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
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Chuyên trang Tin tức</span>
          </Link>
        </div>
      </div>
    );
  }

  const relatedDoc = article.relatedDocNumber
    ? OFFICIAL_DOCUMENTS.find(
        (d) => d.documentNumber === article.relatedDocNumber
      )
    : undefined;

  const relatedPosts = NEWS_POSTS.filter((p) => p.id !== article.id).slice(0, 4);

  return (
    <div className="bg-[#F5F5F5] min-h-screen pb-16">
      <SubpageBanner
        kicker={article.categoryLabel}
        title={article.title}
        breadcrumbs={[
          { label: 'Tin tức & Điểm tin', href: '/tin-tuc' },
          { label: article.categoryLabel, href: `/tin-tuc?category=${article.category}` },
          { label: 'Chi tiết bài viết' },
        ]}
      />

      <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-9">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* CỘT TRÁI (8/12): Khung Đọc Bài Chuẩn Học Thuật EIU */}
          <article className="lg:col-span-8 bg-white border border-slate-200 p-6 sm:p-9 space-y-6">
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

              <div className="flex items-center gap-4 text-slate-500 font-mono">
                <span className="inline-flex items-center gap-1 text-[#A68556] font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  {article.publishedAt}
                </span>
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
            <p className="text-[15.5px] font-semibold text-slate-900 leading-relaxed">
              {article.summary}
            </p>

            {article.leadQuote && (
              <blockquote className="bg-[#F5F5F5] border-l-4 border-[#A68556] p-4 sm:p-5 text-[14.5px] italic text-[#133F68] leading-relaxed">
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
                    <p key={i}>{para}</p>
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

            {/* Chân bài viết: Điều hướng quay lại & Chia sẻ */}
            <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230] font-eiu-display"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>QUAY LẠI DANH SÁCH TIN TỨC</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href="/su-kien"
                  className="px-4 py-2 bg-[#0054A6] hover:bg-[#133F68] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors font-eiu-display"
                >
                  Đăng ký Sự kiện liên quan
                </Link>
              </div>
            </div>
          </article>

          {/* CỘT PHẢI (4/12): Văn bản Pháp lý Gắn Kèm + Tin Liên Quan */}
          <aside className="lg:col-span-4 space-y-6">
            {relatedDoc && (
              <div className="bg-white border-2 border-[#133F68]">
                <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between font-eiu-display">
                  <span className="inline-flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#FCB900]" />
                    <span>Văn bản Pháp lý Gốc</span>
                  </span>
                  <span className="font-mono text-[#00BCFF]">
                    {relatedDoc.documentNumber}
                  </span>
                </div>
                <div className="p-5 space-y-3 text-xs">
                  <div className="font-bold text-sm text-[#133F68] leading-snug">
                    {relatedDoc.title}
                  </div>
                  <div className="text-slate-600 space-y-1">
                    <div>
                      Ngày ký: <strong className="font-mono">{relatedDoc.signedDate}</strong>
                    </div>
                    <div>
                      Người ký: <strong>{relatedDoc.signerName}</strong> ({relatedDoc.signerTitle})
                    </div>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <Link
                      href={`/van-ban?doc=${encodeURIComponent(relatedDoc.documentNumber)}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#133F68] text-white font-bold uppercase tracking-wider hover:bg-[#0054A6]"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Xem Văn bản</span>
                    </Link>
                    {relatedDoc.documentNumber === '32/QĐ-HSV' && (
                      <Link
                        href="/tra-cuu-gcn?q=32/QĐ-HSV"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#A68556] text-white font-bold uppercase tracking-wider"
                      >
                        <span>Tra cứu Phụ lục 1</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Hộp Đỏ Đô #C10230 Hành động Nhanh chuẩn lib.eiu.edu.vn */}
            <div className="bg-[#C10230] text-white p-6 space-y-3">
              <div className="w-8 h-0.5 bg-white" aria-hidden="true" />
              <h3 className="text-base font-bold font-eiu-display">
                Sổ tay Hội viên &amp; SV5T Số
              </h3>
              <p className="text-[13px] text-white/92 leading-relaxed">
                Đăng nhập bằng tài khoản `@eiu.edu.vn` để tự động tính GPA Quý EIU, làm bài thi Online Quiz và theo dõi E-Certificate cá nhân.
              </p>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-[#FCB900] hover:underline font-eiu-display pt-1"
              >
                <span>MỞ SỔ TAY HỘI VIÊN</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Danh sách Tin tức khác */}
            <div className="bg-white border border-slate-200">
              <div className="bg-[#133F68] text-white px-4 py-3 text-xs font-bold uppercase tracking-wider font-eiu-display">
                Tin tức &amp; Thông báo Khác
              </div>
              <div className="divide-y divide-slate-200">
                {relatedPosts.map((rp) => (
                  <Link
                    key={rp.id}
                    href={`/tin-tuc/${rp.slug}`}
                    className="block p-4 hover:bg-[#F5F5F5] transition-colors group space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0054A6]">
                        {rp.categoryLabel}
                      </span>
                      <span className="font-mono text-[#A68556]">
                        {rp.publishedAt}
                      </span>
                    </div>
                    <div className="text-[13.5px] font-bold text-[#133F68] group-hover:text-[#C10230] leading-snug line-clamp-2">
                      {rp.title}
                    </div>
                  </Link>
                ))}
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
