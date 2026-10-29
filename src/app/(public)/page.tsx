'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BRANCH_UNITS,
  CLUB_UNITS,
  EVENT_ITEMS,
  NEWS_POSTS,
  OFFICIAL_DOCUMENTS,
} from '@/data/mock-data';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [newsTab, setNewsTab] = useState<'NEWS' | 'EVENTS'>('NEWS');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="bg-[#F5F5F5]">
      {/* 1. HERO BANNER — Khối Đỏ Đô nghiêng #C10230 + Biểu trưng Đại hội II chuẩn lib.eiu.edu.vn & eiu.edu.vn */}
      <section aria-label="Banner chính" className="bg-[#133F68] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle at 75% 40%, #A68556 0%, transparent 55%), linear-gradient(125deg, #0D2E4D 0%, #133F68 65%, #1E568A 100%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Nửa trái: Khối đa giác nghiêng #C10230 giống hệt lib.eiu.edu.vn */}
          <div className="lg:col-span-7">
            <div
              className="bg-[#C10230]/95 text-white p-8 sm:p-10 max-w-xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0% 100%)',
              }}
            >
              <div className="w-10 h-0.5 bg-white mb-3.5" aria-hidden="true" />
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-eiu-display">
                HỘI SINH VIÊN EIU
              </h1>
              <p className="text-sm sm:text-base text-white/95 mt-2 pr-8 leading-relaxed">
                Cổng thông tin Điện tử, Xét chọn Sinh viên 5 Tốt &amp; Quản trị Cơ sở Hội Khóa II (2026 – 2028).
              </p>
            </div>
          </div>

          {/* Nửa phải: Cụm Logo Trường & Biểu trưng Đại hội II trên nền sáng trang trọng */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="bg-white/95 p-6 sm:p-8 flex items-center gap-6 shadow-md">
              <img
                src="/images/eiu-logo-full.png"
                alt="Trường Đại học Quốc tế Miền Đông"
                className="h-24 sm:h-28 w-auto object-contain"
              />
              <div className="h-20 w-px bg-slate-300" aria-hidden="true" />
              <img
                src="/images/hsv-bch-dh2.png"
                alt="Đại hội II Hội Sinh viên EIU Nhiệm kỳ 2026 - 2028"
                className="h-24 sm:h-28 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Dải thông số 1 dòng chuẩn lib.eiu.edu.vn */}
        <div className="bg-white border-b border-slate-200 text-[11px] text-slate-600 uppercase tracking-wider">
          <div className="max-w-[1140px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 font-eiu-display">
            <span>
              NHIỆM KỲ: <strong className="text-[#0054A6]">KHÓA II (2026 – 2028)</strong>
            </span>
            <span>
              TRỤ SỞ: <strong className="text-[#0054A6]">PHÒNG 206.B06 (08:00 – 16:30)</strong>
            </span>
            <span>
              CHI HỘI: <strong className="text-[#0054A6]">{BRANCH_UNITS.length} ĐƠN VỊ</strong>
            </span>
            <span>
              CLB – ĐỘI – NHÓM: <strong className="text-[#0054A6]">{CLUB_UNITS.length} ĐƠN VỊ</strong>
            </span>
            <span>
              SLA CẤP GCN: <strong className="text-[#0054A6]">≤ 07 NGÀY LÀM VIỆC</strong>
            </span>
          </div>
        </div>
      </section>

      {/* 2. TRA CỨU NHANH & LỐI TẮT VIÊN THUỐC — Giống hệt "Catalogue Search" trên lib.eiu.edu.vn */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-center text-xl sm:text-2xl font-bold text-[#133F68] font-eiu-display">
            Tra Cứu Thông Tin &amp; Giấy Chứng Nhận
          </h2>

          <div className="bg-[#EFEFEF] p-3.5 max-w-4xl mx-auto">
            <form
              action="/tra-cuu-gcn"
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
            >
              <label htmlFor="quick-search-input" className="sr-only">
                Nhập mã số sinh viên, số quyết định hoặc tên CLB
              </label>
              <input
                id="quick-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập Mã số sinh viên (10 số), Số Quyết định (VD: 32/QĐ-HSV) hoặc tên CLB..."
                className="sm:col-span-7 h-10 px-3.5 bg-white border border-slate-300 text-xs text-slate-900 rounded"
              />
              <label htmlFor="quick-search-scope" className="sr-only">
                Phạm vi tra cứu
              </label>
              <select
                id="quick-search-scope"
                className="sm:col-span-3 h-10 px-3 bg-white border border-slate-300 text-xs text-slate-800 rounded"
              >
                <option>Tất cả phân hệ</option>
                <option>E-Certificate (QĐ 28)</option>
                <option>Hồ sơ Sinh viên 5 Tốt</option>
                <option>25 Chi hội &amp; 30 CLB</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-2 h-10 bg-[#A68556] hover:bg-[#8e7046] text-white text-xs font-bold rounded transition-colors cursor-pointer"
              >
                Tra cứu
              </button>
            </form>
          </div>

          {/* Hàng nút viên thuốc viền #133F68 chuẩn lib.eiu.edu.vn */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            {[
              { label: 'Hồ sơ Sinh viên 5 Tốt', href: '/portal' },
              { label: 'Tra cứu E-Certificate', href: '/tra-cuu-gcn' },
              { label: '30 CLB – Đội – Nhóm', href: '/to-chuc' },
              { label: '25 Chi hội (04 Khoa)', href: '/to-chuc?tab=branches' },
              { label: 'Văn bản Khóa II', href: '/van-ban' },
            ].map((pill) => (
              <Link
                key={pill.label}
                href={pill.href}
                className="px-5 py-2 rounded-full border border-[#133F68] text-xs font-semibold text-[#133F68] hover:bg-[#133F68] hover:text-white transition-colors"
              >
                {pill.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. LƯỚI BENTO GIỚI THIỆU & PHÂN HỆ — Góc vuông 0px, Thẻ ghép đôi 50/50 chuẩn eiu.edu.vn */}
      <section aria-label="Phân hệ trọng tâm" className="py-12">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-5">
          {/* Hàng 1: 1 Thẻ ghép đôi 50/50 (6 cột) + 2 Thẻ dọc (3 cột mỗi thẻ) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Thẻ ghép đôi 50/50: Nửa trái nền #133F68 + Nửa phải hình biểu trưng */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 bg-white border border-slate-200/80">
              <div className="bg-[#133F68] text-white p-6 flex flex-col justify-between gap-6">
                <div className="space-y-2.5">
                  <h3 className="text-base font-bold font-eiu-display">
                    Tổ chức Hội Sinh viên EIU
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    Ban Chấp hành (15 đ/c), Ban Thư ký (05 đ/c), Ban Kiểm tra (05 đ/c) và 03 đơn vị chuyên môn trực thuộc.
                  </p>
                </div>
                <Link
                  href="/gioi-thieu"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:text-[#FCB900]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>TÌM HIỂU THÊM</span>
                </Link>
              </div>
              <div className="bg-white p-6 flex items-center justify-center border-l border-slate-100">
                <img
                  src="/images/hsv-bch-dh2.png"
                  alt="Biểu trưng Đại hội II"
                  className="h-40 w-auto object-contain"
                />
              </div>
            </div>

            {/* Thẻ dọc 1: Phát triển bền vững & Sự kiện xanh */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 flex flex-col justify-between">
              <div className="h-36 bg-[#52813B] text-white p-5 flex items-end">
                <span className="text-lg font-extrabold leading-tight font-eiu-display">
                  Tình Nguyện &amp; Sự Kiện Xanh EIU
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-[#133F68]">
                    Quy đổi Ngày tình nguyện
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Áp dụng hệ số 1 – 2 – 3 cho Sinh viên, Cộng tác viên và Ban Tổ chức.
                  </p>
                </div>
                <Link
                  href="/su-kien"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>SỰ KIỆN</span>
                </Link>
              </div>
            </div>

            {/* Thẻ dọc 2: Giấy chứng nhận điện tử */}
            <div className="lg:col-span-3 bg-white border border-slate-200/80 flex flex-col justify-between">
              <div className="h-36 bg-[#0D2E4D] text-white p-5 flex items-center justify-between">
                <span className="text-lg font-extrabold leading-tight font-eiu-display">
                  E-Certificate Chuẩn QR
                </span>
                <img
                  src="/images/hsv-logo.png"
                  alt="HSV"
                  className="h-14 w-14 object-contain"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-[#133F68]">
                    Cấp trong 07 ngày làm việc
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Xác thực trực tuyến theo Quyết định số 28/QĐ-HSV của Ban Thư ký.
                  </p>
                </div>
                <Link
                  href="/tra-cuu-gcn"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>TRA CỨU</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Hàng 2: 4 Thẻ dọc đều nhau (Giống hệt hàng 2 trên eiu.edu.vn) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Văn phòng Hội (206.B06)',
                desc: 'Quản trị hành chính, văn thư lưu trữ, con dấu và tài chính Hội.',
                linkLabel: 'E-OFFICE',
                href: '/workspace#office',
                headerBg: 'bg-[#133F68]',
                code: 'ĐƠN VỊ 01',
              },
              {
                title: 'Ban Tổ chức – Xây dựng Hội',
                desc: 'Phụ trách 04 Cụm Khoa (25 Chi hội) và 30 CLB – Đội – Nhóm.',
                linkLabel: 'ĐƠN VỊ',
                href: '/to-chuc',
                headerBg: 'bg-[#1E568A]',
                code: 'ĐƠN VỊ 02',
              },
              {
                title: 'Ban Tuyên giáo – Phong trào',
                desc: 'Điều phối Mảng Tuyên giáo, Mảng Phong trào và Đội CTV Xung kích.',
                linkLabel: 'PHONG TRÀO',
                href: '/workspace#tgpt',
                headerBg: 'bg-[#A68556]',
                code: 'ĐƠN VỊ 03',
              },
              {
                title: 'Văn bản & Quy chế Khóa II',
                desc: 'Hệ thống Quyết định 09, 23, 24, 28/QĐ-HSV và Thông báo 04/TB-HSV.',
                linkLabel: 'VĂN BẢN',
                href: '/van-ban',
                headerBg: 'bg-[#4E4E50]',
                code: 'PHÁP LÝ',
              },
            ].map((card) => (
              <div
                key={card.title}
                className="bg-white border border-slate-200/80 flex flex-col justify-between"
              >
                <div
                  className={`h-32 ${card.headerBg} text-white p-5 flex flex-col justify-between`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                    {card.code}
                  </span>
                  <span className="text-sm font-bold font-eiu-display">
                    {card.title}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[#133F68]">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <Link
                    href={card.href}
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>{card.linkLabel}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PHONG TRÀO SINH VIÊN 5 TỐT — Bố cục giống hệt mục "TUYỂN SINH" trên eiu.edu.vn */}
      <section aria-labelledby="sv5t-section-title" className="py-10">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-6">
          <h2
            id="sv5t-section-title"
            className="text-center text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
          >
            PHONG TRÀO SINH VIÊN 5 TỐT
          </h2>

          {/* Hàng 1: 2 Thẻ ghép đôi 50/50 (#B44425 Cam đất & #52813B Xanh lá) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 bg-white border border-slate-200/80">
              <div className="bg-[#B44425] text-white p-6 flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold font-eiu-display">
                    Xét chọn Cá nhân SV5T
                  </h3>
                  <p className="text-xs text-white/95 leading-relaxed">
                    Đạo đức (≥80) • Học tập (GPA ≥2.7 + NCKH) • Thể lực • Tình nguyện (≥5 ngày) • Hội nhập (B1 + Kỹ năng).
                  </p>
                </div>
                <Link
                  href="/portal"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:underline"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>TỰ ĐÁNH GIÁ HỒ SƠ</span>
                </Link>
              </div>
              <div className="p-6 flex flex-col justify-center bg-white space-y-2">
                <div className="text-3xl font-extrabold font-mono text-[#B44425]">
                  Top 10%
                </div>
                <div className="text-sm font-bold text-[#133F68]">
                  SV5T Tiêu biểu Toàn trường
                </div>
                <p className="text-xs text-slate-600">
                  Xét chọn tối đa 10% trên tổng số sinh viên đạt danh hiệu cấp Trường.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 bg-white border border-slate-200/80">
              <div className="bg-[#52813B] text-white p-6 flex flex-col justify-between gap-6">
                <div className="space-y-2">
                  <h3 className="text-base font-bold font-eiu-display">
                    Tập thể Sinh viên 5 Tốt
                  </h3>
                  <p className="text-xs text-white/95 leading-relaxed">
                    100% sinh viên đăng ký tham gia, ít nhất 30% sinh viên đạt SV5T cấp Trường và không có vi phạm kỷ luật.
                  </p>
                </div>
                <Link
                  href="/workspace#collective"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:underline"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>BẢNG THEO DÕI 25 CHI HỘI</span>
                </Link>
              </div>
              <div className="p-6 flex flex-col justify-center bg-white space-y-2">
                <div className="text-3xl font-extrabold font-mono text-[#52813B]">
                  25 Chi hội
                </div>
                <div className="text-sm font-bold text-[#133F68]">
                  04 Cụm Khoa &amp; 06 Khóa
                </div>
                <p className="text-xs text-slate-600">
                  QTKD (06) • Kỹ thuật (06) • CNTT (07) • Khoa học Sức khỏe (06).
                </p>
              </div>
            </div>
          </div>

          {/* Hàng 2: Thẻ dọc (3 cột) + Thẻ ghép đôi Charcoal #4E4E50 (6 cột) + Thẻ dọc (3 cột) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#A68556]">
                  HỌC VỤ EIU
                </div>
                <h3 className="text-sm font-bold text-[#133F68]">
                  Máy tính GPA 3 Học kỳ Quý
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tính bình quân gia quyền Học kỳ Thu, Đông, Xuân theo chuẩn thang điểm 4.0 của EIU.
                </p>
              </div>
              <Link
                href="/portal"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>TÍNH ĐIỂM GPA</span>
              </Link>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 bg-white border border-slate-200/80">
              <div className="bg-[#4E4E50] text-white p-6 flex flex-col justify-between gap-5">
                <div className="space-y-2">
                  <h3 className="text-base font-bold font-eiu-display">
                    02 Đơn vị Nòng cốt của Hội
                  </h3>
                  <p className="text-xs text-white/90 leading-relaxed">
                    CLB Cộng đồng Sinh viên 5 tốt và Đội Cộng tác viên Xung kích (trực thuộc Mảng Phong trào).
                  </p>
                </div>
                <Link
                  href="/to-chuc"
                  className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-white hover:text-[#FCB900]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span>DANH BẠ 30 ĐƠN VỊ</span>
                </Link>
              </div>
              <div className="p-6 flex flex-col justify-center bg-white space-y-2">
                <div className="text-sm font-bold text-[#133F68]">
                  Đội CTV Xung kích (Đội CTVXK)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quản lý trực tiếp Tiểu ban Hậu cần – Sân khấu và Tiểu ban Lễ tân – Khánh tiết – Văn thể mỹ.
                </p>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white border border-slate-200/80 p-5 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-[#C10230]">
                  PHỤ LỤC 1 &amp; 3
                </div>
                <h3 className="text-sm font-bold text-[#133F68]">
                  Sinh viên Khỏe &amp; Kỹ năng
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tổ chức kiểm tra thể lực cấp Trường và chuỗi Workshop Kỹ năng thực hành xã hội.
                </p>
              </div>
              <Link
                href="/su-kien"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
              >
                <ChevronRight className="w-3.5 h-3.5" />
                <span>ĐĂNG KÝ</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TIN TỨC & SỰ KIỆN — Nút chuyển Tab viên thuốc Đỏ #C10230 / Trắng chuẩn eiu.edu.vn */}
      <section aria-labelledby="news-events-heading" className="py-12">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-6">
          <h2
            id="news-events-heading"
            className="text-center text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
          >
            TIN TỨC &amp; SỰ KIỆN
          </h2>

          {/* Cặp nút Pill Đỏ #C10230 / Trắng viền #133F68 giống hệt eiu.edu.vn & lib.eiu.edu.vn */}
          <div
            role="tablist"
            aria-label="Chuyển đổi Tin tức và Sự kiện"
            className="flex items-center justify-center gap-3"
          >
            <button
              type="button"
              role="tab"
              aria-selected={newsTab === 'NEWS'}
              onClick={() => setNewsTab('NEWS')}
              className={`min-w-28 py-1.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                newsTab === 'NEWS'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-slate-100'
              }`}
            >
              TIN TỨC
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={newsTab === 'EVENTS'}
              onClick={() => setNewsTab('EVENTS')}
              className={`min-w-28 py-1.5 px-6 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                newsTab === 'EVENTS'
                  ? 'bg-[#C10230] text-white border border-[#C10230]'
                  : 'bg-white text-[#133F68] border border-[#133F68] hover:bg-slate-100'
              }`}
            >
              SỰ KIỆN
            </button>
          </div>

          {newsTab === 'NEWS' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {NEWS_POSTS.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200/80 flex flex-col justify-between"
                >
                  <div className="h-44 bg-[#133F68] text-white p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <img
                        src="/images/eiu-logo-shorten-white.png"
                        alt="EIU"
                        className="h-6 w-auto object-contain"
                      />
                      <img
                        src="/images/hsv-logo.png"
                        alt="HSV"
                        className="h-7 w-7 object-contain"
                      />
                    </div>
                    <div className="text-xs font-bold text-[#DED1BE] uppercase">
                      {post.categoryLabel}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-[#133F68] leading-snug line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {post.summary}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#0054A6] uppercase">
                        TIN HOẠT ĐỘNG
                      </span>
                      <span className="font-mono text-[#A68556]">
                        {post.publishedAt}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {EVENT_ITEMS.slice(0, 3).map((ev) => (
                <article
                  key={ev.id}
                  className="bg-white border border-slate-200/80 flex flex-col justify-between"
                >
                  <div className="h-44 bg-[#0D2E4D] text-white p-5 flex flex-col justify-between">
                    <span className="text-xs font-mono font-bold text-[#FCB900]">
                      +{ev.baseVolunteerDays.toFixed(1)} NGÀY TÌNH NGUYỆN
                    </span>
                    <div className="text-sm font-bold text-white leading-snug">
                      {ev.organizerUnit}
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-bold text-[#133F68] leading-snug line-clamp-2">
                        {ev.title}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Địa điểm: {ev.location}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <Link
                        href="/su-kien"
                        className="font-bold text-[#0054A6] uppercase hover:underline"
                      >
                        ĐĂNG KÝ THAM GIA
                      </Link>
                      <span className="font-mono text-[#A68556]">
                        {new Date(ev.startTime).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex justify-end">
            <Link
              href={newsTab === 'NEWS' ? '/van-ban' : '/su-kien'}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase text-slate-700 hover:text-[#133F68]"
            >
              <ChevronRight className="w-3.5 h-3.5" />
              <span>XEM DANH SÁCH ({OFFICIAL_DOCUMENTS.length + EVENT_ITEMS.length})</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TÌM HIỂU THÊM VỀ HỆ SINH THÁI HSV EIU — 4 cột chuẩn đáy trang chủ eiu.edu.vn */}
      <section aria-labelledby="explore-more-heading" className="pb-16 pt-4">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-6">
          <h2
            id="explore-more-heading"
            className="text-center text-xl sm:text-2xl font-bold uppercase tracking-wide text-[#133F68] font-eiu-display"
          >
            TÌM HIỂU THÊM VỀ HỘI SINH VIÊN EIU
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Đội ngũ Cán bộ Hội',
                desc: 'Danh sách 20 đồng chí Ban Chấp hành, Ban Kiểm tra và các Ban chuyên môn.',
                cta: 'KHÁM PHÁ',
                href: '/gioi-thieu',
                bg: 'bg-[#133F68]',
              },
              {
                title: '30 CLB – Đội – Nhóm',
                desc: '04 khối Học thuật, Nghệ thuật, Thể thao và Cộng đồng – Tình nguyện.',
                cta: 'KHÁM PHÁ',
                href: '/to-chuc',
                bg: 'bg-[#A68556]',
              },
              {
                title: '25 Chi hội Sinh viên',
                desc: 'Mạng lưới Chi hội trực thuộc 04 Cụm Khoa từ Khóa 2021 đến Khóa 2026.',
                cta: 'KẾT NỐI',
                href: '/to-chuc?tab=branches',
                bg: 'bg-[#52813B]',
              },
              {
                title: 'E-Office Nội bộ',
                desc: 'Không gian điều hành dành cho Thường trực, các Ban chuyên môn và Chi hội.',
                cta: 'TRUY CẬP',
                href: '/workspace',
                bg: 'bg-[#C10230]',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 flex flex-col justify-between"
              >
                <div
                  className={`h-28 ${item.bg} text-white p-5 flex items-end font-bold text-sm font-eiu-display`}
                >
                  {item.title}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-[#133F68]">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#133F68] hover:text-[#C10230]"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span>{item.cta}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
